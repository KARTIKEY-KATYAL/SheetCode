import { asyncHandler } from "../libs/async-handler.js";
import { ApiResponse } from "../libs/api-response.js";
import { ApiError } from "../libs/api-error.js";
import { db } from "../libs/db.js";
import bcrypt from "bcryptjs";
import { UserRole } from "../generated/prisma/index.js";
import jwt from "jsonwebtoken";
import { uploadOnCloudinary } from "../libs/cloudinary.js";


export const RegisterUser = asyncHandler(async (req, res) => {
  const { name, email, password, image } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json(new ApiError(400, "Missing Credentials"));
  }

  try {
    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json(new ApiError(400, "User already exists"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const avatar = await uploadOnCloudinary(avatarLocalPath, "avatar");

    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        image: avatar?.url,
        role: UserRole.USER,
      },
    });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });



    return res.status(201).json(new ApiResponse(201, user, "User Created"));
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json(new ApiError(500, "Error Creating User"));
  }
});

export const LoginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.send(400).json(new ApiError(400, "Email and Password are required"))
  }

  try {
    const user = await db.user.findUnique({ where: { email } });

    if (!user) {
      res.status(401).json(
        new ApiError(401, "User not found")
      )
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(401).json(
        new ApiError(401, "Invalid Credentials")
      )
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    return res.status(200).json(
      new ApiResponse(200, user, "User Logged In")
    )
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json(new ApiError(500, "Error Logining User"));
  }
});
export const LogoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
  });
  const user = req.user
  res.status(200).json(
    new ApiResponse(200, user, "Log Out Successfully")
  );
});

export const CheckUser = asyncHandler(async (req, res) => {
  if (!req.user){
    return new ApiError(404,"User not Found")
  }
  res.status(200).json(
    new ApiResponse(200, req.user, "User Found"),
  );
});
