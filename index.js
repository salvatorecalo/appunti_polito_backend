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

app.get('/api/get-list', async (req, res) => {
    let cat = req.query.id
    console.log(`Categoria ricevuta: ${cat}`)
    const cfg = getConfig()
    let defaultObj = {
        status: 0,
        subs: [],
        ext: [],
        int: []
    }

    if (cfg["courses"][cat] == null && cat != "gen"){
        defaultObj.status = -1 // -1 stands for category not found
        return res.json(defaultObj)
    }
    console.log(cfg["subcats"][cat])

    try {
        if (cfg["subcats"] && cfg["subcats"][cat]){
            defaultObj.subs = cfg["subcats"][cat]
        }

        const dbLinks = await Link.find({cat: cat})

        dbLinks.forEach(item => {
            const formattedLink = {
                link: item.link,
                desc: item.desc,
                sub: item.sub
            }

            if (item.is_ext){
                defaultObj.ext.push(formattedLink)
            } else {
                defaultObj.int.push(formattedLink)
            }
        })

        res.json(defaultObj)
    } catch (e) {
        console.error("Error during link fetch: ", e);
        defaultObj.status = -5;
        res.status(404).json(defaultObj)
    }
})

app.listen(PORT, () => {
    console.log(`Run polito appunti bot:\n\n/api/config -> get config\n/api/link -> get all links\n/api/link/:cat -> get links by category\n/api/link/:cat/:sub -> get links by category and subcategory`)
})