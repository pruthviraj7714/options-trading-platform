import redisClient from "@repo/redisclient";
import { BATCH_UPLOADER_STREAM } from "./config";

const SUPPORTED_PAIRS = ["btcusdt", "solusdt", "ethusdt"];

async function main() {
  const ws = new WebSocket("wss://stream.binance.com:9443/ws");

  ws.onopen = () => {
    console.log("connected to binance");
    ws.send(
      JSON.stringify({
        method: "SUBSCRIBE",
        params: SUPPORTED_PAIRS.map((p) => `${p}@trade`),
        id: 1,
      })
    );
  };

  ws.onmessage = async ({ data }) => {
    try {
      const payload = JSON.parse(data.toString());

      if (!payload.p || !payload.T || !payload.s) return;

      let priceData = {
        price: payload.p,
        timestamp: payload.T,
        symbol: payload.s,
      };

      await redisClient.publish(
        `market:${payload.s}`,
        JSON.stringify(priceData)
      );

      await redisClient.xadd(
        BATCH_UPLOADER_STREAM,
        "*",
        "data",
        JSON.stringify(priceData)
      );
    } catch (error) {
      console.error(error);
    }
  };

  ws.onclose = () => {
    console.log("client closed");
  };
}

main();
