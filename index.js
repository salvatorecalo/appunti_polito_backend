const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')
import { LinkSchema } from './utils/linkSchema.js'

require('dotenv').config()

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
    .then(() => console.log('MongoDB connected')).catch(err => console.log(err))

const Link = mongoose.model('Link', LinkSchema)

const CONFIG_PATH = path.join(__dirname, 'config.json')
const getConfig = () => JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'))

app.get("/api/config", (req, res) => {
    try {
        res.json(getConfig())
    } catch (e) {
        res.status(500).json({ error: "Failed to read config file" })
    }
})