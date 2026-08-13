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
    `[AI Analysis] WinRate: ${(winRate * 100).toFixed(1)}%, P/L Ratio: ${winLossRatioFormatted}, Avg Holding: ${avgHoldingDays.toFixed(1)} days, Return: ${(stats.pnlPct * 100).toFixed(2)}%`
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

  const strictStopLoss = losses.every((t) => Math.abs(t.pnlPct) < 5);
  const diamondHandTrades = wins.filter((t) => t.holdingDays >= 20);
  const avgBuyPosition =
    pairedTrades.filter((t) => t.buyPricePosition !== undefined).length > 0
      ? pairedTrades
          .filter((t) => t.buyPricePosition !== undefined)
          .reduce((s, t) => s + (t.buyPricePosition || 0), 0) /
        pairedTrades.filter((t) => t.buyPricePosition !== undefined).length
      : 50;

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
  const prompt = `[CRITICAL] You are ChartMini's trading analyst. Output in ${langName} ONLY!

# OUTPUT REQUIREMENTS
- Valid JSON format only
- ALL text content MUST be in ${langName} language
- Use ONLY ${langName}, no other languages
- IMPORTANT: Translate ALL labels, titles, and names to ${langName}, including badges and rank titles!

## JSON Structure (fill with detailed content in ${langName}!)

{
  "personality": {
    "type": "wolf|lion|turtle|rabbit|eagle|sheep",
    "emoji": "corresponding emoji",
    "name": "personality name in ${langName}",
    "description": "15-25 character description in ${langName}"
  },
  "score": 0-100 integer,
  "rank": {
    "stars": 1-5,
    "title": "rank title TRANSLATED to ${langName} (e.g. Alpha Hunter → 阿尔法猎手 in Chinese)"
  },
  "superpower": "20-40 char description of best strength in ${langName}",
  "weakness": "20-40 char description of main weakness in ${langName}", 
  "keyStats": "FORMAT: [Win Rate label in ${langName}] XX% | [P/L Ratio label in ${langName}] X.XX:1 | [Expectancy label in ${langName}] $XX.XX",
  "badges": [{"emoji": "🏆", "name": "badge name TRANSLATED to ${langName}"}],
  "tagline": "witty quote 15-30 chars in ${langName}",
  "comparison": "2-3 sentences comparing to other traders in ${langName}",
  "riskAssessment": "40-60 char risk assessment in ${langName}",
  "tradingStyle": "30-50 char trading style summary in ${langName}",
  "analysis": {
    "strengths": "80-120 char detailed analysis of strengths in ${langName}",
    "weaknesses": "80-120 char detailed analysis of weaknesses in ${langName}",
    "actionItem": "50-80 char specific improvement advice in ${langName}"
  },
  "improvementPlan": ["step 1 in ${langName}", "step 2 in ${langName}", "step 3 in ${langName}"],
  "toolTip": "60-100 char tool recommendation in ${langName} with Markdown links: [OKX](https://utob.top/okx), [Binance](https://utob.top/bian), [TradingView](https://www.tradingview.com/?aff_id=158087), [NinjaTrader](https://ninjatraderdomesticvendor.sjv.io/c/6570566/3069488/37581)",
  "labels": {
    "superpower": "translate 'Superpower' to ${langName}",
    "weakness": "translate 'Weakness' to ${langName}",
    "keyStats": "translate 'Key Stats' to ${langName}",
    "badges": "translate 'Achievements' to ${langName}",
    "tradingStyle": "translate 'Trading Style' to ${langName}",
    "riskAssessment": "translate 'Risk Assessment' to ${langName}",
    "strengths": "translate 'What You Did Well' to ${langName}",
    "weaknesses": "translate 'Needs Improvement' to ${langName}",
    "actionItem": "translate 'Action Item' to ${langName}",
    "improvementPlan": "translate 'Improvement Roadmap' to ${langName}"
  }
}

# Personality Selection Criteria (choose the MOST fitting type based on data, output name in ${langName})
## CRITICAL: Losing traders (Total Return < 0%) can ONLY be 🐑 sheep or 🦁 lion!
- 🐺 wolf: Win rate >55% AND P/L ratio >1.5 AND Total Return > 0%, strategic winner
- 🦁 lion: Max single loss >10% OR Total Return < -20%, bold but reckless  
- 🐢 turtle: Avg holding >10 days AND Total Return > 0%, patient profitable investor
- 🐰 rabbit: Avg holding <3 days AND many trades, quick scalper (can be profitable or not)
- 🦅 eagle: Total trades <10 AND win rate >60% AND Total Return > 0%, precise opportunist
- 🐑 sheep: Win rate <45% OR (Total Return < 0% AND no clear edge), needs strategy

# Scoring Criteria - MULTI-DIMENSIONAL WEIGHTED SCORING
## ⚠️ CRITICAL CONSTRAINTS - MUST FOLLOW:
## - If Total Return < -20%: FINAL SCORE MUST BE < 30
## - If Total Return < -10%: FINAL SCORE MUST BE < 40  
## - If Total Return < 0%: FINAL SCORE MUST BE < 55
## - If Win Rate < 35%: FINAL SCORE MUST BE < 50

## Calculate score using 5 dimensions with weights:
### 1. Return Score (25% weight)
- < -10%: 0-25 → -10% to -5%: 25-40 → -5% to 0%: 40-55 → 0% to 5%: 55-70 → 5% to 15%: 70-85 → > 15%: 85-100

### 2. Win Rate Score (20% weight)
- < 35%: 0-25 → 35-45%: 25-45 → 45-55%: 45-65 → 55-65%: 65-80 → > 65%: 80-100

### 3. P/L Ratio Score (20% weight)
- < 0.5: 0-25 → 0.5-1.0: 25-50 → 1.0-1.5: 50-70 → 1.5-2.5: 70-85 → > 2.5: 85-100

### 4. Expectancy Score (20% weight)
- < -$50: 0-20 → -$50 to $0: 20-45 → $0 to $50: 45-65 → $50 to $150: 65-85 → > $150: 85-100

### 5. Risk Control Score (15% weight)
- Max single loss < 5%: 80-100 → < 10%: 60-80 → < 15%: 40-60 → < 20%: 20-40 → > 20%: 0-20

## FINAL SCORE = (Return×0.25) + (WinRate×0.20) + (PLRatio×0.20) + (Expectancy×0.20) + (RiskControl×0.15)

## Star Rating (based on final weighted score, TRANSLATE titles to ${langName})
- <40: ⭐ (translate "Liquidity Provider" to ${langName}) - Feeding money to market
- 40-54: ⭐⭐ (translate "Noise Trader" to ${langName}) - Random results  
- 55-69: ⭐⭐⭐ (translate "Disciplined Executor" to ${langName}) - Showing potential
- 70-84: ⭐⭐⭐⭐ (translate "Alpha Hunter" to ${langName}) - Generating alpha
- 85-100: ⭐⭐⭐⭐⭐ (translate "Market Wizard" to ${langName}) - Exceptional performance

# Badges (TRANSLATE badge names to ${langName}, award ONLY if ALL criteria met!)
## ⚠️ CRITICAL: Do NOT award badges to losing traders (Total Return < 0%) except for "Capital Guardian"!
- 🏆 (translate "Cold-Blooded" to ${langName}): All losses <5% AND Total Return >= 0%
- 💎 (translate "Diamond Hands" to ${langName}): Held winner 20+ days AND Total Return > 0%
- 🎯 (translate "Sharpshooter" to ${langName}): 3+ consecutive wins AND Win Rate > 50%
- 🔥 (translate "Streak Master" to ${langName}): 5+ win streak AND Total Return > 0%
- 🛡️ (translate "Capital Guardian" to ${langName}): Never lost >10% per trade

# Trading Data
- Total Trades: ${totalTrades}
- Win Rate: ${(winRate * 100).toFixed(1)}%
- P/L Ratio: ${winLossRatioFormatted}
- Expectancy: $${expectancy.toFixed(2)}/trade
- Max Single Loss: ${Math.abs(maxLossPct).toFixed(1)}%
- Max Win Streak: ${maxWinStreak}
- Avg Holding (Overall): ${avgHoldingDays.toFixed(1)} days
- Avg Holding (Win): ${avgWinHoldingDays.toFixed(1)} days
- Avg Holding (Loss): ${avgLossHoldingDays.toFixed(1)} days
- Stop-Loss Discipline: ${strictStopLoss ? 'Strict (all losses <5%)' : 'Loose'}
- Diamond Hand Trades: ${diamondHandTrades.length}
- Avg Entry Position: ${avgBuyPosition.toFixed(0)}% (0=low, 100=high)
- Total Return: ${(stats.pnlPct * 100).toFixed(2)}%

[REMINDER] Output ONLY valid JSON in ${langName} language! No other text!`;

  const systemMessage = `You are a JSON API. Output ONLY valid JSON. All text content MUST be in ${langName}. Use ${langName} only, no other languages.`;

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
