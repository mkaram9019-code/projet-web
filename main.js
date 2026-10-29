/**
 * ==========================================================================
 * Dar Of Luggage – main.js (JavaScript Pur ES6+, Zéro Framework)
 * Fichier unique et modulaire pour index.html, search.html et login.html.
 * Tous les choix et algorithmes sont commentés en français simple pour
 * permettre à l'étudiant d'expliquer son code à son professeur.
 * ==========================================================================
 */

/* ==========================================================================
   0. SYSTÈME I18N (FR / AR / EN) & FILET DE SÉCURITÉ MYMEMORY API
   ========================================================================== */

const DEFAULT_LANGUAGE = 'fr';

/**
 * Formate un montant dans la devise marocaine (MAD / DH) selon la langue active.
 * Ex: "70,00 MAD" en français ou "٧٠٫٠٠ د.م." en arabe via l'API standard Intl.
 */
function formatPrice(amount, lang = currentLanguage) {
  const localeMap = {
    fr: 'fr-MA',
    ar: 'ar-MA',
    en: 'en-MA'
  };
  const locale = localeMap[lang] || 'fr-MA';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'MAD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

/**
 * Dictionnaire complet des traductions statiques pour toutes les pages.
 * Règles : FR (source), AR (arabe fluide et naturel), EN (anglais standard).
 */
const TRANSLATIONS = {
  // Navigation & Identité
  "brand_title": {
    "fr": "Dar of luggage",
    "ar": "دار الأمتعة",
    "en": "Dar of luggage"
  },
  "brand_subtitle": {
    "fr": "Réseau de consigne sécurisé",
    "ar": "شبكة حفظ الأمتعة الآمنة",
    "en": "Secure Baggage Network"
  },
  "nav_home": {
    "fr": "Accueil",
    "ar": "الرئيسية",
    "en": "Home"
  },
  "nav_how_it_works": {
    "fr": "Comment ça marche",
    "ar": "كيف يعمل",
    "en": "How It Works"
  },
  "nav_destinations": {
    "fr": "Destinations",
    "ar": "الوجهات",
    "en": "Destinations"
  },
  "nav_find_storage": {
    "fr": "Trouver une consigne",
    "ar": "ابحث عن مكان للتخزين",
    "en": "Find Storage"
  },
  "nav_guarantee": {
    "fr": "Garantie 100 000 DH",
    "ar": "ضمان 100,000 د.م.",
    "en": "100,000 MAD Guarantee"
  },
  "nav_reviews": {
    "fr": "Avis clients",
    "ar": "آراء العملاء",
    "en": "Reviews"
  },
  "nav_faq": {
    "fr": "Aide & FAQ",
    "ar": "المساعدة والأسئلة",
    "en": "Help & FAQ"
  },
  "nav_sign_in": {
    "fr": "Connexion",
    "ar": "تسجيل الدخول",
    "en": "Sign In"
  },
  "nav_back_home": {
    "fr": "← Retour à l'accueil",
    "ar": "← العودة إلى الرئيسية",
    "en": "← Back to Home"
  },

  // Hero Section (Accueil)
  "hero_badge": {
    "fr": "★ 4.9 • Plus de 3 000 000 de bagages stockés (fictif)",
    "ar": "★ 4.9 • أكثر من 3,000,000 حقيبة تم حفظها (افتراضي)",
    "en": "★ 4.9 • Over 3,000,000 bags stored (demo)"
  },
  "hero_title": {
    "fr": "Consigne à bagages près de vous",
    "ar": "حفظ الأمتعة بأمان بالقرب منك",
    "en": "Luggage storage near you"
  },
  "hero_subtitle_prefix": {
    "fr": "Dès ",
    "ar": "ابتداءً من ",
    "en": "From "
  },
  "hero_subtitle_suffix": {
    "fr": " • Assuré jusqu'à 100 000 DH",
    "ar": " • مؤمّن حتى 100,000 د.م.",
    "en": " • Insured up to 100,000 MAD"
  },
  "field_where": {
    "fr": "OÙ ?",
    "ar": "أين؟",
    "en": "WHERE?"
  },
  "field_dates": {
    "fr": "DATES",
    "ar": "التواريخ",
    "en": "DATES"
  },
  "field_luggage": {
    "fr": "BAGAGES",
    "ar": "الأمتعة",
    "en": "LUGGAGE"
  },
  "hero_search_btn": {
    "fr": "Rechercher une consigne",
    "ar": "ابحث عن موقع لحفظ الأمتعة",
    "en": "Search Luggage Storage"
  },
  "trust_cancellation": {
    "fr": "✓ Annulation gratuite",
    "ar": "✓ إلغاء مجاني",
    "en": "✓ Free cancellation"
  },
  "trust_guarantee": {
    "fr": "✓ Garantie 100 000 DH",
    "ar": "✓ ضمان 100,000 د.م.",
    "en": "✓ 100,000 MAD Guarantee"
  },
  "trust_instant_pass": {
    "fr": "✓ Pass numérique instantané",
    "ar": "✓ بطاقة رقمية فورية",
    "en": "✓ Instant Digital Pass"
  },

  // Étapes
  "how_tag": {
    "fr": "Simple & Transparent",
    "ar": "بسيط وسلس",
    "en": "Simple & Seamless"
  },
  "how_title": {
    "fr": "3 étapes simples pour déposer vos bagages",
    "ar": "3 خطوات سهلة لحفظ أمتعتك بأمان",
    "en": "3 Easy steps to book luggage storage near you"
  },
  "how_desc": {
    "fr": "Pas de files d'attente, pas de monnaie, ni restriction de casier. Déposez vos sacs en quelques secondes et profitez de votre séjour les mains libres.",
    "ar": "بدون طوابير، بدون عملات نقدية، وبدون قيود خزائن. اترك حقائبك في ثوانٍ واستمتع بوقتك دون أي عبء.",
    "en": "No lines, no coins, and no locker dimension restrictions. Drop off your bags in seconds and enjoy your city hands-free."
  },
  "step1_title": {
    "fr": "Réservez en ligne en quelques secondes",
    "ar": "احجز عبر الإنترنت في ثوانٍ",
    "en": "Book online in seconds"
  },
  "step1_text": {
    "fr": "Choisissez votre ville ou point de repère, dates et nombre de bagages. Recevez instantanément votre bon de confirmation numérique.",
    "ar": "حدد مدينتك وتواريخ الإيداع وعدد الحقائب واحصل على قسيمة تأكيد رقمية فورية.",
    "en": "Select your destination city or landmark, dates, and number of bags. Receive your instant digital booking confirmation voucher."
  },
  "step1_preview_tag": {
    "fr": "Confirmation Instantanée",
    "ar": "تأكيد فوري",
    "en": "Instant Pass"
  },
  "step1_preview_title": {
    "fr": "Gare / Médina • Pass QR",
    "ar": "المحطة / المدينة • رمز QR",
    "en": "Station / Medina • QR Pass"
  },
  "step1_preview_sub": {
    "fr": "Scellés de sécurité inclus • 35 DH",
    "ar": "أختام الأمان مشمولة • 35 د.م.",
    "en": "Tamper seals included • 35 MAD"
  },
  "step2_title": {
    "fr": "Déposez vos bagages",
    "ar": "أودع أمتعتك لدى شريكنا",
    "en": "Drop your luggage"
  },
  "step2_text": {
    "fr": "Rendez-vous à l'hôtel ou la boutique partenaire. Présentez votre QR code au comptoir. Notre équipe applique le scellé de sécurité numéroté.",
    "ar": "توجه إلى الفندق أو المتجر الشريك، وأظهر رمز QR عند الاستقبال ليتم وضع ختم الأمان المشفر على حقائبك.",
    "en": "Arrive at the partner hotel or boutique. Show your digital QR confirmation to the front desk. Staff applies our tamper-proof barcode seal."
  },
  "step2_preview_tag": {
    "fr": "Dépôt en 30 secondes",
    "ar": "إيداع خلال 30 ثانية",
    "en": "30-Sec Check-in"
  },
  "step2_preview_title": {
    "fr": "Hôtel Partenaire Vérifié",
    "ar": "فندق شريك معتمد",
    "en": "Verified Partner Hotel"
  },
  "step2_preview_sub": {
    "fr": "Réceptionniste 24/7 • Surveillance continue",
    "ar": "استقبال 24/7 • مراقبة مستمرة",
    "en": "Front desk 24/7 • Supervised storage"
  },
  "step3_title": {
    "fr": "Profitez les mains libres",
    "ar": "استمتع برحلتك بحرية تامة",
    "en": "Enjoy your stay hands-free"
  },
  "step3_text": {
    "fr": "Explorez musées, souks, monuments et cafés sans traîner vos valises. Récupérez vos bagages à tout moment en montrant votre QR code.",
    "ar": "تجوّل في الأسواق والآثار والمعالم بحرية دون حمل الحقائب، واستلمها متى شئت بإبراز رمز QR.",
    "en": "Explore monuments, museums, cafes, and business meetings without lugging bags. Pick up your luggage anytime showing your QR code."
  },
  "step3_preview_tag": {
    "fr": "Liberté Totale",
    "ar": "حرية كاملة",
    "en": "Explore Freedom"
  },
  "step3_preview_title": {
    "fr": "Souks, Cafés & Monuments",
    "ar": "الأسواق والمعالم والمقاهي",
    "en": "Louvre, Cafes & Jemaa el-Fnaa"
  },
  "step3_preview_sub": {
    "fr": "Retrait à toute heure • Zéro contrainte",
    "ar": "استلام في أي وقت • بدون أي قلق",
    "en": "Pickup anytime before closing • Zero hassle"
  },

  // Avantages & Sécurité
  "guarantee_tag": {
    "fr": "Sécurité Maximale",
    "ar": "الأمان أولاً",
    "en": "Safety First"
  },
  "guarantee_title": {
    "fr": "Sécurité, garantie & avantages exclusifs",
    "ar": "الأمان، الضمان والمزايا المرنة",
    "en": "Safety, guarantee & flexible benefits"
  },
  "guarantee_desc": {
    "fr": "Basé sur un réseau de partenaires physiques rigoureusement vérifiés et une couverture d'assurance inégalée.",
    "ar": "شبكة شركاء موثوقين ومفحوصين شخصياً، مع تأمين وحماية شاملة لا تضاهى.",
    "en": "Built on vetted partner networks, rigorous security protocols, and unmatched insurance protection."
  },
  "guarantee_box_badge": {
    "fr": "La Garantie Dar",
    "ar": "ضمان الدار",
    "en": "The Dar Guarantee"
  },
  "guarantee_box_title": {
    "fr": "Garantie de protection de 100 000 DH par bagage",
    "ar": "ضمان حماية بقيمة 100,000 د.م. لكل حقيبة",
    "en": "100,000 MAD Bag Protection Guarantee"
  },
  "guarantee_box_text": {
    "fr": "Contrairement aux consignes de gare traditionnelles qui n'offrent aucune responsabilité, chaque réservation sur Dar Of Luggage est couverte par une assurance complète.",
    "ar": "على عكس خزائن محطات القطارات التي لا تقدم أي تعويض في حال التلف، كل حجز عبر منصتنا مشمول بتأمين وحماية كاملة.",
    "en": "Unlike airport or train station lockers that offer zero liability for damages, every single reservation with Dar Of Luggage comes backed by comprehensive insurance."
  },
  "feature_list_1": {
    "fr": "✓ Scellés de sécurité inviolables fournis au dépôt",
    "ar": "✓ أختام أمان رقمية مشفرة مجانية عند الإيداع",
    "en": "✓ Free tamper-evident barcode seals provided on drop-off"
  },
  "feature_list_2": {
    "fr": "✓ 100% de partenaires physiquement vérifiés (Hôtels, Boutiques)",
    "ar": "✓ 100% من الشركاء مفحوصون ومعتمدون شخصياً",
    "en": "✓ 100% physically vetted partners (Hotels, Boutiques, Lounges)"
  },
  "feature_list_3": {
    "fr": "✓ Annulation gratuite à tout moment avant le dépôt",
    "ar": "✓ إلغاء مجاني 100% في أي وقت قبل الإيداع",
    "en": "✓ Free cancellation anytime before scheduled drop-off"
  },
  "stat_rate_label": {
    "fr": "Taux de satisfaction",
    "ar": "نسبة الرضا",
    "en": "Approval Rate"
  },
  "stat_bags_label": {
    "fr": "Bagages protégés",
    "ar": "حقيبة تم تأمينها",
    "en": "Bags Stored Safely"
  },
  "accordion_1_title": {
    "fr": "🛡️ Protection d'assurance de 100 000 DH (fictif)",
    "ar": "🛡️ حماية تأمينية بقيمة 100,000 د.م. (افتراضي)",
    "en": "🛡️ 100,000 MAD Insurance Protection (demo)"
  },
  "accordion_1_body": {
    "fr": "Chaque bagage est couvert dès l'instant du dépôt jusqu'au retrait contre les dommages, la perte ou le vol. Un certificat officiel est automatiquement délivré.",
    "ar": "كل حقيبة مؤمنة من لحظة الإيداع حتى الاستلام ضد التلف أو الفقدان أو السرقة مع شهادة حماية فورية.",
    "en": "Every bag is insured from the exact moment of drop-off until safe pickup against damage, loss, or theft. An official Certificate of Protection is automatically generated on booking."
  },
  "accordion_2_title": {
    "fr": "🔄 Politique d'annulation 100% gratuite",
    "ar": "🔄 سياسة إلغاء مجانية 100%",
    "en": "🔄 100% Free Cancellation Policy"
  },
  "accordion_2_body": {
    "fr": "Vol ou train retardé ? Changement de programme ? Annulez à tout moment avant votre heure de dépôt pour un remboursement intégral immédiat sans pénalités.",
    "ar": "تأخرت رحلتك أو تغيرت خططك؟ ألغِ حجزك في أي وقت قبل الموعد لاسترداد كامل المبلغ فوراً بدون أي رسوم.",
    "en": "Flight or train delayed? Change in plans? Cancel your booking anytime before your scheduled drop-off time for a full 100% immediate refund with zero cancellation penalties."
  },
  "accordion_3_title": {
    "fr": "🔒 Scellés de sécurité à code-barres inviolables",
    "ar": "🔒 أختام أمان مشفرة ومضادة للعبث",
    "en": "🔒 Tamper-Proof Barcode Security Seals"
  },
  "accordion_3_body": {
    "fr": "À votre arrivée, le personnel partenaire pose des scellés numérotés sur les fermetures de chaque bagage en votre présence. Le numéro est enregistré sur votre pass numérique.",
    "ar": "عند الوصول، يضع الشريك أختام أمان رقمية مرقمة على سحابات الحقائب بحضورك، ويتم تسجيل الرقم على بطاقة الحجز الرقمية.",
    "en": "Upon arrival, partner staff attaches serialized security seals to all luggage zippers in your presence. The seal number is logged digitally on your confirmation pass."
  },
  "accordion_4_title": {
    "fr": "🕒 Support voyageur humain dédié 24h/24 et 7j/7",
    "ar": "🕒 دعم ومساعدة فورية على مدار الساعة 24/7",
    "en": "🕒 24/7 Dedicated Human Concierge Support"
  },
  "accordion_4_body": {
    "fr": "Notre équipe multilingue est disponible 24h/24 par messagerie instantanée ou e-mail pour vous guider, contacter le partenaire ou adapter votre réservation.",
    "ar": "فريق الدعم متعدد اللغات متاح طوال اليوم عبر المحادثة المباشرة والبريد الإلكتروني للإجابة على استفساراتك وتوجيهك.",
    "en": "Our multilingual customer support team is available around the clock via live chat or email to assist with directions, location contact, or adjustments."
  },

  // Destinations & Avis
  "loc_section_tag": {
    "fr": "Présence au Maroc & Monde",
    "ar": "حضورنا بالمغرب والعالم",
    "en": "Global & Morocco Hubs"
  },
  "loc_section_title": {
    "fr": "Pôles de consignes au Maroc et dans le monde",
    "ar": "أفضل وجهات حفظ الأمتعة في المغرب والعالم",
    "en": "Luggage Storage Hubs in Morocco & Worldwide"
  },
  "loc_section_desc": {
    "fr": "Déposez vos sacs dans nos centaines d'établissements vérifiés à Marrakech, Casablanca, Rabat, Fès, Essaouira et dans les capitales internationales.",
    "ar": "احفظ أمتعتك في مئات النقاط المعتمدة في مراكش، الدار البيضاء، الرباط، فاس، الصويرة وأشهر العواصم العالمية.",
    "en": "Drop your luggage in verified partner spots across Marrakesh, Casablanca, Rabat, Fes, Essaouira and top international capitals."
  },
  "reviews_tag": {
    "fr": "Témoignages voyageurs",
    "ar": "قصص وتجارب المسافرين",
    "en": "Customer Stories"
  },
  "reviews_title": {
    "fr": "Recommandé par des milliers de voyageurs",
    "ar": "محبوب وموصى به من آلاف المسافرين",
    "en": "Loved by travelers everywhere"
  },
  "reviews_rating_summary": {
    "fr": "Noté 4.9 sur plus de 34 288 avis vérifiés (donnée fictive).",
    "ar": "تقييم 4.9 عبر أكثر من 34,288 تقييم معتمد (بيانات تجريبية).",
    "en": "Rated 4.9 across 34,288+ verified reviews (demo data)."
  },

  // FAQ
  "faq_tag": {
    "fr": "FAQ",
    "ar": "الأسئلة الشائعة",
    "en": "FAQ"
  },
  "faq_title": {
    "fr": "Foire Aux Questions",
    "ar": "الأسئلة الأكثر تداولاً",
    "en": "Frequently Asked Questions"
  },
  "faq_desc": {
    "fr": "Tout ce que vous devez savoir sur la réservation, la sécurité et le dépôt de vos bagages.",
    "ar": "كل ما تحتاج لمعرفته حول الحجز، الأمان، وكيفية إيداع الأمتعة واستلامها.",
    "en": "Everything you need to know about booking, security, and luggage drop-off."
  },
  "faq_q1": {
    "fr": "Qu'est-ce que Dar Of Luggage et comment ça marche ?",
    "ar": "ما هي دار الأمتعة (Dar Of Luggage) وكيف تعمل؟",
    "en": "What is Dar Of Luggage and how does it work?"
  },
  "faq_a1": {
    "fr": "Dar Of Luggage connecte les voyageurs à des centaines d'hôtels, boutiques et partenaires certifiés. Réservez en ligne en quelques secondes, déposez vos valises avec votre QR code et profitez les mains libres.",
    "ar": "دار الأمتعة تربط المسافرين بمئات الفنادق والمتاجر المعتمدة. احجز عبر الموقع في ثوانٍ، وأودع حقائبك برمز QR واستمتع بيومك بحرية تامة.",
    "en": "Dar Of Luggage connects travelers with hundreds of secure local partner hotels, boutiques, and verified luggage hubs worldwide. Book online in seconds, drop off your bags with your digital QR booking confirmation, and explore completely hands-free."
  },
  "faq_q2": {
    "fr": "Combien coûte la consigne de bagages ?",
    "ar": "كم تبلغ تكلفة حفظ الأمتعة؟",
    "en": "How much does luggage storage cost?"
  },
  "faq_a2": {
    "fr": "Le tarif débute à seulement 35 DH par bagage et par jour. Sans frais cachés, sans limite de poids, et inclut automatiquement la garantie de 100 000 DH ainsi que les scellés de sécurité.",
    "ar": "تبدأ الأسعار من 35 د.م. فقط لكل حقيبة في اليوم، بدون رسوم خفية أو قيود على الوزن، مع ضمان تأميني وأختام أمان مجانية.",
    "en": "Storage starts from just 35 MAD per bag per day. No hidden fees, no weight surcharges, and includes security seals and guarantee."
  },
  "faq_q3": {
    "fr": "Mes bagages sont-ils en sécurité et assurés ?",
    "ar": "هل أمتعتي بأمان ومؤمنة بالكامل؟",
    "en": "Are my bags safe and insured?"
  },
  "faq_a3": {
    "fr": "Oui ! Tous les établissements partenaires sont audités, surveillés 24/7 et équipés de scellés inviolables dès la prise en charge.",
    "ar": "نعم! جميع المواقع مفحوصة ومراقبة بالكاميرات مع وضع أختام أمان رقمية فور الإيداع.",
    "en": "Yes! All partner locations are physically inspected and verified, equipped with surveillance and tamper-proof barcode seals."
  },
  "faq_q4": {
    "fr": "Y a-t-il des limites de taille ou de poids ?",
    "ar": "هل توجد قيود على حجم أو وزن الحقائب؟",
    "en": "Are there size or weight limits for bags?"
  },
  "faq_a4": {
    "fr": "Non ! Contrairement aux casiers automatiques de gare limités par leurs dimensions, nous acceptons valises XXL, sacs à dos, poussettes et équipements sportifs au même tarif forfaitaire.",
    "ar": "لا! خلافاً للخزائن التقليدية، نقبل الحقائب الكبيرة، عربات الأطفال، والمعدات الرياضية بنفس السعر الموحد.",
    "en": "No! Unlike traditional lockers, we accommodate backpacks, standard suitcases, strollers, and sports equipment at the exact same flat rate."
  },
  "faq_q5": {
    "fr": "Quelle est la politique d'annulation ?",
    "ar": "ما هي سياسة الإلغاء؟",
    "en": "What is your cancellation policy?"
  },
  "faq_a5": {
    "fr": "Annulation 100% gratuite ! Les imprévus arrivent : vous pouvez annuler votre réservation à tout moment avant l'heure prévue pour un remboursement immédiat.",
    "ar": "إلغاء مجاني 100%! يمكنك إلغاء الحجز في أي وقت قبل موعد الإيداع واسترداد كامل المبلغ مباشرة بدون أي اقتطاع.",
    "en": "100% Free Cancellation! Cancel anytime before your scheduled drop-off time for an instant full refund."
  },

  // Modals & Popovers
  "loc_modal_title": {
    "fr": "Sélectionner un lieu de stockage",
    "ar": "اختر موقع حفظ الأمتعة",
    "en": "Select Storage Location"
  },
  "loc_modal_sub": {
    "fr": "Recherchez ou choisissez une ville pour afficher les consignes partenaires",
    "ar": "ابحث أو اختر مدينة لعرض نقاط حفظ الأمتعة القريبة",
    "en": "Search or pick a city to view nearby luggage drop points"
  },
  "search_popover_title": {
    "fr": "Destinations populaires au Maroc & Monde",
    "ar": "الوجهات الأكثر طلباً في المغرب والعالم",
    "en": "Popular Destinations in Morocco & World"
  },
  "search_my_loc_title": {
    "fr": "Ma position actuelle",
    "ar": "موقعي الحالي",
    "en": "My location"
  },
  "search_my_loc_sub": {
    "fr": "Trouver les consignes autour de moi (GPS)",
    "ar": "استخدم موقعي الحالي عبر الـ GPS",
    "en": "Use my current GPS position"
  },
  "search_input_placeholder": {
    "fr": "Entrez une ville (ex: Marrakech, Rabat, Paris)...",
    "ar": "أدخل اسم المدينة (مثال: مراكش، الرباط، باريس)...",
    "en": "Enter city name (e.g. Marrakesh, Rabat, Paris)..."
  },
  "search_spots_heading": {
    "fr": "Consignes à",
    "ar": "نقاط التخزين في",
    "en": "Storage in"
  },
  "search_spots_default_title": {
    "fr": "Points de consigne",
    "ar": "نقاط حفظ الأمتعة",
    "en": "Storage spots"
  },
  "search_near_me_btn": {
    "fr": "Près de moi",
    "ar": "بالقرب مني",
    "en": "Near me"
  },
  "search_book_btn": {
    "fr": "Réserver",
    "ar": "حجز",
    "en": "Book"
  },
  "spots_count_singular": {
    "fr": "1 consigne",
    "ar": "نقطة تخزين واحدة",
    "en": "1 spot"
  },
  "spots_count_plural": {
    "fr": "{n} consignes",
    "ar": "{n} نقاط تخزين",
    "en": "{n} spots"
  },
  "no_spots_found": {
    "fr": "Aucune consigne disponible pour ces filtres",
    "ar": "لا توجد نقاط تخزين متاحة بهذه المعايير",
    "en": "No spots found for these filters"
  },

  // Modal Réservation
  "modal_title_generic": {
    "fr": "Réserver votre consigne",
    "ar": "حجز موقع حفظ الأمتعة",
    "en": "Reserve Luggage Storage"
  },
  "modal_verified_tag": {
    "fr": "Point de consigne vérifié",
    "ar": "نقطة تخزين معتمدة ومؤمنة",
    "en": "Verified Drop Point"
  },
  "modal_date_label": {
    "fr": "Date de dépôt",
    "ar": "تاريخ الإيداع",
    "en": "Drop-off Date"
  },
  "modal_pickup_label": {
    "fr": "Date de retrait",
    "ar": "تاريخ الاستلام",
    "en": "Pick-up Date"
  },
  "modal_bags_label": {
    "fr": "Nombre de bagages",
    "ar": "عدد الحقائب",
    "en": "Number of Bags"
  },
  "modal_bags_sub": {
    "fr": "Tous formats et poids acceptés sans supplément",
    "ar": "جميع الأحجام والأوزان مقبولة بدون رسوم إضافية",
    "en": "Any size or weight accepted"
  },
  "modal_name_label": {
    "fr": "Nom complet",
    "ar": "الاسم الكامل",
    "en": "Full Name"
  },
  "modal_email_label": {
    "fr": "Adresse e-mail",
    "ar": "البريد الإلكتروني",
    "en": "Email Address"
  },
  "modal_price_storage": {
    "fr": "Consigne bagages",
    "ar": "حفظ الأمتعة",
    "en": "Luggage Storage"
  },
  "modal_price_insurance": {
    "fr": "Garantie de protection 100 000 DH",
    "ar": "ضمان حماية بقيمة 100,000 د.م.",
    "en": "100,000 MAD Protection Guarantee"
  },
  "modal_price_included": {
    "fr": "INCLUS",
    "ar": "مشمول",
    "en": "INCLUDED"
  },
  "modal_price_seals": {
    "fr": "Scellés de sécurité inviolables",
    "ar": "أختام أمان مشفرة ومضادة للعبث",
    "en": "Free Tamper Barcode Seals"
  },
  "modal_price_free": {
    "fr": "GRATUIT",
    "ar": "مجاناً",
    "en": "FREE"
  },
  "modal_price_total": {
    "fr": "Montant total",
    "ar": "المبلغ الإجمالي",
    "en": "Total Amount"
  },
  "modal_submit_btn_text": {
    "fr": "Confirmer & Générer le Pass QR • ",
    "ar": "تأكيد واستخراج بطاقة QR • ",
    "en": "Confirm & Generate QR Pass • "
  },
  "booking_confirmed_title": {
    "fr": "Réservation confirmée !",
    "ar": "تم تأكيد الحجز بنجاح!",
    "en": "Booking Confirmed!"
  },
  "booking_done_btn": {
    "fr": "Terminé & Fermer le pass",
    "ar": "تم وإغلاق البطاقة",
    "en": "Done & Close Pass"
  },
  "booking_pass_ready_prefix": {
    "fr": "votre pass de consigne pour",
    "ar": "بطاقة حفظ الأمتعة الخاصة بك لـ",
    "en": "your luggage pass for"
  },
  "booking_pass_ready_suffix": {
    "fr": "est prêt.",
    "ar": "جاهزة الآن.",
    "en": "is ready."
  },

  // Page de Connexion (A.1)
  "auth_portal_badge": {
    "fr": "Portail Voyageur",
    "ar": "بوابة المسافر",
    "en": "Traveler Portal"
  },
  "auth_welcome": {
    "fr": "Bon retour parmi nous !",
    "ar": "مرحباً بك مجدداً!",
    "en": "Welcome back!"
  },
  "auth_desc": {
    "fr": "Connectez-vous pour gérer vos réservations et afficher vos pass QR.",
    "ar": "سجل دخولك لإدارة حجوزاتك وعرض بطاقات QR.",
    "en": "Log in to manage your bookings and view your QR passes."
  },
  "auth_google": {
    "fr": "Continuer avec Google",
    "ar": "المتابعة باستخدام Google",
    "en": "Continue with Google"
  },
  "auth_apple": {
    "fr": "Continuer avec Apple",
    "ar": "المتابعة باستخدام Apple",
    "en": "Continue with Apple"
  },
  "auth_or_email": {
    "fr": "ou se connecter avec e-mail",
    "ar": "أو تسجيل الدخول بالبريد الإلكتروني",
    "en": "or log in with email"
  },
  "auth_password": {
    "fr": "Mot de passe",
    "ar": "كلمة المرور",
    "en": "Password"
  },
  "auth_submit": {
    "fr": "Se connecter / S'inscrire",
    "ar": "تسجيل الدخول / إنشاء حساب",
    "en": "Sign In / Register"
  },
  "auth_logout": {
    "fr": "Se déconnecter",
    "ar": "تسجيل الخروج",
    "en": "Log out"
  },
  "auth_logged_as": {
    "fr": "Connecté en tant que",
    "ar": "مسجل الدخول باسم",
    "en": "Logged in as"
  },
  "auth_recent_bookings": {
    "fr": "Vos réservations récentes",
    "ar": "حجوزاتك الأخيرة",
    "en": "Your recent bookings"
  },
  "err_name_required": {
    "fr": "Veuillez entrer votre nom complet",
    "ar": "يرجى إدخال اسمك الكامل",
    "en": "Please enter your full name"
  },
  "err_email_invalid": {
    "fr": "Veuillez entrer une adresse e-mail valide.",
    "ar": "يرجى إدخال بريد إلكتروني صحيح.",
    "en": "Please enter a valid email address."
  },
  "err_password_short": {
    "fr": "Le mot de passe doit comporter au moins 6 caractères.",
    "ar": "يجب أن تتكون كلمة المرور من 6 أحرف على الأقل.",
    "en": "Password must be at least 6 characters."
  },

  // Onglets et volet Partenaire Nannybag
  "tab_book": {
    "fr": "Réserver",
    "ar": "حجز",
    "en": "Book"
  },
  "tab_hours": {
    "fr": "Horaires",
    "ar": "أوقات العمل",
    "en": "Hours"
  },
  "tab_reviews": {
    "fr": "Avis",
    "ar": "الآراء",
    "en": "Reviews"
  },
  "tab_how": {
    "fr": "Comment ça marche",
    "ar": "كيف يعمل",
    "en": "How it works"
  },
  "luggage_ordinary_title": {
    "fr": "Ordinaire",
    "ar": "عادي",
    "en": "Standard"
  },
  "luggage_ordinary_desc": {
    "fr": "Valise, sac à dos",
    "ar": "حقيبة سفر، حقيبة ظهر",
    "en": "Suitcase, backpack"
  },
  "luggage_small_title": {
    "fr": "Petit",
    "ar": "صغير",
    "en": "Small"
  },
  "luggage_small_desc": {
    "fr": "Sac à main, tote bag, sac cabas",
    "ar": "حقيبة يد، كيس تسوق",
    "en": "Handbag, tote bag"
  },
  "luggage_oversized_title": {
    "fr": "De taille inhabituelle",
    "ar": "حجم خاص",
    "en": "Oversized"
  },
  "luggage_oversized_desc": {
    "fr": "Vélo, planche de surf, sac de golf",
    "ar": "دراجة، لوح تزلج، حقيبة غولف",
    "en": "Bicycle, surfboard, golf bag"
  },
  "partner_status_open": {
    "fr": "Ouvert · 24h/24, 7j/7",
    "ar": "مفتوح · 24/7",
    "en": "Open · 24/7"
  },
  "drawer_btn_choose_dates": {
    "fr": "Choisir les dates",
    "ar": "اختيار التواريخ",
    "en": "Choose dates"
  },
  "drawer_btn_select_bags": {
    "fr": "Sélectionnez au moins 1 bagage",
    "ar": "يرجى تحديد حقيبة واحدة على الأقل",
    "en": "Select at least 1 bag"
  },
  "drawer_btn_continue": {
    "fr": "Continuer • ",
    "ar": "المتابعة • ",
    "en": "Continue • "
  },
  "drawer_guarantee_text": {
    "fr": "Garantie 100 000 DH & scellés de sécurité inclus sans frais.",
    "ar": "ضمان 100,000 د.م. وأختام أمان مشمولة مجاناً.",
    "en": "100,000 MAD guarantee & security seals included free."
  },

  // Toasts et Messages Dynamiques
  "toast_demo_social": {
    "fr": "Bientôt disponible (démo académique)",
    "ar": "قريباً (نسخة تجريبية)",
    "en": "Coming soon (academic demo)"
  },
  "toast_logged_out": {
    "fr": "Déconnexion réussie",
    "ar": "تم تسجيل الخروج بنجاح",
    "en": "Logged out successfully"
  },
  "toast_logged_in": {
    "fr": "Connexion réussie !",
    "ar": "تم تسجيل الدخول بنجاح!",
    "en": "Logged in successfully!"
  },
  "per_day": {
    "fr": "/jour",
    "ar": "/يوم",
    "en": "/day"
  },
  "per_bag_day": {
    "fr": "/sac/jour",
    "ar": "/حقيبة/يوم",
    "en": "/bag/day"
  },
  "hours_filter_247": {
    "fr": "24/7 Uniquement",
    "ar": "مفتوح 24/7 فقط",
    "en": "24/7 Only"
  },
  "hours_filter_all": {
    "fr": "Tous les horaires",
    "ar": "جميع الأوقات",
    "en": "All hours"
  },
  "sort_rating": {
    "fr": "Mieux notés",
    "ar": "الأعلى تقييماً",
    "en": "Top Rated"
  },
  "sort_price": {
    "fr": "Prix le plus bas",
    "ar": "الأقل سعراً",
    "en": "Lowest Price"
  },
  "sort_default": {
    "fr": "Avis & Prix",
    "ar": "التقييم والسعر",
    "en": "Reviews & Price"
  },

  // Footer
  "footer_text": {
    "fr": "Le premier réseau de consigne à bagages sécurisé au Maroc et dans le monde. Déposez vos sacs dès 35 DH/jour dans des hôtels et boutiques vérifiés.",
    "ar": "الشبكة الرائدة لحفظ الأمتعة بأمان في المغرب والعالم. أودع حقائبك ابتداءً من 35 د.م./اليوم في فنادق ومتاجر معتمدة.",
    "en": "The leading secure luggage storage network in Morocco and worldwide. Store bags safely from 35 MAD per day at vetted partner spots."
  },
  "footer_popular_hubs": {
    "fr": "Villes populaires",
    "ar": "الوجهات الشائعة",
    "en": "Popular Hubs"
  },
  "footer_rights": {
    "fr": "© 2026 Dar Of Luggage. Projet Académique (FSSM). Tous droits réservés.",
    "ar": "© 2026 دار الأمتعة (Dar Of Luggage). مشروع أكاديمي (FSSM). جميع الحقوق محفوظة.",
    "en": "© 2026 Dar Of Luggage. Academic Web Project (FSSM). All rights reserved."
  },
  "footer_privacy": {
    "fr": "Confidentialité",
    "ar": "الخصوصية",
    "en": "Privacy Policy"
  },
  "footer_terms": {
    "fr": "Conditions d'utilisation",
    "ar": "شروط الاستخدام",
    "en": "Terms of Service"
  },
  "footer_security_guarantee": {
    "fr": "Garantie de Sécurité",
    "ar": "ضمان الأمان",
    "en": "Security Guarantee"
  },
  "footer_academic_note": {
    "fr": "Projet académique – données et statistiques fictives (3 000 000 de bagages, 34 288 avis et garantie 100 000 DH sont fictifs).",
    "ar": "مشروع أكاديمي – بيانات وإحصائيات افتراضية (3,000,000 حقيبة، 34,288 تقييماً وضمان 100,000 د.م. هي أرقام تجريبية).",
    "en": "Academic project – simulated data and statistics (3,000,000 bags, 34,288 reviews and 100,000 MAD guarantee are for demonstration purposes)."
  }
};

/**
 * Langue courante mémorisée dans localStorage
 */
let currentLanguage = (() => {
  try {
    const saved = localStorage.getItem('dar_lang');
    return (saved && ['fr', 'ar', 'en'].includes(saved)) ? saved : DEFAULT_LANGUAGE;
  } catch (_) {
    return DEFAULT_LANGUAGE;
  }
})();

/**
 * G.32 : FILET DE SÉCURITÉ MYMEMORY API & CACHE LOCALSTORAGE
 * Explication pour le professeur :
 * Si un texte dynamique n'a pas de traduction statique dans TRANSLATIONS,
 * cette fonction interroge l'API gratuite MyMemory (pair fr -> ar ou fr -> en).
 * Pour éviter des requêtes réseau répétitives et respecter les quotas de l'API,
 * chaque résultat est enregistré dans localStorage sous la clé 'dar_tcache'.
 * En cas d'indisponibilité réseau, le texte français d'origine est retourné sans erreur.
 */
async function translateText(text, targetLang) {
  if (!text || targetLang === 'fr') return text;
  const cacheKey = `${targetLang}:${text}`;
  let cache = {};
  try {
    cache = JSON.parse(localStorage.getItem('dar_tcache') || '{}');
    if (cache[cacheKey]) return cache[cacheKey];
  } catch (_) {}

  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=fr|${targetLang}`;
    const res = await fetch(url);
    if (!res.ok) return text;
    const data = await res.json();
    if (data && data.responseData && data.responseData.translatedText) {
      const translated = data.responseData.translatedText;
      cache[cacheKey] = translated;
      try {
        localStorage.setItem('dar_tcache', JSON.stringify(cache));
      } catch (_) {}
      return translated;
    }
  } catch (err) {
    console.warn('Filet de sécurité MyMemory indisponible :', err);
  }
  return text;
}

/**
 * Récupère la traduction d'une clé. Si la clé est introuvable et que la langue est différente du français,
 * active le filet de sécurité MyMemory de manière asynchrone pour mettre à jour l'élément si nécessaire.
 */
function getTranslation(key, lang = currentLanguage) {
  const entry = TRANSLATIONS[key];
  if (!entry) {
    // Si la clé n'existe pas et qu'on n'est pas en français, tenter de récupérer du cache
    const cacheKey = `${lang}:${key}`;
    try {
      const cache = JSON.parse(localStorage.getItem('dar_tcache') || '{}');
      if (cache[cacheKey]) return cache[cacheKey];
    } catch (_) {}
    return key;
  }
  return entry[lang] || entry[DEFAULT_LANGUAGE] || key;
}

function isRtl(lang = currentLanguage) {
  return lang === 'ar';
}

function getLanguageName(lang = currentLanguage) {
  switch (lang) {
    case 'fr': return 'Français';
    case 'ar': return 'العربية';
    case 'en': return 'English';
    default: return 'Français';
  }
}

/**
 * Change la langue de l'ensemble de l'application et met à jour le DOM
 */
function setLanguage(lang) {
  if (!['fr', 'ar', 'en'].includes(lang)) lang = DEFAULT_LANGUAGE;
  currentLanguage = lang;
  try {
    localStorage.setItem('dar_lang', lang);
  } catch (_) {}

  document.documentElement.lang = lang;
  document.documentElement.setAttribute('dir', isRtl(lang) ? 'rtl' : 'ltr');

  const flagMap = { fr: '🇫🇷', ar: '🇲🇦', en: '🇬🇧' };
  const labelEl = document.getElementById('currentLangLabel');
  if (labelEl) labelEl.textContent = getLanguageName(lang);
  const flagEl = document.getElementById('currentLangFlag');
  if (flagEl) flagEl.textContent = flagMap[lang];
  const codeEl = document.getElementById('currentLangCode');
  if (codeEl) codeEl.textContent = lang.toUpperCase();
  document.querySelectorAll('.lang-code').forEach((el) => {
    el.textContent = lang.toUpperCase();
  });

  document.querySelectorAll('.lang-opt').forEach((opt) => {
    opt.classList.toggle('active', opt.dataset.lang === lang);
  });

  // Traduction des textes avec data-i18n
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    const val = getTranslation(key, lang);
    if (val) el.textContent = val;
  });

  // Traduction des placeholders avec data-i18n-placeholder
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const key = el.dataset.i18nPlaceholder;
    const val = getTranslation(key, lang);
    if (val) el.placeholder = val;
  });

  // Traduction des titres d'accessibilité avec data-i18n-title
  document.querySelectorAll('[data-i18n-title]').forEach((el) => {
    const key = el.dataset.i18nTitle;
    const val = getTranslation(key, lang);
    if (val) el.title = val;
  });

  // G.33 : Rechargement des textes dynamiques générés par JavaScript
  if (typeof refreshSearchPageI18n === 'function') {
    refreshSearchPageI18n();
  }
  if (typeof refreshHomePageI18n === 'function') {
    refreshHomePageI18n();
  }
  if (typeof updateBookingPrice === 'function') {
    updateBookingPrice();
  }
}

/**
 * Initialise le sélecteur déroulant de langues dans l'en-tête
 */
function initLanguageSelector() {
  const wrapper = document.getElementById('langSelectorWrapper');
  const btn = document.getElementById('langSelectorBtn');
  const dropdown = document.getElementById('langDropdown');
  if (!btn || !dropdown) {
    setLanguage(currentLanguage);
    return;
  }

  const toggleDropdown = (open) => {
    const shouldOpen = open !== undefined ? open : dropdown.classList.contains('hidden');
    if (shouldOpen) {
      dropdown.classList.remove('hidden');
      btn.setAttribute('aria-expanded', 'true');
    } else {
      dropdown.classList.add('hidden');
      btn.setAttribute('aria-expanded', 'false');
    }
  };

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleDropdown();
  });

  dropdown.querySelectorAll('.lang-opt').forEach((opt) => {
    opt.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetLang = opt.dataset.lang;
      if (targetLang) {
        setLanguage(targetLang);
        toggleDropdown(false);
        const toastMsgs = {
          fr: 'Langue changée : Français',
          ar: 'تم تغيير اللغة: العربية',
          en: 'Language updated: English'
        };
        showToast(toastMsgs[targetLang] || 'Language updated', 'info');
      }
    });
  });

  document.addEventListener('click', (e) => {
    if (wrapper && !wrapper.contains(e.target)) {
      toggleDropdown(false);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') toggleDropdown(false);
  });

  setLanguage(currentLanguage);
}

/* ==========================================================================
   1. DONNÉES DE L'APPLICATION (VILLES & CONSIGNES VÉRIFIÉES)
   E.22 : 3 consignes ajoutées pour Paris, Londres et Madrid
   ========================================================================== */

const MAX_BAGS = 12;
const DEFAULT_PRICE = 35; // 35 DH / jour

const STORAGE_LOCATIONS_DATA = [
  // ==========================================
  // MARRAKECH (13 Points)
  // ==========================================
  {
    id: 'rak-1',
    name: "Riad Dar L'Oasis Medina Storage",
    city: 'Marrakesh',
    lat: 31.6260,
    lng: -7.9890,
    walkingTime: '4 min',
    address: 'Derb Dabachi, Médina, Marrakech',
    distance: '150m de Jemaa el-Fnaa',
    price: 35,
    rating: 4.95,
    reviews: 218,
    type: 'Hotel',
    hours: '24/7',
    image: 'https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'rak-2',
    name: 'Gueliz Plaza Central Luggage Drop',
    city: 'Marrakesh',
    lat: 31.6348,
    lng: -8.0125,
    walkingTime: '6 min',
    address: 'Boulevard Mohamed V, Guéliz, Marrakech',
    distance: '200m du Plaza Guéliz',
    price: 35,
    rating: 4.90,
    reviews: 142,
    type: 'Lounge',
    hours: '08:00 - 23:00',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'rak-3',
    name: 'Gare ONCF Guéliz Terminal Storage',
    city: 'Marrakesh',
    lat: 31.6305,
    lng: -8.0165,
    walkingTime: '2 min',
    address: 'Avenue Hassan II, Gare de Marrakech',
    distance: '80m de la Gare de Marrakech',
    price: 35,
    rating: 4.93,
    reviews: 310,
    type: 'Hotel',
    hours: '24/7',
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'rak-4',
    name: 'Koutoubia Gate Secure Baggage Keep',
    city: 'Marrakesh',
    lat: 31.6240,
    lng: -7.9935,
    walkingTime: '3 min',
    address: 'Avenue Mohammed V, Marrakech',
    distance: '100m de la Mosquée Koutoubia',
    price: 35,
    rating: 4.88,
    reviews: 176,
    type: 'Boutique',
    hours: '07:30 - 23:30',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'rak-5',
    name: 'Bab Doukkala Station Baggage Drop',
    city: 'Marrakesh',
    lat: 31.6340,
    lng: -7.9945,
    walkingTime: '3 min',
    address: 'Place Bab Doukkala, Médina',
    distance: '100m de la Gare Routière Bab Doukkala',
    price: 35,
    rating: 4.91,
    reviews: 205,
    type: 'Hotel',
    hours: '24/7',
    image: 'https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'rak-6',
    name: 'Majorelle & YSL Museum Luggage Hub',
    city: 'Marrakesh',
    lat: 31.6405,
    lng: -8.0033,
    walkingTime: '3 min',
    address: 'Rue Yves Saint Laurent, Semlalia/Guéliz',
    distance: '120m du Jardin Majorelle',
    price: 35,
    rating: 4.92,
    reviews: 195,
    type: 'Boutique',
    hours: '08:30 - 20:00',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'rak-7',
    name: 'Semlalia University Quarter Safe Keep',
    city: 'Marrakesh',
    lat: 31.6435,
    lng: -8.0110,
    walkingTime: '4 min',
    address: 'Boulevard My Abdellah, Semlalia',
    distance: '150m de la Faculté des Sciences Semlalia',
    price: 35,
    rating: 4.89,
    reviews: 124,
    type: 'Lounge',
    hours: '08:00 - 22:00',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'rak-8',
    name: 'Hivernage Royal Resort Storage & Lounge',
    city: 'Marrakesh',
    lat: 31.6235,
    lng: -8.0070,
    walkingTime: '5 min',
    address: 'Avenue Echouhada, L\'Hivernage',
    distance: '200m du Casino de Marrakech',
    price: 35,
    rating: 4.96,
    reviews: 188,
    type: 'Hotel',
    hours: '24/7',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'rak-9',
    name: 'Bahia Palace & Mellah Luggage Point',
    city: 'Marrakesh',
    lat: 31.6215,
    lng: -7.9820,
    walkingTime: '2 min',
    address: 'Rue Riad Zitoun el Jdid, Médina',
    distance: '90m du Palais de la Bahia',
    price: 35,
    rating: 4.94,
    reviews: 260,
    type: 'Boutique',
    hours: '08:30 - 21:00',
    image: 'https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'rak-10',
    name: 'Kasbah & Bab Agnaou Heritage Keep',
    city: 'Marrakesh',
    lat: 31.6170,
    lng: -7.9890,
    walkingTime: '3 min',
    address: 'Rue de la Kasbah, Méchouar-Kasbah',
    distance: '100m des Tombeaux Saadiens',
    price: 35,
    rating: 4.90,
    reviews: 165,
    type: 'Hotel',
    hours: '24/7',
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'rak-11',
    name: 'Bab Taghzout Northern Medina Storage',
    city: 'Marrakesh',
    lat: 31.6390,
    lng: -7.9880,
    walkingTime: '3 min',
    address: 'Place Bab Taghzout, Médina Nord',
    distance: '120m de Zaouia Sidi Bel Abbès',
    price: 35,
    rating: 4.87,
    reviews: 98,
    type: 'Boutique',
    hours: '08:00 - 22:00',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'rak-12',
    name: 'Agdal Gardens & Al Mazar Express Keep',
    city: 'Marrakesh',
    lat: 31.6020,
    lng: -7.9870,
    walkingTime: '4 min',
    address: 'Route de l\'Ourika, Agdal',
    distance: '150m du Centre Commercial Al Mazar',
    price: 35,
    rating: 4.88,
    reviews: 112,
    type: 'Lounge',
    hours: '09:00 - 22:30',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'rak-13',
    name: 'Massira & Targa Avenue Luggage Drop',
    city: 'Marrakesh',
    lat: 31.6410,
    lng: -8.0380,
    walkingTime: '5 min',
    address: 'Avenue Dakhla, Massira II / Targa',
    distance: '100m du Boulevard principal Massira',
    price: 35,
    rating: 4.85,
    reviews: 84,
    type: 'Boutique',
    hours: '08:30 - 21:30',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=500&q=80'
  },

  // ==========================================
  // CASABLANCA (4 Points)
  // ==========================================
  {
    id: 'cas-1',
    name: "Casa-Port Terminal Baggage Safe",
    city: 'Casablanca',
    lat: 33.6012,
    lng: -7.6120,
    walkingTime: '2 min',
    address: 'Boulevard Houphouet Boigny, Casablanca',
    distance: '80m de la Gare Casa-Port',
    price: 35,
    rating: 4.93,
    reviews: 320,
    type: 'Hotel',
    hours: '24/7',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'cas-2',
    name: 'Hassan II Mosque Waterfront Lounge',
    city: 'Casablanca',
    lat: 33.6065,
    lng: -7.6325,
    walkingTime: '4 min',
    address: 'Boulevard Sidi Mohammed Ben Abdallah, Casablanca',
    distance: '180m de la Mosquée Hassan II',
    price: 35,
    rating: 4.95,
    reviews: 278,
    type: 'Lounge',
    hours: '08:00 - 22:30',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'cas-3',
    name: 'Casa-Voyageurs TGV Station Express',
    city: 'Casablanca',
    lat: 33.5892,
    lng: -7.5910,
    walkingTime: '3 min',
    address: 'Place des Almohades, Casa-Voyageurs',
    distance: '100m de la Gare TGV Casa-Voyageurs',
    price: 35,
    rating: 4.91,
    reviews: 240,
    type: 'Hotel',
    hours: '24/7',
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'cas-4',
    name: 'Maârif Shopping District Keep',
    city: 'Casablanca',
    lat: 33.5780,
    lng: -7.6360,
    walkingTime: '5 min',
    address: 'Rue Bab Mansour, Maârif, Casablanca',
    distance: '150m des Twin Center',
    price: 35,
    rating: 4.88,
    reviews: 190,
    type: 'Boutique',
    hours: '09:00 - 22:00',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=500&q=80'
  },

  // ==========================================
  // RABAT (3 Points)
  // ==========================================
  {
    id: 'rab-1',
    name: 'Rabat Agdal Al Boraq TGV Point',
    city: 'Rabat',
    lat: 33.9985,
    lng: -6.8525,
    walkingTime: '2 min',
    address: 'Avenue de France, Agdal, Rabat',
    distance: '90m de la Gare Rabat-Agdal TGV',
    price: 35,
    rating: 4.93,
    reviews: 215,
    type: 'Hotel',
    hours: '24/7',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'rab-2',
    name: 'Rabat Ville Station & Medina Storage',
    city: 'Rabat',
    lat: 34.0175,
    lng: -6.8360,
    walkingTime: '3 min',
    address: 'Avenue Mohammed V, Centre Ville, Rabat',
    distance: '110m de la Gare Rabat Ville',
    price: 35,
    rating: 4.90,
    reviews: 180,
    type: 'Boutique',
    hours: '08:00 - 22:00',
    image: 'https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'rab-3',
    name: 'Tour Hassan & Oudayas Heritage Lounge',
    city: 'Rabat',
    lat: 34.0230,
    lng: -6.8240,
    walkingTime: '4 min',
    address: 'Boulevard Al Marsa, Kasbah des Oudayas',
    distance: '200m de la Tour Hassan & Kasbah',
    price: 35,
    rating: 4.94,
    reviews: 145,
    type: 'Lounge',
    hours: '08:30 - 21:00',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=500&q=80'
  },

  // ==========================================
  // TANGIER (3 Points)
  // ==========================================
  {
    id: 'tan-1',
    name: 'Tanger Ville High-Speed Station Lockers',
    city: 'Tangier',
    lat: 35.7725,
    lng: -5.7940,
    walkingTime: '2 min',
    address: 'Place de la Gare, Tanger',
    distance: '80m du Terminus TGV Tanger Ville',
    price: 35,
    rating: 4.94,
    reviews: 290,
    type: 'Hotel',
    hours: '24/7',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'tan-2',
    name: 'Grand Socco & Kasbah Medina Storage',
    city: 'Tangier',
    lat: 35.7850,
    lng: -5.8130,
    walkingTime: '3 min',
    address: 'Place du 9 Avril 1947, Médina, Tanger',
    distance: '100m du Grand Socco',
    price: 35,
    rating: 4.92,
    reviews: 210,
    type: 'Boutique',
    hours: '08:00 - 23:00',
    image: 'https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'tan-3',
    name: 'Marina Bay & Port Luggage Drop',
    city: 'Tangier',
    lat: 35.7820,
    lng: -5.8040,
    walkingTime: '4 min',
    address: 'Avenue Mohammed VI, Marina Bay, Tanger',
    distance: '150m du Port de Tanger Ville',
    price: 35,
    rating: 4.89,
    reviews: 160,
    type: 'Lounge',
    hours: '08:00 - 22:00',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=500&q=80'
  },

  // ==========================================
  // FES (2 Points)
  // ==========================================
  {
    id: 'fes-1',
    name: 'Bab Boujloud Blue Gate Storage',
    city: 'Fes',
    lat: 34.0618,
    lng: -4.9840,
    walkingTime: '2 min',
    address: 'Place Bab Boujloud, Fès el-Bali',
    distance: '50m de la Porte Bleue',
    price: 35,
    rating: 4.96,
    reviews: 310,
    type: 'Hotel',
    hours: '24/7',
    image: 'https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'fes-2',
    name: 'Gare de Fès Ville Nouvelle Keep',
    city: 'Fes',
    lat: 34.0475,
    lng: -5.0040,
    walkingTime: '3 min',
    address: 'Avenue des Almohades, Ville Nouvelle, Fès',
    distance: '120m de la Gare ONCF Fès',
    price: 35,
    rating: 4.88,
    reviews: 175,
    type: 'Boutique',
    hours: '08:00 - 22:00',
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=500&q=80'
  },

  // ==========================================
  // AGADIR (2 Points)
  // ==========================================
  {
    id: 'aga-1',
    name: 'Marina Agadir Beach & Port Drop',
    city: 'Agadir',
    lat: 30.4278,
    lng: -9.6080,
    walkingTime: '3 min',
    address: 'Boulevard 20 Août, Marina Agadir',
    distance: '100m de la Plage & Marina',
    price: 35,
    rating: 4.93,
    reviews: 225,
    type: 'Hotel',
    hours: '24/7',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'aga-2',
    name: 'Souk El Had Central Luggage Lounge',
    city: 'Agadir',
    lat: 30.4120,
    lng: -9.5810,
    walkingTime: '4 min',
    address: 'Rue 2 Martyrs, Souk El Had, Agadir',
    distance: '130m de la Porte 6 Souk El Had',
    price: 35,
    rating: 4.90,
    reviews: 185,
    type: 'Lounge',
    hours: '08:30 - 20:30',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=500&q=80'
  },

  // ==========================================
  // ESSAOUIRA (2 Points)
  // ==========================================
  {
    id: 'ess-1',
    name: 'Bab Sbaa Medina & Ramparts Storage',
    city: 'Essaouira',
    lat: 31.5115,
    lng: -9.7680,
    walkingTime: '3 min',
    address: 'Avenue de l\'Indépendance, Médina',
    distance: '90m de Bab Sbaa',
    price: 35,
    rating: 4.95,
    reviews: 198,
    type: 'Hotel',
    hours: '24/7',
    image: 'https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'ess-2',
    name: 'Port d\'Essaouira Beach Keep',
    city: 'Essaouira',
    lat: 31.5070,
    lng: -9.7710,
    walkingTime: '2 min',
    address: 'Boulevard Oqba Ibn Nafi, Port d\'Essaouira',
    distance: '100m du Port de Pêche',
    price: 35,
    rating: 4.91,
    reviews: 140,
    type: 'Boutique',
    hours: '08:00 - 21:00',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=500&q=80'
  },

  // ==========================================
  // DAKHLA (2 Points)
  // ==========================================
  {
    id: 'dak-1',
    name: 'Dakhla Baie & Lagoon Kitesurf Storage',
    city: 'Dakhla',
    lat: 23.7150,
    lng: -15.9340,
    walkingTime: '3 min',
    address: 'Avenue Mohammed V, Dakhla',
    distance: '120m du Front de Mer',
    price: 35,
    rating: 4.95,
    reviews: 184,
    type: 'Hotel',
    hours: '24/7',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'dak-2',
    name: 'Dakhla Airport & Centre Express',
    city: 'Dakhla',
    lat: 23.7190,
    lng: -15.9280,
    walkingTime: '5 min',
    address: 'Boulevard Al Walaa, Dakhla',
    distance: '2km de l\'Aéroport de Dakhla',
    price: 35,
    rating: 4.90,
    reviews: 110,
    type: 'Lounge',
    hours: '07:00 - 23:00',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=500&q=80'
  },

  // ==========================================
  // PARIS (E.22 : 3 Consignes Ajoutées)
  // ==========================================
  {
    id: 'par-1',
    name: 'Gare du Nord & Eurostar Safe Luggage Hub',
    city: 'Paris',
    lat: 48.8809,
    lng: 2.3553,
    walkingTime: '2 min',
    address: 'Rue de Dunkerque, 75010 Paris',
    distance: '100m de la Gare du Nord',
    price: 45,
    rating: 4.94,
    reviews: 420,
    type: 'Hotel',
    hours: '24/7',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'par-2',
    name: 'Châtelet-Les Halles Central Drop & Lockers',
    city: 'Paris',
    lat: 48.8619,
    lng: 2.3470,
    walkingTime: '3 min',
    address: 'Rue Rambuteau, 75001 Paris',
    distance: '150m du Forum des Halles & RER',
    price: 45,
    rating: 4.91,
    reviews: 310,
    type: 'Lounge',
    hours: '08:00 - 23:00',
    image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'par-3',
    name: 'Tour Eiffel & Champ de Mars Boutique Keep',
    city: 'Paris',
    lat: 48.8584,
    lng: 2.2945,
    walkingTime: '4 min',
    address: 'Avenue de la Bourdonnais, 75007 Paris',
    distance: '250m de la Tour Eiffel',
    price: 45,
    rating: 4.96,
    reviews: 380,
    type: 'Boutique',
    hours: '08:30 - 22:00',
    image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=500&q=80'
  },

  // ==========================================
  // LONDRES (E.22 : 3 Consignes Ajoutées)
  // ==========================================
  {
    id: 'lon-1',
    name: "King's Cross St Pancras International Storage",
    city: 'London',
    lat: 51.5314,
    lng: -0.1261,
    walkingTime: '2 min',
    address: 'Euston Road, London N1C 4QP',
    distance: '90m de King\'s Cross Station',
    price: 50,
    rating: 4.95,
    reviews: 512,
    type: 'Hotel',
    hours: '24/7',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'lon-2',
    name: 'Covent Garden & West End Theatres Keep',
    city: 'London',
    lat: 51.5117,
    lng: -0.1228,
    walkingTime: '3 min',
    address: 'Bow Street, London WC2E 7AA',
    distance: '100m du Covent Garden Market',
    price: 50,
    rating: 4.92,
    reviews: 290,
    type: 'Lounge',
    hours: '08:00 - 23:00',
    image: 'https://images.unsplash.com/photo-1526129318478-62ed807ebdf9?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'lon-3',
    name: 'Victoria Station & Buckingham Palace Hub',
    city: 'London',
    lat: 51.4952,
    lng: -0.1439,
    walkingTime: '3 min',
    address: 'Buckingham Palace Road, London SW1W 0PP',
    distance: '120m de London Victoria Station',
    price: 50,
    rating: 4.90,
    reviews: 340,
    type: 'Boutique',
    hours: '07:30 - 22:30',
    image: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?auto=format&fit=crop&w=500&q=80'
  },

  // ==========================================
  // MADRID (E.22 : 3 Consignes Ajoutées)
  // ==========================================
  {
    id: 'mad-1',
    name: 'Puerta de Atocha AVE Train Station Lockers',
    city: 'Madrid',
    lat: 40.4065,
    lng: -3.6896,
    walkingTime: '2 min',
    address: 'Plaza del Emperador Carlos V, 28012 Madrid',
    distance: '80m de la Gare Atocha Renfe',
    price: 40,
    rating: 4.94,
    reviews: 380,
    type: 'Hotel',
    hours: '24/7',
    image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'mad-2',
    name: 'Puerta del Sol & Plaza Mayor Safe Keep',
    city: 'Madrid',
    lat: 40.4168,
    lng: -3.7038,
    walkingTime: '3 min',
    address: 'Calle Mayor, 28013 Madrid',
    distance: '90m de la Puerta del Sol',
    price: 40,
    rating: 4.93,
    reviews: 295,
    type: 'Lounge',
    hours: '08:00 - 23:00',
    image: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'mad-3',
    name: 'Gran Vía & Chueca Shopping District Storage',
    city: 'Madrid',
    lat: 40.4201,
    lng: -3.7010,
    walkingTime: '3 min',
    address: 'Gran Vía 42, 28013 Madrid',
    distance: '50m du Métro Gran Vía',
    price: 40,
    rating: 4.91,
    reviews: 215,
    type: 'Boutique',
    hours: '08:30 - 22:30',
    image: 'https://images.unsplash.com/photo-1509840841025-9088ba78a826?auto=format&fit=crop&w=500&q=80'
  }
];

/**
 * E.21 : Calcul dynamique du nombre réel de consignes par ville.
 * Le nombre n'est plus codé en dur (64, 82...) mais découle des données exactes.
 */
function getSpotsCountForCity(cityName) {
  return STORAGE_LOCATIONS_DATA.filter((s) => s.city.toLowerCase() === cityName.toLowerCase()).length;
}

const POPULAR_CITIES = [
  { name: 'Marrakesh', country: 'Maroc', flag: '🇲🇦', lat: 31.6295, lng: -7.9811, zoom: 14 },
  { name: 'Casablanca', country: 'Maroc', flag: '🇲🇦', lat: 33.5731, lng: -7.5898, zoom: 13 },
  { name: 'Rabat', country: 'Maroc', flag: '🇲🇦', lat: 34.0209, lng: -6.8416, zoom: 14 },
  { name: 'Fes', country: 'Maroc', flag: '🇲🇦', lat: 34.0331, lng: -5.0003, zoom: 14 },
  { name: 'Tangier', country: 'Maroc', flag: '🇲🇦', lat: 35.7595, lng: -5.8340, zoom: 14 },
  { name: 'Agadir', country: 'Maroc', flag: '🇲🇦', lat: 30.4278, lng: -9.5981, zoom: 14 },
  { name: 'Essaouira', country: 'Maroc', flag: '🇲🇦', lat: 31.5085, lng: -9.7595, zoom: 14 },
  { name: 'Dakhla', country: 'Maroc', flag: '🇲🇦', lat: 23.7136, lng: -15.9355, zoom: 13 },
  { name: 'Paris', country: 'France', flag: '🇫🇷', lat: 48.8566, lng: 2.3522, zoom: 13 },
  { name: 'London', country: 'Royaume-Uni', flag: '🇬🇧', lat: 51.5074, lng: -0.1278, zoom: 13 },
  { name: 'Madrid', country: 'Espagne', flag: '🇪🇸', lat: 40.4168, lng: -3.7038, zoom: 13 }
].map((c) => ({
  ...c,
  spots: getSpotsCountForCity(c.name)
}));

const CITY_ALIASES = {
  marrakech: 'marrakesh',
  marrakesh: 'marrakesh',
  casa: 'casablanca',
  casablanca: 'casablanca',
  darbaida: 'casablanca',
  rabat: 'rabat',
  fes: 'fes',
  fez: 'fes',
  tanger: 'tangier',
  tangier: 'tangier',
  agadir: 'agadir',
  essaouira: 'essaouira',
  dakhla: 'dakhla',
  paris: 'paris',
  london: 'london',
  londres: 'london',
  madrid: 'madrid'
};

/* ==========================================================================
   2. ÉTAT PARTAGÉ & FONCTIONS UTILITAIRES
   ========================================================================== */
let heroMapInstance = null;
let searchMapInstance = null;
let currentSelectedCity = POPULAR_CITIES[0];
let currentHeroBags = 2;
let selectedDate = toInputDate();
let selectedPickupDate = toInputDate();

// Sauvegarde du HTML initial de la modal de réservation pour restauration (A.2)
let initialBookingModalHTML = '';

const $ = (id) => document.getElementById(id);

function escapeHTML(str = '') {
  return String(str).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[c]));
}

function toInputDate(d = new Date()) {
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function formatShortDate(iso, lang = currentLanguage) {
  const d = (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) ? new Date() : new Date(`${iso}T00:00:00`);
  const locale = lang === 'fr' ? 'fr-FR' : (lang === 'ar' ? 'ar-MA' : 'en-GB');
  const label = d.toLocaleDateString(locale, { day: 'numeric', month: 'short' });
  const todayLabel = lang === 'fr' ? "Aujourd'hui" : (lang === 'ar' ? 'اليوم' : 'Today');
  return (!iso || iso === toInputDate()) ? `${todayLabel}, ${label}` : label;
}

function findCity(name = '') {
  const key = name.trim().toLowerCase();
  const wanted = CITY_ALIASES[key] || key;
  return POPULAR_CITIES.find((c) => c.name.toLowerCase() === wanted) || null;
}

/**
 * Calcule la distance orthodromique (en km) entre deux coordonnées GPS (formule de Haversine)
 */
function distanceKm(lat1, lng1, lat2, lng2) {
  const rad = (x) => (x * Math.PI) / 180;
  const a = Math.sin(rad(lat2 - lat1) / 2) ** 2 +
            Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(rad(lng2 - lng1) / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Géolocalisation via l'API HTML5 standard (Promise)
 */
function getUserPosition() {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      return reject({ code: 0, message: 'Geolocation not supported' });
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  });
}

/**
 * Retourne le message d'erreur GPS traduit (G.30)
 */
function geoErrorMessage(err = {}) {
  switch (err.code) {
    case 1:
      return getTranslation('geo_err_denied', currentLanguage);
    case 2:
      return getTranslation('geo_err_unavailable', currentLanguage);
    case 3:
      return getTranslation('geo_err_timeout', currentLanguage);
    default:
      return getTranslation('geo_err_default', currentLanguage);
  }
}

let toastTimer = null;
function showToast(message, type = 'info') {
  let toast = $('toastNotification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastNotification';
    toast.className = 'toast-box';
    toast.setAttribute('role', 'status');
    document.body.appendChild(toast);
  }
  toast.className = 'toast-box';
  if (type === 'success') toast.classList.add('success');
  if (type === 'error') toast.classList.add('error');
  toast.textContent = message;
  void toast.offsetWidth;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3500);
}

/* ==========================================================================
   3. C.13 : FONCTION UNIQUE ET GÉNÉRALISÉE POUR LES MARQUEURS LEAFLET
   Évite toute duplication de code entre la carte d'accueil et de recherche.
   ========================================================================== */

/**
 * Rend les marqueurs d'une ville sur une carte Leaflet quelconque.
 * @param {L.Map} map - L'instance Leaflet cible
 * @param {Array} markersHolder - Tableau stockant les instances de marqueurs
 * @param {string} cityName - Nom de la ville à afficher
 * @param {Function} [onMarkerClick] - Callback optionnel au clic sur un marqueur
 */
function renderSpotMarkers(map, markersHolder, cityName, onMarkerClick) {
  if (!map || typeof L === 'undefined') return;

  // Nettoyage des anciens marqueurs
  markersHolder.forEach((m) => map.removeLayer(m));
  markersHolder.length = 0;

  const spots = STORAGE_LOCATIONS_DATA.filter((s) => s.city.toLowerCase() === cityName.toLowerCase());
  const perDayLabel = getTranslation('per_day', currentLanguage);
  const bookBtnLabel = getTranslation('search_book_btn', currentLanguage);

  spots.forEach((spot) => {
    const pinHtml = `
      <div class="custom-map-pin" title="${escapeHTML(spot.name)} (${spot.walkingTime})">
        <div class="walking-badge">🚶 ${spot.walkingTime}</div>
        <div class="pin-marker">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0A1128" stroke-width="2.2">
            <rect x="6" y="7" width="12" height="14" rx="2"></rect>
            <path d="M9 7V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v3"></path>
          </svg>
        </div>
        <div class="pin-shadow"></div>
      </div>
    `;

    const customIcon = L.divIcon({
      html: pinHtml,
      className: '',
      iconSize: [60, 68],
      iconAnchor: [30, 68],
      popupAnchor: [0, -70]
    });

    const marker = L.marker([spot.lat, spot.lng], { icon: customIcon }).addTo(map);
    marker.spotId = spot.id;

    const popupContent = `
      <div style="font-family: inherit; min-width: 210px; padding: 4px;">
        <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: var(--gold-light); background: var(--gold-tint); padding: 3px 8px; border-radius: 9999px;">${spot.type} • 🚶 ${spot.walkingTime}</span>
        <h4 style="font-size: 14px; font-weight: 800; color: var(--text); margin: 8px 0 2px;">${escapeHTML(spot.name)}</h4>
        <p style="font-size: 11px; color: var(--muted); margin-bottom: 10px;">${escapeHTML(spot.address)}</p>
        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-gold); padding-top: 8px;">
          <span style="font-size: 14px; font-weight: 900; color: var(--text);">${formatPrice(spot.price)}<span style="font-size: 10px; color: var(--muted);">${perDayLabel}</span></span>
          <button type="button" class="btn-primary" style="padding: 6px 14px; font-size: 11px;" onclick="window.openBookingFromMap('${spot.id}')">
            ${bookBtnLabel}
          </button>
        </div>
      </div>
    `;

    marker.bindPopup(popupContent);

    if (onMarkerClick) {
      marker.on('click', () => onMarkerClick(spot));
    }

    markersHolder.push(marker);
  });
}

window.openBookingFromMap = function (spotId) {
  const spot = STORAGE_LOCATIONS_DATA.find((s) => s.id === spotId);
  if (spot) openBookingModal(spot);
};

/* ==========================================================================
   4. LOGIQUE DE LA PAGE D'ACCUEIL (index.html)
   ========================================================================== */
let homeMapMarkers = [];

function refreshHomePageI18n() {
  const dateInput = $('selectedDateInput');
  if (dateInput && typeof selectedDate !== 'undefined') {
    dateInput.value = formatShortDate(selectedDate, currentLanguage);
  }
  const bagInput = $('heroBagInput');
  if (bagInput && typeof currentHeroBags !== 'undefined') {
    bagInput.value = currentLanguage === 'fr'
      ? (currentHeroBags === 1 ? '1 bagage' : `${currentHeroBags} bagages`)
      : (currentLanguage === 'ar'
          ? (currentHeroBags === 1 ? 'حقيبة واحدة' : `${currentHeroBags} حقائب`)
          : (currentHeroBags === 1 ? '1 bag' : `${currentHeroBags} bags`));
  }
}

function initHomePage() {
  if (!$('heroBookingForm')) return;
  initLeafletHeroMap();
  initHomeLocationModal();
  initHeroDate();
  initHeroBagCounter();
  initHeroForm();
  initWorldwideDestinations();
  updateHomeCityCardsSpotsCount();
}

/**
 * E.21 : Met à jour dynamiquement les textes de consignes sur les cartes de ville de l'accueil
 */
function updateHomeCityCardsSpotsCount() {
  document.querySelectorAll('.city-card[data-city]').forEach((card) => {
    // Si la carte dispose d'un texte de consignes fixe personnalisé (ex: "64 consignes vérifiées • Médina & Guéliz"), on le préserve
    if (card.dataset.customSpots === 'true') return;

    const cityName = card.dataset.city;
    const spotsCount = getSpotsCountForCity(cityName);
    const spotsText = card.querySelector('.city-spots');
    if (spotsText) {
      const label = currentLanguage === 'fr'
        ? `${spotsCount} ${spotsCount > 1 ? 'consignes vérifiées' : 'consigne vérifiée'}`
        : (currentLanguage === 'ar'
            ? `${spotsCount} ${spotsCount > 1 ? 'أماكن تخزين معتمدة' : 'مكان تخزين معتمد'}`
            : `${spotsCount} verified ${spotsCount > 1 ? 'spots' : 'spot'}`);
      spotsText.textContent = `${label} • Point Central`;
    }
  });
}

function selectHeroCity(name, { toast = true } = {}) {
  const city = findCity(name);
  if (!city) return;
  currentSelectedCity = city;
  const input = $('heroCityInput');
  if (input) input.value = `${city.name}, ${city.country}`;
  if (heroMapInstance) {
    heroMapInstance.setView([city.lat, city.lng], city.zoom, { animate: true });
    renderSpotMarkers(heroMapInstance, homeMapMarkers, city.name);
  }
  if (toast) {
    const msg = `${getTranslation('search_showing_city', currentLanguage)} ${city.name} (${city.spots} ${getTranslation('search_spots_available', currentLanguage)})`;
    showToast(msg, 'success');
  }
}

function initHomeLocationModal() {
  const modal = $('locationModal');
  const search = $('modalLocationInput');
  const openBtn = $('openLocationModalBtn');
  if (!modal || !openBtn) return;

  const close = () => modal.classList.remove('open');
  openBtn.addEventListener('click', () => modal.classList.add('open'));
  const closeBtn = $('closeLocationModal');
  if (closeBtn) closeBtn.addEventListener('click', close);

  // H.35 : Fermeture au clic sur le fond de modal
  modal.addEventListener('click', (e) => {
    if (e.target === modal) close();
  });

  document.querySelectorAll('.modal-city-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      const cityName = chip.dataset.city;
      selectHeroCity(cityName);
      close();
    });
  });

  if (search) {
    search.addEventListener('input', (e) => {
      const val = e.target.value.trim().toLowerCase();
      document.querySelectorAll('.modal-city-chip').forEach((chip) => {
        const text = chip.textContent.toLowerCase();
        chip.style.display = text.includes(val) ? 'inline-flex' : 'none';
      });
    });
  }
}

function initHeroDate() {
  const pill = $('heroDatePill');
  const native = $('heroDateNative');
  const field = $('selectedDateInput');
  if (!pill || !native || !field) return;

  const refresh = () => { field.value = formatShortDate(selectedDate); };
  native.min = toInputDate();
  native.value = selectedDate;
  refresh();

  pill.addEventListener('click', () => {
    try { native.showPicker(); } catch (_) { native.focus(); native.click(); }
  });
  native.addEventListener('change', () => {
    if (!native.value) return;
    selectedDate = native.value < toInputDate() ? toInputDate() : native.value;
    refresh();
  });
}

function initHeroBagCounter() {
  const minus = $('heroBagMinus');
  const plus = $('heroBagPlus');
  const display = $('heroBagDisplay');
  const bagInput = $('heroBagInput');
  if (!minus || !plus) return;

  const render = () => {
    if (display) display.textContent = currentHeroBags;
    if (bagInput) {
      bagInput.value = currentLanguage === 'ar'
        ? (currentHeroBags === 1 ? 'حقيبة واحدة' : `${currentHeroBags} حقائب`)
        : (currentLanguage === 'en'
            ? (currentHeroBags === 1 ? '1 bag' : `${currentHeroBags} bags`)
            : (currentHeroBags === 1 ? '1 bagage' : `${currentHeroBags} bagages`));
    }
  };
  minus.addEventListener('click', (e) => {
    e.stopPropagation();
    if (currentHeroBags > 1) { currentHeroBags--; render(); }
  });
  plus.addEventListener('click', (e) => {
    e.stopPropagation();
    if (currentHeroBags < MAX_BAGS) { currentHeroBags++; render(); }
  });
  render();
}

function initHeroForm() {
  const form = $('heroBookingForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const params = new URLSearchParams({
      city: currentSelectedCity.name,
      bags: currentHeroBags,
      date: selectedDate
    });
    window.location.href = `search.html?${params.toString()}`;
  });
}

function initWorldwideDestinations() {
  document.querySelectorAll('.city-card').forEach((card) => {
    card.addEventListener('click', () => {
      // La page d'accueil n'a plus de carte : on ouvre directement la recherche pour cette ville
      const city = findCity(card.dataset.city);
      if (!city) return;
      const params = new URLSearchParams({
        city: city.name,
        bags: currentHeroBags,
        date: selectedDate
      });
      window.location.href = `search.html?${params.toString()}`;
    });
  });
}

function initLeafletHeroMap() {
  const mapContainer = document.getElementById('heroMap');
  if (!mapContainer || typeof L === 'undefined') return;

  try {
    heroMapInstance = L.map('heroMap', {
      center: [currentSelectedCity.lat, currentSelectedCity.lng],
      zoom: currentSelectedCity.zoom,
      zoomControl: true,
      scrollWheelZoom: false
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors | Dar Of Luggage'
    }).addTo(heroMapInstance);

    heroMapInstance.zoomControl.setPosition('topright');
    renderSpotMarkers(heroMapInstance, homeMapMarkers, currentSelectedCity.name);
  } catch (err) {
    console.error('Erreur initialisation Leaflet Accueil :', err);
  }
}

/* ==========================================================================
   5. LOGIQUE DE LA PAGE DE RECHERCHE (search.html)
   C.10 - C.16 : Leaflet plein écran & fonctionnalités complètes
   ========================================================================== */
let searchMapMarkers = [];
let userGpsMarker = null;
let currentSearchSpots = [];
let searchActiveFilter247 = false;
let searchSortMode = 'default'; // 'default' | 'rating' | 'price'
let lastRenderedSpotsState = null;

function refreshSearchPageI18n() {
  if (lastRenderedSpotsState) {
    const { spots, title } = lastRenderedSpotsState;
    renderSpotsInternal(spots, title);
  }
}

function renderSpotsInternal(spots, title) {
  const spotsList = $('spotsList');
  const drawerTitle = $('drawerTitle');
  const spotsCount = $('spotsCount');
  const resultsDrawer = $('resultsDrawer');

  if (resultsDrawer) {
    resultsDrawer.classList.toggle('is-empty', spots.length === 0);
  }

  if (drawerTitle) drawerTitle.textContent = title;
  if (spotsCount) {
    const label = spots.length <= 1
      ? getTranslation('spots_count_singular', currentLanguage)
      : getTranslation('spots_count_plural', currentLanguage).replace('{n}', spots.length);
    spotsCount.textContent = label;
  }
  if (!spotsList) return;

  if (!spots.length) {
    const noSpotsMsg = getTranslation('no_spots_found', currentLanguage);
    spotsList.innerHTML = `<div class="spots-empty" style="padding: 24px; text-align: center; color: var(--muted);">${noSpotsMsg}</div>`;
    return;
  }

  const perBagLabel = getTranslation('per_bag_day', currentLanguage);
  const bookBtnLabel = getTranslation('search_book_btn', currentLanguage);

  spotsList.innerHTML = spots.map((s) => `
    <article class="spot-card" data-spot-id="${s.id}" tabindex="0">
      <div class="spot-header">
        <h3 class="spot-title">${escapeHTML(s.name)}</h3>
        <span class="spot-rating">★ ${s.rating}</span>
      </div>
      <p class="spot-desc">${s.type} • ${s.hours}<br>${escapeHTML(s.distance || s.address)}</p>
      <div class="spot-footer">
        <span class="spot-price">${formatPrice(s.price)} <small>${perBagLabel}</small></span>
        <button type="button" class="spot-book-btn" data-book="true">${bookBtnLabel}</button>
      </div>
    </article>`).join('');
}

/**
 * C.12 : Initialise la carte Leaflet plein écran sur search.html
 */
function initSearchMap(targetCity) {
  const mapContainer = document.getElementById('searchMap');
  if (!mapContainer || typeof L === 'undefined') return;

  try {
    searchMapInstance = L.map('searchMap', {
      center: [targetCity.lat, targetCity.lng],
      zoom: targetCity.zoom,
      zoomControl: false,
      scrollWheelZoom: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors | Dar Of Luggage'
    }).addTo(searchMapInstance);

    // C.12 : ZoomControl positionné en bas à droite
    L.control.zoom({ position: 'bottomright' }).addTo(searchMapInstance);
  } catch (err) {
    console.error('Erreur initialisation Leaflet Recherche :', err);
  }
}

/**
 * État et fonctions du volet partenaire style Nannybag
 */
const partnerDrawerState = {
  spot: null,
  bags: {
    ordinary: 1,
    small: 0,
    oversized: 0
  },
  days: 1
};

function openPartnerDrawer(spot) {
  if (!spot) return;
  partnerDrawerState.spot = spot;
  partnerDrawerState.bags = { ordinary: currentHeroBags || 1, small: 0, oversized: 0 };

  const listView = $('drawerListView');
  const detailView = $('drawerDetailView');
  if (listView) listView.classList.add('hidden');
  if (detailView) detailView.classList.remove('hidden');

  // En-tête
  const titleEl = $('partnerSpotTitle');
  if (titleEl) titleEl.textContent = spot.name;

  const ratingEl = $('partnerSpotRating');
  if (ratingEl) ratingEl.textContent = `${spot.rating} ★★★★★ (${spot.reviews || 142} avis)`;

  const statusText = $('partnerStatusText');
  if (statusText) statusText.textContent = `Ouvert · ${spot.hours || '24h/24, 7j/7'}`;

  // Prix unitaires
  const priceOrd = $('priceOrdinaryLabel');
  if (priceOrd) priceOrd.textContent = `${formatPrice(spot.price || 35)} / jour`;
  const priceSml = $('priceSmallLabel');
  if (priceSml) priceSml.textContent = `${formatPrice(25)} / jour`;
  const priceOvr = $('priceOversizedLabel');
  if (priceOvr) priceOvr.textContent = `${formatPrice(50)} / jour`;

  // Compteurs
  if ($('countOrdinary')) $('countOrdinary').textContent = partnerDrawerState.bags.ordinary;
  if ($('countSmall')) $('countSmall').textContent = partnerDrawerState.bags.small;
  if ($('countOversized')) $('countOversized').textContent = partnerDrawerState.bags.oversized;

  // Dates
  const dropInput = $('drawerDropDate');
  const pickupInput = $('drawerPickupDate');
  const today = toInputDate();
  if (dropInput) {
    dropInput.min = today;
    dropInput.value = selectedDate || today;
  }
  if (pickupInput) {
    pickupInput.min = selectedDate || today;
    pickupInput.value = selectedPickupDate || selectedDate || today;
  }

  // Horaires
  const addrName = $('partnerAddressName');
  if (addrName) addrName.textContent = spot.name;
  const addrFull = $('partnerAddressFull');
  if (addrFull) addrFull.textContent = spot.address || spot.distance;

  const hoursList = $('partnerHoursList');
  if (hoursList) {
    const daysWeek = [
      { day: 'Lundi', time: spot.hours || '24h/24' },
      { day: 'Mardi', time: spot.hours || '24h/24' },
      { day: 'Mercredi', time: spot.hours || '24h/24' },
      { day: 'Jeudi', time: spot.hours || '24h/24' },
      { day: 'Vendredi', time: spot.hours || '24h/24' },
      { day: 'Samedi', time: spot.hours || '24h/24' },
      { day: 'Dimanche', time: spot.hours || '24h/24' }
    ];
    const currentDayIdx = (new Date().getDay() + 6) % 7;
    hoursList.innerHTML = daysWeek.map((d, i) => `
      <div class="hour-schedule-row ${i === currentDayIdx ? 'today' : ''}">
        <span>${d.day} ${i === currentDayIdx ? '• Aujourd\'hui' : ''}</span>
        <span style="font-weight:700;">${d.time}</span>
      </div>
    `).join('');
  }

  // Avis
  const revScore = $('partnerReviewsScore');
  if (revScore) revScore.textContent = spot.rating;
  const revTotal = $('partnerReviewsTotal');
  if (revTotal) revTotal.textContent = `Basé sur ${spot.reviews || 142} avis vérifiés`;

  const revFeed = $('partnerReviewsFeed');
  if (revFeed) {
    revFeed.innerHTML = `
      <div class="partner-review-card">
        <div class="partner-review-header">
          <span>Sarah M.</span>
          <span style="color:var(--gold);">★★★★★</span>
        </div>
        <p class="partner-review-text">Emplacement parfait, accueil très courtois. Dépôt et retrait en moins d'une minute avec scellés !</p>
      </div>
      <div class="partner-review-card">
        <div class="partner-review-header">
          <span>Marc D.</span>
          <span style="color:var(--gold);">★★★★★</span>
        </div>
        <p class="partner-review-text">Hôtel très sécurisé et personnel disponible 24/7. Je recommande vivement pour explorer sans valises.</p>
      </div>
    `;
  }

  // Onglet par défaut : Réserver
  switchPartnerDrawerTab('tab-book');
  updatePartnerDrawerTotal();

  const resultsDrawer = $('resultsDrawer');
  if (resultsDrawer) resultsDrawer.classList.remove('is-empty');

  // Déplacement fluide de la carte vers la consigne
  if (searchMapInstance) {
    searchMapInstance.flyTo([spot.lat, spot.lng], 16, { duration: 1.2 });
    const marker = searchMapMarkers.find((m) => m.spotId === spot.id);
    if (marker) marker.openPopup();
  }
}

function closePartnerDrawer() {
  const listView = $('drawerListView');
  const detailView = $('drawerDetailView');
  if (listView) listView.classList.remove('hidden');
  if (detailView) detailView.classList.add('hidden');

  const resultsDrawer = $('resultsDrawer');
  if (resultsDrawer && lastRenderedSpotsState && lastRenderedSpotsState.spots.length === 0) {
    resultsDrawer.classList.add('is-empty');
  }
}

function switchPartnerDrawerTab(tabId) {
  document.querySelectorAll('.drawer-tab').forEach((tab) => {
    const isActive = tab.dataset.tab === tabId;
    tab.classList.toggle('active', isActive);
    tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });

  document.querySelectorAll('.drawer-tab-content').forEach((content) => {
    content.classList.toggle('active', content.id === tabId);
  });
}

function updatePartnerDrawerTotal() {
  const spot = partnerDrawerState.spot;
  if (!spot) return;

  const dropInput = $('drawerDropDate');
  const pickupInput = $('drawerPickupDate');
  let days = 1;

  if (dropInput && pickupInput) {
    const dVal = dropInput.value || toInputDate();
    const pVal = pickupInput.value || dVal;
    if (new Date(pVal) < new Date(dVal)) {
      pickupInput.value = dVal;
    }
    const diff = Math.max(0, new Date(pickupInput.value) - new Date(dropInput.value));
    days = Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1);
  }
  partnerDrawerState.days = days;

  const ordPrice = spot.price || 35;
  const smlPrice = 25;
  const ovrPrice = 50;

  const totalBags = partnerDrawerState.bags.ordinary + partnerDrawerState.bags.small + partnerDrawerState.bags.oversized;
  const dailyTotal = (partnerDrawerState.bags.ordinary * ordPrice) +
                     (partnerDrawerState.bags.small * smlPrice) +
                     (partnerDrawerState.bags.oversized * ovrPrice);
  const grandTotal = dailyTotal * days;

  const ctaBtn = $('btnContinueDrawerBooking');
  const ctaLabel = $('drawerCtaLabel');

  if (ctaBtn && ctaLabel) {
    if (totalBags === 0) {
      ctaLabel.textContent = getTranslation('drawer_btn_select_bags', currentLanguage);
      ctaBtn.classList.add('disabled');
      ctaBtn.disabled = true;
    } else {
      ctaBtn.classList.remove('disabled');
      ctaBtn.disabled = false;
      const formatted = formatPrice(grandTotal);
      ctaLabel.textContent = `${getTranslation('drawer_btn_continue', currentLanguage)}${formatted} (${totalBags} ${totalBags > 1 ? 'sacs' : 'sac'}, ${days} ${days > 1 ? 'j' : 'j'})`;
    }
  }
}

/**
 * Affiche une ville sur la carte de recherche et dans la liste
 */
function showCityOnSearch(city) {
  currentSelectedCity = city;
  const cityText = $('selectedCityText');
  if (cityText) cityText.textContent = city.name;

  if (searchMapInstance) {
    searchMapInstance.setView([city.lat, city.lng], city.zoom, { animate: true });
    renderSpotMarkers(searchMapInstance, searchMapMarkers, city.name, (spot) => {
      highlightSpotCard(spot.id);
      openPartnerDrawer(spot);
    });
  }

  currentSearchSpots = STORAGE_LOCATIONS_DATA.filter((s) => s.city.toLowerCase() === city.name.toLowerCase());
  applySearchFiltersAndSort();
  closePartnerDrawer();
}

/**
 * D.19 : Applique le filtre 24/7 et le tri (Note ou Prix)
 */
function applySearchFiltersAndSort() {
  let filtered = [...currentSearchSpots];

  if (searchActiveFilter247) {
    filtered = filtered.filter((s) => s.hours.includes('24/7'));
  }

  if (searchSortMode === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (searchSortMode === 'price') {
    filtered.sort((a, b) => a.price - b.price);
  }

  const heading = getTranslation('search_spots_heading', currentLanguage);
  lastRenderedSpotsState = {
    spots: filtered,
    title: `${heading} ${currentSelectedCity.name}`
  };
  renderSpotsInternal(filtered, `${heading} ${currentSelectedCity.name}`);
}

function highlightSpotCard(spotId) {
  const cards = document.querySelectorAll('.spot-card');
  cards.forEach((c) => {
    if (c.dataset.spotId === spotId) {
      c.classList.add('selected');
      c.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
      c.classList.remove('selected');
    }
  });
}

/**
 * Initialise l'ensemble des interactions de la page search.html
 */
function initSearchPage() {
  const panel = $('locationPanel');
  const pill = $('btnLocationPill');
  const searchMapContainer = $('searchMap');
  if (!panel || !pill || !searchMapContainer) return;

  const input = $('citySearchInput');
  const list = panel.querySelector('.cities-list');
  const spotsList = $('spotsList');

  let backdrop = document.querySelector('.panel-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'panel-backdrop';
    document.body.appendChild(backdrop);
  }

  // D.20 : Gestion de aria-hidden et aria-expanded
  function setPanel(open) {
    if (open) {
      panel.classList.remove('hidden');
      panel.setAttribute('aria-hidden', 'false');
      pill.classList.add('active');
      pill.setAttribute('aria-expanded', 'true');
      backdrop.classList.add('show');
    } else {
      panel.classList.add('hidden');
      panel.setAttribute('aria-hidden', 'true');
      pill.classList.remove('active');
      pill.setAttribute('aria-expanded', 'false');
      backdrop.classList.remove('show');
    }
  }

  pill.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = !panel.classList.contains('hidden');
    setPanel(!isOpen);
  });

  backdrop.addEventListener('click', () => setPanel(false));

  if (list) {
    list.addEventListener('click', (e) => {
      const li = e.target.closest('li[data-city]');
      if (li) {
        const c = findCity(li.dataset.city);
        if (c) showCityOnSearch(c);
        setPanel(false);
      }
    });
  }

  if (input) {
    input.addEventListener('input', (e) => {
      const val = e.target.value.trim().toLowerCase();
      const items = list.querySelectorAll('li[data-city]');
      items.forEach((item) => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(val) ? 'flex' : 'none';
      });
    });
  }

  // Clic sur une carte de consigne -> ouvre le volet partenaire Nannybag
  if (spotsList) {
    spotsList.addEventListener('click', (e) => {
      const card = e.target.closest('.spot-card');
      if (!card) return;
      const spotId = card.dataset.spotId;
      const spot = STORAGE_LOCATIONS_DATA.find((s) => s.id === spotId);
      if (!spot) return;

      highlightSpotCard(spotId);
      openPartnerDrawer(spot);
    });
  }

  // Écouteurs pour le volet partenaire Nannybag
  const backBtn = $('btnBackToSpotsList');
  if (backBtn) backBtn.addEventListener('click', closePartnerDrawer);

  const closeDetailBtn = $('btnClosePartnerDetail');
  if (closeDetailBtn) closeDetailBtn.addEventListener('click', closePartnerDrawer);

  // Onglets du volet partenaire
  document.querySelectorAll('.drawer-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      const targetTab = tab.dataset.tab;
      if (targetTab) switchPartnerDrawerTab(targetTab);
    });
  });

  // Boutons + et - pour les 3 catégories de bagages (Ordinaire, Petit, Inhabituel)
  const detailBody = document.querySelector('.partner-drawer-body');
  if (detailBody) {
    detailBody.addEventListener('click', (e) => {
      const btn = e.target.closest('.stepper-btn');
      if (!btn) return;
      const cat = btn.dataset.cat;
      const action = btn.dataset.step;
      if (cat && action && partnerDrawerState.bags[cat] !== undefined) {
        if (action === 'plus' && partnerDrawerState.bags[cat] < 12) {
          partnerDrawerState.bags[cat]++;
        } else if (action === 'minus' && partnerDrawerState.bags[cat] > 0) {
          partnerDrawerState.bags[cat]--;
        }

        const countId = `count${cat.charAt(0).toUpperCase() + cat.slice(1)}`;
        const countDisplay = $(countId);
        if (countDisplay) countDisplay.textContent = partnerDrawerState.bags[cat];

        updatePartnerDrawerTotal();
      }
    });
  }

  // Changement de dates dans le tiroir
  const drawerDrop = $('drawerDropDate');
  const drawerPickup = $('drawerPickupDate');
  if (drawerDrop) {
    drawerDrop.addEventListener('change', () => {
      selectedDate = drawerDrop.value;
      if (drawerPickup && new Date(drawerPickup.value) < new Date(drawerDrop.value)) {
        drawerPickup.value = drawerDrop.value;
      }
      updatePartnerDrawerTotal();
    });
  }
  if (drawerPickup) {
    drawerPickup.addEventListener('change', () => {
      selectedPickupDate = drawerPickup.value;
      updatePartnerDrawerTotal();
    });
  }

  // Bouton CTA du tiroir pour passer à la confirmation
  const continueBtn = $('btnContinueDrawerBooking');
  if (continueBtn) {
    continueBtn.addEventListener('click', () => {
      const totalBags = partnerDrawerState.bags.ordinary + partnerDrawerState.bags.small + partnerDrawerState.bags.oversized;
      if (totalBags <= 0) {
        showToast(getTranslation('drawer_btn_select_bags', currentLanguage), 'error');
        return;
      }

      currentHeroBags = totalBags;
      if (drawerDrop && drawerDrop.value) selectedDate = drawerDrop.value;
      if (drawerPickup && drawerPickup.value) selectedPickupDate = drawerPickup.value;

      openBookingModal(partnerDrawerState.spot);
    });
  }

  // D.17 : Boutons "Près de moi" et "Ma position actuelle"
  const handleUserLocation = async () => {
    try {
      showToast(getTranslation('search_my_loc_sub', currentLanguage) + '...', 'info');
      const pos = await getUserPosition();

      if (searchMapInstance) {
        if (userGpsMarker) searchMapInstance.removeLayer(userGpsMarker);

        const gpsIcon = L.divIcon({
          html: '<div class="user-gps-marker" title="Votre position"></div>',
          className: '',
          iconSize: [22, 22],
          iconAnchor: [11, 11]
        });

        userGpsMarker = L.marker([pos.lat, pos.lng], { icon: gpsIcon }).addTo(searchMapInstance);
        searchMapInstance.setView([pos.lat, pos.lng], 14, { animate: true });

        const withDistances = STORAGE_LOCATIONS_DATA.map((s) => ({
          ...s,
          distKm: distanceKm(pos.lat, pos.lng, s.lat, s.lng)
        })).sort((a, b) => a.distKm - b.distKm);

        currentSearchSpots = withDistances.slice(0, 10).map((s) => ({
          ...s,
          distance: `${s.distKm.toFixed(1)} km de vous`
        }));

        renderSpotMarkers(searchMapInstance, searchMapMarkers, currentSearchSpots[0].city, (spot) => {
          highlightSpotCard(spot.id);
          openPartnerDrawer(spot);
        });
        applySearchFiltersAndSort();

        const cityText = $('selectedCityText');
        if (cityText) cityText.textContent = getTranslation('search_my_loc_title', currentLanguage);

        setPanel(false);
        showToast('Position détectée ! Consignes les plus proches affichées.', 'success');
      }
    } catch (err) {
      showToast(geoErrorMessage(err), 'error');
    }
  };

  const btnNearMe = $('btnNearMe');
  if (btnNearMe) btnNearMe.addEventListener('click', handleUserLocation);

  const btnUseMyLocation = $('btnUseMyLocation');
  if (btnUseMyLocation) btnUseMyLocation.addEventListener('click', handleUserLocation);

  // D.18 : Bouton "Dates" ouvre le sélecteur natif
  const btnDatesPill = $('btnDatesPill');
  const searchDateInput = $('searchDateInput');
  if (btnDatesPill && searchDateInput) {
    searchDateInput.min = toInputDate();
    searchDateInput.value = selectedDate;

    btnDatesPill.addEventListener('click', () => {
      try { searchDateInput.showPicker(); } catch (_) { searchDateInput.focus(); searchDateInput.click(); }
    });

    searchDateInput.addEventListener('change', () => {
      if (searchDateInput.value) {
        selectedDate = searchDateInput.value;
        const textSpan = btnDatesPill.querySelector('span:not(.arrow-down)');
        if (textSpan) textSpan.textContent = formatShortDate(selectedDate);
        showToast(`Date de dépôt sélectionnée : ${formatShortDate(selectedDate)}`, 'info');
      }
    });
  }

  // D.19 : Filtre "Heures" (Bascule 24/7)
  const btnHoursPill = $('btnHoursPill');
  if (btnHoursPill) {
    btnHoursPill.addEventListener('click', () => {
      searchActiveFilter247 = !searchActiveFilter247;
      btnHoursPill.classList.toggle('active', searchActiveFilter247);
      const span = btnHoursPill.querySelector('span:not(.arrow-down)');
      if (span) {
        span.textContent = searchActiveFilter247
          ? getTranslation('hours_filter_247', currentLanguage)
          : getTranslation('hours_filter_all', currentLanguage);
      }
      applySearchFiltersAndSort();
      showToast(searchActiveFilter247 ? 'Filtre 24/7 activé' : 'Filtre 24/7 désactivé', 'info');
    });
  }

  // D.19 : Filtre "Avis & Prix" (Cycle: Défaut -> Note -> Prix)
  const btnPinFilterPill = $('btnPinFilterPill');
  if (btnPinFilterPill) {
    btnPinFilterPill.addEventListener('click', () => {
      if (searchSortMode === 'default') {
        searchSortMode = 'rating';
      } else if (searchSortMode === 'rating') {
        searchSortMode = 'price';
      } else {
        searchSortMode = 'default';
      }

      const span = btnPinFilterPill.querySelector('span:not(.arrow-down)');
      if (span) {
        if (searchSortMode === 'rating') span.textContent = getTranslation('sort_rating', currentLanguage);
        else if (searchSortMode === 'price') span.textContent = getTranslation('sort_price', currentLanguage);
        else span.textContent = getTranslation('sort_default', currentLanguage);
      }
      btnPinFilterPill.classList.toggle('active', searchSortMode !== 'default');
      applySearchFiltersAndSort();
    });
  }

  // A.5 : Lecture de tous les paramètres URL (city, bags, date, lat, lng)
  const urlParams = new URLSearchParams(window.location.search);
  const cityParam = urlParams.get('city');
  const bagsParam = urlParams.get('bags');
  const dateParam = urlParams.get('date');
  const latParam = urlParams.get('lat');
  const lngParam = urlParams.get('lng');

  if (bagsParam && !isNaN(Number(bagsParam))) {
    currentHeroBags = Math.min(MAX_BAGS, Math.max(1, parseInt(bagsParam, 10)));
  }
  if (dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
    selectedDate = dateParam;
    if (searchDateInput) searchDateInput.value = dateParam;
    if (btnDatesPill) {
      const span = btnDatesPill.querySelector('span:not(.arrow-down)');
      if (span) span.textContent = formatShortDate(dateParam);
    }
  }

  const initialCity = cityParam ? findCity(cityParam) : POPULAR_CITIES[0];
  initSearchMap(initialCity || POPULAR_CITIES[0]);

  if (latParam && lngParam && !isNaN(Number(latParam)) && !isNaN(Number(lngParam))) {
    const lat = parseFloat(latParam);
    const lng = parseFloat(lngParam);
    if (searchMapInstance) {
      searchMapInstance.setView([lat, lng], 14);
    }
    showCityOnSearch(initialCity || POPULAR_CITIES[0]);
  } else {
    showCityOnSearch(initialCity || POPULAR_CITIES[0]);
  }
}

/* ==========================================================================
   6. MODAL DE RÉSERVATION INTERACTIVE & GÉNÉRATION DU VRAI QR CODE
   A.2 : Restauration du formulaire HTML initial
   A.3 : modalSpotTitle sans data-i18n pour préserver le nom
   E.24 : Date de retrait et calcul jours × bagages × prix
   E.25 : Vrai QR Code généré avec QRCode.js
   ========================================================================== */
const bookingState = {
  spot: { name: '', city: '', price: DEFAULT_PRICE, type: 'Hotel' },
  bags: 2,
  days: 1
};

/**
 * Ouvre la modal de réservation pour un point de consigne spécifique
 */
function openBookingModal(spot = {}) {
  const overlay = $('bookingModal');
  const content = $('bookingModalContent');
  if (!overlay || !content) return;

  // A.2 : Restaure le formulaire initial si la modal affichait l'écran de succès
  if (initialBookingModalHTML) {
    content.innerHTML = initialBookingModalHTML;
  }

  bookingState.spot = {
    name: spot.name || 'Dar Of Luggage Partner Point',
    city: spot.city || '',
    price: Number(spot.price) || DEFAULT_PRICE,
    type: spot.type || 'Hotel'
  };
  bookingState.bags = currentHeroBags || 2;
  bookingState.days = 1;

  // A.3 : Affecte directement le nom du spot sans écrasement par i18n
  const titleEl = $('modalSpotTitle');
  if (titleEl) {
    titleEl.textContent = bookingState.spot.name;
    titleEl.removeAttribute('data-i18n'); // Sécurité pour empêcher l'écrasement
  }

  const typeEl = $('modalSpotType');
  if (typeEl) typeEl.textContent = bookingState.spot.type;

  const locEl = $('modalSpotLocation');
  if (locEl) {
    locEl.textContent = `${bookingState.spot.city ? bookingState.spot.city + ' • ' : ''}${getTranslation('modal_verified_tag', currentLanguage)}`;
  }

  // Initialisation des dates de dépôt et de retrait (E.24)
  const dropInput = $('bookingDropDate');
  const pickupInput = $('bookingPickupDate');
  const today = toInputDate();

  if (dropInput) {
    dropInput.min = today;
    dropInput.value = selectedDate || today;
    dropInput.addEventListener('change', calculateDaysAndPrice);
  }

  if (pickupInput) {
    pickupInput.min = selectedDate || today;
    pickupInput.value = selectedPickupDate || selectedDate || today;
    pickupInput.addEventListener('change', calculateDaysAndPrice);
  }

  calculateDaysAndPrice();
  overlay.classList.add('open');
}

/**
 * E.24 : Calcule le nombre de jours entre le dépôt et le retrait et met à jour le montant
 */
function calculateDaysAndPrice() {
  const dropInput = $('bookingDropDate');
  const pickupInput = $('bookingPickupDate');

  if (dropInput && pickupInput) {
    const dropDate = new Date(dropInput.value || toInputDate());
    const pickupDate = new Date(pickupInput.value || dropInput.value || toInputDate());

    // Si la date de retrait est antérieure, l'aligner sur la date de dépôt
    if (pickupDate < dropDate) {
      pickupInput.value = dropInput.value;
    }

    const diffTime = Math.max(0, new Date(pickupInput.value) - new Date(dropInput.value));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Au moins 1 jour
    bookingState.days = Math.max(1, diffDays);
  }

  updateBookingPrice();
}

/**
 * Met à jour les libellés de prix dans la modal
 */
function updateBookingPrice() {
  const totalVal = bookingState.spot.price * bookingState.bags * bookingState.days;
  const formatted = formatPrice(totalVal);

  const subtotalEl = $('modalPriceSubtotal');
  if (subtotalEl) {
    const daysLabel = bookingState.days > 1 ? `${bookingState.days} jours` : `1 jour`;
    subtotalEl.textContent = `${formatted} (${bookingState.bags} bagages × ${daysLabel})`;
  }

  const totalEl = $('modalPriceTotal');
  if (totalEl) totalEl.textContent = formatted;

  const submitEl = $('modalSubmitPrice');
  if (submitEl) submitEl.textContent = formatted;

  const countEl = $('modalBagCountDisplay');
  if (countEl) countEl.textContent = bookingState.bags;
}

/**
 * Initialise les écouteurs de la modal de réservation
 */
function initBookingModal() {
  const overlay = $('bookingModal');
  const content = $('bookingModalContent');
  if (!overlay || !content) return;

  // A.2 : Mémorisation du gabarit HTML initial du formulaire
  initialBookingModalHTML = content.innerHTML;

  const close = () => overlay.classList.remove('open');
  const closeBtn = $('closeBookingModal');
  if (closeBtn) closeBtn.addEventListener('click', close);

  // H.35 : Fermeture au clic sur le fond
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  // H.35 : Fermeture avec la touche Échap
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });

  // Délégation d'événements pour les boutons du formulaire
  content.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;

    if (btn.id === 'bagCountMinus' && bookingState.bags > 1) {
      bookingState.bags--;
      updateBookingPrice();
    } else if (btn.id === 'bagCountPlus' && bookingState.bags < MAX_BAGS) {
      bookingState.bags++;
      updateBookingPrice();
    } else if (btn.dataset.action === 'done') {
      close();
    }
  });

  content.addEventListener('submit', (e) => {
    if (e.target.id === 'bookingModalForm') {
      e.preventDefault();
      confirmBooking();
    }
  });
}

/**
 * Confirmation de réservation & génération du vrai QR Code (E.25)
 */
function confirmBooking() {
  const content = $('bookingModalContent');
  const nameInput = $('bookingCustomerName');
  const emailInput = $('bookingCustomerEmail');
  const dropInput = $('bookingDropDate');
  const pickupInput = $('bookingPickupDate');

  const name = nameInput ? nameInput.value.trim() : '';
  const email = emailInput ? emailInput.value.trim() : '';
  const dropDate = dropInput ? dropInput.value : toInputDate();
  const pickupDate = pickupInput ? pickupInput.value : dropDate;

  if (name.length < 2) {
    return showToast(getTranslation('err_name_required', currentLanguage), 'error');
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return showToast(getTranslation('err_email_invalid', currentLanguage), 'error');
  }

  const ref = `DL-${Math.floor(100000 + Math.random() * 900000)}`;
  const totalVal = bookingState.spot.price * bookingState.bags * bookingState.days;
  const totalFormatted = formatPrice(totalVal);

  // Enregistrement dans localStorage
  try {
    const saved = JSON.parse(localStorage.getItem('dar_bookings') || '[]');
    saved.unshift({
      ref,
      spotName: bookingState.spot.name,
      city: bookingState.spot.city,
      bags: bookingState.bags,
      days: bookingState.days,
      dropDate,
      pickupDate,
      name,
      email,
      total: totalFormatted,
      createdAt: new Date().toISOString()
    });
    localStorage.setItem('dar_bookings', JSON.stringify(saved));
  } catch (err) {
    console.error('Erreur sauvegarde réservation :', err);
  }

  // Écran de confirmation avec vrai QR Code
  content.innerHTML = `
    <div style="text-align: center; padding: 12px 4px;">
      <div style="width: 58px; height: 58px; border-radius: 50%; background: var(--gold-tint); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" style="stroke: var(--gold)" stroke-width="3">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>
      <span class="spot-type-tag">REF : #${ref}</span>
      <h3 style="font-size: 1.55rem; font-weight: 900; color: var(--text); margin: 12px 0 6px;">
        ${getTranslation('booking_confirmed_title', currentLanguage)}
      </h3>
      <p style="font-size: 0.9rem; color: var(--muted);">
        ${escapeHTML(name)}, ${getTranslation('booking_pass_ready_prefix', currentLanguage)} <strong>${escapeHTML(bookingState.spot.name)}</strong> ${getTranslation('booking_pass_ready_suffix', currentLanguage)}
      </p>

      <div style="margin: 20px 0; padding: 18px; background: var(--navy-dark); border-radius: 14px; border: 1px dashed var(--border-gold-hover);">
        <!-- E.25 : Conteneur du vrai QR Code -->
        <div id="qrcodeBox"></div>
        <div style="font-size: 0.95rem; font-weight: 800; color: var(--text); margin-top: 8px;">
          #${ref} • ${bookingState.bags} bagages (${totalFormatted})
        </div>
        <div style="font-size: 0.82rem; color: var(--muted); margin-top: 4px;">
          ${dropDate} → ${pickupDate} (${bookingState.days} ${bookingState.days > 1 ? 'jours' : 'jour'})
        </div>
        <div style="font-size: 0.82rem; color: var(--gold); font-weight: 700; margin-top: 6px;">
          ✓ Garantie 100 000 DH &amp; Scellés inclus
        </div>
      </div>

      <button type="button" class="btn-primary" data-action="done" style="width: 100%; justify-content: center; padding: 14px;">
        ${getTranslation('booking_done_btn', currentLanguage)}
      </button>
    </div>`;

  // E.25 : Génération du vrai QR Code contenant les données du pass
  const qrTarget = document.getElementById('qrcodeBox');
  if (qrTarget) {
    const qrData = `DAR-PASS:${ref}|${name}|${bookingState.spot.name}|${bookingState.bags}B|${totalFormatted}`;
    if (typeof QRCode !== 'undefined') {
      try {
        new QRCode(qrTarget, {
          text: qrData,
          width: 128,
          height: 128,
          colorDark: '#0A1128',
          colorLight: '#FFFFFF',
          correctLevel: QRCode.CorrectLevel.M
        });
      } catch (_) {
        renderFallbackQR(qrTarget, ref);
      }
    } else {
      renderFallbackQR(qrTarget, ref);
    }
  }

  showToast(`Réservation #${ref} confirmée !`, 'success');
}

function renderFallbackQR(container, ref) {
  container.innerHTML = `
    <img src="https://api.qrserver.com/v1/create-qr-code/?size=128x128&data=DAR-LUGGAGE-${ref}"
         alt="QR Code Pass #${ref}"
         style="width:128px;height:128px;border-radius:8px;display:block;margin:0 auto;" />`;
}

/* ==========================================================================
   7. PAGE DE CONNEXION (login.html) & VALIDATION STRICTE
   B.6 : Validation e-mail & mot de passe min 6 caractères avec .form-error
   B.8 : Boutons Google / Apple avec toast
   B.9 : Déconnexion quand l'utilisateur est connecté
   ========================================================================== */
function initAuthForm() {
  const form = $('loginForm');
  const googleBtn = $('loginGoogleBtn');
  const appleBtn = $('loginAppleBtn');

  // B.8 : Toast académique pour les boutons sociaux
  const showSocialDemoToast = () => {
    showToast(getTranslation('toast_demo_social', currentLanguage), 'info');
  };
  if (googleBtn) googleBtn.addEventListener('click', showSocialDemoToast);
  if (appleBtn) appleBtn.addEventListener('click', showSocialDemoToast);

  // B.9 : Affichage de l'état connecté et bouton de déconnexion
  renderAuthPageUserState();

  if (form) {
    const emailGroup = $('loginEmail')?.closest('.form-group');
    const passGroup = $('loginPassword')?.closest('.form-group');
    const emailInput = $('loginEmail');
    const passInput = $('loginPassword');

    // Retrait de la classe .invalid dès la saisie
    if (emailInput && emailGroup) {
      emailInput.addEventListener('input', () => emailGroup.classList.remove('invalid'));
    }
    if (passInput && passGroup) {
      passInput.addEventListener('input', () => passGroup.classList.remove('invalid'));
    }

    // B.6 : Validation lors de la soumission
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      const emailVal = emailInput ? emailInput.value.trim() : '';
      const passVal = passInput ? passInput.value : '';

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailVal)) {
        if (emailGroup) emailGroup.classList.add('invalid');
        isValid = false;
      }

      if (passVal.length < 6) {
        if (passGroup) passGroup.classList.add('invalid');
        isValid = false;
      }

      if (!isValid) return;

      // Connexion réussie
      const userData = {
        name: emailVal.split('@')[0],
        email: emailVal,
        connectedAt: new Date().toISOString()
      };
      localStorage.setItem('dar_user', JSON.stringify(userData));
      showToast(getTranslation('toast_logged_in', currentLanguage), 'success');

      renderUserBadge();
      renderAuthPageUserState();

      setTimeout(() => {
        window.location.href = 'index.html';
      }, 700);
    });
  }
}

/**
 * B.9 : Affiche un panneau utilisateur connecté avec bouton de déconnexion
 */
function renderAuthPageUserState() {
  const form = $('loginForm');
  const socialBox = document.querySelector('.social-auth-buttons');
  const divider = document.querySelector('.divider');
  if (!form) return;

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('dar_user'));
  } catch (_) {}

  let userBox = $('authUserConnectedBox');

  if (user) {
    // Si l'utilisateur est déjà connecté, afficher son profil et le bouton de déconnexion
    if (form) form.style.display = 'none';
    if (socialBox) socialBox.style.display = 'none';
    if (divider) divider.style.display = 'none';

    if (!userBox) {
      userBox = document.createElement('div');
      userBox.id = 'authUserConnectedBox';
      userBox.className = 'user-profile-card';
      form.parentNode.insertBefore(userBox, form);
    }

    userBox.innerHTML = `
      <div style="width: 52px; height: 52px; border-radius: 50%; background: var(--gold-tint); color: var(--gold); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.2rem; margin: 0 auto 10px;">
        ${escapeHTML(user.name.slice(0, 2).toUpperCase())}
      </div>
      <h3 style="font-size: 1.1rem; font-weight: 800; color: var(--text);">${getTranslation('auth_logged_as', currentLanguage)}</h3>
      <p style="font-size: 0.9rem; color: var(--gold); font-weight: 700; margin-top: 2px;">${escapeHTML(user.email)}</p>
      <button type="button" id="btnLogoutUser" class="btn-logout">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
        <span>${getTranslation('auth_logout', currentLanguage)}</span>
      </button>
    `;

    const logoutBtn = $('btnLogoutUser');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('dar_user');
        showToast(getTranslation('toast_logged_out', currentLanguage), 'info');
        renderUserBadge();
        renderAuthPageUserState();
      });
    }
  } else {
    // Si l'utilisateur est déconnecté, rétablir le formulaire
    if (userBox) userBox.remove();
    if (form) form.style.display = 'flex';
    if (socialBox) socialBox.style.display = 'flex';
    if (divider) divider.style.display = 'flex';
  }
}

/**
 * Affiche l'indicateur de compte dans la barre de navigation
 */
function renderUserBadge() {
  const btn = $('navUserBtn');
  if (!btn) return;
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('dar_user'));
  } catch (_) {}

  if (!user) {
    btn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
      <span class="nav-btn-text desktop-only" data-i18n="nav_sign_in">${getTranslation('nav_sign_in', currentLanguage)}</span>`;
    return;
  }

  btn.innerHTML = `
    <span class="user-status-dot"></span>
    <span class="nav-btn-text desktop-only">${getTranslation('user_greeting', currentLanguage)} ${escapeHTML(user.name)}</span>`;
}

/* ==========================================================================
   8. COMPOSANTS D'ACCUEIL : ACCORDÉONS & SLIDER AVIS (H.34)
   ========================================================================== */
function initBenefitsAccordions() {
  document.querySelectorAll('.accordion-card').forEach((card) => {
    const header = card.querySelector('.accordion-header');
    if (header) {
      header.addEventListener('click', () => {
        const isOpen = card.classList.contains('active');
        document.querySelectorAll('.accordion-card').forEach((c) => c.classList.remove('active'));
        if (!isOpen) card.classList.add('active');
      });
    }
  });
}

/**
 * H.34 : Slider d'avis robuste empêchant tout défilement excessif
 * et recalculant le nombre d'avis visibles lors du redimensionnement d'écran
 */
function initTestimonialsSlider() {
  const track = document.getElementById('testimonialsTrack');
  const prevBtn = document.getElementById('prevReviewBtn');
  const nextBtn = document.getElementById('nextReviewBtn');
  if (!track || !prevBtn || !nextBtn) return;

  let currentIndex = 0;
  const cards = track.querySelectorAll('.testimonial-card');

  const getVisibleCardsCount = () => {
    const w = window.innerWidth;
    if (w <= 768) return 1;
    if (w <= 1024) return 2;
    return 3;
  };

  const updateSlider = () => {
    if (cards.length === 0) return;
    const visibleCards = getVisibleCardsCount();
    const maxIndex = Math.max(0, cards.length - visibleCards);

    // Sécurité pour ne jamais dépasser le dernier avis visible
    currentIndex = Math.min(currentIndex, maxIndex);

    const cardWidth = cards[0].offsetWidth + 24; // Largeur de la carte + espacement gap
    track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;

    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex >= maxIndex;
  };

  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateSlider();
    }
  });

  nextBtn.addEventListener('click', () => {
    const maxIndex = Math.max(0, cards.length - getVisibleCardsCount());
    if (currentIndex < maxIndex) {
      currentIndex++;
      updateSlider();
    }
  });

  // H.34 : Recalcul automatique au redimensionnement de l'écran
  window.addEventListener('resize', updateSlider);
  updateSlider();
}

function initMobileMenu() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const mobileNav = document.getElementById('mobileNav');
  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', () => mobileNav.classList.toggle('open'));
  }
}

/* ==========================================================================
   9. DÉMARRAGE DE L'APPLICATION
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initLanguageSelector();
  initMobileMenu();
  initBookingModal();
  initAuthForm();
  renderUserBadge();
  initHomePage();
  initSearchPage();
  initBenefitsAccordions();
  initTestimonialsSlider();
});
