import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()

const uri = process.env.DB_URL 

mongoose.connect(uri,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const conn = mongoose.connection

conn.on("connected", () => {
    console.log("DB connected.");
})

conn.on("disconnected", () => {
    console.log("DB disconnected.");
})

conn.on("error", (err) => {
    console.log("Some error occurred in DB: "+err);
})

export { conn }