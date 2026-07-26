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
        const userID = jwt.verify(token, process.env.JWT_SECRET)
        if(!userID){
           return res.json({success: false, message: "not authorized"})
        }
        req.user = await User.findById(userID).select("-password")
        next();
    } catch (error) {
       return res.json({success: false, message: "not authorized"}) 
    }
}
