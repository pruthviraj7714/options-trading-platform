import redisClient from "@repo/redisclient";
import { BATCH_UPLOADER_STREAM } from "./config";

const SUPPORTED_PAIRS = ["btcusdt", "solusdt", "ethusdt"];

const publisher = redisClient.duplicate();

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

  ws.onmessage = ({ data }) => {
    try {
      const payload = JSON.parse(data.toString());

      if (!payload.p || !payload.T || !payload.s) return;

      let priceData = {
        price: payload.p,
        timestamp: payload.T,
        symbol: payload.s,
      };

      const buyPrice = priceData.price + priceData.price * 0.005;
      const sellPrice = priceData.price - priceData.price * 0.005;

      let prices = {
        buyPrice,
        sellPrice,
        symbol: priceData.symbol,
      };

      publisher.publish(`market:${payload.s}`, JSON.stringify(prices));

      redisClient.xadd(
        BATCH_UPLOADER_STREAM,
        "*",
        "data",
        JSON.stringify(priceData)
      );

      redisClient.set(`price:${payload.s}`, priceData.price);
    } catch (error) {
      console.error(error);
    }
  };

  ws.onclose = () => {
    console.log("client closed");
  };
}

main();
