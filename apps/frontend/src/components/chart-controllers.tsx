"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"

interface ChartControlsProps {
  symbol: string
  interval: string
  onSymbolChange: (symbol: string) => void
  onIntervalChange: (interval: string) => void
}

const POPULAR_SYMBOLS = [
  { value: "BTCUSDT", label: "BTC/USDT", name: "Bitcoin" },
  { value: "ETHUSDT", label: "ETH/USDT", name: "Ethereum" },
  { value: "ADAUSDT", label: "ADA/USDT", name: "Cardano" },
  { value: "SOLUSDT", label: "SOL/USDT", name: "Solana" },
  { value: "DOTUSDT", label: "DOT/USDT", name: "Polkadot" },
  { value: "LINKUSDT", label: "LINK/USDT", name: "Chainlink" },
]

const TIME_INTERVALS = [
  { value: "1m", label: "1 Minute" },
  { value: "5m", label: "5 Minutes" },
  { value: "15m", label: "15 Minutes" },
  { value: "1h", label: "1 Hour" },
  { value: "4h", label: "4 Hours" },
  { value: "1d", label: "1 Day" },
  { value: "1w", label: "1 Week" },
]

export default function ChartControls({ symbol, interval, onSymbolChange, onIntervalChange }: ChartControlsProps) {
  const [customSymbol, setCustomSymbol] = useState("")

  const currentSymbolInfo = POPULAR_SYMBOLS.find((s) => s.value === symbol)

  return (
    <Card className="p-4 bg-slate-900 border-slate-700">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Trading Pair</label>
            <Select value={symbol} onValueChange={onSymbolChange}>
              <SelectTrigger className="w-[180px] bg-slate-800 border-slate-600 text-slate-100">
                <SelectValue>
                  {currentSymbolInfo ? (
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{currentSymbolInfo.label}</span>
                      <span className="text-slate-400 text-xs">{currentSymbolInfo.name}</span>
                    </div>
                  ) : (
                    symbol
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                {POPULAR_SYMBOLS.map((s) => (
                  <SelectItem key={s.value} value={s.value} className="text-slate-100 focus:bg-slate-700">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{s.label}</span>
                      <span className="text-slate-400 text-xs">{s.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Time Interval</label>
            <Select value={interval} onValueChange={onIntervalChange}>
              <SelectTrigger className="w-[140px] bg-slate-800 border-slate-600 text-slate-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                {TIME_INTERVALS.map((t) => (
                  <SelectItem key={t.value} value={t.value} className="text-slate-100 focus:bg-slate-700">
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Custom symbol (e.g., BNBUSDT)"
            value={customSymbol}
            onChange={(e) => setCustomSymbol(e.target.value.toUpperCase())}
            className="px-3 py-2 bg-slate-800 border border-slate-600 rounded-md text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
          <Button
            onClick={() => {
              if (customSymbol.trim()) {
                onSymbolChange(customSymbol.trim())
                setCustomSymbol("")
              }
            }}
            disabled={!customSymbol.trim()}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Load
          </Button>
        </div>
      </div>
    </Card>
  )
}
