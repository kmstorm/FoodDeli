import express from "express"
import cors from "cors"
import 'dotenv/config'
import bodyParser from "body-parser"
import userRouter from "./routes/userRoute.js"
import {connectDB} from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";

// app config
const app = express()
const port = 3000

// middleware
app.use(express.json())
app.use(cors())

// connect db
connectDB()

// call API
app.use("/api/food", foodRouter)
app.use("/api/user",userRouter)

app.get("/",(req,res)=>{
    res.send("Hello World")
})

app.listen(port, () => {
    console.log(`Server started on port http://localhost:${port}`)
})
