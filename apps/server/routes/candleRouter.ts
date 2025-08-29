import prisma from "@repo/db";
import { Router } from "express";

const candleRouter = Router();

const getCandleView = (interval: string): string => {
  switch (interval) {
    case "1m":
      return "candle_1m";
    case "5m":
      return "candle_5m";
    case "15m":
      return "candle_15m";
    case "1h":
      return "candle_1h";
    case "4h":
      return "candle_4h";
    case "1d":
      return "candle_1d";
    default:
      throw new Error("Invalid interval");
  }
};

candleRouter.get("/", async (req, res) => {
  try {
    const { symbol, interval } = req.query;

    if (!symbol || !interval) {
      return res.status(400).json({
        message: "Invalid Query: symbol and interval are required",
      });
    }

    const viewName = getCandleView(interval as string);

    const end = new Date();
    const start = new Date(end.getTime() - 60 * 60 * 1000);

    const candles : any = await prisma.$queryRawUnsafe(
      `
      SELECT bucket, symbol, open, high, low, close
      FROM "${viewName}"
      WHERE symbol = $1
        AND bucket >= $2::timestamptz
        AND bucket <= $3::timestamptz
      ORDER BY bucket ASC;
      `,
      symbol,
      start,
      end
    );

    const decimals = 6; 
    const formattedCandles = candles.map((c: any) => ({
      ...c,
      open: Number(c.open) / 10 ** decimals,
      high: Number(c.high) / 10 ** decimals,
      low: Number(c.low) / 10 ** decimals,
      close: Number(c.close) / 10 ** decimals,
    }));
    res.status(200).json(formattedCandles);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

export default candleRouter;
