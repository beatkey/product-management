import dotenv from "dotenv";
dotenv.config({
    path: "./.env"
})

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import routes from "./src/routes/index.js";
const DB_URL = process.env.DB_URL

mongoose.connect(DB_URL)
const DB = mongoose.connection

DB.on('error', (error) => {
    console.log(error)
})

DB.once('connected', () => {
    console.log('Mongodb connected');
})

const app = express()

app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}));
app.use(routes)

app.listen(3000, () => {
    console.log(`Server started PORT: ${3000}`)
})