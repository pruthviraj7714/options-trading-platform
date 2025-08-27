import { Router } from "express";
import { SigninSchema, SignupSchema } from "@repo/common";
import prisma from "@repo/db";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";

const authRouter = Router();

authRouter.post("/register", async (req, res) => {
  try {
    const { error, data } = SignupSchema.safeParse(req.body);

    if (error) {
      res.status(400).json({
        message: "Invalid Format",
        error: error.message,
      });
      return;
    }

    const { username, password } = data;

    const existingUser = await prisma.user.findFirst({
      where: {
        username,
      },
    });

    if (existingUser) {
      res.status(400).json({
        message: "user with given username already exists",
      });
      return;
    }

    const user = await prisma.user.create({
      data: {
        username,
        password,
      },
    });

    res.status(201).json({
      message: "User successfully signed up",
      id: user.id,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { error, data } = SigninSchema.safeParse(req.body);

    if (error) {
      res.status(400).json({
        message: "Invalid Format",
        error: error.message,
      });
      return;
    }

    const { username, password } = data;

    const existingUser = await prisma.user.findFirst({
      where: {
        username,
      },
    });

    if (!existingUser) {
      res.status(400).json({
        message: "user with given username doesn't exists",
      });
      return;
    }

    if(existingUser.password !== password) {
      res.status(401).json({
        message : "Incorrect Password"
      });
      return;
    }

    const token = jwt.sign(
      {
        id: existingUser.id,
      },
      JWT_SECRET
    );

    res.status(200).json({
      message: "User successfully logged in!",
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

export default authRouter;
