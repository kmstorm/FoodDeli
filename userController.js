import userModel from "../models/userModel";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

//login user
const loginUser= async (req,res) => {


}

const createToken = (id) =>{
    return jwt.sign({id});
}

//register user
const registerUser = async (req,res) =>{
    const {name,password,email}=req.body;
    try{
        const exists =await userModel.findOne({email});
        if(exists){
            return res.json({success:false,message:"User alreadey exits"});
        }
        if(!validator.isEmail(email)){
            return res.json({success:false,message:"Please enter a valid email"});
        }
        if(password.length<8){
            return res.json({success:false,message:"Please enter a strong password"});
        }
        //hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword= await bcrypt.hash(password,salt);

        const newUser=new userModel({
            name:name,
            email:email,
            password:hashedPassword
        })
        const user = await newUser.save()
        
    }
    catch(error){
        console.log(error);
        res.json({success:false,message:"Error"});
    }
}

export{loginUser,registerUser};