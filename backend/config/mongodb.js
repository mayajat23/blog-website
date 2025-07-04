import mongoose from "mongoose";

const connectDB = async ()=>{
    console.log("MONGODB_URI:", process.env.MONGODB_URI);


    mongoose.connection.on('connected', ()=>console.log("Database Connected"));
await mongoose.connect(`${process.env.MONGODB_URI}/blog-website`);
};

export default connectDB;