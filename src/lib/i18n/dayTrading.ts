import type { SupportedLang } from '@/lib/languages';

export type DayTradingCopy = {
  overlayTitle: string;
  overlaySubtitle: string;
  randomMarket: string;
  baseLabel: string;
};

export const dayTradingCopyByLang: Record<SupportedLang, DayTradingCopy> = {
  en: {
    overlayTitle: 'Free Day Trading Simulator',
    overlaySubtitle:
      'Practice day trading on historical 5-minute crypto and forex charts.\nNo signup or real money.',
    randomMarket: 'Random market',
    baseLabel: 'base',
  },
  es: {
    overlayTitle: 'Simulador de day trading gratis',
    overlaySubtitle:
      'Practica day trading con gráficos históricos de 5 minutos de criptomonedas y forex.\nSin registro ni dinero real.',
    randomMarket: 'Mercado aleatorio',
    baseLabel: 'base',
  },
  pt: {
    overlayTitle: 'Simulador de day trade grátis',
    overlaySubtitle:
      'Pratique day trade em gráficos históricos de 5 minutos de cripto e forex.\nSem cadastro nem dinheiro real.',
    randomMarket: 'Mercado aleatório',
    baseLabel: 'base',
  },
  fr: {
    overlayTitle: 'Simulateur de day trading gratuit',
    overlaySubtitle:
      'Entraînez-vous au day trading sur des graphiques historiques de 5 minutes de crypto et de forex.\nSans inscription ni argent réel.',
    randomMarket: 'Marché aléatoire',
    baseLabel: 'base',
  },
  de: {
    overlayTitle: 'Kostenloser Daytrading-Simulator',
    overlaySubtitle:
      'Übe Daytrading mit historischen 5-Minuten-Charts für Krypto und Forex.\nOhne Anmeldung oder echtes Geld.',
    randomMarket: 'Zufälliger Markt',
    baseLabel: 'Basis',
  },
  ru: {
    overlayTitle: 'Бесплатный симулятор дневной торговли',
    overlaySubtitle:
      'Практикуйте дневную торговлю на исторических 5-минутных графиках криптовалют и форекс.\nБез регистрации и реальных денег.',
    randomMarket: 'Случайный рынок',
    baseLabel: 'база',
  },
  ja: {
    overlayTitle: '無料デイトレードシミュレーター',
    overlaySubtitle:
      '暗号資産とFXの過去5分足チャートでデイトレードを練習できます。\n登録も実資金も不要です。',
    randomMarket: 'ランダム市場',
    baseLabel: '基準足',
  },
  ko: {
    overlayTitle: '무료 데이 트레이딩 시뮬레이터',
    overlaySubtitle:
      '암호화폐와 외환의 과거 5분 차트로 데이 트레이딩을 연습하세요.\n가입이나 실제 자금이 필요하지 않습니다.',
    randomMarket: '무작위 시장',
    baseLabel: '기준',
  },
  'zh-Hans': {
    overlayTitle: '免费日内交易模拟器',
    overlaySubtitle:
      '使用加密货币和外汇历史 5 分钟K线练习日内交易。\n无需注册或使用真实资金。',
    randomMarket: '随机市场',
    baseLabel: '基础周期',
  },
  'zh-Hant': {
    overlayTitle: '免費日內交易模擬器',
    overlaySubtitle:
      '使用加密貨幣和外匯歷史 5 分鐘K線練習日內交易。\n免註冊且無需使用真實資金。',
    randomMarket: '隨機市場',
    baseLabel: '基礎週期',
  },
  ar: {
    overlayTitle: 'محاكي تداول يومي مجاني',
    overlaySubtitle:
      'تدرّب على التداول اليومي باستخدام رسوم تاريخية من فئة 5 دقائق للعملات المشفرة والفوركس.\nدون تسجيل أو أموال حقيقية.',
    randomMarket: 'سوق عشوائي',
    baseLabel: 'أساسي',
  },
  it: {
    overlayTitle: 'Simulatore di day trading gratuito',
    overlaySubtitle:
      'Esercitati nel day trading su grafici storici a 5 minuti di criptovalute e forex.\nSenza registrazione o denaro reale.',
    randomMarket: 'Mercato casuale',
    baseLabel: 'base',
  },
  nl: {
    overlayTitle: 'Gratis daytradingsimulator',
    overlaySubtitle:
      'Oefen daytrading op historische 5-minutengrafieken voor crypto en forex.\nZonder registratie of echt geld.',
    randomMarket: 'Willekeurige markt',
    baseLabel: 'basis',
  },
  pl: {
    overlayTitle: 'Darmowy symulator day tradingu',
    overlaySubtitle:
      'Ćwicz day trading na historycznych 5-minutowych wykresach kryptowalut i forex.\nBez rejestracji i prawdziwych pieniędzy.',
    randomMarket: 'Losowy rynek',
    baseLabel: 'baza',
  },
  tr: {
    overlayTitle: 'Ücretsiz günlük işlem simülatörü',
    overlaySubtitle:
      'Geçmiş 5 dakikalık kripto ve forex grafiklerinde günlük işlem pratiği yapın.\nKayıt veya gerçek para gerekmez.',
    randomMarket: 'Rastgele piyasa',
    baseLabel: 'temel',
  },
  vi: {
    overlayTitle: 'Trình mô phỏng giao dịch trong ngày miễn phí',
    overlaySubtitle:
      'Luyện giao dịch trong ngày trên biểu đồ lịch sử 5 phút của tiền mã hóa và forex.\nKhông cần đăng ký hay tiền thật.',
    randomMarket: 'Thị trường ngẫu nhiên',
    baseLabel: 'cơ sở',
  },
  th: {
    overlayTitle: 'โปรแกรมจำลองเดย์เทรดฟรี',
    overlaySubtitle:
      'ฝึกเดย์เทรดด้วยกราฟคริปโตและฟอเร็กซ์ย้อนหลัง 5 นาที\nไม่ต้องสมัครหรือใช้เงินจริง',
    randomMarket: 'ตลาดแบบสุ่ม',
    baseLabel: 'ฐาน',
  },
  id: {
    overlayTitle: 'Simulator day trading gratis',
    overlaySubtitle:
      'Latih day trading pada grafik historis 5 menit untuk kripto dan forex.\nTanpa pendaftaran atau uang sungguhan.',
    randomMarket: 'Pasar acak',
    baseLabel: 'dasar',
  },
  hi: {
    overlayTitle: 'मुफ़्त डे ट्रेडिंग सिम्युलेटर',
    overlaySubtitle:
      'क्रिप्टो और फॉरेक्स के ऐतिहासिक 5-मिनट चार्ट पर डे ट्रेडिंग का अभ्यास करें।\nसाइन अप या असली पैसे की जरूरत नहीं।',
    randomMarket: 'यादृच्छिक बाज़ार',
    baseLabel: 'आधार',
  },
  he: {
    overlayTitle: 'סימולטור מסחר יומי חינמי',
    overlaySubtitle:
      'תרגלו מסחר יומי בגרפים היסטוריים של 5 דקות בקריפטו ובפורקס.\nללא הרשמה או כסף אמיתי.',
    randomMarket: 'שוק אקראי',
    baseLabel: 'בסיס',
  },
  fa: {
    overlayTitle: 'شبیه‌ساز رایگان معاملات روزانه',
    overlaySubtitle:
      'معاملات روزانه را روی نمودارهای تاریخی ۵ دقیقه‌ای کریپتو و فارکس تمرین کنید.\nبدون ثبت‌نام یا پول واقعی.',
    randomMarket: 'بازار تصادفی',
    baseLabel: 'پایه',
  },
  uk: {
    overlayTitle: 'Безкоштовний симулятор денної торгівлі',
    overlaySubtitle:
      'Практикуйте денну торгівлю на історичних 5-хвилинних графіках криптовалют і форекс.\nБез реєстрації та реальних грошей.',
    randomMarket: 'Випадковий ринок',
    baseLabel: 'база',
  },
  cs: {
    overlayTitle: 'Bezplatný simulátor denního obchodování',
    overlaySubtitle:
      'Procvičujte denní obchodování na historických 5minutových grafech kryptoměn a forexu.\nBez registrace a skutečných peněz.',
    randomMarket: 'Náhodný trh',
    baseLabel: 'základ',
  },
  sv: {
    overlayTitle: 'Gratis daytradingsimulator',
    overlaySubtitle:
      'Öva daytrading på historiska 5-minutersdiagram för krypto och forex.\nUtan registrering eller riktiga pengar.',
    randomMarket: 'Slumpmässig marknad',
    baseLabel: 'bas',
  },
  no: {
    overlayTitle: 'Gratis daytradingsimulator',
    overlaySubtitle:
      'Øv på daytrading med historiske 5-minuttersdiagrammer for krypto og valuta.\nUten registrering eller ekte penger.',
    randomMarket: 'Tilfeldig marked',
    baseLabel: 'basis',
  },
  da: {
    overlayTitle: 'Gratis daytradingsimulator',
    overlaySubtitle:
      'Øv daytrading på historiske 5-minuttersgrafer for krypto og forex.\nUden tilmelding eller rigtige penge.',
    randomMarket: 'Tilfældigt marked',
    baseLabel: 'basis',
  },
  fi: {
    overlayTitle: 'Ilmainen päiväkauppasimulaattori',
    overlaySubtitle:
      'Harjoittele päiväkauppaa krypton ja forexin historiallisilla 5 minuutin kaavioilla.\nEi rekisteröitymistä tai oikeaa rahaa.',
    randomMarket: 'Satunnainen markkina',
    baseLabel: 'perusta',
  },
  el: {
    overlayTitle: 'Δωρεάν προσομοιωτής ημερήσιων συναλλαγών',
    overlaySubtitle:
      'Εξασκηθείτε στις ημερήσιες συναλλαγές με ιστορικά διαγράμματα 5 λεπτών για κρυπτονομίσματα και forex.\nΧωρίς εγγραφή ή πραγματικά χρήματα.',
    randomMarket: 'Τυχαία αγορά',
    baseLabel: 'βάση',
  },
  ro: {
    overlayTitle: 'Simulator gratuit de day trading',
    overlaySubtitle:
      'Exersează day trading pe grafice istorice de 5 minute pentru cripto și forex.\nFără înregistrare sau bani reali.',
    randomMarket: 'Piață aleatorie',
    baseLabel: 'bază',
  },
  hu: {
    overlayTitle: 'Ingyenes napon belüli kereskedési szimulátor',
    overlaySubtitle:
      'Gyakorold a napon belüli kereskedést kripto- és forexpiacok történelmi 5 perces grafikonjain.\nRegisztráció és valódi pénz nélkül.',
    randomMarket: 'Véletlenszerű piac',
    baseLabel: 'alap',
  },
  bg: {
    overlayTitle: 'Безплатен симулатор за дневна търговия',
    overlaySubtitle:
      'Практикувайте дневна търговия с исторически 5-минутни графики за крипто и форекс.\nБез регистрация и реални пари.',
    randomMarket: 'Случаен пазар',
    baseLabel: 'основа',
  },
  sk: {
    overlayTitle: 'Bezplatný simulátor denného obchodovania',
    overlaySubtitle:
      'Precvičujte denné obchodovanie na historických 5-minútových grafoch kryptomien a forexu.\nBez registrácie a skutočných peňazí.',
    randomMarket: 'Náhodný trh',
    baseLabel: 'základ',
  },
  sl: {
    overlayTitle: 'Brezplačni simulator dnevnega trgovanja',
    overlaySubtitle:
      'Vadite dnevno trgovanje na zgodovinskih 5-minutnih grafih kriptovalut in forexa.\nBrez registracije ali pravega denarja.',
    randomMarket: 'Naključni trg',
    baseLabel: 'osnova',
  },
  sr: {
    overlayTitle: 'Бесплатни симулатор дневног трговања',
    overlaySubtitle:
      'Вежбајте дневно трговање на историјским 5-минутним графиконима криптовалута и форекса.\nБез регистрације или правог новца.',
    randomMarket: 'Насумично тржиште',
    baseLabel: 'основа',
  },
  ms: {
    overlayTitle: 'Simulator dagangan harian percuma',
    overlaySubtitle:
      'Berlatih dagangan harian pada carta sejarah 5 minit kripto dan forex.\nTanpa pendaftaran atau wang sebenar.',
    randomMarket: 'Pasaran rawak',
    baseLabel: 'asas',
  },
  bn: {
    overlayTitle: 'বিনামূল্যের ডে ট্রেডিং সিমুলেটর',
    overlaySubtitle:
      'ক্রিপ্টো ও ফরেক্সের ঐতিহাসিক ৫-মিনিট চার্টে ডে ট্রেডিং অনুশীলন করুন।\nসাইন আপ বা আসল অর্থের প্রয়োজন নেই।',
    randomMarket: 'এলোমেলো বাজার',
    baseLabel: 'ভিত্তি',
  },
  ur: {
    overlayTitle: 'مفت ڈے ٹریڈنگ سمیولیٹر',
    overlaySubtitle:
      'کرپٹو اور فاریکس کے تاریخی 5 منٹ کے چارٹس پر ڈے ٹریڈنگ کی مشق کریں۔\nسائن اپ یا حقیقی رقم کی ضرورت نہیں۔',
    randomMarket: 'تصادفی مارکیٹ',
    baseLabel: 'بنیاد',
  },
  ta: {
    overlayTitle: 'இலவச நாள் வர்த்தக சிமுலேட்டர்',
    overlaySubtitle:
      'கிரிப்டோ மற்றும் ஃபாரெக்ஸ் வரலாற்று 5 நிமிட விளக்கப்படங்களில் நாள் வர்த்தகத்தைப் பயிற்சி செய்யுங்கள்.\nபதிவு அல்லது உண்மைப் பணம் தேவையில்லை.',
    randomMarket: 'சீரற்ற சந்தை',
    baseLabel: 'அடிப்படை',
  },
  te: {
    overlayTitle: 'ఉచిత డే ట్రేడింగ్ సిమ్యులేటర్',
    overlaySubtitle:
      'క్రిప్టో మరియు ఫారెక్స్ చారిత్రక 5 నిమిషాల చార్ట్‌లపై డే ట్రేడింగ్ సాధన చేయండి.\nసైన్ అప్ లేదా నిజమైన డబ్బు అవసరం లేదు.',
    randomMarket: 'యాదృచ్ఛిక మార్కెట్',
    baseLabel: 'ఆధారం',
  },
};

export function getDayTradingCopy(lang: SupportedLang): DayTradingCopy {
  return dayTradingCopyByLang[lang] || dayTradingCopyByLang.en;
}

export function getDayTradingMeta(lang: SupportedLang) {
  const copy = getDayTradingCopy(lang);
  return {
    title: `${copy.overlayTitle} | ChartMini`,
    description: copy.overlaySubtitle.replace(/\s*\n\s*/g, ' '),
  };
}
