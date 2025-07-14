import express from "express"
import dotenv from "dotenv"
import {connectDB} from "./lib/db.js"
dotenv.config()

const app = express();
const PORT = process.env.PORT

connectDB();
app.listen(PORT, ()=>{
    console.log(`server is rannuing in the port${PORT}`)
})