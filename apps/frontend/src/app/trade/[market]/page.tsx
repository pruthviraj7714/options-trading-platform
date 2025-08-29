import { Card } from "@/components/ui/card";
import { SUPPORTED_MARKETS } from "@repo/common";
import Link from "next/link";
import ChartWithInterval from "@/components/ChartInterval";

export default async function Dashboard({
  params,
}: {
  params: Promise<{ market: string }>;
}) {
  const market = (await params).market;

  return (
    <div className="min-h-screen bg-slate-950 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-slate-100 mb-2">
            Crypto Trading Dashboard
          </h1>
          <p className="text-slate-400 text-lg">
            Real-time cryptocurrency charts and market data
          </p>
        </div>

        <div className="flex gap-2">
          {SUPPORTED_MARKETS.map((m) => (
            <Link
              href={`/trade/${m.symbol}`}
              className="px-4 py-2 bg-amber-500 text-white"
            >
              {m.name}
            </Link>
          ))}
        </div>

        {/* <Card className="p-6 bg-slate-900 border-slate-700">
          <TradingViewChart interval="1m" symbol={market} />
        </Card> */}

        <Card className="p-6 bg-slate-900 border-slate-700">
          <ChartWithInterval symbol={market} />
        </Card>
      </div>
    </div>
  );
}
