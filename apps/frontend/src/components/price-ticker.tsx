"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"

interface PriceData {
  symbol: string
  price: string
  priceChange: string
  priceChangePercent: string
  highPrice: string
  lowPrice: string
  volume: string
}

interface PriceTickerProps {
  symbol: string
}

export default function PriceTicker({ symbol }: PriceTickerProps) {
  const [priceData, setPriceData] = useState<PriceData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const mockData: PriceData = {
      symbol: symbol,
      price: "43,250.50",
      priceChange: "1,250.30",
      priceChangePercent: "2.98",
      highPrice: "44,100.00",
      lowPrice: "41,800.00",
      volume: "28,450.32",
    }

    setTimeout(() => {
      setPriceData(mockData)
      setIsLoading(false)
    }, 1000)
  }, [symbol])

  if (isLoading) {
    return (
      <Card className="p-4 bg-slate-900 border-slate-700">
        <div className="animate-pulse">
          <div className="h-4 bg-slate-700 rounded w-1/4 mb-2"></div>
          <div className="h-8 bg-slate-700 rounded w-1/2 mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 bg-slate-700 rounded w-full"></div>
                <div className="h-4 bg-slate-700 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    )
  }

  if (!priceData) return null

  const isPositive = Number.parseFloat(priceData.priceChange) > 0

  return (
    <Card className="p-4 bg-slate-900 border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-100">{symbol}</h3>
        <div
          className={`flex items-center space-x-1 px-2 py-1 rounded-full text-sm font-medium ${
            isPositive ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
          }`}
        >
          {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          <span>{priceData.priceChangePercent}%</span>
        </div>
      </div>

      <div className="mb-4">
        <div className="text-3xl font-bold text-slate-100">${priceData.price}</div>
        <div className={`text-sm font-medium ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
          {isPositive ? "+" : ""}${priceData.priceChange} (24h)
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <div className="text-slate-400">24h High</div>
          <div className="text-slate-100 font-medium">${priceData.highPrice}</div>
        </div>
        <div>
          <div className="text-slate-400">24h Low</div>
          <div className="text-slate-100 font-medium">${priceData.lowPrice}</div>
        </div>
        <div>
          <div className="text-slate-400">24h Volume</div>
          <div className="text-slate-100 font-medium">{priceData.volume}</div>
        </div>
        <div>
          <div className="text-slate-400">Market</div>
          <div className="text-slate-100 font-medium">Binance</div>
        </div>
      </div>
    </Card>
  )
}
