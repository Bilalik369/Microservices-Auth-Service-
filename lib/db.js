import mongoose from "mongoose";

export const connectDB = async()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("data base connecting successfuly")
    } catch (error) {
        console.log("error to conecting ")
        process.exit(1)
    }
}