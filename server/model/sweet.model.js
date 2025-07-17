import mongoose from "mongoose";

const sweetSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ["candy", "pastry", "chocolate"],
        required: true
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true
    }
})

export const Sweet = mongoose.model("Sweet", sweetSchema)