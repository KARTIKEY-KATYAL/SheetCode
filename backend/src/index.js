import express from "express"
import dotenv from "dotenv"
import CookieParser from "cookie-parser"
dotenv.config()

const app = express()

const port = process.env.PORT || 8000

app.use(express.json())
app.use(CookieParser())

app.get('/',(req,res)=>{
    res.send("ok!")
})


import authRoutes from "./routes/auth.routes.js"

app.use("/api/v1/auth",authRoutes)

app.listen(port,()=>{
    console.log(`Server Started on PORT : ${port}`)
})