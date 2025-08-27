import WebSocket, { WebSocketServer } from "ws";
import redisClient from "@repo/redisclient";
import { SUPPORTED_PAIRS } from "./constants";

const wss = new WebSocketServer({ port: 8080 });

interface IPosition {
  volume: number;
  timestamp: number;
  side: "BUY" | "SELL";
  entryPrice: number;
  unrealizedPnl: number;
  symbol: string;
  leverage: string;
  marginUsed: string;
}

const subscriber = redisClient.duplicate();
for (const pair of SUPPORTED_PAIRS) {
  subscriber.subscribe(pair, (err, count) => {
    if (err) {
      console.error("Failed to subscribe:", err);
    } else {
      console.log(`Subscribed to ${pair} (${count} channel(s) total)`);
    }
  });
}

const clientSubscriptions: Map<WebSocket, string> = new Map();

const clients: Set<WebSocket> = new Set();

const openPositions: Record<string, IPosition[]> = {};

wss.on("connection", async (ws, req) => {
  const url = req.url;

  const asset = url?.split("?asset=")[1];

  if (!asset) {
    ws.send(
      JSON.stringify({
        type: "ERROR",
        message: "No asset Found!",
      })
    );
    return;
  }

  clients.add(ws);
  clientSubscriptions.set(ws, asset);

  subscriber.on("message", (channel, message) => {
    const priceData = JSON.parse(message);

    for (const client of clients) {
      if (
        client.readyState === WebSocket.OPEN &&
        clientSubscriptions.get(ws) === asset
      ) {
        ws.send(
          JSON.stringify({
            type: "PRICE_UPDATE",
            price: priceData.price,
          })
        );
      }
    }
  });

  ws.on("message", (data) => {});

  ws.on("close", () => {});

  ws.on("error", (err) => {
    console.error(err.message);
  });
});
