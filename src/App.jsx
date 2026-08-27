import React, { useState, useMemo } from "react";
import { runTestPiPayment, runPiAuth } from "./piPayment.js";
import {
  Search, Heart, MapPin, ChevronLeft, ChevronRight, ChevronDown, Plus, Home as HomeIcon,
  Grid3x3, MessageCircle, User, Smartphone, Sofa, Shirt, Car, Building2,
  Baby, Dumbbell, Wrench, Gem, Briefcase, X, Star, ShieldCheck, Languages,
  PawPrint, Sparkles, Truck, Check, Flag, ArrowUpDown, Send, Wallet, SlidersHorizontal, Scale, Bell
} from "lucide-react";

/* ---------------- Brand identity (from color palette) ---------------- */

const GOLD = "#FED758";        // golden yellow — primary accent (CTAs, prices, active states)
const GOLD_LIGHT = "#FCE49A";  // pale yellow — light gradient partner
const GOLD_DEEP = "#208DAE";   // dark teal — deep gradient partner / secondary
const TEAL_ACCENT = "#2BBBD7"; // bright cyan — trust badges, Pi wallet accent
const BLACK = "#0A2027";       // near-black teal — base background
const CHARCOAL = "#123641";    // dark teal — secondary background
const PANEL = "#0F2E37";       // dark teal — modal/panel background
const CREAM = "#F3EFE6";       // warm off-white — text on dark

/* ---------------- Data ---------------- */

const CITIES = [
  { id: "tripoli", ar: "طرابلس", en: "Tripoli" },
  { id: "benghazi", ar: "بنغازي", en: "Benghazi" },
  { id: "misrata", ar: "مصراتة", en: "Misrata" },
  { id: "zawiya", ar: "الزاوية", en: "Zawiya" },
  { id: "sabha", ar: "سبها", en: "Sabha" },
  { id: "zliten", ar: "زليتن", en: "Zliten" },
  { id: "ajdabiya", ar: "أجدابيا", en: "Ajdabiya" },
  { id: "tobruk", ar: "طبرق", en: "Tobruk" },
  { id: "sirte", ar: "سرت", en: "Sirte" },
  { id: "bayda", ar: "البيضاء", en: "Al Bayda" },
  { id: "derna", ar: "درنة", en: "Derna" },
  { id: "zintan", ar: "الزنتان", en: "Zintan" },
];

const DISTRICTS_BY_CITY = {
  tripoli: [
    { id: "nofliyeen", ar: "النوفليين", en: "Nofliyeen" },
    { id: "ghout_shaal", ar: "غوط الشعال", en: "Ghout Shaal" },
    { id: "hay_andalus", ar: "حي الأندلس", en: "Hai Andalus" },
    { id: "serraj", ar: "السراج", en: "Serraj" },
    { id: "ain_zara", ar: "عين زارة", en: "Ain Zara" },
    { id: "tajura", ar: "تاجوراء", en: "Tajura" },
    { id: "janzour", ar: "جنزور", en: "Janzour" },
    { id: "fashloum", ar: "فشلوم", en: "Fashloum" },
    { id: "souq_juma", ar: "سوق الجمعة", en: "Souq Al Jumaa" },
    { id: "dahra", ar: "الظهرة", en: "Dahra" },
    { id: "gorgaresh", ar: "قرقارش", en: "Gorgaresh" },
    { id: "abu_salim", ar: "أبو سليم", en: "Abu Salim" },
    { id: "hadaba", ar: "الهضبة", en: "Hadaba" },
    { id: "bab_ben_ghashir", ar: "باب بن غشير", en: "Bab Ben Ghashir" },
  ],
  benghazi: [
    { id: "sabri", ar: "الصابري", en: "Sabri" },
    { id: "berka", ar: "البركة", en: "Berka" },
    { id: "sidi_hussein", ar: "سيدي حسين", en: "Sidi Hussein" },
    { id: "fuwayhat", ar: "الفويهات", en: "Fuwayhat" },
    { id: "laithi", ar: "الليثي", en: "Laithi" },
    { id: "bouhdima", ar: "بوهديمة", en: "Bouhdima" },
    { id: "keesh", ar: "الكيش", en: "Keesh" },
    { id: "sidi_khalifa", ar: "سيدي خليفة", en: "Sidi Khalifa" },
    { id: "qaryounis", ar: "قاريونس", en: "Qaryounis" },
    { id: "hay_dollar", ar: "حي دولار", en: "Hai Dollar" },
  ],
  misrata: [
    { id: "zorouq", ar: "الزروق", en: "Zorouq" },
    { id: "qasr_ahmad", ar: "قصر أحمد", en: "Qasr Ahmad" },
    { id: "ghiran", ar: "الغيران", en: "Ghiran" },
    { id: "tawama", ar: "توامة", en: "Tawama" },
    { id: "dafniya", ar: "الدافنية", en: "Dafniya" },
    { id: "karareem", ar: "كرارم", en: "Karareem" },
  ],
  zawiya: [
    { id: "zawiya_center", ar: "وسط المدينة", en: "City Center" },
    { id: "mashtal", ar: "المشتل", en: "Mashtal" },
    { id: "zawiya_sahel", ar: "الساحل", en: "Sahel" },
    { id: "bir_shuaib", ar: "بئر الشعيب", en: "Bir Shuaib" },
  ],
};

const CATEGORIES = [
  {
    id: "vehicles", ar: "مركبات", en: "Vehicles", icon: Car,
    subcats: [
      { id: "cars", ar: "سيارات للبيع", en: "Cars for Sale" },
      { id: "motorcycles", ar: "دراجات نارية", en: "Motorcycles" },
      { id: "trucks", ar: "شاحنات ومعدات ثقيلة", en: "Trucks & Heavy Equipment" },
      { id: "parts", ar: "قطع غيار واكسسوارات", en: "Parts & Accessories" },
      { id: "marine", ar: "قوارب ومعدات بحرية", en: "Boats & Marine" },
      { id: "rental", ar: "تأجير سيارات", en: "Car Rental" },
    ],
  },
  {
    id: "realestate", ar: "عقارات", en: "Real Estate", icon: Building2,
    subcats: [
      { id: "apt_sale", ar: "شقق للبيع", en: "Apartments for Sale" },
      { id: "apt_rent", ar: "شقق للإيجار", en: "Apartments for Rent" },
      { id: "villas_sale", ar: "فلل ومنازل للبيع", en: "Villas & Houses for Sale" },
      { id: "villas_rent", ar: "فلل ومنازل للإيجار", en: "Villas & Houses for Rent" },
      { id: "land", ar: "أراضٍ", en: "Land" },
      { id: "offices_sale", ar: "مكاتب ومحلات للبيع", en: "Offices & Shops for Sale" },
      { id: "offices_rent", ar: "مكاتب ومحلات للإيجار", en: "Offices & Shops for Rent" },
    ],
  },
  {
    id: "electronics", ar: "إلكترونيات وموبايلات", en: "Electronics & Mobiles", icon: Smartphone,
    subcats: [
      { id: "smartphones", ar: "هواتف ذكية", en: "Smartphones" },
      { id: "watches_wearables", ar: "ساعات ذكية وإكسسوارات", en: "Smartwatches & Wearables" },
      { id: "computers", ar: "أجهزة كمبيوتر ولابتوب", en: "Computers & Laptops" },
      { id: "tvs", ar: "تلفزيونات وشاشات", en: "TVs & Screens" },
      { id: "cameras", ar: "تصوير وكاميرات", en: "Cameras" },
    ],
  },
  {
    id: "furniture", ar: "أثاث ومنزل", en: "Furniture & Home", icon: Sofa,
    subcats: [
      { id: "living_room", ar: "غرف نوم وصالونات", en: "Bedroom & Living Room" },
      { id: "kitchens", ar: "مطابخ", en: "Kitchens" },
      { id: "appliances", ar: "أجهزة منزلية", en: "Home Appliances" },
      { id: "decor", ar: "ديكور ومفروشات", en: "Décor & Textiles" },
    ],
  },
  {
    id: "fashion", ar: "أزياء وموضة", en: "Fashion", icon: Shirt,
    subcats: [
      { id: "men", ar: "ملابس رجالية", en: "Men's Clothing" },
      { id: "women", ar: "ملابس نسائية", en: "Women's Clothing" },
      { id: "shoes_bags", ar: "أحذية وحقائب", en: "Shoes & Bags" },
      { id: "accessories", ar: "ساعات وإكسسوارات", en: "Watches & Accessories" },
    ],
  },
  {
    id: "jobs_services", ar: "وظائف وخدمات", en: "Jobs & Services", icon: Briefcase,
    subcats: [
      { id: "jobs", ar: "وظائف شاغرة", en: "Job Openings" },
      { id: "trade_services", ar: "خدمات حرفية", en: "Skilled Trade Services" },
      { id: "tutoring", ar: "دروس خصوصية", en: "Private Tutoring" },
      { id: "tech_services", ar: "خدمات تقنية", en: "Tech Services" },
    ],
  },
  {
    id: "kids", ar: "أطفال وحوامل", en: "Kids & Maternity", icon: Baby,
    subcats: [
      { id: "kids_clothing", ar: "ملابس أطفال", en: "Kids Clothing" },
      { id: "toys", ar: "ألعاب", en: "Toys" },
      { id: "strollers", ar: "عربات وكراسي أطفال", en: "Strollers & Car Seats" },
    ],
  },
  {
    id: "sports", ar: "رياضة وترفيه", en: "Sports & Leisure", icon: Dumbbell,
    subcats: [
      { id: "sports_gear", ar: "معدات رياضية", en: "Sports Equipment" },
      { id: "bicycles", ar: "دراجات هوائية", en: "Bicycles" },
      { id: "camping_fishing", ar: "صيد وتخييم", en: "Fishing & Camping" },
    ],
  },
  {
    id: "jewelry", ar: "مجوهرات وساعات", en: "Jewelry & Watches", icon: Gem,
    subcats: [
      { id: "gold", ar: "ذهب", en: "Gold" },
      { id: "silver", ar: "فضة", en: "Silver" },
      { id: "luxury_watches", ar: "ساعات فاخرة", en: "Luxury Watches" },
    ],
  },
  {
    id: "beauty", ar: "الصحة والتجميل", en: "Health & Beauty", icon: Sparkles,
    subcats: [
      { id: "perfumes", ar: "عطور", en: "Perfumes" },
      { id: "makeup", ar: "مكياج", en: "Makeup" },
      { id: "skincare", ar: "عناية بالبشرة", en: "Skincare" },
    ],
  },
  {
    id: "animals_plants", ar: "حيوانات ونباتات", en: "Animals & Plants", icon: PawPrint,
    subcats: [
      { id: "pet_supplies", ar: "مستلزمات الحيوانات", en: "Pet Supplies" },
      { id: "animals_sale", ar: "حيوانات للبيع", en: "Animals for Sale" },
      { id: "plants", ar: "نباتات الزينة", en: "Ornamental Plants" },
    ],
  },
  {
    id: "business", ar: "تجاري ومعدات", en: "Business & Equipment", icon: Wrench,
    subcats: [
      { id: "office_equipment", ar: "معدات مكتبية", en: "Office Equipment" },
      { id: "machinery", ar: "آلات ومعدات صناعية", en: "Industrial Machinery" },
      { id: "restaurant_supplies", ar: "مستلزمات مطاعم", en: "Restaurant Supplies" },
    ],
  },
];

/* ---------------- Category-specific search filters ---------------- */

const COND_OPTS = [{ id: "new", ar: "جديد", en: "New" }, { id: "used", ar: "مستعمل", en: "Used" }];

const CAR_BRANDS = [
  { id: "toyota", ar: "تويوتا", en: "Toyota" }, { id: "hyundai", ar: "هيونداي", en: "Hyundai" },
  { id: "kia", ar: "كيا", en: "Kia" }, { id: "mercedes", ar: "مرسيدس بنز", en: "Mercedes-Benz" },
  { id: "bmw", ar: "بي إم دبليو", en: "BMW" }, { id: "nissan", ar: "نيسان", en: "Nissan" },
  { id: "chevrolet", ar: "شيفروليه", en: "Chevrolet" }, { id: "ford", ar: "فورد", en: "Ford" },
  { id: "honda", ar: "هوندا", en: "Honda" }, { id: "volkswagen", ar: "فولكس واجن", en: "Volkswagen" },
  { id: "peugeot", ar: "بيجو", en: "Peugeot" }, { id: "renault", ar: "رينو", en: "Renault" },
  { id: "mitsubishi", ar: "ميتسوبيشي", en: "Mitsubishi" }, { id: "suzuki", ar: "سوزوكي", en: "Suzuki" },
  { id: "mazda", ar: "مازدا", en: "Mazda" }, { id: "audi", ar: "أودي", en: "Audi" },
  { id: "lexus", ar: "لكزس", en: "Lexus" }, { id: "jeep", ar: "جيب", en: "Jeep" },
  { id: "landrover", ar: "لاند روفر", en: "Land Rover" }, { id: "chery", ar: "شيري", en: "Chery" },
  { id: "geely", ar: "جيلي", en: "Geely" }, { id: "opel", ar: "أوبل", en: "Opel" },
  { id: "fiat", ar: "فيات", en: "Fiat" }, { id: "skoda", ar: "سكودا", en: "Skoda" },
  { id: "seat", ar: "سيات", en: "Seat" }, { id: "volvo", ar: "فولفو", en: "Volvo" },
  { id: "porsche", ar: "بورش", en: "Porsche" }, { id: "mini", ar: "ميني", en: "Mini" },
  { id: "infiniti", ar: "إنفينيتي", en: "Infiniti" }, { id: "haval", ar: "هافال", en: "Haval" },
  { id: "mg", ar: "إم جي", en: "MG" }, { id: "byd", ar: "بي واي دي", en: "BYD" },
  { id: "jac", ar: "جاك", en: "JAC" }, { id: "isuzu", ar: "إيسوزو", en: "Isuzu" },
  { id: "dodge", ar: "دودج", en: "Dodge" }, { id: "chrysler", ar: "كرايسلر", en: "Chrysler" },
  { id: "cadillac", ar: "كاديلاك", en: "Cadillac" }, { id: "gmc", ar: "جي إم سي", en: "GMC" },
  { id: "subaru", ar: "سوبارو", en: "Subaru" }, { id: "citroen", ar: "سيتروين", en: "Citroën" },
  { id: "daihatsu", ar: "دايهاتسو", en: "Daihatsu" }, { id: "changan", ar: "شانجان", en: "Changan" },
  { id: "other", ar: "أخرى", en: "Other" },
];

const MODELS_BY_BRAND_VEHICLES = {
  toyota: ["Corolla", "Camry", "Yaris", "RAV4", "Land Cruiser", "Prado", "Hilux", "Fortuner", "Avalon", "Highlander", "Fj Cruiser", "Rush", "C-HR"],
  hyundai: ["Elantra", "Sonata", "Accent", "Tucson", "Santa Fe", "Creta", "i10", "i20", "Palisade", "Venue", "Azera"],
  kia: ["Cerato", "Optima", "Rio", "Sportage", "Sorento", "Picanto", "Seltos", "Carnival", "Soul", "Telluride"],
  mercedes: ["C-Class", "E-Class", "S-Class", "GLC", "GLE", "GLA", "A-Class", "G-Class", "CLA", "GLS"],
  bmw: ["3 Series", "5 Series", "7 Series", "X1", "X3", "X5", "X6", "2 Series", "4 Series"],
  nissan: ["Sunny", "Altima", "Sentra", "Patrol", "X-Trail", "Qashqai", "Navara", "Maxima", "Kicks", "Juke"],
  chevrolet: ["Cruze", "Malibu", "Captiva", "Tahoe", "Silverado", "Spark", "Trailblazer", "Camaro", "Optra"],
  ford: ["Focus", "Fusion", "Explorer", "F-150", "EcoSport", "Edge", "Mustang", "Expedition", "Ranger"],
  honda: ["Civic", "Accord", "CR-V", "City", "Pilot", "HR-V", "Odyssey"],
  volkswagen: ["Golf", "Passat", "Jetta", "Tiguan", "Touareg", "Polo", "Atlas"],
  peugeot: ["208", "301", "2008", "3008", "508", "5008", "408"],
  renault: ["Logan", "Duster", "Megane", "Symbol", "Clio", "Koleos", "Kadjar"],
  mitsubishi: ["Lancer", "Pajero", "Outlander", "ASX", "Eclipse Cross", "L200"],
  suzuki: ["Swift", "Vitara", "Baleno", "Ertiga", "Jimny", "Ciaz"],
  mazda: ["Mazda3", "Mazda6", "CX-5", "CX-9", "CX-30"],
  audi: ["A3", "A4", "A6", "Q3", "Q5", "Q7", "Q8"],
  lexus: ["ES", "LS", "RX", "LX", "GX", "NX", "IS"],
  jeep: ["Wrangler", "Grand Cherokee", "Cherokee", "Compass", "Renegade"],
  landrover: ["Range Rover", "Discovery", "Defender", "Evoque", "Velar"],
  chery: ["Tiggo 7", "Tiggo 8", "Arrizo 5", "Tiggo 4"],
  geely: ["Coolray", "Emgrand", "Azkarra", "Okavango"],
  opel: ["Astra", "Corsa", "Insignia", "Mokka"],
  fiat: ["Tipo", "500", "Panda", "Punto"],
  skoda: ["Octavia", "Superb", "Kodiaq", "Fabia"],
  seat: ["Leon", "Ibiza", "Ateca"],
  volvo: ["XC40", "XC60", "XC90", "S60"],
  porsche: ["Cayenne", "Macan", "911", "Panamera"],
  mini: ["Cooper", "Countryman", "Clubman"],
  infiniti: ["Q50", "QX60", "QX80"],
  haval: ["H6", "Jolion", "H9"],
  mg: ["MG5", "MG6", "ZS", "HS"],
  byd: ["F3", "Song", "Atto 3", "Han"],
  jac: ["J4", "J7", "S3"],
  isuzu: ["D-Max", "MU-X"],
  dodge: ["Charger", "Challenger", "Durango"],
  chrysler: ["300", "Pacifica"],
  cadillac: ["Escalade", "XT5"],
  gmc: ["Yukon", "Sierra"],
  subaru: ["Forester", "Outback", "XV"],
  citroen: ["C3", "C4", "C-Elysee"],
  daihatsu: ["Terios", "Sirion"],
  changan: ["CS35", "CS75", "Eado"],
};

const ELEC_BRANDS = [
  { id: "apple", ar: "Apple", en: "Apple" }, { id: "samsung", ar: "Samsung", en: "Samsung" },
  { id: "huawei", ar: "Huawei", en: "Huawei" }, { id: "xiaomi", ar: "Xiaomi", en: "Xiaomi" },
  { id: "oppo", ar: "Oppo", en: "Oppo" }, { id: "realme", ar: "Realme", en: "Realme" },
  { id: "infinix", ar: "Infinix", en: "Infinix" }, { id: "tecno", ar: "Tecno", en: "Tecno" },
  { id: "oneplus", ar: "OnePlus", en: "OnePlus" }, { id: "vivo", ar: "Vivo", en: "Vivo" },
  { id: "honor", ar: "Honor", en: "Honor" }, { id: "nokia", ar: "Nokia", en: "Nokia" },
  { id: "google", ar: "Google Pixel", en: "Google Pixel" }, { id: "sony", ar: "Sony", en: "Sony" },
  { id: "lg", ar: "LG", en: "LG" }, { id: "other", ar: "أخرى", en: "Other" },
];

const MODELS_BY_BRAND_ELECTRONICS = {
  apple: ["iPhone 11", "iPhone 12", "iPhone 13", "iPhone 13 Pro", "iPhone 14", "iPhone 14 Pro", "iPhone 15", "iPhone 15 Pro", "iPhone 16", "iPhone SE", "iPad", "MacBook Air", "MacBook Pro"],
  samsung: ["Galaxy S21", "Galaxy S22", "Galaxy S23", "Galaxy S24", "Galaxy A54", "Galaxy A34", "Galaxy Note 20", "Galaxy Z Flip", "Galaxy Z Fold", "Galaxy Tab"],
  huawei: ["P50", "P60", "Mate 50", "Mate X", "Nova 11", "Nova 9"],
  xiaomi: ["Redmi Note 12", "Redmi Note 13", "Mi 11", "Poco X5", "Poco F5", "Xiaomi 13"],
  oppo: ["Reno 8", "Reno 10", "A78", "Find X6"],
  realme: ["Realme 10", "Realme 11", "GT Neo"],
  infinix: ["Note 30", "Hot 40", "Zero 30"],
  tecno: ["Camon 20", "Spark 10", "Phantom X2"],
  oneplus: ["OnePlus 11", "OnePlus Nord", "OnePlus 10T"],
  vivo: ["V27", "Y36", "X90"],
  honor: ["Honor 90", "Honor Magic5", "Honor X9"],
  nokia: ["Nokia G42", "Nokia 3210", "Nokia X30"],
  google: ["Pixel 7", "Pixel 8", "Pixel 8 Pro"],
  sony: ["Xperia 1", "Xperia 5"],
  lg: ["LG Velvet", "LG Wing"],
};

const MODEL_MAPS = { cars: MODELS_BY_BRAND_VEHICLES, smartphones: MODELS_BY_BRAND_ELECTRONICS };

const MOTO_BRANDS = [
  { id: "honda", ar: "هوندا", en: "Honda" }, { id: "yamaha", ar: "ياماها", en: "Yamaha" },
  { id: "suzuki", ar: "سوزوكي", en: "Suzuki" }, { id: "kawasaki", ar: "كاواساكي", en: "Kawasaki" },
  { id: "harley", ar: "هارلي ديفيدسون", en: "Harley-Davidson" }, { id: "bajaj", ar: "باجاج", en: "Bajaj" },
  { id: "ktm", ar: "كي تي إم", en: "KTM" }, { id: "other", ar: "أخرى", en: "Other" },
];
const TRUCK_BRANDS = [
  { id: "mercedes", ar: "مرسيدس", en: "Mercedes" }, { id: "volvo", ar: "فولفو", en: "Volvo" },
  { id: "man", ar: "مان", en: "MAN" }, { id: "scania", ar: "سكانيا", en: "Scania" },
  { id: "isuzu", ar: "إيسوزو", en: "Isuzu" }, { id: "fuso", ar: "ميتسوبيشي فوسو", en: "Mitsubishi Fuso" },
  { id: "iveco", ar: "إيفيكو", en: "Iveco" }, { id: "other", ar: "أخرى", en: "Other" },
];
const CAMERA_BRANDS = [
  { id: "canon", ar: "كانون", en: "Canon" }, { id: "nikon", ar: "نيكون", en: "Nikon" },
  { id: "sony", ar: "سوني", en: "Sony" }, { id: "fujifilm", ar: "فوجي فيلم", en: "Fujifilm" },
  { id: "gopro", ar: "جو برو", en: "GoPro" }, { id: "other", ar: "أخرى", en: "Other" },
];
const COMPUTER_BRANDS = [
  { id: "dell", ar: "ديل", en: "Dell" }, { id: "hp", ar: "إتش بي", en: "HP" },
  { id: "lenovo", ar: "لينوفو", en: "Lenovo" }, { id: "apple", ar: "Apple", en: "Apple" },
  { id: "asus", ar: "أسوس", en: "Asus" }, { id: "acer", ar: "إيسر", en: "Acer" }, { id: "other", ar: "أخرى", en: "Other" },
];
const TV_BRANDS = [
  { id: "samsung", ar: "سامسونج", en: "Samsung" }, { id: "lg", ar: "إل جي", en: "LG" },
  { id: "sony", ar: "سوني", en: "Sony" }, { id: "tcl", ar: "TCL", en: "TCL" },
  { id: "hisense", ar: "هايسنس", en: "Hisense" }, { id: "other", ar: "أخرى", en: "Other" },
];
const WEARABLE_BRANDS = [
  { id: "apple", ar: "Apple", en: "Apple" }, { id: "samsung", ar: "Samsung", en: "Samsung" },
  { id: "huawei", ar: "Huawei", en: "Huawei" }, { id: "garmin", ar: "جارمن", en: "Garmin" }, { id: "other", ar: "أخرى", en: "Other" },
];
const LUXURY_WATCH_BRANDS = [
  { id: "rolex", ar: "رولكس", en: "Rolex" }, { id: "omega", ar: "أوميغا", en: "Omega" },
  { id: "cartier", ar: "كارتييه", en: "Cartier" }, { id: "casio", ar: "كاسيو", en: "Casio" }, { id: "other", ar: "أخرى", en: "Other" },
];

const SUBCAT_FILTERS = {
  /* ---- vehicles ---- */
  cars: [
    { id: "bodyType", type: "select", label: { ar: "نوع السيارة", en: "Body Type" }, options: [
      { id: "sedan", ar: "سيدان", en: "Sedan" }, { id: "suv", ar: "دفع رباعي (SUV)", en: "SUV" },
      { id: "hatchback", ar: "هاتشباك", en: "Hatchback" }, { id: "pickup", ar: "بيك أب", en: "Pickup" },
      { id: "van", ar: "فان", en: "Van" }, { id: "coupe", ar: "كوبيه", en: "Coupe" }, { id: "other", ar: "أخرى", en: "Other" },
    ] },
    { id: "brand", type: "select", label: { ar: "الماركة", en: "Brand" }, options: CAR_BRANDS },
    { id: "model", type: "text", label: { ar: "الموديل", en: "Model" } },
    { id: "year", type: "range", label: { ar: "سنة الصنع", en: "Year" }, min: 1990, max: 2026 },
    { id: "condition", type: "select", label: { ar: "حالة السيارة", en: "Condition" }, options: COND_OPTS },
    { id: "mileage", type: "range", label: { ar: "عداد المشي (كم)", en: "Mileage (km)" }, min: 0, max: 300000 },
    { id: "transmission", type: "select", label: { ar: "ناقل الحركة", en: "Transmission" }, options: [
      { id: "automatic", ar: "أوتوماتيك", en: "Automatic" }, { id: "manual", ar: "عادي (مانيوال)", en: "Manual" },
    ] },
    { id: "fuelType", type: "select", label: { ar: "نوع الوقود", en: "Fuel Type" }, options: [
      { id: "petrol", ar: "بنزين", en: "Petrol" }, { id: "diesel", ar: "ديزل", en: "Diesel" },
      { id: "hybrid", ar: "هايبرد", en: "Hybrid" }, { id: "electric", ar: "كهربائي", en: "Electric" },
    ] },
  ],
  motorcycles: [
    { id: "brand", type: "select", label: { ar: "الماركة", en: "Brand" }, options: MOTO_BRANDS },
    { id: "model", type: "text", label: { ar: "الموديل", en: "Model" } },
    { id: "year", type: "range", label: { ar: "سنة الصنع", en: "Year" }, min: 1990, max: 2026 },
    { id: "engineCC", type: "select", label: { ar: "سعة المحرك", en: "Engine Size" }, options: [
      { id: "under125", ar: "أقل من 125cc", en: "Under 125cc" }, { id: "125-500", ar: "125-500cc", en: "125-500cc" },
      { id: "over500", ar: "أكثر من 500cc", en: "Over 500cc" },
    ] },
    { id: "condition", type: "select", label: { ar: "الحالة", en: "Condition" }, options: COND_OPTS },
  ],
  trucks: [
    { id: "brand", type: "select", label: { ar: "الماركة", en: "Brand" }, options: TRUCK_BRANDS },
    { id: "model", type: "text", label: { ar: "الموديل", en: "Model" } },
    { id: "truckType", type: "select", label: { ar: "نوع المركبة", en: "Vehicle Type" }, options: [
      { id: "flatbed", ar: "نقل عام", en: "Flatbed" }, { id: "tanker", ar: "صهريج", en: "Tanker" },
      { id: "trailer", ar: "مقطورة", en: "Trailer" }, { id: "crane", ar: "ونش/كرين", en: "Crane" }, { id: "other", ar: "أخرى", en: "Other" },
    ] },
    { id: "year", type: "range", label: { ar: "سنة الصنع", en: "Year" }, min: 1985, max: 2026 },
    { id: "condition", type: "select", label: { ar: "الحالة", en: "Condition" }, options: COND_OPTS },
  ],
  parts: [
    { id: "partType", type: "select", label: { ar: "نوع القطعة", en: "Part Type" }, options: [
      { id: "engine", ar: "محرك", en: "Engine" }, { id: "body", ar: "هيكل وبودي", en: "Body" },
      { id: "electrical", ar: "كهرباء", en: "Electrical" }, { id: "tires", ar: "إطارات", en: "Tires" },
      { id: "interior", ar: "داخلية", en: "Interior" }, { id: "other", ar: "أخرى", en: "Other" },
    ] },
    { id: "compatibleBrand", type: "select", label: { ar: "متوافقة مع ماركة", en: "Compatible Brand" }, options: CAR_BRANDS },
    { id: "condition", type: "select", label: { ar: "الحالة", en: "Condition" }, options: COND_OPTS },
  ],
  marine: [
    { id: "boatType", type: "select", label: { ar: "نوع القارب", en: "Boat Type" }, options: [
      { id: "fishing", ar: "قارب صيد", en: "Fishing Boat" }, { id: "yacht", ar: "يخت", en: "Yacht" },
      { id: "jetski", ar: "جت سكي", en: "Jet Ski" }, { id: "other", ar: "أخرى", en: "Other" },
    ] },
    { id: "engineType", type: "select", label: { ar: "نوع المحرك", en: "Engine" }, options: [
      { id: "inboard", ar: "داخلي", en: "Inboard" }, { id: "outboard", ar: "خارجي", en: "Outboard" }, { id: "none", ar: "بدون محرك", en: "None" },
    ] },
    { id: "year", type: "range", label: { ar: "سنة الصنع", en: "Year" }, min: 1990, max: 2026 },
    { id: "condition", type: "select", label: { ar: "الحالة", en: "Condition" }, options: COND_OPTS },
  ],
  rental: [
    { id: "rentalPeriod", type: "select", label: { ar: "مدة التأجير", en: "Rental Period" }, options: [
      { id: "daily", ar: "يومي", en: "Daily" }, { id: "weekly", ar: "أسبوعي", en: "Weekly" }, { id: "monthly", ar: "شهري", en: "Monthly" },
    ] },
    { id: "withDriver", type: "select", label: { ar: "مع سائق", en: "With Driver" }, options: [
      { id: "yes", ar: "مع سائق", en: "With driver" }, { id: "no", ar: "بدون سائق", en: "Self-drive" },
    ] },
    { id: "brand", type: "select", label: { ar: "الماركة", en: "Brand" }, options: CAR_BRANDS },
  ],

  /* ---- real estate ---- */
  apt_sale: [
    { id: "rooms", type: "select", label: { ar: "عدد الغرف", en: "Rooms" }, options: [
      { id: "studio", ar: "استوديو", en: "Studio" }, { id: "1", ar: "1", en: "1" }, { id: "2", ar: "2", en: "2" },
      { id: "3", ar: "3", en: "3" }, { id: "4", ar: "4", en: "4" }, { id: "5+", ar: "5+", en: "5+" },
    ] },
    { id: "bathrooms", type: "select", label: { ar: "عدد الحمامات", en: "Bathrooms" }, options: [
      { id: "1", ar: "1", en: "1" }, { id: "2", ar: "2", en: "2" }, { id: "3", ar: "3", en: "3" }, { id: "4+", ar: "4+", en: "4+" },
    ] },
    { id: "area", type: "range", label: { ar: "المساحة (م²)", en: "Area (m²)" }, min: 20, max: 1000 },
    { id: "floor", type: "select", label: { ar: "الطابق", en: "Floor" }, options: [
      { id: "ground", ar: "أرضي", en: "Ground" }, { id: "1-3", ar: "1-3", en: "1-3" },
      { id: "4-6", ar: "4-6", en: "4-6" }, { id: "7+", ar: "7+", en: "7+" }, { id: "penthouse", ar: "روف", en: "Penthouse" },
    ] },
    { id: "furnished", type: "select", label: { ar: "التأثيث", en: "Furnishing" }, options: [
      { id: "furnished", ar: "مفروش", en: "Furnished" }, { id: "unfurnished", ar: "غير مفروش", en: "Unfurnished" },
    ] },
  ],
  apt_rent: [
    { id: "rooms", type: "select", label: { ar: "عدد الغرف", en: "Rooms" }, options: [
      { id: "studio", ar: "استوديو", en: "Studio" }, { id: "1", ar: "1", en: "1" }, { id: "2", ar: "2", en: "2" },
      { id: "3", ar: "3", en: "3" }, { id: "4+", ar: "4+", en: "4+" },
    ] },
    { id: "bathrooms", type: "select", label: { ar: "عدد الحمامات", en: "Bathrooms" }, options: [
      { id: "1", ar: "1", en: "1" }, { id: "2", ar: "2", en: "2" }, { id: "3+", ar: "3+", en: "3+" },
    ] },
    { id: "area", type: "range", label: { ar: "المساحة (م²)", en: "Area (m²)" }, min: 20, max: 1000 },
    { id: "furnished", type: "select", label: { ar: "التأثيث", en: "Furnishing" }, options: [
      { id: "furnished", ar: "مفروش", en: "Furnished" }, { id: "unfurnished", ar: "غير مفروش", en: "Unfurnished" },
    ] },
    { id: "leaseTerm", type: "select", label: { ar: "مدة العقد", en: "Lease Term" }, options: [
      { id: "daily", ar: "يومي", en: "Daily" }, { id: "monthly", ar: "شهري", en: "Monthly" }, { id: "yearly", ar: "سنوي", en: "Yearly" },
    ] },
  ],
  villas_sale: [
    { id: "rooms", type: "select", label: { ar: "عدد الغرف", en: "Rooms" }, options: [
      { id: "3", ar: "3", en: "3" }, { id: "4", ar: "4", en: "4" }, { id: "5", ar: "5", en: "5" }, { id: "6+", ar: "6+", en: "6+" },
    ] },
    { id: "bathrooms", type: "select", label: { ar: "عدد الحمامات", en: "Bathrooms" }, options: [
      { id: "1", ar: "1", en: "1" }, { id: "2", ar: "2", en: "2" }, { id: "3", ar: "3", en: "3" }, { id: "4+", ar: "4+", en: "4+" },
    ] },
    { id: "area", type: "range", label: { ar: "المساحة (م²)", en: "Area (m²)" }, min: 100, max: 3000 },
    { id: "floorsCount", type: "select", label: { ar: "عدد الطوابق", en: "Floors" }, options: [
      { id: "1", ar: "طابق واحد", en: "1 Floor" }, { id: "2", ar: "طابقين", en: "2 Floors" }, { id: "3+", ar: "3+ طوابق", en: "3+ Floors" },
    ] },
    { id: "garden", type: "select", label: { ar: "حديقة", en: "Garden" }, options: [
      { id: "yes", ar: "يوجد", en: "Yes" }, { id: "no", ar: "لا يوجد", en: "No" },
    ] },
  ],
  villas_rent: [
    { id: "rooms", type: "select", label: { ar: "عدد الغرف", en: "Rooms" }, options: [
      { id: "3", ar: "3", en: "3" }, { id: "4", ar: "4", en: "4" }, { id: "5", ar: "5", en: "5" }, { id: "6+", ar: "6+", en: "6+" },
    ] },
    { id: "bathrooms", type: "select", label: { ar: "عدد الحمامات", en: "Bathrooms" }, options: [
      { id: "1", ar: "1", en: "1" }, { id: "2", ar: "2", en: "2" }, { id: "3", ar: "3", en: "3" }, { id: "4+", ar: "4+", en: "4+" },
    ] },
    { id: "area", type: "range", label: { ar: "المساحة (م²)", en: "Area (m²)" }, min: 100, max: 3000 },
    { id: "garden", type: "select", label: { ar: "حديقة", en: "Garden" }, options: [
      { id: "yes", ar: "يوجد", en: "Yes" }, { id: "no", ar: "لا يوجد", en: "No" },
    ] },
    { id: "leaseTerm", type: "select", label: { ar: "مدة العقد", en: "Lease Term" }, options: [
      { id: "daily", ar: "يومي", en: "Daily" }, { id: "monthly", ar: "شهري", en: "Monthly" }, { id: "yearly", ar: "سنوي", en: "Yearly" },
    ] },
  ],
  land: [
    { id: "landType", type: "select", label: { ar: "نوع الأرض", en: "Land Type" }, options: [
      { id: "residential", ar: "سكنية", en: "Residential" }, { id: "agricultural", ar: "زراعية", en: "Agricultural" },
      { id: "commercial", ar: "تجارية", en: "Commercial" }, { id: "industrial", ar: "صناعية", en: "Industrial" },
    ] },
    { id: "area", type: "range", label: { ar: "المساحة (م²)", en: "Area (m²)" }, min: 100, max: 50000 },
  ],
  offices_sale: [
    { id: "officeType", type: "select", label: { ar: "نوع العقار", en: "Type" }, options: [
      { id: "office", ar: "مكتب", en: "Office" }, { id: "shop", ar: "محل تجاري", en: "Shop" }, { id: "warehouse", ar: "مستودع", en: "Warehouse" },
    ] },
    { id: "area", type: "range", label: { ar: "المساحة (م²)", en: "Area (m²)" }, min: 15, max: 5000 },
    { id: "furnished", type: "select", label: { ar: "التجهيز", en: "Fit-out" }, options: [
      { id: "furnished", ar: "مجهز", en: "Fitted" }, { id: "unfurnished", ar: "غير مجهز", en: "Bare shell" },
    ] },
  ],
  offices_rent: [
    { id: "officeType", type: "select", label: { ar: "نوع العقار", en: "Type" }, options: [
      { id: "office", ar: "مكتب", en: "Office" }, { id: "shop", ar: "محل تجاري", en: "Shop" }, { id: "warehouse", ar: "مستودع", en: "Warehouse" },
    ] },
    { id: "area", type: "range", label: { ar: "المساحة (م²)", en: "Area (m²)" }, min: 15, max: 5000 },
    { id: "furnished", type: "select", label: { ar: "التجهيز", en: "Fit-out" }, options: [
      { id: "furnished", ar: "مجهز", en: "Fitted" }, { id: "unfurnished", ar: "غير مجهز", en: "Bare shell" },
    ] },
    { id: "leaseTerm", type: "select", label: { ar: "مدة العقد", en: "Lease Term" }, options: [
      { id: "daily", ar: "يومي", en: "Daily" }, { id: "monthly", ar: "شهري", en: "Monthly" }, { id: "yearly", ar: "سنوي", en: "Yearly" },
    ] },
  ],

  /* ---- electronics ---- */
  smartphones: [
    { id: "brand", type: "select", label: { ar: "الماركة", en: "Brand" }, options: ELEC_BRANDS },
    { id: "model", type: "text", label: { ar: "الموديل", en: "Model" } },
    { id: "storage", type: "select", label: { ar: "سعة التخزين", en: "Storage" }, options: [
      { id: "32gb", ar: "32GB", en: "32GB" }, { id: "64gb", ar: "64GB", en: "64GB" }, { id: "128gb", ar: "128GB", en: "128GB" },
      { id: "256gb", ar: "256GB", en: "256GB" }, { id: "512gb", ar: "512GB", en: "512GB" }, { id: "1tb", ar: "1TB", en: "1TB" },
    ] },
    { id: "condition", type: "select", label: { ar: "الحالة", en: "Condition" }, options: COND_OPTS },
    { id: "warranty", type: "select", label: { ar: "الضمان", en: "Warranty" }, options: [
      { id: "in_warranty", ar: "يوجد ضمان", en: "Under warranty" }, { id: "no_warranty", ar: "بدون ضمان", en: "No warranty" },
    ] },
  ],
  watches_wearables: [
    { id: "brand", type: "select", label: { ar: "الماركة", en: "Brand" }, options: WEARABLE_BRANDS },
    { id: "condition", type: "select", label: { ar: "الحالة", en: "Condition" }, options: COND_OPTS },
    { id: "warranty", type: "select", label: { ar: "الضمان", en: "Warranty" }, options: [
      { id: "in_warranty", ar: "يوجد ضمان", en: "Under warranty" }, { id: "no_warranty", ar: "بدون ضمان", en: "No warranty" },
    ] },
  ],
  computers: [
    { id: "brand", type: "select", label: { ar: "الماركة", en: "Brand" }, options: COMPUTER_BRANDS },
    { id: "deviceType", type: "select", label: { ar: "نوع الجهاز", en: "Device Type" }, options: [
      { id: "laptop", ar: "لابتوب", en: "Laptop" }, { id: "desktop", ar: "كمبيوتر مكتبي", en: "Desktop" }, { id: "tablet", ar: "تابلت", en: "Tablet" },
    ] },
    { id: "ram", type: "select", label: { ar: "الرام", en: "RAM" }, options: [
      { id: "4gb", ar: "4GB", en: "4GB" }, { id: "8gb", ar: "8GB", en: "8GB" }, { id: "16gb", ar: "16GB", en: "16GB" }, { id: "32gb+", ar: "32GB+", en: "32GB+" },
    ] },
    { id: "condition", type: "select", label: { ar: "الحالة", en: "Condition" }, options: COND_OPTS },
  ],
  tvs: [
    { id: "brand", type: "select", label: { ar: "الماركة", en: "Brand" }, options: TV_BRANDS },
    { id: "screenSize", type: "range", label: { ar: "حجم الشاشة (بوصة)", en: "Screen Size (in)" }, min: 24, max: 100 },
    { id: "smartTv", type: "select", label: { ar: "سمارت TV", en: "Smart TV" }, options: [
      { id: "yes", ar: "نعم", en: "Yes" }, { id: "no", ar: "لا", en: "No" },
    ] },
    { id: "condition", type: "select", label: { ar: "الحالة", en: "Condition" }, options: COND_OPTS },
  ],
  cameras: [
    { id: "brand", type: "select", label: { ar: "الماركة", en: "Brand" }, options: CAMERA_BRANDS },
    { id: "cameraType", type: "select", label: { ar: "نوع الكاميرا", en: "Camera Type" }, options: [
      { id: "dslr", ar: "DSLR", en: "DSLR" }, { id: "mirrorless", ar: "ميرورليس", en: "Mirrorless" },
      { id: "action", ar: "أكشن كام", en: "Action Cam" }, { id: "pointshoot", ar: "بوينت آند شوت", en: "Point & Shoot" },
    ] },
    { id: "condition", type: "select", label: { ar: "الحالة", en: "Condition" }, options: COND_OPTS },
  ],

  /* ---- furniture ---- */
  living_room: [
    { id: "material", type: "select", label: { ar: "الخامة", en: "Material" }, options: [
      { id: "wood", ar: "خشب", en: "Wood" }, { id: "fabric", ar: "قماش", en: "Fabric" }, { id: "leather", ar: "جلد", en: "Leather" }, { id: "other", ar: "أخرى", en: "Other" },
    ] },
    { id: "style", type: "select", label: { ar: "الطراز", en: "Style" }, options: [
      { id: "modern", ar: "مودرن", en: "Modern" }, { id: "classic", ar: "كلاسيك", en: "Classic" },
    ] },
    { id: "condition", type: "select", label: { ar: "الحالة", en: "Condition" }, options: COND_OPTS },
  ],
  kitchens: [
    { id: "kitchenType", type: "select", label: { ar: "نوع المطبخ", en: "Kitchen Type" }, options: [
      { id: "full", ar: "طقم كامل", en: "Full Set" }, { id: "cabinets", ar: "خزائن فقط", en: "Cabinets Only" }, { id: "counter", ar: "سنك وكاونتر", en: "Sink & Counter" },
    ] },
    { id: "material", type: "select", label: { ar: "الخامة", en: "Material" }, options: [
      { id: "wood", ar: "خشب", en: "Wood" }, { id: "mdf", ar: "MDF", en: "MDF" }, { id: "steel", ar: "ستانلس", en: "Stainless" },
    ] },
    { id: "condition", type: "select", label: { ar: "الحالة", en: "Condition" }, options: COND_OPTS },
  ],
  appliances: [
    { id: "applianceType", type: "select", label: { ar: "نوع الجهاز", en: "Appliance Type" }, options: [
      { id: "fridge", ar: "ثلاجة", en: "Refrigerator" }, { id: "washer", ar: "غسالة", en: "Washing Machine" },
      { id: "ac", ar: "مكيف", en: "AC" }, { id: "oven", ar: "فرن", en: "Oven" }, { id: "other", ar: "أخرى", en: "Other" },
    ] },
    { id: "condition", type: "select", label: { ar: "الحالة", en: "Condition" }, options: COND_OPTS },
  ],
  decor: [
    { id: "itemType", type: "select", label: { ar: "نوع القطعة", en: "Item Type" }, options: [
      { id: "curtains", ar: "ستائر", en: "Curtains" }, { id: "carpets", ar: "سجاد", en: "Carpets" },
      { id: "wallart", ar: "لوحات جدارية", en: "Wall Art" }, { id: "lighting", ar: "إضاءة", en: "Lighting" }, { id: "other", ar: "أخرى", en: "Other" },
    ] },
  ],

  /* ---- fashion ---- */
  men: [
    { id: "clothingType", type: "select", label: { ar: "نوع الملبس", en: "Clothing Type" }, options: [
      { id: "shirts", ar: "قمصان وتيشيرتات", en: "Shirts & T-Shirts" }, { id: "pants", ar: "بناطيل", en: "Pants" },
      { id: "suits", ar: "بدلات", en: "Suits" }, { id: "traditional", ar: "ملابس تقليدية", en: "Traditional Wear" },
      { id: "outerwear", ar: "جاكيتات ومعاطف", en: "Outerwear" }, { id: "other", ar: "أخرى", en: "Other" },
    ] },
    { id: "size", type: "select", label: { ar: "المقاس", en: "Size" }, options: [
      { id: "s", ar: "S", en: "S" }, { id: "m", ar: "M", en: "M" }, { id: "l", ar: "L", en: "L" }, { id: "xl", ar: "XL", en: "XL" }, { id: "xxl", ar: "XXL", en: "XXL" },
    ] },
    { id: "fitType", type: "select", label: { ar: "القصّة", en: "Fit" }, options: [
      { id: "regular", ar: "عادي", en: "Regular" }, { id: "slim", ar: "ضيق", en: "Slim" }, { id: "loose", ar: "واسع", en: "Loose" },
    ] },
    { id: "brand", type: "text", label: { ar: "الماركة", en: "Brand" } },
    { id: "condition", type: "select", label: { ar: "الحالة", en: "Condition" }, options: COND_OPTS },
  ],
  women: [
    { id: "clothingType", type: "select", label: { ar: "نوع الملبس", en: "Clothing Type" }, options: [
      { id: "dresses", ar: "فساتين", en: "Dresses" }, { id: "abaya", ar: "عبايات", en: "Abayas" },
      { id: "tops", ar: "بلايز وتيشيرتات", en: "Tops" }, { id: "traditional", ar: "ملابس تقليدية", en: "Traditional Wear" },
      { id: "outerwear", ar: "جاكيتات ومعاطف", en: "Outerwear" }, { id: "other", ar: "أخرى", en: "Other" },
    ] },
    { id: "size", type: "select", label: { ar: "المقاس", en: "Size" }, options: [
      { id: "xs", ar: "XS", en: "XS" }, { id: "s", ar: "S", en: "S" }, { id: "m", ar: "M", en: "M" },
      { id: "l", ar: "L", en: "L" }, { id: "xl", ar: "XL", en: "XL" }, { id: "free", ar: "مقاس حر", en: "Free size" },
    ] },
    { id: "occasion", type: "select", label: { ar: "المناسبة", en: "Occasion" }, options: [
      { id: "casual", ar: "يومي", en: "Casual" }, { id: "formal", ar: "رسمي", en: "Formal" }, { id: "wedding", ar: "أفراح", en: "Wedding" },
    ] },
    { id: "brand", type: "text", label: { ar: "الماركة", en: "Brand" } },
    { id: "condition", type: "select", label: { ar: "الحالة", en: "Condition" }, options: COND_OPTS },
  ],
  shoes_bags: [
    { id: "itemType", type: "select", label: { ar: "نوع القطعة", en: "Item Type" }, options: [
      { id: "shoes", ar: "أحذية", en: "Shoes" }, { id: "bags", ar: "حقائب", en: "Bags" },
    ] },
    { id: "size", type: "select", label: { ar: "المقاس", en: "Size" }, options: [
      { id: "36", ar: "36", en: "36" }, { id: "38", ar: "38", en: "38" }, { id: "40", ar: "40", en: "40" },
      { id: "42", ar: "42", en: "42" }, { id: "44", ar: "44", en: "44" }, { id: "na", ar: "غير محدد", en: "N/A" },
    ] },
    { id: "brand", type: "text", label: { ar: "الماركة", en: "Brand" } },
    { id: "condition", type: "select", label: { ar: "الحالة", en: "Condition" }, options: COND_OPTS },
  ],
  accessories: [
    { id: "itemType", type: "select", label: { ar: "نوع القطعة", en: "Item Type" }, options: [
      { id: "watches", ar: "ساعات", en: "Watches" }, { id: "sunglasses", ar: "نظارات شمسية", en: "Sunglasses" },
      { id: "belts", ar: "أحزمة", en: "Belts" }, { id: "other", ar: "أخرى", en: "Other" },
    ] },
    { id: "brand", type: "text", label: { ar: "الماركة", en: "Brand" } },
  ],

  /* ---- jobs & services ---- */
  jobs: [
    { id: "jobType", type: "select", label: { ar: "نوع الدوام", en: "Job Type" }, options: [
      { id: "full_time", ar: "دوام كامل", en: "Full-time" }, { id: "part_time", ar: "دوام جزئي", en: "Part-time" }, { id: "remote", ar: "عن بُعد", en: "Remote" },
    ] },
    { id: "fieldArea", type: "select", label: { ar: "المجال", en: "Field" }, options: [
      { id: "tech", ar: "تقنية", en: "Tech" }, { id: "sales", ar: "مبيعات", en: "Sales" },
      { id: "education", ar: "تعليم", en: "Education" }, { id: "healthcare", ar: "صحة", en: "Healthcare" },
      { id: "construction", ar: "إنشاءات", en: "Construction" }, { id: "other", ar: "أخرى", en: "Other" },
    ] },
    { id: "experience", type: "select", label: { ar: "الخبرة المطلوبة", en: "Experience" }, options: [
      { id: "entry", ar: "مبتدئ", en: "Entry-level" }, { id: "mid", ar: "متوسط", en: "Mid-level" }, { id: "senior", ar: "خبرة عالية", en: "Senior" },
    ] },
  ],
  trade_services: [
    { id: "craftType", type: "select", label: { ar: "نوع الحرفة", en: "Craft Type" }, options: [
      { id: "plumbing", ar: "سباكة", en: "Plumbing" }, { id: "electrical", ar: "كهرباء", en: "Electrical" },
      { id: "carpentry", ar: "نجارة", en: "Carpentry" }, { id: "painting", ar: "دهان", en: "Painting" }, { id: "other", ar: "أخرى", en: "Other" },
    ] },
    { id: "availability", type: "select", label: { ar: "التوفر", en: "Availability" }, options: [
      { id: "today", ar: "اليوم", en: "Today" }, { id: "this_week", ar: "هذا الأسبوع", en: "This week" }, { id: "flexible", ar: "مرن", en: "Flexible" },
    ] },
  ],
  tutoring: [
    { id: "subject", type: "select", label: { ar: "المادة", en: "Subject" }, options: [
      { id: "math", ar: "رياضيات", en: "Math" }, { id: "english", ar: "إنجليزي", en: "English" },
      { id: "arabic", ar: "عربي", en: "Arabic" }, { id: "science", ar: "علوم", en: "Science" }, { id: "other", ar: "أخرى", en: "Other" },
    ] },
    { id: "level", type: "select", label: { ar: "المرحلة", en: "Level" }, options: [
      { id: "primary", ar: "ابتدائي", en: "Primary" }, { id: "secondary", ar: "ثانوي", en: "Secondary" }, { id: "university", ar: "جامعي", en: "University" },
    ] },
  ],
  tech_services: [
    { id: "serviceType", type: "select", label: { ar: "نوع الخدمة التقنية", en: "Tech Service" }, options: [
      { id: "webdev", ar: "برمجة مواقع", en: "Web Development" }, { id: "mobiledev", ar: "برمجة تطبيقات", en: "Mobile Development" },
      { id: "repair", ar: "صيانة أجهزة", en: "Device Repair" }, { id: "design", ar: "تصميم", en: "Design" }, { id: "other", ar: "أخرى", en: "Other" },
    ] },
    { id: "deliveryMode", type: "select", label: { ar: "طريقة التنفيذ", en: "Delivery Mode" }, options: [
      { id: "remote", ar: "عن بُعد", en: "Remote" }, { id: "onsite", ar: "في الموقع", en: "On-site" },
    ] },
  ],

  /* ---- kids ---- */
  kids_clothing: [
    { id: "gender", type: "select", label: { ar: "النوع", en: "Gender" }, options: [
      { id: "boys", ar: "أولاد", en: "Boys" }, { id: "girls", ar: "بنات", en: "Girls" }, { id: "unisex", ar: "الجنسين", en: "Unisex" },
    ] },
    { id: "ageGroup", type: "select", label: { ar: "الفئة العمرية", en: "Age Group" }, options: [
      { id: "0-1", ar: "0-1 سنة", en: "0-1 yr" }, { id: "1-3", ar: "1-3 سنوات", en: "1-3 yrs" },
      { id: "3-6", ar: "3-6 سنوات", en: "3-6 yrs" }, { id: "6+", ar: "6+ سنوات", en: "6+ yrs" },
    ] },
    { id: "condition", type: "select", label: { ar: "الحالة", en: "Condition" }, options: COND_OPTS },
  ],
  toys: [
    { id: "toyType", type: "select", label: { ar: "نوع اللعبة", en: "Toy Type" }, options: [
      { id: "educational", ar: "تعليمية", en: "Educational" }, { id: "outdoor", ar: "خارجية", en: "Outdoor" },
      { id: "electronic", ar: "إلكترونية", en: "Electronic" }, { id: "other", ar: "أخرى", en: "Other" },
    ] },
    { id: "ageGroup", type: "select", label: { ar: "الفئة العمرية", en: "Age Group" }, options: [
      { id: "0-2", ar: "0-2 سنة", en: "0-2 yrs" }, { id: "3-6", ar: "3-6 سنوات", en: "3-6 yrs" }, { id: "6+", ar: "6+ سنوات", en: "6+ yrs" },
    ] },
    { id: "condition", type: "select", label: { ar: "الحالة", en: "Condition" }, options: COND_OPTS },
  ],
  strollers: [
    { id: "itemType", type: "select", label: { ar: "نوع المنتج", en: "Item Type" }, options: [
      { id: "stroller", ar: "عربة", en: "Stroller" }, { id: "carseat", ar: "كرسي سيارة", en: "Car Seat" },
      { id: "highchair", ar: "كرسي طعام", en: "High Chair" }, { id: "other", ar: "أخرى", en: "Other" },
    ] },
    { id: "condition", type: "select", label: { ar: "الحالة", en: "Condition" }, options: COND_OPTS },
  ],

  /* ---- sports & leisure ---- */
  sports_gear: [
    { id: "activityType", type: "select", label: { ar: "نوع الرياضة", en: "Sport" }, options: [
      { id: "gym", ar: "جيم ولياقة", en: "Gym & Fitness" }, { id: "football", ar: "كرة قدم", en: "Football" },
      { id: "swimming", ar: "سباحة", en: "Swimming" }, { id: "other", ar: "أخرى", en: "Other" },
    ] },
    { id: "brand", type: "text", label: { ar: "الماركة", en: "Brand" } },
    { id: "condition", type: "select", label: { ar: "الحالة", en: "Condition" }, options: COND_OPTS },
  ],
  bicycles: [
    { id: "bikeType", type: "select", label: { ar: "نوع الدراجة", en: "Bike Type" }, options: [
      { id: "mountain", ar: "جبلية", en: "Mountain" }, { id: "road", ar: "طريق", en: "Road" },
      { id: "kids", ar: "أطفال", en: "Kids" }, { id: "electric", ar: "كهربائية", en: "Electric" }, { id: "other", ar: "أخرى", en: "Other" },
    ] },
    { id: "brand", type: "text", label: { ar: "الماركة", en: "Brand" } },
    { id: "condition", type: "select", label: { ar: "الحالة", en: "Condition" }, options: COND_OPTS },
  ],
  camping_fishing: [
    { id: "itemType", type: "select", label: { ar: "نوع المنتج", en: "Item Type" }, options: [
      { id: "tent", ar: "خيمة", en: "Tent" }, { id: "fishingrod", ar: "سنارة صيد", en: "Fishing Rod" },
      { id: "sleepingbag", ar: "كيس نوم", en: "Sleeping Bag" }, { id: "cooler", ar: "ثلاجة تخييم", en: "Cooler" }, { id: "other", ar: "أخرى", en: "Other" },
    ] },
    { id: "condition", type: "select", label: { ar: "الحالة", en: "Condition" }, options: COND_OPTS },
  ],

  /* ---- jewelry & watches ---- */
  gold: [
    { id: "itemType", type: "select", label: { ar: "نوع القطعة", en: "Item Type" }, options: [
      { id: "ring", ar: "خاتم", en: "Ring" }, { id: "necklace", ar: "عقد", en: "Necklace" },
      { id: "bracelet", ar: "أسورة", en: "Bracelet" }, { id: "set", ar: "طقم", en: "Set" }, { id: "other", ar: "أخرى", en: "Other" },
    ] },
    { id: "karat", type: "select", label: { ar: "العيار", en: "Karat" }, options: [
      { id: "14", ar: "14", en: "14K" }, { id: "18", ar: "18", en: "18K" }, { id: "21", ar: "21", en: "21K" }, { id: "24", ar: "24", en: "24K" },
    ] },
    { id: "weight", type: "range", label: { ar: "الوزن (جرام)", en: "Weight (g)" }, min: 1, max: 500 },
  ],
  silver: [
    { id: "itemType", type: "select", label: { ar: "نوع القطعة", en: "Item Type" }, options: [
      { id: "ring", ar: "خاتم", en: "Ring" }, { id: "necklace", ar: "عقد", en: "Necklace" },
      { id: "bracelet", ar: "أسورة", en: "Bracelet" }, { id: "set", ar: "طقم", en: "Set" }, { id: "other", ar: "أخرى", en: "Other" },
    ] },
    { id: "weight", type: "range", label: { ar: "الوزن (جرام)", en: "Weight (g)" }, min: 1, max: 500 },
  ],
  luxury_watches: [
    { id: "brand", type: "select", label: { ar: "الماركة", en: "Brand" }, options: LUXURY_WATCH_BRANDS },
    { id: "condition", type: "select", label: { ar: "الحالة", en: "Condition" }, options: COND_OPTS },
  ],

  /* ---- health & beauty ---- */
  perfumes: [
    { id: "brand", type: "text", label: { ar: "الماركة", en: "Brand" } },
    { id: "gender", type: "select", label: { ar: "النوع", en: "Gender" }, options: [
      { id: "men", ar: "رجالي", en: "Men" }, { id: "women", ar: "نسائي", en: "Women" }, { id: "unisex", ar: "للجنسين", en: "Unisex" },
    ] },
  ],
  makeup: [
    { id: "brand", type: "text", label: { ar: "الماركة", en: "Brand" } },
    { id: "productType", type: "select", label: { ar: "نوع المنتج", en: "Product Type" }, options: [
      { id: "foundation", ar: "كريم أساس", en: "Foundation" }, { id: "lipstick", ar: "أحمر شفاه", en: "Lipstick" },
      { id: "eyeshadow", ar: "ظلال عيون", en: "Eyeshadow" }, { id: "other", ar: "أخرى", en: "Other" },
    ] },
  ],
  skincare: [
    { id: "brand", type: "text", label: { ar: "الماركة", en: "Brand" } },
    { id: "skinType", type: "select", label: { ar: "نوع البشرة", en: "Skin Type" }, options: [
      { id: "dry", ar: "جافة", en: "Dry" }, { id: "oily", ar: "دهنية", en: "Oily" },
      { id: "combination", ar: "مختلطة", en: "Combination" }, { id: "all", ar: "كل الأنواع", en: "All types" },
    ] },
  ],

  /* ---- animals & plants ---- */
  pet_supplies: [
    { id: "itemType", type: "select", label: { ar: "نوع المنتج", en: "Item Type" }, options: [
      { id: "food", ar: "طعام", en: "Food" }, { id: "cage", ar: "قفص", en: "Cage" },
      { id: "toys", ar: "ألعاب", en: "Toys" }, { id: "grooming", ar: "عناية وتنظيف", en: "Grooming" }, { id: "other", ar: "أخرى", en: "Other" },
    ] },
  ],
  animals_sale: [
    { id: "animalType", type: "select", label: { ar: "نوع الحيوان", en: "Animal Type" }, options: [
      { id: "cat", ar: "قطط", en: "Cats" }, { id: "dog", ar: "كلاب", en: "Dogs" },
      { id: "bird", ar: "طيور", en: "Birds" }, { id: "fish", ar: "أسماك", en: "Fish" }, { id: "other", ar: "أخرى", en: "Other" },
    ] },
    { id: "breed", type: "text", label: { ar: "السلالة", en: "Breed" } },
  ],
  plants: [
    { id: "plantType", type: "select", label: { ar: "نوع النبات", en: "Plant Type" }, options: [
      { id: "indoor", ar: "داخلي", en: "Indoor" }, { id: "outdoor", ar: "خارجي", en: "Outdoor" },
      { id: "succulent", ar: "صبار", en: "Succulent" }, { id: "other", ar: "أخرى", en: "Other" },
    ] },
  ],

  /* ---- business & equipment ---- */
  office_equipment: [
    { id: "equipmentType", type: "select", label: { ar: "نوع المعدات", en: "Equipment Type" }, options: [
      { id: "desk", ar: "مكتب", en: "Desk" }, { id: "chair", ar: "كرسي", en: "Chair" },
      { id: "printer", ar: "طابعة", en: "Printer" }, { id: "other", ar: "أخرى", en: "Other" },
    ] },
    { id: "condition", type: "select", label: { ar: "الحالة", en: "Condition" }, options: COND_OPTS },
  ],
  machinery: [
    { id: "machineType", type: "select", label: { ar: "نوع المعدة", en: "Machine Type" }, options: [
      { id: "generator", ar: "مولّد كهرباء", en: "Generator" }, { id: "compressor", ar: "ضاغط هواء", en: "Compressor" },
      { id: "forklift", ar: "رافعة شوكية", en: "Forklift" }, { id: "other", ar: "أخرى", en: "Other" },
    ] },
    { id: "condition", type: "select", label: { ar: "الحالة", en: "Condition" }, options: COND_OPTS },
  ],
  restaurant_supplies: [
    { id: "itemType", type: "select", label: { ar: "نوع المنتج", en: "Item Type" }, options: [
      { id: "kitchen", ar: "معدات مطبخ", en: "Kitchen Equipment" }, { id: "furniture", ar: "أثاث مطعم", en: "Restaurant Furniture" },
      { id: "tableware", ar: "أدوات تقديم", en: "Tableware" }, { id: "other", ar: "أخرى", en: "Other" },
    ] },
    { id: "condition", type: "select", label: { ar: "الحالة", en: "Condition" }, options: COND_OPTS },
  ],
};

const GRAD_A = [GOLD, GOLD_DEEP];
const GRAD_B = [CHARCOAL, GOLD];
const GRAD_C = [GOLD_LIGHT, GOLD];
const GRADS = [GRAD_A, GRAD_B, GRAD_C];
const PI_RATE = 3.15; // illustrative rate: 1 π ≈ 3.15 LYD

const PRODUCTS = [
  { id: 1, cat: "electronics", subcat: "smartphones", ar: "آيفون 13 برو - حالة ممتازة", en: "iPhone 13 Pro — Excellent", price: 2450, cityId: "tripoli", country_ar: "ليبيا", country_en: "Libya", grad: GRAD_A, verified: true, brand: "apple", model: "iPhone 13 Pro", storage: "256gb", condition: "used", warranty: "no_warranty", internationalShipping: true },
  { id: 16, cat: "electronics", subcat: "smartphones", ar: "سامسونج جالكسي S24 جديد بالكرتونة", en: "Samsung Galaxy S24 — Sealed Box", price: 3100, cityId: "benghazi", country_ar: "ليبيا", country_en: "Libya", grad: GRAD_B, verified: true, brand: "samsung", model: "Galaxy S24", storage: "256gb", condition: "new", warranty: "in_warranty" },
  { id: 2, cat: "furniture", subcat: "living_room", ar: "طقم صالون تركي جديد", en: "New Turkish Sofa Set", price: 3200, cityId: "benghazi", country_ar: "ليبيا", country_en: "Libya", grad: GRAD_B, verified: false, material: "fabric", roomType: "living_room", condition: "new" },
  { id: 3, cat: "vehicles", subcat: "cars", ar: "تويوتا كورولا 2019", en: "Toyota Corolla 2019", price: 68000, cityId: "misrata", country_ar: "ليبيا", country_en: "Libya", grad: GRAD_C, verified: true, bodyType: "sedan", brand: "toyota", model: "Corolla", year: 2019, condition: "used", mileage: 65000, transmission: "automatic", fuelType: "petrol" },
  { id: 15, cat: "vehicles", subcat: "cars", ar: "تويوتا راف فور 2022", en: "Toyota RAV4 2022", price: 145000, cityId: "tripoli", country_ar: "ليبيا", country_en: "Libya", grad: GRAD_A, verified: true, bodyType: "suv", brand: "toyota", model: "RAV4", year: 2022, condition: "used", mileage: 32000, transmission: "automatic", fuelType: "hybrid" },
  { id: 4, cat: "fashion", subcat: "women", ar: "عباية مطرزة يدوياً", en: "Hand-embroidered Abaya", price: 320, cityId: "tripoli", country_ar: "ليبيا", country_en: "Libya", grad: GRAD_A, verified: false, gender: "women", size: "m", brand: "Local Design", condition: "new" },
  { id: 5, cat: "realestate", subcat: "apt_rent", ar: "شقة للإيجار - غوط الشعال", en: "Apartment for Rent — Ghout Shaal", price: 1800, cityId: "tripoli", districtId: "ghout_shaal", country_ar: "ليبيا", country_en: "Libya", grad: GRAD_B, verified: true, propertyType: "apartment", rooms: "2", bathrooms: "2", area: 120, floor: "1-3", furnished: "furnished" },
  { id: 17, cat: "realestate", subcat: "villas_rent", ar: "فيلا للإيجار اليومي - جنزور", en: "Villa for Daily Rent — Janzour", price: 350, cityId: "tripoli", districtId: "janzour", country_ar: "ليبيا", country_en: "Libya", grad: GRAD_A, verified: true, rooms: "4", bathrooms: "3", area: 320, garden: "yes", leaseTerm: "daily" },
  { id: 18, cat: "realestate", subcat: "apt_sale", ar: "شقة للبيع - النوفليين", en: "Apartment for Sale — Nofliyeen", price: 285000, cityId: "tripoli", districtId: "nofliyeen", country_ar: "ليبيا", country_en: "Libya", grad: GRAD_C, verified: true, propertyType: "apartment", rooms: "3", bathrooms: "2", area: 165, floor: "1-3", furnished: "unfurnished" },
  { id: 6, cat: "jewelry", subcat: "gold", ar: "طقم ذهب عيار 21", en: "21K Gold Set", price: 5400, cityId: "zawiya", country_ar: "ليبيا", country_en: "Libya", grad: GRAD_C, verified: true, material: "gold", karat: "21", gemstone: "none", internationalShipping: true },
  { id: 7, cat: "sports", subcat: "bicycles", ar: "دراجة جبلية شبه جديدة", en: "Mountain Bike — Like New", price: 750, cityId: "benghazi", country_ar: "ليبيا", country_en: "Libya", grad: GRAD_A, verified: false, activityType: "individual", brand: "Trek", condition: "used" },
  { id: 8, cat: "kids", subcat: "strollers", ar: "عربة أطفال + كرسي سيارة", en: "Stroller + Car Seat Combo", price: 480, cityId: "sabha", country_ar: "ليبيا", country_en: "Libya", grad: GRAD_B, verified: false, itemType: "gear", ageGroup: "0-1", condition: "used" },
  { id: 9, cat: "electronics", subcat: "watches_wearables", ar: "ساعة ذكية أصلية مستوردة", en: "Original Imported Smartwatch", price: 890, city_ar: "القاهرة", city_en: "Cairo", country_ar: "مصر", country_en: "Egypt", grad: GRAD_C, verified: true, brand: "other", storage: "na", condition: "new", warranty: "in_warranty" },
  { id: 10, cat: "animals_plants", subcat: "pet_supplies", ar: "قفص ببغاء مع إكسسوارات", en: "Parrot Cage with Accessories", price: 280, cityId: "tripoli", country_ar: "ليبيا", country_en: "Libya", grad: GRAD_A, verified: false, type: "birds", breed: "ببغاء أفريقي" },
  { id: 11, cat: "vehicles", subcat: "marine", ar: "قارب صيد بمحرك", en: "Fishing Boat with Engine", price: 15500, cityId: "zawiya", country_ar: "ليبيا", country_en: "Libya", grad: GRAD_B, verified: true, bodyType: "other", brand: "other", model: "Fishing Boat", year: 2020, condition: "used", mileage: 0, transmission: "manual", fuelType: "petrol" },
  { id: 12, cat: "animals_plants", subcat: "plants", ar: "نخلة زينة داخلية", en: "Indoor Ornamental Palm", price: 150, cityId: "benghazi", country_ar: "ليبيا", country_en: "Libya", grad: GRAD_C, verified: false, type: "plants", breed: "نخلة الأرِيكا" },
  { id: 13, cat: "beauty", subcat: "perfumes", ar: "عطر فرنسي أصلي", en: "Original French Perfume", price: 180, cityId: "tripoli", country_ar: "ليبيا", country_en: "Libya", grad: GRAD_A, verified: false, productType: "perfume", brand: "Chanel" },
  { id: 14, cat: "business", subcat: "office_equipment", ar: "مكتب عمل خشبي فاخر", en: "Premium Wooden Office Desk", price: 650, cityId: "benghazi", country_ar: "ليبيا", country_en: "Libya", grad: GRAD_B, verified: false, equipmentType: "office", material: "wood", condition: "used" },
];

const SHIPPING_CARRIERS = [
  { id: "aramex", ar: "أرامكس", en: "Aramex" },
  { id: "dhl", ar: "دي إتش إل", en: "DHL" },
  { id: "fedex", ar: "فيديكس", en: "FedEx" },
  { id: "ups", ar: "يو بي إس", en: "UPS" },
  { id: "smsa", ar: "سمسا إكسبريس", en: "SMSA Express" },
  { id: "libyapost", ar: "البريد الليبي", en: "Libya Post" },
  { id: "sea", ar: "الشحن البحري", en: "Sea Freight" },
];

const MOCK_THREADS = [
  { id: 1, avatar: "م", name_ar: "محمد - بائع السيارة", name_en: "Mohamed — Car Seller", msg_ar: "السيارة لسه متوفرة، تحب تعاين عليها؟", msg_en: "The car is still available, want to check it?", time: "10:24", unread: true },
  { id: 2, avatar: "س", name_ar: "سارة - شقة غوط الشعال", name_en: "Sara — Ghout Shaal Apartment", msg_ar: "تمام، اتفقنا على السعر", msg_en: "Great, we agreed on the price", time: "أمس", unread: false },
  { id: 3, avatar: "ع", name_ar: "عبدالله - أرامكس", name_en: "Abdullah — Aramex", msg_ar: "الشحنة في الطريق إليك", msg_en: "Your shipment is on the way", time: "الإثنين", unread: false },
];

const COPY = {
  ar: {
    brand: "السوق الليبي", brandSub: "LIBYANSOUQ",
    tagline: "بيع واشترِ بثقة، من مدينتك إلى كل ليبيا",
    searchPh: "ابحث عن منتج أو فئة…",
    categories: "الفئات", seeAll: "عرض الكل", featured: "إعلانات مميزة",
    nav: { home: "الرئيسية", categories: "الفئات", sell: "أضف", chat: "الرسائل", profile: "حسابي" },
    verified: "بائع موثّق", ld: "د.ل", back: "رجوع",
    sellTitle: "أضف إعلانك", sellSub: "املأ التفاصيل ليظهر إعلانك للمشترين في جميع أنحاء ليبيا",
    photoLabel: "أضف صوراً", photoHint: "اسحب أو اضغط لإضافة حتى 8 صور",
    fieldTitle: "عنوان الإعلان", fieldCat: "الفئة", fieldPrice: "السعر (د.ل)", fieldCity: "المدينة", fieldDesc: "الوصف",
    publish: "نشر الإعلان", contactSeller: "تواصل مع البائع",
    productDesc: "وصف الإعلان",
    productDescBody: "قطعة أصلية بحالة جيدة جداً، الاستخدام خفيف والفحص مرحّب به قبل الاتفاق. التسليم يداً بيد داخل المدينة.",
    posted: "نُشر منذ يومين",
    allCategoriesTitle: "كل الفئات", allProductsTitle: "كل الإعلانات",
    chooseType: "اختر القسم", showAllIn: "عرض الكل في",
    shippingAvailable: "شحن دولي متاح لهذا المنتج", shipFrom: "الشحن من",
    chooseCarrier: "اختر شركة الشحن", confirmCarrier: "تأكيد الاختيار", carrierSelected: "تم اختيار",
    allCities: "الكل", chooseCity: "اختر المدينة", listingsAvailable: "إعلان متاح",
    chooseDistrict: "اختر المنطقة", allDistricts: "كل مناطق المدينة",
    verifiedOnly: "موثّق فقط", newest: "الأحدث", priceLow: "الأقل سعراً", priceHigh: "الأعلى سعراً",
    makeOffer: "عرض سعر", yourOffer: "المبلغ المقترح", offerSent: "تم إرسال عرضك للبائع",
    reportListing: "الإبلاغ عن هذا الإعلان", reportSent: "تم إرسال بلاغك، شكراً لمساعدتك في الحفاظ على أمان السوق",
    searchResultsFor: "نتائج البحث عن", noResults: "لا توجد نتائج مطابقة",
    favorites: "المفضلة", noFavorites: "لا توجد عناصر في المفضلة بعد",
    noMyListings: "لم تنشر أي إعلان بعد",
    myListings: "إعلاناتي", myRating: "التقييم", savedCarriers: "شركات الشحن المفضّلة", settings: "الإعدادات",
    approx: "تقديري", shipsAbroad: "التاجر يوفر شحن دولي لهذا المنتج",
    offerIntlShipping: "إتاحة الشحن الدولي", offerIntlShippingHint: "يسمح للمشترين من دول الجوار (مصر، تونس...) باختيار شركة شحن لإيصال المنتج إليهم",
    settingsAppSection: "التطبيق", settingsDataSection: "البيانات", settingsAboutSection: "حول التطبيق",
    languageLabel: "اللغة", notificationsLabel: "الإشعارات", notificationsHint: "تنبيهات لعروض الأسعار والرسائل والبحث المحفوظ",
    piEquivalentLabel: "إظهار السعر بالدينار الليبي أيضاً", piEquivalentHint: "يظهر كسعر ثانوي تحت سعر الإعلان الأساسي بعملة Pi",
    resetDataLabel: "مسح جميع بياناتي المحلية", resetDataHint: "يمسح المفضلة، إعلاناتك، وعمليات البحث المحفوظة من هذا الجهاز",
    resetDataConfirm: "هل أنت متأكد؟ لا يمكن التراجع عن هذا الإجراء.", resetDataConfirmYes: "نعم، امسح البيانات", cancel: "إلغاء",
    resetDataDone: "تم مسح البيانات بنجاح", appVersion: "إصدار التطبيق", privacyPolicy: "سياسة الخصوصية", termsOfService: "الشروط والأحكام",
    piBalance: "رصيد Pi", boostWithPi: "عزّز إعلاناتك بـ Pi", guest: "زائر", memberSince: "عضو منذ 2026",
    inCity: "في", filters: "فلاتر بحث", clearAll: "مسح الكل", applyFilters: "تطبيق الفلاتر", from: "من", to: "إلى",
    price: "السعر", priceRange: "نطاق السعر", minPrice: "أقل سعر", maxPrice: "أعلى سعر",
    pickBrandFirst: "اختر الماركة أولاً لعرض الموديلات الشائعة، أو اكتب الموديل يدوياً",
    pickCategoryFirst: "اختر فئة الإعلان أولاً لتفعيل زر النشر",
    fillRequiredFields: "أدخل عنوان الإعلان والسعر لتفعيل زر النشر",
    publishSuccessTitle: "تم نشر إعلانك بنجاح!",
    publishSuccessBody: "إعلانك الآن قيد المراجعة وسيظهر للمشترين في السوق الليبي خلال دقائق.",
    backToHome: "العودة للرئيسية", publishAnother: "أضف إعلاناً آخر", viewMyListing: "عرض إعلانك المنشور",
    compare: "قارن", compareBar: "المقارنة", compareNow: "قارن الآن", compareTitle: "مقارنة الإعلانات",
    clearCompare: "إلغاء", selectTwoToCompare: "اختر إعلانين للمقارنة بينهما",
    savedSearches: "عمليات بحث محفوظة", saveThisSearch: "احفظ هذا البحث كتنبيه", noSavedSearches: "لا توجد عمليات بحث محفوظة بعد",
  },
  en: {
    brand: "LIBYANSOUQ", brandSub: "السوق الليبي",
    tagline: "Buy and sell with confidence, city to city across Libya",
    searchPh: "Search for an item or category…",
    categories: "Categories", seeAll: "See all", featured: "Featured listings",
    nav: { home: "Home", categories: "Categories", sell: "Sell", chat: "Messages", profile: "Profile" },
    verified: "Verified seller", ld: "LYD", back: "Back",
    sellTitle: "Post your listing", sellSub: "Fill in the details so buyers across Libya can find it",
    photoLabel: "Add photos", photoHint: "Drag or tap to add up to 8 photos",
    fieldTitle: "Listing title", fieldCat: "Category", fieldPrice: "Price (LYD)", fieldCity: "City", fieldDesc: "Description",
    publish: "Publish listing", contactSeller: "Contact seller",
    productDesc: "About this listing",
    productDescBody: "Original item in very good condition, lightly used. Inspection welcome before agreeing. Hand-to-hand delivery within the city.",
    posted: "Posted 2 days ago",
    allCategoriesTitle: "All Categories", allProductsTitle: "All Listings",
    chooseType: "Choose a section", showAllIn: "Show all in",
    shippingAvailable: "International shipping available", shipFrom: "Ships from",
    chooseCarrier: "Choose a shipping carrier", confirmCarrier: "Confirm selection", carrierSelected: "Selected",
    allCities: "All", chooseCity: "Choose a city", listingsAvailable: "listings available",
    chooseDistrict: "Choose an area", allDistricts: "All areas in city",
    verifiedOnly: "Verified only", newest: "Newest", priceLow: "Price: Low to High", priceHigh: "Price: High to Low",
    makeOffer: "Make Offer", yourOffer: "Your offer", offerSent: "Your offer was sent to the seller",
    reportListing: "Report this listing", reportSent: "Your report was sent — thanks for keeping the marketplace safe",
    searchResultsFor: "Search results for", noResults: "No matching results",
    favorites: "Favorites", noFavorites: "No favorites yet",
    noMyListings: "You haven't published any listings yet",
    myListings: "My Listings", myRating: "Rating", savedCarriers: "Saved Carriers", settings: "Settings",
    approx: "approx.", shipsAbroad: "Seller offers international shipping on this item",
    offerIntlShipping: "Offer international shipping", offerIntlShippingHint: "Lets buyers from neighboring countries (Egypt, Tunisia...) pick a carrier to receive this item",
    settingsAppSection: "App", settingsDataSection: "Data", settingsAboutSection: "About",
    languageLabel: "Language", notificationsLabel: "Notifications", notificationsHint: "Alerts for offers, messages, and saved searches",
    piEquivalentLabel: "Also show price in LYD", piEquivalentHint: "Shown as a secondary price under the main Pi price",
    resetDataLabel: "Clear all my local data", resetDataHint: "Clears favorites, your listings, and saved searches from this device",
    resetDataConfirm: "Are you sure? This cannot be undone.", resetDataConfirmYes: "Yes, clear my data", cancel: "Cancel",
    resetDataDone: "Your data was cleared", appVersion: "App version", privacyPolicy: "Privacy Policy", termsOfService: "Terms of Service",
    piBalance: "Pi Balance", boostWithPi: "Boost listings with Pi", guest: "Guest", memberSince: "Member since 2026",
    inCity: "in", filters: "Filters", clearAll: "Clear all", applyFilters: "Apply filters", from: "From", to: "To",
    price: "Price", priceRange: "Price range", minPrice: "Min price", maxPrice: "Max price",
    pickBrandFirst: "Choose a brand first to see common models, or type the model manually",
    pickCategoryFirst: "Choose a category first to enable publishing",
    fillRequiredFields: "Enter a title and price to enable publishing",
    publishSuccessTitle: "Your listing is live!",
    publishSuccessBody: "Your listing is under review and will appear to buyers on LibyanSouq within minutes.",
    backToHome: "Back to Home", publishAnother: "Publish another listing", viewMyListing: "View your listing",
    compare: "Compare", compareBar: "Compare", compareNow: "Compare now", compareTitle: "Compare Listings",
    clearCompare: "Clear", selectTwoToCompare: "Select two listings to compare",
    savedSearches: "Saved Searches", saveThisSearch: "Save this search as an alert", noSavedSearches: "No saved searches yet",
  },
};

/* ---------------- Small UI atoms ---------------- */

function TilePattern({ opacity = 0.06, color = CREAM }) {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity }}>
      <defs>
        <pattern id="zellige" width="34" height="34" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="34" height="34" fill="none" />
          <path d="M17 0 L34 17 L17 34 L0 17 Z" fill="none" stroke={color} strokeWidth="1" />
          <circle cx="17" cy="17" r="4" fill="none" stroke={color} strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#zellige)" />
    </svg>
  );
}

function PriceTag({ value, ld, dir, showLYD, compact }) {
  const piValue = value / PI_RATE;
  const piFormatted = piValue.toLocaleString(dir === "rtl" ? "ar-LY" : "en-US", {
    maximumFractionDigits: piValue < 10 ? 2 : 0,
  });
  return (
    <span className={compact ? "" : "flex flex-col"}>
      <span className="font-bold" style={{ color: GOLD }}>
        {piFormatted} <span className="text-xs font-medium opacity-80">π</span>
      </span>
      {showLYD && (
        <span className="text-[10px] opacity-50 block mt-0.5">
          {value.toLocaleString(dir === "rtl" ? "ar-LY" : "en-US")} {ld}
        </span>
      )}
    </span>
  );
}

function Logo({ lang, size = "base" }) {
  const big = size === "lg";
  return (
    <div className="flex flex-col leading-none">
      <div className={`flex items-baseline gap-1.5 display-font font-extrabold ${big ? "text-3xl" : "text-lg"}`}>
        <span style={{ color: CREAM }}>{lang === "ar" ? "السوق" : "LIBYAN"}</span>
        <span style={{ color: GOLD }}>{lang === "ar" ? "الليبي" : "SOUQ"}</span>
      </div>
      <div className={`mt-1 ${big ? "text-[11px]" : "text-[9px]"} font-semibold`} style={{ color: "rgba(243,239,230,0.45)", letterSpacing: "0.28em" }}>
        {lang === "ar" ? "LIBYANSOUQ" : "السوق الليبي"}
      </div>
    </div>
  );
}

function CityChips({ lang, t, selectedCity, onSelect, onOpenDistricts }) {
  return (
    <div className="flex items-center gap-2 mb-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
      <button onClick={() => onSelect(null)} className="press shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-transform" style={{ background: !selectedCity ? GOLD : "rgba(243,239,230,0.06)", color: !selectedCity ? BLACK : CREAM, border: `1px solid ${!selectedCity ? GOLD : "rgba(243,239,230,0.15)"}` }}>
        {t.allCities}
      </button>
      {CITIES.map((c) => {
        const sel = selectedCity === c.id;
        const hasDistricts = !!DISTRICTS_BY_CITY[c.id];
        const borderColor = sel ? GOLD : "rgba(243,239,230,0.15)";
        return (
          <div key={c.id} className="shrink-0 flex items-center rounded-full overflow-hidden" style={{ background: sel ? GOLD : "rgba(243,239,230,0.06)", border: `1px solid ${borderColor}` }}>
            <button onClick={() => onSelect(c.id)} className="press px-3 py-1.5 text-xs font-semibold transition-transform" style={{ color: sel ? BLACK : CREAM }}>
              {lang === "ar" ? c.ar : c.en}
            </button>
            {hasDistricts && (
              <button
                onClick={(e) => { e.stopPropagation(); onOpenDistricts(c.id); }}
                className="press pl-1.5 pr-2.5 py-1.5 transition-transform"
                style={{ color: sel ? BLACK : CREAM, borderLeft: `1px solid ${sel ? "rgba(20,20,20,0.25)" : "rgba(243,239,230,0.15)"}` }}
              >
                <ChevronDown size={12} />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

function FilterBar({ lang, t, sortBy, onCycleSort, verifiedOnly, onToggleVerified, filterCount, onOpenFilters }) {
  const sortLabel = sortBy === "price_asc" ? t.priceLow : sortBy === "price_desc" ? t.priceHigh : t.newest;
  return (
    <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
      <button onClick={onOpenFilters} className="press shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold transition-transform" style={{ background: filterCount ? `${GOLD}22` : "rgba(243,239,230,0.06)", border: `1px solid ${filterCount ? GOLD : "rgba(243,239,230,0.15)"}` }}>
        <SlidersHorizontal size={13} /> {t.filters}{filterCount > 0 && <span className="w-4 h-4 rounded-full flex items-center justify-center text-[9px]" style={{ background: GOLD, color: BLACK }}>{filterCount}</span>}
      </button>
      <button onClick={onCycleSort} className="press shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold transition-transform" style={{ background: "rgba(243,239,230,0.06)", border: "1px solid rgba(243,239,230,0.15)" }}>
        <ArrowUpDown size={13} /> {sortLabel}
      </button>
      <button onClick={onToggleVerified} className="press shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold transition-transform" style={{ background: verifiedOnly ? `${GOLD}22` : "rgba(243,239,230,0.06)", border: `1px solid ${verifiedOnly ? GOLD : "rgba(243,239,230,0.15)"}` }}>
        <ShieldCheck size={13} /> {t.verifiedOnly}
      </button>
    </div>
  );
}

/* ---------------- Main App ---------------- */

export default function App() {
  const [lang, setLang] = useState("ar");
  const [view, setView] = useState("home");
  const [activeCat, setActiveCat] = useState(null);
  const [activeSubcat, setActiveSubcat] = useState(null);
  const [activeProduct, setActiveProduct] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const [compareIds, setCompareIds] = useState([]);
  const [savedSearches, setSavedSearches] = useState([]);
  const [showShipping, setShowShipping] = useState(false);
  const [selectedCarrier, setSelectedCarrier] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [showDistrictPicker, setShowDistrictPicker] = useState(false);
  const [districtPickerCity, setDistrictPickerCity] = useState(null);
  const [districtPickerTarget, setDistrictPickerTarget] = useState("browse");
  const [sortBy, setSortBy] = useState("newest");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [catFilters, setCatFilters] = useState({});
  const [showCatFilters, setShowCatFilters] = useState(false);
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const [reported, setReported] = useState(false);
  const [sellCategory, setSellCategory] = useState(null);
  const [sellSubcat, setSellSubcat] = useState(null);
  const [sellCity, setSellCity] = useState(null);
  const [sellDistrict, setSellDistrict] = useState(null);
  const [sellTitle, setSellTitle] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  const [sellDescription, setSellDescription] = useState("");
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showLYD, setShowLYD] = useState(false);
  const [sellInternational, setSellInternational] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetDone, setResetDone] = useState(false);
  const [piPaymentStatus, setPiPaymentStatus] = useState("");
  const [piUser, setPiUser] = useState(null);
  const [piAuthStatus, setPiAuthStatus] = useState("");
  const [showOffer, setShowOffer] = useState(false);
  const [offerAmount, setOfferAmount] = useState("");
  const [offerSent, setOfferSent] = useState(false);

  const t = COPY[lang];
  const dir = lang === "ar" ? "rtl" : "ltr";
  const nameOf = (obj) => (lang === "ar" ? obj.ar : obj.en);
  const countryOf = (p) => (lang === "ar" ? p.country_ar : p.country_en);
  const cityOf = (p) => {
    let base;
    if (p.cityId) {
      const c = CITIES.find((x) => x.id === p.cityId);
      base = c ? nameOf(c) : "";
    } else {
      base = (lang === "ar" ? p.city_ar : p.city_en) || "";
    }
    if (p.districtId && p.cityId && DISTRICTS_BY_CITY[p.cityId]) {
      const d = DISTRICTS_BY_CITY[p.cityId].find((x) => x.id === p.districtId);
      if (d) return `${nameOf(d)}, ${base}`;
    }
    return base;
  };

  const allProducts = useMemo(() => [...userListings, ...PRODUCTS], [userListings]);

  const activeCatObj = CATEGORIES.find((c) => c.id === activeCat) || null;
  const activeSchema = activeSubcat ? SUBCAT_FILTERS[activeSubcat] : null;
  const catFilterCount = activeSchema ? activeSchema.filter((f) => {
    const v = catFilters[f.id];
    if (f.type === "range") return v && (v.from || v.to);
    return v !== undefined && v !== null && v !== "";
  }).length : 0;
  const activeFilterCount = catFilterCount + (priceFrom ? 1 : 0) + (priceTo ? 1 : 0);

  const baseFiltered = useMemo(() => {
    let list = allProducts.filter((p) => {
      if (selectedCity && p.cityId !== selectedCity) return false;
      if (selectedDistrict && p.districtId !== selectedDistrict) return false;
      if (verifiedOnly && !p.verified) return false;
      if (priceFrom && p.price < Number(priceFrom)) return false;
      if (priceTo && p.price > Number(priceTo)) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        if (!p.ar.includes(searchQuery.trim()) && !p.en.toLowerCase().includes(q)) return false;
      }
      return true;
    });
    if (sortBy === "price_asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sortBy === "price_desc") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [allProducts, selectedCity, selectedDistrict, verifiedOnly, priceFrom, priceTo, searchQuery, sortBy]);

  const matchesCatFilters = (p) => {
    if (!activeSubcat || !activeSchema) return true;
    return activeSchema.every((f) => {
      const val = catFilters[f.id];
      if (f.type === "range") {
        if (!val || (!val.from && !val.to)) return true;
        const pv = p[f.id];
        if (pv === undefined) return true;
        if (val.from && pv < Number(val.from)) return false;
        if (val.to && pv > Number(val.to)) return false;
        return true;
      }
      if (val === undefined || val === null || val === "") return true;
      if (f.type === "select") return p[f.id] === val;
      if (f.type === "text") return p[f.id] && String(p[f.id]).toLowerCase().includes(String(val).toLowerCase());
      return true;
    });
  };

  const visibleProducts = useMemo(() => {
    let list = baseFiltered;
    if (activeCat) list = list.filter((p) => p.cat === activeCat);
    if (activeSubcat) list = list.filter((p) => p.subcat === activeSubcat);
    list = list.filter(matchesCatFilters);
    return list;
  }, [baseFiltered, activeCat, activeSubcat, catFilters]);

  const toggleFav = (id) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleCompare = (id) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });
  };

  const saveCurrentSearch = () => {
    const label = [
      activeCatObj ? nameOf(activeCatObj) : null,
      selectedCity ? nameOf(CITIES.find((c) => c.id === selectedCity)) : null,
      priceFrom || priceTo ? `${priceFrom || "0"}-${priceTo || "∞"}` : null,
    ].filter(Boolean).join(" · ") || t.allProductsTitle;
    setSavedSearches((prev) => [{ id: Date.now(), label, active: true }, ...prev].slice(0, 10));
  };

  const handleCitySelect = (cityId) => {
    setSelectedCity(cityId);
    setSelectedDistrict(null);
  };

  const handleSellCitySelect = (cityId) => {
    setSellCity(cityId);
    setSellDistrict(null);
  };

  const openDistrictPicker = (cityId, target = "browse") => {
    if (target === "sell") setSellCity(cityId);
    else setSelectedCity(cityId);
    setDistrictPickerCity(cityId);
    setDistrictPickerTarget(target);
    setShowDistrictPicker(true);
  };

  const resetSellForm = () => {
    setSellCategory(null);
    setSellSubcat(null);
    setSellCity(null);
    setSellDistrict(null);
    setSellTitle("");
    setSellPrice("");
    setSellDescription("");
    setSellInternational(false);
    setPublishSuccess(false);
  };

  const publishListing = () => {
    if (!sellCategory || !sellTitle.trim() || !sellPrice) return;
    const newListing = {
      id: Date.now(),
      cat: sellCategory,
      subcat: sellSubcat || undefined,
      ar: sellTitle.trim(),
      en: sellTitle.trim(),
      price: Number(sellPrice) || 0,
      cityId: sellCity || undefined,
      districtId: sellDistrict || undefined,
      country_ar: "ليبيا",
      country_en: "Libya",
      grad: GRADS[userListings.length % GRADS.length],
      verified: false,
      description: sellDescription.trim(),
      isUserListing: true,
      internationalShipping: sellInternational,
    };
    setUserListings((prev) => [newListing, ...prev]);
    setPublishSuccess(true);
  };

  const resetAppData = () => {
    setFavorites(new Set());
    setCompareIds([]);
    setSavedSearches([]);
    setUserListings([]);
    resetSellForm();
  };

  const openCategory = (c) => {
    setActiveCat(c.id);
    setActiveSubcat(null);
    setCatFilters({});
    setView(c.subcats?.length ? "subcategory" : "category");
  };

  const openSubcat = (sc) => {
    setActiveSubcat(sc.id);
    setCatFilters({});
    setView("category");
  };

  const openProduct = (p) => {
    setActiveProduct(p);
    setSelectedCarrier(null);
    setReported(false);
    setShowOffer(false);
    setOfferSent(false);
    setOfferAmount("");
    setView("product");
  };

  const categoryBack = () => {
    if (activeSubcat && activeCatObj?.subcats) { setView("subcategory"); return; }
    if (activeCat) { setView("allCategories"); return; }
    setView("home");
  };

  const cycleSort = () => setSortBy((p) => (p === "newest" ? "price_asc" : p === "price_asc" ? "price_desc" : "newest"));
  const setCatFilter = (fieldId, value) => setCatFilters((prev) => {
    const next = { ...prev, [fieldId]: value };
    if (fieldId === "brand") next.model = "";
    return next;
  });
  const setCatFilterRange = (fieldId, part, value) => setCatFilters((prev) => ({ ...prev, [fieldId]: { ...(prev[fieldId] || {}), [part]: value } }));

  const BackChevron = dir === "rtl" ? ChevronRight : ChevronLeft;
  const navCategoriesActive = ["allCategories", "category", "subcategory"].includes(view);
  const navProfileActive = ["profile", "favorites", "myListings", "settings"].includes(view);
  const searching = searchQuery.trim().length > 0;

  if (!piUser) {
    return (
      <div dir={dir} className="w-full min-h-screen flex items-center justify-center px-6" style={{ background: BLACK, color: CREAM, fontFamily: lang === "ar" ? "'Tajawal', sans-serif" : "'Inter', sans-serif" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@600;700;800&family=Tajawal:wght@400;500;700&family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap');
          .display-font { font-family: ${lang === "ar" ? "'Cairo', sans-serif" : "'Space Grotesk', sans-serif"}; }
          .press:active { transform: scale(0.98); }
        `}</style>
        <div className="w-full max-w-sm text-center">
          <div className="flex justify-center mb-6">
            <Logo lang={lang} size="lg" />
          </div>
          <p className="text-sm opacity-70 mb-8">
            {lang === "ar" ? "سجّل الدخول بحساب Pi للمتابعة إلى السوق الليبي" : "Sign in with your Pi account to continue to LibyanSouq"}
          </p>
          <button
            onClick={() => { setPiAuthStatus(""); runPiAuth((user) => setPiUser(user), setPiAuthStatus); }}
            className="press w-full py-3.5 rounded-2xl font-bold text-sm transition-transform"
            style={{ background: `linear-gradient(120deg, ${GOLD_LIGHT}, ${GOLD})`, color: BLACK }}
          >
            {lang === "ar" ? "تسجيل الدخول بـ Pi" : "Sign in with Pi"}
          </button>
          {piAuthStatus && <p className="text-xs mt-4 opacity-60">{piAuthStatus}</p>}
          <button onClick={() => setLang(lang === "ar" ? "en" : "ar")} className="press mt-6 text-xs font-semibold opacity-50 transition-transform">
            {lang === "ar" ? "English" : "العربية"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div dir={dir} className="w-full min-h-screen flex justify-center" style={{ background: "#0A0A0A", fontFamily: lang === "ar" ? "'Tajawal', sans-serif" : "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@600;700;800&family=Tajawal:wght@400;500;700&family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap');
        .display-font { font-family: ${lang === "ar" ? "'Cairo', sans-serif" : "'Space Grotesk', sans-serif"}; }
        ::-webkit-scrollbar { width: 0px; height: 0px; }
        .cat-card:active { transform: scale(0.96); }
        .press:active { transform: scale(0.98); }
      `}</style>

      <div className="relative w-full max-w-[430px] min-h-screen flex flex-col" style={{ background: BLACK, color: CREAM }}>

        {/* ---------------- HOME ---------------- */}
        {view === "home" && (
          <>
            <div className="relative overflow-hidden px-5 pt-6 pb-6" style={{ background: `radial-gradient(120% 90% at 100% 0%, ${GOLD}1f, transparent 60%), linear-gradient(160deg,${CHARCOAL},${BLACK} 78%)` }}>
              <TilePattern />
              <div className="relative flex items-center justify-between mb-5">
                <Logo lang={lang} />
                <button onClick={() => setLang(lang === "ar" ? "en" : "ar")} className="press flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold transition-transform" style={{ background: "rgba(243,239,230,0.08)", border: "1px solid rgba(243,239,230,0.15)" }}>
                  <Languages size={14} />
                  {lang === "ar" ? "EN" : "AR"}
                </button>
              </div>

              <h1 className="relative display-font text-[26px] font-extrabold leading-tight mb-2">{t.tagline}</h1>

              <div className="relative mt-4 flex items-center gap-2 rounded-2xl px-4 py-3 mb-3" style={{ background: CREAM }}>
                <Search size={18} color="#5C4A2A" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.searchPh}
                  className="bg-transparent outline-none text-sm w-full"
                  style={{ color: "#2A2118" }}
                />
                {searchQuery && (<button onClick={() => setSearchQuery("")}><X size={15} color="#5C4A2A" /></button>)}
              </div>

              <div className="relative">
                <CityChips lang={lang} t={t} selectedCity={selectedCity} onSelect={handleCitySelect} onOpenDistricts={openDistrictPicker} />
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] opacity-55">{baseFiltered.length} {t.listingsAvailable}</span>
                  <button onClick={() => setShowCatFilters(true)} className="press flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-transform" style={{ background: (priceFrom || priceTo) ? `${GOLD}26` : "rgba(243,239,230,0.08)", border: `1px solid ${(priceFrom || priceTo) ? GOLD : "rgba(243,239,230,0.15)"}` }}>
                    {(priceFrom || priceTo) ? `${priceFrom || "0"} - ${priceTo || "∞"} ${t.ld}` : t.priceRange}
                  </button>
                </div>
              </div>
            </div>

            {searching ? (
              <div className="px-5 pt-6 pb-28">
                <h2 className="display-font font-bold text-lg mb-4">{t.searchResultsFor} "{searchQuery}" ({baseFiltered.length})</h2>
                <div className="grid grid-cols-2 gap-3">
                  {baseFiltered.map((p) => (
                    <ProductCard key={p.id} p={p} lang={lang} t={t} dir={dir} cityLabel={cityOf(p)} isFav={favorites.has(p.id)} onFav={() => toggleFav(p.id)} onOpen={() => openProduct(p)} isComparing={compareIds.includes(p.id)} onCompare={() => toggleCompare(p.id)} showLYD={showLYD} />
                  ))}
                  {baseFiltered.length === 0 && <p className="col-span-2 text-sm opacity-60 text-center py-10">{t.noResults}</p>}
                </div>
              </div>
            ) : (
              <>
                <div className="px-5 pt-6">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="display-font font-bold text-base">{t.categories}</h2>
                    <button onClick={() => setView("allCategories")} className="press text-xs font-semibold transition-transform" style={{ color: GOLD }}>{t.seeAll}</button>
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    {CATEGORIES.slice(0, 8).map((c) => {
                      const Icon = c.icon;
                      return (
                        <button key={c.id} onClick={() => openCategory(c)} className="cat-card flex flex-col items-center gap-1.5 transition-transform">
                          <div className="relative w-14 h-14 rounded-2xl flex items-center justify-center overflow-hidden" style={{ background: `${GOLD}1a`, border: `1px solid ${GOLD}45` }}>
                            <Icon size={22} color={GOLD} strokeWidth={1.8} />
                          </div>
                          <span className="text-[10.5px] text-center leading-tight opacity-85">{nameOf(c)}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="px-5 pt-7 pb-28">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="display-font font-bold text-base">
                      {t.featured}{selectedCity && <span className="opacity-60 font-normal text-xs"> · {t.inCity} {selectedDistrict && DISTRICTS_BY_CITY[selectedCity] ? `${nameOf(DISTRICTS_BY_CITY[selectedCity].find((d) => d.id === selectedDistrict) || {})}, ` : ""}{nameOf(CITIES.find((c) => c.id === selectedCity))}</span>}
                    </h2>
                    <button onClick={() => { setActiveCat(null); setActiveSubcat(null); setView("allProducts"); }} className="press text-xs font-semibold transition-transform" style={{ color: GOLD }}>{t.seeAll}</button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {baseFiltered.slice(0, 8).map((p) => (
                      <ProductCard key={p.id} p={p} lang={lang} t={t} dir={dir} cityLabel={cityOf(p)} isFav={favorites.has(p.id)} onFav={() => toggleFav(p.id)} onOpen={() => openProduct(p)} isComparing={compareIds.includes(p.id)} onCompare={() => toggleCompare(p.id)} showLYD={showLYD} />
                    ))}
                    {baseFiltered.length === 0 && <p className="col-span-2 text-sm opacity-60 text-center py-10">{t.noResults}</p>}
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {/* ---------------- ALL CATEGORIES ---------------- */}
        {view === "allCategories" && (
          <div className="px-5 pt-6 pb-28">
            <button onClick={() => setView("home")} className="flex items-center gap-1 text-sm mb-4 opacity-80"><BackChevron size={16} /> {t.back}</button>
            <h2 className="display-font font-bold text-xl mb-5">{t.allCategoriesTitle}</h2>
            <div className="grid grid-cols-3 gap-4">
              {CATEGORIES.map((c) => {
                const Icon = c.icon;
                return (
                  <button key={c.id} onClick={() => openCategory(c)} className="cat-card flex flex-col items-center gap-2 transition-transform">
                    <div className="relative w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden" style={{ background: `${GOLD}1a`, border: `1px solid ${GOLD}45` }}>
                      <Icon size={24} color={GOLD} strokeWidth={1.8} />
                    </div>
                    <span className="text-[11px] text-center leading-tight opacity-85">{nameOf(c)}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ---------------- SUBCATEGORY VIEW ---------------- */}
        {view === "subcategory" && activeCatObj && (
          <div className="px-5 pt-6 pb-28">
            <button onClick={() => setView("allCategories")} className="flex items-center gap-1 text-sm mb-4 opacity-80"><BackChevron size={16} /> {t.back}</button>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${GOLD}1a`, border: `1px solid ${GOLD}45` }}>
                <activeCatObj.icon size={17} color={GOLD} />
              </div>
              <h2 className="display-font font-bold text-xl">{nameOf(activeCatObj)}</h2>
            </div>
            <p className="text-xs opacity-60 mb-5">{t.chooseType}</p>
            <div className="grid grid-cols-2 gap-3">
              {activeCatObj.subcats.map((sc) => (
                <button key={sc.id} onClick={() => openSubcat(sc)} className="press flex items-center justify-between gap-2 rounded-2xl px-4 py-4 text-start transition-transform" style={{ background: "rgba(243,239,230,0.05)", border: `1px solid ${GOLD}30` }}>
                  <span className="text-sm font-semibold">{nameOf(sc)}</span>
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: GOLD }} />
                </button>
              ))}
              <button onClick={() => setView("category")} className="press col-span-2 flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition-transform" style={{ background: "rgba(243,239,230,0.03)", border: "1px dashed rgba(243,239,230,0.25)" }}>
                {t.showAllIn} {nameOf(activeCatObj)}
              </button>
            </div>
          </div>
        )}

        {/* ---------------- CATEGORY / ALL PRODUCTS VIEW ---------------- */}
        {(view === "category" || view === "allProducts") && (
          <div className="px-5 pt-6 pb-28">
            <button onClick={view === "allProducts" ? () => setView("home") : categoryBack} className="flex items-center gap-1 text-sm mb-4 opacity-80"><BackChevron size={16} /> {t.back}</button>
            <h2 className="display-font font-bold text-xl mb-4">
              {view === "allProducts" ? t.allProductsTitle : activeSubcat ? nameOf(activeCatObj.subcats.find((s) => s.id === activeSubcat)) : nameOf(activeCatObj || {})}
            </h2>
            <CityChips lang={lang} t={t} selectedCity={selectedCity} onSelect={handleCitySelect} onOpenDistricts={openDistrictPicker} />
            <FilterBar
              lang={lang} t={t} sortBy={sortBy} onCycleSort={cycleSort}
              verifiedOnly={verifiedOnly} onToggleVerified={() => setVerifiedOnly((v) => !v)}
              filterCount={activeFilterCount}
              onOpenFilters={() => setShowCatFilters(true)}
            />
            <div className="grid grid-cols-2 gap-3">
              {(view === "allProducts" ? baseFiltered : visibleProducts).map((p) => (
                <ProductCard key={p.id} p={p} lang={lang} t={t} dir={dir} cityLabel={cityOf(p)} isFav={favorites.has(p.id)} onFav={() => toggleFav(p.id)} onOpen={() => openProduct(p)} isComparing={compareIds.includes(p.id)} onCompare={() => toggleCompare(p.id)} showLYD={showLYD} />
              ))}
              {(view === "allProducts" ? baseFiltered : visibleProducts).length === 0 && (
                <p className="col-span-2 text-sm opacity-60 text-center py-10">{t.noResults}</p>
              )}
            </div>
          </div>
        )}

        {/* ---------------- FAVORITES ---------------- */}
        {view === "favorites" && (
          <div className="px-5 pt-6 pb-28">
            <button onClick={() => setView("profile")} className="flex items-center gap-1 text-sm mb-4 opacity-80"><BackChevron size={16} /> {t.back}</button>
            <h2 className="display-font font-bold text-xl mb-4">{t.favorites}</h2>
            <div className="grid grid-cols-2 gap-3">
              {allProducts.filter((p) => favorites.has(p.id)).map((p) => (
                <ProductCard key={p.id} p={p} lang={lang} t={t} dir={dir} cityLabel={cityOf(p)} isFav onFav={() => toggleFav(p.id)} onOpen={() => openProduct(p)} isComparing={compareIds.includes(p.id)} onCompare={() => toggleCompare(p.id)} showLYD={showLYD} />
              ))}
              {favorites.size === 0 && <p className="col-span-2 text-sm opacity-60 text-center py-10">{t.noFavorites}</p>}
            </div>
          </div>
        )}

        {/* ---------------- MY LISTINGS ---------------- */}
        {view === "myListings" && (
          <div className="px-5 pt-6 pb-28">
            <button onClick={() => setView("profile")} className="flex items-center gap-1 text-sm mb-4 opacity-80"><BackChevron size={16} /> {t.back}</button>
            <h2 className="display-font font-bold text-xl mb-4">{t.myListings} ({userListings.length})</h2>
            <div className="grid grid-cols-2 gap-3">
              {userListings.map((p) => (
                <ProductCard key={p.id} p={p} lang={lang} t={t} dir={dir} cityLabel={cityOf(p)} isFav={favorites.has(p.id)} onFav={() => toggleFav(p.id)} onOpen={() => openProduct(p)} isComparing={compareIds.includes(p.id)} onCompare={() => toggleCompare(p.id)} showLYD={showLYD} />
              ))}
              {userListings.length === 0 && (
                <div className="col-span-2 flex flex-col items-center text-center py-14 gap-3">
                  <p className="text-sm opacity-60">{t.noMyListings}</p>
                  <button onClick={() => { resetSellForm(); setView("sell"); }} className="press px-5 py-2.5 rounded-full text-sm font-bold transition-transform" style={{ background: GOLD, color: BLACK }}>{t.sellTitle}</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ---------------- PRODUCT DETAIL ---------------- */}
        {view === "product" && activeProduct && (
          <div className="pb-32">
            <div className="relative h-64" style={{ background: `linear-gradient(135deg, ${activeProduct.grad[0]}, ${activeProduct.grad[1]})` }}>
              <TilePattern opacity={0.14} />
              <button onClick={() => setView(activeCat ? "category" : "allProducts")} className="absolute w-9 h-9 rounded-full flex items-center justify-center" style={{ top: "20px", [dir === "rtl" ? "right" : "left"]: "20px", background: "rgba(20,20,20,0.55)" }}>
                <BackChevron size={18} color={CREAM} />
              </button>
              <button onClick={() => toggleFav(activeProduct.id)} className="absolute w-9 h-9 rounded-full flex items-center justify-center" style={{ top: "20px", [dir === "rtl" ? "left" : "right"]: "20px", background: "rgba(20,20,20,0.55)" }}>
                <Heart size={17} color={CREAM} fill={favorites.has(activeProduct.id) ? CREAM : "none"} />
              </button>
            </div>

            <div className="px-5 pt-5">
              <div className="flex items-start justify-between gap-3 mb-1">
                <h1 className="display-font font-bold text-xl leading-snug">{nameOf(activeProduct)}</h1>
                {activeProduct.verified && (
                  <span className="shrink-0 flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full" style={{ background: `${TEAL_ACCENT}22`, color: TEAL_ACCENT }}>
                    <ShieldCheck size={12} /> {t.verified}
                  </span>
                )}
              </div>
              <div className="text-2xl mb-3"><PriceTag value={activeProduct.price} ld={t.ld} dir={dir} showLYD={showLYD} /></div>
              <div className="flex items-center gap-1.5 text-xs opacity-70 mb-4">
                <MapPin size={13} /> {cityOf(activeProduct)}, {countryOf(activeProduct)} · {t.posted}
              </div>

              {(activeProduct.brand || activeProduct.year || activeProduct.mileage !== undefined || activeProduct.condition || activeProduct.size || activeProduct.rooms || activeProduct.karat) && (
                <div className="flex flex-wrap gap-2 mb-5">
                  {activeProduct.brand && <SpecChip label={activeProduct.brand.toUpperCase()} />}
                  {activeProduct.model && <SpecChip label={activeProduct.model} />}
                  {activeProduct.year && <SpecChip label={activeProduct.year} />}
                  {activeProduct.mileage !== undefined && <SpecChip label={`${activeProduct.mileage.toLocaleString()} ${lang === "ar" ? "كم" : "km"}`} />}
                  {activeProduct.condition && <SpecChip label={nameOf(COND_OPTS.find((o) => o.id === activeProduct.condition) || {})} />}
                  {activeProduct.size && <SpecChip label={activeProduct.size.toUpperCase()} />}
                  {activeProduct.rooms && <SpecChip label={`${activeProduct.rooms} ${lang === "ar" ? "غرف" : "rooms"}`} />}
                  {activeProduct.bathrooms && <SpecChip label={`${activeProduct.bathrooms} ${lang === "ar" ? "حمامات" : "baths"}`} />}
                  {activeProduct.area && <SpecChip label={`${activeProduct.area} m²`} />}
                  {activeProduct.karat && activeProduct.karat !== "na" && <SpecChip label={`${activeProduct.karat}K`} />}
                </div>
              )}

              <div className="h-px w-full mb-5" style={{ background: "rgba(243,239,230,0.1)" }} />

              <h3 className="text-sm font-bold mb-2">{t.productDesc}</h3>
              <p className="text-sm leading-relaxed opacity-75 mb-6">{activeProduct.isUserListing && activeProduct.description ? activeProduct.description : t.productDescBody}</p>

              <div className="flex items-center gap-3 p-3 rounded-2xl mb-4" style={{ background: "rgba(243,239,230,0.06)" }}>
                <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold" style={{ background: GOLD, color: BLACK }}>
                  {lang === "ar" ? "ب" : "S"}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold">{lang === "ar" ? "بائع من " + cityOf(activeProduct) : "Seller in " + cityOf(activeProduct)}</div>
                  <div className="flex items-center gap-1 text-[11px] opacity-60">
                    <Star size={11} fill={GOLD} color={GOLD} /> 4.8 · 32 {lang === "ar" ? "تقييم" : "reviews"}
                  </div>
                </div>
              </div>

              {(activeProduct.country_ar !== "ليبيا" || activeProduct.internationalShipping) && (
                <div className="rounded-2xl p-4 mb-4" style={{ background: "rgba(243,239,230,0.05)", border: `1px solid ${GOLD}40` }}>
                  <div className="flex items-center gap-2 mb-1">
                    <Truck size={16} color={GOLD} />
                    <span className="text-sm font-bold">{t.shippingAvailable}</span>
                  </div>
                  <p className="text-xs opacity-70 mb-3">
                    {activeProduct.country_ar !== "ليبيا" ? `${t.shipFrom}: ${countryOf(activeProduct)}` : t.shipsAbroad}
                  </p>
                  <button onClick={() => setShowShipping(true)} className="press w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-transform" style={{ background: GOLD, color: BLACK }}>
                    {selectedCarrier ? `${t.carrierSelected}: ${nameOf(SHIPPING_CARRIERS.find((c) => c.id === selectedCarrier))}` : t.chooseCarrier}
                  </button>
                </div>
              )}

              {!reported ? (
                <button onClick={() => setReported(true)} className="press flex items-center gap-1.5 text-xs opacity-50 transition-transform">
                  <Flag size={12} /> {t.reportListing}
                </button>
              ) : (
                <p className="text-xs leading-relaxed" style={{ color: GOLD }}>{t.reportSent}</p>
              )}
            </div>

            <div className="fixed bottom-0 w-full max-w-[430px] px-5 py-4" style={{ background: `linear-gradient(0deg,${BLACK} 75%,transparent)` }}>
              {!showOffer ? (
                <div className="flex gap-2">
                  <button className="press flex-1 py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-transform" style={{ background: `linear-gradient(120deg, ${GOLD_LIGHT}, ${GOLD})`, color: BLACK }}>
                    <MessageCircle size={17} /> {t.contactSeller}
                  </button>
                  <button onClick={() => setShowOffer(true)} className="press py-3.5 px-4 rounded-2xl font-bold text-sm transition-transform" style={{ border: `1.5px solid ${GOLD}`, color: GOLD }}>
                    {t.makeOffer}
                  </button>
                </div>
              ) : offerSent ? (
                <div className="flex items-center justify-between gap-2 py-3.5 px-4 rounded-2xl" style={{ background: `${GOLD}22`, border: `1px solid ${GOLD}` }}>
                  <span className="text-sm font-semibold">{t.offerSent} ✅</span>
                  <button onClick={() => { setShowOffer(false); setOfferSent(false); setOfferAmount(""); }}><X size={16} /></button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <input value={offerAmount} onChange={(e) => setOfferAmount(e.target.value)} type="number" placeholder={t.yourOffer} className="flex-1 rounded-2xl px-4 py-3 text-sm outline-none" style={{ background: CREAM, color: "#2A2118" }} />
                  <button onClick={() => { if (offerAmount) setOfferSent(true); }} className="press w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center transition-transform" style={{ background: GOLD }}>
                    <Send size={18} color={BLACK} />
                  </button>
                  <button onClick={() => setShowOffer(false)} className="press w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center transition-transform" style={{ background: "rgba(243,239,230,0.08)" }}>
                    <X size={18} />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ---------------- COMPARE VIEW ---------------- */}
        {view === "compare" && (
          <div className="px-5 pt-6 pb-28">
            <button onClick={() => setView(activeCat ? "category" : "allProducts")} className="flex items-center gap-1 text-sm mb-4 opacity-80"><BackChevron size={16} /> {t.back}</button>
            <h2 className="display-font font-bold text-xl mb-4">{t.compareTitle}</h2>
            {compareIds.length < 2 ? (
              <p className="text-sm opacity-60 text-center py-10">{t.selectTwoToCompare}</p>
            ) : (() => {
              const items = compareIds.map((id) => allProducts.find((p) => p.id === id)).filter(Boolean);
              const brandLabel = (p) => {
                const map = p.cat === "vehicles" ? CAR_BRANDS : p.cat === "electronics" ? ELEC_BRANDS : null;
                if (!map || !p.brand) return p.brand || "—";
                return nameOf(map.find((b) => b.id === p.brand) || { ar: p.brand, en: p.brand });
              };
              const condLabel = (p) => p.condition ? nameOf(COND_OPTS.find((c) => c.id === p.condition) || { ar: p.condition, en: p.condition }) : "—";
              const rows = [
                { label: lang === "ar" ? "السعر" : "Price", get: (p) => `${(p.price / PI_RATE).toLocaleString(undefined, { maximumFractionDigits: p.price / PI_RATE < 10 ? 2 : 0 })} π` },
                { label: lang === "ar" ? "المدينة" : "City", get: (p) => cityOf(p) },
                { label: lang === "ar" ? "الماركة" : "Brand", get: (p) => brandLabel(p) },
                { label: lang === "ar" ? "الموديل" : "Model", get: (p) => p.model || "—" },
                { label: lang === "ar" ? "السنة" : "Year", get: (p) => p.year || "—" },
                { label: lang === "ar" ? "الحالة" : "Condition", get: (p) => condLabel(p) },
                { label: lang === "ar" ? "عداد المشي" : "Mileage", get: (p) => p.mileage !== undefined ? `${p.mileage.toLocaleString()} ${lang === "ar" ? "كم" : "km"}` : "—" },
                { label: lang === "ar" ? "التخزين" : "Storage", get: (p) => p.storage ? p.storage.toUpperCase() : "—" },
                { label: lang === "ar" ? "بائع موثّق" : "Verified", get: (p) => p.verified ? "✓" : "—" },
              ];
              return (
                <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(243,239,230,0.1)" }}>
                  <div className="grid grid-cols-2 gap-px" style={{ background: "rgba(243,239,230,0.1)" }}>
                    {items.map((p) => (
                      <div key={p.id} className="p-3" style={{ background: PANEL }}>
                        <div className="h-16 rounded-xl mb-2" style={{ background: `linear-gradient(135deg, ${p.grad[0]}, ${p.grad[1]})` }} />
                        <p className="text-[12px] font-semibold leading-snug line-clamp-2">{nameOf(p)}</p>
                      </div>
                    ))}
                  </div>
                  {rows.map((r, i) => (
                    <div key={i} style={{ background: i % 2 === 0 ? "rgba(243,239,230,0.02)" : "transparent" }}>
                      <div className="text-[10px] opacity-50 px-3 pt-2">{r.label}</div>
                      <div className="grid grid-cols-2 gap-px pb-2">
                        {items.map((p) => (
                          <div key={p.id} className="px-3 pt-1">
                            <div className="text-xs font-semibold" style={{ color: r.label === (lang === "ar" ? "السعر" : "Price") ? GOLD : CREAM }}>{r.get(p)}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        )}

        {/* ---------------- SELL FORM ---------------- */}
        {view === "sell" && (
          <div className="px-5 pt-6 pb-32">
            {publishSuccess ? (
              <div className="flex flex-col items-center text-center pt-16">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: `${GOLD}22` }}>
                  <Check size={28} color={GOLD} />
                </div>
                <h2 className="display-font font-bold text-xl mb-2">{t.publishSuccessTitle}</h2>
                <p className="text-sm opacity-60 mb-8 px-4">{t.publishSuccessBody}</p>
                <button
                  onClick={() => { resetSellForm(); setView("myListings"); }}
                  className="press w-full py-3.5 rounded-2xl font-bold text-sm transition-transform mb-3"
                  style={{ background: `linear-gradient(120deg, ${GOLD_LIGHT}, ${GOLD})`, color: BLACK }}
                >
                  {t.viewMyListing}
                </button>
                <button
                  onClick={() => { resetSellForm(); setView("home"); }}
                  className="press w-full py-3.5 rounded-2xl font-bold text-sm transition-transform mb-3"
                  style={{ border: `1.5px solid ${GOLD}`, color: GOLD }}
                >
                  {t.backToHome}
                </button>
                <button onClick={resetSellForm} className="press text-sm font-semibold transition-transform" style={{ color: GOLD }}>
                  {t.publishAnother}
                </button>
              </div>
            ) : (
              <>
                <button onClick={() => { resetSellForm(); setView("home"); }} className="flex items-center gap-1 text-sm mb-4 opacity-80"><BackChevron size={16} /> {t.back}</button>
                <h2 className="display-font font-bold text-xl mb-1">{t.sellTitle}</h2>
                <p className="text-xs opacity-60 mb-6">{t.sellSub}</p>

                <label className="block text-xs font-semibold mb-2 opacity-80">{t.photoLabel}</label>
                <div className="rounded-2xl mb-5 flex flex-col items-center justify-center gap-2 py-8" style={{ border: "1.5px dashed rgba(243,239,230,0.25)", background: "rgba(243,239,230,0.04)" }}>
                  <Grid3x3 size={22} color={GOLD} />
                  <span className="text-xs opacity-60">{t.photoHint}</span>
                </div>

                <Field label={t.fieldTitle} value={sellTitle} onChange={(e) => setSellTitle(e.target.value)} placeholder={lang === "ar" ? "مثال: دراجة هوائية بحالة جيدة" : "e.g. Bicycle in good condition"} />

                <label className="block text-xs font-semibold mb-2 mt-4 opacity-80">{t.fieldCat}</label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {CATEGORIES.map((c) => {
                    const sel = sellCategory === c.id;
                    return (
                      <button
                        key={c.id}
                        onClick={() => { setSellCategory(c.id); setSellSubcat(null); }}
                        className="press text-[11px] px-3 py-1.5 rounded-full font-semibold transition-transform"
                        style={{ background: sel ? GOLD : "rgba(243,239,230,0.06)", color: sel ? BLACK : CREAM, border: `1px solid ${sel ? GOLD : "rgba(243,239,230,0.15)"}` }}
                      >
                        {nameOf(c)}
                      </button>
                    );
                  })}
                </div>

                {sellCategory && CATEGORIES.find((c) => c.id === sellCategory)?.subcats && (
                  <>
                    <label className="block text-xs font-semibold mb-2 opacity-80">{t.chooseType}</label>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {CATEGORIES.find((c) => c.id === sellCategory).subcats.map((sc) => {
                        const sel = sellSubcat === sc.id;
                        return (
                          <button
                            key={sc.id}
                            onClick={() => setSellSubcat(sc.id)}
                            className="press text-[11px] px-3 py-1.5 rounded-full font-semibold transition-transform"
                            style={{ background: sel ? GOLD : "rgba(243,239,230,0.06)", color: sel ? BLACK : CREAM, border: `1px solid ${sel ? GOLD : "rgba(243,239,230,0.15)"}` }}
                          >
                            {nameOf(sc)}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}

                <Field label={t.fieldPrice} type="number" value={sellPrice} onChange={(e) => setSellPrice(e.target.value)} placeholder="0" />

                <label className="block text-xs font-semibold mb-2 mt-4 opacity-80">{t.fieldCity}</label>
                <CityChips lang={lang} t={t} selectedCity={sellCity} onSelect={handleSellCitySelect} onOpenDistricts={(cityId) => openDistrictPicker(cityId, "sell")} />
                {sellCity && (
                  <p className="text-[11px] opacity-60 mb-2">
                    {nameOf(CITIES.find((c) => c.id === sellCity) || {})}
                    {sellDistrict && DISTRICTS_BY_CITY[sellCity] ? ` — ${nameOf(DISTRICTS_BY_CITY[sellCity].find((d) => d.id === sellDistrict) || {})}` : ""}
                  </p>
                )}

                <label className="block text-xs font-semibold mb-2 mt-4 opacity-80">{t.fieldDesc}</label>
                <textarea rows={4} value={sellDescription} onChange={(e) => setSellDescription(e.target.value)} placeholder={lang === "ar" ? "اكتب تفاصيل الإعلان..." : "Write listing details..."} className="w-full rounded-2xl px-4 py-3 text-sm outline-none" style={{ background: "rgba(243,239,230,0.06)", border: "1px solid rgba(243,239,230,0.15)", color: CREAM }} />

                <div className="flex items-center justify-between mt-4 p-3 rounded-2xl" style={{ background: "rgba(243,239,230,0.05)", border: "1px solid rgba(243,239,230,0.1)" }}>
                  <div className="flex items-center gap-2">
                    <Truck size={16} color={GOLD} />
                    <div>
                      <div className="text-xs font-semibold">{t.offerIntlShipping}</div>
                      <div className="text-[10px] opacity-50">{t.offerIntlShippingHint}</div>
                    </div>
                  </div>
                  <button onClick={() => setSellInternational((v) => !v)} className="press w-10 h-6 rounded-full relative shrink-0 transition-transform" style={{ background: sellInternational ? GOLD : "rgba(243,239,230,0.15)" }}>
                    <span className="absolute top-0.5 w-5 h-5 rounded-full transition-all" style={{ background: BLACK, [dir === "rtl" ? "right" : "left"]: sellInternational ? "2px" : "18px" }} />
                  </button>
                </div>

                <button
                  onClick={publishListing}
                  disabled={!sellCategory || !sellTitle.trim() || !sellPrice}
                  className="press w-full mt-6 py-3.5 rounded-2xl font-bold text-sm transition-transform disabled:opacity-40"
                  style={{ background: `linear-gradient(120deg, ${GOLD_LIGHT}, ${GOLD})`, color: BLACK }}
                >
                  {t.publish}
                </button>
                {(!sellCategory || !sellTitle.trim() || !sellPrice) && (
                  <p className="text-[11px] opacity-50 text-center mt-2">
                    {!sellCategory ? t.pickCategoryFirst : t.fillRequiredFields}
                  </p>
                )}
              </>
            )}
          </div>
        )}

        {/* ---------------- CHAT ---------------- */}
        {view === "chat" && (
          <div className="px-5 pt-6 pb-28">
            <h2 className="display-font font-bold text-xl mb-5">{t.nav.chat}</h2>
            <div className="flex flex-col gap-2">
              {MOCK_THREADS.map((th) => (
                <div key={th.id} className="press flex items-center gap-3 p-3 rounded-2xl transition-transform" style={{ background: "rgba(243,239,230,0.05)" }}>
                  <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold shrink-0" style={{ background: GOLD, color: BLACK }}>{th.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold truncate">{lang === "ar" ? th.name_ar : th.name_en}</span>
                      <span className="text-[10px] opacity-50 shrink-0">{th.time}</span>
                    </div>
                    <p className="text-xs opacity-60 truncate">{lang === "ar" ? th.msg_ar : th.msg_en}</p>
                  </div>
                  {th.unread && <span className="w-2 h-2 rounded-full shrink-0" style={{ background: GOLD }} />}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------- PROFILE ---------------- */}
        {view === "profile" && (
          <div className="px-5 pt-6 pb-28">
            <h2 className="display-font font-bold text-xl mb-5">{t.nav.profile}</h2>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg shrink-0" style={{ background: GOLD, color: BLACK }}>{lang === "ar" ? "ز" : "G"}</div>
              <div>
                <div className="font-semibold text-sm">{t.guest}</div>
                <div className="text-xs opacity-60">{t.memberSince}</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-5">
              {[{ label: t.myListings, value: String(userListings.length) }, { label: t.myRating, value: "4.8" }, { label: t.favorites, value: String(favorites.size) }].map((s, i) => (
                <div key={i} className="rounded-2xl py-3 text-center" style={{ background: "rgba(243,239,230,0.05)", border: "1px solid rgba(243,239,230,0.1)" }}>
                  <div className="font-bold text-base display-font" style={{ color: GOLD }}>{s.value}</div>
                  <div className="text-[10px] opacity-60 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl p-4 mb-5" style={{ background: `linear-gradient(120deg, ${GOLD_DEEP}, ${TEAL_ACCENT})`, color: BLACK }}>
              <div className="flex items-center gap-2 mb-1 opacity-80"><Wallet size={15} /><span className="text-xs font-semibold">{t.piBalance}</span></div>
              <div className="text-2xl font-extrabold display-font mb-3">128.4 π</div>
              <button className="press text-xs font-bold px-3 py-2 rounded-full transition-transform" style={{ background: BLACK, color: TEAL_ACCENT }}>{t.boostWithPi}</button>
            </div>

            <div className="flex flex-col mb-5">
              <button onClick={() => setView("favorites")} className="press flex items-center justify-between py-3.5 transition-transform" style={{ borderBottom: "1px solid rgba(243,239,230,0.1)" }}>
                <span className="flex items-center gap-2.5 text-sm"><Heart size={16} color={GOLD} /> {t.favorites}</span>
                <BackChevron size={15} style={{ transform: dir === "rtl" ? "none" : "scaleX(-1)" }} className="opacity-40" />
              </button>
              <button onClick={() => setView("myListings")} className="press flex items-center justify-between py-3.5 transition-transform" style={{ borderBottom: "1px solid rgba(243,239,230,0.1)" }}>
                <span className="flex items-center gap-2.5 text-sm"><Grid3x3 size={16} color={GOLD} /> {t.myListings} ({userListings.length})</span>
                <BackChevron size={15} style={{ transform: dir === "rtl" ? "none" : "scaleX(-1)" }} className="opacity-40" />
              </button>
              <div className="flex items-center justify-between py-3.5 opacity-60" style={{ borderBottom: "1px solid rgba(243,239,230,0.1)" }}>
                <span className="text-sm">{t.savedCarriers}</span>
                <BackChevron size={15} style={{ transform: dir === "rtl" ? "none" : "scaleX(-1)" }} />
              </div>
              <button onClick={() => setView("settings")} className="press flex items-center justify-between py-3.5 transition-transform" style={{ borderBottom: "1px solid rgba(243,239,230,0.1)" }}>
                <span className="flex items-center gap-2.5 text-sm"><SlidersHorizontal size={16} color={GOLD} /> {t.settings}</span>
                <BackChevron size={15} style={{ transform: dir === "rtl" ? "none" : "scaleX(-1)" }} className="opacity-40" />
              </button>
            </div>

            <h3 className="text-sm font-bold mb-3 flex items-center gap-1.5"><Bell size={14} color={GOLD} /> {t.savedSearches}</h3>
            <div className="flex flex-col gap-2">
              {savedSearches.length === 0 && <p className="text-xs opacity-50">{t.noSavedSearches}</p>}
              {savedSearches.map((s) => (
                <div key={s.id} className="flex items-center justify-between px-3 py-2.5 rounded-xl" style={{ background: "rgba(243,239,230,0.05)", border: "1px solid rgba(243,239,230,0.1)" }}>
                  <span className="text-xs font-medium">{s.label}</span>
                  <button onClick={() => setSavedSearches((prev) => prev.map((x) => x.id === s.id ? { ...x, active: !x.active } : x))} className="press w-8 h-5 rounded-full relative transition-transform" style={{ background: s.active ? GOLD : "rgba(243,239,230,0.15)" }}>
                    <span className="absolute top-0.5 w-4 h-4 rounded-full transition-all" style={{ background: BLACK, [dir === "rtl" ? "right" : "left"]: s.active ? "2px" : "12px" }} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------- SETTINGS ---------------- */}
        {view === "settings" && (
          <div className="px-5 pt-6 pb-28">
            <button onClick={() => setView("profile")} className="flex items-center gap-1 text-sm mb-4 opacity-80"><BackChevron size={16} /> {t.back}</button>
            <h2 className="display-font font-bold text-xl mb-5">{t.settings}</h2>

            <h3 className="text-xs font-bold mb-3 opacity-60 uppercase tracking-wide">{t.settingsAppSection}</h3>
            <div className="flex flex-col gap-2 mb-6">
              <div className="flex items-center justify-between p-3 rounded-2xl" style={{ background: "rgba(243,239,230,0.05)", border: "1px solid rgba(243,239,230,0.1)" }}>
                <span className="flex items-center gap-2.5 text-sm"><Languages size={16} color={GOLD} /> {t.languageLabel}</span>
                <button onClick={() => setLang(lang === "ar" ? "en" : "ar")} className="press px-3 py-1.5 rounded-full text-xs font-bold transition-transform" style={{ background: GOLD, color: BLACK }}>
                  {lang === "ar" ? "العربية" : "English"}
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl" style={{ background: "rgba(243,239,230,0.05)", border: "1px solid rgba(243,239,230,0.1)" }}>
                <div className="flex items-center gap-2.5 pr-2">
                  <Bell size={16} color={GOLD} />
                  <div>
                    <div className="text-sm">{t.notificationsLabel}</div>
                    <div className="text-[10px] opacity-50">{t.notificationsHint}</div>
                  </div>
                </div>
                <button onClick={() => setNotificationsEnabled((v) => !v)} className="press w-10 h-6 rounded-full relative shrink-0 transition-transform" style={{ background: notificationsEnabled ? GOLD : "rgba(243,239,230,0.15)" }}>
                  <span className="absolute top-0.5 w-5 h-5 rounded-full transition-all" style={{ background: BLACK, [dir === "rtl" ? "right" : "left"]: notificationsEnabled ? "2px" : "18px" }} />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl" style={{ background: "rgba(243,239,230,0.05)", border: "1px solid rgba(243,239,230,0.1)" }}>
                <div className="flex items-center gap-2.5 pr-2">
                  <Wallet size={16} color={GOLD} />
                  <div>
                    <div className="text-sm">{t.piEquivalentLabel}</div>
                    <div className="text-[10px] opacity-50">{t.piEquivalentHint}</div>
                  </div>
                </div>
                <button onClick={() => setShowLYD((v) => !v)} className="press w-10 h-6 rounded-full relative shrink-0 transition-transform" style={{ background: showLYD ? GOLD : "rgba(243,239,230,0.15)" }}>
                  <span className="absolute top-0.5 w-5 h-5 rounded-full transition-all" style={{ background: BLACK, [dir === "rtl" ? "right" : "left"]: showLYD ? "2px" : "18px" }} />
                </button>
              </div>
            </div>

            <h3 className="text-xs font-bold mb-3 opacity-60 uppercase tracking-wide">{t.settingsDataSection}</h3>
            <div className="mb-6">
              {resetDone ? (
                <p className="text-xs p-3 rounded-2xl" style={{ background: `${GOLD}18`, color: GOLD }}>{t.resetDataDone}</p>
              ) : !showResetConfirm ? (
                <button onClick={() => setShowResetConfirm(true)} className="press w-full flex items-center justify-between p-3 rounded-2xl transition-transform" style={{ background: "rgba(243,239,230,0.05)", border: "1px solid rgba(243,239,230,0.1)" }}>
                  <div className="text-start">
                    <div className="text-sm">{t.resetDataLabel}</div>
                    <div className="text-[10px] opacity-50">{t.resetDataHint}</div>
                  </div>
                  <BackChevron size={15} style={{ transform: dir === "rtl" ? "none" : "scaleX(-1)" }} className="opacity-40 shrink-0" />
                </button>
              ) : (
                <div className="p-3 rounded-2xl" style={{ background: "rgba(243,239,230,0.05)", border: "1px solid rgba(243,239,230,0.1)" }}>
                  <p className="text-xs mb-3 opacity-80">{t.resetDataConfirm}</p>
                  <div className="flex gap-2">
                    <button onClick={() => setShowResetConfirm(false)} className="press flex-1 py-2 rounded-xl text-xs font-semibold transition-transform" style={{ background: "rgba(243,239,230,0.08)", color: CREAM }}>{t.cancel}</button>
                    <button onClick={() => { resetAppData(); setShowResetConfirm(false); setResetDone(true); }} className="press flex-1 py-2 rounded-xl text-xs font-bold transition-transform" style={{ background: GOLD, color: BLACK }}>{t.resetDataConfirmYes}</button>
                  </div>
                </div>
              )}
            </div>

            <h3 className="text-xs font-bold mb-3 opacity-60 uppercase tracking-wide">Pi Network</h3>
            <div className="mb-6 p-3 rounded-2xl" style={{ background: "rgba(243,239,230,0.05)", border: "1px solid rgba(243,239,230,0.1)" }}>
              <div className="text-sm mb-1">دفعة Pi تجريبية (Test-Pi)</div>
              <div className="text-[10px] opacity-50 mb-3">لازم تفتح هذا الرابط من داخل Pi Browser عشان يشتغل. تُستخدم للتحقق من خطوة "Process a Transaction" في بوابة المطورين.</div>
              <button onClick={() => runTestPiPayment(setPiPaymentStatus)} className="press w-full py-2.5 rounded-xl text-sm font-bold transition-transform" style={{ background: GOLD, color: BLACK }}>
                ابدأ دفعة تجريبية بقيمة 1 π
              </button>
              {piPaymentStatus && <p className="text-xs mt-3 opacity-80">{piPaymentStatus}</p>}
            </div>

            <h3 className="text-xs font-bold mb-3 opacity-60 uppercase tracking-wide">{t.settingsAboutSection}</h3>
            <div className="flex flex-col">
              <div className="flex items-center justify-between py-3" style={{ borderBottom: "1px solid rgba(243,239,230,0.1)" }}>
                <span className="text-sm opacity-70">{t.appVersion}</span>
                <span className="text-sm opacity-50">1.0.0</span>
              </div>
              <div className="flex items-center justify-between py-3 opacity-60" style={{ borderBottom: "1px solid rgba(243,239,230,0.1)" }}>
                <span className="text-sm">{t.privacyPolicy}</span>
                <BackChevron size={15} style={{ transform: dir === "rtl" ? "none" : "scaleX(-1)" }} />
              </div>
              <div className="flex items-center justify-between py-3 opacity-60">
                <span className="text-sm">{t.termsOfService}</span>
                <BackChevron size={15} style={{ transform: dir === "rtl" ? "none" : "scaleX(-1)" }} />
              </div>
            </div>
          </div>
        )}

        {/* ---------------- DISTRICT PICKER MODAL ---------------- */}
        {showDistrictPicker && districtPickerCity && DISTRICTS_BY_CITY[districtPickerCity] && (
          <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: "rgba(0,0,0,0.6)" }} onClick={() => setShowDistrictPicker(false)}>
            <div className="w-full max-w-[430px] rounded-t-3xl p-5 flex flex-col" style={{ background: PANEL, maxHeight: "80vh" }} onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4 shrink-0">
                <h3 className="font-bold display-font text-base">{t.chooseDistrict} — {nameOf(CITIES.find((c) => c.id === districtPickerCity) || {})}</h3>
                <button onClick={() => setShowDistrictPicker(false)} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(243,239,230,0.08)" }}><X size={16} /></button>
              </div>
              <div className="flex flex-col gap-2" style={{ overflowY: "auto" }}>
                <button onClick={() => { (districtPickerTarget === "sell" ? setSellDistrict : setSelectedDistrict)(null); setShowDistrictPicker(false); }} className="press flex items-center justify-between px-4 py-3 rounded-2xl transition-transform" style={{ background: !(districtPickerTarget === "sell" ? sellDistrict : selectedDistrict) ? `${GOLD}20` : "rgba(243,239,230,0.04)", border: `1px solid ${!(districtPickerTarget === "sell" ? sellDistrict : selectedDistrict) ? GOLD : "rgba(243,239,230,0.12)"}` }}>
                  <span className="text-sm font-medium">{t.allDistricts}</span>
                  {!(districtPickerTarget === "sell" ? sellDistrict : selectedDistrict) && <Check size={16} color={GOLD} />}
                </button>
                {DISTRICTS_BY_CITY[districtPickerCity].map((d) => {
                  const sel = (districtPickerTarget === "sell" ? sellDistrict : selectedDistrict) === d.id;
                  return (
                    <button key={d.id} onClick={() => { (districtPickerTarget === "sell" ? setSellDistrict : setSelectedDistrict)(d.id); setShowDistrictPicker(false); }} className="press flex items-center justify-between px-4 py-3 rounded-2xl transition-transform" style={{ background: sel ? `${GOLD}20` : "rgba(243,239,230,0.04)", border: `1px solid ${sel ? GOLD : "rgba(243,239,230,0.12)"}` }}>
                      <span className="text-sm font-medium">{nameOf(d)}</span>
                      {sel && <Check size={16} color={GOLD} />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ---------------- FILTERS MODAL (price + category-specific) ---------------- */}
        {showCatFilters && (
          <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: "rgba(0,0,0,0.6)" }} onClick={() => setShowCatFilters(false)}>
            <div className="w-full max-w-[430px] rounded-t-3xl p-5 flex flex-col" style={{ background: PANEL, maxHeight: "85vh" }} onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4 shrink-0">
                <h3 className="font-bold display-font text-base">{t.filters}{activeSubcat && activeCatObj ? ` — ${nameOf(activeCatObj.subcats.find((s) => s.id === activeSubcat) || {})}` : activeCatObj ? ` — ${nameOf(activeCatObj)}` : ""}</h3>
                <button onClick={() => setShowCatFilters(false)} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(243,239,230,0.08)" }}><X size={16} /></button>
              </div>
              <div className="flex flex-col gap-5" style={{ overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
                <div>
                  <label className="block text-xs font-semibold mb-2 opacity-80">{t.priceRange}</label>
                  <div className="flex items-center gap-2">
                    <input type="number" value={priceFrom} onChange={(e) => setPriceFrom(e.target.value)} placeholder={t.minPrice} className="flex-1 rounded-xl px-3 py-2.5 text-sm outline-none" style={{ background: "rgba(243,239,230,0.06)", border: "1px solid rgba(243,239,230,0.15)", color: CREAM }} />
                    <span className="opacity-40 text-xs">—</span>
                    <input type="number" value={priceTo} onChange={(e) => setPriceTo(e.target.value)} placeholder={t.maxPrice} className="flex-1 rounded-xl px-3 py-2.5 text-sm outline-none" style={{ background: "rgba(243,239,230,0.06)", border: "1px solid rgba(243,239,230,0.15)", color: CREAM }} />
                  </div>
                </div>

                {activeSchema && activeSchema.map((f) => (
                  <div key={f.id}>
                    <label className="block text-xs font-semibold mb-2 opacity-80">{nameOf(f.label)}</label>
                    {f.type === "select" && (
                      <div className="flex flex-wrap gap-2">
                        <button onClick={() => setCatFilter(f.id, "")} className="press px-3 py-1.5 rounded-full text-xs font-medium transition-transform" style={{ background: !catFilters[f.id] ? GOLD : "rgba(243,239,230,0.06)", color: !catFilters[f.id] ? BLACK : CREAM, border: `1px solid ${!catFilters[f.id] ? GOLD : "rgba(243,239,230,0.15)"}` }}>
                          {t.allCities}
                        </button>
                        {f.options.map((o) => {
                          const sel = catFilters[f.id] === o.id;
                          return (
                            <button key={o.id} onClick={() => setCatFilter(f.id, o.id)} className="press px-3 py-1.5 rounded-full text-xs font-medium transition-transform" style={{ background: sel ? GOLD : "rgba(243,239,230,0.06)", color: sel ? BLACK : CREAM, border: `1px solid ${sel ? GOLD : "rgba(243,239,230,0.15)"}` }}>
                              {nameOf(o)}
                            </button>
                          );
                        })}
                      </div>
                    )}
                    {f.type === "text" && f.id === "model" && catFilters.brand && MODEL_MAPS[activeSubcat] && MODEL_MAPS[activeSubcat][catFilters.brand] ? (
                      <div className="flex flex-wrap gap-2">
                        <button onClick={() => setCatFilter("model", "")} className="press px-3 py-1.5 rounded-full text-xs font-medium transition-transform" style={{ background: !catFilters.model ? GOLD : "rgba(243,239,230,0.06)", color: !catFilters.model ? BLACK : CREAM, border: `1px solid ${!catFilters.model ? GOLD : "rgba(243,239,230,0.15)"}` }}>
                          {t.allCities}
                        </button>
                        {MODEL_MAPS[activeSubcat][catFilters.brand].map((m) => {
                          const sel = catFilters.model === m;
                          return (
                            <button key={m} onClick={() => setCatFilter("model", m)} className="press px-3 py-1.5 rounded-full text-xs font-medium transition-transform" style={{ background: sel ? GOLD : "rgba(243,239,230,0.06)", color: sel ? BLACK : CREAM, border: `1px solid ${sel ? GOLD : "rgba(243,239,230,0.15)"}` }}>
                              {m}
                            </button>
                          );
                        })}
                      </div>
                    ) : f.type === "text" && f.id === "model" ? (
                      <div>
                        <input value={catFilters[f.id] || ""} onChange={(e) => setCatFilter(f.id, e.target.value)} placeholder={nameOf(f.label)} className="w-full rounded-xl px-4 py-2.5 text-sm outline-none" style={{ background: "rgba(243,239,230,0.06)", border: "1px solid rgba(243,239,230,0.15)", color: CREAM }} />
                        <p className="text-[11px] opacity-50 mt-1.5">{t.pickBrandFirst}</p>
                      </div>
                    ) : f.type === "text" && (
                      <input value={catFilters[f.id] || ""} onChange={(e) => setCatFilter(f.id, e.target.value)} placeholder={nameOf(f.label)} className="w-full rounded-xl px-4 py-2.5 text-sm outline-none" style={{ background: "rgba(243,239,230,0.06)", border: "1px solid rgba(243,239,230,0.15)", color: CREAM }} />
                    )}
                    {f.type === "range" && (
                      <div className="flex items-center gap-2">
                        <input type="number" value={(catFilters[f.id] && catFilters[f.id].from) || ""} onChange={(e) => setCatFilterRange(f.id, "from", e.target.value)} placeholder={`${t.from} (${f.min})`} className="flex-1 rounded-xl px-3 py-2.5 text-sm outline-none" style={{ background: "rgba(243,239,230,0.06)", border: "1px solid rgba(243,239,230,0.15)", color: CREAM }} />
                        <span className="opacity-40 text-xs">—</span>
                        <input type="number" value={(catFilters[f.id] && catFilters[f.id].to) || ""} onChange={(e) => setCatFilterRange(f.id, "to", e.target.value)} placeholder={`${t.to} (${f.max})`} className="flex-1 rounded-xl px-3 py-2.5 text-sm outline-none" style={{ background: "rgba(243,239,230,0.06)", border: "1px solid rgba(243,239,230,0.15)", color: CREAM }} />
                      </div>
                    )}
                  </div>
                ))}
                <div className="h-1" />
              </div>
              <button onClick={saveCurrentSearch} className="press flex items-center justify-center gap-1.5 py-2.5 mt-3 rounded-2xl text-xs font-semibold transition-transform shrink-0" style={{ background: "rgba(243,239,230,0.05)", border: `1px dashed ${GOLD}55`, color: GOLD }}>
                <Bell size={13} /> {t.saveThisSearch}
              </button>
              <div className="flex gap-2 mt-2 shrink-0">
                <button onClick={() => { setCatFilters({}); setPriceFrom(""); setPriceTo(""); }} className="press flex-1 py-3 rounded-2xl font-bold text-sm transition-transform" style={{ background: "rgba(243,239,230,0.08)", color: CREAM }}>{t.clearAll}</button>
                <button onClick={() => setShowCatFilters(false)} className="press flex-1 py-3 rounded-2xl font-bold text-sm transition-transform" style={{ background: GOLD, color: BLACK }}>{t.applyFilters}</button>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- SHIPPING MODAL ---------------- */}
        {showShipping && (
          <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: "rgba(0,0,0,0.6)" }} onClick={() => setShowShipping(false)}>
            <div className="w-full max-w-[430px] rounded-t-3xl p-5" style={{ background: PANEL }} onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold display-font text-base">{t.chooseCarrier}</h3>
                <button onClick={() => setShowShipping(false)} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(243,239,230,0.08)" }}><X size={16} /></button>
              </div>
              <div className="flex flex-col gap-2 mb-4 max-h-72 overflow-y-auto">
                {SHIPPING_CARRIERS.map((c) => {
                  const selected = selectedCarrier === c.id;
                  return (
                    <button key={c.id} onClick={() => setSelectedCarrier(c.id)} className="press flex items-center justify-between px-4 py-3 rounded-2xl transition-transform" style={{ background: selected ? `${GOLD}20` : "rgba(243,239,230,0.04)", border: `1px solid ${selected ? GOLD : "rgba(243,239,230,0.12)"}` }}>
                      <span className="text-sm font-medium">{nameOf(c)}</span>
                      {selected && <Check size={16} color={GOLD} />}
                    </button>
                  );
                })}
              </div>
              <button onClick={() => setShowShipping(false)} disabled={!selectedCarrier} className="press w-full py-3 rounded-2xl font-bold text-sm transition-transform disabled:opacity-40" style={{ background: GOLD, color: BLACK }}>{t.confirmCarrier}</button>
            </div>
          </div>
        )}

        {/* ---------------- COMPARE FLOATING BAR ---------------- */}
        {compareIds.length > 0 && view !== "compare" && (
          <div className="fixed bottom-[68px] w-full max-w-[430px] px-5 z-40">
            <div className="press flex items-center justify-between gap-2 py-2.5 px-4 rounded-2xl transition-transform" style={{ background: PANEL, border: `1px solid ${GOLD}55`, boxShadow: "0 4px 20px rgba(0,0,0,0.4)" }}>
              <div className="flex items-center gap-2">
                <Scale size={15} color={GOLD} />
                <span className="text-xs font-semibold">{t.compareBar} ({compareIds.length}/2)</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setCompareIds([])} className="text-[11px] opacity-60">{t.clearCompare}</button>
                <button onClick={() => setView("compare")} disabled={compareIds.length < 2} className="press px-3 py-1.5 rounded-full text-xs font-bold transition-transform disabled:opacity-40" style={{ background: GOLD, color: BLACK }}>{t.compareNow}</button>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- BOTTOM NAV ---------------- */}
        <div className="fixed bottom-0 w-full max-w-[430px] px-5 pt-2 pb-3 flex items-center justify-between z-50" style={{ background: "#0A0A0A", borderTop: "1px solid rgba(243,239,230,0.08)" }}>
          <NavBtn icon={HomeIcon} label={t.nav.home} active={view === "home"} onClick={() => { setView("home"); setActiveCat(null); setActiveSubcat(null); setSearchQuery(""); }} />
          <NavBtn icon={Grid3x3} label={t.nav.categories} active={navCategoriesActive} onClick={() => { setActiveCat(null); setActiveSubcat(null); setView("allCategories"); }} />
          <button onClick={() => { resetSellForm(); setView("sell"); }} className="press w-12 h-12 -mt-6 rounded-full flex items-center justify-center shadow-lg shrink-0 transition-transform" style={{ background: `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD})` }}>
            <Plus size={22} color={BLACK} strokeWidth={2.5} />
          </button>
          <NavBtn icon={MessageCircle} label={t.nav.chat} active={view === "chat"} onClick={() => setView("chat")} />
          <NavBtn icon={User} label={t.nav.profile} active={navProfileActive} onClick={() => setView("profile")} />
        </div>
      </div>
    </div>
  );
}

/* ---------------- Reusable components ---------------- */

function SpecChip({ label }) {
  return (
    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ background: "rgba(243,239,230,0.06)", border: "1px solid rgba(243,239,230,0.15)" }}>
      {label}
    </span>
  );
}

function ProductCard({ p, lang, t, dir, cityLabel, isFav, onFav, onOpen, isComparing, onCompare, showLYD }) {
  const title = lang === "ar" ? p.ar : p.en;
  const isImported = p.country_ar !== "ليبيا";
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(243,239,230,0.05)", border: "1px solid rgba(243,239,230,0.08)" }}>
      <div role="button" tabIndex={0} onClick={onOpen} onKeyDown={(e) => { if (e.key === "Enter") onOpen(); }} className="w-full text-left rtl:text-right cursor-pointer">
        <div className="relative h-28" style={{ background: `linear-gradient(135deg, ${p.grad[0]}, ${p.grad[1]})` }}>
          <TilePattern opacity={0.1} />
          <div className="absolute top-2 rtl:right-2 ltr:left-2 flex flex-col gap-1 items-start">
            {p.verified && (
              <span className="flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: "rgba(20,20,20,0.7)", color: TEAL_ACCENT }}>
                <ShieldCheck size={9} /> {t.verified}
              </span>
            )}
            {(isImported || p.internationalShipping) && (
              <span className="flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: "rgba(20,20,20,0.7)", color: GOLD_LIGHT }}>
                <Truck size={9} /> {lang === "ar" ? "دولي" : "Int'l"}
              </span>
            )}
          </div>
          <button onClick={(e) => { e.stopPropagation(); onFav(); }} className="absolute top-2 rtl:left-2 ltr:right-2 w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "rgba(20,20,20,0.55)" }}>
            <Heart size={12} color={CREAM} fill={isFav ? CREAM : "none"} />
          </button>
        </div>
        <div className="p-2.5">
          <p className="text-[12.5px] font-medium leading-snug mb-1.5 line-clamp-2" style={{ minHeight: "2.4em" }}>{title}</p>
          <PriceTag value={p.price} ld={t.ld} dir={dir} showLYD={showLYD} />
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-1 text-[10px] opacity-55">
              <MapPin size={10} /> {cityLabel}
            </div>
            {onCompare && (
              <button onClick={(e) => { e.stopPropagation(); onCompare(); }} className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-semibold transition-transform" style={{ background: isComparing ? `${GOLD}25` : "transparent", border: `1px solid ${isComparing ? GOLD : "rgba(243,239,230,0.2)"}`, color: isComparing ? GOLD : "rgba(243,239,230,0.5)" }}>
                <Scale size={9} /> {t.compare}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function NavBtn({ icon: Icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1 px-1">
      <Icon size={20} color={active ? GOLD : CREAM} strokeWidth={active ? 2.3 : 1.7} style={{ opacity: active ? 1 : 0.55 }} />
      <span className="text-[9.5px]" style={{ color: active ? GOLD : CREAM, opacity: active ? 1 : 0.5 }}>{label}</span>
    </button>
  );
}

function Field({ label, placeholder, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-2 opacity-80">{label}</label>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} className="w-full rounded-2xl px-4 py-3 text-sm outline-none mb-1" style={{ background: "rgba(243,239,230,0.06)", border: "1px solid rgba(243,239,230,0.15)", color: CREAM }} />
    </div>
  );
}
