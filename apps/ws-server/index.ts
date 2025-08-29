import WebSocket, { WebSocketServer } from "ws";
import redisClient from "@repo/redisclient";
import { SUPPORTED_MARKETS } from "@repo/common";

interface IPriceData {
  buyPrice: number;
  sellPrice: number;
  symbol: string;
  price: number;
  timestamp: number;
}

const wss = new WebSocketServer({ port: 8080 });

const marketsMap: Map<string, WebSocket[]> = new Map();
const latestPrices: Map<string, IPriceData> = new Map();

const broadcastToAllClients = (message: any) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
};

const getOrCreateMarketMap = (market: string) => {
  if (marketsMap.has(market)) {
    return marketsMap.get(market);
  }

  marketsMap.set(market, []);

  return marketsMap.get(market);
};

const subscriber = redisClient.duplicate();

for (const pair of SUPPORTED_MARKETS) {
  subscriber.subscribe(pair.symbol, (err, count) => {
    if (err) {
      console.error("Failed to subscribe:", err);
    } else {
      console.log(`Subscribed to ${pair.name} (${count} channel(s) total)`);
    }
  });
}

subscriber.on("message", (channel, message) => {
  const priceData = JSON.parse(message);
  const allPrices: Record<string, IPriceData> = {};

  latestPrices.set(channel, priceData);

  for (const pair of SUPPORTED_MARKETS) {
    const priceData = latestPrices.get(pair.symbol)!;
    if (priceData) {
      allPrices[pair.symbol] = priceData;
    }
  }

  broadcastToAllClients({
    type: "PRICE_UPDATE",
    data: priceData,
  });
});

wss.on("connection", async (ws, req) => {
  const url = req.url;

  const symbol = url?.split("?market=")[1];

  if (symbol) {
    const market = getOrCreateMarketMap(symbol);
    market?.push(ws);
  }

  ws.on("message", (data) => {
    const payload = JSON.parse(data.toString());
  });

  ws.on("close", () => {});

  ws.on("error", (err) => {
    console.error(err.message);
  });
});
