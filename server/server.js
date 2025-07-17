import express from 'express'
import cors from 'cors'
import { conn } from './config/db.js'
import dotenv from 'dotenv'
import { route } from './route/sweet.route.js'
dotenv.config()

const app = express()
const PORT = process.env.PORT

app.use(cors())
app.use(express.json())
app.use('/api/v1/sweet', route)
export default app
app.listen(PORT, () => {
    console.log("Server is listening.");
})