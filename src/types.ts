/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Ingredient {
  id: string;
  name: string;
  totalWeight: number; // in grams
  totalPrice: number;
}

export interface RecipeIngredient {
  ingredientId: string;
  weight: number; // in grams
}

export interface Recipe {
  id: string;
  name: string;
  ingredients: RecipeIngredient[];
  yield: number; // pieces
  packagingPerPc: number;
  operationalCost: number; // Upah Capek / Electricity per recipe
}
