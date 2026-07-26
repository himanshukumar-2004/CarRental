import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import ownerRouter from "./routes/ownerRoute.js";
import bookingRouter from "./routes/bookingRoutes.js";

//Initialize Express App
const app= express()
//connect Database
await connectDB()

//Middleware
app.use(cors());
app.use(express.json());

app.get('/' , (req, res)=> res.send("Server is running"))
app.use('/api/user',userRouter)
app.use('/api/owner', ownerRouter)
app.use('/api/bookings', bookingRouter)

app.use((error, req, res, next) => {
	if (error) {
		console.error(error.message)
		return res.status(400).json({
			success: false,
			message: "Invalid multipart request. In Postman, use Body > form-data and let Postman set Content-Type."
		})
	}
	next()
})

const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>console.log(`Server running on port ${PORT}`))
