import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import userRouter from "./routes/userRoute.js"
import 'dotenv/config'
import {connectDB} from "./config/db.js";

// app config
const app = express()
const port = 3000

// middleware
app.use(express.json())
app.use(cors())
app.use("/api/user",userRouter)

// connect db
connectDB();

app.get("/",(req,res)=>{
    res.send("Hello World")
})

app.listen(port, () => {
    console.log(`Server started on port http://localhost:${port}`)
})
