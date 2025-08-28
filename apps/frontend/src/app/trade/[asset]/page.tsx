"use client"

import { useState } from "react"
import PriceTicker from "@/components/price-ticker"
import { Card } from "@/components/ui/card"
import ChartControls from "@/components/chart-controllers"
import TradingViewChart from "@/components/CryptoChart"

export default function Home() {
  const [symbol, setSymbol] = useState("BTC")
  const [interval, setInterval] = useState("1m")

  return (
    <div className="min-h-screen bg-slate-950 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-slate-100 mb-2">Crypto Trading Dashboard</h1>
          <p className="text-slate-400 text-lg">Real-time cryptocurrency charts and market data</p>
        </div>

        <PriceTicker symbol={symbol} />

        <ChartControls symbol={symbol} interval={interval} onSymbolChange={setSymbol} onIntervalChange={setInterval} />

        <Card className="p-6 bg-slate-900 border-slate-700">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-slate-100">{symbol} Price Chart</h2>
            <p className="text-slate-400 text-sm">Candlestick chart showing {interval} intervals</p>
          </div>
          <TradingViewChart interval="1m" symbol="SOLUSDT" />
        </Card>

        <div className="text-center py-4 text-slate-500 text-sm">
          <p>Data provided by your backend API • Updates in real-time</p>
        </div>
      </div>
    </div>
  )
}
