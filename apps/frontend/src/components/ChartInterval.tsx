"use client"

import { useState } from "react"
import TradingViewChart from "@/components/CryptoChart"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type Props = {
  symbol: string
}

const INTERVALS = ["1m", "5m", "15m", "1h", "4h", "1d"] as const
type Interval = (typeof INTERVALS)[number]

export default function ChartWithInterval({ symbol }: Props) {
  const [interval, setInterval] = useState<Interval>("1m")

  return (
    <Card className="p-4 md:p-6 bg-slate-900 border-slate-700">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-slate-100 font-semibold text-balance">Chart</h2>
          <p className="text-slate-400 text-sm">Symbol: {symbol}</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-300 text-lg pr-2">Interval</span>
          <div className="flex items-center gap-1">
            {INTERVALS.map((iv) => {
              const isActive = iv === interval
              return (
                <Button
                  key={iv}
                  variant={isActive ? "default" : "secondary"}
                  className={
                    isActive
                      ? "bg-amber-500 hover:bg-amber-600 text-white"
                      : "bg-slate-800 text-slate-200 hover:bg-slate-700"
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
      </div>

      <div className="rounded-md overflow-hidden">
        <TradingViewChart interval={interval} symbol={symbol} />
      </div>
    </Card>
  )
}
