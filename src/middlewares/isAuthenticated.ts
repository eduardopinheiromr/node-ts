import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

import authConfig from "../config/auth";

export default function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "JWT Token is missing." });
  }

  // Remove: 'Bearer ' from
  const token = authHeader.replace("Bearer ", "");

  try {
    const decodedToken = verify(token, authConfig.jwt.secret);

    console.log(decodedToken);

    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid JWT Token." });
  }
}
