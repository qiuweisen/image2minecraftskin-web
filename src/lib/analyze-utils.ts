// Shared types and utilities for AI analysis
// These are NOT server actions, they can be used by both client and server

// TypeScript type for AI analysis response
export interface AnalysisResult {
  personality: {
    type: 'wolf' | 'lion' | 'turtle' | 'rabbit' | 'eagle' | 'sheep';
    emoji: string;
    name: string;
    description: string;
  };
  score: number;
  rank: {
    stars: number;
    title: string;
  };
  superpower: string;
  weakness: string;
  keyStats: string;
  badges: { emoji: string; name: string }[];
  tagline: string;
  comparison: string;
  riskAssessment: string;
  tradingStyle: string;
  analysis: {
    strengths: string;
    weaknesses: string;
    actionItem: string;
  };
  improvementPlan?: string[];
  toolTip?: string;
  // UI labels in target language
  labels: {
    superpower: string; // "Superpower" / "超能力"
    weakness: string; // "Weakness" / "弱点"
    keyStats: string; // "Key Stats" / "关键数据"
    badges: string; // "Badges" / "成就"
    tradingStyle: string; // "Trading Style" / "交易风格"
    riskAssessment: string; // "Risk Assessment" / "风险评估"
    strengths: string; // "What You Did Well" / "做得好的地方"
    weaknesses: string; // "Needs Improvement" / "需要改进"
    actionItem: string; // "Action Item" / "行动建议"
    improvementPlan: string; // "Improvement Roadmap" / "改进路线图"
  };
}

/**
 * Prepare the analysis prompt (data processing + prompt generation)
 * Used by both server action and streaming API route
 */
export function prepareAnalysisPrompt(
  trades: any[],
  stats: any,
  lang: string = 'en'
): { systemMessage: string; prompt: string; error?: string } {
  if (!trades || trades.length === 0) {
    const errorMsg = lang.startsWith('zh')
      ? '本次会话没有交易记录。'
      : 'No trades executed in this session.';
    return { systemMessage: '', prompt: '', error: errorMsg };
  }

  // ========== Data Cleaning: Smart Buy/Sell Pairing ==========
  const pairedTrades: {
    buyPrice: number;
    sellPrice: number;
    qty: number;
    pnl: number;
    pnlPct: number;
    buyTime: string;
    sellTime: string;
    holdingDays: number;
    buyTrend?: 'up' | 'down' | 'sideways';
    buyPricePosition?: number;
    buyOpen?: number;
    buyPrevClose?: number;
    gapPct?: number;
  }[] = [];

  // Sort by time and pair trades (supports both long and short positions)
  const sortedTrades = [...trades].sort(
    (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
  );
  const buyQueue: any[] = [];
  const sellQueue: any[] = []; // For short positions

  for (const trade of sortedTrades) {
    const side = trade.side?.toLowerCase();
    if (side === 'buy') {
      // Check if this is closing a short position
      if (sellQueue.length > 0) {
        const matchSell = sellQueue.shift();
        const qty = matchSell.qty;
        const pnl = (matchSell.price - trade.price) * qty; // Short P&L
        const pnlPct =
          ((matchSell.price - trade.price) / matchSell.price) * 100;
        const holdingMs =
          new Date(trade.time).getTime() - new Date(matchSell.time).getTime();
        const holdingDays = Math.max(0, holdingMs / (1000 * 60 * 60 * 24));

        pairedTrades.push({
          buyPrice: trade.price,
          sellPrice: matchSell.price,
          qty,
          pnl,
          pnlPct,
          buyTime: trade.time,
          sellTime: matchSell.time,
          holdingDays,
          buyTrend: matchSell.trendDirection,
          buyPricePosition: matchSell.priceVsLow20,
          buyOpen: matchSell.open,
          buyPrevClose: matchSell.prevClose,
          gapPct:
            matchSell.prevClose && matchSell.open
              ? ((matchSell.open - matchSell.prevClose) / matchSell.prevClose) *
                100
              : undefined,
        });
      } else {
        buyQueue.push(trade);
      }
    } else if (side === 'sell') {
      // Check if this is closing a long position
      if (buyQueue.length > 0) {
        const matchBuy = buyQueue.shift();
        const qty = matchBuy.qty;
        const pnl = (trade.price - matchBuy.price) * qty;
        const pnlPct = ((trade.price - matchBuy.price) / matchBuy.price) * 100;
        const holdingMs =
          new Date(trade.time).getTime() - new Date(matchBuy.time).getTime();
        const holdingDays = Math.max(0, holdingMs / (1000 * 60 * 60 * 24));
        const gapPct =
          matchBuy.prevClose && matchBuy.open
            ? ((matchBuy.open - matchBuy.prevClose) / matchBuy.prevClose) * 100
            : undefined;

        pairedTrades.push({
          buyPrice: matchBuy.price,
          sellPrice: trade.price,
          qty,
          pnl,
          pnlPct,
          buyTime: matchBuy.time,
          sellTime: trade.time,
          holdingDays,
          buyTrend: matchBuy.trendDirection,
          buyPricePosition: matchBuy.priceVsLow20,
          buyOpen: matchBuy.open,
          buyPrevClose: matchBuy.prevClose,
          gapPct,
        });
      } else {
        sellQueue.push(trade); // Opening short position
      }
    }
  }

  console.log(
    `[AI Analysis] Trades: ${trades.length}, Paired: ${pairedTrades.length}, Unpaired Buy: ${buyQueue.length}, Unpaired Sell: ${sellQueue.length}`
  );

  // ========== Calculate Statistics ==========
  const wins = pairedTrades.filter((t) => t.pnl > 0);
  const losses = pairedTrades.filter((t) => t.pnl < 0);
  const totalTrades = pairedTrades.length;

  const rawTotalReturn = Number(stats.pnlPct);
  const totalReturn = Number.isFinite(rawTotalReturn) ? rawTotalReturn : 0;
  const rawRealizedPnl = Number(stats.pnlReal);
  const realizedPnl = Number.isFinite(rawRealizedPnl) ? rawRealizedPnl : 0;
  const unpairedTradeCount = buyQueue.length + sellQueue.length;

  const winRate = totalTrades > 0 ? wins.length / totalTrades : 0;
  const avgWin =
    wins.length > 0 ? wins.reduce((s, t) => s + t.pnl, 0) / wins.length : 0;
  const avgLoss =
    losses.length > 0
      ? Math.abs(losses.reduce((s, t) => s + t.pnl, 0) / losses.length)
      : 0;
  const maxLossPct =
    losses.length > 0 ? Math.min(...losses.map((t) => t.pnlPct)) : 0;
  const expectancy = winRate * avgWin - (1 - winRate) * avgLoss;
  const winLossRatio = avgLoss > 0 ? avgWin / avgLoss : 0;
  // Format ratio as "X:1" for consistency with industry standard
  const winLossRatioFormatted =
    winLossRatio > 0 ? `${winLossRatio.toFixed(2)}:1` : '0.00:1';

  const avgWinHoldingDays =
    wins.length > 0
      ? wins.reduce((s, t) => s + t.holdingDays, 0) / wins.length
      : 0;
  const avgLossHoldingDays =
    losses.length > 0
      ? losses.reduce((s, t) => s + t.holdingDays, 0) / losses.length
      : 0;
  const avgHoldingDays =
    totalTrades > 0
      ? pairedTrades.reduce((s, t) => s + t.holdingDays, 0) / totalTrades
      : 0;

  // Debug: log key stats
  console.log(
    `[AI Analysis] WinRate: ${(winRate * 100).toFixed(1)}%, P/L Ratio: ${winLossRatioFormatted}, Avg Holding: ${avgHoldingDays.toFixed(1)} days, Return: ${(totalReturn * 100).toFixed(2)}%`
  );

  // Streak calculation
  let maxWinStreak = 0,
    tempWinStreak = 0;
  for (const trade of pairedTrades) {
    if (trade.pnl > 0) {
      tempWinStreak++;
      if (tempWinStreak > maxWinStreak) maxWinStreak = tempWinStreak;
    } else {
      tempWinStreak = 0;
    }
  }

  const strictStopLoss =
    totalTrades > 0 && losses.every((t) => Math.abs(t.pnlPct) < 5);
  const stopLossDiscipline =
    totalTrades === 0
      ? 'Not assessable (no closed trades)'
      : losses.length === 0
        ? 'No closed losses'
        : strictStopLoss
          ? 'Strict (all losses <5%)'
          : 'Loose';
  const diamondHandTrades = wins.filter((t) => t.holdingDays >= 20);
  const avgBuyPosition =
    pairedTrades.filter((t) => t.buyPricePosition !== undefined).length > 0
      ? pairedTrades
          .filter((t) => t.buyPricePosition !== undefined)
          .reduce((s, t) => s + (t.buyPricePosition || 0), 0) /
        pairedTrades.filter((t) => t.buyPricePosition !== undefined).length
      : 50;

  // Give the model compact trade-level evidence without sending the full raw
  // event list. For long sessions, keep the beginning and end of the sample.
  const promptPairs =
    pairedTrades.length > 100
      ? [...pairedTrades.slice(0, 50), ...pairedTrades.slice(-50)]
      : pairedTrades;
  const tradeObservations = JSON.stringify(
    promptPairs.map((trade, index) => ({
      n: index + 1,
      pnl: Number(trade.pnl.toFixed(2)),
      pnlPct: Number(trade.pnlPct.toFixed(2)),
      holdDays: Number(trade.holdingDays.toFixed(1)),
      trend: trade.buyTrend ?? 'unknown',
      entryPosition: trade.buyPricePosition ?? null,
      gapPct: trade.gapPct == null ? null : Number(trade.gapPct.toFixed(2)),
    }))
  );

  // ========== Language Support ==========
  const langNames: Record<string, string> = {
    en: 'English',
    zh: 'Simplified Chinese',
    'zh-Hans': 'Simplified Chinese',
    'zh-Hant': 'Traditional Chinese',
    'zh-TW': 'Traditional Chinese',
    'zh-HK': 'Traditional Chinese',
    ja: 'Japanese',
    ko: 'Korean',
    es: 'Spanish',
    fr: 'French',
    de: 'German',
    pt: 'Portuguese',
    it: 'Italian',
    ru: 'Russian',
    ar: 'Arabic',
    hi: 'Hindi',
    th: 'Thai',
    vi: 'Vietnamese',
    id: 'Indonesian',
    ms: 'Malay',
    tr: 'Turkish',
    pl: 'Polish',
    nl: 'Dutch',
    sv: 'Swedish',
    da: 'Danish',
    no: 'Norwegian',
    fi: 'Finnish',
    cs: 'Czech',
    el: 'Greek',
    he: 'Hebrew',
    hu: 'Hungarian',
    ro: 'Romanian',
    uk: 'Ukrainian',
    bg: 'Bulgarian',
    hr: 'Croatian',
    sk: 'Slovak',
    sl: 'Slovenian',
    sr: 'Serbian',
    lt: 'Lithuanian',
    lv: 'Latvian',
    et: 'Estonian',
    fil: 'Filipino',
    bn: 'Bengali',
  };

  // Check for full language code first (e.g., zh-Hant), then try base code (e.g., zh)
  const langName = langNames[lang] || langNames[lang.split('-')[0]] || lang;

  // ========== JSON PROMPT ==========
  const prompt = `You are ChartMini's post-session trading coach.

## Task
Analyze only this completed simulated-trading session. The calculated metrics below are authoritative; do not invent missing data or recalculate them with different definitions. Explain the user's process, not future market direction.

## Output contract
- Return exactly one JSON object. No Markdown fences, preamble, comments, or trailing text.
- Every human-readable value, including names, titles, badges, and labels, must be written only in ${langName}.
- Use the exact keys and value types in the structure below. Do not add keys.
- Keep the text concise and specific. Do not force awkward character counts in languages where they do not fit.
- Do not give buy/sell instructions, price targets, guaranteed returns, or personalized financial advice. Give practice and risk-management suggestions only.
- Do not include external links or platform recommendations.

## Required JSON shape
{
  "personality": {
    "type": "wolf|lion|turtle|rabbit|eagle|sheep",
    "emoji": "one matching emoji",
    "name": "localized personality name",
    "description": "short localized description"
  },
  "score": 0,
  "rank": { "stars": 1, "title": "localized rank title" },
  "superpower": "one concise strength",
  "weakness": "one concise weakness",
  "keyStats": "localized Win Rate | P/L Ratio | Expectancy summary",
  "badges": [{ "emoji": "🏆", "name": "localized badge name" }],
  "tagline": "short localized tagline",
  "comparison": "brief comparison with general trading-practice standards, without made-up percentiles",
  "riskAssessment": "concise risk assessment",
  "tradingStyle": "concise trading-style summary",
  "analysis": {
    "strengths": "specific strengths supported by the metrics",
    "weaknesses": "specific weaknesses supported by the metrics",
    "actionItem": "one concrete next practice action"
  },
  "improvementPlan": ["step 1", "step 2", "step 3"],
  "labels": {
    "superpower": "localized Superpower",
    "weakness": "localized Weakness",
    "keyStats": "localized Key Stats",
    "badges": "localized Achievements",
    "tradingStyle": "localized Trading Style",
    "riskAssessment": "localized Risk Assessment",
    "strengths": "localized What You Did Well",
    "weaknesses": "localized Needs Improvement",
    "actionItem": "localized Action Item",
    "improvementPlan": "localized Improvement Roadmap"
  }
}

## Interpretation rules
1. Count only closed paired trades in win rate, P/L ratio, expectancy, streaks, and badges. Never treat an unpaired/open event as a win or loss.
2. If closed trades are fewer than 3, state that the sample is too small to establish a reliable edge; keep the score conservative and do not overstate skill.
3. Apply personality rules in this order: severe loss (lion), patient profitable trader (turtle), precise profitable low-frequency trader (eagle), strategic profitable trader (wolf), profitable short-horizon trader (rabbit), otherwise sheep.
4. If Total Return is negative, personality must be sheep or lion. Rabbit, wolf, turtle, and eagle require Total Return > 0%.
5. Lion applies when Max Single Loss >10% OR Total Return <= -20%. Sheep is the default for insufficient evidence or no clear edge.
6. Calculate the score from Return 25%, Win Rate 20%, P/L Ratio 20%, Expectancy 20%, and Risk Control 15%. Score is an integer from 0 to 100.
7. Hard score caps: Total Return <= -20% => max 29; Total Return <= -10% => max 39; Total Return < 0% => max 54; Win Rate <35% => max 49. Apply all relevant caps after the weighted score.
8. Award a badge only when every condition is met. If there are no closed trades, return an empty badges array. Losing sessions may receive only Capital Guardian.
9. Treat the compact trade observations as supporting evidence; the aggregate metrics are authoritative. If data conflicts, use the aggregate metrics.

## Badge rules
- Cold-Blooded: every loss is below 5% and Total Return >= 0%.
- Diamond Hands: at least one profitable trade was held for 20+ days and Total Return > 0%.
- Sharpshooter: at least 3 consecutive wins and Win Rate > 50%.
- Streak Master: maximum win streak >= 5 and Total Return > 0%.
- Capital Guardian: no loss exceeded 10%.

## Session metrics
- Raw trade events: ${trades.length}
- Closed paired trades used for metrics: ${totalTrades}
- Unpaired/open trade events excluded: ${unpairedTradeCount}
- Win Rate: ${(winRate * 100).toFixed(1)}%
- P/L Ratio: ${winLossRatioFormatted}
- Expectancy: $${expectancy.toFixed(2)} per closed trade
- Realized P&L: $${realizedPnl.toFixed(2)}
- Max Single Loss: ${Math.abs(maxLossPct).toFixed(1)}%
- Maximum Win Streak: ${maxWinStreak}
- Average Holding Time: ${avgHoldingDays.toFixed(1)} days
- Average Winning Hold: ${avgWinHoldingDays.toFixed(1)} days
- Average Losing Hold: ${avgLossHoldingDays.toFixed(1)} days
- Stop-Loss Discipline: ${stopLossDiscipline}
- 20+ Day Profitable Trades: ${diamondHandTrades.length}
- Average Entry Position: ${avgBuyPosition.toFixed(0)}% of the recent 20-bar range (0=low, 100=high)
- Total Return: ${(totalReturn * 100).toFixed(2)}% (final equity, including any open position)

## Compact closed-trade observations
The following JSON array contains up to 100 closed pairs (the first 50 and last 50 for longer sessions). Fields are: pnl, pnlPct, holdDays, trend, entryPosition, gapPct.
${tradeObservations}

Output the JSON object now, in ${langName} only.`;

  const systemMessage = `You are ChartMini's deterministic JSON analysis service. Return exactly one valid JSON object matching the requested keys. Never invent metrics, never output Markdown, and write all human-readable text only in ${langName}.`;

  return { systemMessage, prompt };
}

/**
 * Parse streaming or complete response into AnalysisResult
 */
export function parseAnalysisResponse(response: string): {
  analysis: AnalysisResult | string;
  parseError: boolean;
} {
  try {
    let jsonStr = response.trim();

    console.log('[AI Analysis] Raw response length:', jsonStr.length);
    console.log(
      '[AI Analysis] Raw response preview:',
      jsonStr.substring(0, 200)
    );

    if (!jsonStr) {
      console.error('[AI Analysis] Empty response received');
      return { analysis: '', parseError: true };
    }

    // Remove markdown code blocks (various formats)
    if (jsonStr.startsWith('```json')) jsonStr = jsonStr.slice(7);
    else if (jsonStr.startsWith('```JSON')) jsonStr = jsonStr.slice(7);
    else if (jsonStr.startsWith('```')) jsonStr = jsonStr.slice(3);
    if (jsonStr.endsWith('```')) jsonStr = jsonStr.slice(0, -3);
    jsonStr = jsonStr.trim();

    // Try to extract JSON object if there's extra text before/after
    const jsonStart = jsonStr.indexOf('{');
    const jsonEnd = jsonStr.lastIndexOf('}');
    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      jsonStr = jsonStr.substring(jsonStart, jsonEnd + 1);
    }

    if (!jsonStr) {
      console.error('[AI Analysis] JSON candidate is empty after cleanup');
      return { analysis: response, parseError: true };
    }

    const parsed = JSON.parse(jsonStr) as AnalysisResult;
    console.log('[AI Analysis] JSON parsed successfully');
    return { analysis: parsed, parseError: false };
  } catch (e) {
    console.error('[AI Analysis] JSON parse error:', e);
    console.error(
      '[AI Analysis] Failed response (first 500 chars):',
      response.substring(0, 500)
    );
    return { analysis: response, parseError: true };
  }
}
