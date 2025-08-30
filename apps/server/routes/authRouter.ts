import { Router } from "express";
import { DecimalsMap, SigninSchema, SignupSchema } from "@repo/common";
import prisma from "@repo/db";
import { sign } from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import { authMiddleware } from "../middelwares/authMiddleware";

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

    const { email, password } = data;

    const existingUser = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (existingUser) {
      res.status(400).json({
        message: "user with given email already exists",
      });
      return;
    }

    const user = await prisma.user.create({
      data: {
        email,
        password,
        balance: 5000 * 10 ** (DecimalsMap["USDT"] ?? 2),
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

    const { email, password } = data;

    const existingUser = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!existingUser) {
      res.status(400).json({
        message: "user with given email doesn't exists",
      });
      return;
    }

    if (existingUser.password !== password) {
      res.status(403).json({
        message: "Incorrect Password",
      });
      return;
    }

    const jwt = sign(
      {
        sub: existingUser.id,
      },
      JWT_SECRET
    );

    res.status(200).json({
      message: "User successfully logged in!",
      jwt,
      id : existingUser.id
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

authRouter.get("/balance", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      res.status(400).json({
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      usd_balance: user.balance,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

export default authRouter;
