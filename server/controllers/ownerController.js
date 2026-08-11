import imagekit from "../configs/imageKit.js"
import Booking from "../models/booking.js";
import Car from "../models/Car.js";
import User from "../models/User.js";
import fs from "fs";

//API to List Car

export const addCar = async (req, res)=>{
    try {
        const{_id} = req.user;
        const imageFile = req.file;

        if (!imageFile || !req.body.carData) {
            return res.status(400).json({
                success: false,
                message: "Send carData as JSON text and image as a file in form-data"
            });
        }

        let car = JSON.parse(req.body.carData)

        // Normalize and coerce types coming from the client (strings -> numbers/booleans)
        if (car.year) car.year = Number(car.year)
        if (car.pricePerDay) car.pricePerDay = Number(car.pricePerDay)
        if (car.seating_capacity) car.seating_capacity = Number(car.seating_capacity)
        if (typeof car.isAvailable === 'undefined') car.isAvailable = true

        // Basic validation for required fields
        const requiredFields = ['brand', 'model', 'year', 'pricePerDay', 'category', 'location']
        for (const field of requiredFields) {
            if (!car[field]) {
                return res.status(400).json({ success: false, message: `${field} is required` })
            }
        }
        
        //Upload Image to ImageKit
        const response = await imagekit.files.upload({
            file: fs.createReadStream(imageFile.path),
            fileName: imageFile.originalname,
            folder: '/cars'
        })

        // optimization through imagekit URL transformation
        const optimizedImageUrl = imagekit.helper.buildSrc({
           urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
           src: response.filePath,
           transformation: [
           {width: '1280' },  //Width resizing
           {quality: 80},
           {format: 'webp'}   //convert to modern format
        
        ],
        });
              
        const image = optimizedImageUrl;

        // Remove temporary uploaded file if it exists
        try {
            if (imageFile?.path) fs.unlinkSync(imageFile.path)
        } catch (e) {
            console.warn('Could not remove temp file', e.message)
        }

        await Car.create({ ...car, owner: _id, image })

        res.json({ success: true, message: 'Car Added' })

    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: error.message})

        
    }

}

// API to List Owner Cars
export const getOwnerCars = async (req, res)=>{
    try {
        const{_id} = req.user;
        const cars = await Car.find({owner: _id})
        res.json({success: true, cars})
    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: error.message})
        
    }

}

//API to Toggle Car Availability
export const toggleCarAvailability = async (req, res) =>{
    try {
        const{_id} = req.user;
        const {carId} = req.body
        const car = await Car.findById(carId)

        //Checking is car belongs to the user
        if(car.owner.toString() !== _id.toString()){
            return res.json({success: false, message: "Unauthorized"});
        }
        
        car.isAvailable = !car.isAvailable;
        await car.save()
        res.json({success: true, message: "Availability Toggled", car})
    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: error.message})
        
    }

}

//API TO DELETE THE CARS
export const deleteCars = async (req, res) =>{
    try {
        const{_id} = req.user;
        const {carId} = req.body
        const car = await Car.findById(carId)

        //Checking is car belongs to the user
        if(car.owner.toString() !== _id.toString()){
            return res.json({success: false, message: "Unauthorized"});
        }
        
        car.owner = null;
        car.isAvailable = false;

        await car.save()

        res.json({success: true, message: "Car Removed"})
    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: error.message})
        
    }

}

//API to get Dashboard Data
export const getDashboardData = async (req, res) =>{
    try {
        const {_id, role} = req.user;

        if(role !=='owner'){
            return res.json({success: false, message: "Unauthorized"});
        }

        const cars = await Car.find({owner: _id})
        const bookings = await Booking.find({owner:_id}).populate('car').
        sort({createdAt: -1});

        const pendingBookings = await Booking.find({owner: _id, status: "pending"})
        const completedBookings = await Booking.find({owner: _id, status: "confirmed"})

        //calculate monthlyRevenue from bookings where status is confirmed.
        //calculate monthlyRevenue from bookings where status is confirmed.

        const monthlyRevenue = bookings.filter(booking=> booking.status === 'confirmed').reduce((acc, booking)=> acc + booking.price, 0)
        const dashboardData = {
            totalCars: cars.length,
            totalBookings: bookings.length,
            pendingBookings: pendingBookings.length,
            completedBookings: completedBookings.length,
            recentBookings: bookings.slice(0,3),
            monthlyRevenue
        }

        res.json({ success: true, dashboardData})
    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: error.message})
        
    }

}

//API to update user image

export const updateUserImage = async (req, res)=>{
    try {
        const {_id, role} = req.user;

        const imageFile = req.file;
        
        //Upload Image to ImageKit
        const response = await imagekit.files.upload({
            file: fs.createReadStream(imageFile.path),
            fileName: imageFile.originalname,
            folder: '/users'
        })

        // optimization through imagekit URL transformation
        const optimizedImageUrl = imagekit.helper.buildSrc({
           urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
           src: response.filePath,
           transformation: [
           {width: '1280' },  //Width resizing
           {quality: 80},
           {format: 'webp'}   //convert to modern format
        
        ],
        });

        const image = optimizedImageUrl;

        await User.findByIdAndUpdate(_id, {image});
        res.json({success: true, message: "Image Updated"})


    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: error.message})
        
    }
}


