import express from "express"
import { isLoggedIn } from "../middleware/auth.middleware.js"
import { RegisterUser,LoginUser,LogoutUser,CheckUser } from "../controllers/auth.controllers.js"
const authRoutes = express.Router()

authRoutes.post("/register",RegisterUser)
authRoutes.post("/login",LoginUser)
authRoutes.get("/logout",isLoggedIn,LogoutUser)
authRoutes.get("/check",isLoggedIn,CheckUser)

export default authRoutes