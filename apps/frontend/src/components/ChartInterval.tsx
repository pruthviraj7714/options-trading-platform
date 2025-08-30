"use client"

import { useState } from "react"
import TradingViewChart from "@/components/TradingViewChart"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock } from "lucide-react"

type Props = {
  symbol: string
}

const INTERVALS = ["1m", "5m", "15m", "1h", "4h", "1d"] as const
type Interval = (typeof INTERVALS)[number]

export default function ChartWithInterval({ symbol }: Props) {
  const [interval, setInterval] = useState<Interval>("1m")

  return (
    <Card className="p-5 md:p-6 bg-background rounded-2xl shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-100 tracking-tight">
            {symbol.slice(0,-4)} / USDT
          </h2>
          <p className="text-slate-400 text-sm flex items-center gap-1">
            <Clock size={14} className="text-slate-500" /> Interval: {interval}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {INTERVALS.map((iv) => {
            const isActive = iv === interval
            return (
              <Button
                key={iv}
                size="sm"
                variant={isActive ? "default" : "secondary"}
                className={
                  isActive
                    ? "bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg shadow-md"
                    : "bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
                }
                onClick={() => setInterval(iv)}
                aria-pressed={isActive}
              >
                {iv}
              </Button>
            )
          })}
        </div>
      </div>

      <div className="mt-4 rounded-xl overflow-hidden border border-slate-800 bg-slate-950/60 shadow-inner">
        <TradingViewChart interval={interval} symbol={symbol} />
      </div>
    </Card>
  )
}
