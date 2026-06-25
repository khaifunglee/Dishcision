// This file contains API wrapper functions for cooking history and stats endpoints
import client from "./client"

// POST cook a recipe — deducts pantry, records history
// Returns { pantrySnapshot, costSaved, warnings }
export const cookRecipe = async (recipeId, servings) => {
    const response = await client.post(`/recipes/${recipeId}/cook`, { servings })
    return response.data
}

// GET user's current cooking history, sorted by most recent
export const getHistory = async () => {
    const response = await client.get('/history')
    return response.data
}

// GET weekly summary — { mealsCoooked, totalSaved, mostCookedRecipe }
export const getWeeklyStats = async () => {
    const response = await client.get('/stats/weekly')
    return response.data
}
