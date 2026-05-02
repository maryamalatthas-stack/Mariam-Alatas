/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Trash2, 
  ChevronRight, 
  Scale, 
  ChefHat, 
  ClipboardList,
  Save,
  TrendingUp,
  Calculator,
  Search,
  LayoutDashboard,
  Pencil,
  Globe,
  ChevronDown,
  Share2,
  Mail,
  FileSpreadsheet,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Ingredient, Recipe, RecipeIngredient } from './types';

// Storage Keys
const STORAGE_INGREDIENTS = 'bakecost_ingredients';
const STORAGE_RECIPES = 'bakecost_recipes';
const STORAGE_CURRENCY = 'bakecost_currency';
const STORAGE_LANG = 'bakecost_language';

const TRANSLATIONS = {
  en: {
    dashboard: 'Dashboard',
    inventory: 'Inventory',
    recipes: 'Recipes',
    welcome: 'Welcome Back',
    bakery_dashboard: 'Bakery Dashboard',
    new_calculation: 'NEW CALCULATION',
    recent_inventory: 'Recent Inventory',
    manage: 'Manage',
    quick_stats: 'Quick Stats',
    active_recipes: 'Active Recipes',
    raw_ingredients: 'Raw Ingredients',
    calculated_recipes: 'Calculated Recipes',
    explore_collection: 'Explore Collection',
    no_recipes: 'No recipes yet...',
    start_now: 'Start Now',
    cogs_per_pc: 'COGS per Pc',
    pieces_yield: 'Pieces Yield',
    raw_materials: 'Raw Materials',
    ingredient_inventory: 'Ingredient Inventory',
    currency: 'Currency',
    item_catalog: 'Item Catalog',
    total_weight: 'Total Weight',
    purchase_price: 'Purchase Price',
    cost_per_gr: 'Cost / Gr',
    action: 'Action',
    pantry_empty: 'Your pantry is currently empty.',
    production_management: 'Production Management',
    recipe_cogs_analysis: 'Recipe & COGS Analysis',
    saved_formulas: 'Saved Formulas',
    recipe_list_empty: 'Recipe collection is empty.',
    new_ingredient: 'New Ingredient',
    edit_ingredient: 'Edit Ingredient',
    ingredient_name: 'Ingredient Name',
    weight: 'Weight (gr)',
    price: 'Price',
    cancel: 'Cancel',
    add_item: 'Add Item',
    update_item: 'Update',
    recipe_builder: 'Recipe Builder',
    calculator: 'Calculator',
    recipe_label: 'Recipe Label',
    yield_pcs: 'Yield (PCS)',
    labor_cost: 'Labor Cost',
    packaging_pc: 'Packaging / Piece',
    ingredients: 'Ingredients',
    generate_calculation: 'GENERATE CALCULATION',
    cogs_per_piece: 'COGS PER PIECE',
    breakdown: 'Breakdown',
    weights_in_gr: 'Weights in GR',
    ingredient_subtotal: 'Ingredient Subtotal',
    operational_detail: 'Operational Detail',
    packaging: 'Packaging',
    labor_capex: 'Labor / CapEx',
    total_batch_cost: 'Total Batch Cost',
    unit_summary: 'Unit Summary',
    cogs_per_unit: 'COGS Per Unit',
    profit_tier: 'Profit Tier',
    margin: 'Margin',
    archive_recipe: 'Archive Recipe',
    search_placeholder: 'Search inventory items...',
    language: 'Language',
    business_health: 'Business Health',
    export_report: 'Export Report',
    send_to_email: 'Send to Email',
    google_sheet_link: 'Google Sheet Link',
    sending: 'Sending...',
    success: 'Success!',
    error: 'Error',
    enter_email: 'Enter your email',
    connect_google: 'Connect Google',
    export_options: 'Export Options',
    spreadsheet_created: 'Spreadsheet Created!',
  },
  id: {
    dashboard: 'Dasbor',
    inventory: 'Inventaris',
    recipes: 'Resep',
    welcome: 'Selamat Datang Kembali',
    bakery_dashboard: 'Dasbor Toko Roti',
    new_calculation: 'KALKULASI BARU',
    recent_inventory: 'Inventaris Terbaru',
    manage: 'Kelola',
    quick_stats: 'Statistik Cepat',
    active_recipes: 'Resep Aktif',
    raw_ingredients: 'Bahan Baku',
    calculated_recipes: 'Resep Terkalkulasi',
    explore_collection: 'Jelajahi Koleksi',
    no_recipes: 'Belum ada resep...',
    start_now: 'Mulai Sekarang',
    cogs_per_pc: 'COGS per Buah',
    pieces_yield: 'Hasil Potong',
    raw_materials: 'Bahan Baku',
    ingredient_inventory: 'Inventaris Bahan',
    currency: 'Mata Uang',
    item_catalog: 'Katalog Barang',
    total_weight: 'Total Berat',
    purchase_price: 'Harga Beli',
    cost_per_gr: 'Biaya / Gr',
    action: 'Aksi',
    pantry_empty: 'Dapur Anda saat ini kosong.',
    production_management: 'Manajemen Produksi',
    recipe_cogs_analysis: 'Analisis Resep & COGS',
    saved_formulas: 'Formula Tersimpan',
    recipe_list_empty: 'Koleksi resep kosong.',
    new_ingredient: 'Bahan Baru',
    edit_ingredient: 'Ubah Bahan',
    ingredient_name: 'Nama Bahan',
    weight: 'Berat (gr)',
    price: 'Harga',
    cancel: 'Batal',
    add_item: 'Tambah Barang',
    update_item: 'Perbarui',
    recipe_builder: 'Pembuat Resep',
    calculator: 'Kalkulator',
    recipe_label: 'Label Resep',
    yield_pcs: 'Hasil (PCS)',
    labor_cost: 'Biaya Tenaga Kerja',
    packaging_pc: 'Kemasan / Buah',
    ingredients: 'Bahan-bahan',
    generate_calculation: 'BUAT KALKULASI',
    cogs_per_piece: 'COGS PER BUAH',
    breakdown: 'Rincian',
    weights_in_gr: 'Berat dalam GR',
    ingredient_subtotal: 'Subtotal Bahan',
    operational_detail: 'Detail Operasional',
    packaging: 'Kemasan',
    labor_capex: 'Tenaga Kerja / CapEx',
    total_batch_cost: 'Total Biaya Batch',
    unit_summary: 'Ringkasan Unit',
    cogs_per_unit: 'COGS Per Unit',
    profit_tier: 'Tingkat Laba',
    margin: 'Margin',
    archive_recipe: 'Arsip Resep',
    search_placeholder: 'Cari barang inventaris...',
    language: 'Bahasa',
    business_health: 'Kesehatan Bisnis',
    export_report: 'Ekspor Laporan',
    send_to_email: 'Kirim ke Email',
    google_sheet_link: 'Tautan Google Sheet',
    sending: 'Mengirim...',
    success: 'Berhasil!',
    error: 'Kesalahan',
    enter_email: 'Masukkan email Anda',
    connect_google: 'Hubungkan Google',
    export_options: 'Opsi Ekspor',
    spreadsheet_created: 'Spreadsheet Dibuat!',
  },
  ar: {
    dashboard: 'لوحة القيادة',
    inventory: 'المخزون',
    recipes: 'الوصفات',
    welcome: 'مرحباً بعودتك',
    bakery_dashboard: 'لوحة تحكم المخبز',
    new_calculation: 'حساب جديد',
    recent_inventory: 'المخزون الأخير',
    manage: 'إدارة',
    quick_stats: 'إحصائيات سريعة',
    active_recipes: 'الوصفات النشطة',
    raw_ingredients: 'المواد الخام',
    calculated_recipes: 'الوصفات المحسوبة',
    explore_collection: 'استكشاف المجموعة',
    no_recipes: 'لا توجد وصفات بعد...',
    start_now: 'ابدأ الآن',
    cogs_per_pc: 'تكلفة القطعة',
    pieces_yield: 'كمية الإنتاج',
    raw_materials: 'المواد الخام',
    ingredient_inventory: 'مخزون المكونات',
    currency: 'العملة',
    item_catalog: 'كتالوج العناصر',
    total_weight: 'الوزن الإجمالي',
    purchase_price: 'سعر الشراء',
    cost_per_gr: 'التكلفة / جرام',
    action: 'إجراء',
    pantry_empty: 'المخزن الخاص بك فارغ حالياً.',
    production_management: 'إدارة الإنتاج',
    recipe_cogs_analysis: 'تحليل الوصفات والتكلفة',
    saved_formulas: 'الصيغ المحفوظة',
    recipe_list_empty: 'مجموعة الوصفات فارغة.',
    new_ingredient: 'مكون جديد',
    edit_ingredient: 'تعديل المكون',
    ingredient_name: 'اسم المكون',
    weight: 'الوزن (جرام)',
    price: 'السعر',
    cancel: 'إلغاء',
    add_item: 'إضافة عنصر',
    update_item: 'تحديث',
    recipe_builder: 'منشئ الوصفات',
    calculator: 'الحاسبة',
    recipe_label: 'اسم الوصفة',
    yield_pcs: 'الإنتاج (قطع)',
    labor_cost: 'تكلفة العمالة',
    packaging_pc: 'التغليف / قطعة',
    ingredients: 'المكونات',
    generate_calculation: 'إجراء الحساب',
    cogs_per_piece: 'التكلفة المباشرة للقطعة',
    breakdown: 'التفاصيل',
    weights_in_gr: 'الأوزان بالغرام',
    ingredient_subtotal: 'إجمالي المكونات',
    operational_detail: 'التفاصيل التشغيلية',
    packaging: 'التغليف',
    labor_capex: 'العمالة / النفقات',
    total_batch_cost: 'إجمالي تكلفة الدفعة',
    unit_summary: 'ملخص الوحدة',
    cogs_per_unit: 'التكلفة لكل وحدة',
    profit_tier: 'مستوى الربح',
    margin: 'الهامش',
    archive_recipe: 'أرشفة الوصفة',
    search_placeholder: 'البحث عن عناصر المخزون...',
    language: 'اللغة',
    business_health: 'صحة العمل',
    export_report: 'تصدير التقرير',
    send_to_email: 'إرسال إلى البريد الإلكتروني',
    google_sheet_link: 'رابط جدول بيانات جوجل',
    sending: 'جاري الإرسال...',
    success: 'تم بنجاح!',
    error: 'خطأ',
    enter_email: 'أدخل بريدك الإلكتروني',
    connect_google: 'ربط جوجل',
    export_options: 'خيارات التصدير',
    spreadsheet_created: 'تم إنشاء جدول البيانات!',
  }
};

const CURRENCIES = [
  { code: 'AED', symbol: 'DH', decimals: 2 },
  { code: 'AFN', symbol: '؋', decimals: 2 },
  { code: 'ARS', symbol: '$', decimals: 2 },
  { code: 'AUD', symbol: 'A$', decimals: 2 },
  { code: 'BDT', symbol: '৳', decimals: 2 },
  { code: 'BRL', symbol: 'R$', decimals: 2 },
  { code: 'CAD', symbol: 'C$', decimals: 2 },
  { code: 'CHF', symbol: 'Fr', decimals: 2 },
  { code: 'CLP', symbol: '$', decimals: 0 },
  { code: 'CNY', symbol: '¥', decimals: 2 },
  { code: 'COP', symbol: '$', decimals: 2 },
  { code: 'CZK', symbol: 'Kč', decimals: 2 },
  { code: 'DKK', symbol: 'kr', decimals: 2 },
  { code: 'DOP', symbol: 'RD$', decimals: 2 },
  { code: 'EGP', symbol: 'E£', decimals: 2 },
  { code: 'EUR', symbol: '€', decimals: 2 },
  { code: 'GBP', symbol: '£', decimals: 2 },
  { code: 'HKD', symbol: 'HK$', decimals: 2 },
  { code: 'HUF', symbol: 'Ft', decimals: 0 },
  { code: 'IDR', symbol: 'Rp', decimals: 0 },
  { code: 'ILS', symbol: '₪', decimals: 2 },
  { code: 'INR', symbol: '₹', decimals: 2 },
  { code: 'IQD', symbol: 'ع.د', decimals: 3 },
  { code: 'IRR', symbol: '﷼', decimals: 2 },
  { code: 'ISK', symbol: 'kr', decimals: 0 },
  { code: 'JMD', symbol: 'J$', decimals: 2 },
  { code: 'JOD', symbol: 'JD', decimals: 3 },
  { code: 'JPY', symbol: '¥', decimals: 0 },
  { code: 'KES', symbol: 'KSh', decimals: 2 },
  { code: 'KHR', symbol: '៛', decimals: 2 },
  { code: 'KRW', symbol: '₩', decimals: 0 },
  { code: 'KWD', symbol: 'KD', decimals: 3 },
  { code: 'LBP', symbol: 'L£', decimals: 2 },
  { code: 'LKR', symbol: '₨', decimals: 2 },
  { code: 'MAD', symbol: 'DH', decimals: 2 },
  { code: 'MXN', symbol: '$', decimals: 2 },
  { code: 'MYR', symbol: 'RM', decimals: 2 },
  { code: 'NOK', symbol: 'kr', decimals: 2 },
  { code: 'NZD', symbol: 'NZ$', decimals: 2 },
  { code: 'OMR', symbol: 'RO', decimals: 3 },
  { code: 'PEN', symbol: 'S/', decimals: 2 },
  { code: 'PHP', symbol: '₱', decimals: 2 },
  { code: 'PKR', symbol: '₨', decimals: 2 },
  { code: 'PLN', symbol: 'zł', decimals: 2 },
  { code: 'PYG', symbol: '₲', decimals: 0 },
  { code: 'QAR', symbol: 'QR', decimals: 2 },
  { code: 'RUB', symbol: '₽', decimals: 2 },
  { code: 'SAR', symbol: 'SR', decimals: 2 },
  { code: 'SEK', symbol: 'kr', decimals: 2 },
  { code: 'SGD', symbol: 'S$', decimals: 2 },
  { code: 'THB', symbol: '฿', decimals: 2 },
  { code: 'TND', symbol: 'DT', decimals: 3 },
  { code: 'TRY', symbol: '₺', decimals: 2 },
  { code: 'TWD', symbol: 'NT$', decimals: 2 },
  { code: 'UAH', symbol: '₴', decimals: 2 },
  { code: 'USD', symbol: '$', decimals: 2 },
  { code: 'VND', symbol: '₫', decimals: 0 },
  { code: 'ZAR', symbol: 'R', decimals: 2 },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'ingredients' | 'recipes'>('dashboard');
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [currencyCode, setCurrencyCode] = useState('IDR');
  const [lang, setLang] = useState<keyof typeof TRANSLATIONS>('en');
  const [searchQuery, setSearchQuery] = useState('');

  const t = useMemo(() => TRANSLATIONS[lang], [lang]);

  const currency = useMemo(() => 
    CURRENCIES.find(c => c.code === currencyCode) || CURRENCIES[0], 
  [currencyCode]);

  // Local Storage Loading
  useEffect(() => {
    const savedIngredients = localStorage.getItem(STORAGE_INGREDIENTS);
    const savedRecipes = localStorage.getItem(STORAGE_RECIPES);
    const savedCurrency = localStorage.getItem(STORAGE_CURRENCY);
    const savedLang = localStorage.getItem(STORAGE_LANG) as keyof typeof TRANSLATIONS;
    
    if (savedIngredients) setIngredients(JSON.parse(savedIngredients));
    if (savedRecipes) setRecipes(JSON.parse(savedRecipes));
    if (savedCurrency) setCurrencyCode(savedCurrency);
    if (savedLang && TRANSLATIONS[savedLang]) setLang(savedLang);
  }, []);

  // Set document direction for Arabic
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_INGREDIENTS, JSON.stringify(ingredients));
  }, [ingredients]);

  useEffect(() => {
    localStorage.setItem(STORAGE_RECIPES, JSON.stringify(recipes));
  }, [recipes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_CURRENCY, currencyCode);
  }, [currencyCode]);

  useEffect(() => {
    localStorage.setItem(STORAGE_LANG, lang);
  }, [lang]);

  const formatPrice = (price: number) => {
    return `${currency.symbol} ${price.toLocaleString(undefined, {
      minimumFractionDigits: currency.decimals,
      maximumFractionDigits: currency.decimals,
    })}`;
  };

  // Ingredient Helpers
  const addIngredient = (name: string, totalWeight: number, totalPrice: number) => {
    const newIngredient: Ingredient = {
      id: crypto.randomUUID(),
      name,
      totalWeight,
      totalPrice,
    };
    setIngredients([...ingredients, newIngredient]);
  };

  const updateIngredient = (id: string, name: string, totalWeight: number, totalPrice: number) => {
    setIngredients(ingredients.map(ing => 
      ing.id === id ? { ...ing, name, totalWeight, totalPrice } : ing
    ));
  };

  const removeIngredient = (id: string) => {
    setIngredients(ingredients.filter(ing => ing.id !== id));
    // Also remove from recipes
    setRecipes(recipes.map(recipe => ({
      ...recipe,
      ingredients: recipe.ingredients.filter(ri => ri.ingredientId !== id)
    })));
  };

  const getPricePerGram = (ingredient: Ingredient) => {
    if (!ingredient || ingredient.totalWeight === 0) return 0;
    return ingredient.totalPrice / ingredient.totalWeight;
  };

  // Recipe Helpers
  const addRecipe = (recipe: Omit<Recipe, 'id'>) => {
    setRecipes([...recipes, { ...recipe, id: crypto.randomUUID() }]);
  };

  const removeRecipe = (id: string) => {
    setRecipes(recipes.filter(r => r.id !== id));
  };

  // Calculations
  const calculateRecipeCosts = (recipe: Recipe) => {
    let totalIngredientCost = 0;
    const breakdown = recipe.ingredients.map(ri => {
      const ingredient = ingredients.find(ing => ing.id === ri.ingredientId);
      const pricePerGram = ingredient ? getPricePerGram(ingredient) : 0;
      const cost = pricePerGram * ri.weight;
      totalIngredientCost += cost;
      return {
        name: ingredient?.name || 'Unknown',
        weight: ri.weight,
        cost
      };
    });

    const totalCost = totalIngredientCost + recipe.operationalCost + (recipe.packagingPerPc * recipe.yield);
    const hppPerPc = totalCost / (recipe.yield || 1);

    return {
      breakdown,
      totalIngredientCost,
      totalCost,
      hppPerPc,
      margins: [
        { percentage: 30, price: hppPerPc * 1.3 },
        { percentage: 50, price: hppPerPc * 1.5 },
        { percentage: 100, price: hppPerPc * 2.0 }
      ]
    };
  };

  return (
    <div className="min-h-screen pb-20 md:pb-0 relative">
      {/* Global Language Dropdown - Top Right */}
      <div className={`fixed top-6 ${lang === 'ar' ? 'left-6' : 'right-6'} z-[60]`}>
        <div className="relative group">
          <button className="flex items-center gap-2 bg-white border-2 border-bakery-wheat px-3 py-2 rounded-xl shadow-sm hover:border-bakery-accent transition-all cursor-pointer">
            <Globe size={16} className="text-bakery-accent" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-bakery-brown">
              {lang === 'en' && '🇺🇸 EN'}
              {lang === 'id' && '🇮🇩 ID'}
              {lang === 'ar' && '🇸🇦 AR'}
            </span>
            <ChevronDown size={14} className="text-bakery-wheat group-hover:text-bakery-accent transition-colors" />
          </button>
          
          <div className={`absolute top-full mt-2 ${lang === 'ar' ? 'left-0' : 'right-0'} bg-white border-2 border-bakery-wheat rounded-xl shadow-xl py-2 w-40 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50`}>
            <button 
              onClick={() => setLang('en')}
              className={`w-full px-4 py-2 text-left text-xs font-bold hover:bg-bakery-cream transition-colors flex items-center gap-2 ${lang === 'en' ? 'text-bakery-accent' : 'text-bakery-brown'}`}
            >
              🇺🇸 English
            </button>
            <button 
              onClick={() => setLang('id')}
              className={`w-full px-4 py-2 text-left text-xs font-bold hover:bg-bakery-cream transition-colors flex items-center gap-2 ${lang === 'id' ? 'text-bakery-accent' : 'text-bakery-brown'}`}
            >
              🇮🇩 Indonesia
            </button>
            <button 
              onClick={() => setLang('ar')}
              className={`w-full px-4 py-2 text-left text-xs font-bold hover:bg-bakery-cream transition-colors flex items-center gap-2 ${lang === 'ar' ? 'text-bakery-accent' : 'text-bakery-brown'}`}
            >
              🇸🇦 العربية
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row min-h-screen">
        {/* Sidebar / Navigation */}
        <nav className="w-full md:w-64 bg-bakery-brown text-white p-8 sticky top-0 z-50 md:h-screen shrink-0 border-r-8 border-bakery-wheat md:border-r-0">
          <div className="flex flex-col mb-12">
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-bakery-accent mb-1">Professional Cost Manager</span>
            <h1 className="text-3xl font-serif font-bold italic leading-tight">BakeCost Pro</h1>
          </div>

          <div className="flex md:flex-col gap-3 overflow-x-auto no-scrollbar">
            <NavButton 
              active={activeTab === 'dashboard'} 
              onClick={() => setActiveTab('dashboard')}
              icon={<LayoutDashboard size={18} />}
              label={t.dashboard}
            />
            <NavButton 
              active={activeTab === 'ingredients'} 
              onClick={() => setActiveTab('ingredients')}
              icon={<Scale size={18} />}
              label={t.inventory}
            />
            <NavButton 
              active={activeTab === 'recipes'} 
              onClick={() => setActiveTab('recipes')}
              icon={<ClipboardList size={18} />}
              label={t.recipes}
            />
          </div>

          <div className="mt-auto hidden md:block pt-10">
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-[10px] uppercase font-bold text-bakery-wheat/40 mb-2">{t.business_health}</p>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xl font-bold">{recipes.length}</p>
                  <p className="text-[10px] text-bakery-wheat/60 font-medium">{t.active_recipes}</p>
                </div>
                <TrendingUp size={24} className="text-bakery-accent" />
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 p-8 md:p-12 transition-all">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-10"
              >
                <header className="flex justify-between items-end border-b-2 border-bakery-wheat pb-6">
                  <div>
                    <span className="bento-header">{t.welcome}</span>
                    <h2 className="text-4xl serif-italic">{t.bakery_dashboard}</h2>
                  </div>
                  <button onClick={() => setActiveTab('recipes')} className="btn-primary">
                    <Plus size={18} /> {t.new_calculation}
                  </button>
                </header>

                <div className="grid grid-cols-12 gap-6 h-auto">
                  <div className="col-span-12 md:col-span-8 bakery-card bg-gradient-to-br from-white to-bakery-cream">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="serif-italic text-2xl">{t.recent_inventory}</h3>
                      <button onClick={() => setActiveTab('ingredients')} className="text-bakery-accent font-bold text-xs flex items-center gap-1 uppercase tracking-widest hover:underline">
                        {t.manage} <ChevronRight size={14} />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                      {ingredients.slice(0, 6).map(ing => (
                        <div key={ing.id} className="p-4 bg-bakery-cream/40 rounded-xl border border-bakery-wheat/50">
                          <p className="text-[10px] font-bold text-bakery-accent uppercase mb-1">{ing.name}</p>
                          <p className="font-bold">{formatPrice(getPricePerGram(ing))}<span className="text-[10px] opacity-40 ml-1">/gr</span></p>
                        </div>
                      ))}
                      {ingredients.length === 0 && <p className="col-span-full py-10 text-center opacity-40 italic">{t.pantry_empty}</p>}
                    </div>
                  </div>

                  <div className="col-span-12 md:col-span-4 bakery-card bg-bakery-brown text-white flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-bakery-accent tracking-widest mb-4 block">{t.quick_stats}</span>
                      <div className="space-y-6">
                        <div>
                          <div className="text-4xl font-serif font-bold italic tracking-tight">{recipes.length}</div>
                          <div className="text-[11px] opacity-60 uppercase font-medium">{t.active_recipes}</div>
                        </div>
                        <div className="border-t border-white/10 pt-4">
                          <div className="text-4xl font-serif font-bold italic tracking-tight text-bakery-wheat">{ingredients.length}</div>
                          <div className="text-[11px] opacity-60 uppercase font-medium">{t.raw_ingredients}</div>
                        </div>
                      </div>
                    </div>
                    <TrendingUp size={48} className="text-bakery-accent mt-8 self-end opacity-20" />
                  </div>
                </div>

                <section className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="serif-italic text-2xl">{t.calculated_recipes}</h3>
                    <button onClick={() => setActiveTab('recipes')} className="text-bakery-accent font-bold text-xs uppercase tracking-widest hover:underline">{t.explore_collection}</button>
                  </div>
                  {recipes.length === 0 ? (
                    <div className="bakery-card p-20 flex flex-col items-center justify-center text-center opacity-60 border-dashed">
                      <p className="serif-italic text-xl mb-2">{t.no_recipes}</p>
                      <button onClick={() => setActiveTab('recipes')} className="text-bakery-accent text-sm font-bold uppercase tracking-widest">{t.start_now}</button>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {recipes.slice(0, 6).map(recipe => {
                        const { hppPerPc } = calculateRecipeCosts(recipe);
                        return (
                          <div key={recipe.id} className="bakery-card group hover:border-bakery-brown transition-all cursor-pointer bg-[#F7F2ED]" onClick={() => setActiveTab('recipes')}>
                            <span className="text-[10px] uppercase font-bold text-bakery-accent tracking-widest mb-2 block">{recipe.yield} {t.pieces_yield}</span>
                            <h4 className="serif-italic text-xl mb-4 group-hover:text-bakery-accent transition-colors">{recipe.name}</h4>
                            <div className="border-t border-bakery-wheat pt-4 flex justify-between items-end">
                              <div>
                                <p className="text-[10px] font-bold text-bakery-brown/40 uppercase">{t.cogs_per_pc}</p>
                                <p className="text-xl font-bold">{formatPrice(hppPerPc)}</p>
                              </div>
                              <ChevronRight className="text-bakery-wheat group-hover:text-bakery-brown transition-colors" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </section>
              </motion.div>
            )}

            {activeTab === 'ingredients' && (
              <motion.div 
                key="inventory"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                  <div className="flex gap-6 items-end">
                    <div>
                      <span className="bento-header">{t.ingredient_inventory}</span>
                      <h2 className="text-4xl serif-italic">{t.raw_materials}</h2>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold uppercase text-bakery-accent">{t.currency}</span>
                      <select 
                        value={currencyCode}
                        onChange={(e) => setCurrencyCode(e.target.value)}
                        className="py-1 px-2 text-xs font-bold border-bakery-accent/30 bg-bakery-cream"
                      >
                        {CURRENCIES.map(c => (
                          <option key={c.code} value={c.code}>{c.code} ({c.symbol})</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <IngredientForm onSave={(name, weight, price) => addIngredient(name, weight, price)} currency={currency} t={t} />
                </div>

                <div className="bakery-card p-0">
                  <div className="p-6 border-b border-bakery-wheat bg-bakery-cream/30 flex items-center gap-4">
                    <Search className="text-bakery-accent" size={20} />
                    <input 
                      type="text" 
                      placeholder={t.search_placeholder} 
                      className="bg-transparent border-none p-0 focus:ring-0 w-full text-base"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-[#F7F2ED]">
                        <tr>
                          <th className="px-6 py-4">{t.item_catalog}</th>
                          <th className="px-6 py-4">{t.total_weight}</th>
                          <th className="px-6 py-4">{t.purchase_price}</th>
                          <th className="px-6 py-4 uppercase">{t.cost_per_gr}</th>
                          <th className="w-20 px-6 py-4 text-center">{t.action}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F2EDE8]">
                        {ingredients
                          .filter(ing => ing.name.toLowerCase().includes(searchQuery.toLowerCase()))
                          .map(ing => (
                          <tr key={ing.id} className="hover:bg-bakery-cream/40 transition-colors">
                            <td className="px-6 py-4 font-serif font-bold text-lg">{ing.name}</td>
                            <td className="px-6 py-4">{ing.totalWeight.toLocaleString()} gr</td>
                            <td className="px-6 py-4">{formatPrice(ing.totalPrice)}</td>
                            <td className="px-6 py-4">
                              <span className="px-3 py-1 bg-bakery-accent/10 rounded-full text-bakery-accent font-bold text-xs border border-bakery-accent/20">
                                {formatPrice(getPricePerGram(ing))}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <IngredientForm 
                                  ingredient={ing} 
                                  onSave={(name, weight, price) => updateIngredient(ing.id, name, weight, price)} 
                                  currency={currency}
                                  t={t}
                                />
                                <button 
                                  onClick={() => removeIngredient(ing.id)}
                                  className="p-2 text-bakery-accent hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                  title="Delete Item"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {ingredients.length === 0 && (
                          <tr>
                            <td colSpan={5} className="py-24 text-center serif-italic text-bakery-accent opacity-40">
                              {t.pantry_empty}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'recipes' && (
              <motion.div 
                key="recipes"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                  <div>
                    <span className="bento-header">{t.production_management}</span>
                    <h2 className="text-4xl serif-italic">{t.recipe_cogs_analysis}</h2>
                  </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-8 items-start">
                  <div className="lg:col-span-7">
                    <RecipeForm ingredients={ingredients} onAdd={addRecipe} formatPrice={formatPrice} currency={currency} t={t} />
                  </div>
                  
                  <div className="lg:col-span-5 space-y-6">
                    <h3 className="serif-italic text-2xl px-2">{t.saved_formulas}</h3>
                    <div className="space-y-6">
                      {recipes.map(recipe => (
                        <RecipeCard 
                          key={recipe.id} 
                          recipe={recipe} 
                          onDelete={() => removeRecipe(recipe.id)}
                          costs={calculateRecipeCosts(recipe)}
                          formatPrice={formatPrice}
                          t={t}
                        />
                      ))}
                      {recipes.length === 0 && (
                        <div className="bakery-card p-16 text-center serif-italic text-bakery-accent opacity-40 border-dashed">
                          {t.recipe_list_empty}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
      
      {/* Mobile Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-bakery-brown border-t border-white/10 flex items-center justify-around px-4 z-50">
        <MobileNavButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<LayoutDashboard size={20} />} />
        <MobileNavButton active={activeTab === 'ingredients'} onClick={() => setActiveTab('ingredients')} icon={<Scale size={20} />} />
        <MobileNavButton active={activeTab === 'recipes'} onClick={() => setActiveTab('recipes')} icon={<ClipboardList size={20} />} />
      </div>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`
        flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm w-full
        ${active 
          ? 'bg-bakery-accent text-bakery-brown shadow-lg shadow-bakery-accent/30' 
          : 'text-bakery-wheat/60 hover:text-white hover:bg-white/5'}
      `}
    >
      {icon}
      {label}
    </button>
  );
}

function MobileNavButton({ active, onClick, icon }: { active: boolean, onClick: () => void, icon: React.ReactNode }) {
  return (
    <button 
      onClick={onClick}
      className={`p-3 rounded-xl transition-all ${active ? 'bg-bakery-accent text-bakery-brown' : 'text-bakery-wheat/60'}`}
    >
      {icon}
    </button>
  );
}

function IngredientForm({ onSave, ingredient, currency, t }: { onSave: (name: string, weight: number, price: number) => void, ingredient?: Ingredient, currency: any, t: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ 
    name: ingredient?.name || '', 
    weight: ingredient?.totalWeight.toString() || '', 
    price: ingredient?.totalPrice.toString() || '' 
  });

  // Keep form in sync if ingredient changes (rare but good for correctness)
  useEffect(() => {
    if (ingredient) {
      setFormData({
        name: ingredient.name,
        weight: ingredient.totalWeight.toString(),
        price: ingredient.totalPrice.toString()
      });
    }
  }, [ingredient]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.weight || !formData.price) return;
    onSave(formData.name, parseFloat(formData.weight), parseFloat(formData.price));
    if (!ingredient) {
      setFormData({ name: '', weight: '', price: '' });
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className={ingredient ? "p-2 text-bakery-accent hover:text-bakery-brown hover:bg-bakery-cream rounded-lg transition-all" : "btn-primary"}
        title={ingredient ? t.edit_ingredient : t.new_ingredient}
      >
        {ingredient ? <Pencil size={18} /> : <><Plus size={18} /> {t.raw_ingredients}</>}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className={`absolute top-14 right-0 w-80 bakery-card p-8 z-[100] shadow-2xl ${ingredient ? 'bg-white' : ''}`}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <h4 className="serif-italic border-b-2 border-bakery-wheat pb-3 mb-6">
                {ingredient ? t.edit_ingredient : t.new_ingredient}
              </h4>
              <div className="space-y-2 text-left">
                <label className="bento-header">{t.ingredient_name}</label>
                <input 
                  type="text" 
                  autoFocus
                  placeholder="e.g. Bread Flour" 
                  className="w-full"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4 text-left">
                <div className="space-y-2">
                  <label className="bento-header">{t.weight}</label>
                  <input 
                    type="number" 
                    step="any"
                    placeholder="1000" 
                    className="w-full"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="bento-header">{t.price} ({currency.symbol})</label>
                  <input 
                    type="number" 
                    step="any"
                    placeholder="25000" 
                    className="w-full"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsOpen(false)} className="flex-1 btn-secondary text-[10px] uppercase tracking-widest justify-center">{t.cancel}</button>
                <button type="submit" className="flex-[2] btn-primary text-[10px] uppercase tracking-widest justify-center">
                  {ingredient ? t.update_item : t.add_item}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function RecipeForm({ ingredients, onAdd, formatPrice, currency, t }: { ingredients: Ingredient[], onAdd: (recipe: Omit<Recipe, 'id'>) => void, formatPrice: (p: number) => string, currency: any, t: any }) {
  const [formData, setFormData] = useState({
    name: '',
    yield: '',
    packaging: '',
    labor: '',
    selectedIngredients: [] as RecipeIngredient[]
  });

  const addIngredientToRecipe = () => {
    setFormData({
      ...formData,
      selectedIngredients: [...formData.selectedIngredients, { ingredientId: '', weight: 0 }]
    });
  };

  const updateSelectedIngredient = (index: number, field: 'ingredientId' | 'weight', value: string | number) => {
    const list = [...formData.selectedIngredients];
    (list[index] as any)[field] = value;
    setFormData({ ...formData, selectedIngredients: list });
  };

  const removeSelectedIngredient = (index: number) => {
    setFormData({
      ...formData,
      selectedIngredients: formData.selectedIngredients.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || formData.selectedIngredients.length === 0) return;
    onAdd({
      name: formData.name,
      yield: parseFloat(formData.yield) || 1,
      packagingPerPc: parseFloat(formData.packaging) || 0,
      operationalCost: parseFloat(formData.labor) || 0,
      ingredients: formData.selectedIngredients.filter(si => si.ingredientId && si.weight > 0)
    });
    setFormData({ name: '', yield: '', packaging: '', labor: '', selectedIngredients: [] });
  };

  return (
    <form onSubmit={handleSubmit} className="bakery-card p-10 space-y-10 h-fit bg-[#FAF9F6]">
      <div className="flex flex-col gap-2 mb-6">
        <span className="bento-header">{t.calculator}</span>
        <h3 className="text-3xl serif-italic">{t.recipe_builder}</h3>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="bento-header">{t.recipe_label}</label>
            <input 
              type="text" 
              placeholder="e.g. Sourdough Loaf" 
              className="w-full text-lg font-medium"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="bento-header">{t.yield_pcs}</label>
              <input 
                type="number" 
                placeholder="1" 
                className="w-full"
                value={formData.yield}
                onChange={(e) => setFormData({ ...formData, yield: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="bento-header">{t.labor_cost}</label>
              <input 
                type="number" 
                placeholder={currency.symbol} 
                className="w-full"
                value={formData.labor}
                onChange={(e) => setFormData({ ...formData, labor: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="bento-header">{t.packaging_pc}</label>
            <input 
              type="number" 
              placeholder={currency.symbol} 
              className="w-full"
              value={formData.packaging}
              onChange={(e) => setFormData({ ...formData, packaging: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-4 bg-white border border-bakery-wheat p-6 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <h4 className="bento-header">{t.ingredients}</h4>
            <button type="button" onClick={addIngredientToRecipe} className="bg-bakery-brown text-white p-1 rounded transition-colors">
              <Plus size={16} />
            </button>
          </div>
          
          <div className="space-y-4 max-h-72 overflow-y-auto pr-2 no-scrollbar">
            {formData.selectedIngredients.map((item, idx) => (
              <div key={idx} className="flex gap-2 items-center border-b border-[#F2EDE8] pb-3 last:border-0 last:pb-0">
                <select 
                  className="flex-1 text-sm border-none bg-transparent focus:ring-0 font-medium"
                  value={item.ingredientId}
                  onChange={(e) => updateSelectedIngredient(idx, 'ingredientId', e.target.value)}
                >
                  <option value="">Select Ingredient</option>
                  {ingredients.map(ing => (
                    <option key={ing.id} value={ing.id}>{ing.name}</option>
                  ))}
                </select>
                <div className="flex items-center gap-1">
                  <input 
                    type="number" 
                    placeholder={t.weight} 
                    className="w-20 text-xs border-none bg-bakery-cream/30 focus:ring-1 focus:ring-bakery-accent/20 rounded py-1"
                    value={item.weight || ''}
                    onChange={(e) => updateSelectedIngredient(idx, 'weight', parseFloat(e.target.value))}
                  />
                  <span className="text-[10px] font-bold text-bakery-accent">GR</span>
                </div>
                <button type="button" onClick={() => removeSelectedIngredient(idx)} className="text-bakery-accent hover:text-red-500 ml-1">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button type="submit" className="btn-primary w-full py-4 text-sm tracking-[0.1em]">
        <Save size={18} /> {t.generate_calculation}
      </button>
    </form>
  );
}

interface RecipeCardProps {
  key?: any;
  recipe: Recipe;
  onDelete: () => void;
  costs: any;
  formatPrice: (p: number) => string;
  t: any;
}

function RecipeCard({ recipe, onDelete, costs, formatPrice, t }: RecipeCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`bakery-card transition-all p-0 ${isExpanded ? 'ring-2 ring-bakery-brown' : 'hover:border-bakery-brown hover:shadow-md'}`}>
      <div className="p-6 flex justify-between items-center cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex gap-4 items-center">
          <div className="bg-bakery-wheat/30 px-3 py-1 rounded-lg text-right">
            <div className="text-[10px] uppercase font-bold text-bakery-accent tracking-tighter">Yield {recipe.yield}</div>
            <div className="font-serif font-bold italic text-sm">{recipe.name.split(' ')[0]}</div>
          </div>
          <div>
            <h4 className="serif-italic text-xl">{recipe.name}</h4>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-[10px] uppercase font-bold text-bakery-accent tracking-widest">{t.cogs_per_piece}</p>
            <p className="font-bold text-2xl text-bakery-brown">{formatPrice(costs.hppPerPc)}</p>
          </div>
          <motion.div animate={{ rotate: isExpanded ? 90 : 0 }}>
            <ChevronRight size={24} className="text-bakery-wheat" />
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-[#FDFBF7]"
          >
            <div className="p-8 border-t border-bakery-wheat space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Breakdown Section */}
                <div className="bg-white border border-bakery-wheat rounded-2xl p-6 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h5 className="serif-italic text-lg">{t.breakdown}</h5>
                    <span className="text-[10px] font-bold uppercase text-bakery-accent tracking-widest">{t.weights_in_gr}</span>
                  </div>
                  <table className="w-full text-xs">
                    <thead className="border-b border-[#F2EDE8]">
                      <tr>
                        <th className="pb-3 text-bakery-accent">{t.ingredients}</th>
                        <th className="pb-3 text-right text-bakery-accent">{t.weight}</th>
                        <th className="pb-3 text-right text-bakery-accent">{t.price}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F2EDE8]">
                      {costs.breakdown.map((item: any, i: number) => (
                        <tr key={i}>
                          <td className="py-3 font-medium text-bakery-brown">{item.name}</td>
                          <td className="py-3 text-right">{item.weight} gr</td>
                          <td className="py-3 text-right font-bold">{formatPrice(item.cost)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="mt-4 pt-4 border-t border-bakery-brown flex justify-between items-center">
                    <span className="serif-italic text-base">{t.ingredient_subtotal}</span>
                    <span className="font-bold text-lg">{formatPrice(costs.totalIngredientCost)}</span>
                  </div>
                </div>

                {/* Summary Section */}
                <div className="space-y-6">
                  <div className="bg-[#F7F2ED] border border-bakery-wheat rounded-2xl p-6 shadow-sm">
                    <h5 className="bento-header mb-4">{t.operational_detail}</h5>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">{t.packaging} ({recipe.yield} units)</span>
                        <span className="font-bold">{formatPrice(recipe.packagingPerPc * recipe.yield)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm italic">{t.labor_capex}</span>
                        <span className="font-bold">{formatPrice(recipe.operationalCost)}</span>
                      </div>
                      <div className="border-t border-bakery-wheat pt-4 flex justify-between items-center">
                        <span className="font-serif italic font-bold">{t.total_batch_cost}</span>
                        <span className="font-bold text-xl">{formatPrice(costs.totalCost)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-bakery-brown text-white rounded-2xl p-6 shadow-lg">
                    <h5 className="text-[10px] uppercase font-bold text-bakery-accent tracking-widest mb-3">{t.unit_summary}</h5>
                    <div className="text-4xl font-serif font-bold italic tracking-tight mb-1">{formatPrice(costs.hppPerPc)}</div>
                    <div className="text-[11px] opacity-60 uppercase font-bold tracking-widest">{t.cogs_per_unit} ({t.pieces_yield}: {recipe.yield})</div>
                  </div>
                </div>
              </div>

              {/* Profit Tiers */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {costs.margins.map((margin: any) => (
                  <div key={margin.percentage} className={`bakery-card p-6 ${margin.percentage === 50 ? 'bg-white ring-2 ring-bakery-brown' : 'bg-white'}`}>
                    <h2 className="bento-header mb-2">{margin.percentage}% {t.profit_tier}</h2>
                    <div className="text-3xl font-serif font-bold italic mb-1 text-bakery-brown">{formatPrice(Math.round(margin.price))}</div>
                    <div className="text-[11px] text-bakery-accent font-bold truncate">{t.margin}: {formatPrice(Math.round(margin.price - costs.hppPerPc))} / piece</div>
                    <div className="w-full bg-[#F2EDE8] h-1.5 mt-4 rounded-full overflow-hidden">
                      <div className="bg-bakery-accent h-full transition-all" style={{ width: `${margin.percentage}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-4 gap-4">
                <ExportButton recipe={recipe} costs={costs} t={t} />
                <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="flex items-center gap-2 text-bakery-accent hover:text-red-500 text-[10px] font-bold uppercase tracking-widest transition-colors">
                  <Trash2 size={16} /> {t.archive_recipe}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ExportButton({ recipe, costs, t }: { recipe: Recipe, costs: any, t: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sheetUrl, setSheetUrl] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Basic origin check for security
      if (!event.origin.endsWith('.run.app') && !event.origin.includes('localhost')) return;
      
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        handleExport();
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [recipe, costs]);

  const handleExport = async () => {
    setLoading(true);
    setStatus('idle');
    try {
      const response = await fetch('/api/export/sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipe, costs }),
      });

      if (response.status === 401) {
        const { url } = await (await fetch('/api/auth/google/url')).json();
        window.open(url, 'google_auth', 'width=600,height=700');
        setLoading(false);
        return;
      }

      if (!response.ok) throw new Error('Export failed');
      
      const { url } = await response.json();
      setSheetUrl(url);
      setStatus('success');
    } catch (err) {
      console.error(err);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async () => {
    if (!email || !sheetUrl) return;
    setLoading(true);
    setStatus('sending');
    try {
      const response = await fetch('/api/export/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: email,
          subject: `Bakery Report: ${recipe.name}`,
          body: `Here is the detailed cost breakdown for ${recipe.name}.`,
          spreadsheetUrl: sheetUrl
        }),
      });
      if (!response.ok) throw new Error('Email failed');
      setStatus('success');
    } catch (err) {
      console.error(err);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={(e) => { e.stopPropagation(); setIsOpen(true); }}
        className="flex items-center gap-2 text-bakery-accent hover:text-bakery-brown text-[10px] font-bold uppercase tracking-widest transition-colors"
      >
        <Share2 size={16} /> {t.export_report}
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-bakery-brown/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 border border-bakery-wheat overflow-hidden"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="serif-italic text-2xl">{t.export_options}</h3>
                <button onClick={() => setIsOpen(false)} className="text-bakery-accent hover:bg-bakery-cream p-1 rounded-full"><Plus className="rotate-45" size={24} /></button>
              </div>

              <div className="space-y-6">
                <div className="bg-bakery-cream/30 p-6 rounded-2xl border border-bakery-wheat">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-white p-3 rounded-xl shadow-sm">
                      <FileSpreadsheet className="text-bakery-accent" size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-bakery-brown">Google Sheets</h4>
                      <p className="text-[10px] text-bakery-accent uppercase font-bold tracking-widest">Create dynamic report</p>
                    </div>
                  </div>
                  
                  {!sheetUrl ? (
                    <button 
                      onClick={handleExport}
                      disabled={loading}
                      className="btn-primary w-full justify-center text-xs tracking-widest bg-bakery-brown text-white py-3"
                    >
                      {loading ? <Loader2 className="animate-spin" size={16} /> : <><Globe size={16} /> {t.connect_google}</>}
                    </button>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between bg-green-50 px-4 py-2 rounded-xl border border-green-100">
                        <span className="text-[10px] font-bold text-green-600 uppercase">{t.spreadsheet_created}</span>
                        <a href={sheetUrl} target="_blank" rel="noopener noreferrer" className="text-bakery-accent flex items-center gap-1 text-[10px] font-bold hover:underline">
                          VIEW <ExternalLink size={12} />
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {sheetUrl && (
                  <div className="bg-[#F7F2ED] p-6 rounded-2xl border border-bakery-wheat">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="bg-white p-3 rounded-xl shadow-sm">
                        <Mail className="text-bakery-accent" size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-bakery-brown">{t.send_to_email}</h4>
                        <p className="text-[10px] text-bakery-accent uppercase font-bold tracking-widest">Share with stakeholders</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <input 
                        type="email" 
                        placeholder={t.enter_email}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white border-bakery-wheat rounded-xl py-2 px-4 text-sm focus:ring-2 focus:ring-bakery-accent/30 outline-none"
                      />
                      <button 
                        onClick={handleSendEmail}
                        disabled={loading || !email}
                        className="btn-primary w-full justify-center text-xs tracking-widest bg-bakery-brown text-white py-3 disabled:opacity-50"
                      >
                        {loading && status === 'sending' ? <Loader2 className="animate-spin" size={16} /> : t.send_to_email}
                      </button>
                    </div>
                  </div>
                )}

                {status === 'success' && !loading && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-green-600 font-bold text-[10px] uppercase tracking-widest">
                    {t.success}
                  </motion.p>
                )}
                {status === 'error' && (
                  <p className="text-center text-red-500 font-bold text-[10px] uppercase tracking-widest">
                    {t.error}
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

