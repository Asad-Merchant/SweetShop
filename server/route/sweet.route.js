import express from 'express'
import { Sweet } from '../model/sweet.model.js'

const route = express.Router()

route.post('/add-item', async (req, res) => {
    const { name, category, price, quantity } = req.body 
    if(!name || !category || !price || !quantity){
        return res.status(400).json({body: "Please provide proper information."})
    }
    if(price<=0 || quantity<0){
        return res.status(400).json({body: "Negative values are not accepted"})
    }
    if(isNaN(price) || isNaN(quantity))
        return res.status(400).json({body: "Please provide a valid number"})
    try {
        const newSweet = await Sweet({
            category,
            name,
            price: Number(price),
            quantity: Number(quantity)
        })
        await newSweet.save()
        return res.status(201).json({body: "Sweet added."})
    } catch (error) {
        if(error.name==="ValidationError")
            return res.status(400).json({body: "Inappropriate data."})
        console.log(error.name);
        return res.status(500).json({body: "Server error"})
    }
})

route.post('/delete-sweet', async (req, res) => {
    const { sweetId } = req.body
    if(!sweetId) return res.status(400).json({body: "Id not provided."})
    try {
        const sweet = await Sweet.findById(sweetId)
        if(!sweet)
            return res.status(400).json({body: "Sweet not found."})
        await Sweet.findByIdAndDelete(sweetId)
        return res.status(200).json({body: "Item deleted."})
    } catch (error) {
        console.log(error);
        return res.status(500).json({body: "Server error."})
    }
})

route.get('/list-sweet', async(req, res) => {
    try {
        const data = await Sweet.find({quantity: {$gt: 0}})
        return res.status(200).json({body: data})
    } catch (error) {
        console.log(error);
        return res.status(500).json({body: "Server error"})
    }
})

route.get('/list-all-sweet', async(req, res) => {
    try {
        const data = await Sweet.find({})
        return res.status(200).json({body: data})
    } catch (error) {
        console.log(error);
        return res.status(500).json({body: "Server error"})
    }
})

route.post("/buy-sweet", async(req, res) => {
    const { sweetId, quantity } = req.body 
    if(!sweetId || !quantity){
        return res.status(400).json({body: "Please provide the details."})
    }
    if(isNaN(quantity) || quantity<=0){
        return res.status(400).json({body: "Please provide a valid positive number."})
    }
    try {
        const sweet = await Sweet.findById(sweetId)
        if(!sweet) return res.status(400).json({body: "Sweet not found."})
        if(sweet.quantity<quantity) return res.status(400).json({body: "Not much quantity."})
        sweet.quantity -= Number(quantity)
        await sweet.save()
        return res.status(200).json({body: "Sweet bought successfully."})
    } catch (error) {
        console.log(error);
        return res.status(500).json({body: "Server error."})
    }
})

route.post('/add-quantity', async(req, res) => {
    const { sweetId, quantity } = req.body 
    if(!sweetId || !quantity) return res.status(400).json({body: "Please provide proper details."})
    if(isNaN(quantity) || quantity<=0)
        return res.status(400).json({body: "Provide proper positive number."})
    try {
        const sweet = await Sweet.findById(sweetId)
        if(!sweet) return res.status(400).json({body: "Sweet not found."})
        sweet.quantity += Number(quantity)
        await sweet.save()
        return res.status(200).json({body: "Quantity updated."})
    } catch (error) {
        console.log(error);
        return res.status(500).json({body: "Server error."})
    }
})


route.post('/search', async (req, res) => {
    const { category, maxValue } = req.body 
    const query = {}
    if(category && category!=="all") query.category = category
    if(maxValue && maxValue>0) {
        query.price = {
            '$gt': 0,
            '$lte': Number(maxValue)
        }
    }
    try {
        const data = await Sweet.find(query)
        return res.status(200).json({body: data})
    } catch (error) {
        console.log(error);
        return res.status(500).json({body: "Server error."})
    }
})

route.post('/search-category', async (req, res) => {
    const { category } = req.body
    if(!category) return res.status(400).json({body: "Category not found."})
    try {
        const data = await Sweet.find({category})
        return res.status(200).json({body: data})
    } catch (error) {
        console.log(error);
        return res.status(500).json({body: "Server error."})
    }
})

route.post('/find-by-range', async(req, res) => {
    const { maxValue } = req.body
    if(!maxValue || maxValue<=0) return res.status(400).json({body: "Invalid value."})
    try {
        const data = await Sweet.find({price: {$gt: 0, $lte: Number(maxValue)}})
        return res.status(200).json({body: data})
    } catch (error) {
        console.log(error);
        return res.status(500).json({body: "Server error."})
    }
})

export { route }