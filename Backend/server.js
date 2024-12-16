import express from "express"
import cors from "cors"
import 'dotenv/config'
import bodyParser from "body-parser"
import userRouter from "./routes/userRoute.js"
import {connectDB} from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import orderRouter from "./routes/orderRoute.js"
import cartRouter from "./routes/cartRoute.js"

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
app.use("/api/user",userRouter)
app.use("/images",express.static('uploads'))
app.use("/api/order",orderRouter)
app.use("/api/cart",cartRouter)

app.get("/",(req,res)=>{
    res.send("Hello World")
})

app.listen(port, () => {
    console.log(`Server started on port http://localhost:${port}`)
})
