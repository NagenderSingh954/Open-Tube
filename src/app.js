import express from  'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';



const app=express()
 app.use(cors({                             //app.use use for middleware and configuration
    origin:process.env.CORS_ORIGIN,
    credentials:true
 }))                    

app.use(express.json({limit:'16kb'}))
// app.use(express.urlencoded)   it is sufficient 
app.use(express.urlencoded({extended:true,limit:'16kb'}))   //extented mean we can give more obj 
app.use(express.static('public'))       //public is our foldee
app.use(cookieParser())                 //use to read and set the cookies of the browser




//routess

import userRouter from './routes/user.routes.js'

//route declaration 

app.use('/api/v1/users',userRouter)
// app.get('/',(req,res)=>{
//    res.json({                 //for the [ersonal testing 
//       'message':'success'
//    })
// })


export {app};