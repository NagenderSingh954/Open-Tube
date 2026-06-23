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
import videoRouter from './routes/video.routes.js'
import commentsRouter from './routes/comment.routes.js'
import likeRouter from './routes/like.routes.js'

//route declaration 

app.use('/api/v1/users',userRouter)
app.use('/api/v1/videos',videoRouter)
app.use('/api/v1/comments',commentsRouter)
app.use('/api/v1/likes',likeRouter)



app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({
        success: err.success || false,
        message: err.message || "Internal Server Error",
        errors: err.errors || []
    });
});

export {app};