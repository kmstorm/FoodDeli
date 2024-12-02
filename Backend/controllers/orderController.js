import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import crypto from "crypto"; 

const placeOrder = async (req, res) => {
    
};

const verifyOrder = async (req, res) => {
    
};

const userOrders = async(req,res) =>{
    try{
        const orders = await orderModel.find({userId:req.body.userId});
        res.json({success:true,data:orders})
    }catch(error){
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

const listOrders=async (req,res) =>{
    try{
        const orders =await orderModel.find({});
        res.json({success:true,data:orders})
    }catch(error){
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

export{placeOrder,verifyOrder,userOrders,listOrders}
