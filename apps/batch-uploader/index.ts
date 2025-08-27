import redisclient from "@repo/redisclient";
import { BATCH_UPLOADER_STREAM, CONSUMER_NAME, GROUP_NAME } from "./config";
import prisma from "@repo/db";
import { Decimal } from "@prisma/client/runtime/library";

interface ITrade {
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

const processTrades = async (trades: ITrade[]) => {
  await prisma.trade.createMany({
    data: trades.map((t) => ({
      price: new Decimal(t.price.toString()),
      timestamp: new Date(t.timestamp),
      symbol: t.symbol,
    })),
  });
  await Promise.all(
    trades.map((trade) =>
      redisclient.xack(BATCH_UPLOADER_STREAM, GROUP_NAME, trade.streamId)
    )
  );
};

async function main() {
  await createConsumerGroup();

  while (true) {
    const messages = await redisclient.xreadgroup(
      "GROUP",
      GROUP_NAME,
      CONSUMER_NAME,
      "STREAMS",
      BATCH_UPLOADER_STREAM,
      ">"
    );

    if (messages) {
      const data = parseStreamData(messages);
      await processTrades(data as ITrade[]);
    }

    await new Promise((r) => setTimeout(r, 1000));
  }
}

main();
