import { ApiError } from "../libs/api-error.js";
import { asyncHandler } from "../libs/async-handler.js";
import jwt from "jsonwebtoken";
import { db } from "../libs/db.js";

export const isLoggedIn = asyncHandler(async (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json(new ApiError(401, "Token not Found"));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  if (!decoded) {
    return res.status(401).json(new ApiError(401, "Decoding Token Failed"));
  }

  const user = await db.user.findUnique({
    where: {
      id: decoded.id,
    },
    select: {
      id: true,
      image: true,
      name: true,
      email: true,
      role: true,
    },
  });

  if (!user) {
    return res.status(404).json(new ApiError(404, "User not Found"));
  }

  req.user = user;

  next();
});
