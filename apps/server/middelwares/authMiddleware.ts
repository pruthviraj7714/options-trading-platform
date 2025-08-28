import type { NextFunction, Request, Response } from "express";
import { verify, type JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../config";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const headers = req.headers.authorization;

    const token = headers?.split(" ")[1];

    if (!token) {
      res.status(400).json({
        message: "missing token",
      });
      return;
    }

    const user = verify(token, JWT_SECRET) as JwtPayload;

    req.userId = user.sub;

    next();
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
