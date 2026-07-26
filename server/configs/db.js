import mongoose from "mongoose";
const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => console.log("Database connected"))
        const remoteUri = process.env.MONGODB_URI || null;

        if (remoteUri) {
            try {
                await mongoose.connect(remoteUri)
                console.log('Connected to remote MongoDB')
                return
            } catch (err) {
                console.warn('Remote MongoDB connection failed:', err.message)
            }
        }
        // Fallback to local MongoDB
        const localUri = 'mongodb://127.0.0.1:27017/car-rental'
        await mongoose.connect(localUri)
        console.log('Connected to local MongoDB')
    } catch (error) {
        console.log('MongoDB connection error:', error.message);
        // Do not throw — allow server to start without DB for development

    }
}
export default connectDB;