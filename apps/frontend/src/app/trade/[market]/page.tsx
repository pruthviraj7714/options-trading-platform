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
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="text-center py-10">
          <h1 className="text-5xl font-extrabold text-slate-100 mb-3 tracking-tight">
            Crypto Trading Dashboard
          </h1>
          <p className="text-slate-400 text-lg">
            Real-time cryptocurrency charts and market insights
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {SUPPORTED_MARKETS.map((m) => (
            <Link
              key={m.name}
              href={`/trade/${m.symbol}`}
              className="group flex items-center justify-center rounded-xl border border-slate-800 bg-background transition-all p-4 shadow-md hover:shadow-lg"
            >
              <span className="text-slate-200 font-medium group-hover:text-amber-400">
                {m.name}
              </span>
            </Link>
          ))}
        </div>

          <ChartWithInterval symbol={market} />
      </div>
    </div>
  );
}
