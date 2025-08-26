import { WebSocketServer } from "ws";
import redisClient from "@repo/redisclient";

const wss = new WebSocketServer({port : 8080});

wss.on("connection", async (ws, req) => {
    const url = req.url;

    const market = url?.split("?market=")[1];

    if(!market) {
        ws.send(JSON.stringify({
            type : "ERROR",
            message : "No Market Found!"
        }));
        return;
    }

    redisClient.subscribe(market, (err, count) => {
        if (err) {
          console.error("Failed to subscribe:", err);
        } else {
          console.log(`Subscribed to ${market} (${count} channel(s) total)`);
        }
      });

      redisClient.on("message", (channel, data) => {
        if(channel === `market:${market}`) {
            const parseData = JSON.parse(data.toString())
            console.log(parseData);
        }
      })


  ws.on("message", (data) => {});


  ws.on("close", () => {});

  ws.on("error", (err) => {
    console.error(err.message);
  });
});
