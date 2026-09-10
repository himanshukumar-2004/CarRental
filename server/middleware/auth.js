import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next)=>{
    const authorization = req.headers.authorization;
    if(!authorization){
        return res.json({success: false, message: "not authorized"})
    }
    try {
        const token = authorization.startsWith('Bearer ')
            ? authorization.slice(7)
            : authorization;
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if(!decoded || !decoded.id){
           return res.json({success: false, message: "not authorized"})
        }
        const user = await User.findById(decoded.id).select("-password")
        if(!user){
           return res.json({success: false, message: "not authorized"})
        }
        req.user = user
        next();
    } catch (error) {
       return res.json({success: false, message: "not authorized"}) 
    }
}
