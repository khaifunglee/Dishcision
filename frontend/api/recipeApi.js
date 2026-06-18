// This file contains recipe service API wrapper functions for recipe endpoints
import client from "./client"

// GET recipe list — RecipeSummaryDTO[] with match data and `saved` flag
// All filtering is done client-side from the full result set (30 recipes)
export const getRecipes = async () => {
    const response = await client.get('/recipes')
    return response.data
}

// GET recipe suggestions — { pantryItemCount, fullMatch[], nearMatch[] }
// Suggestions are filtered server-side by the user's diet_tags
export const getSuggestions = async () => {
    const response = await client.get('/recipes/suggestions')
    return response.data
}

// GET all saved recipes for the current user — RecipeSummaryDTO[]
export const getSavedRecipes = async () => {
    const response = await client.get('/recipes/saved')
    return response.data
}

// GET recipe detail — RecipeDetailDTO with per-ingredient inPantry flags and `saved` flag
export const getRecipeDetail = async (id) => {
    const response = await client.get(`/recipes/${id}`)
    return response.data
}

// POST save a recipe (idempotent)
export const saveRecipe = async (id) => {
    const response = await client.post(`/recipes/${id}/save`)
    return response.data
}

// DELETE unsave a recipe
export const unsaveRecipe = async (id) => {
    await client.delete(`/recipes/${id}/save`)
}

// POST create a new USER_ADDED recipe
export const createRecipe = async (recipe) => {
    const response = await client.post('/recipes', recipe)
    return response.data
}
