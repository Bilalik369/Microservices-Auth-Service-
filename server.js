import express from "express"
import dotenv from "dotenv"
import {connectDB} from "./lib/db.js"
import authRoutes from "./routes/auth.routes.js"
dotenv.config()

const app = express();
const PORT = process.env.PORT

app.use(express.json());

app.use('/api/auth', authRoutes);

connectDB();
app.listen(PORT, ()=>{
    console.log(`server is rannuing in the port${PORT}`)
})