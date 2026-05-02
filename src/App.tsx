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
  Pencil
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Ingredient, Recipe, RecipeIngredient } from './types';

// Storage Keys
const STORAGE_INGREDIENTS = 'bakecost_ingredients';
const STORAGE_RECIPES = 'bakecost_recipes';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'ingredients' | 'recipes'>('dashboard');
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Local Storage Loading
  useEffect(() => {
    const savedIngredients = localStorage.getItem(STORAGE_INGREDIENTS);
    const savedRecipes = localStorage.getItem(STORAGE_RECIPES);
    if (savedIngredients) setIngredients(JSON.parse(savedIngredients));
    if (savedRecipes) setRecipes(JSON.parse(savedRecipes));
  }, []);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_INGREDIENTS, JSON.stringify(ingredients));
  }, [ingredients]);

  useEffect(() => {
    localStorage.setItem(STORAGE_RECIPES, JSON.stringify(recipes));
  }, [recipes]);

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
    <div className="min-h-screen pb-20 md:pb-0">
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
              label="Dashboard"
            />
            <NavButton 
              active={activeTab === 'ingredients'} 
              onClick={() => setActiveTab('ingredients')}
              icon={<Scale size={18} />}
              label="Inventory"
            />
            <NavButton 
              active={activeTab === 'recipes'} 
              onClick={() => setActiveTab('recipes')}
              icon={<ClipboardList size={18} />}
              label="Recipes"
            />
          </div>

          <div className="mt-auto hidden md:block pt-10">
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-[10px] uppercase font-bold text-bakery-wheat/40 mb-2">Business Health</p>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xl font-bold">{recipes.length}</p>
                  <p className="text-[10px] text-bakery-wheat/60 font-medium">Active Recipes</p>
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
                    <span className="bento-header">Welcome Back</span>
                    <h2 className="text-4xl serif-italic">Bakery Dashboard</h2>
                  </div>
                  <button onClick={() => setActiveTab('recipes')} className="btn-primary">
                    <Plus size={18} /> NEW CALCULATION
                  </button>
                </header>

                <div className="grid grid-cols-12 gap-6 h-auto">
                  <div className="col-span-12 md:col-span-8 bakery-card bg-gradient-to-br from-white to-bakery-cream">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="serif-italic text-2xl">Recent Inventory</h3>
                      <button onClick={() => setActiveTab('ingredients')} className="text-bakery-accent font-bold text-xs flex items-center gap-1 uppercase tracking-widest hover:underline">
                        Manage <ChevronRight size={14} />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                      {ingredients.slice(0, 6).map(ing => (
                        <div key={ing.id} className="p-4 bg-bakery-cream/40 rounded-xl border border-bakery-wheat/50">
                          <p className="text-[10px] font-bold text-bakery-accent uppercase mb-1">{ing.name}</p>
                          <p className="font-bold">Rp {getPricePerGram(ing).toFixed(2)}<span className="text-[10px] opacity-40 ml-1">/gr</span></p>
                        </div>
                      ))}
                      {ingredients.length === 0 && <p className="col-span-full py-10 text-center opacity-40 italic">Inventory is silent...</p>}
                    </div>
                  </div>

                  <div className="col-span-12 md:col-span-4 bakery-card bg-bakery-brown text-white flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-bakery-accent tracking-widest mb-4 block">Quick Stats</span>
                      <div className="space-y-6">
                        <div>
                          <div className="text-4xl font-serif font-bold italic tracking-tight">{recipes.length}</div>
                          <div className="text-[11px] opacity-60 uppercase font-medium">Active Recipes</div>
                        </div>
                        <div className="border-t border-white/10 pt-4">
                          <div className="text-4xl font-serif font-bold italic tracking-tight text-bakery-wheat">{ingredients.length}</div>
                          <div className="text-[11px] opacity-60 uppercase font-medium">Raw Ingredients</div>
                        </div>
                      </div>
                    </div>
                    <TrendingUp size={48} className="text-bakery-accent mt-8 self-end opacity-20" />
                  </div>
                </div>

                <section className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="serif-italic text-2xl">Calculated Recipes</h3>
                    <button onClick={() => setActiveTab('recipes')} className="text-bakery-accent font-bold text-xs uppercase tracking-widest hover:underline">Explore Collection</button>
                  </div>
                  {recipes.length === 0 ? (
                    <div className="bakery-card p-20 flex flex-col items-center justify-center text-center opacity-60 border-dashed">
                      <p className="serif-italic text-xl mb-2">No recipes yet...</p>
                      <button onClick={() => setActiveTab('recipes')} className="text-bakery-accent text-sm font-bold uppercase tracking-widest">Start Now</button>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {recipes.slice(0, 6).map(recipe => {
                        const { hppPerPc } = calculateRecipeCosts(recipe);
                        return (
                          <div key={recipe.id} className="bakery-card group hover:border-bakery-brown transition-all cursor-pointer bg-[#F7F2ED]" onClick={() => setActiveTab('recipes')}>
                            <span className="text-[10px] uppercase font-bold text-bakery-accent tracking-widest mb-2 block">{recipe.yield} Pieces Yield</span>
                            <h4 className="serif-italic text-xl mb-4 group-hover:text-bakery-accent transition-colors">{recipe.name}</h4>
                            <div className="border-t border-bakery-wheat pt-4 flex justify-between items-end">
                              <div>
                                <p className="text-[10px] font-bold text-bakery-brown/40 uppercase">HPP per Pc</p>
                                <p className="text-xl font-bold">Rp {hppPerPc.toLocaleString()}</p>
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
                  <div>
                    <span className="bento-header">Ingredient Inventory</span>
                    <h2 className="text-4xl serif-italic">Raw Materials</h2>
                  </div>
                  <IngredientForm onSave={(name, weight, price) => addIngredient(name, weight, price)} />
                </div>

                <div className="bakery-card p-0">
                  <div className="p-6 border-b border-bakery-wheat bg-bakery-cream/30 flex items-center gap-4">
                    <Search className="text-bakery-accent" size={20} />
                    <input 
                      type="text" 
                      placeholder="Search inventory items..." 
                      className="bg-transparent border-none p-0 focus:ring-0 w-full text-base"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-[#F7F2ED]">
                        <tr>
                          <th className="px-6 py-4">Item Catalog</th>
                          <th className="px-6 py-4">Total Weight</th>
                          <th className="px-6 py-4">Purchase Price</th>
                          <th className="px-6 py-4 uppercase">Cost / Gr</th>
                          <th className="w-20 px-6 py-4 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F2EDE8]">
                        {ingredients
                          .filter(ing => ing.name.toLowerCase().includes(searchQuery.toLowerCase()))
                          .map(ing => (
                          <tr key={ing.id} className="hover:bg-bakery-cream/40 transition-colors">
                            <td className="px-6 py-4 font-serif font-bold text-lg">{ing.name}</td>
                            <td className="px-6 py-4">{ing.totalWeight.toLocaleString()} gr</td>
                            <td className="px-6 py-4">Rp {ing.totalPrice.toLocaleString()}</td>
                            <td className="px-6 py-4">
                              <span className="px-3 py-1 bg-bakery-accent/10 rounded-full text-bakery-accent font-bold text-xs border border-bakery-accent/20">
                                Rp {getPricePerGram(ing).toFixed(2)}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <IngredientForm 
                                  ingredient={ing} 
                                  onSave={(name, weight, price) => updateIngredient(ing.id, name, weight, price)} 
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
                              Your pantry is currently empty.
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
                    <span className="bento-header">Production Management</span>
                    <h2 className="text-4xl serif-italic">Recipe & COGS Analysis</h2>
                  </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-8 items-start">
                  <div className="lg:col-span-7">
                    <RecipeForm ingredients={ingredients} onAdd={addRecipe} />
                  </div>
                  
                  <div className="lg:col-span-5 space-y-6">
                    <h3 className="serif-italic text-2xl px-2">Saved Formulas</h3>
                    <div className="space-y-6">
                      {recipes.map(recipe => (
                        <RecipeCard 
                          key={recipe.id} 
                          recipe={recipe} 
                          onDelete={() => removeRecipe(recipe.id)}
                          costs={calculateRecipeCosts(recipe)}
                        />
                      ))}
                      {recipes.length === 0 && (
                        <div className="bakery-card p-16 text-center serif-italic text-bakery-accent opacity-40 border-dashed">
                          Recipe collection is empty.
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

function IngredientForm({ onSave, ingredient }: { onSave: (name: string, weight: number, price: number) => void, ingredient?: Ingredient }) {
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
        title={ingredient ? "Edit Item" : "New Ingredient"}
      >
        {ingredient ? <Pencil size={18} /> : <><Plus size={18} /> INGREDIENT</>}
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
                {ingredient ? 'Edit Ingredient' : 'New Ingredient'}
              </h4>
              <div className="space-y-2 text-left">
                <label className="bento-header">Ingredient Name</label>
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
                  <label className="bento-header">Weight (gr)</label>
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
                  <label className="bento-header">Price (Rp)</label>
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
                <button type="button" onClick={() => setIsOpen(false)} className="flex-1 btn-secondary text-[10px] uppercase tracking-widest justify-center">Cancel</button>
                <button type="submit" className="flex-[2] btn-primary text-[10px] uppercase tracking-widest justify-center">
                  {ingredient ? 'Update' : 'Add Item'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function RecipeForm({ ingredients, onAdd }: { ingredients: Ingredient[], onAdd: (recipe: Omit<Recipe, 'id'>) => void }) {
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
        <span className="bento-header">Calculator</span>
        <h3 className="text-3xl serif-italic">Recipe Builder</h3>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="bento-header">Recipe Label</label>
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
              <label className="bento-header">Yield (PCS)</label>
              <input 
                type="number" 
                placeholder="1" 
                className="w-full"
                value={formData.yield}
                onChange={(e) => setFormData({ ...formData, yield: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="bento-header">Labor Cost</label>
              <input 
                type="number" 
                placeholder="Rp" 
                className="w-full"
                value={formData.labor}
                onChange={(e) => setFormData({ ...formData, labor: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="bento-header">Packaging / Piece</label>
            <input 
              type="number" 
              placeholder="Rp" 
              className="w-full"
              value={formData.packaging}
              onChange={(e) => setFormData({ ...formData, packaging: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-4 bg-white border border-bakery-wheat p-6 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <h4 className="bento-header">Ingredients</h4>
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
                    placeholder="Weight" 
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
        <Save size={18} /> GENERATE CALCULATION
      </button>
    </form>
  );
}

function RecipeCard({ recipe, onDelete, costs }: { recipe: Recipe, onDelete: () => void, costs: any }) {
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
            <p className="text-[10px] uppercase font-bold text-bakery-accent tracking-widest">HPP PER PIECE</p>
            <p className="font-bold text-2xl text-bakery-brown">Rp {costs.hppPerPc.toLocaleString()}</p>
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
                    <h5 className="serif-italic text-lg">Breakdown</h5>
                    <span className="text-[10px] font-bold uppercase text-bakery-accent tracking-widest">Weights in GR</span>
                  </div>
                  <table className="w-full text-xs">
                    <thead className="border-b border-[#F2EDE8]">
                      <tr>
                        <th className="pb-3 text-bakery-accent">Ingredient</th>
                        <th className="pb-3 text-right text-bakery-accent">Weight</th>
                        <th className="pb-3 text-right text-bakery-accent">Cost</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F2EDE8]">
                      {costs.breakdown.map((item: any, i: number) => (
                        <tr key={i}>
                          <td className="py-3 font-medium text-bakery-brown">{item.name}</td>
                          <td className="py-3 text-right">{item.weight} gr</td>
                          <td className="py-3 text-right font-bold">Rp {item.cost.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="mt-4 pt-4 border-t border-bakery-brown flex justify-between items-center">
                    <span className="serif-italic text-base">Ingredient Subtotal</span>
                    <span className="font-bold text-lg">Rp {costs.totalIngredientCost.toLocaleString()}</span>
                  </div>
                </div>

                {/* Summary Section */}
                <div className="space-y-6">
                  <div className="bg-[#F7F2ED] border border-bakery-wheat rounded-2xl p-6 shadow-sm">
                    <h5 className="bento-header mb-4">Operational Detail</h5>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Packaging ({recipe.yield} units)</span>
                        <span className="font-bold">Rp {(recipe.packagingPerPc * recipe.yield).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm italic">Labor / CapEx</span>
                        <span className="font-bold">Rp {recipe.operationalCost.toLocaleString()}</span>
                      </div>
                      <div className="border-t border-bakery-wheat pt-4 flex justify-between items-center">
                        <span className="font-serif italic font-bold">Total Batch Cost</span>
                        <span className="font-bold text-xl">Rp {costs.totalCost.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-bakery-brown text-white rounded-2xl p-6 shadow-lg">
                    <h5 className="text-[10px] uppercase font-bold text-bakery-accent tracking-widest mb-3">Unit Summary</h5>
                    <div className="text-4xl font-serif font-bold italic tracking-tight mb-1">Rp {costs.hppPerPc.toLocaleString()}</div>
                    <div className="text-[11px] opacity-60 uppercase font-bold tracking-widest">HPP Per Unit (Yield: {recipe.yield})</div>
                  </div>
                </div>
              </div>

              {/* Profit Tiers */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {costs.margins.map((margin: any) => (
                  <div key={margin.percentage} className={`bakery-card p-6 ${margin.percentage === 50 ? 'bg-white ring-2 ring-bakery-brown' : 'bg-white'}`}>
                    <h2 className="bento-header mb-2">{margin.percentage}% Profit Tier</h2>
                    <div className="text-3xl font-serif font-bold italic mb-1 text-bakery-brown">Rp {Math.round(margin.price).toLocaleString()}</div>
                    <div className="text-[11px] text-bakery-accent font-bold truncate">Margin: Rp {Math.round(margin.price - costs.hppPerPc).toLocaleString()} / piece</div>
                    <div className="w-full bg-[#F2EDE8] h-1.5 mt-4 rounded-full overflow-hidden">
                      <div className="bg-bakery-accent h-full transition-all" style={{ width: `${margin.percentage}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-4">
                <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="flex items-center gap-2 text-bakery-accent hover:text-red-500 text-[10px] font-bold uppercase tracking-widest transition-colors">
                  <Trash2 size={16} /> Archive Recipe
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

