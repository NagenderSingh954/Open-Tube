import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiError } from "../utils/ApiErrro.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser=asyncHandler(async (req,res)=>{
   /*Stepst in the registation
        take value from the the frontend 
        validation for the email and password provided by the user 
        check if the user alredy exist or not (cheking with both email and password)
        check for images & check for avtar 
        if available upload them to cloudnary   
        after the checking hash the password 
        check for the avtar uploaded successfully or not 
        create user objecet -  create enty in the DB (responc3 from db give all the user detail)
        remove password and responvce token field 
        check for user crreated successfully or not 
        return responce 
        */
       const {username,email,fullName,password}=req.body;        //taking value
       console.log(password,email)
       console.log(req.headers["content-type"]);
       if ([username,email,fullName,password].some((field)=>field?.trim()==='')) {       //Checking requirement 
         throw new ApiError(400,"All Fields are Required")
       }
       const exiteduser=await User.findOne({          //checking the user existence
        $or:[{username},{email}]
       })
       if(exiteduser){                  
        throw new ApiError(409,"User with email and usename alredy exist")
       }
       
       const avatarLocalPath= req.files?.avatar[0]?.path
       const coverImageLocalPath=req.files?.coverImage[0]?.path
       
       if(!avatarLocalPath){
          throw new ApiError(400,"Avatar file is Required ")
       }

       const avatar=await uploadOnCloudinary(avatarLocalPath)
       const coverImage=await uploadOnCloudinary(coverImageLocalPath)
       
       if(!avatar){
        throw new ApiError(400,"Avatar file is Required ")  
       }


       const user= await User.create({
        email,
        fullName,
        username:username.toLowerCase(),
        password,
        avatar:avatar.url,
        coverImage:coverImage?.url || ""
       })

      const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
      )
      if(!createdUser){
        throw new ApiError(500, "Something Went wrong while registering the User ")
      }

       return res.status(201).json(
        new ApiResponse(200,createdUser,"User Created Successfully")
       )
})


export {registerUser,}