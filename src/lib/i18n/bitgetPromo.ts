import type { SupportedLang } from '@/lib/languages';

export type BitgetPromoCopy = {
  title: string;
  description: string;
  accountLine: string;
  availability: string;
  productNote: string;
  disclosure: string;
  cta: string;
  copy: string;
  copied: string;
};

const EN_COPY: BitgetPromoCopy = {
  title: 'Crypto. Forex. Stocks. Gold.',
  description:
    'Explore multiple markets from one Bitget account—not just crypto.',
  accountLine: 'One account · Multiple markets',
  availability: 'Product availability varies by region.',
  productNote: 'Forex and gold may be offered as derivatives.',
  disclosure: 'Sponsored affiliate · Trading involves risk',
  cta: 'Explore Multi-Asset Trading',
  copy: 'Copy Bitget registration link',
  copied: 'Bitget registration link copied',
};

// Matches NinjaTrader's current localization coverage: 31 localized languages
// across all 39 site locale routes. Routes without a translation fall back to
// English until their existing NinjaTrader copy is localized as well.
const LOCALIZED_COPY: Partial<Record<SupportedLang, BitgetPromoCopy>> = {
  es: {
    title: 'Cripto. Forex. Acciones. Oro.',
    description:
      'Explora varios mercados desde una sola cuenta de Bitget, no solo cripto.',
    accountLine: 'Una cuenta · Múltiples mercados',
    availability: 'La disponibilidad de los productos varía según la región.',
    productNote: 'Forex y oro pueden ofrecerse como derivados.',
    disclosure: 'Enlace de afiliado patrocinado · Operar conlleva riesgos',
    cta: 'Explorar trading multiactivo',
    copy: 'Copiar enlace de registro de Bitget',
    copied: 'Enlace de registro de Bitget copiado',
  },
  pt: {
    title: 'Cripto. Forex. Ações. Ouro.',
    description:
      'Explore vários mercados com uma única conta Bitget, não apenas cripto.',
    accountLine: 'Uma conta · Vários mercados',
    availability: 'A disponibilidade dos produtos varia por região.',
    productNote: 'Forex e ouro podem ser oferecidos como derivativos.',
    disclosure: 'Link de afiliado patrocinado · Negociar envolve riscos',
    cta: 'Explorar trading multiativos',
    copy: 'Copiar link de cadastro da Bitget',
    copied: 'Link de cadastro da Bitget copiado',
  },
  fr: {
    title: 'Crypto. Forex. Actions. Or.',
    description:
      'Explorez plusieurs marchés depuis un seul compte Bitget, pas seulement la crypto.',
    accountLine: 'Un compte · Plusieurs marchés',
    availability: 'La disponibilité des produits varie selon les régions.',
    productNote:
      'Le forex et l’or peuvent être proposés sous forme de produits dérivés.',
    disclosure:
      'Lien d’affiliation sponsorisé · Le trading comporte des risques',
    cta: 'Explorer le trading multi-actifs',
    copy: 'Copier le lien d’inscription Bitget',
    copied: 'Lien d’inscription Bitget copié',
  },
  de: {
    title: 'Krypto. Forex. Aktien. Gold.',
    description:
      'Entdecke mehrere Märkte mit nur einem Bitget-Konto – nicht nur Krypto.',
    accountLine: 'Ein Konto · Mehrere Märkte',
    availability: 'Die Produktverfügbarkeit variiert je nach Region.',
    productNote: 'Forex und Gold können als Derivate angeboten werden.',
    disclosure: 'Gesponserter Affiliate-Link · Trading birgt Risiken',
    cta: 'Multi-Asset-Trading entdecken',
    copy: 'Bitget-Registrierungslink kopieren',
    copied: 'Bitget-Registrierungslink kopiert',
  },
  ru: {
    title: 'Криптовалюта. Форекс. Акции. Золото.',
    description:
      'Изучайте разные рынки с одного аккаунта Bitget, а не только криптовалюты.',
    accountLine: 'Один аккаунт · Несколько рынков',
    availability: 'Доступность продуктов зависит от региона.',
    productNote: 'Форекс и золото могут предлагаться в виде деривативов.',
    disclosure: 'Спонсорская партнёрская ссылка · Торговля связана с риском',
    cta: 'Изучить мультиактивную торговлю',
    copy: 'Скопировать ссылку регистрации Bitget',
    copied: 'Ссылка регистрации Bitget скопирована',
  },
  ja: {
    title: '暗号資産・FX・米国株・ゴールド',
    description:
      '暗号資産だけでなく、1つのBitgetアカウントから複数の市場を探索できます。',
    accountLine: '1つのアカウント · 複数の市場',
    availability: '利用できる商品は地域によって異なります。',
    productNote: 'FXとゴールドはデリバティブとして提供される場合があります。',
    disclosure: 'スポンサー付きアフィリエイト · 取引にはリスクがあります',
    cta: 'マルチアセット取引を見る',
    copy: 'Bitget登録リンクをコピー',
    copied: 'Bitget登録リンクをコピーしました',
  },
  ko: {
    title: '암호화폐 · 외환 · 주식 · 금',
    description:
      '암호화폐뿐 아니라 하나의 Bitget 계정으로 여러 시장을 살펴보세요.',
    accountLine: '하나의 계정 · 여러 시장',
    availability: '상품 이용 가능 여부는 지역에 따라 다릅니다.',
    productNote: '외환과 금은 파생상품으로 제공될 수 있습니다.',
    disclosure: '스폰서 제휴 링크 · 거래에는 위험이 따릅니다',
    cta: '멀티에셋 거래 살펴보기',
    copy: 'Bitget 가입 링크 복사',
    copied: 'Bitget 가입 링크가 복사되었습니다',
  },
  'zh-Hans': {
    title: '加密资产、外汇、美股、黄金',
    description: '一个 Bitget 账户，探索多个交易市场，不止于加密货币。',
    accountLine: '一个账户 · 多个市场',
    availability: '产品可用性因地区而异。',
    productNote: '外汇与黄金可能以衍生品形式提供。',
    disclosure: '赞助联盟链接 · 交易有风险',
    cta: '探索多资产交易',
    copy: '复制 Bitget 注册链接',
    copied: '已复制 Bitget 注册链接',
  },
  'zh-Hant': {
    title: '加密資產、外匯、美股、黃金',
    description: '一個 Bitget 帳戶，探索多個交易市場，不止於加密貨幣。',
    accountLine: '一個帳戶 · 多個市場',
    availability: '產品可用性因地區而異。',
    productNote: '外匯與黃金可能以衍生品形式提供。',
    disclosure: '贊助聯盟連結 · 交易有風險',
    cta: '探索多資產交易',
    copy: '複製 Bitget 註冊連結',
    copied: '已複製 Bitget 註冊連結',
  },
  ar: {
    title: 'العملات الرقمية، الفوركس، الأسهم، الذهب',
    description:
      'استكشف أسواقًا متعددة من حساب Bitget واحد، وليس العملات الرقمية فقط.',
    accountLine: 'حساب واحد · أسواق متعددة',
    availability: 'يختلف توفر المنتجات حسب المنطقة.',
    productNote: 'قد يتم تقديم الفوركس والذهب في صورة مشتقات.',
    disclosure: 'رابط شراكة ممول · التداول ينطوي على مخاطر',
    cta: 'استكشف تداول الأصول المتعددة',
    copy: 'نسخ رابط التسجيل في Bitget',
    copied: 'تم نسخ رابط التسجيل في Bitget',
  },
  it: {
    title: 'Crypto. Forex. Azioni. Oro.',
    description:
      'Esplora più mercati da un unico conto Bitget, non solo crypto.',
    accountLine: 'Un conto · Più mercati',
    availability: 'La disponibilità dei prodotti varia in base alla regione.',
    productNote: 'Forex e oro possono essere offerti come derivati.',
    disclosure: 'Link affiliato sponsorizzato · Il trading comporta rischi',
    cta: 'Esplora il trading multi-asset',
    copy: 'Copia il link di registrazione Bitget',
    copied: 'Link di registrazione Bitget copiato',
  },
  nl: {
    title: 'Crypto. Forex. Aandelen. Goud.',
    description:
      'Ontdek meerdere markten vanuit één Bitget-account, niet alleen crypto.',
    accountLine: 'Eén account · Meerdere markten',
    availability: 'De beschikbaarheid van producten verschilt per regio.',
    productNote: 'Forex en goud kunnen als derivaten worden aangeboden.',
    disclosure:
      'Gesponsorde affiliatelink · Handelen brengt risico’s met zich mee',
    cta: 'Ontdek multi-asset trading',
    copy: 'Bitget-registratielink kopiëren',
    copied: 'Bitget-registratielink gekopieerd',
  },
  pl: {
    title: 'Kryptowaluty. Forex. Akcje. Złoto.',
    description:
      'Poznaj wiele rynków z jednego konta Bitget, nie tylko kryptowaluty.',
    accountLine: 'Jedno konto · Wiele rynków',
    availability: 'Dostępność produktów zależy od regionu.',
    productNote: 'Forex i złoto mogą być oferowane jako instrumenty pochodne.',
    disclosure: 'Sponsorowany link partnerski · Handel wiąże się z ryzykiem',
    cta: 'Poznaj handel wieloma aktywami',
    copy: 'Kopiuj link rejestracyjny Bitget',
    copied: 'Skopiowano link rejestracyjny Bitget',
  },
  tr: {
    title: 'Kripto. Forex. Hisse Senetleri. Altın.',
    description:
      'Yalnızca kripto değil, tek bir Bitget hesabıyla birden fazla piyasayı keşfedin.',
    accountLine: 'Tek hesap · Birden fazla piyasa',
    availability: 'Ürün kullanılabilirliği bölgeye göre değişir.',
    productNote: 'Forex ve altın türev ürünler olarak sunulabilir.',
    disclosure: 'Sponsorlu ortaklık bağlantısı · Alım satım risk içerir',
    cta: 'Çoklu varlık işlemlerini keşfet',
    copy: 'Bitget kayıt bağlantısını kopyala',
    copied: 'Bitget kayıt bağlantısı kopyalandı',
  },
  vi: {
    title: 'Crypto. Forex. Cổ phiếu. Vàng.',
    description:
      'Khám phá nhiều thị trường từ một tài khoản Bitget, không chỉ crypto.',
    accountLine: 'Một tài khoản · Nhiều thị trường',
    availability: 'Sản phẩm khả dụng tùy theo khu vực.',
    productNote: 'Forex và vàng có thể được cung cấp dưới dạng phái sinh.',
    disclosure: 'Liên kết tiếp thị được tài trợ · Giao dịch có rủi ro',
    cta: 'Khám phá giao dịch đa tài sản',
    copy: 'Sao chép liên kết đăng ký Bitget',
    copied: 'Đã sao chép liên kết đăng ký Bitget',
  },
  th: {
    title: 'คริปโต ฟอเร็กซ์ หุ้น ทองคำ',
    description: 'สำรวจหลายตลาดผ่านบัญชี Bitget บัญชีเดียว ไม่ใช่แค่คริปโต',
    accountLine: 'บัญชีเดียว · หลายตลาด',
    availability: 'ผลิตภัณฑ์ที่ให้บริการแตกต่างกันไปตามภูมิภาค',
    productNote: 'ฟอเร็กซ์และทองคำอาจให้บริการในรูปแบบตราสารอนุพันธ์',
    disclosure: 'ลิงก์พันธมิตรที่ได้รับการสนับสนุน · การเทรดมีความเสี่ยง',
    cta: 'สำรวจการเทรดหลายสินทรัพย์',
    copy: 'คัดลอกลิงก์สมัคร Bitget',
    copied: 'คัดลอกลิงก์สมัคร Bitget แล้ว',
  },
  id: {
    title: 'Kripto. Forex. Saham. Emas.',
    description:
      'Jelajahi berbagai pasar dari satu akun Bitget, bukan hanya kripto.',
    accountLine: 'Satu akun · Berbagai pasar',
    availability: 'Ketersediaan produk berbeda menurut wilayah.',
    productNote: 'Forex dan emas dapat ditawarkan sebagai derivatif.',
    disclosure: 'Tautan afiliasi bersponsor · Trading memiliki risiko',
    cta: 'Jelajahi trading multi-aset',
    copy: 'Salin tautan pendaftaran Bitget',
    copied: 'Tautan pendaftaran Bitget disalin',
  },
  hi: {
    title: 'क्रिप्टो। फॉरेक्स। स्टॉक्स। गोल्ड।',
    description: 'सिर्फ़ क्रिप्टो नहीं—एक Bitget अकाउंट से कई बाज़ारों को एक्सप्लोर करें।',
    accountLine: 'एक अकाउंट · कई बाज़ार',
    availability: 'प्रोडक्ट की उपलब्धता क्षेत्र के अनुसार अलग होती है।',
    productNote: 'फॉरेक्स और गोल्ड डेरिवेटिव के रूप में उपलब्ध हो सकते हैं।',
    disclosure: 'प्रायोजित एफिलिएट लिंक · ट्रेडिंग में जोखिम है',
    cta: 'मल्टी-एसेट ट्रेडिंग एक्सप्लोर करें',
    copy: 'Bitget रजिस्ट्रेशन लिंक कॉपी करें',
    copied: 'Bitget रजिस्ट्रेशन लिंक कॉपी हो गया',
  },
  he: {
    title: 'קריפטו, פורקס, מניות וזהב',
    description: 'גלו כמה שווקים מחשבון Bitget אחד, ולא רק קריפטו.',
    accountLine: 'חשבון אחד · כמה שווקים',
    availability: 'זמינות המוצרים משתנה לפי אזור.',
    productNote: 'פורקס וזהב עשויים להיות מוצעים כנגזרים.',
    disclosure: 'קישור שותפים ממומן · המסחר כרוך בסיכון',
    cta: 'גלו מסחר במספר נכסים',
    copy: 'העתקת קישור ההרשמה ל-Bitget',
    copied: 'קישור ההרשמה ל-Bitget הועתק',
  },
  fa: {
    title: 'رمزارز، فارکس، سهام و طلا',
    description:
      'از یک حساب Bitget به چندین بازار دسترسی پیدا کنید، نه فقط رمزارز.',
    accountLine: 'یک حساب · چندین بازار',
    availability: 'دسترسی به محصولات بسته به منطقه متفاوت است.',
    productNote: 'فارکس و طلا ممکن است به‌صورت مشتقه ارائه شوند.',
    disclosure: 'پیوند همکاری مالی · معامله با ریسک همراه است',
    cta: 'معاملات چنددارایی را کاوش کنید',
    copy: 'کپی پیوند ثبت‌نام Bitget',
    copied: 'پیوند ثبت‌نام Bitget کپی شد',
  },
  uk: {
    title: 'Крипто. Форекс. Акції. Золото.',
    description:
      'Відкривайте різні ринки з одного акаунта Bitget, а не лише криптовалюти.',
    accountLine: 'Один акаунт · Кілька ринків',
    availability: 'Доступність продуктів залежить від регіону.',
    productNote: 'Форекс і золото можуть пропонуватися як деривативи.',
    disclosure:
      'Спонсорське партнерське посилання · Торгівля пов’язана з ризиком',
    cta: 'Відкрити мультиактивну торгівлю',
    copy: 'Копіювати посилання реєстрації Bitget',
    copied: 'Посилання реєстрації Bitget скопійовано',
  },
  cs: {
    title: 'Krypto. Forex. Akcie. Zlato.',
    description: 'Objevte více trhů z jednoho účtu Bitget, nejen kryptoměny.',
    accountLine: 'Jeden účet · Více trhů',
    availability: 'Dostupnost produktů se liší podle regionu.',
    productNote: 'Forex a zlato mohou být nabízeny jako deriváty.',
    disclosure: 'Sponzorovaný partnerský odkaz · Obchodování zahrnuje riziko',
    cta: 'Prozkoumat multi-asset trading',
    copy: 'Kopírovat registrační odkaz Bitget',
    copied: 'Registrační odkaz Bitget zkopírován',
  },
  sv: {
    title: 'Krypto. Forex. Aktier. Guld.',
    description:
      'Utforska flera marknader från ett enda Bitget-konto, inte bara krypto.',
    accountLine: 'Ett konto · Flera marknader',
    availability: 'Produkttillgängligheten varierar beroende på region.',
    productNote: 'Forex och guld kan erbjudas som derivat.',
    disclosure: 'Sponsrad affiliatelänk · Handel innebär risk',
    cta: 'Utforska handel med flera tillgångar',
    copy: 'Kopiera Bitget-registreringslänk',
    copied: 'Bitget-registreringslänk kopierad',
  },
  no: {
    title: 'Krypto. Valuta. Aksjer. Gull.',
    description:
      'Utforsk flere markeder fra én Bitget-konto, ikke bare krypto.',
    accountLine: 'Én konto · Flere markeder',
    availability: 'Produkttilgjengeligheten varierer etter region.',
    productNote: 'Valuta og gull kan tilbys som derivater.',
    disclosure: 'Sponset affiliatelenke · Handel innebærer risiko',
    cta: 'Utforsk handel med flere aktiva',
    copy: 'Kopier registreringslenken til Bitget',
    copied: 'Registreringslenken til Bitget er kopiert',
  },
  da: {
    title: 'Krypto. Forex. Aktier. Guld.',
    description: 'Udforsk flere markeder fra én Bitget-konto, ikke kun krypto.',
    accountLine: 'Én konto · Flere markeder',
    availability: 'Produkttilgængeligheden varierer efter region.',
    productNote: 'Forex og guld kan tilbydes som derivater.',
    disclosure: 'Sponsoreret affiliatelink · Handel indebærer risiko',
    cta: 'Udforsk handel med flere aktiver',
    copy: 'Kopiér Bitget-registreringslink',
    copied: 'Bitget-registreringslink kopieret',
  },
  fi: {
    title: 'Krypto. Valuuttakauppa. Osakkeet. Kulta.',
    description:
      'Tutustu useisiin markkinoihin yhdellä Bitget-tilillä, ei vain kryptoon.',
    accountLine: 'Yksi tili · Useita markkinoita',
    availability: 'Tuotteiden saatavuus vaihtelee alueittain.',
    productNote: 'Valuuttakauppa ja kulta voidaan tarjota johdannaisina.',
    disclosure: 'Sponsoroitu kumppanilinkki · Kaupankäyntiin liittyy riskejä',
    cta: 'Tutustu usean omaisuuslajin kaupankäyntiin',
    copy: 'Kopioi Bitget-rekisteröitymislinkki',
    copied: 'Bitget-rekisteröitymislinkki kopioitu',
  },
  el: {
    title: 'Crypto. Forex. Μετοχές. Χρυσός.',
    description:
      'Εξερεύνησε πολλές αγορές από έναν λογαριασμό Bitget, όχι μόνο crypto.',
    accountLine: 'Ένας λογαριασμός · Πολλές αγορές',
    availability: 'Η διαθεσιμότητα προϊόντων διαφέρει ανά περιοχή.',
    productNote: 'Το forex και ο χρυσός μπορεί να προσφέρονται ως παράγωγα.',
    disclosure:
      'Χορηγούμενος σύνδεσμος συνεργάτη · Οι συναλλαγές ενέχουν κίνδυνο',
    cta: 'Εξερεύνησε το multi-asset trading',
    copy: 'Αντιγραφή συνδέσμου εγγραφής Bitget',
    copied: 'Ο σύνδεσμος εγγραφής Bitget αντιγράφηκε',
  },
  ro: {
    title: 'Crypto. Forex. Acțiuni. Aur.',
    description:
      'Explorează mai multe piețe dintr-un singur cont Bitget, nu doar crypto.',
    accountLine: 'Un cont · Mai multe piețe',
    availability: 'Disponibilitatea produselor variază în funcție de regiune.',
    productNote:
      'Forex și aurul pot fi oferite sub formă de instrumente derivate.',
    disclosure: 'Link afiliat sponsorizat · Tranzacționarea implică riscuri',
    cta: 'Explorează tranzacționarea multi-asset',
    copy: 'Copiază linkul de înregistrare Bitget',
    copied: 'Linkul de înregistrare Bitget a fost copiat',
  },
  hu: {
    title: 'Kripto. Forex. Részvények. Arany.',
    description:
      'Fedezz fel több piacot egyetlen Bitget-fiókból, ne csak kriptót.',
    accountLine: 'Egy fiók · Több piac',
    availability: 'A termékek elérhetősége régiónként eltérő.',
    productNote: 'A forex és az arany származtatott termékként lehet elérhető.',
    disclosure: 'Szponzorált partnerlink · A kereskedés kockázattal jár',
    cta: 'Fedezd fel a többeszközös kereskedést',
    copy: 'Bitget regisztrációs link másolása',
    copied: 'Bitget regisztrációs link másolva',
  },
  ms: {
    title: 'Kripto. Forex. Saham. Emas.',
    description:
      'Terokai pelbagai pasaran melalui satu akaun Bitget, bukan kripto sahaja.',
    accountLine: 'Satu akaun · Pelbagai pasaran',
    availability: 'Ketersediaan produk berbeza mengikut rantau.',
    productNote: 'Forex dan emas mungkin ditawarkan sebagai derivatif.',
    disclosure: 'Pautan ahli gabungan ditaja · Perdagangan melibatkan risiko',
    cta: 'Terokai perdagangan pelbagai aset',
    copy: 'Salin pautan pendaftaran Bitget',
    copied: 'Pautan pendaftaran Bitget disalin',
  },
};

export function getBitgetPromoCopy(lang: SupportedLang): BitgetPromoCopy {
  return LOCALIZED_COPY[lang] ?? EN_COPY;
}
