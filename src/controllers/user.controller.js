import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiError } from "../utils/ApiErrro.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const generateAccessAndrefreshToken=async (useId)=>{
 
    try {
       const user= await User.findById(useId)
        
        const accessToken =await user.generateAccessToken()
        const refreshToken =await user.generateRefreshToken()
      
        user.refreshToken=refreshToken
        await user.save({validateBeforeSave:false})
        return {accessToken,refreshToken}

    } catch (error) {
      throw new ApiError(500,"Something wenst wrong while generating the access and refresh token ")
    }
}

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

const loginUser=asyncHandler(async(req,res)=>{
  /*
    take input from the user using req.body 
    varify the user if Exist from the DB using username or email 
   (Check the User Password wheter correct or not   )
    after varification generate the Access token And refresh token 
    store the refresh token in DB
    Send this Token using the ccookies
    before the expiry of ACT ask for the refresh token 
    validate the token 
    continue the setion 
  */
 const {email,password}=req.body

 if(!email){     //choose any one of these
  throw new ApiError(400,"Username And Passwors is required ")
 }
 /*const user = await User.findOne({
  $or:[{username},{email}]
 })*/
const user =await User.findOne({email})

 if(!user){
  throw new ApiError(404,"User Does not exist")
 }

 const ispasswordvalid=await user.isPasswordCorrect(password)
 
 if(!ispasswordvalid){
  throw new ApiError(404,"Password is incorrect")
 }
 const {accessToken,refreshToken}=await generateAccessAndrefreshToken(user._id)
 console.log(accessToken,refreshToken)

 const loggedInUser=await User.findById(user._id).select("-password -refreshToken")

 const options={      //be default cookies can be modiefied by the anyone but through this option we can tell who can modify
  httpOnly:true,      //Only server can modify these cookies through these options 
  secure:true
 }

 return res.status(200)
  .cookie("accessToken",accessToken,options)
  .cookie("refreshToken",refreshToken,options)
  .json(
    new ApiResponse(
      200,
      {
        user:loggedInUser,accessToken,refreshToken
      },
      "User Logged In Successfully"
    )
  )
})

const logoutUser=asyncHandler(async(req,res)=>{
  await User.findByIdAndUpdate(
    req.user._id,                 //this req.user come from auth middleware which is injected in the routers 
    {
    $unset: {
      refreshToken: 1
    }
  },
    {
      returnDocument: 'after'
    }
  )
  const options={      //be default cookies can be modiefied by the anyone but through this option we can tell who can modify
  httpOnly:true,      //Only server can modify these cookies through these options 
  secure:true
 }

 return res.status(200)
 .clearCookie("accessToken",options)
 .clearCookie("refreshToken",options)
 .json(
  new ApiResponse(200,{},'User Logged Out Successfully')
 )
})




export {registerUser,loginUser,logoutUser}