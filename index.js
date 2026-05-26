import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import { Link } from './utils/linkSchema/linkSchema.js'
import { fileURLToPath } from 'url'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

/********* MongoDB Connection *********/

const mongooseUrl = process.env.MONGO_URL;
if (!mongooseUrl) {
  console.error("Error: MONGO_URL environment variable is not set.");
  process.exit(1);
}
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error: ', err))

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const CONFIG_PATH = path.join(__dirname, 'utils/cfg.json')
const getConfig = () => JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'))
const PORT = 3000

app.get("/api/config", (req, res) => {
    try {
        res.json(getConfig())
    } catch (e) {
        res.status(500).json({ error: "Failed to read config file" })
    }
})

app.listen(PORT, () => {
    console.log(`Run polito appunti bot:\n\n/api/config -> get config\n/api/link -> get all links\n/api/link/:cat -> get links by category\n/api/link/:cat/:sub -> get links by category and subcategory`)
})