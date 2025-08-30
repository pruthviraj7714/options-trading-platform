import redisClient from "@repo/redisclient";
import { BATCH_UPLOADER_STREAM } from "./config";
import { DecimalsMap, SUPPORTED_MARKETS } from "@repo/common";

const publisher = redisClient.duplicate();

async function main() {
  const ws = new WebSocket("wss://stream.binance.com:9443/ws");

  ws.onopen = () => {
    console.log("connected to binance");
    ws.send(
      JSON.stringify({
        method: "SUBSCRIBE",
        params: SUPPORTED_MARKETS.map((m) => `${m.symbol.toLowerCase()}@trade`),
        id: 1,
      })
    );
  };

  ws.onmessage = ({ data }) => {
    try {
      const payload = JSON.parse(data.toString());

      if (!payload.p || !payload.T || !payload.s) return;

      let priceData = {
        price: parseFloat(payload.p),
        timestamp: payload.T,
        symbol: payload.s,
      };

      const buyPrice = priceData.price + priceData.price * 0.001;
      const sellPrice = priceData.price - priceData.price * 0.001;

      const decimal = DecimalsMap[payload.s.slice(0, -4)] ?? 6;

      let prices = {
        buyPrice: Math.round(buyPrice * 10 ** decimal),
        sellPrice: Math.round(sellPrice * 10 ** decimal),
        symbol: priceData.symbol,
        price: Math.round(payload.p * 10 ** decimal),
        timestamp: payload.T,
        decimal,
      };

      publisher.publish(payload.s, JSON.stringify(prices));

      redisClient.xadd(
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
