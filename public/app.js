const $ = (id) => document.getElementById(id);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const translations = {
  en: {
    home: 'Home', shop: 'Shop', wallet: 'Wallet', support: 'Support', premiumMarket: 'Premium digital marketplace',
    heroTitle: 'Digital products.<br><em>Delivered with confidence.</em>', heroText: 'Browse trusted subscriptions, pay securely, and track every purchase from one polished dashboard.',
    exploreProducts: 'Explore products', addFunds: 'Add funds', liveStock: 'Live stock', verifiedPayments: 'Verified payments', sharedDatabase: 'Shared database',
    yourWallet: 'Your wallet', secured: 'Secured', walletHint: 'Verified payments are credited automatically. Manual payments appear after admin approval.',
    orders: 'Orders', payments: 'Payments', fastCheckout: 'Fast checkout', fastCheckoutText: 'Atomic stock and wallet updates prevent duplicate or invalid orders.',
    adminVisibility: 'Admin visibility', adminVisibilityText: 'Every user order, payment and message is stored in Cloudflare D1.', secureSessions: 'Secure sessions',
    secureSessionsText: 'Signed HttpOnly cookies protect user and admin sessions.', featured: 'Featured', popularProducts: 'Popular products', viewAll: 'View all', marketplace: 'Marketplace',
    chooseProduct: 'Choose your next premium product', chooseProductText: 'Search the catalog, check live stock, and purchase instantly using your wallet.', searchProducts: 'Search products',
    allCategories: 'All categories', walletCenter: 'Wallet center', manageFunds: 'Manage funds securely', manageFundsText: 'Use verified online payment or submit a manual transaction for approval.',
    availableBalance: 'Available balance', autoPayment: 'Auto payment', manualPayment: 'Manual payment', amount: 'Amount', fullName: 'Full name', email: 'Email', phone: 'Phone',
    continuePayment: 'Continue to secure payment', paymentNumber: 'Payment number', method: 'Method', transactionId: 'Transaction ID', submitForReview: 'Submit for review',
    recentActivity: 'Recent activity', walletHistory: 'Wallet history', paymentHistory: 'Payment history', orderHistory: 'Order history', supportCenter: 'Support center',
    needHelp: 'Need help with an order?', needHelpText: 'Send a message from your secure session or contact the store directly.', sendMessage: 'Send a message', topic: 'Topic', message: 'Message',
    sendToAdmin: 'Send to admin', chatNow: 'Chat now', openTelegram: 'Open Telegram', securityNotice: 'Security notice', securityNoticeText: 'Never share your OTP, PIN, card password or admin credentials with anyone.',
    controlCenter: 'Control center', adminDashboard: 'Admin dashboard', refresh: 'Refresh', logout: 'Logout', products: 'Products', users: 'Users', pending: 'Pending', activeCatalog: 'Active catalog',
    secureSessionsLabel: 'Secure sessions', allPurchases: 'All purchases', paymentReviews: 'Payment reviews', walletLiability: 'Wallet liability', userBalances: 'User balances', overview: 'Overview', messages: 'Messages', settings: 'Settings',
    recentOrders: 'Recent orders', recentPayments: 'Recent payments', auditLog: 'Audit log', productManagement: 'Product management', productManagementText: 'Add, edit, feature, reorder or hide products.', addProduct: 'Add product',
    orderManagement: 'Order management', paymentManagement: 'Payment management', manualDeposits: 'Manual deposits', automaticPayments: 'Automatic payments', userWallets: 'User wallets', customerMessages: 'Customer messages',
    storeSettings: 'Store settings', storeName: 'Store name', tagline: 'Tagline', currency: 'Currency', supportEmail: 'Support email', announcement: 'Announcement', paymentInstructions: 'Payment instructions',
    enableManual: 'Enable manual payments', enableAuto: 'Enable auto payments', maintenanceMode: 'Maintenance mode', saveSettings: 'Save settings', footerText: 'Secure digital commerce on Cloudflare',
    noProducts: 'No products found.', noActivity: 'No activity yet.', noOrders: 'No orders yet.', noPayments: 'No payments yet.', noMessages: 'No messages yet.', buyNow: 'Buy now', soldOut: 'Sold out', left: 'left',
    category: 'Category', price: 'Price', stock: 'Stock', status: 'Status', actions: 'Actions', name: 'Name', description: 'Description', icon: 'Icon', featuredLabel: 'Featured', active: 'Active', hidden: 'Hidden',
    edit: 'Edit', hide: 'Hide', approve: 'Approve', reject: 'Reject', adjust: 'Adjust', save: 'Save', cancel: 'Cancel', quantity: 'Quantity', noteOptional: 'Note (optional)', confirmPurchase: 'Confirm purchase',
    telegramId: 'Telegram ID / username', whatsappNumber: 'WhatsApp number', contactRequired: 'Enter at least one contact method so the product can be delivered.', contactSupportDelivery: 'Please message us on Telegram or WhatsApp to receive your product.', orderNumber: 'Order number', messageTelegram: 'Message on Telegram', messageWhatsapp: 'Message on WhatsApp', copyOrderMessage: 'Copy order message',
    orderNotReceived: 'Order not received?', getOrderSupport: 'Get delivery support', supportAdmin: 'Support Admin', supportGroup: 'Support Group', whatsappGroup: 'WhatsApp Group', joinWhatsappGroup: 'Join WhatsApp Group', getSupport: 'Get support', orderHelp: 'Order help', sendOrderId: 'Send your Order ID', communitySupport: 'Community support', askForHelp: 'Ask for order help', joinUpdates: 'Join for updates and support', copySupportMessage: 'Copy support message',
    purchaseTitle: 'Complete purchase', productSaved: 'Product saved.', productHidden: 'Product hidden.', purchaseCompleted: 'Purchase completed.', depositSubmitted: 'Payment submitted for review.', messageSent: 'Message sent to admin.',
    settingsSaved: 'Settings saved.', adminLogin: 'Admin login', password: 'Password', login: 'Login', gatewayReady: 'Secure gateway is ready.', gatewayDisabled: 'Automatic payment is disabled or not configured.',
    sandboxMode: 'Sandbox mode', liveMode: 'Live mode', paymentRedirect: 'Redirecting to secure payment…', adjustmentTitle: 'Adjust wallet', adjustmentReason: 'Reason', adjustmentAmount: 'Amount (+ credit / - debit)',
    user: 'User', created: 'Created', updated: 'Updated', revenue: 'Revenue', funded: 'Funded', gateway: 'Gateway', export: 'Export', loading: 'Loading…'
  },
  bn: {
    home: 'হোম', shop: 'শপ', wallet: 'ওয়ালেট', support: 'সাপোর্ট', premiumMarket: 'প্রিমিয়াম ডিজিটাল মার্কেটপ্লেস',
    heroTitle: 'ডিজিটাল পণ্য।<br><em>বিশ্বাসের সাথে ডেলিভারি।</em>', heroText: 'বিশ্বস্ত সাবস্ক্রিপশন কিনুন, নিরাপদে পেমেন্ট করুন এবং এক ড্যাশবোর্ডে সব অর্ডার দেখুন।',
    exploreProducts: 'প্রোডাক্ট দেখুন', addFunds: 'ব্যালেন্স যোগ করুন', liveStock: 'লাইভ স্টক', verifiedPayments: 'ভেরিফাইড পেমেন্ট', sharedDatabase: 'শেয়ারড ডাটাবেস',
    yourWallet: 'আপনার ওয়ালেট', secured: 'সুরক্ষিত', walletHint: 'ভেরিফাইড অটো পেমেন্ট সঙ্গে সঙ্গে যোগ হবে। ম্যানুয়াল পেমেন্ট admin অনুমোদনের পর যোগ হবে।', orders: 'অর্ডার', payments: 'পেমেন্ট',
    fastCheckout: 'দ্রুত চেকআউট', fastCheckoutText: 'Atomic stock ও wallet update ভুল বা duplicate order বন্ধ করে।', adminVisibility: 'Admin visibility', adminVisibilityText: 'সব user-এর order, payment ও message Cloudflare D1-এ থাকে।',
    secureSessions: 'নিরাপদ সেশন', secureSessionsText: 'Signed HttpOnly cookie user ও admin session সুরক্ষিত রাখে।', featured: 'ফিচার্ড', popularProducts: 'জনপ্রিয় প্রোডাক্ট', viewAll: 'সব দেখুন', marketplace: 'মার্কেটপ্লেস',
    chooseProduct: 'আপনার পছন্দের প্রিমিয়াম প্রোডাক্ট নিন', chooseProductText: 'প্রোডাক্ট খুঁজুন, লাইভ স্টক দেখুন এবং wallet দিয়ে কিনুন।', searchProducts: 'প্রোডাক্ট খুঁজুন', allCategories: 'সব ক্যাটাগরি',
    walletCenter: 'ওয়ালেট সেন্টার', manageFunds: 'নিরাপদে ব্যালেন্স ম্যানেজ করুন', manageFundsText: 'ভেরিফাইড online payment অথবা manual transaction submit করুন।', availableBalance: 'বর্তমান ব্যালেন্স',
    autoPayment: 'অটো পেমেন্ট', manualPayment: 'ম্যানুয়াল পেমেন্ট', amount: 'পরিমাণ', fullName: 'পূর্ণ নাম', email: 'ইমেইল', phone: 'ফোন', continuePayment: 'নিরাপদ পেমেন্টে যান', paymentNumber: 'পেমেন্ট নম্বর',
    method: 'মেথড', transactionId: 'ট্রানজেকশন আইডি', submitForReview: 'রিভিউয়ের জন্য পাঠান', recentActivity: 'সাম্প্রতিক কার্যক্রম', walletHistory: 'ওয়ালেট হিস্ট্রি', paymentHistory: 'পেমেন্ট হিস্ট্রি', orderHistory: 'অর্ডার হিস্ট্রি',
    supportCenter: 'সাপোর্ট সেন্টার', needHelp: 'অর্ডার নিয়ে সাহায্য দরকার?', needHelpText: 'নিরাপদ session থেকে message পাঠান অথবা সরাসরি যোগাযোগ করুন।', sendMessage: 'মেসেজ পাঠান', topic: 'বিষয়', message: 'মেসেজ', sendToAdmin: 'Admin-কে পাঠান',
    chatNow: 'এখন চ্যাট করুন', openTelegram: 'Telegram খুলুন', securityNotice: 'নিরাপত্তা সতর্কতা', securityNoticeText: 'OTP, PIN, card password বা admin credential কাউকে দেবেন না।', controlCenter: 'কন্ট্রোল সেন্টার', adminDashboard: 'Admin Dashboard',
    refresh: 'রিফ্রেশ', logout: 'লগআউট', products: 'প্রোডাক্ট', users: 'ইউজার', pending: 'পেন্ডিং', activeCatalog: 'Active catalog', secureSessionsLabel: 'Secure session', allPurchases: 'সব ক্রয়', paymentReviews: 'Payment review',
    walletLiability: 'মোট user balance', userBalances: 'User wallet', overview: 'ওভারভিউ', messages: 'মেসেজ', settings: 'সেটিংস', recentOrders: 'সাম্প্রতিক অর্ডার', recentPayments: 'সাম্প্রতিক পেমেন্ট', auditLog: 'অডিট লগ',
    productManagement: 'প্রোডাক্ট ম্যানেজমেন্ট', productManagementText: 'প্রোডাক্ট add, edit, feature, reorder বা hide করুন।', addProduct: 'প্রোডাক্ট যোগ করুন', orderManagement: 'অর্ডার ম্যানেজমেন্ট', paymentManagement: 'পেমেন্ট ম্যানেজমেন্ট',
    manualDeposits: 'ম্যানুয়াল ডিপোজিট', automaticPayments: 'অটোমেটিক পেমেন্ট', userWallets: 'ইউজার ওয়ালেট', customerMessages: 'কাস্টমার মেসেজ', storeSettings: 'স্টোর সেটিংস', storeName: 'স্টোর নাম', tagline: 'ট্যাগলাইন', currency: 'কারেন্সি',
    supportEmail: 'সাপোর্ট ইমেইল', announcement: 'ঘোষণা', paymentInstructions: 'পেমেন্ট নির্দেশনা', enableManual: 'ম্যানুয়াল পেমেন্ট চালু', enableAuto: 'অটো পেমেন্ট চালু', maintenanceMode: 'মেইনটেন্যান্স মোড', saveSettings: 'সেটিংস সেভ করুন',
    footerText: 'Cloudflare-এ নিরাপদ ডিজিটাল কমার্স', noProducts: 'কোনো প্রোডাক্ট পাওয়া যায়নি।', noActivity: 'এখনো কোনো কার্যক্রম নেই।', noOrders: 'এখনো কোনো অর্ডার নেই।', noPayments: 'এখনো কোনো পেমেন্ট নেই।', noMessages: 'কোনো মেসেজ নেই।',
    buyNow: 'এখন কিনুন', soldOut: 'স্টক শেষ', left: 'বাকি', category: 'ক্যাটাগরি', price: 'দাম', stock: 'স্টক', status: 'স্ট্যাটাস', actions: 'অ্যাকশন', name: 'নাম', description: 'বর্ণনা', icon: 'আইকন', featuredLabel: 'ফিচার্ড', active: 'Active', hidden: 'Hidden',
    edit: 'এডিট', hide: 'হাইড', approve: 'অনুমোদন', reject: 'বাতিল', adjust: 'ব্যালেন্স', save: 'সেভ', cancel: 'বাতিল', quantity: 'পরিমাণ', noteOptional: 'নোট (ঐচ্ছিক)', confirmPurchase: 'কেনা নিশ্চিত করুন',
    telegramId: 'Telegram ID / Username', whatsappNumber: 'WhatsApp নম্বর', contactRequired: 'প্রোডাক্ট ডেলিভারির জন্য Telegram ID অথবা WhatsApp নম্বরের অন্তত একটি দিন।', contactSupportDelivery: 'দয়া করে প্রোডাক্ট পেতে Telegram অথবা WhatsApp-এ মেসেজ দিন।', orderNumber: 'অর্ডার নম্বর', messageTelegram: 'Telegram-এ মেসেজ দিন', messageWhatsapp: 'WhatsApp-এ মেসেজ দিন', copyOrderMessage: 'অর্ডার মেসেজ কপি করুন',
    orderNotReceived: 'অর্ডার করে প্রোডাক্ট পাননি?', getOrderSupport: 'ডেলিভারি সাপোর্ট নিন', supportAdmin: 'সাপোর্ট অ্যাডমিন', supportGroup: 'সাপোর্ট গ্রুপ', whatsappGroup: 'WhatsApp গ্রুপ', joinWhatsappGroup: 'WhatsApp গ্রুপে যোগ দিন', getSupport: 'সাপোর্ট নিন', orderHelp: 'অর্ডার সহায়তা', sendOrderId: 'আপনার Order ID পাঠান', communitySupport: 'কমিউনিটি সাপোর্ট', askForHelp: 'অর্ডারের সাহায্য নিন', joinUpdates: 'আপডেট ও সাপোর্টের জন্য যোগ দিন', copySupportMessage: 'সাপোর্ট মেসেজ কপি করুন', purchaseTitle: 'ক্রয় সম্পন্ন করুন',
    purchaseCompleted: 'ক্রয় সফল হয়েছে।', depositSubmitted: 'পেমেন্ট review-এর জন্য পাঠানো হয়েছে।', messageSent: 'Admin-কে message পাঠানো হয়েছে।', settingsSaved: 'সেটিংস সেভ হয়েছে।', adminLogin: 'Admin Login', password: 'পাসওয়ার্ড', login: 'লগইন',
    gatewayReady: 'Secure payment gateway প্রস্তুত।', gatewayDisabled: 'অটো পেমেন্ট বন্ধ অথবা configure করা নেই।', sandboxMode: 'Sandbox mode', liveMode: 'Live mode', paymentRedirect: 'Secure payment-এ নেওয়া হচ্ছে…', adjustmentTitle: 'ওয়ালেট ব্যালেন্স পরিবর্তন', adjustmentReason: 'কারণ', adjustmentAmount: 'পরিমাণ (+ যোগ / - বিয়োগ)'
  },
  ar: {
    home: 'الرئيسية', shop: 'المتجر', wallet: 'المحفظة', support: 'الدعم', premiumMarket: 'سوق رقمي مميز', heroTitle: 'منتجات رقمية.<br><em>تسليم بثقة.</em>',
    heroText: 'تصفح الاشتراكات الموثوقة وادفع بأمان وتابع جميع مشترياتك.', exploreProducts: 'استكشف المنتجات', addFunds: 'إضافة رصيد', yourWallet: 'محفظتك', secured: 'آمن', orders: 'الطلبات', payments: 'المدفوعات',
    featured: 'مميز', popularProducts: 'منتجات شائعة', viewAll: 'عرض الكل', marketplace: 'السوق', chooseProduct: 'اختر منتجك المميز', searchProducts: 'ابحث عن المنتجات', allCategories: 'كل الفئات', walletCenter: 'مركز المحفظة',
    manageFunds: 'إدارة الرصيد بأمان', availableBalance: 'الرصيد المتاح', autoPayment: 'دفع تلقائي', manualPayment: 'دفع يدوي', amount: 'المبلغ', fullName: 'الاسم الكامل', email: 'البريد الإلكتروني', phone: 'الهاتف',
    continuePayment: 'متابعة الدفع الآمن', paymentNumber: 'رقم الدفع', method: 'الطريقة', transactionId: 'رقم المعاملة', submitForReview: 'إرسال للمراجعة', paymentHistory: 'سجل المدفوعات', orderHistory: 'سجل الطلبات',
    supportCenter: 'مركز الدعم', needHelp: 'هل تحتاج مساعدة؟', sendMessage: 'إرسال رسالة', topic: 'الموضوع', message: 'الرسالة', sendToAdmin: 'إرسال إلى الإدارة', controlCenter: 'مركز التحكم', adminDashboard: 'لوحة الإدارة',
    refresh: 'تحديث', logout: 'تسجيل الخروج', products: 'المنتجات', users: 'المستخدمون', pending: 'قيد الانتظار', overview: 'نظرة عامة', messages: 'الرسائل', settings: 'الإعدادات', addProduct: 'إضافة منتج', saveSettings: 'حفظ الإعدادات',
    buyNow: 'اشتر الآن', soldOut: 'نفد المخزون', noProducts: 'لا توجد منتجات.', noOrders: 'لا توجد طلبات.', noPayments: 'لا توجد مدفوعات.', noActivity: 'لا يوجد نشاط.', noMessages: 'لا توجد رسائل.',
    edit: 'تعديل', hide: 'إخفاء', approve: 'موافقة', reject: 'رفض', adjust: 'تعديل', save: 'حفظ', cancel: 'إلغاء', quantity: 'الكمية', confirmPurchase: 'تأكيد الشراء', adminLogin: 'دخول الإدارة', password: 'كلمة المرور', login: 'دخول'
  },
  hi: {
    home: 'होम', shop: 'शॉप', wallet: 'वॉलेट', support: 'सपोर्ट', premiumMarket: 'प्रीमियम डिजिटल मार्केटप्लेस', heroTitle: 'डिजिटल प्रोडक्ट्स।<br><em>भरोसे के साथ डिलीवरी।</em>',
    heroText: 'विश्वसनीय सब्सक्रिप्शन खरीदें, सुरक्षित भुगतान करें और सभी ऑर्डर ट्रैक करें।', exploreProducts: 'प्रोडक्ट देखें', addFunds: 'फंड जोड़ें', yourWallet: 'आपका वॉलेट', secured: 'सुरक्षित', orders: 'ऑर्डर', payments: 'पेमेंट',
    featured: 'फीचर्ड', popularProducts: 'लोकप्रिय प्रोडक्ट', viewAll: 'सभी देखें', marketplace: 'मार्केटप्लेस', chooseProduct: 'अपना प्रीमियम प्रोडक्ट चुनें', searchProducts: 'प्रोडक्ट खोजें', allCategories: 'सभी कैटेगरी',
    walletCenter: 'वॉलेट सेंटर', manageFunds: 'फंड सुरक्षित रूप से मैनेज करें', availableBalance: 'उपलब्ध बैलेंस', autoPayment: 'ऑटो पेमेंट', manualPayment: 'मैनुअल पेमेंट', amount: 'राशि', fullName: 'पूरा नाम', email: 'ईमेल', phone: 'फोन',
    continuePayment: 'सुरक्षित भुगतान जारी रखें', paymentNumber: 'पेमेंट नंबर', method: 'तरीका', transactionId: 'ट्रांजैक्शन आईडी', submitForReview: 'रिव्यू के लिए भेजें', paymentHistory: 'पेमेंट हिस्ट्री', orderHistory: 'ऑर्डर हिस्ट्री',
    supportCenter: 'सपोर्ट सेंटर', needHelp: 'ऑर्डर में मदद चाहिए?', sendMessage: 'मैसेज भेजें', topic: 'विषय', message: 'मैसेज', sendToAdmin: 'एडमिन को भेजें', controlCenter: 'कंट्रोल सेंटर', adminDashboard: 'एडमिन डैशबोर्ड',
    refresh: 'रिफ्रेश', logout: 'लॉगआउट', products: 'प्रोडक्ट', users: 'यूज़र', pending: 'पेंडिंग', overview: 'ओवरव्यू', messages: 'मैसेज', settings: 'सेटिंग्स', addProduct: 'प्रोडक्ट जोड़ें', saveSettings: 'सेटिंग्स सेव करें',
    buyNow: 'अभी खरीदें', soldOut: 'स्टॉक खत्म', noProducts: 'कोई प्रोडक्ट नहीं मिला।', noOrders: 'कोई ऑर्डर नहीं।', noPayments: 'कोई पेमेंट नहीं।', noActivity: 'अभी कोई गतिविधि नहीं।', noMessages: 'कोई मैसेज नहीं।',
    edit: 'एडिट', hide: 'हाइड', approve: 'अप्रूव', reject: 'रिजेक्ट', adjust: 'एडजस्ट', save: 'सेव', cancel: 'कैंसल', quantity: 'मात्रा', confirmPurchase: 'खरीद की पुष्टि करें', adminLogin: 'एडमिन लॉगिन', password: 'पासवर्ड', login: 'लॉगिन'
  }
};

let language = localStorage.getItem('sarour_language') || 'bn';
let state = {
  user: { id: '', balance: 0 }, products: [], payment_methods: [], homepage_cards: [], deposits: [], payments: [], orders: [], ledger: [], settings: {}, payment: {}
};
let adminState = null;
let currentRoute = 'home';
const ADMIN_TOKEN_KEY = 'sarour_admin_session';
let toastTimer;
let lastOrderContactMessage = '';

function adminToken() {
  try { return sessionStorage.getItem(ADMIN_TOKEN_KEY) || ''; }
  catch { return ''; }
}

function saveAdminToken(token) {
  try {
    if (token) sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
    else sessionStorage.removeItem(ADMIN_TOKEN_KEY);
  } catch {
    // HttpOnly cookie remains the primary session method.
  }
}
let manualPaymentMethods = [];

function t(key) {
  return translations[language]?.[key] ?? translations.en[key] ?? key;
}

function esc(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function statusClass(status) {
  return String(status || '').replace(/[^a-z0-9]/gi, '').toLowerCase();
}

function dateTime(value) {
  if (!value) return '—';
  const normalized = String(value).includes('T') ? String(value) : `${String(value).replace(' ', 'T')}Z`;
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? esc(value) : date.toLocaleString(language === 'bn' ? 'bn-BD' : language === 'ar' ? 'ar' : language === 'hi' ? 'hi-IN' : 'en-US');
}

function currency() {
  return String(state.settings?.store_currency || adminState?.settings?.store_currency || 'USD').toUpperCase();
}

function formatMoney(value) {
  const amount = Number(value || 0);
  try {
    return new Intl.NumberFormat(language === 'bn' ? 'bn-BD' : language === 'ar' ? 'ar' : language === 'hi' ? 'hi-IN' : 'en-US', {
      style: 'currency', currency: currency(), maximumFractionDigits: 2
    }).format(amount);
  } catch {
    return `${currency()} ${amount.toFixed(2)}`;
  }
}

function whatsappHref(number, message = '') {
  const digits = String(number || '').replace(/\D/g, '');
  if (!digits) return '#';
  return `https://wa.me/${digits}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
}

function telegramHref(value, numericId = '') {
  const raw = String(value || '').trim();
  if (/^https?:\/\/(?:www\.)?t\.me\//i.test(raw)) return raw;
  if (/^(?:www\.)?t\.me\//i.test(raw)) return `https://${raw}`;
  const username = raw.replace(/^@/, '');
  if (username && !/^\d+$/.test(username)) return `https://t.me/${encodeURIComponent(username)}`;
  const id = String(numericId || username).replace(/\D/g, '');
  return id ? `tg://user?id=${id}` : '#';
}

function safeSupportHref(value) {
  const raw = String(value || '').trim();
  if (!raw) return '#';
  if (/^@[a-z0-9_]{4,}$/i.test(raw)) return `https://t.me/${encodeURIComponent(raw.slice(1))}`;
  if (/^(?:t\.me|wa\.me|chat\.whatsapp\.com|whatsapp\.com)\//i.test(raw)) return `https://${raw}`;
  try {
    const url = new URL(raw);
    return url.protocol === 'https:' ? url.href : '#';
  } catch {
    return '#';
  }
}

function supportLinks(settings = {}, message = '') {
  const explicitAdmin = safeSupportHref(settings.support_admin_link);
  const admin = explicitAdmin !== '#'
    ? explicitAdmin
    : (whatsappHref(settings.whatsapp, message) !== '#' ? whatsappHref(settings.whatsapp, message) : telegramHref(settings.telegram, settings.telegram_id));
  return {
    admin,
    group: safeSupportHref(settings.support_group_link),
    whatsappGroup: safeSupportHref(settings.whatsapp_group_link)
  };
}

function applySupportLinks(settings = {}) {
  const links = supportLinks(settings);
  const byType = { admin: links.admin, group: links.group, 'whatsapp-group': links.whatsappGroup };
  $$('[data-support-link]').forEach(element => {
    const href = byType[element.dataset.supportLink] || '#';
    element.href = href;
    element.classList.toggle('hidden', href === '#');
    element.setAttribute('aria-hidden', href === '#' ? 'true' : 'false');
  });
  const anySupport = Object.values(links).some(href => href !== '#');
  $('orderHelpPanel')?.classList.toggle('hidden', !anySupport);
}

function contactDisplay(value, fallback = '') {
  const clean = String(value || '').trim();
  return clean || fallback || 'Not configured';
}

function empty(textKey, icon = '◇') {
  return `<div class="empty-state"><span>${icon}</span>${esc(t(textKey))}</div>`;
}

function toast(message, type = 'success') {
  const element = $('toast');
  element.textContent = message;
  element.className = `toast show${type === 'error' ? ' error' : ''}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { element.className = 'toast'; }, 3200);
}

function setLoading(show) {
  $('loader').classList.toggle('show', show);
  $('loader').setAttribute('aria-hidden', String(!show));
}

async function api(url, options = {}) {
  const headers = new Headers(options.headers || {});
  if (options.body && !headers.has('content-type')) headers.set('content-type', 'application/json');

  const isAdminRequest = String(url).startsWith('/api/admin/');
  const isLoginRequest = String(url) === '/api/admin/login';
  const token = isAdminRequest && !isLoginRequest ? adminToken() : '';
  if (token && !headers.has('authorization')) headers.set('authorization', `Bearer ${token}`);

  const response = await fetch(url, { credentials: 'same-origin', ...options, headers });
  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await response.json() : await response.text();
  if (!response.ok) {
    if (response.status === 401 && isAdminRequest && !isLoginRequest) saveAdminToken('');
    const error = new Error(data?.message || `Request failed (${response.status})`);
    error.code = data?.code || 'REQUEST_FAILED';
    error.status = response.status;
    throw error;
  }
  return data;
}

async function loadState(silent = false) {
  if (!silent) setLoading(true);
  try {
    state = await api('/api/state');
    renderState();
  } catch (error) {
    toast(error.message, 'error');
  } finally {
    if (!silent) setLoading(false);
  }
}

function applyLanguage() {
  document.documentElement.lang = language;
  document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  $('languageSelect').value = language;
  $$('[data-i]').forEach(element => { element.textContent = t(element.dataset.i); });
  $$('[data-i-html]').forEach(element => { element.innerHTML = t(element.dataset.iHtml); });
  $$('[data-i-placeholder]').forEach(element => { element.placeholder = t(element.dataset.iPlaceholder); });
  renderState();
  if (adminState) renderAdmin();
}

function setLanguage(next) {
  language = translations[next] ? next : 'en';
  localStorage.setItem('sarour_language', language);
  applyLanguage();
}

function route(name) {
  if (name === 'admin') {
    openAdmin();
    return;
  }
  currentRoute = name;
  $$('.page').forEach(page => page.classList.toggle('active', page.id === `page-${name}`));
  $$('[data-route]').forEach(button => button.classList.toggle('active', button.dataset.route === name));
  window.scrollTo({ top: 0 });
}

function productCard(product) {
  const out = Number(product.stock) < 1;
  return `
    <article class="product-card ${product.featured ? 'featured' : ''}">
      <div class="product-top">
        <span class="product-icon">${esc(product.icon)}</span>
        <span class="stock-badge ${out ? 'out' : ''}">${out ? esc(t('soldOut')) : `${esc(product.stock)} ${esc(t('left'))}`}</span>
      </div>
      <h3>${esc(product.name)}</h3>
      <span class="product-category">${esc(product.category)}</span>
      <p>${esc(product.description)}</p>
      ${product.delivery_note ? `<div class="delivery-note">⚡ ${esc(product.delivery_note)}</div>` : ''}
      <div class="product-bottom">
        <span class="product-price">${esc(formatMoney(product.price))}</span>
        <button type="button" class="button ${out ? 'ghost' : 'primary'} small" data-action="buy" data-id="${product.id}" ${out ? 'disabled' : ''}>${esc(out ? t('soldOut') : t('buyNow'))}</button>
      </div>
    </article>`;
}

function renderProducts() {
  const search = ($('productSearch')?.value || '').trim().toLowerCase();
  const selected = $('categoryFilter')?.value || 'all';
  const categories = [...new Set(state.products.map(product => product.category).filter(Boolean))].sort();
  if ($('categoryFilter')) {
    $('categoryFilter').innerHTML = `<option value="all">${esc(t('allCategories'))}</option>${categories.map(category => `<option value="${esc(category)}" ${category === selected ? 'selected' : ''}>${esc(category)}</option>`).join('')}`;
  }
  const filtered = state.products.filter(product => {
    const matchesCategory = selected === 'all' || product.category === selected;
    const haystack = `${product.name} ${product.description} ${product.category}`.toLowerCase();
    return matchesCategory && haystack.includes(search);
  });
  $('productGrid').innerHTML = filtered.length ? filtered.map(productCard).join('') : empty('noProducts');
  const featured = state.products.filter(product => product.featured).slice(0, 3);
  const homeProducts = featured.length ? featured : state.products.slice(0, 3);
  $('featuredProducts').innerHTML = homeProducts.length ? homeProducts.map(productCard).join('') : empty('noProducts');
}

function dataItem(icon, title, subtitle, action = '', status = '') {
  return `<div class="data-item">
    <span class="data-item-icon">${icon}</span>
    <div class="data-item-body"><strong>${title}</strong><small>${subtitle}</small></div>
    ${action || (status ? `<span class="status-badge ${statusClass(status)}">${esc(status)}</span>` : '')}
  </div>`;
}

function validHexColor(value, fallback) {
  const text = String(value || '').trim();
  return /^#[0-9a-f]{6}$/i.test(text) ? text : fallback;
}

function applyTheme(settings = {}) {
  const primary = validHexColor(settings.theme_primary, '#4f8cff');
  const secondary = validHexColor(settings.theme_secondary, '#7c5cff');
  const surface = validHexColor(settings.theme_surface, '#151b23');
  document.documentElement.style.setProperty('--primary', primary);
  document.documentElement.style.setProperty('--primary-strong', secondary);
  document.documentElement.style.setProperty('--theme-surface', surface);
  document.body.classList.remove('rainbow-mode', 'blood-mode');
}

function renderHomepageCards() {
  const cards = state.homepage_cards || [];
  $('homepageCards').innerHTML = cards.length ? cards.map(card => `
    <article class="benefit-card">
      <span class="benefit-icon">${esc(card.icon || '✨')}</span>
      <h3>${esc(card.title)}</h3>
      <p>${esc(card.description)}</p>
    </article>`).join('') : '';
}

function renderState() {
  const settings = state.settings || {};
  const storeName = settings.store_name || 'Sarour Store';
  applyTheme(settings);
  $('brandName').textContent = storeName;
  $('brandTagline').textContent = settings.store_tagline || 'Premium digital marketplace';
  $('footerStore').textContent = storeName;
  $('footerText').textContent = settings.footer_text || 'Secure digital commerce on Cloudflare';
  $('heroTitleLine1').textContent = settings.hero_title_line1 || 'Digital products.';
  $('heroTitleLine2').textContent = settings.hero_title_line2 || 'Delivered with confidence.';
  $('heroDescription').textContent = settings.hero_description || 'Browse trusted subscriptions, pay securely, and track every purchase from one polished dashboard.';
  document.title = storeName;
  $$('[data-balance]').forEach(element => { element.textContent = formatMoney(state.user?.balance || 0); });
  $('homeOrderCount').textContent = state.orders?.length || 0;
  $('homePaymentCount').textContent = (state.deposits?.length || 0) + (state.payments?.length || 0);
  $('userCode').textContent = state.user?.id ? `ID ${state.user.id.slice(0, 8).toUpperCase()}` : '••••••••';

  const announcement = cleanText(settings.announcement);
  $('announcement').textContent = announcement;
  $('announcement').classList.toggle('hidden', !announcement);

  $('paymentInstructions').textContent = settings.payment_instructions || '';
  $('whatsappLink').href = whatsappHref(settings.whatsapp);
  $('telegramLink').href = telegramHref(settings.telegram, settings.telegram_id);
  $('whatsappContactValue').textContent = contactDisplay(settings.whatsapp);
  $('telegramContactValue').textContent = contactDisplay(settings.telegram, settings.telegram_id);
  $('supportEmail').textContent = settings.support_email || 'Not configured';
  $('emailLink').href = settings.support_email ? `mailto:${settings.support_email}` : '#';
  const supportNotice = settings.support_notice || 'অর্ডার করার পর কিছু সময় অপেক্ষা করুন। প্রোডাক্ট না পেলে Order ID সহ Support Admin অথবা Support Group-এ যোগাযোগ করুন।';
  $('supportNoticeText').textContent = supportNotice;
  $('walletSupportNotice').textContent = supportNotice;
  applySupportLinks(settings);

  manualPaymentMethods = (state.payment_methods || []).map(method => ({
    id: method.id,
    key: method.method_key,
    label: method.label,
    accountLabel: method.account_label,
    value: method.account_value,
    icon: method.icon || '💳',
    subtitle: method.subtitle || ''
  }));
  if (!manualPaymentMethods.length) {
    manualPaymentMethods = [
      { key: 'bkash', label: 'bKash', accountLabel: 'bKash number', value: settings.payment_number || '', icon: '৳', subtitle: 'Personal' },
      { key: 'nagad', label: 'Nagad', accountLabel: 'Nagad number', value: settings.payment_number || '', icon: '৳', subtitle: 'Personal' },
      { key: 'binance', label: 'Binance Pay', accountLabel: 'Binance Pay UID', value: settings.binance_uid || '', icon: '₿', subtitle: 'UID' },
      { key: 'telegram', label: 'Telegram Wallet', accountLabel: 'Telegram Wallet ID', value: settings.telegram_wallet_id || '', icon: '✈', subtitle: 'Wallet ID' }
    ];
  }
  renderManualPaymentMethods();
  renderHomepageCards();

  $('autoName').value = state.user?.display_name || $('autoName').value;
  $('autoEmail').value = state.user?.email || $('autoEmail').value;
  $('autoPhone').value = state.user?.phone || $('autoPhone').value;

  const autoReady = Boolean(state.payment?.auto_enabled);
  $('autoGatewayNotice').textContent = autoReady
    ? `${t('gatewayReady')} ${state.payment.mode === 'live' ? t('liveMode') : t('sandboxMode')}.`
    : t('gatewayDisabled');
  $('autoGatewayNotice').className = `notice ${autoReady ? 'success' : 'warning'}`;
  $$('input, button', $('autoPaymentForm')).forEach(element => { element.disabled = !autoReady; });

  const manualEnabled = settings.manual_payment_enabled === '1';
  $$('input, select, button', $('manualDepositForm')).forEach(element => { element.disabled = !manualEnabled; });
  $$('[data-manual-method]').forEach(button => {
    const method = manualPaymentMethods.find(item => item.key === button.dataset.manualMethod);
    button.disabled = !manualEnabled || !method?.value;
  });
  $('selectedPayment').classList.toggle('disabled', !manualEnabled);

  renderProducts();
  renderWalletHistory();
}

function renderManualPaymentMethods() {
  const available = manualPaymentMethods.filter(method => method.value);
  const grid = $('paymentMethodGrid');
  grid.innerHTML = manualPaymentMethods.length ? manualPaymentMethods.map(method => `
    <button type="button" class="payment-method-card ${method.value ? '' : 'unavailable'}" data-manual-method="${esc(method.key)}" ${method.value ? '' : 'disabled'}>
      <span>${esc(method.icon || '💳')}</span><strong>${esc(method.label)}</strong><small>${esc(method.subtitle || method.accountLabel || '')}</small>
    </button>`).join('') : '<div class="empty-state"><span>💳</span>No payment method configured.</div>';

  const currentKey = $('manualMethod')?.dataset.key;
  const selected = available.find(method => method.key === currentKey) || available[0] || null;
  selectManualPaymentMethod(selected?.key || '');
}

function selectManualPaymentMethod(key) {
  const method = manualPaymentMethods.find(item => item.key === key && item.value) || null;
  $$('[data-manual-method]').forEach(button => button.classList.toggle('active', Boolean(method) && button.dataset.manualMethod === method.key));
  $('manualMethod').value = method ? `${method.label} — ${method.value}` : '';
  $('manualMethod').dataset.key = method?.key || '';
  $('manualMethodDisplay').value = method?.label || 'Not configured';
  $('selectedPaymentLabel').textContent = method?.accountLabel || 'Select a payment method';
  $('selectedPaymentValue').textContent = method?.value || '—';
  const copyButton = document.querySelector('[data-action="copy-payment"]');
  if (copyButton) copyButton.disabled = !method;
}

function cleanText(value) {
  return String(value || '').trim();
}

function renderWalletHistory() {
  $('walletLedger').innerHTML = state.ledger?.length
    ? state.ledger.map(entry => dataItem(
        entry.entry_type === 'CREDIT' ? '↗' : '↘',
        `${entry.entry_type === 'CREDIT' ? '+' : '-'}${esc(formatMoney(entry.amount))}`,
        `${esc(entry.description || entry.source_type)} · ${dateTime(entry.created_at)}`,
        '', entry.entry_type === 'CREDIT' ? 'Paid' : 'Completed'
      )).join('')
    : empty('noActivity', '◈');

  const paymentItems = [
    ...(state.payments || []).map(item => ({ ...item, kind: 'Auto', reference: item.id })),
    ...(state.deposits || []).map(item => ({ ...item, kind: 'Manual', reference: item.txid }))
  ].sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)));
  $('paymentHistory').innerHTML = paymentItems.length
    ? paymentItems.map(item => dataItem(
        item.kind === 'Auto' ? '⚡' : '💳',
        `${esc(formatMoney(item.amount))} · ${esc(item.kind)}`,
        `${esc(item.provider || item.method || '')} · ${esc(item.reference || '')} · ${dateTime(item.created_at)}`,
        '', item.status
      )).join('')
    : empty('noPayments', '💳');

  $('orderHistory').innerHTML = state.orders?.length
    ? state.orders.map(order => dataItem(
        esc(order.product_icon || '◇'),
        `${esc(order.product_name)} × ${esc(order.quantity || 1)}`,
        `#${esc(order.id)} · ${esc(formatMoney(order.amount))} · ${dateTime(order.created_at)}`,
        `<div class="data-item-actions"><span class="status-badge ${statusClass(order.status)}">${esc(order.status)}</span><button type="button" class="button ghost small" data-action="order-support" data-id="${esc(order.id)}">${esc(t('getSupport'))}</button></div>`
      )).join('')
    : empty('noOrders', '◇');
}

function openModal(html) {
  $('modalContent').innerHTML = html;
  $('modal').classList.add('show');
  $('modal').setAttribute('aria-hidden', 'false');
  setTimeout(() => $('modal').querySelector('input,select,textarea,button')?.focus(), 40);
}

function closeModal() {
  $('modal').classList.remove('show');
  $('modal').setAttribute('aria-hidden', 'true');
  $('modalContent').innerHTML = '';
}

function openPurchase(productId) {
  const product = state.products.find(item => Number(item.id) === Number(productId));
  if (!product) return toast('Product not found.', 'error');
  openModal(`
    <h2 id="modalTitle">${esc(t('purchaseTitle'))}</h2>
    <p>${esc(product.name)} · ${esc(formatMoney(product.price))}</p>
    <form id="purchaseForm" class="modal-form" data-product-id="${product.id}">
      <div class="form-grid">
        <label><span>${esc(t('quantity'))}</span><input id="purchaseQuantity" type="number" min="1" max="${Math.min(20, Number(product.stock))}" value="1" required></label>
        <label><span>${esc(t('availableBalance'))}</span><input value="${esc(formatMoney(state.user.balance))}" disabled></label>
        <label><span>${esc(t('telegramId'))}</span><input id="purchaseTelegram" maxlength="120" placeholder="@username or numeric ID"></label>
        <label><span>${esc(t('whatsappNumber'))}</span><input id="purchaseWhatsapp" maxlength="30" inputmode="tel" placeholder="8801XXXXXXXXX"></label>
        <p class="form-help full">${esc(t('contactRequired'))}</p>
        <label class="full"><span>${esc(t('noteOptional'))}</span><textarea id="purchaseNote" rows="3" maxlength="500"></textarea></label>
      </div>
      <button class="button primary wide" type="submit">${esc(t('confirmPurchase'))}</button>
    </form>`);
}

function openPurchaseSuccess(result) {
  const message = result.post_purchase_message || t('contactSupportDelivery');
  lastOrderContactMessage = `Order #${result.order_id}\nProduct: ${result.product_name}\nQuantity: ${result.quantity}\n${message}`;
  const whatsapp = whatsappHref(result.whatsapp, lastOrderContactMessage);
  const telegram = telegramHref(result.telegram, result.telegram_id);
  const whatsappButton = whatsapp !== '#'
    ? `<a class="button primary wide" href="${esc(whatsapp)}" target="_blank" rel="noopener">${esc(t('messageWhatsapp'))}</a>`
    : '';
  const telegramButton = telegram !== '#'
    ? `<a class="button ghost wide" href="${esc(telegram)}" target="_blank" rel="noopener">${esc(t('messageTelegram'))}</a>`
    : '';
  const extraSupport = supportLinks(result, lastOrderContactMessage);
  const supportAdminButton = result.support_admin_link && extraSupport.admin !== '#'
    ? `<a class="button ghost wide" href="${esc(extraSupport.admin)}" target="_blank" rel="noopener">${esc(t('supportAdmin'))}</a>` : '';
  const supportGroupButton = extraSupport.group !== '#'
    ? `<a class="button ghost wide" href="${esc(extraSupport.group)}" target="_blank" rel="noopener">${esc(t('supportGroup'))}</a>` : '';
  const whatsappGroupButton = extraSupport.whatsappGroup !== '#'
    ? `<a class="button ghost wide" href="${esc(extraSupport.whatsappGroup)}" target="_blank" rel="noopener">${esc(t('whatsappGroup'))}</a>` : '';
  openModal(`
    <div class="purchase-success">
      <span class="success-check">✓</span>
      <h2 id="modalTitle">${esc(t('purchaseCompleted'))}</h2>
      <p class="delivery-message">${esc(message)}</p>
      <div class="order-reference"><span>${esc(t('orderNumber'))}</span><strong>#${esc(result.order_id)}</strong></div>
      <div class="contact-button-grid">${whatsappButton}${telegramButton}${supportAdminButton}${supportGroupButton}${whatsappGroupButton}</div>
      <button type="button" class="button ghost wide" data-action="copy-order-message">${esc(t('copyOrderMessage'))}</button>
    </div>`);
}

function openOrderSupport(orderId) {
  const order = state.orders.find(item => String(item.id) === String(orderId));
  if (!order) return toast('Order not found.', 'error');
  const settings = state.settings || {};
  const supportNotice = settings.support_notice || 'অর্ডার করার পর কিছু সময় অপেক্ষা করুন। প্রোডাক্ট না পেলে Order ID সহ Support Admin অথবা Support Group-এ যোগাযোগ করুন।';
  lastOrderContactMessage = `Order #${order.id}\nProduct: ${order.product_name}\nStatus: ${order.status}\nI have not received my product. Please help me.`;
  const links = supportLinks(settings, lastOrderContactMessage);
  const adminButton = links.admin !== '#' ? `<a class="button primary wide" href="${esc(links.admin)}" target="_blank" rel="noopener">${esc(t('supportAdmin'))}</a>` : '';
  const groupButton = links.group !== '#' ? `<a class="button ghost wide" href="${esc(links.group)}" target="_blank" rel="noopener">${esc(t('supportGroup'))}</a>` : '';
  const whatsappGroupButton = links.whatsappGroup !== '#' ? `<a class="button ghost wide" href="${esc(links.whatsappGroup)}" target="_blank" rel="noopener">${esc(t('whatsappGroup'))}</a>` : '';
  openModal(`
    <div class="purchase-success">
      <span class="success-check">🛟</span>
      <h2 id="modalTitle">${esc(t('getOrderSupport'))}</h2>
      <p class="delivery-message">${esc(supportNotice)}</p>
      <div class="order-reference"><span>${esc(t('orderNumber'))}</span><strong>#${esc(order.id)}</strong></div>
      <div class="contact-button-grid">${adminButton}${groupButton}${whatsappGroupButton}</div>
      <button type="button" class="button ghost wide" data-action="copy-order-message">${esc(t('copySupportMessage'))}</button>
    </div>`);
}

function openLoginModal() {
  openModal(`
    <h2 id="modalTitle">${esc(t('adminLogin'))}</h2>
    <p>Enter the private admin password configured in Cloudflare.</p>
    <form id="adminLoginForm" class="modal-form">
      <label><span>${esc(t('password'))}</span><input id="adminPassword" type="password" autocomplete="current-password" required></label>
      <button class="button primary wide" type="submit">${esc(t('login'))}</button>
    </form>`);
}

async function openAdmin() {
  setLoading(true);
  try {
    adminState = await api('/api/admin/state');
    renderAdmin();
    currentRoute = 'admin';
    $$('.page').forEach(page => page.classList.toggle('active', page.id === 'page-admin'));
    $$('[data-route]').forEach(button => button.classList.remove('active'));
    window.scrollTo({ top: 0 });
  } catch (error) {
    if (error.status === 401) openLoginModal();
    else toast(error.message, 'error');
  } finally {
    setLoading(false);
  }
}

async function loadAdmin(silent = false) {
  if (!silent) setLoading(true);
  try {
    adminState = await api('/api/admin/state');
    renderAdmin();
  } catch (error) {
    if (error.status === 401) {
      adminState = null;
      route('home');
      if (!silent) openLoginModal();
    } else if (!silent) toast(error.message, 'error');
  } finally {
    if (!silent) setLoading(false);
  }
}

function renderAdmin() {
  if (!adminState) return;
  const stats = adminState.stats || {};
  $('statProducts').textContent = stats.products || 0;
  $('statUsers').textContent = stats.users || 0;
  $('statOrders').textContent = stats.orders || 0;
  $('statPending').textContent = Number(stats.pending_deposits || 0) + Number(stats.pending_payments || 0);
  $('statLiability').textContent = formatMoney(stats.wallet_liability || 0);
  $('gatewayStatus').textContent = `${adminState.gateway.provider}: ${adminState.gateway.configured ? 'Configured' : 'Not configured'} · ${adminState.gateway.mode}`;

  const recentOrders = (adminState.orders || []).slice(0, 8);
  $('overviewOrders').innerHTML = recentOrders.length ? recentOrders.map(order => dataItem(
    esc(order.product_icon || '◇'), esc(order.product_name), `${esc(formatMoney(order.amount))} · ${esc(order.user_id)} · ${dateTime(order.created_at)}`, '', order.status
  )).join('') : empty('noOrders');

  const recentPayments = [
    ...(adminState.payments || []).map(item => ({ ...item, source: 'Auto' })),
    ...(adminState.deposits || []).map(item => ({ ...item, source: 'Manual' }))
  ].sort((a, b) => String(b.created_at).localeCompare(String(a.created_at))).slice(0, 8);
  $('overviewPayments').innerHTML = recentPayments.length ? recentPayments.map(item => dataItem(
    item.source === 'Auto' ? '⚡' : '💳', `${esc(formatMoney(item.amount))} · ${esc(item.source)}`, `${esc(item.user_id)} · ${dateTime(item.created_at)}`, '', item.status
  )).join('') : empty('noPayments');

  $('auditLog').innerHTML = table(
    ['Action', 'Target', 'Details', t('created')],
    (adminState.audit_logs || []).map(log => [esc(log.action), `${esc(log.target_type)} ${esc(log.target_id)}`, esc(log.details), dateTime(log.created_at)])
  );

  $('adminProductTable').innerHTML = table(
    [t('icon'), t('name'), t('category'), t('price'), t('stock'), t('status'), t('actions')],
    (adminState.products || []).map(product => [
      esc(product.icon), `<strong>${esc(product.name)}</strong><br><small>${esc(product.description)}</small>`, esc(product.category), esc(formatMoney(product.price)),
      `<div class="stock-control"><button type="button" class="stock-step" data-action="stock-delta" data-delta="-1" data-id="${product.id}" aria-label="Remove one stock">−</button><strong>${esc(product.stock)}</strong><button type="button" class="stock-step" data-action="stock-delta" data-delta="1" data-id="${product.id}" aria-label="Add one stock">+1</button><button type="button" class="stock-step wide" data-action="stock-delta" data-delta="5" data-id="${product.id}" aria-label="Add five stock">+5</button></div>`,
      `<span class="status-badge ${product.active ? 'paid' : 'rejected'}">${esc(product.active ? t('active') : t('hidden'))}${product.featured ? ' · ★' : ''}</span>`,
      `<div class="table-actions"><button class="button ghost small" data-action="edit-product" data-id="${product.id}">${esc(t('edit'))}</button><button class="button ghost small" data-action="toggle-product" data-id="${product.id}">${product.active ? esc(t('hide')) : 'Restore'}</button><button class="button danger small" data-action="delete-product" data-id="${product.id}">Delete</button></div>`
    ])
  );

  $('adminPaymentMethodTable').innerHTML = table(
    ['Icon', 'Method', 'Account', 'Status', 'Sort', 'Actions'],
    (adminState.payment_methods || []).map(method => [
      esc(method.icon || '💳'),
      `<strong>${esc(method.label)}</strong><br><small>${esc(method.method_key)}</small>`,
      `<strong>${esc(method.account_label || 'Account')}</strong><br><span class="code">${esc(method.account_value || '—')}</span>`,
      `<span class="status-badge ${method.active ? 'paid' : 'rejected'}">${method.active ? 'Active' : 'Hidden'}</span>`,
      esc(method.sort_order || 0),
      `<div class="table-actions"><button class="button ghost small" data-action="edit-payment-method" data-id="${method.id}">Edit</button><button class="button danger small" data-action="delete-payment-method" data-id="${method.id}">Delete</button></div>`
    ])
  );

  $('adminHomepageCardTable').innerHTML = table(
    ['Icon', 'Title', 'Description', 'Status', 'Sort', 'Actions'],
    (adminState.homepage_cards || []).map(card => [
      esc(card.icon || '✨'), `<strong>${esc(card.title)}</strong>`, esc(card.description),
      `<span class="status-badge ${card.active ? 'paid' : 'rejected'}">${card.active ? 'Active' : 'Hidden'}</span>`,
      esc(card.sort_order || 0),
      `<div class="table-actions"><button class="button ghost small" data-action="edit-homepage-card" data-id="${card.id}">Edit</button><button class="button danger small" data-action="delete-homepage-card" data-id="${card.id}">Delete</button></div>`
    ])
  );

  const orderStatuses = ['Completed', 'Processing', 'Delivered', 'Cancelled', 'Refunded'];
  $('adminOrderTable').innerHTML = table(
    ['ID', t('products'), t('user'), 'Delivery contact', t('amount'), t('quantity'), t('status'), t('created')],
    (adminState.orders || []).map(order => [
      `#${order.id}`, `${esc(order.product_icon)} ${esc(order.product_name)}`, `<span class="code">${esc(order.user_id)}</span>`,
      `<div class="order-contact">${order.customer_telegram ? `<span>Telegram: ${esc(order.customer_telegram)}</span>` : ''}${order.customer_whatsapp ? `<span>WhatsApp: ${esc(order.customer_whatsapp)}</span>` : ''}${!order.customer_telegram && !order.customer_whatsapp ? '<span>—</span>' : ''}</div>`,
      esc(formatMoney(order.amount)), esc(order.quantity || 1),
      `<select class="table-select" data-action="order-status" data-id="${order.id}">${orderStatuses.map(status => `<option ${status === order.status ? 'selected' : ''}>${status}</option>`).join('')}</select>`, dateTime(order.created_at)
    ])
  );

  $('adminDepositList').innerHTML = adminState.deposits?.length ? adminState.deposits.map(deposit => dataItem(
    '💳', `${esc(formatMoney(deposit.amount))} · ${esc(deposit.method)}`,
    `User: ${esc(deposit.user_id)} · TxID: ${esc(deposit.txid)} · ${dateTime(deposit.created_at)}`,
    deposit.status === 'Pending'
      ? `<div class="data-item-actions"><button class="button primary small" data-action="review-deposit" data-review="approve" data-id="${deposit.id}">${esc(t('approve'))}</button><button class="button danger small" data-action="review-deposit" data-review="reject" data-id="${deposit.id}">${esc(t('reject'))}</button></div>`
      : '', deposit.status
  )).join('') : empty('noPayments');

  $('adminPaymentList').innerHTML = adminState.payments?.length ? adminState.payments.map(payment => dataItem(
    '⚡', `${esc(formatMoney(payment.amount))} · ${esc(payment.provider)}`,
    `${esc(payment.id)} · User: ${esc(payment.user_id)} · ${dateTime(payment.created_at)}`,
    payment.status === 'RiskReview'
      ? `<div class="data-item-actions"><button class="button primary small" data-action="review-risk-payment" data-review="approve" data-id="${esc(payment.id)}">${esc(t('approve'))}</button><button class="button danger small" data-action="review-risk-payment" data-review="reject" data-id="${esc(payment.id)}">${esc(t('reject'))}</button></div>`
      : '', payment.status
  )).join('') : empty('noPayments');

  $('adminUserTable').innerHTML = table(
    [t('user'), t('name'), t('email'), t('phone'), t('availableBalance'), t('created'), t('actions')],
    (adminState.users || []).map(user => [
      `<span class="code">${esc(user.id)}</span>`, esc(user.display_name || '—'), esc(user.email || '—'), esc(user.phone || '—'), `<strong>${esc(formatMoney(user.balance))}</strong>`, dateTime(user.created_at),
      `<button class="button ghost small" data-action="adjust-wallet" data-id="${esc(user.id)}">${esc(t('adjust'))}</button>`
    ])
  );

  $('adminMessageList').innerHTML = adminState.messages?.length ? adminState.messages.map(message => dataItem(
    '✉', esc(message.topic), `${esc(message.body)} · User: ${esc(message.user_id)} · ${dateTime(message.created_at)}`,
    `<div class="data-item-actions"><button class="button ghost small" data-action="message-status" data-status="${message.status === 'Unread' ? 'Read' : 'Resolved'}" data-id="${message.id}">${message.status === 'Unread' ? 'Mark read' : 'Resolve'}</button><button class="button danger small" data-action="delete-message" data-id="${message.id}">Delete</button></div>`, message.status
  )).join('') : empty('noMessages');

  const settings = adminState.settings || {};
  $('settingStoreName').value = settings.store_name || '';
  $('settingTagline').value = settings.store_tagline || '';
  $('settingCurrency').value = settings.store_currency || 'USD';
  $('settingWhatsapp').value = settings.whatsapp || '';
  $('settingTelegram').value = settings.telegram || '';
  $('settingTelegramId').value = settings.telegram_id || '';
  $('settingEmail').value = settings.support_email || '';
  $('settingWhatsappGroup').value = settings.whatsapp_group_link || '';
  $('settingSupportAdmin').value = settings.support_admin_link || '';
  $('settingSupportGroup').value = settings.support_group_link || '';
  $('settingSupportNotice').value = settings.support_notice || 'অর্ডার করার পর কিছু সময় অপেক্ষা করুন। প্রোডাক্ট না পেলে Order ID সহ Support Admin অথবা Support Group-এ যোগাযোগ করুন।';
  $('settingPrimaryColor').value = validHexColor(settings.theme_primary, '#4f8cff');
  $('settingSecondaryColor').value = validHexColor(settings.theme_secondary, '#7c5cff');
  $('settingSurfaceColor').value = validHexColor(settings.theme_surface, '#151b23');
  $('settingHeroLine1').value = settings.hero_title_line1 || 'Digital products.';
  $('settingHeroLine2').value = settings.hero_title_line2 || 'Delivered with confidence.';
  $('settingHeroDescription').value = settings.hero_description || '';
  $('settingFooterText').value = settings.footer_text || 'Secure digital commerce on Cloudflare';
  $('settingAnnouncement').value = settings.announcement || '';
  $('settingInstructions').value = settings.payment_instructions || '';
  $('settingPostPurchaseMessage').value = settings.post_purchase_message || t('contactSupportDelivery');
  $('settingManualEnabled').checked = settings.manual_payment_enabled === '1';
  $('settingAutoEnabled').checked = settings.auto_payment_enabled === '1';
  $('settingMaintenance').checked = settings.maintenance_mode === '1';
}

function table(headers, rows) {
  if (!rows.length) return empty('noActivity');
  return `<table><thead><tr>${headers.map(header => `<th>${header}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
}

function openProductModal(productId = null) {
  const product = productId ? adminState.products.find(item => Number(item.id) === Number(productId)) : {
    icon: '🛍️', name: '', description: '', category: 'Digital', price: 0, stock: 1, delivery_note: '', featured: 0, active: 1, sort_order: 0
  };
  openModal(`
    <h2 id="modalTitle">${esc(productId ? t('edit') : t('addProduct'))}</h2>
    <form id="productForm" class="modal-form" data-product-id="${productId || ''}">
      <div class="form-grid">
        <label><span>${esc(t('icon'))}</span><input id="productIcon" value="${esc(product.icon)}" maxlength="20" required></label>
        <label><span>${esc(t('category'))}</span><input id="productCategory" value="${esc(product.category)}" maxlength="60" required></label>
        <label class="full"><span>${esc(t('name'))}</span><input id="productName" value="${esc(product.name)}" maxlength="120" required></label>
        <label class="full"><span>${esc(t('description'))}</span><textarea id="productDescription" rows="4" maxlength="1000" required>${esc(product.description)}</textarea></label>
        <label><span>${esc(t('price'))}</span><input id="productPrice" type="number" min="0" step="0.01" value="${esc(product.price)}" required></label>
        <label><span>${esc(t('stock'))}</span><input id="productStock" type="number" min="0" step="1" value="${esc(product.stock)}" required></label>
        <label><span>Sort order</span><input id="productSort" type="number" step="1" value="${esc(product.sort_order || 0)}" required></label>
        <label class="toggle"><input id="productFeatured" type="checkbox" ${product.featured ? 'checked' : ''}><span></span><b>${esc(t('featuredLabel'))}</b></label>
        <label class="toggle"><input id="productActive" type="checkbox" ${product.active ? 'checked' : ''}><span></span><b>${esc(t('active'))}</b></label>
        <label class="full"><span>Delivery note</span><textarea id="productDelivery" rows="2" maxlength="500">${esc(product.delivery_note || '')}</textarea></label>
      </div>
      <button class="button primary wide" type="submit">${esc(t('save'))}</button>
    </form>`);
}

function openPaymentMethodModal(methodId = null) {
  const method = methodId ? adminState.payment_methods.find(item => Number(item.id) === Number(methodId)) : {
    method_key: '', label: '', account_label: 'Account', account_value: '', icon: '💳', subtitle: '', active: 1, sort_order: 0
  };
  openModal(`
    <h2 id="modalTitle">${methodId ? 'Edit payment method' : 'Add payment method'}</h2>
    <form id="paymentMethodForm" class="modal-form" data-method-id="${methodId || ''}">
      <div class="form-grid">
        <label><span>Icon</span><input id="paymentMethodIcon" value="${esc(method.icon || '💳')}" maxlength="20" required></label>
        <label><span>Key</span><input id="paymentMethodKey" value="${esc(method.method_key || '')}" maxlength="40" placeholder="binance" required></label>
        <label class="full"><span>Method name</span><input id="paymentMethodLabel" value="${esc(method.label || '')}" maxlength="80" required></label>
        <label><span>Account label</span><input id="paymentMethodAccountLabel" value="${esc(method.account_label || 'Account')}" maxlength="100" required></label>
        <label><span>Small subtitle</span><input id="paymentMethodSubtitle" value="${esc(method.subtitle || '')}" maxlength="80"></label>
        <label class="full"><span>Number / UID / Wallet ID</span><input id="paymentMethodValue" value="${esc(method.account_value || '')}" maxlength="250"></label>
        <label><span>Sort order</span><input id="paymentMethodSort" type="number" step="1" value="${esc(method.sort_order || 0)}" required></label>
        <label class="toggle"><input id="paymentMethodActive" type="checkbox" ${method.active ? 'checked' : ''}><span></span><b>Active</b></label>
      </div>
      <button class="button primary wide" type="submit">Save method</button>
    </form>`);
}

function openHomepageCardModal(cardId = null) {
  const card = cardId ? adminState.homepage_cards.find(item => Number(item.id) === Number(cardId)) : {
    icon: '✨', title: '', description: '', active: 1, sort_order: 0
  };
  openModal(`
    <h2 id="modalTitle">${cardId ? 'Edit homepage card' : 'Add homepage card'}</h2>
    <form id="homepageCardForm" class="modal-form" data-card-id="${cardId || ''}">
      <div class="form-grid">
        <label><span>Icon</span><input id="homepageCardIcon" value="${esc(card.icon || '✨')}" maxlength="20" required></label>
        <label><span>Sort order</span><input id="homepageCardSort" type="number" step="1" value="${esc(card.sort_order || 0)}" required></label>
        <label class="full"><span>Title</span><input id="homepageCardTitle" value="${esc(card.title || '')}" maxlength="120" required></label>
        <label class="full"><span>Description</span><textarea id="homepageCardDescription" rows="4" maxlength="700" required>${esc(card.description || '')}</textarea></label>
        <label class="toggle"><input id="homepageCardActive" type="checkbox" ${card.active ? 'checked' : ''}><span></span><b>Active</b></label>
      </div>
      <button class="button primary wide" type="submit">Save card</button>
    </form>`);
}

function openAdjustmentModal(userId) {
  const user = adminState.users.find(item => item.id === userId);
  openModal(`
    <h2 id="modalTitle">${esc(t('adjustmentTitle'))}</h2>
    <p class="code">${esc(userId)} · ${esc(formatMoney(user?.balance || 0))}</p>
    <form id="walletAdjustForm" class="modal-form" data-user-id="${esc(userId)}">
      <label><span>${esc(t('adjustmentAmount'))}</span><input id="adjustmentAmount" type="number" step="0.01" required></label>
      <label><span>${esc(t('adjustmentReason'))}</span><textarea id="adjustmentReason" rows="3" maxlength="300" required></textarea></label>
      <button class="button primary wide" type="submit">${esc(t('save'))}</button>
    </form>`);
}

async function handleClick(event) {
  const routeButton = event.target.closest('[data-route]');
  if (routeButton) return route(routeButton.dataset.route);

  const paymentTab = event.target.closest('[data-payment-tab]');
  if (paymentTab) {
    $$('[data-payment-tab]').forEach(button => button.classList.toggle('active', button === paymentTab));
    $$('.payment-tab').forEach(tab => tab.classList.toggle('active', tab.id === `payment-${paymentTab.dataset.paymentTab}`));
    return;
  }

  const manualMethodButton = event.target.closest('[data-manual-method]');
  if (manualMethodButton && !manualMethodButton.disabled) {
    selectManualPaymentMethod(manualMethodButton.dataset.manualMethod);
    return;
  }

  const adminTab = event.target.closest('[data-admin-tab]');
  if (adminTab) {
    $$('[data-admin-tab]').forEach(button => button.classList.toggle('active', button === adminTab));
    $$('.admin-tab').forEach(tab => tab.classList.toggle('active', tab.id === `admin-${adminTab.dataset.adminTab}`));
    return;
  }

  const exportButton = event.target.closest('[data-export]');
  if (exportButton) {
    window.location.assign(`/api/admin/export?type=${encodeURIComponent(exportButton.dataset.export)}`);
    return;
  }

  const actionButton = event.target.closest('[data-action]');
  if (!actionButton) return;
  const action = actionButton.dataset.action;

  if (action === 'close-modal') return closeModal();
  if (action === 'open-admin') return openAdmin();
  if (action === 'buy') return openPurchase(actionButton.dataset.id);
  if (action === 'order-support') return openOrderSupport(actionButton.dataset.id);
  if (action === 'refresh-admin') return loadAdmin();
  if (action === 'add-product') return openProductModal();
  if (action === 'edit-product') return openProductModal(actionButton.dataset.id);
  if (action === 'add-payment-method') return openPaymentMethodModal();
  if (action === 'edit-payment-method') return openPaymentMethodModal(actionButton.dataset.id);
  if (action === 'add-homepage-card') return openHomepageCardModal();
  if (action === 'edit-homepage-card') return openHomepageCardModal(actionButton.dataset.id);
  if (action === 'adjust-wallet') return openAdjustmentModal(actionButton.dataset.id);
  if (action === 'copy-order-message') {
    if (!lastOrderContactMessage) return;
    try {
      await navigator.clipboard.writeText(lastOrderContactMessage);
      toast('Order message copied.');
    } catch {
      toast(lastOrderContactMessage);
    }
    return;
  }
  if (action === 'copy-payment') {
    const value = $('selectedPaymentValue').textContent.trim();
    if (!value || value === '—') return toast('Select a configured payment method.', 'error');
    try {
      await navigator.clipboard.writeText(value);
      toast('Payment account copied.');
    } catch {
      toast(`Copy this payment account: ${value}`);
    }
    return;
  }

  if (action === 'admin-logout') {
    setLoading(true);
    try {
      await api('/api/admin/logout', { method: 'POST', body: '{}' });
      saveAdminToken('');
      adminState = null;
      route('home');
      toast('Logged out.');
    } catch (error) {
      saveAdminToken('');
      toast(error.message, 'error');
    }
    finally { setLoading(false); }
    return;
  }

  if (action === 'toggle-product') {
    if (!confirm('Change this product visibility?')) return;
    await adminMutation(`/api/admin/products/${actionButton.dataset.id}`, { method: 'DELETE' }, 'Product visibility updated.');
    return;
  }

  if (action === 'stock-delta') {
    const delta = Number(actionButton.dataset.delta || 0);
    if (!Number.isInteger(delta) || delta === 0) return;
    actionButton.disabled = true;
    await adminMutation(`/api/admin/products/${actionButton.dataset.id}/stock`, { method: 'POST', body: JSON.stringify({ delta }) }, delta > 0 ? `Stock +${delta} added.` : 'Stock reduced.');
    return;
  }

  if (action === 'delete-product') {
    if (!confirm('Permanently delete this product? Existing order records will remain saved as history.')) return;
    await adminMutation(`/api/admin/products/${actionButton.dataset.id}?permanent=1`, { method: 'DELETE' }, 'Product deleted.');
    return;
  }

  if (action === 'delete-payment-method') {
    if (!confirm('Delete this payment method?')) return;
    await adminMutation(`/api/admin/payment-methods/${actionButton.dataset.id}`, { method: 'DELETE' }, 'Payment method deleted.');
    return;
  }

  if (action === 'delete-homepage-card') {
    if (!confirm('Delete this homepage card?')) return;
    await adminMutation(`/api/admin/homepage-cards/${actionButton.dataset.id}`, { method: 'DELETE' }, 'Homepage card deleted.');
    return;
  }

  if (action === 'review-deposit') {
    const review = actionButton.dataset.review;
    if (!confirm(`${review === 'approve' ? t('approve') : t('reject')} this payment?`)) return;
    await adminMutation(`/api/admin/deposits/${actionButton.dataset.id}/${review}`, { method: 'POST', body: JSON.stringify({ note: '' }) }, `Payment ${review}d.`);
    return;
  }

  if (action === 'review-risk-payment') {
    const review = actionButton.dataset.review;
    if (!confirm(`${review === 'approve' ? t('approve') : t('reject')} this risk-review payment?`)) return;
    await adminMutation(`/api/admin/payments/${encodeURIComponent(actionButton.dataset.id)}/${review}`, { method: 'POST', body: '{}' }, `Risk payment ${review}d.`);
    return;
  }

  if (action === 'message-status') {
    await adminMutation(`/api/admin/messages/${actionButton.dataset.id}`, { method: 'PUT', body: JSON.stringify({ status: actionButton.dataset.status }) }, 'Message updated.');
    return;
  }

  if (action === 'delete-message') {
    if (!confirm('Delete this message?')) return;
    await adminMutation(`/api/admin/messages/${actionButton.dataset.id}`, { method: 'DELETE' }, 'Message deleted.');
  }
}

async function adminMutation(url, options, message) {
  setLoading(true);
  try {
    await api(url, options);
    toast(message);
    await Promise.all([loadAdmin(true), loadState(true)]);
  } catch (error) {
    toast(error.message, 'error');
  } finally {
    setLoading(false);
  }
}

async function handleChange(event) {
  if (event.target.id === 'languageSelect') setLanguage(event.target.value);
  if (event.target.id === 'productSearch' || event.target.id === 'categoryFilter') renderProducts();
  if (event.target.dataset.action === 'order-status') {
    await adminMutation(`/api/admin/orders/${event.target.dataset.id}`, { method: 'PUT', body: JSON.stringify({ status: event.target.value }) }, 'Order status updated.');
  }
}

async function handleSubmit(event) {
  event.preventDefault();
  const form = event.target;

  if (form.id === 'purchaseForm') {
    setLoading(true);
    try {
      const result = await api('/api/orders', { method: 'POST', body: JSON.stringify({
        product_id: Number(form.dataset.productId),
        quantity: Number($('purchaseQuantity').value),
        telegram: $('purchaseTelegram').value,
        whatsapp: $('purchaseWhatsapp').value,
        note: $('purchaseNote').value
      }) });
      await loadState(true);
      openPurchaseSuccess(result);
    } catch (error) {
      toast(error.message, 'error');
      if (error.code === 'INSUFFICIENT_BALANCE') { closeModal(); route('wallet'); }
    } finally { setLoading(false); }
    return;
  }

  if (form.id === 'manualDepositForm') {
    setLoading(true);
    try {
      await api('/api/deposits/manual', { method: 'POST', body: JSON.stringify({
        amount: $('manualAmount').value, method: $('manualMethod').value, txid: $('manualTxid').value
      }) });
      form.reset();
      toast(t('depositSubmitted'));
      await loadState(true);
    } catch (error) { toast(error.message, 'error'); }
    finally { setLoading(false); }
    return;
  }

  if (form.id === 'autoPaymentForm') {
    setLoading(true);
    try {
      const result = await api('/api/payments/sslcommerz/initiate', { method: 'POST', body: JSON.stringify({
        amount: $('autoAmount').value, name: $('autoName').value, email: $('autoEmail').value, phone: $('autoPhone').value
      }) });
      toast(t('paymentRedirect'));
      window.location.assign(result.gateway_url);
    } catch (error) {
      toast(error.message, 'error');
      setLoading(false);
    }
    return;
  }

  if (form.id === 'supportForm') {
    setLoading(true);
    try {
      await api('/api/messages', { method: 'POST', body: JSON.stringify({ topic: $('supportTopic').value, body: $('supportBody').value }) });
      form.reset();
      toast(t('messageSent'));
    } catch (error) { toast(error.message, 'error'); }
    finally { setLoading(false); }
    return;
  }

  if (form.id === 'adminLoginForm') {
    setLoading(true);
    try {
      const result = await api('/api/admin/login', { method: 'POST', body: JSON.stringify({ password: $('adminPassword').value }) });
      saveAdminToken(result.admin_token || '');
      closeModal();
      await openAdmin();
    } catch (error) { toast(error.message, 'error'); }
    finally { setLoading(false); }
    return;
  }

  if (form.id === 'productForm') {
    const id = form.dataset.productId;
    const body = {
      icon: $('productIcon').value, category: $('productCategory').value, name: $('productName').value,
      description: $('productDescription').value, price: $('productPrice').value, stock: $('productStock').value,
      sort_order: $('productSort').value, featured: $('productFeatured').checked, delivery_note: $('productDelivery').value,
      active: $('productActive').checked
    };
    setLoading(true);
    try {
      await api(id ? `/api/admin/products/${id}` : '/api/admin/products', { method: id ? 'PUT' : 'POST', body: JSON.stringify(body) });
      closeModal();
      toast(t('productSaved'));
      await Promise.all([loadAdmin(true), loadState(true)]);
    } catch (error) { toast(error.message, 'error'); }
    finally { setLoading(false); }
    return;
  }

  if (form.id === 'paymentMethodForm') {
    const id = form.dataset.methodId;
    const body = {
      method_key: $('paymentMethodKey').value,
      label: $('paymentMethodLabel').value,
      account_label: $('paymentMethodAccountLabel').value,
      account_value: $('paymentMethodValue').value,
      icon: $('paymentMethodIcon').value,
      subtitle: $('paymentMethodSubtitle').value,
      sort_order: $('paymentMethodSort').value,
      active: $('paymentMethodActive').checked
    };
    setLoading(true);
    try {
      await api(id ? `/api/admin/payment-methods/${id}` : '/api/admin/payment-methods', { method: id ? 'PUT' : 'POST', body: JSON.stringify(body) });
      closeModal();
      toast('Payment method saved.');
      await Promise.all([loadAdmin(true), loadState(true)]);
    } catch (error) { toast(error.message, 'error'); }
    finally { setLoading(false); }
    return;
  }

  if (form.id === 'homepageCardForm') {
    const id = form.dataset.cardId;
    const body = {
      icon: $('homepageCardIcon').value,
      title: $('homepageCardTitle').value,
      description: $('homepageCardDescription').value,
      sort_order: $('homepageCardSort').value,
      active: $('homepageCardActive').checked
    };
    setLoading(true);
    try {
      await api(id ? `/api/admin/homepage-cards/${id}` : '/api/admin/homepage-cards', { method: id ? 'PUT' : 'POST', body: JSON.stringify(body) });
      closeModal();
      toast('Homepage card saved.');
      await Promise.all([loadAdmin(true), loadState(true)]);
    } catch (error) { toast(error.message, 'error'); }
    finally { setLoading(false); }
    return;
  }

  if (form.id === 'walletAdjustForm') {
    setLoading(true);
    try {
      await api(`/api/admin/users/${encodeURIComponent(form.dataset.userId)}/adjust`, { method: 'POST', body: JSON.stringify({ amount: $('adjustmentAmount').value, reason: $('adjustmentReason').value }) });
      closeModal();
      toast('Wallet adjusted.');
      await Promise.all([loadAdmin(true), loadState(true)]);
    } catch (error) { toast(error.message, 'error'); }
    finally { setLoading(false); }
    return;
  }

  if (form.id === 'settingsForm') {
    const body = {
      store_name: $('settingStoreName').value, store_tagline: $('settingTagline').value, store_currency: $('settingCurrency').value,
      whatsapp: $('settingWhatsapp').value, telegram: $('settingTelegram').value, telegram_id: $('settingTelegramId').value, support_email: $('settingEmail').value,
      whatsapp_group_link: $('settingWhatsappGroup').value, support_admin_link: $('settingSupportAdmin').value, support_group_link: $('settingSupportGroup').value, support_notice: $('settingSupportNotice').value,
      theme_primary: $('settingPrimaryColor').value, theme_secondary: $('settingSecondaryColor').value, theme_surface: $('settingSurfaceColor').value,
      hero_title_line1: $('settingHeroLine1').value, hero_title_line2: $('settingHeroLine2').value, hero_description: $('settingHeroDescription').value,
      footer_text: $('settingFooterText').value, announcement: $('settingAnnouncement').value, payment_instructions: $('settingInstructions').value,
      post_purchase_message: $('settingPostPurchaseMessage').value,
      manual_payment_enabled: $('settingManualEnabled').checked, auto_payment_enabled: $('settingAutoEnabled').checked,
      maintenance_mode: $('settingMaintenance').checked, rainbow_enabled: false, blood_style_enabled: false
    };
    setLoading(true);
    try {
      await api('/api/admin/settings', { method: 'PUT', body: JSON.stringify(body) });
      toast(t('settingsSaved'));
      await Promise.all([loadAdmin(true), loadState(true)]);
    } catch (error) { toast(error.message, 'error'); }
    finally { setLoading(false); }
  }
}

function handlePaymentReturn() {
  const url = new URL(window.location.href);
  const result = url.searchParams.get('payment');
  if (!result) return;
  const messages = {
    success: 'Payment verified and wallet credited.', failed: 'Payment failed.', cancelled: 'Payment cancelled.', review: 'Payment received and held for risk review.',
    'verification-pending': 'Payment received; verification is pending.', 'verification-failed': 'Payment verification failed.', 'not-found': 'Payment record was not found.'
  };
  toast(messages[result] || result, result === 'success' ? 'success' : 'error');
  url.searchParams.delete('payment');
  history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
}

document.addEventListener('click', handleClick);
document.addEventListener('change', handleChange);
document.addEventListener('input', event => { if (event.target.id === 'productSearch') renderProducts(); });
document.addEventListener('submit', handleSubmit);
$('modal').addEventListener('click', event => { if (event.target === $('modal')) closeModal(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeModal(); });

setInterval(() => {
  if (!document.hidden && currentRoute === 'admin' && adminState) loadAdmin(true);
}, 60000);

applyLanguage();
handlePaymentReturn();
loadState();
