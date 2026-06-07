// require('dotenv').config({path:'./env'})      this also work but code consistency not match
import dotenv from 'dotenv'                 //for consistency
import connectDB from "./db/index.js";

dotenv.config({
    path:'./env'
})


connectDB()
















// this is the 1st Approch to connect the DB

/*import express from "express"
const app=express()

;(async ()=>{
    try{
       await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
       app.on("error",(error)=>{
        console.log("App not able to talk: ",error)
        throw error
       })
       app.listen(process.env.PORT,()=>{
        console.log(`Application is listning on`,process.env.PORT)
       })
    }catch(err){
        console.log("Error in DB Connection :", err)
        throw err
    }
})()*/
