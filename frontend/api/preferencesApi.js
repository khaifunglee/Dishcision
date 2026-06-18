// This file contains API wrapper functions for user preferences endpoints
import client from "./client"

// GET current user's preferences — returns UserPreferencesResponse
export const getPreferences = async () => {
    const response = await client.get('/preferences')
    return response.data
}

// PUT partial update — only send changed fields; server ignores null/absent fields
export const updatePreferences = async (changes) => {
    const response = await client.put('/preferences', changes)
    return response.data
}
