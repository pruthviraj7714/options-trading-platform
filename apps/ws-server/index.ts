import WebSocket, { WebSocketServer } from "ws";
import redisClient from "@repo/redisclient";
import { SUPPORTED_PAIRS } from "./constants";

const wss = new WebSocketServer({ port: 8080 });

const marketsMap: Map<string, WebSocket[]> = new Map();

const broadcastToAllClientsByMarket = (asset: string, message: any) => {
  marketsMap.get(asset)?.forEach((client) => {
    client.send(JSON.stringify(message));
  });
};

const getOrCreateMarketMap = (asset: string) => {
  if (marketsMap.has(asset)) {
    return marketsMap.get(asset);
  }

  marketsMap.set(asset, []);

  return marketsMap.get(asset);
};

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

wss.on("connection", async (ws, req) => {
  const url = req.url;

  const asset = url?.split("?asset=")[1];

  if (asset) {
    const market = getOrCreateMarketMap(asset);
    market?.push(ws);
  }

  subscriber.on("message", (channel, message) => {
    const priceData = JSON.parse(message);

    broadcastToAllClientsByMarket(channel, {
      type: "PRICE_UPDATE",
      data: priceData,
    });
  });

  ws.on("message", (data) => {
    const payload = JSON.parse(data.toString());

    // switch (payload.type) {
    //   case "NEW_ORDER": {
    //     const order = payload.order;
    //     openPositions[payload.userId] = openPositions[payload.userId] || [];
    //     openPositions[payload.userId]?.push(order);
    //     break;
    //   }
    //   case "CANCEL_ORDER": {
    //     //TODO : cancel order
    //     break;
    //   }
    // }
  });

  ws.on("close", () => {});

  ws.on("error", (err) => {
    console.error(err.message);
  });
});
