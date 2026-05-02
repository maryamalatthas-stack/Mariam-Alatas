import streamlit as st
import pandas as pd
import io
import uuid
import json

# --- PAGE CONFIG ---
st.set_page_config(page_title="BakeCost Pro", page_icon="🥖", layout="wide")

# --- INITIAL STATE ---
if 'ingredients' not in st.session_state:
    st.session_state.ingredients = [
        {'id': '1', 'name': 'Bread Flour', 'weight': 1000, 'price': 15000},
        {'id': '2', 'name': 'Butter (Salted)', 'weight': 250, 'price': 45000},
        {'id': '3', 'name': 'Sugar', 'weight': 1000, 'price': 18000}
    ]
if 'recipes' not in st.session_state:
    st.session_state.recipes = []

# --- CURRENCIES ---
CURRENCIES = {
    'IDR': {'symbol': 'Rp', 'decimals': 0},
    'USD': {'symbol': '$', 'decimals': 2},
    'AED': {'symbol': 'DH', 'decimals': 2},
    'SAR': {'symbol': 'SR', 'decimals': 2},
    'GBP': {'symbol': '£', 'decimals': 2},
    'EUR': {'symbol': '€', 'decimals': 2},
}

# --- TRANSLATIONS ---
TRANSLATIONS = {
    'en': {
        'dashboard': 'Dashboard', 'inventory': 'Inventory', 'recipes': 'Recipes',
        'welcome': 'Welcome Back', 'bakery_dashboard': 'Bakery Dashboard',
        'new_calculation': 'NEW CALCULATION', 'recent_inventory': 'Recent Inventory',
        'manage': 'Manage', 'quick_stats': 'Quick Stats', 'active_recipes': 'Active Recipes',
        'raw_ingredients': 'Raw Ingredients', 'calculated_recipes': 'Calculated Recipes',
        'item_catalog': 'Item Catalog', 'total_weight': 'Total Weight',
        'purchase_price': 'Purchase Price', 'cost_per_gr': 'Cost / Gr',
        'pantry_empty': 'Your pantry is currently empty.', 'recipe_builder': 'Recipe Builder',
        'recipe_label': 'Recipe Label', 'yield': 'Yield (PCS)', 'labor': 'Labor Cost',
        'packaging': 'Packaging/Pc', 'save': 'Generate Calculation',
        'cogs_per_pc': 'COGS PER PIECE', 'breakdown': 'Breakdown', 'margin': 'Margin',
        'download_excel': 'Download Excel Report', 'copy_summary': 'Share Summary',
        'profit_tier': 'Profit Tier'
    },
    'id': {
        'dashboard': 'Dasbor', 'inventory': 'Inventaris', 'recipes': 'Resep',
        'welcome': 'Selamat Datang Kembali', 'bakery_dashboard': 'Dasbor Toko Roti',
        'new_calculation': 'KALKULASI BARU', 'recent_inventory': 'Inventaris Terbaru',
        'manage': 'Kelola', 'quick_stats': 'Statistik Cepat', 'active_recipes': 'Resep Aktif',
        'raw_ingredients': 'Bahan Baku', 'calculated_recipes': 'Resep Terkalkulasi',
        'item_catalog': 'Katalog Barang', 'total_weight': 'Total Berat',
        'purchase_price': 'Harga Beli', 'cost_per_gr': 'Biaya / Gr',
        'pantry_empty': 'Dapur Anda saat ini kosong.', 'recipe_builder': 'Pembuat Resep',
        'recipe_label': 'Label Resep', 'yield': 'Hasil (PCS)', 'labor': 'Biaya Tenaga Kerja',
        'packaging': 'Kemasan / Buah', 'save': 'Buat Kalkulasi',
        'cogs_per_pc': 'COGS PER BUAH', 'breakdown': 'Rincian', 'margin': 'Margin',
        'download_excel': 'Unduh Laporan Excel', 'copy_summary': 'Salin Ringkasan',
        'profit_tier': 'Tingkat Laba'
    },
    'ar': {
        'dashboard': 'لوحة القيادة', 'inventory': 'المخزون', 'recipes': 'الوصفات',
        'welcome': 'مرحباً بعودتك', 'bakery_dashboard': 'لوحة تحكم المخبز',
        'new_calculation': 'حساب جديد', 'recent_inventory': 'المخزون الأخير',
        'manage': 'إدارة', 'quick_stats': 'إحصائيات سريعة', 'active_recipes': 'الوصفات النشطة',
        'raw_ingredients': 'المواد الخام', 'calculated_recipes': 'الوصفات المحسوبة',
        'item_catalog': 'كتالوج العناصر', 'total_weight': 'الوزن الإجمالي',
        'purchase_price': 'سعر الشراء', 'cost_per_gr': 'التكلفة / جرام',
        'pantry_empty': 'المخزن الخاص بك فارغ حالياً.', 'recipe_builder': 'منشئ الوصفات',
        'recipe_label': 'اسم الوصفة', 'yield': 'الإنتاج (قطع)', 'labor': 'تكلفة العمالة',
        'packaging': 'التغليف / قطعة', 'save': 'إجراء الحساب',
        'cogs_per_pc': 'التكلفة المباشرة للقطعة', 'breakdown': 'التفاصيل', 'margin': 'الهامش',
        'download_excel': 'تحميل تقرير Excel', 'copy_summary': 'نسخ الملخص',
        'profit_tier': 'مستوى الربح'
    }
}

# --- STYLES ---
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Inter:wght@400;700&display=swap');
    
    .stApp { background-color: #FAF9F6; font-family: 'Inter', sans-serif; }
    h1, h2, h3, .serif-italic { font-family: 'Playfair Display', serif; font-style: italic; color: #3D2B1F; }
    
    .stButton>button { 
        background-color: #8B5E3C; 
        color: white !important; 
        border-radius: 12px; 
        border: none; 
        padding: 0.75rem 1.5rem; 
        font-weight: bold; 
        text-transform: uppercase; 
        letter-spacing: 0.1em;
        transition: all 0.3s ease;
    }
    .stButton>button:hover { 
        background-color: #6F4B30; 
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(139, 94, 60, 0.2);
    }
    
    .bakery-card { 
        padding: 1.5rem; 
        border-radius: 1.25rem; 
        border: 1px solid #E2D1C3; 
        background: white; 
        margin-bottom: 1.25rem; 
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.04); 
    }
    
    .metric-val { font-size: 3rem; font-weight: 800; font-family: 'Playfair Display', serif; font-style: italic; color: #8B5E3C; line-height: 1; margin-bottom: 0.25rem; }
    .metric-label { font-size: 0.75rem; text-transform: uppercase; font-weight: 700; letter-spacing: 0.15em; color: rgba(61, 43, 31, 0.5); }
    
    [data-testid="stSidebar"] {
        background-color: #3D2B1F;
        border-right: 8px solid #E2D1C3;
    }
    [data-testid="stSidebar"] h1, [data-testid="stSidebar"] label, [data-testid="stSidebar"] p {
        color: #FAF9F6 !important;
    }
</style>
""", unsafe_allow_html=True)

# --- HELPERS ---
def format_curr(val, sym, dec=2):
    if dec == 0:
        return f"{sym} {val:,.0f}"
    return f"{sym} {val:,.{dec}f}"

def calculate_costs(recipe):
    ings = st.session_state.ingredients
    total_ing_cost = 0
    breakdown = []
    
    for ri in recipe['items']:
        ing = next((i for i in ings if i['id'] == ri['id']), None)
        if ing:
            cost_per_gr = ing['price'] / ing['weight'] if ing['weight'] > 0 else 0
            item_cost = cost_per_gr * ri['weight']
            total_ing_cost += item_cost
            breakdown.append({
                'name': ing['name'],
                'weight': ri['weight'],
                'unit_price': cost_per_gr,
                'total_cost': item_cost
            })
            
    batch_cost = total_ing_cost + recipe['labor'] + (recipe['packaging'] * recipe['yield'])
    hpp_per_pc = batch_cost / recipe['yield'] if recipe['yield'] > 0 else 0
    
    margins = [
        {'percentage': 30, 'price': hpp_per_pc / 0.7 if hpp_per_pc > 0 else 0},
        {'percentage': 50, 'price': hpp_per_pc / 0.5 if hpp_per_pc > 0 else 0},
        {'percentage': 100, 'price': hpp_per_pc * 2}
    ]
    
    return {
        'total_ing': total_ing_cost,
        'batch_cost': batch_cost,
        'hpp_pc': hpp_per_pc,
        'breakdown': breakdown,
        'margins': margins
    }

# --- EXPORT GENERATORS ---
def get_excel_report(recipe, costs, sym):
    output = io.BytesIO()
    with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
        # Sheet 1: Summary
        summary_rows = [
            ['Recipe Name', recipe['name']],
            ['Yield (PCS)', recipe['yield']],
            ['Labor Cost', recipe['labor']],
            ['Packaging/Pc', recipe['packaging']],
            ['', ''],
            ['--- CALCULATED TOTALS ---', ''],
            ['Total Ingredient Cost', costs['total_ing']],
            ['Total Production Cost', costs['batch_cost']],
            ['HPP / Unit (COGS)', costs['hpp_pc']],
            ['', ''],
            ['--- PRICING TIERS ---', ''],
            *[[f"{m['percentage']}% Profit Tier", m['price']] for m in costs['margins']]
        ]
        df_summary = pd.DataFrame(summary_rows, columns=['Metric', 'Value'])
        df_summary.to_excel(writer, sheet_name='Summary', index=False)
        
        # Formatting Summary Sheet
        workbook = writer.book
        worksheet = writer.sheets['Summary']
        money_format = workbook.add_format({'num_format': f'"{sym}" #,##0.00'})
        worksheet.set_column('B:B', 20, money_format)
        worksheet.set_column('A:A', 30)

        # Sheet 2: Ingredient Breakdown
        breakdown_data = []
        for item in costs['breakdown']:
            breakdown_data.append({
                'Ingredient Name': item['name'],
                'Weight (gr)': item['weight'],
                'Cost / Gr': item['unit_price'],
                'Total Cost': item['total_cost']
            })
        
        df_ing = pd.DataFrame(breakdown_data)
        df_ing.to_excel(writer, sheet_name='Ingredients', index=False)
        
        # Formatting Ingredients Sheet
        worksheet_ing = writer.sheets['Ingredients']
        worksheet_ing.set_column('A:A', 25)
        worksheet_ing.set_column('B:D', 15, money_format)

    return output.getvalue()

def get_text_summary(recipe, costs, sym, t):
    hpp_str = format_curr(costs['hpp_pc'], sym)
    summary = f"🥖 BAKE-COST PRO REPORT: {recipe['name'].upper()}\n"
    summary += f"{'='*35}\n"
    summary += f"Yield: {recipe['yield']} units\n"
    summary += f"HPP per piece: {hpp_str}\n\n"
    
    summary += "💰 PRICING RECOMMENDATIONS:\n"
    for m in costs['margins']:
        summary += f"• {m['percentage']}% Profit: {format_curr(m['price'], sym)} (Margin: {format_curr(m['price'] - costs['hpp_pc'], sym)})\n"
    
    summary += "\n🥣 INGREDIENT LIST:\n"
    for i in costs['breakdown']:
        summary += f"• {i['name']}: {i['weight']}g\n"
    
    summary += f"\nTotal Batch Cost: {format_curr(costs['batch_cost'], sym)}\n"
    summary += f"{'-'*35}\n"
    summary += "Generated via BakeCost Pro Premium"
    return summary

# --- SIDEBAR SETTINGS ---
with st.sidebar:
    st.markdown("# 🥖 BakeCost Pro")
    st.markdown("---")
    lang_code = st.selectbox("Language", list(TRANSLATIONS.keys()), index=0)
    t = TRANSLATIONS[lang_code]
    
    curr_code = st.selectbox("Currency", list(CURRENCIES.keys()), index=0)
    curr = CURRENCIES[curr_code]
    
    st.markdown("---")
    st.markdown("### Export Tools")
    if st.button("🔄 Clear App Data"):
        st.session_state.ingredients = []
        st.session_state.recipes = []
        st.rerun()

# --- MAIN TABS ---
tab_dash, tab_inv, tab_rec = st.tabs([f"📊 {t['dashboard']}", f"📦 {t['inventory']}", f"🥣 {t['recipes']}"])

# TAB: DASHBOARD
with tab_dash:
    col_main, col_stats = st.columns([2, 1])
    
    with col_main:
        st.markdown(f"<div class='serif-italic' style='font-size: 1.1rem; opacity: 0.6;'>{t['welcome']}</div>", unsafe_allow_html=True)
        st.markdown(f"## {t['bakery_dashboard']}")
        
        st.markdown("<div style='height: 20px;'></div>", unsafe_allow_html=True)
        st.subheader(t['recent_inventory'])
        
        if st.session_state.ingredients:
            # Show last 5 ingredients as cards
            for ing in st.session_state.ingredients[-5:]:
                c_gr = ing['price']/ing['weight'] if ing['weight'] > 0 else 0
                st.markdown(f"""
                <div class="bakery-card">
                    <div style="display: flex; justify-content: space-between; align-items: end;">
                        <div>
                            <div style="font-weight: 700; color: #3D2B1F; font-size: 1.1rem;">{ing['name']}</div>
                            <div style="font-size: 0.8rem; color: #8B5E3C; font-weight: 600;">{ing['weight']}g TOTAL WEIGHT</div>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-size: 0.7rem; font-weight: 700; color: rgba(61, 43, 31, 0.4);">UNIT COST</div>
                            <div style="font-weight: 800; color: #8B5E3C;">{format_curr(c_gr, curr['symbol'], 4)} / g</div>
                        </div>
                    </div>
                </div>
                """, unsafe_allow_html=True)
        else:
            st.info(t['pantry_empty'])

    with col_stats:
        st.markdown(f"<div class='bakery-card'><div class='metric-label'>{t['quick_stats']}</div></div>", unsafe_allow_html=True)
        
        st.markdown(f"""
        <div class='bakery-card'>
            <div class='metric-val'>{len(st.session_state.recipes)}</div>
            <div class='metric-label'>{t['active_recipes']}</div>
        </div>
        """, unsafe_allow_html=True)
        
        st.markdown(f"""
        <div class='bakery-card'>
            <div class='metric-val'>{len(st.session_state.ingredients)}</div>
            <div class='metric-label'>{t['raw_ingredients']}</div>
        </div>
        """, unsafe_allow_html=True)
        
        # Mini Export Info
        st.markdown(f"""
        <div class='bakery-card' style='background: #3D2B1F; color: white;'>
            <div style='font-weight: bold; color: #E2D1C3; font-size: 0.7rem; text-transform: uppercase;'>Export Ready</div>
            <div style='font-size: 0.8rem; opacity: 0.8; margin-top: 5px;'>Excel & Shareable Summary modules fully active.</div>
        </div>
        """, unsafe_allow_html=True)

# TAB: INVENTORY
with tab_inv:
    st.markdown(f"<div class='serif-italic' style='font-size: 2.5rem; margin-bottom: 2rem;'>{t['raw_materials']}</div>", unsafe_allow_html=True)
    
    with st.expander(f"➕ {t['new_calculation']}", expanded=True):
        with st.form("add_material_form"):
            f_col1, f_col2, f_col3 = st.columns(3)
            with f_col1: f_name = st.text_input(t['name'], placeholder="e.g. Bread Flour")
            with f_col2: f_weight = st.number_input(t['weight'], min_value=0.1, value=1000.0)
            with f_col3: f_price = st.number_input(f"{t['purchase_price']} ({curr['symbol']})", min_value=0.0)
            
            if st.form_submit_button(t['add_item']):
                if f_name:
                    st.session_state.ingredients.append({
                        'id': str(uuid.uuid4()),
                        'name': f_name,
                        'weight': f_weight,
                        'price': f_price
                    })
                    st.success(f"Added {f_name} to inventory.")
                    st.rerun()

    if st.session_state.ingredients:
        st.markdown(f"### {t['item_catalog']}")
        df_inv = pd.DataFrame(st.session_state.ingredients)
        df_inv['Unit Price'] = df_inv.apply(lambda x: format_curr(x['price']/x['weight'], curr['symbol'], 4), axis=1)
        st.table(df_inv[['name', 'weight', 'price', 'Unit Price']])
        
        # Deletion logic
        del_target = st.selectbox("Select item to remove", [i['name'] for i in st.session_state.ingredients], index=None)
        if st.button("Archive Selected Material"):
            st.session_state.ingredients = [i for i in st.session_state.ingredients if i['name'] != del_target]
            st.rerun()

# TAB: RECIPES
with tab_rec:
    st.markdown(f"<div class='serif-italic' style='font-size: 2.5rem; margin-bottom: 2rem;'>{t['recipe_builder']}</div>", unsafe_allow_html=True)
    
    # NEW RECIPE FORM
    with st.container():
        st.markdown("<div class='bakery-card' style='background: #FAF9F6;'>", unsafe_allow_html=True)
        with st.form("builder_form"):
            st.markdown(f"#### {t['calculator']}")
            row1_c1, row1_c2 = st.columns([2, 1])
            with row1_c1: rec_name = st.text_input(t['recipe_label'], placeholder="e.g. Artisan Baguette")
            with row1_c2: rec_yield = st.number_input(t['yield'], min_value=1, value=1)
            
            row2_c1, row2_c2 = st.columns(2)
            with row2_c1: rec_labor = st.number_input(t['labor'], min_value=0.0, step=1000.0)
            with row2_c2: rec_pkg = st.number_input(t['packaging'], min_value=0.0, step=100.0)
            
            st.markdown(f"**{t['ingredients']}**")
            current_selections = []
            if st.session_state.ingredients:
                for ing in st.session_state.ingredients:
                    w_input = st.number_input(f"{ing['name']} (grams)", min_value=0.0, key=f"build_{ing['id']}")
                    if w_input > 0:
                        current_selections.append({'id': ing['id'], 'weight': w_input})
            else:
                st.info("Add ingredients to inventory first!")
            
            if st.form_submit_button(t['save']):
                if rec_name and current_selections:
                    st.session_state.recipes.append({
                        'id': str(uuid.uuid4()),
                        'name': rec_name,
                        'yield': rec_yield,
                        'labor': rec_labor,
                        'packaging': rec_pkg,
                        'items': current_selections
                    })
                    st.success("Recipe Analysis Created!")
                    st.rerun()
        st.markdown("</div>", unsafe_allow_html=True)

    st.markdown("---")
    st.subheader(t['saved_formulas'])
    
    # DISPLAY SAVED RECIPES
    if not st.session_state.recipes:
        st.info(t['recipe_list_empty'])

    for recipe in st.session_state.recipes:
        res = calculate_costs(recipe)
        with st.expander(f"🍞 {recipe['name']} — HPP: {format_curr(res['hpp_pc'], curr['symbol'])}", expanded=False):
            # Breakdown
            m1, m2 = st.columns(2)
            with m1:
                st.markdown(f"**{t['breakdown']}**")
                for itm in res['breakdown']:
                    st.write(f"• {itm['name']}: {itm['weight']}g ({format_curr(itm['total_cost'], curr['symbol'])})")
                st.markdown(f"**Ingredient Total: {format_curr(res['total_ing'], curr['symbol'])}**")
            
            with m2:
                st.markdown("<div class='bakery-card' style='background: #3D2B1F; color: white;'>", unsafe_allow_html=True)
                st.markdown(f"<div class='metric-label' style='color: #E2D1C3;'>{t['cogs_per_pc']}</div>", unsafe_allow_html=True)
                st.markdown(f"<div class='metric-val' style='color: white;'>{format_curr(res['hpp_pc'], curr['symbol'])}</div>", unsafe_allow_html=True)
                st.markdown("</div>", unsafe_allow_html=True)
            
            st.markdown("#### Pricing Options")
            tier_cols = st.columns(3)
            for idx, margin in enumerate(res['margins']):
                with tier_cols[idx]:
                    st.markdown(f"""
                    <div style="background: white; border: 2px solid #E2D1C3; padding: 1.5rem; border-radius: 1rem; text-align: center;">
                        <div style="font-size: 0.7rem; font-weight: 800; color: #8B5E3C; text-transform: uppercase;">{margin['percentage']}% {t['profit_tier']}</div>
                        <div style="font-size: 1.8rem; font-weight: 800; font-family: serif; font-style: italic;">{format_curr(margin['price'], curr['symbol'])}</div>
                    </div>
                    """, unsafe_allow_html=True)

            st.markdown("<div style='height: 20px;'></div>", unsafe_allow_html=True)
            
            # EXPORT SECTION
            ex1, ex2 = st.columns(2)
            with ex1:
                excel_file = get_excel_report(recipe, res, curr['symbol'])
                st.download_button(
                    label=f"📥 {t['download_excel']}",
                    data=excel_file,
                    file_name=f"{recipe['name'].replace(' ', '_')}_bakery_report.xlsx",
                    mime="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    use_container_width=True
                )
            with ex2:
                summary_txt = get_text_summary(recipe, res, curr['symbol'], t)
                st.text_area(t['copy_summary'], summary_txt, height=180, help="Copy this text to email or WhatsApp")
            
            if st.button(f"🗑️ Delete Recipe", key=f"del_{recipe['id']}"):
                st.session_state.recipes = [r for r in st.session_state.recipes if r['id'] != recipe['id']]
                st.rerun()

# --- FOOTER ---
st.markdown("---")
st.markdown("<div style='text-align: center; color: rgba(61,43,31,0.4); font-size: 0.8rem;'>BakeCost Pro v2.0 • Premium Production Analysis</div>", unsafe_allow_html=True)
