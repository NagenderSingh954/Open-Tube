const asyncHandler=(requestHandler)=>{
    (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).catch((err)=>next(err))
    }
}  // below code is same with try catch 

export {asyncHandler}


// const asyncHandler=()=>{}
// const asyncHandler=(fn)=>{()=>{}}
// const asyncHandler=(fn)=>async ()=>{}
// abpve is the step os the below fn

// const asyncHandler=(fn)=> async(req,res,next)=>{        // this is the wraper fn that iis use for async await
//     try{
//         await fn(req,res,next)
//     }catch(err){
//         res.status(err.code || 500 ).json({
//             success:false,
//             message:err.message
//         })
//     }
// }