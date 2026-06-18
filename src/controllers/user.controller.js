import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiError } from "../utils/ApiErrro.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from 'jsonwebtoken'


const generateAccessAndrefreshToken = async (useId) => {

  try {
    const user = await User.findById(useId)

    const accessToken = await user.generateAccessToken()
    const refreshToken = await user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })
    return { accessToken, refreshToken }

  } catch (error) {
    throw new ApiError(500, "Something wenst wrong while generating the access and refresh token ")
  }
}

const registerUser = asyncHandler(async (req, res) => {
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
  const { username, email, fullName, password } = req.body;        //taking value

  if ([username, email, fullName, password].some((field) => field?.trim() === '')) {       //Checking requirement 
    throw new ApiError(400, "All Fields are Required")
  }
  const exiteduser = await User.findOne({          //checking the user existence
    $or: [{ username }, { email }]
  })
  if (exiteduser) {
    throw new ApiError(409, "User with email and usename alredy exist")
  }

  const avatarLocalPath = req.files?.avatar[0]?.path
  const coverImageLocalPath = req.files?.coverImage[0]?.path

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is Required ")
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath)
  const coverImage = await uploadOnCloudinary(coverImageLocalPath)

  if (!avatar) {
    throw new ApiError(400, "Avatar file is Required ")
  }


  const user = await User.create({
    email,
    fullName,
    username: username.toLowerCase(),
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || ""
  })

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  )
  if (!createdUser) {
    throw new ApiError(500, "Something Went wrong while registering the User ")
  }

  return res.status(201).json(
    new ApiResponse(200, createdUser, "User Created Successfully")
  )
})

const loginUser = asyncHandler(async (req, res) => {
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
  const { email, password } = req.body

  if (!email) {     //choose any one of these
    throw new ApiError(400, "Username And Passwors is required ")
  }
  /*const user = await User.findOne({
   $or:[{username},{email}]
  })*/
  const user = await User.findOne({ email })

  if (!user) {
    throw new ApiError(404, "User Does not exist")
  }

  const ispasswordvalid = await user.isPasswordCorrect(password)

  if (!ispasswordvalid) {
    throw new ApiError(404, "Password is incorrect")
  }
  const { accessToken, refreshToken } = await generateAccessAndrefreshToken(user._id)
  console.log(accessToken, refreshToken)

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

  const options = {      //be default cookies can be modiefied by the anyone but through this option we can tell who can modify
    httpOnly: true,      //Only server can modify these cookies through these options 
    secure: true
  }

  return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser, accessToken, refreshToken
        },
        "User Logged In Successfully"
      )
    )
})

const logoutUser = asyncHandler(async (req, res) => {
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
  const options = {      //be default cookies can be modiefied by the anyone but through this option we can tell who can modify
    httpOnly: true,      //Only server can modify these cookies through these options 
    secure: true
  }

  return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
      new ApiResponse(200, {}, 'User Logged Out Successfully')
    )
})

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized Request")
  }
 try {
   const decoded = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
 
   const user = await User.findById(decoded?._id)
 
   if (!user) {
     throw new ApiError(401, "Invalid refresh token")
   }
 
   if (incomingRefreshToken !== user.refreshToken) {
     throw new ApiError(401, "Refresh Token is Expire or Invalid ")
   }
 
   const {accessToken,newRefreshToken}=await generateAccessAndrefreshToken(user._id)
   const options = {      //be default cookies can be modiefied by the anyone but through this option we can tell who can modify
     httpOnly: true,      //Only server can modify these cookies through these options 
     secure: true
   }
 
   return res.status(200)
   .cookie("accessToke",accessToken,options)
   .cookie("refreshToken",newRefreshToken,options)
   .json(
     new ApiResponse(
       200,
       {
         accessToken,refreshToken:newRefreshToken
       },
       "Access Token Refreshed Successfully"
     )
   )
 } catch (error) {
      throw new ApiError(401,error?.message || "Invalid Refresh Token")
 }


})


const changeCurrentPassword=asyncHandler(async (req,res)=>{
  /*
  checke for the user is login or not 
  req the old password and varify with the DB 
  req new password 
  save in DB 
  */
 const {oldPassword,newPassword}=req.body

 const user = await User.findById(req.user._id)
 
 const isPasswordCorrect=await user.isPasswordCorrect(oldPassword)

  if(!isPasswordCorrect){
    throw new ApiError(400,"Old Password is Incorrect ")
  }

  user.password=newPassword

  await user.save({validateBeforeSave:false})

  return res.status(200).json(
    new ApiResponse(200,{},"Password Changed Successfully")
  )


})


const getCurrentUser=asyncHandler(async (req,res)=>{
  const user=req.user
  return res.status(200).json(
    new ApiResponse(200,user,"current User Fetch Successfully")  // they give direct json instead APIresponce
  )
})

const updateUserDatail=asyncHandler(async (req,res)=>{
  const {fullName,email,}=req.body

  if(!(fullName || email)){
    throw new ApiError(400,'All Field are require')
  }
  const user= await User.findByIdAndUpdate(
    req.user?._id,
    {
     $set:{ email:email,
      fullName:fullName}
    },
    {new:true}        // return the updated info 
  ).select("-password")

  return res.status(200).json(
    new ApiResponse(200,user,"User Detail Updated Successfully")
  )

})

const updateUserAvatar=asyncHandler(async (req,res)=>{
    const avatarLocalPath = req.file?.path

    if(!avatarLocalPath){
      throw new ApiError(400,"Avatar file is Required ")
    }


    const avatar = await uploadOnCloudinary(avatarLocalPath)
    if (!avatar.url) {
    throw new ApiError(400, "Error in Uploading On Cloud While Updating the Avatar")
  }

  const user=await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set:{
        avatar:avatar.url
      }
    },
    {new:true} 
  ).select("-password")

  return res.status(200).json(
    new ApiResponse(200,user,"Avatar Updated SuccessFully")
  )
})

const updateUserCoverImage=asyncHandler(async (req,res)=>{
    const coverImageLocalPath = req.file?.path

    if(!coverImageLocalPath){
      throw new ApiError(400,"Cover file is Required ")
    }


    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    if (!coverImage.url) {
    throw new ApiError(400, "Error in Uploading On Cloud While Updating the Cover Iamge ")
  }

  const user=await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set:{
        coverImage:coverImager.url
      }
    },
    {new:true} 
  ).select("-password")

  return res.status(200).json(
    new ApiResponse(200,user,"Cover Image  Updated SuccessFully")
  )
})

export { registerUser,
   loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateUserDatail,
   updateUserAvatar,
  updateUserCoverImage }