// const mongoose = require("mongoose");
import mongoose from "mongoose";
const connectDb =async ()=>{
    try {
        mongoose.connect(process.env.MONGODB_URL)
        console.log("DB connected");
        
    } catch (error) {
        console.error("DB Error", error);
        
    }
}
export default connectDb;