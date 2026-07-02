import mongoose from "mongoose";
import {DB_NAME} from "../constants.js";

const connectDB = async()=>{
    try{
       const connectionInstance= await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
       console.log(`MongoDB Connected !! DB HOST : ${connectionInstance.connection.host}`) //todo study this connectionInstance
    //    console.log(connectionInstance);
    }catch(err){
        console.log("MongoDB Connection Failed : ", err)
        process.exit(1)
    }
}

export default connectDB