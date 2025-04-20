import { ApiResponse } from "../libs/api-response.js";
import { asyncHandler } from "../libs/async-handler.js";

export const healthcheck = asyncHandler(async(req,res)=>{
    return res.status(200).json(new ApiResponse(200,null,"health check ok"))
})