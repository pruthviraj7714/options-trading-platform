import prisma from "@repo/db";
import { Router } from "express";

const candleRouter = Router();

const getIntervalDuration = (interval: string): string => {
  switch (interval) {
    case "1m":
      return "1 minute";
    case "5m":
      return "5 minutes";
    case "15m":
      return "15 minutes";
    case "1h":
      return "1 hour";
    case "4h":
      return "4 hours";
    case "1d":
      return "1 day";
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

    const intervalDuration = getIntervalDuration(interval as string);

    const end = new Date();
    const start = new Date(end.getTime() - 360 * 60 * 1000);

    const candles = await prisma.$queryRaw`
      SELECT
        time_bucket_gapfill(${intervalDuration}::interval, timestamp) AS bucket,
        symbol,
        CAST(first(price, timestamp) AS DOUBLE PRECISION) AS open,
        CAST(max(price) AS DOUBLE PRECISION) AS high,
        CAST(min(price) AS DOUBLE PRECISION) AS low,
        CAST(last(price, timestamp) AS DOUBLE PRECISION) AS close,
        CAST(count(*) AS INTEGER) as trades
      FROM "Trade"
      WHERE symbol = ${symbol} AND timestamp >= ${start}::timestamptz AND timestamp <= ${end}::timestamptz
      GROUP BY bucket, symbol
      ORDER BY bucket ASC;
    `;

    res.status(200).json(candles);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

export default candleRouter;
