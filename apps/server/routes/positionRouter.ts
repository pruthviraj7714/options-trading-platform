import { OrderSchema } from "@repo/common";
import { Router } from "express";
import { authMiddleware } from "../middelwares/authMiddleware";
import prisma from "@repo/db";
import redisclient from "@repo/redisclient";

const positionRouter = Router();

const LEVERAGE = 2;

positionRouter.post("/place", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const { error, data } = OrderSchema.safeParse(req.body);

    if (error) {
      res.status(400).json({
        message: error.format(),
      });
      return;
    }

    const { asset, volume, side } = data;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      res.status(401).json({
        message: "User not found",
      });
      return;
    }

    const latestPrice = await redisclient.get(`price:${asset}USDT`) || "0";

    const margin = (volume * parseFloat(latestPrice)) / LEVERAGE;

    if (user.balance < margin) {
      res.status(400).json({
        message: "Insufficient funds",
      });
      return;
    }

    const orderData = {
      side,
      volume,
      price : latestPrice,
      userId,
      asset,
    };

    // wsClient.send(
    //   JSON.stringify({
    //     type: "NEW_ORDER",
    //     order: orderData,
    //     userId 
    //   })
    // );

    res.status(200).json({
      message: "Position Successfully Placed",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

//TODO
positionRouter.post("/close/:positionId", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const positionId = req.params.positionId;

   
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

export default positionRouter;
