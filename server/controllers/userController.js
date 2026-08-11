import User from "../models/User.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Car from "../models/Car.js";


// Generate JWT Token
const generateToken = (userId)=> {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET)
}
//Register User
export const registerUser =async (req,res)=>{
    try {
        const{name,email,password,role} = req.body

        if(!name || !email || !password || password.length < 8){
            return res.json({success: false, message:'fill all the fields'})
        }
        const userExists = await User.findOne({email})
        if(userExists){
            return res.json({success: false, message:'User already exists'})
        }

        const accountRole = role === 'owner' ? 'owner' : 'user'

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({name, email, password: hashedPassword, role: accountRole})
        const token = generateToken(user._id.toString())
        res.json({success:true, token})

    } catch (error) {
         console.log(error.message);
         res.json({success: false, message: error.message})
    }

}

// Login User
export const loginUser = async (req, res)=>{
    try {
        const{email,password,role} = req.body
        const user = await User.findOne({email})
        if(!user){
            return res.json({success: false, message: "User not found"})
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.json({success:false, message: "Invalid Credentials"})
        }

        // If the login form specified an account type, make sure it matches
        // this account's real role so customers and owners can't cross into
        // each other's login tab by mistake.
        if(role && role !== user.role){
            const actualLabel = user.role === 'owner' ? 'Owner' : 'Customer'
            return res.json({success: false, message: `This account is registered as a ${actualLabel}. Please login as ${actualLabel}.`})
        }

        const token = generateToken(user._id.toString())
        res.json({success:true, token})


    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})

    }
}

// Get User data using Token(JWT)
export const getUserData = async (req, res) =>{
    try {
        const {user} = req;
        res.json({success: true, user})
    } catch (error) {
        console.log(error.message);  
        res.json({success: false, message: error.message})
        
    }
} 

//get All Cars For the frontend
export const getCars = async (req, res) =>{
    try {
        const cars = await Car.find({isAvailable: true})
        res.json({success: true, cars})
    } catch (error) {
        console.log(error.message);  
        res.json({success: false, message: error.message})
        
    }
} 
