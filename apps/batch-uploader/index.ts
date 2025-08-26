import redisclient from "@repo/redisclient";
import { BATCH_UPLOADER_STREAM, CONSUMER_NAME, GROUP_NAME } from "./config";
import prisma from "@repo/db";
import { Decimal } from "@prisma/client/runtime/library";

interface IOrder {
  streamId: string;
  symbol: string;
  price: number;
  timestamp: number;
}

function parseStreamData(streams: any[]) {
  const results: any[] = [];
  for (const [, entries] of streams) {
    for (const [id, fields] of entries) {
      const obj: Record<string, string> = {};
      for (let i = 0; i < fields.length; i += 2) {
        obj[fields[i]] = fields[i + 1];
      }
      if (obj.data) {
        results.push({ streamId: id, ...JSON.parse(obj.data) });
      }
    }
  }
  return results;
}

const createConsumerGroup = async () => {
  try {
    await redisclient.xgroup(
      "CREATE",
      BATCH_UPLOADER_STREAM,
      GROUP_NAME,
      "0",
      "MKSTREAM"
    );
  } catch (error: any) {
    if (error.message.includes("BUSYGROUP")) {
      console.log("Group Already exists");
    } else {
      console.error(error);
    }
  }
};

const processOrders = async (orders: IOrder[]) => {
  console.log(orders);
  
  await Promise.all(
    orders.map(async (o) => {
      await prisma.order.create({
        data: {
          price: new Decimal(o.price.toString()), 
          symbol: o.symbol,
          timestamp: new Date(o.timestamp),
        },
      });
      await redisclient.xack(BATCH_UPLOADER_STREAM, GROUP_NAME, o.streamId);
    })
  );
};

async function main() {
  await createConsumerGroup();

  const prevOrders = await redisclient.xreadgroup(
    "GROUP",
    GROUP_NAME,
    CONSUMER_NAME,
    "STREAMS",
    BATCH_UPLOADER_STREAM,
    "0"
  );

  if (prevOrders) {
    const data = parseStreamData(prevOrders);
    processOrders(data as IOrder[]);
  }

  while (true) {
    const incomingOrders = await redisclient.xreadgroup(
      "GROUP",
      GROUP_NAME,
      CONSUMER_NAME,
      "STREAMS",
      BATCH_UPLOADER_STREAM,
      ">"
    );

    if (incomingOrders) {
      const data = parseStreamData(incomingOrders)
      processOrders(data as IOrder[]);
    }

    await new Promise((r) => setTimeout(r, 500));
  }
}

main();
