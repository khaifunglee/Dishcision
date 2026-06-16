// This file contains pantry service wrapper functions to call the API
import client from "./client";
import * as SecureStore from 'expo-secure-store'

// Pantry list GET API
export const getAll = async () => {
    //console.log('calling get API for pantry list...')
    const response = await client.get('/pantry/getList')
    //console.log('response: ', response.data)

    const pantryList = response.data

    return pantryList
}

// New item POST API
export const addItem = async (item) => {
    console.log('calling post API to add item...')
    const response = await client.post('/pantry/addItem', item)
    console.log('response: ', response.data)

    const pantryList = response.data

    return pantryList
}

// Update item PUT API
export const updateItem = async (id, item) => {
    console.log('calling PUT API to update item...')
    const response = await client.put(`/pantry/update/${id}`, item)
    console.log('response: ', response.data)

    const pantryList = response.data

    return pantryList
}

// Remove item DEL API
export const deleteItem = async (id) => {
    console.log(`calling DEL API to remove item ${id}`)
    const response = await client.delete(`/pantry/delete/${id}`)
    console.log('response: ', response.data)

    return
}

// Search ingredients GET API
export const searchIngredients = async (q) => {
    //console.log('calling GET API for search item...')
    const response = await client.get('/ingredients/search', { params: { q } })
    //console.log('response: ', response.data)

    const results = response.data

    return results
}