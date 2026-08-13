import {
  asSupportedLang,
  detectSupportedLang,
  type SupportedLang,
} from '@/lib/languages';

export const SESSION_SUMMARY_LINKS = {
  ninjaTrader:
    'https://ninjatraderdomesticvendor.sjv.io/c/6570566/3069488/37581',
  tradingView: 'https://www.tradingview.com/?aff_id=158087',
  okx: 'https://utob.top/okx',
  binance: 'https://utob.top/bian',
} as const;

type SessionSummaryCopy = {
  loadingTitle: string;
  loadingSubtitle: string;
  loadingStages: [string, string, string];
  loadingDetails: [string, string, string];
  roadmapTitle: string;
  roadmapSteps: [string, string, string];
  generating: string;
  reportTitle: string;
  reportCtaTitle: string;
  reportCtaSubtitle: string;
  rateLimit: string;
  emptyResponse: string;
};

const copyByLang: Record<SupportedLang, SessionSummaryCopy> = {
  en: {
    loadingTitle: 'AI Trading Analysis',
    loadingSubtitle: 'Reviewing this session before generating the report',
    loadingStages: [
      'Collecting trades',
      'Detecting patterns',
      'Generating report',
    ],
    loadingDetails: [
      'Summarizing PnL, win rate, expectancy, and holding behavior.',
      'Reviewing execution discipline, risk control, and trading style.',
      'Preparing the final summary, advice, and shareable report.',
    ],
    roadmapTitle: 'Improvement Roadmap',
    roadmapSteps: [
      `Use [NinjaTrader](${SESSION_SUMMARY_LINKS.ninjaTrader}) to practice with real-time simulated data.`,
      `Use [TradingView](${SESSION_SUMMARY_LINKS.tradingView}) for charting and review to build your trading system.`,
      `Use [OKX](${SESSION_SUMMARY_LINKS.okx}) / [Binance](${SESSION_SUMMARY_LINKS.binance}) later for small-size validation with lower fees.`,
    ],
    generating: 'Generating...',
    reportTitle: 'AI Trading Report',
    reportCtaTitle: 'Start Trading Now',
    reportCtaSubtitle: 'Scan to practice risk-free',
    rateLimit:
      'AI analysis is rate limited. Please wait 10-20 seconds and try again.',
    emptyResponse: 'AI returned an empty response. Please try again.',
  },
  es: {
    loadingTitle: 'Análisis de trading con IA',
    loadingSubtitle: 'Revisando esta sesión antes de generar el informe',
    loadingStages: [
      'Recopilando operaciones',
      'Detectando patrones',
      'Generando informe',
    ],
    loadingDetails: [
      'Resumiendo PnL, tasa de acierto, expectativa y duración de las posiciones.',
      'Revisando disciplina de ejecución, control de riesgo y estilo de trading.',
      'Preparando el resumen final, las sugerencias y la imagen para compartir.',
    ],
    roadmapTitle: 'Hoja de ruta de mejora',
    roadmapSteps: [
      `Usa [NinjaTrader](${SESSION_SUMMARY_LINKS.ninjaTrader}) para practicar con datos simulados en tiempo real.`,
      `Usa [TradingView](${SESSION_SUMMARY_LINKS.tradingView}) para observar el mercado y revisar tus operaciones mientras construyes tu sistema.`,
      `Usa [OKX](${SESSION_SUMMARY_LINKS.okx}) / [Binance](${SESSION_SUMMARY_LINKS.binance}) más adelante para validar con poco capital y comisiones más bajas.`,
    ],
    generating: 'Generando...',
    reportTitle: 'Informe de trading con IA',
    reportCtaTitle: 'Empieza a operar ahora',
    reportCtaSubtitle: 'Escanea para practicar sin riesgo',
    rateLimit:
      'El análisis con IA está limitado por frecuencia. Espera 10-20 segundos y vuelve a intentarlo.',
    emptyResponse: 'La IA no devolvió contenido. Vuelve a intentarlo.',
  },
  pt: {
    loadingTitle: 'Análise de trading com IA',
    loadingSubtitle: 'Revisando esta sessão antes de gerar o relatório',
    loadingStages: [
      'Coletando operações',
      'Detectando padrões',
      'Gerando relatório',
    ],
    loadingDetails: [
      'Resumindo PnL, taxa de acerto, expectativa e tempo médio de posição.',
      'Revisando disciplina de execução, controle de risco e estilo de trading.',
      'Preparando o resumo final, as sugestões e a imagem para compartilhar.',
    ],
    roadmapTitle: 'Roteiro de melhoria',
    roadmapSteps: [
      `Use [NinjaTrader](${SESSION_SUMMARY_LINKS.ninjaTrader}) para praticar com dados simulados em tempo real.`,
      `Use [TradingView](${SESSION_SUMMARY_LINKS.tradingView}) para acompanhar o mercado e revisar suas operações enquanto monta seu sistema.`,
      `Use [OKX](${SESSION_SUMMARY_LINKS.okx}) / [Binance](${SESSION_SUMMARY_LINKS.binance}) depois para validar com pouco capital e taxas menores.`,
    ],
    generating: 'Gerando...',
    reportTitle: 'Relatório de trading com IA',
    reportCtaTitle: 'Comece a operar agora',
    reportCtaSubtitle: 'Escaneie para praticar sem risco',
    rateLimit:
      'A análise por IA atingiu o limite de requisições. Aguarde 10-20 segundos e tente novamente.',
    emptyResponse: 'A IA retornou uma resposta vazia. Tente novamente.',
  },
  fr: {
    loadingTitle: 'Analyse de trading par IA',
    loadingSubtitle: 'Analyse de cette session avant de générer le rapport',
    loadingStages: [
      'Collecte des trades',
      'Détection des modèles',
      'Génération du rapport',
    ],
    loadingDetails: [
      'Résumé du PnL, du taux de réussite, de l’espérance et de la durée des positions.',
      'Analyse de la discipline d’exécution, du contrôle du risque et du style de trading.',
      'Préparation du résumé final, des conseils et du visuel à partager.',
    ],
    roadmapTitle: 'Feuille de route d’amélioration',
    roadmapSteps: [
      `Utilisez [NinjaTrader](${SESSION_SUMMARY_LINKS.ninjaTrader}) pour vous entraîner avec des données simulées en temps réel.`,
      `Utilisez [TradingView](${SESSION_SUMMARY_LINKS.tradingView}) pour observer le marché et revoir vos trades afin de construire votre système.`,
      `Utilisez [OKX](${SESSION_SUMMARY_LINKS.okx}) / [Binance](${SESSION_SUMMARY_LINKS.binance}) plus tard pour valider avec un petit capital et des frais plus bas.`,
    ],
    generating: 'Génération...',
    reportTitle: 'Rapport de trading IA',
    reportCtaTitle: 'Commencez à trader maintenant',
    reportCtaSubtitle: 'Scannez pour vous entraîner sans risque',
    rateLimit:
      'L’analyse IA est limitée par le nombre de requêtes. Attendez 10 à 20 secondes puis réessayez.',
    emptyResponse: 'L’IA a renvoyé une réponse vide. Réessayez.',
  },
  de: {
    loadingTitle: 'KI-Tradinganalyse',
    loadingSubtitle:
      'Diese Session wird vor der Erstellung des Berichts geprüft',
    loadingStages: [
      'Trades werden gesammelt',
      'Muster werden erkannt',
      'Bericht wird erstellt',
    ],
    loadingDetails: [
      'PnL, Trefferquote, Erwartungswert und Haltedauer werden zusammengefasst.',
      'Ausführungsdisziplin, Risikokontrolle und Trading-Stil werden geprüft.',
      'Die finale Zusammenfassung, Hinweise und die teilbare Grafik werden vorbereitet.',
    ],
    roadmapTitle: 'Verbesserungsplan',
    roadmapSteps: [
      `Nutze [NinjaTrader](${SESSION_SUMMARY_LINKS.ninjaTrader}) für Simulationen mit Echtzeitdaten.`,
      `Nutze [TradingView](${SESSION_SUMMARY_LINKS.tradingView}) für Charting und Reviews, um dein Handelssystem aufzubauen.`,
      `Nutze [OKX](${SESSION_SUMMARY_LINKS.okx}) / [Binance](${SESSION_SUMMARY_LINKS.binance}) später für kleine Validierungen mit niedrigeren Gebühren.`,
    ],
    generating: 'Wird erstellt...',
    reportTitle: 'KI-Tradingbericht',
    reportCtaTitle: 'Jetzt mit dem Trading beginnen',
    reportCtaSubtitle: 'Scannen und risikofrei üben',
    rateLimit:
      'Die KI-Analyse ist derzeit rate-limitiert. Bitte warte 10 bis 20 Sekunden und versuche es erneut.',
    emptyResponse:
      'Die KI hat keine Antwort zurückgegeben. Bitte versuche es erneut.',
  },
  ru: {
    loadingTitle: 'AI-анализ торговли',
    loadingSubtitle: 'Проверяем эту сессию перед созданием отчёта',
    loadingStages: ['Собираем сделки', 'Ищем паттерны', 'Готовим отчёт'],
    loadingDetails: [
      'Суммируем PnL, винрейт, матожидание и длительность удержания позиций.',
      'Проверяем дисциплину исполнения, контроль риска и стиль торговли.',
      'Готовим итоговое резюме, рекомендации и карточку для шаринга.',
    ],
    roadmapTitle: 'План улучшений',
    roadmapSteps: [
      `Используйте [NinjaTrader](${SESSION_SUMMARY_LINKS.ninjaTrader}) для симуляции на данных в реальном времени.`,
      `Используйте [TradingView](${SESSION_SUMMARY_LINKS.tradingView}) для анализа графиков и разбора сделок при построении торговой системы.`,
      `Позже используйте [OKX](${SESSION_SUMMARY_LINKS.okx}) / [Binance](${SESSION_SUMMARY_LINKS.binance}) для проверки на малом капитале с более низкими комиссиями.`,
    ],
    generating: 'Генерация...',
    reportTitle: 'AI-отчёт по торговле',
    reportCtaTitle: 'Начните торговать сейчас',
    reportCtaSubtitle: 'Сканируйте и тренируйтесь без риска',
    rateLimit:
      'Превышен лимит запросов к AI-анализу. Подождите 10-20 секунд и попробуйте снова.',
    emptyResponse: 'AI вернул пустой ответ. Попробуйте снова.',
  },
  ja: {
    loadingTitle: 'AIトレード分析',
    loadingSubtitle: 'レポート生成前に今回のセッションを確認しています',
    loadingStages: ['取引を集計中', 'パターンを分析中', 'レポートを生成中'],
    loadingDetails: [
      'PnL、勝率、期待値、保有の傾向を整理しています。',
      '執行の規律、リスク管理、トレードスタイルを確認しています。',
      '最終要約、改善提案、共有用レポートを準備しています。',
    ],
    roadmapTitle: '改善ロードマップ',
    roadmapSteps: [
      `リアルタイムの模擬データで練習するために [NinjaTrader](${SESSION_SUMMARY_LINKS.ninjaTrader}) を使ってください。`,
      `取引システムを作るために [TradingView](${SESSION_SUMMARY_LINKS.tradingView}) で相場確認と復習を行ってください。`,
      `その後、低い手数料で少額検証を行うために [OKX](${SESSION_SUMMARY_LINKS.okx}) / [Binance](${SESSION_SUMMARY_LINKS.binance}) を使ってください。`,
    ],
    generating: '生成中...',
    reportTitle: 'AIトレードレポート',
    reportCtaTitle: '今すぐトレードを始める',
    reportCtaSubtitle: 'スキャンしてリスクなしで練習',
    rateLimit:
      'AI分析のリクエストが多すぎます。10〜20秒待ってから再試行してください。',
    emptyResponse: 'AIからの応答が空でした。もう一度お試しください。',
  },
  ko: {
    loadingTitle: 'AI 트레이딩 분석',
    loadingSubtitle: '리포트를 만들기 전에 이번 세션을 검토하고 있습니다',
    loadingStages: ['거래 수집 중', '패턴 분석 중', '리포트 생성 중'],
    loadingDetails: [
      'PnL, 승률, 기대값, 보유 패턴을 정리하고 있습니다.',
      '체결 규율, 리스크 관리, 트레이딩 스타일을 점검하고 있습니다.',
      '최종 요약, 개선 제안, 공유용 리포트를 준비하고 있습니다.',
    ],
    roadmapTitle: '개선 로드맵',
    roadmapSteps: [
      `실시간 모의 데이터로 연습하려면 [NinjaTrader](${SESSION_SUMMARY_LINKS.ninjaTrader}) 를 사용하세요.`,
      `트레이딩 시스템을 만들기 위해 [TradingView](${SESSION_SUMMARY_LINKS.tradingView}) 로 차트를 보고 복기하세요.`,
      `이후 더 낮은 수수료로 소액 검증을 하려면 [OKX](${SESSION_SUMMARY_LINKS.okx}) / [Binance](${SESSION_SUMMARY_LINKS.binance}) 를 사용하세요.`,
    ],
    generating: '생성 중...',
    reportTitle: 'AI 트레이딩 리포트',
    reportCtaTitle: '지금 트레이딩 시작',
    reportCtaSubtitle: '스캔해서 무위험 연습하기',
    rateLimit: 'AI 분석 요청이 너무 많습니다. 10~20초 후 다시 시도하세요.',
    emptyResponse: 'AI가 빈 응답을 반환했습니다. 다시 시도하세요.',
  },
  'zh-Hans': {
    loadingTitle: 'AI 交易分析',
    loadingSubtitle: '正在整理这次会话的交易数据',
    loadingStages: ['整理交易记录', '识别交易模式', '生成最终报告'],
    loadingDetails: [
      '汇总盈亏、胜率、盈亏比和持仓节奏。',
      '识别执行纪律、风控习惯和交易风格。',
      '生成最终摘要、建议和分享内容。',
    ],
    roadmapTitle: '改进路线图',
    roadmapSteps: [
      `在 [NinjaTrader](${SESSION_SUMMARY_LINKS.ninjaTrader}) 中利用实时数据做模拟交易。`,
      `使用 [TradingView](${SESSION_SUMMARY_LINKS.tradingView}) 看盘和复盘，构建交易系统。`,
      `使用 [OKX](${SESSION_SUMMARY_LINKS.okx}) / [Binance](${SESSION_SUMMARY_LINKS.binance}) 降低手续费小资金验证。`,
    ],
    generating: '生成中...',
    reportTitle: 'AI 交易报告',
    reportCtaTitle: '立即开始交易练习',
    reportCtaSubtitle: '扫码进行零风险练习',
    rateLimit: 'AI 分析请求过于频繁，请稍等 10-20 秒后再试。',
    emptyResponse: 'AI 暂时没有返回结果，请稍后再试。',
  },
  'zh-Hant': {
    loadingTitle: 'AI 交易分析',
    loadingSubtitle: '正在整理這次會話的交易資料',
    loadingStages: ['整理交易紀錄', '識別交易模式', '生成最終報告'],
    loadingDetails: [
      '彙總盈虧、勝率、盈虧比與持倉節奏。',
      '識別執行紀律、風控習慣與交易風格。',
      '生成最終摘要、建議與分享內容。',
    ],
    roadmapTitle: '改進路線圖',
    roadmapSteps: [
      `在 [NinjaTrader](${SESSION_SUMMARY_LINKS.ninjaTrader}) 中利用即時資料做模擬交易。`,
      `使用 [TradingView](${SESSION_SUMMARY_LINKS.tradingView}) 看盤與複盤，建立交易系統。`,
      `使用 [OKX](${SESSION_SUMMARY_LINKS.okx}) / [Binance](${SESSION_SUMMARY_LINKS.binance}) 降低手續費並以小資金驗證。`,
    ],
    generating: '生成中...',
    reportTitle: 'AI 交易報告',
    reportCtaTitle: '立即開始交易練習',
    reportCtaSubtitle: '掃碼進行零風險練習',
    rateLimit: 'AI 分析請求過於頻繁，請稍等 10-20 秒後再試。',
    emptyResponse: 'AI 暫時沒有返回結果，請稍後再試。',
  },
  ar: {
    loadingTitle: 'تحليل التداول بالذكاء الاصطناعي',
    loadingSubtitle: 'نراجع هذه الجلسة قبل إنشاء التقرير',
    loadingStages: ['جمع الصفقات', 'اكتشاف الأنماط', 'إنشاء التقرير'],
    loadingDetails: [
      'تلخيص الأرباح والخسائر ونسبة الفوز والقيمة المتوقعة وسلوك الاحتفاظ.',
      'مراجعة الانضباط في التنفيذ وإدارة المخاطر وأسلوب التداول.',
      'إعداد الملخص النهائي والنصائح والتقرير القابل للمشاركة.',
    ],
    roadmapTitle: 'خريطة طريق التحسين',
    roadmapSteps: [
      `استخدم [NinjaTrader](${SESSION_SUMMARY_LINKS.ninjaTrader}) للتدرب على بيانات محاكاة في الوقت الفعلي.`,
      `استخدم [TradingView](${SESSION_SUMMARY_LINKS.tradingView}) لمتابعة السوق ومراجعة صفقاتك أثناء بناء نظامك.`,
      `استخدم [OKX](${SESSION_SUMMARY_LINKS.okx}) / [Binance](${SESSION_SUMMARY_LINKS.binance}) لاحقًا للتحقق بمبالغ صغيرة ورسوم أقل.`,
    ],
    generating: 'جارٍ الإنشاء...',
    reportTitle: 'تقرير تداول بالذكاء الاصطناعي',
    reportCtaTitle: 'ابدأ التداول الآن',
    reportCtaSubtitle: 'امسح للتدرب بدون مخاطرة',
    rateLimit:
      'تم الوصول إلى حد طلبات تحليل الذكاء الاصطناعي. انتظر من 10 إلى 20 ثانية ثم حاول مرة أخرى.',
    emptyResponse: 'أعاد الذكاء الاصطناعي استجابة فارغة. حاول مرة أخرى.',
  },
  it: {
    loadingTitle: 'Analisi di trading con IA',
    loadingSubtitle:
      'Sto rivedendo questa sessione prima di generare il report',
    loadingStages: [
      'Raccolta trade',
      'Rilevamento pattern',
      'Generazione report',
    ],
    loadingDetails: [
      'Riassumendo PnL, win rate, expectancy e durata delle posizioni.',
      'Controllando disciplina di esecuzione, gestione del rischio e stile di trading.',
      'Preparando il riepilogo finale, i suggerimenti e la grafica condivisibile.',
    ],
    roadmapTitle: 'Roadmap di miglioramento',
    roadmapSteps: [
      `Usa [NinjaTrader](${SESSION_SUMMARY_LINKS.ninjaTrader}) per esercitarti con dati simulati in tempo reale.`,
      `Usa [TradingView](${SESSION_SUMMARY_LINKS.tradingView}) per osservare i grafici e rivedere i trade mentre costruisci il tuo sistema.`,
      `Usa [OKX](${SESSION_SUMMARY_LINKS.okx}) / [Binance](${SESSION_SUMMARY_LINKS.binance}) più avanti per validare con poco capitale e commissioni più basse.`,
    ],
    generating: 'Generazione...',
    reportTitle: 'Report di trading IA',
    reportCtaTitle: 'Inizia a tradare ora',
    reportCtaSubtitle: 'Scansiona per fare pratica senza rischio',
    rateLimit:
      'L’analisi IA è soggetta a limite di richieste. Attendi 10-20 secondi e riprova.',
    emptyResponse: 'L’IA ha restituito una risposta vuota. Riprova.',
  },
  nl: {
    loadingTitle: 'AI-handelsanalyse',
    loadingSubtitle:
      'Deze sessie wordt bekeken voordat het rapport wordt gemaakt',
    loadingStages: [
      'Trades verzamelen',
      'Patronen herkennen',
      'Rapport genereren',
    ],
    loadingDetails: [
      'PnL, winrate, expectancy en houdgedrag worden samengevat.',
      'Uitvoeringsdiscipline, risicobeheer en handelsstijl worden beoordeeld.',
      'De samenvatting, adviezen en deelbare rapportage worden voorbereid.',
    ],
    roadmapTitle: 'Verbeterplan',
    roadmapSteps: [
      `Gebruik [NinjaTrader](${SESSION_SUMMARY_LINKS.ninjaTrader}) om te oefenen met realtime gesimuleerde data.`,
      `Gebruik [TradingView](${SESSION_SUMMARY_LINKS.tradingView}) om charts te volgen en je trades te evalueren terwijl je je systeem opbouwt.`,
      `Gebruik [OKX](${SESSION_SUMMARY_LINKS.okx}) / [Binance](${SESSION_SUMMARY_LINKS.binance}) later voor validatie met kleine bedragen en lagere kosten.`,
    ],
    generating: 'Genereren...',
    reportTitle: 'AI-handelsrapport',
    reportCtaTitle: 'Begin nu met handelen',
    reportCtaSubtitle: 'Scan om risicovrij te oefenen',
    rateLimit:
      'De AI-analyse is tijdelijk gelimiteerd. Wacht 10-20 seconden en probeer het opnieuw.',
    emptyResponse: 'De AI gaf een lege reactie terug. Probeer het opnieuw.',
  },
  pl: {
    loadingTitle: 'Analiza tradingu AI',
    loadingSubtitle: 'Sprawdzamy tę sesję przed wygenerowaniem raportu',
    loadingStages: [
      'Zbieranie transakcji',
      'Wykrywanie wzorców',
      'Generowanie raportu',
    ],
    loadingDetails: [
      'Podsumowujemy PnL, skuteczność, expectancy i czas trzymania pozycji.',
      'Sprawdzamy dyscyplinę wykonania, kontrolę ryzyka i styl handlu.',
      'Przygotowujemy końcowe podsumowanie, wskazówki i grafikę do udostępnienia.',
    ],
    roadmapTitle: 'Plan poprawy',
    roadmapSteps: [
      `Używaj [NinjaTrader](${SESSION_SUMMARY_LINKS.ninjaTrader}) do ćwiczeń na symulowanych danych w czasie rzeczywistym.`,
      `Używaj [TradingView](${SESSION_SUMMARY_LINKS.tradingView}) do obserwacji rynku i przeglądu transakcji podczas budowy systemu.`,
      `Używaj [OKX](${SESSION_SUMMARY_LINKS.okx}) / [Binance](${SESSION_SUMMARY_LINKS.binance}) później do walidacji małym kapitałem przy niższych opłatach.`,
    ],
    generating: 'Generowanie...',
    reportTitle: 'Raport tradingowy AI',
    reportCtaTitle: 'Zacznij handlować teraz',
    reportCtaSubtitle: 'Zeskanuj, aby ćwiczyć bez ryzyka',
    rateLimit:
      'Analiza AI osiągnęła limit zapytań. Poczekaj 10-20 sekund i spróbuj ponownie.',
    emptyResponse: 'AI zwróciło pustą odpowiedź. Spróbuj ponownie.',
  },
  tr: {
    loadingTitle: 'Yapay zekâ işlem analizi',
    loadingSubtitle: 'Raporu oluşturmadan önce bu seansı inceliyoruz',
    loadingStages: [
      'İşlemler toplanıyor',
      'Kalıplar tespit ediliyor',
      'Rapor oluşturuluyor',
    ],
    loadingDetails: [
      'PnL, kazanma oranı, beklenti ve pozisyon tutma davranışı özetleniyor.',
      'Uygulama disiplini, risk kontrolü ve işlem tarzı inceleniyor.',
      'Nihai özet, öneriler ve paylaşılabilir rapor hazırlanıyor.',
    ],
    roadmapTitle: 'Gelişim yol haritası',
    roadmapSteps: [
      `[NinjaTrader](${SESSION_SUMMARY_LINKS.ninjaTrader}) ile gerçek zamanlı simülasyon verileri üzerinde pratik yapın.`,
      `İşlem sisteminizi kurarken piyasa takibi ve geriye dönük inceleme için [TradingView](${SESSION_SUMMARY_LINKS.tradingView}) kullanın.`,
      `Daha düşük komisyonlarla küçük tutarlı doğrulama için daha sonra [OKX](${SESSION_SUMMARY_LINKS.okx}) / [Binance](${SESSION_SUMMARY_LINKS.binance}) kullanın.`,
    ],
    generating: 'Oluşturuluyor...',
    reportTitle: 'Yapay zekâ işlem raporu',
    reportCtaTitle: 'Hemen işlem yapmaya başla',
    reportCtaSubtitle: 'Risksiz pratik için tara',
    rateLimit:
      'Yapay zekâ analizi istek sınırına ulaştı. 10-20 saniye bekleyip tekrar deneyin.',
    emptyResponse: 'Yapay zekâ boş bir yanıt döndürdü. Lütfen tekrar deneyin.',
  },
  vi: {
    loadingTitle: 'Phân tích giao dịch bằng AI',
    loadingSubtitle: 'Đang xem lại phiên này trước khi tạo báo cáo',
    loadingStages: ['Thu thập giao dịch', 'Phát hiện mẫu', 'Tạo báo cáo'],
    loadingDetails: [
      'Đang tổng hợp PnL, tỷ lệ thắng, expectancy và thời gian giữ lệnh.',
      'Đang xem lại kỷ luật thực thi, kiểm soát rủi ro và phong cách giao dịch.',
      'Đang chuẩn bị phần tóm tắt cuối cùng, gợi ý và báo cáo để chia sẻ.',
    ],
    roadmapTitle: 'Lộ trình cải thiện',
    roadmapSteps: [
      `Dùng [NinjaTrader](${SESSION_SUMMARY_LINKS.ninjaTrader}) để luyện tập với dữ liệu mô phỏng thời gian thực.`,
      `Dùng [TradingView](${SESSION_SUMMARY_LINKS.tradingView}) để quan sát thị trường và xem lại lệnh khi xây dựng hệ thống giao dịch.`,
      `Dùng [OKX](${SESSION_SUMMARY_LINKS.okx}) / [Binance](${SESSION_SUMMARY_LINKS.binance}) sau đó để kiểm chứng với vốn nhỏ và phí thấp hơn.`,
    ],
    generating: 'Đang tạo...',
    reportTitle: 'Báo cáo giao dịch AI',
    reportCtaTitle: 'Bắt đầu giao dịch ngay',
    reportCtaSubtitle: 'Quét để luyện tập không rủi ro',
    rateLimit:
      'Phân tích AI đang bị giới hạn tần suất. Hãy đợi 10-20 giây rồi thử lại.',
    emptyResponse: 'AI trả về phản hồi trống. Hãy thử lại.',
  },
  th: {
    loadingTitle: 'การวิเคราะห์การเทรดด้วย AI',
    loadingSubtitle: 'กำลังตรวจสอบเซสชันนี้ก่อนสร้างรายงาน',
    loadingStages: ['รวบรวมรายการเทรด', 'ตรวจจับรูปแบบ', 'สร้างรายงาน'],
    loadingDetails: [
      'กำลังสรุป PnL อัตราชนะ ค่า expectancy และพฤติกรรมการถือครอง',
      'กำลังตรวจสอบวินัยในการส่งคำสั่ง การควบคุมความเสี่ยง และสไตล์การเทรด',
      'กำลังเตรียมสรุปสุดท้าย คำแนะนำ และรายงานสำหรับแชร์',
    ],
    roadmapTitle: 'แผนพัฒนา',
    roadmapSteps: [
      `ใช้ [NinjaTrader](${SESSION_SUMMARY_LINKS.ninjaTrader}) เพื่อฝึกด้วยข้อมูลจำลองแบบเรียลไทม์`,
      `ใช้ [TradingView](${SESSION_SUMMARY_LINKS.tradingView}) เพื่อดูกราฟและทบทวนการเทรดระหว่างสร้างระบบของคุณ`,
      `ค่อยใช้ [OKX](${SESSION_SUMMARY_LINKS.okx}) / [Binance](${SESSION_SUMMARY_LINKS.binance}) ภายหลังเพื่อตรวจสอบด้วยเงินจำนวนน้อยและค่าธรรมเนียมที่ต่ำกว่า`,
    ],
    generating: 'กำลังสร้าง...',
    reportTitle: 'รายงานการเทรดด้วย AI',
    reportCtaTitle: 'เริ่มเทรดตอนนี้',
    reportCtaSubtitle: 'สแกนเพื่อฝึกแบบไร้ความเสี่ยง',
    rateLimit: 'คำขอวิเคราะห์ AI มากเกินไป กรุณารอ 10-20 วินาทีแล้วลองใหม่อีกครั้ง',
    emptyResponse: 'AI ไม่ได้ส่งผลลัพธ์กลับมา กรุณาลองใหม่อีกครั้ง',
  },
  id: {
    loadingTitle: 'Analisis trading AI',
    loadingSubtitle: 'Meninjau sesi ini sebelum membuat laporan',
    loadingStages: [
      'Mengumpulkan transaksi',
      'Mendeteksi pola',
      'Membuat laporan',
    ],
    loadingDetails: [
      'Merangkum PnL, win rate, expectancy, dan perilaku holding.',
      'Meninjau disiplin eksekusi, kontrol risiko, dan gaya trading.',
      'Menyiapkan ringkasan akhir, saran, dan laporan yang bisa dibagikan.',
    ],
    roadmapTitle: 'Peta jalan perbaikan',
    roadmapSteps: [
      `Gunakan [NinjaTrader](${SESSION_SUMMARY_LINKS.ninjaTrader}) untuk berlatih dengan data simulasi real-time.`,
      `Gunakan [TradingView](${SESSION_SUMMARY_LINKS.tradingView}) untuk melihat pasar dan meninjau transaksi sambil membangun sistem trading Anda.`,
      `Gunakan [OKX](${SESSION_SUMMARY_LINKS.okx}) / [Binance](${SESSION_SUMMARY_LINKS.binance}) nanti untuk validasi modal kecil dengan biaya lebih rendah.`,
    ],
    generating: 'Membuat...',
    reportTitle: 'Laporan trading AI',
    reportCtaTitle: 'Mulai trading sekarang',
    reportCtaSubtitle: 'Pindai untuk berlatih tanpa risiko',
    rateLimit:
      'Analisis AI sedang mencapai batas permintaan. Tunggu 10-20 detik lalu coba lagi.',
    emptyResponse: 'AI mengembalikan respons kosong. Silakan coba lagi.',
  },
  hi: {
    loadingTitle: 'AI ट्रेडिंग विश्लेषण',
    loadingSubtitle: 'रिपोर्ट बनाने से पहले इस सत्र की समीक्षा की जा रही है',
    loadingStages: [
      'ट्रेड इकट्ठा किए जा रहे हैं',
      'पैटर्न पहचाने जा रहे हैं',
      'रिपोर्ट बनाई जा रही है',
    ],
    loadingDetails: [
      'PnL, विन रेट, expectancy और होल्डिंग व्यवहार का सार बनाया जा रहा है।',
      'एक्जीक्यूशन अनुशासन, जोखिम नियंत्रण और ट्रेडिंग शैली की समीक्षा की जा रही है।',
      'अंतिम सारांश, सुझाव और शेयर करने योग्य रिपोर्ट तैयार की जा रही है।',
    ],
    roadmapTitle: 'सुधार रोडमैप',
    roadmapSteps: [
      `रीयल-टाइम सिम्युलेटेड डेटा के साथ अभ्यास करने के लिए [NinjaTrader](${SESSION_SUMMARY_LINKS.ninjaTrader}) का उपयोग करें।`,
      `अपनी ट्रेडिंग प्रणाली बनाने के लिए मार्केट देखने और रिव्यू के लिए [TradingView](${SESSION_SUMMARY_LINKS.tradingView}) का उपयोग करें।`,
      `कम शुल्क के साथ छोटे पूंजी सत्यापन के लिए बाद में [OKX](${SESSION_SUMMARY_LINKS.okx}) / [Binance](${SESSION_SUMMARY_LINKS.binance}) का उपयोग करें।`,
    ],
    generating: 'जेनरेट किया जा रहा है...',
    reportTitle: 'AI ट्रेडिंग रिपोर्ट',
    reportCtaTitle: 'अभी ट्रेडिंग शुरू करें',
    reportCtaSubtitle: 'बिना जोखिम अभ्यास के लिए स्कैन करें',
    rateLimit:
      'AI विश्लेषण पर अनुरोध सीमा लागू है। 10-20 सेकंड इंतज़ार करें और फिर दोबारा प्रयास करें।',
    emptyResponse: 'AI ने खाली प्रतिक्रिया लौटाई। कृपया फिर से प्रयास करें।',
  },
  he: {
    loadingTitle: 'ניתוח מסחר באמצעות AI',
    loadingSubtitle: 'בודקים את סשן המסחר לפני יצירת הדוח',
    loadingStages: ['איסוף עסקאות', 'זיהוי תבניות', 'הפקת הדוח'],
    loadingDetails: [
      'מסכמים רווח/הפסד (PnL), שיעור הצלחה, תוחלת רווח (expectancy) והרגלי החזקת פוזיציות.',
      'בודקים משמעת ביצוע, ניהול סיכונים וסגנון מסחר.',
      'מכינים את הסיכום הסופי, ההמלצות והדוח לשיתוף.',
    ],
    roadmapTitle: 'תכנית פעולה לשיפור',
    roadmapSteps: [
      `השתמשו ב-[NinjaTrader](${SESSION_SUMMARY_LINKS.ninjaTrader}) כדי לתרגל עם נתוני סימולציה בזמן אמת.`,
      `השתמשו ב-[TradingView](${SESSION_SUMMARY_LINKS.tradingView}) לצפייה בגרפים ולסקירת עסקאות בזמן בניית מערכת המסחר שלכם.`,
      `בהמשך, השתמשו ב-[OKX](${SESSION_SUMMARY_LINKS.okx}) / [Binance](${SESSION_SUMMARY_LINKS.binance}) לצורך בדיקות ראשוניות עם הון קטן ועמלות נמוכות.`,
    ],
    generating: 'מפיק דוח...',
    reportTitle: 'דוח מסחר מבוסס AI',
    reportCtaTitle: 'התחילו לתרגל עכשיו',
    reportCtaSubtitle: 'סרקו כדי לתרגל ללא סיכון',
    rateLimit:
      'קצב בקשות ניתוח ה-AI הגיע למגבלה. אנא המתינו 10-20 שניות ונסו שוב.',
    emptyResponse: 'לא התקבלה תשובה משרת ה-AI. נסו שוב.',
  },
  fa: {
    loadingTitle: 'تحلیل معاملاتی با هوش مصنوعی',
    loadingSubtitle: 'در حال بررسی این جلسه پیش از تولید گزارش',
    loadingStages: ['جمع‌آوری معاملات', 'تشخیص الگوها', 'تولید گزارش'],
    loadingDetails: [
      'در حال جمع‌بندی PnL، نرخ برد، امید ریاضی و رفتار نگهداری موقعیت هستیم.',
      'در حال بررسی نظم اجرا، کنترل ریسک و سبک معامله‌گری هستیم.',
      'در حال آماده‌سازی جمع‌بندی نهایی، پیشنهادها و گزارش قابل اشتراک هستیم.',
    ],
    roadmapTitle: 'نقشه راه بهبود',
    roadmapSteps: [
      `برای تمرین با داده شبیه‌سازی‌شده لحظه‌ای از [NinjaTrader](${SESSION_SUMMARY_LINKS.ninjaTrader}) استفاده کنید.`,
      `برای دیدن بازار و بازبینی معاملات هنگام ساخت سیستم معاملاتی از [TradingView](${SESSION_SUMMARY_LINKS.tradingView}) استفاده کنید.`,
      `بعداً برای اعتبارسنجی با سرمایه کم و کارمزد پایین‌تر از [OKX](${SESSION_SUMMARY_LINKS.okx}) / [Binance](${SESSION_SUMMARY_LINKS.binance}) استفاده کنید.`,
    ],
    generating: 'در حال تولید...',
    reportTitle: 'گزارش معاملاتی هوش مصنوعی',
    reportCtaTitle: 'همین حالا معامله را شروع کنید',
    reportCtaSubtitle: 'برای تمرین بدون ریسک اسکن کنید',
    rateLimit:
      'درخواست‌های تحلیل هوش مصنوعی بیش از حد شده است. ۱۰ تا ۲۰ ثانیه صبر کنید و دوباره تلاش کنید.',
    emptyResponse: 'هوش مصنوعی پاسخ خالی برگرداند. دوباره تلاش کنید.',
  },
  uk: {
    loadingTitle: 'AI-аналіз торгівлі',
    loadingSubtitle: 'Перевіряємо цю сесію перед створенням звіту',
    loadingStages: ['Збираємо угоди', 'Виявляємо патерни', 'Формуємо звіт'],
    loadingDetails: [
      'Підсумовуємо PnL, win rate, expectancy та поведінку утримання позицій.',
      'Перевіряємо дисципліну виконання, контроль ризику та стиль торгівлі.',
      'Готуємо фінальний підсумок, поради та картку для поширення.',
    ],
    roadmapTitle: 'План покращення',
    roadmapSteps: [
      `Використовуйте [NinjaTrader](${SESSION_SUMMARY_LINKS.ninjaTrader}) для практики на симульованих даних у реальному часі.`,
      `Використовуйте [TradingView](${SESSION_SUMMARY_LINKS.tradingView}) для перегляду графіків і розбору угод під час побудови системи.`,
      `Пізніше використовуйте [OKX](${SESSION_SUMMARY_LINKS.okx}) / [Binance](${SESSION_SUMMARY_LINKS.binance}) для перевірки невеликим капіталом і нижчими комісіями.`,
    ],
    generating: 'Створення...',
    reportTitle: 'AI-звіт по торгівлі',
    reportCtaTitle: 'Почніть торгувати зараз',
    reportCtaSubtitle: 'Скануйте для практики без ризику',
    rateLimit:
      'Досягнуто ліміту запитів AI-аналізу. Зачекайте 10-20 секунд і спробуйте ще раз.',
    emptyResponse: 'AI повернув порожню відповідь. Спробуйте ще раз.',
  },
  cs: {
    loadingTitle: 'AI analýza obchodování',
    loadingSubtitle: 'Kontrolujeme tuto seanci před vytvořením reportu',
    loadingStages: [
      'Shromažďujeme obchody',
      'Hledáme vzory',
      'Generujeme report',
    ],
    loadingDetails: [
      'Shrnujeme PnL, win rate, expectancy a chování při držení pozic.',
      'Kontrolujeme disciplínu exekuce, řízení rizika a styl obchodování.',
      'Připravujeme finální shrnutí, doporučení a report ke sdílení.',
    ],
    roadmapTitle: 'Plán zlepšení',
    roadmapSteps: [
      `Používejte [NinjaTrader](${SESSION_SUMMARY_LINKS.ninjaTrader}) k tréninku na simulovaných datech v reálném čase.`,
      `Používejte [TradingView](${SESSION_SUMMARY_LINKS.tradingView}) pro sledování trhu a zpětnou kontrolu obchodů při budování systému.`,
      `Později používejte [OKX](${SESSION_SUMMARY_LINKS.okx}) / [Binance](${SESSION_SUMMARY_LINKS.binance}) pro ověření s malým kapitálem a nižšími poplatky.`,
    ],
    generating: 'Generování...',
    reportTitle: 'AI trading report',
    reportCtaTitle: 'Začněte obchodovat teď',
    reportCtaSubtitle: 'Naskenujte a trénujte bez rizika',
    rateLimit:
      'AI analýza je momentálně omezená limitem požadavků. Počkejte 10-20 sekund a zkuste to znovu.',
    emptyResponse: 'AI vrátila prázdnou odpověď. Zkuste to znovu.',
  },
  sv: {
    loadingTitle: 'AI-handelsanalys',
    loadingSubtitle: 'Går igenom den här sessionen innan rapporten skapas',
    loadingStages: [
      'Samlar in affärer',
      'Identifierar mönster',
      'Skapar rapport',
    ],
    loadingDetails: [
      'Summerar PnL, träffsäkerhet, expectancy och hur länge positioner hålls.',
      'Granskar exekveringsdisciplin, riskkontroll och handelsstil.',
      'Förbereder den slutliga sammanfattningen, råden och rapporten för delning.',
    ],
    roadmapTitle: 'Förbättringsplan',
    roadmapSteps: [
      `Använd [NinjaTrader](${SESSION_SUMMARY_LINKS.ninjaTrader}) för att öva med simulerad realtidsdata.`,
      `Använd [TradingView](${SESSION_SUMMARY_LINKS.tradingView}) för charting och genomgång när du bygger ditt handelssystem.`,
      `Använd [OKX](${SESSION_SUMMARY_LINKS.okx}) / [Binance](${SESSION_SUMMARY_LINKS.binance}) senare för små valideringar med lägre avgifter.`,
    ],
    generating: 'Genererar...',
    reportTitle: 'AI-handelsrapport',
    reportCtaTitle: 'Börja handla nu',
    reportCtaSubtitle: 'Skanna för att öva riskfritt',
    rateLimit:
      'AI-analysen är tillfälligt begränsad. Vänta 10-20 sekunder och försök igen.',
    emptyResponse: 'AI returnerade ett tomt svar. Försök igen.',
  },
  no: {
    loadingTitle: 'AI-handelsanalyse',
    loadingSubtitle: 'Går gjennom denne økten før rapporten lages',
    loadingStages: ['Samler handler', 'Oppdager mønstre', 'Genererer rapport'],
    loadingDetails: [
      'Oppsummerer PnL, treffrate, expectancy og hvor lenge posisjoner holdes.',
      'Vurderer utførelsesdisiplin, risikokontroll og handelsstil.',
      'Forbereder endelig sammendrag, råd og delbar rapport.',
    ],
    roadmapTitle: 'Forbedringsplan',
    roadmapSteps: [
      `Bruk [NinjaTrader](${SESSION_SUMMARY_LINKS.ninjaTrader}) for å øve med simulert sanntidsdata.`,
      `Bruk [TradingView](${SESSION_SUMMARY_LINKS.tradingView}) til charting og gjennomgang mens du bygger handelssystemet ditt.`,
      `Bruk [OKX](${SESSION_SUMMARY_LINKS.okx}) / [Binance](${SESSION_SUMMARY_LINKS.binance}) senere for validering med små beløp og lavere gebyrer.`,
    ],
    generating: 'Genererer...',
    reportTitle: 'AI-handelsrapport',
    reportCtaTitle: 'Start trading nå',
    reportCtaSubtitle: 'Skann for å øve uten risiko',
    rateLimit:
      'AI-analysen har nådd grensen for forespørsler. Vent 10-20 sekunder og prøv igjen.',
    emptyResponse: 'AI returnerte et tomt svar. Prøv igjen.',
  },
  da: {
    loadingTitle: 'AI-handelsanalyse',
    loadingSubtitle: 'Gennemgår denne session før rapporten oprettes',
    loadingStages: ['Indsamler handler', 'Finder mønstre', 'Opretter rapport'],
    loadingDetails: [
      'Opsummerer PnL, træfrate, expectancy og hvor længe positioner holdes.',
      'Gennemgår udførelsesdisciplin, risikostyring og handelsstil.',
      'Forbereder den endelige opsummering, råd og delbar rapport.',
    ],
    roadmapTitle: 'Forbedringsplan',
    roadmapSteps: [
      `Brug [NinjaTrader](${SESSION_SUMMARY_LINKS.ninjaTrader}) til at øve med simulerede realtidsdata.`,
      `Brug [TradingView](${SESSION_SUMMARY_LINKS.tradingView}) til charting og gennemgang, mens du bygger dit handelssystem.`,
      `Brug [OKX](${SESSION_SUMMARY_LINKS.okx}) / [Binance](${SESSION_SUMMARY_LINKS.binance}) senere til validering med små beløb og lavere gebyrer.`,
    ],
    generating: 'Genererer...',
    reportTitle: 'AI-handelsrapport',
    reportCtaTitle: 'Start handel nu',
    reportCtaSubtitle: 'Scan for at øve uden risiko',
    rateLimit:
      'AI-analysen har ramt en grænse for forespørgsler. Vent 10-20 sekunder og prøv igen.',
    emptyResponse: 'AI returnerede et tomt svar. Prøv igen.',
  },
  fi: {
    loadingTitle: 'AI-kaupankäyntianalyysi',
    loadingSubtitle: 'Tätä sessiota tarkistetaan ennen raportin luomista',
    loadingStages: [
      'Kerätään kauppoja',
      'Tunnistetaan kaavoja',
      'Luodaan raporttia',
    ],
    loadingDetails: [
      'Yhteenveto PnL:stä, voittosuhteesta, expectancy-arvosta ja holdauskäyttäytymisestä.',
      'Tarkistetaan toteutuksen kurinalaisuus, riskienhallinta ja kaupankäyntityyli.',
      'Valmistellaan lopullinen yhteenveto, ohjeet ja jaettava raportti.',
    ],
    roadmapTitle: 'Kehityssuunnitelma',
    roadmapSteps: [
      `Käytä [NinjaTraderia](${SESSION_SUMMARY_LINKS.ninjaTrader}) harjoitteluun reaaliaikaisella simulaatiodatalla.`,
      `Käytä [TradingView'ta](${SESSION_SUMMARY_LINKS.tradingView}) kaavioiden seuraamiseen ja treidien läpikäyntiin, kun rakennat järjestelmääsi.`,
      `Käytä myöhemmin [OKX:ää](${SESSION_SUMMARY_LINKS.okx}) / [Binancea](${SESSION_SUMMARY_LINKS.binance}) pienen pääoman validointiin ja matalampiin kuluihin.`,
    ],
    generating: 'Luodaan...',
    reportTitle: 'AI-kaupankäyntiraportti',
    reportCtaTitle: 'Aloita treidaaminen nyt',
    reportCtaSubtitle: 'Skannaa ja harjoittele riskittä',
    rateLimit:
      'AI-analyysin pyyntöraja on täyttynyt. Odota 10-20 sekuntia ja yritä uudelleen.',
    emptyResponse: 'AI palautti tyhjän vastauksen. Yritä uudelleen.',
  },
  el: {
    loadingTitle: 'Ανάλυση trading με AI',
    loadingSubtitle: 'Ελέγχουμε αυτή τη συνεδρία πριν δημιουργηθεί η αναφορά',
    loadingStages: [
      'Συλλογή trades',
      'Εντοπισμός μοτίβων',
      'Δημιουργία αναφοράς',
    ],
    loadingDetails: [
      'Συνοψίζουμε PnL, ποσοστό επιτυχίας, expectancy και διάρκεια διακράτησης.',
      'Εξετάζουμε πειθαρχία εκτέλεσης, έλεγχο ρίσκου και στυλ trading.',
      'Ετοιμάζουμε την τελική σύνοψη, τις προτάσεις και την κάρτα κοινοποίησης.',
    ],
    roadmapTitle: 'Οδικός χάρτης βελτίωσης',
    roadmapSteps: [
      `Χρησιμοποιήστε το [NinjaTrader](${SESSION_SUMMARY_LINKS.ninjaTrader}) για εξάσκηση με προσομοιωμένα δεδομένα σε πραγματικό χρόνο.`,
      `Χρησιμοποιήστε το [TradingView](${SESSION_SUMMARY_LINKS.tradingView}) για παρακολούθηση γραφημάτων και ανασκόπηση συναλλαγών καθώς χτίζετε το σύστημά σας.`,
      `Χρησιμοποιήστε αργότερα το [OKX](${SESSION_SUMMARY_LINKS.okx}) / [Binance](${SESSION_SUMMARY_LINKS.binance}) για δοκιμή με μικρό κεφάλαιο και χαμηλότερες χρεώσεις.`,
    ],
    generating: 'Δημιουργία...',
    reportTitle: 'Αναφορά trading AI',
    reportCtaTitle: 'Ξεκινήστε να κάνετε trading τώρα',
    reportCtaSubtitle: 'Σαρώστε για εξάσκηση χωρίς ρίσκο',
    rateLimit:
      'Το AI analysis έχει φτάσει το όριο αιτημάτων. Περιμένετε 10-20 δευτερόλεπτα και δοκιμάστε ξανά.',
    emptyResponse: 'Η AI επέστρεψε κενή απάντηση. Δοκιμάστε ξανά.',
  },
  ro: {
    loadingTitle: 'Analiză de trading cu AI',
    loadingSubtitle:
      'Verificăm această sesiune înainte de generarea raportului',
    loadingStages: [
      'Colectăm tranzacții',
      'Detectăm tipare',
      'Generăm raportul',
    ],
    loadingDetails: [
      'Rezumat pentru PnL, win rate, expectancy și durata pozițiilor.',
      'Verificăm disciplina de execuție, controlul riscului și stilul de trading.',
      'Pregătim rezumatul final, recomandările și raportul pentru distribuire.',
    ],
    roadmapTitle: 'Plan de îmbunătățire',
    roadmapSteps: [
      `Folosește [NinjaTrader](${SESSION_SUMMARY_LINKS.ninjaTrader}) pentru exercițiu cu date simulate în timp real.`,
      `Folosește [TradingView](${SESSION_SUMMARY_LINKS.tradingView}) pentru urmărirea graficelor și revizuirea tranzacțiilor în timp ce îți construiești sistemul.`,
      `Folosește mai târziu [OKX](${SESSION_SUMMARY_LINKS.okx}) / [Binance](${SESSION_SUMMARY_LINKS.binance}) pentru validare cu capital mic și comisioane mai reduse.`,
    ],
    generating: 'Se generează...',
    reportTitle: 'Raport de trading AI',
    reportCtaTitle: 'Începe să tranzacționezi acum',
    reportCtaSubtitle: 'Scanează pentru a exersa fără risc',
    rateLimit:
      'Analiza AI a atins limita de cereri. Așteaptă 10-20 de secunde și încearcă din nou.',
    emptyResponse: 'AI a returnat un răspuns gol. Încearcă din nou.',
  },
  hu: {
    loadingTitle: 'AI kereskedési elemzés',
    loadingSubtitle: 'A jelentés elkészítése előtt átnézzük ezt a sessiont',
    loadingStages: [
      'Kötések gyűjtése',
      'Minták felismerése',
      'Jelentés készítése',
    ],
    loadingDetails: [
      'Összegezzük a PnL-t, találati arányt, expectancy-t és tartási viselkedést.',
      'Átnézzük a végrehajtási fegyelmet, a kockázatkezelést és a kereskedési stílust.',
      'Előkészítjük a végső összefoglalót, javaslatokat és a megosztható jelentést.',
    ],
    roadmapTitle: 'Fejlesztési útiterv',
    roadmapSteps: [
      `Használd a [NinjaTrader](${SESSION_SUMMARY_LINKS.ninjaTrader}) szolgáltatást valós idejű szimulált adatokkal való gyakorláshoz.`,
      `Használd a [TradingView](${SESSION_SUMMARY_LINKS.tradingView}) felületét chartolásra és visszanézésre, miközben építed a rendszeredet.`,
      `Később használd az [OKX](${SESSION_SUMMARY_LINKS.okx}) / [Binance](${SESSION_SUMMARY_LINKS.binance}) platformokat kis tőkés validálásra alacsonyabb díjakkal.`,
    ],
    generating: 'Generálás...',
    reportTitle: 'AI kereskedési jelentés',
    reportCtaTitle: 'Kezdj el kereskedni most',
    reportCtaSubtitle: 'Szkenneld be a kockázatmentes gyakorláshoz',
    rateLimit:
      'Az AI elemzés elérte a kérések korlátját. Várj 10-20 másodpercet, majd próbáld újra.',
    emptyResponse: 'Az AI üres választ adott vissza. Próbáld újra.',
  },
  bg: {
    loadingTitle: 'AI анализ на търговията',
    loadingSubtitle: 'Преглеждаме тази сесия преди да създадем отчета',
    loadingStages: ['Събираме сделки', 'Откриваме модели', 'Създаваме отчет'],
    loadingDetails: [
      'Обобщаваме PnL, win rate, expectancy и поведението при задържане.',
      'Преглеждаме дисциплината на изпълнение, контрола на риска и стила на търговия.',
      'Подготвяме финалното резюме, препоръките и споделимия отчет.',
    ],
    roadmapTitle: 'План за подобрение',
    roadmapSteps: [
      `Използвайте [NinjaTrader](${SESSION_SUMMARY_LINKS.ninjaTrader}) за практика със симулирани данни в реално време.`,
      `Използвайте [TradingView](${SESSION_SUMMARY_LINKS.tradingView}) за наблюдение на графики и преглед на сделките, докато изграждате системата си.`,
      `Използвайте по-късно [OKX](${SESSION_SUMMARY_LINKS.okx}) / [Binance](${SESSION_SUMMARY_LINKS.binance}) за валидиране с малък капитал и по-ниски такси.`,
    ],
    generating: 'Генериране...',
    reportTitle: 'AI отчет за търговия',
    reportCtaTitle: 'Започнете да търгувате сега',
    reportCtaSubtitle: 'Сканирайте, за да тренирате без риск',
    rateLimit:
      'AI анализът достигна лимита на заявките. Изчакайте 10-20 секунди и опитайте отново.',
    emptyResponse: 'AI върна празен отговор. Опитайте отново.',
  },
  sk: {
    loadingTitle: 'AI analýza tradingu',
    loadingSubtitle: 'Kontrolujeme túto seansu pred vytvorením reportu',
    loadingStages: [
      'Zhromažďujeme obchody',
      'Hľadáme vzory',
      'Generujeme report',
    ],
    loadingDetails: [
      'Zhrnieme PnL, win rate, expectancy a správanie pri držaní pozícií.',
      'Kontrolujeme disciplínu exekúcie, riadenie rizika a štýl obchodovania.',
      'Pripravujeme finálne zhrnutie, odporúčania a report na zdieľanie.',
    ],
    roadmapTitle: 'Plán zlepšenia',
    roadmapSteps: [
      `Používajte [NinjaTrader](${SESSION_SUMMARY_LINKS.ninjaTrader}) na tréning so simulovanými dátami v reálnom čase.`,
      `Používajte [TradingView](${SESSION_SUMMARY_LINKS.tradingView}) na sledovanie grafov a spätné vyhodnotenie obchodov pri budovaní systému.`,
      `Neskôr použite [OKX](${SESSION_SUMMARY_LINKS.okx}) / [Binance](${SESSION_SUMMARY_LINKS.binance}) na validáciu s malým kapitálom a nižšími poplatkami.`,
    ],
    generating: 'Generovanie...',
    reportTitle: 'AI trading report',
    reportCtaTitle: 'Začnite obchodovať teraz',
    reportCtaSubtitle: 'Naskenujte a trénujte bez rizika',
    rateLimit:
      'AI analýza dosiahla limit požiadaviek. Počkajte 10-20 sekúnd a skúste to znova.',
    emptyResponse: 'AI vrátila prázdnu odpoveď. Skúste to znova.',
  },
  sl: {
    loadingTitle: 'AI analiza trgovanja',
    loadingSubtitle: 'Pregledujemo to sejo pred pripravo poročila',
    loadingStages: [
      'Zbiranje poslov',
      'Prepoznavanje vzorcev',
      'Priprava poročila',
    ],
    loadingDetails: [
      'Povzemamo PnL, uspešnost, expectancy in način držanja pozicij.',
      'Pregledujemo disciplino izvedbe, nadzor tveganja in slog trgovanja.',
      'Pripravljamo končni povzetek, predloge in poročilo za deljenje.',
    ],
    roadmapTitle: 'Načrt izboljšav',
    roadmapSteps: [
      `Uporabite [NinjaTrader](${SESSION_SUMMARY_LINKS.ninjaTrader}) za vadbo s simuliranimi podatki v realnem času.`,
      `Uporabite [TradingView](${SESSION_SUMMARY_LINKS.tradingView}) za spremljanje grafov in pregled poslov med gradnjo sistema.`,
      `Kasneje uporabite [OKX](${SESSION_SUMMARY_LINKS.okx}) / [Binance](${SESSION_SUMMARY_LINKS.binance}) za preverjanje z majhnim kapitalom in nižjimi stroški.`,
    ],
    generating: 'Ustvarjanje...',
    reportTitle: 'AI poročilo o trgovanju',
    reportCtaTitle: 'Začni trgovati zdaj',
    reportCtaSubtitle: 'Skeniraj za vadbo brez tveganja',
    rateLimit:
      'AI analiza je dosegla omejitev zahtevkov. Počakajte 10-20 sekund in poskusite znova.',
    emptyResponse: 'AI je vrnil prazen odgovor. Poskusite znova.',
  },
  sr: {
    loadingTitle: 'AI analiza trgovanja',
    loadingSubtitle: 'Pregledamo ovu sesiju pre izrade izveštaja',
    loadingStages: [
      'Prikupljanje trgovina',
      'Prepoznavanje obrazaca',
      'Generisanje izveštaja',
    ],
    loadingDetails: [
      'Sumiramo PnL, win rate, expectancy i ponašanje držanja pozicija.',
      'Pregledamo disciplinu izvršenja, kontrolu rizika i stil trgovanja.',
      'Pripremamo završni sažetak, preporuke i izveštaj za deljenje.',
    ],
    roadmapTitle: 'Plan unapređenja',
    roadmapSteps: [
      `Koristite [NinjaTrader](${SESSION_SUMMARY_LINKS.ninjaTrader}) za vežbu sa simuliranim podacima u realnom vremenu.`,
      `Koristite [TradingView](${SESSION_SUMMARY_LINKS.tradingView}) za praćenje grafikona i pregled trgovina dok gradite svoj sistem.`,
      `Kasnije koristite [OKX](${SESSION_SUMMARY_LINKS.okx}) / [Binance](${SESSION_SUMMARY_LINKS.binance}) za proveru sa malim kapitalom i nižim naknadama.`,
    ],
    generating: 'Generisanje...',
    reportTitle: 'AI izveštaj o trgovanju',
    reportCtaTitle: 'Počni da trguješ sada',
    reportCtaSubtitle: 'Skeniraj za vežbu bez rizika',
    rateLimit:
      'AI analiza je dostigla ograničenje zahteva. Sačekajte 10-20 sekundi i pokušajte ponovo.',
    emptyResponse: 'AI je vratio prazan odgovor. Pokušajte ponovo.',
  },
  ms: {
    loadingTitle: 'Analisis dagangan AI',
    loadingSubtitle: 'Menyemak sesi ini sebelum laporan dijana',
    loadingStages: ['Mengumpul dagangan', 'Mengesan corak', 'Menjana laporan'],
    loadingDetails: [
      'Merumuskan PnL, kadar kemenangan, expectancy dan corak pegangan posisi.',
      'Menyemak disiplin pelaksanaan, kawalan risiko dan gaya dagangan.',
      'Menyediakan ringkasan akhir, cadangan dan laporan untuk dikongsi.',
    ],
    roadmapTitle: 'Pelan penambahbaikan',
    roadmapSteps: [
      `Gunakan [NinjaTrader](${SESSION_SUMMARY_LINKS.ninjaTrader}) untuk berlatih dengan data simulasi masa nyata.`,
      `Gunakan [TradingView](${SESSION_SUMMARY_LINKS.tradingView}) untuk memerhati carta dan menyemak dagangan semasa membina sistem anda.`,
      `Gunakan [OKX](${SESSION_SUMMARY_LINKS.okx}) / [Binance](${SESSION_SUMMARY_LINKS.binance}) kemudian untuk pengesahan modal kecil dengan yuran lebih rendah.`,
    ],
    generating: 'Sedang menjana...',
    reportTitle: 'Laporan dagangan AI',
    reportCtaTitle: 'Mula berdagang sekarang',
    reportCtaSubtitle: 'Imbas untuk berlatih tanpa risiko',
    rateLimit:
      'Analisis AI mencapai had permintaan. Tunggu 10-20 saat dan cuba lagi.',
    emptyResponse: 'AI memulangkan respons kosong. Sila cuba lagi.',
  },
  bn: {
    loadingTitle: 'এআই ট্রেডিং বিশ্লেষণ',
    loadingSubtitle: 'রিপোর্ট তৈরির আগে এই সেশনটি পর্যালোচনা করা হচ্ছে',
    loadingStages: [
      'ট্রেড সংগ্রহ করা হচ্ছে',
      'প্যাটার্ন শনাক্ত করা হচ্ছে',
      'রিপোর্ট তৈরি করা হচ্ছে',
    ],
    loadingDetails: [
      'PnL, জয়ের হার, expectancy এবং পজিশন ধরে রাখার ধরন সংক্ষেপ করা হচ্ছে।',
      'এক্সিকিউশন শৃঙ্খলা, ঝুঁকি নিয়ন্ত্রণ এবং ট্রেডিং স্টাইল পর্যালোচনা করা হচ্ছে।',
      'চূড়ান্ত সারাংশ, পরামর্শ এবং শেয়ারযোগ্য রিপোর্ট প্রস্তুত করা হচ্ছে।',
    ],
    roadmapTitle: 'উন্নয়নের রোডম্যাপ',
    roadmapSteps: [
      `রিয়েল-টাইম সিমুলেটেড ডেটায় অনুশীলনের জন্য [NinjaTrader](${SESSION_SUMMARY_LINKS.ninjaTrader}) ব্যবহার করুন।`,
      `আপনার ট্রেডিং সিস্টেম গড়ে তুলতে বাজার দেখা এবং ট্রেড রিভিউয়ের জন্য [TradingView](${SESSION_SUMMARY_LINKS.tradingView}) ব্যবহার করুন।`,
      `কম ফিতে ছোট মূলধনে যাচাইয়ের জন্য পরে [OKX](${SESSION_SUMMARY_LINKS.okx}) / [Binance](${SESSION_SUMMARY_LINKS.binance}) ব্যবহার করুন।`,
    ],
    generating: 'তৈরি হচ্ছে...',
    reportTitle: 'এআই ট্রেডিং রিপোর্ট',
    reportCtaTitle: 'এখনই ট্রেডিং শুরু করুন',
    reportCtaSubtitle: 'ঝুঁকিমুক্ত অনুশীলনের জন্য স্ক্যান করুন',
    rateLimit:
      'এআই বিশ্লেষণের অনুরোধ সীমায় পৌঁছেছে। ১০-২০ সেকেন্ড অপেক্ষা করে আবার চেষ্টা করুন।',
    emptyResponse: 'এআই খালি প্রতিক্রিয়া দিয়েছে। আবার চেষ্টা করুন।',
  },
  ur: {
    loadingTitle: 'AI ٹریڈنگ تجزیہ',
    loadingSubtitle: 'رپورٹ بنانے سے پہلے اس سیشن کا جائزہ لیا جا رہا ہے',
    loadingStages: [
      'ٹریڈز جمع کیے جا رہے ہیں',
      'پیٹرن شناخت کیے جا رہے ہیں',
      'رپورٹ تیار کی جا رہی ہے',
    ],
    loadingDetails: [
      'PnL، جیت کی شرح، expectancy اور ہولڈنگ رویے کا خلاصہ بنایا جا رہا ہے۔',
      'ایگزیکیوشن ڈسپلن، رسک کنٹرول اور ٹریڈنگ انداز کا جائزہ لیا جا رہا ہے۔',
      'آخری خلاصہ، تجاویز اور شیئر کے قابل رپورٹ تیار کی جا رہی ہے۔',
    ],
    roadmapTitle: 'بہتری کا روڈمیپ',
    roadmapSteps: [
      `ریئل ٹائم simulated data کے ساتھ پریکٹس کے لیے [NinjaTrader](${SESSION_SUMMARY_LINKS.ninjaTrader}) استعمال کریں۔`,
      `اپنا ٹریڈنگ سسٹم بنانے کے دوران مارکیٹ دیکھنے اور ٹریڈ ریویو کے لیے [TradingView](${SESSION_SUMMARY_LINKS.tradingView}) استعمال کریں۔`,
      `بعد میں کم فیس کے ساتھ کم سرمائے کی جانچ کے لیے [OKX](${SESSION_SUMMARY_LINKS.okx}) / [Binance](${SESSION_SUMMARY_LINKS.binance}) استعمال کریں۔`,
    ],
    generating: 'تیار ہو رہا ہے...',
    reportTitle: 'AI ٹریڈنگ رپورٹ',
    reportCtaTitle: 'ابھی ٹریڈنگ شروع کریں',
    reportCtaSubtitle: 'بغیر خطرے کی مشق کے لیے اسکین کریں',
    rateLimit:
      'AI تجزیے کی درخواستیں حد تک پہنچ گئی ہیں۔ 10-20 سیکنڈ انتظار کریں اور دوبارہ کوشش کریں۔',
    emptyResponse: 'AI نے خالی جواب واپس کیا ہے۔ دوبارہ کوشش کریں۔',
  },
  ta: {
    loadingTitle: 'AI வர்த்தக பகுப்பாய்வு',
    loadingSubtitle: 'அறிக்கையை உருவாக்கும் முன் இந்த அமர்வு பரிசீலிக்கப்படுகிறது',
    loadingStages: [
      'பரிவர்த்தனைகள் சேகரிக்கப்படுகின்றன',
      'முறைகள் கண்டறியப்படுகின்றன',
      'அறிக்கை உருவாக்கப்படுகிறது',
    ],
    loadingDetails: [
      'PnL, வெற்றி வீதம், expectancy மற்றும் holding நடத்தை சுருக்கப்படுகிறது.',
      'செயல்பாட்டு ஒழுக்கம், அபாய கட்டுப்பாடு மற்றும் வர்த்தக பாணி பரிசீலிக்கப்படுகிறது.',
      'இறுதி சுருக்கம், பரிந்துரைகள் மற்றும் பகிரக்கூடிய அறிக்கை தயாரிக்கப்படுகிறது.',
    ],
    roadmapTitle: 'மேம்பாட்டு பாதைவரைபடம்',
    roadmapSteps: [
      `உண்மை நேர simulated data-யில் பயிற்சி செய்ய [NinjaTrader](${SESSION_SUMMARY_LINKS.ninjaTrader}) பயன்படுத்துங்கள்.`,
      `உங்கள் trading system-ஐ கட்டியமைக்க சந்தையை பார்க்கவும் trade review செய்யவும் [TradingView](${SESSION_SUMMARY_LINKS.tradingView}) பயன்படுத்துங்கள்.`,
      `பின்னர் குறைந்த கட்டணத்துடன் குறைந்த மூலதன சரிபார்ப்புக்காக [OKX](${SESSION_SUMMARY_LINKS.okx}) / [Binance](${SESSION_SUMMARY_LINKS.binance}) பயன்படுத்துங்கள்.`,
    ],
    generating: 'உருவாக்கப்படுகிறது...',
    reportTitle: 'AI வர்த்தக அறிக்கை',
    reportCtaTitle: 'இப்போதே வர்த்தகம் தொடங்குங்கள்',
    reportCtaSubtitle: 'அபாயமில்லா பயிற்சிக்காக ஸ்கேன் செய்யுங்கள்',
    rateLimit:
      'AI பகுப்பாய்வு கோரிக்கைகள் வரம்பை எட்டியுள்ளது. 10-20 விநாடிகள் காத்திருந்து மீண்டும் முயற்சிக்கவும்.',
    emptyResponse: 'AI காலியான பதிலைத் திருப்பியது. மீண்டும் முயற்சிக்கவும்.',
  },
  te: {
    loadingTitle: 'AI ట్రేడింగ్ విశ్లేషణ',
    loadingSubtitle: 'రిపోర్ట్ రూపొందించే ముందు ఈ సెషన్‌ను సమీక్షిస్తున్నాము',
    loadingStages: [
      'ట్రేడ్లు సేకరిస్తున్నాం',
      'ప్యాటర్న్లు గుర్తిస్తున్నాం',
      'రిపోర్ట్ రూపొందిస్తున్నాం',
    ],
    loadingDetails: [
      'PnL, గెలుపు శాతం, expectancy మరియు holding ప్రవర్తనను సారాంశం చేస్తున్నాం.',
      'ఎగ్జిక్యూషన్ క్రమశిక్షణ, రిస్క్ నియంత్రణ మరియు ట్రేడింగ్ శైలిని సమీక్షిస్తున్నాం.',
      'చివరి సారాంశం, సూచనలు మరియు షేర్ చేయగలిగే రిపోర్ట్‌ను సిద్ధం చేస్తున్నాం.',
    ],
    roadmapTitle: 'మెరుగుదల రోడ్‌మ్యాప్',
    roadmapSteps: [
      `రియల్‌టైమ్ simulated dataతో ప్రాక్టీస్ చేయడానికి [NinjaTrader](${SESSION_SUMMARY_LINKS.ninjaTrader}) ఉపయోగించండి.`,
      `మీ ట్రేడింగ్ సిస్టమ్‌ను నిర్మించడానికి మార్కెట్‌ను చూడటానికి మరియు ట్రేడ్‌లను సమీక్షించడానికి [TradingView](${SESSION_SUMMARY_LINKS.tradingView}) ఉపయోగించండి.`,
      `తరువాత తక్కువ ఫీజులతో చిన్న మూలధన ధృవీకరణ కోసం [OKX](${SESSION_SUMMARY_LINKS.okx}) / [Binance](${SESSION_SUMMARY_LINKS.binance}) ఉపయోగించండి.`,
    ],
    generating: 'రూపొందిస్తోంది...',
    reportTitle: 'AI ట్రేడింగ్ రిపోర్ట్',
    reportCtaTitle: 'ఇప్పుడే ట్రేడింగ్ ప్రారంభించండి',
    reportCtaSubtitle: 'రిస్క్‌లేని ప్రాక్టీస్ కోసం స్కాన్ చేయండి',
    rateLimit:
      'AI విశ్లేషణ అభ్యర్థనలు పరిమితిని చేరుకున్నాయి. 10-20 సెకన్లు ఆగి మళ్లీ ప్రయత్నించండి.',
    emptyResponse: 'AI ఖాళీ ప్రతిస్పందనను ఇచ్చింది. దయచేసి మళ్లీ ప్రయత్నించండి.',
  },
};

export function getSessionSummaryCopy(lang: string): SessionSummaryCopy {
  const exact = asSupportedLang(lang);
  if (exact) return copyByLang[exact];

  const detected = detectSupportedLang([lang]);
  if (detected) return copyByLang[detected];

  return copyByLang.en;
}
