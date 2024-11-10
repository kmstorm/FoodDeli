import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import {connectDB} from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";

// app config
const app = express()
const port = process.env.PORT

// middleware
app.use(express.json())
app.use(cors())

// connect db
connectDB()

// call API
app.use("/api/food", foodRouter)
app.use("/images",express.static('uploads'))

app.get("/",(req,res)=>{
    res.send("Hello World")
})

app.listen(port, () => {
    console.log(`Server started on port http://localhost:${port}`)
})
