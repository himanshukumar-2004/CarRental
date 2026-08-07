import Booking from "../models/booking.js"
import Car from "../models/Car.js";
import razorpayInstance from "../configs/razorpay.js";
import crypto from "crypto";

// Function to Check Availability of Car for a given date
const checkAvailabilty = async (car, pickupDate, returnDate)=>{
    const bookings = await Booking.find({
        car,
        pickupDate: {$lte: returnDate},
        returnDate: {$gte: pickupDate},
    })
    return bookings.length === 0;
}

// API to check Availability of Cars for given data and location
export const checkAvailabilityOfCar = async (req, res)=>{
    try {
        const {location, pickupDate, returnDate} = req.body

        const query = { isAvailable: true }
        if (location) {
            query.location = { $regex: new RegExp(`^${location}$`, 'i') }
        }
        const cars = await Car.find(query)



        // check car availabilty for the given date range using promise
        const AvailableCarsPromises = cars.map(async (car)=>{
           const isAvailable = await checkAvailabilty(car._id, pickupDate, returnDate)
           return {...car._doc, isAvailable: isAvailable}
        })
        let availableCars = await Promise.all(AvailableCarsPromises);
        availableCars = availableCars.filter(car => car.isAvailable === true)

        res.json({success:true, availableCars})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

//API to Create Booking
export const createBooking = async (req, res)=>{
    try {
        const {_id} = req.user;
        const {car, pickupDate, returnDate} = req.body;

        const isAvailable = await checkAvailabilty(car, pickupDate, returnDate)
        if(!isAvailable){
            return res.json({success: false, message:"Car is not available"})
        }

        const carData = await Car.findById(car)

        //Calculate price based on pickupDate and returnDate
        const picked = new Date(pickupDate);
        const returned = new Date(returnDate);
        const noOfDays = Math.ceil((returned - picked) /(1000 * 60 * 60 * 24))
        const price = carData.pricePerDay * noOfDays;

        //Create a Razorpay order for the booking amount (Razorpay Test Mode)
        const order = await razorpayInstance.orders.create({
            amount: Math.round(price * 100), // amount in paise
            currency: "INR",
            receipt: `rcpt_${Date.now()}`, // Razorpay caps receipt at 40 chars
            notes: { car, user: _id.toString(), pickupDate, returnDate }
        })

        res.json({
            success: true,
            message: "Order Created",
            order,
            price,
            key: process.env.RAZORPAY_KEY_ID
        })

    } catch (error) {
        console.log(error.message || error.error?.description || error);
        res.json({success: false, message: error.message || error.error?.description || "Something went wrong"})
    }
}

//API to Verify Razorpay Payment and Create Booking
export const verifyPayment = async (req, res)=>{
    try {
        const {_id} = req.user;
        const {razorpay_order_id, razorpay_payment_id, razorpay_signature, car, pickupDate, returnDate} = req.body;

        const generatedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');

        if(generatedSignature !== razorpay_signature){
            return res.json({success: false, message: "Payment verification failed"})
        }

        const isAvailable = await checkAvailabilty(car, pickupDate, returnDate)
        if(!isAvailable){
            return res.json({success: false, message:"Car is not available"})
        }

        const carData = await Car.findById(car)

        const picked = new Date(pickupDate);
        const returned = new Date(returnDate);
        const noOfDays = Math.ceil((returned - picked) /(1000 * 60 * 60 * 24))
        const price = carData.pricePerDay * noOfDays;

        await Booking.create({
            car,
            owner: carData.owner,
            user: _id,
            pickupDate,
            returnDate,
            price,
            isPaid: true,
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id
        })

        res.json({success: true, message: "Booking Created"})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

//API to List User Bookings
export const getUserBookings = async (req, res)=>{
    try {
        const {_id} = req.user;
        const bookings = await Booking.find({user: _id}).populate("car").sort({createdAt: -1})
        res.json({success: true, bookings})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

//API to get Owner Bookings

export const getOwnerBookings = async (req, res)=>{
    try {
        if(req.user.role !=='owner'){
            return res.json({success: false, message: "Unauthorized"})
        }
        const bookings = await Booking.find({owner: req.user._id})
            .populate('car user')
            .sort({createdAt: -1 })
        res.json({success: true, bookings})
   } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

//API to change booking status
export const changeBookingStatus = async (req, res)=>{
    try {
        const {_id} = req.user;
        const {bookingId, status} = req.body
        const booking = await Booking.findById(bookingId)
        if(booking.owner.toString() !== _id.toString()){
            return res.json({success: false, message: "Unauthorized"})
        }
        booking.status = status;
        await booking.save();
        res.json({success: true, message: "Status Updated"})
   } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

