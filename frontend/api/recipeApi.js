// This file contains recipe service API wrapper functions for recipe endpoints
import client from "./client"

// GET recipe list, returns RecipeSummaryDTO[] with match data included.
// All filtering is done client-side from the full result set (30–50 recipes).
export const getRecipes = async () => {
    const response = await client.get('/recipes')
    return response.data
}

// GET recipe suggestions, returns { pantryItemCount, fullMatch[], nearMatch[] }
export const getSuggestions = async () => {
    const response = await client.get('/recipes/suggestions')
    return response.data
}

// GET recipe details, returns full detail with ingredients (inPantry flags) and steps
export const getRecipeDetail = async (id) => {
    const response = await client.get(`/recipes/${id}`)
    return response.data
}

// POST create a new 'USER_ADDED' recipe, returns RecipeDetailDto
export const createRecipe = async (recipe) => {
    const response = await client.post('/recipes', recipe)
    return response.data
}
