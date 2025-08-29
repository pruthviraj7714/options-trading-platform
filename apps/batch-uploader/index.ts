import redisclient from "@repo/redisclient";
import { BATCH_UPLOADER_STREAM, CONSUMER_NAME, GROUP_NAME } from "./config";
import prisma from "@repo/db";

interface ITrade {
  streamId: string;
  symbol: string;
  price: number;
  timestamp: number;
}

const MAX_BATCH_SIZE = 100;

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
    data: trades.map((t) => {
      const decimalsMap: Record<string, number> = {
        BTCUSDT: 2,
        ETHUSDT: 2,
        SOLUSDT: 6,
      };

      const decimals = decimalsMap[t.symbol] ?? 6;
      const scaledPrice = BigInt(Math.round(Number(t.price) * 10 ** decimals));

      return {
        price: scaledPrice,
        decimals,
        timestamp: new Date(t.timestamp),
        symbol: t.symbol,
      };
    }),
  });
  await Promise.all(
    trades.map((trade) =>
      redisclient.xack(BATCH_UPLOADER_STREAM, GROUP_NAME, trade.streamId)
    )
  );
};

async function main() {
  await createConsumerGroup();

  let batch: ITrade[] = [];
  let batchTimeout: NodeJS.Timeout | null = null;

  const flushBatch = async () => {
    if (batch.length > 0) {
      await processTrades([...batch]);
      batch = [];
    }

    if (batchTimeout) {
      clearTimeout(batchTimeout);
      batchTimeout = null;
    }
  };

  const startBatchTimer = () => {
    if (batchTimeout) clearTimeout(batchTimeout);
    batchTimeout = setTimeout(async () => await flushBatch(), 5000);
  };

  while (true) {
    try {
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
        batch.push(...data);

        if (batch.length === data.length) {
          startBatchTimer();
        }

        if (batch.length >= MAX_BATCH_SIZE) {
          await flushBatch();
        }
      }
    } catch (error) {
      console.error("Error in batch processing loop:", error);
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
}

main();
