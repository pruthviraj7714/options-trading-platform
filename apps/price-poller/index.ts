import redisClient from "@repo/redisclient";
import { BATCH_UPLOADER_STREAM } from "./config";

// const SUPPORTED_PAIRS = ["btcusdt", "solusdt", "ethusdt"];

async function main() {
  const ws = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@trade");

  ws.onopen = () => {
    console.log("connected to binance");
    // ws.send(
    //   JSON.stringify({
    //     method: "SUBSCRIBE",
    //     params: SUPPORTED_PAIRS.map((p) => `${p}@trade`),
    //     id: 1,
    //   })
    // );
  };

  ws.onmessage = async ({ data }) => {
    const payload = JSON.parse(data.toString())

    let priceData = {
      price : payload.p,
      timestamp : payload.T,
      symbol : payload.s
    };

    await redisClient.xadd(BATCH_UPLOADER_STREAM, "*", "data", JSON.stringify(priceData))
};

  ws.onclose = () => {
    console.log("client closed");
  };
}

main();
