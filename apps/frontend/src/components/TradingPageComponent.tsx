"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"

const generateCandlestickData = () => {
  const data = []
  let price = 203.48
  for (let i = 0; i < 50; i++) {
    const open = price
    const change1 = (Math.random() - 0.5) * 2
    const change2 = (Math.random() - 0.5) * 2
    const change3 = (Math.random() - 0.5) * 2

    const high = Math.max(open, open + change1, open + change2, open + change3) + Math.random() * 0.5
    const low = Math.min(open, open + change1, open + change2, open + change3) - Math.random() * 0.5
    const close = open + change3

    price = close

    data.push({
      time: Math.floor((Date.now() - (49 - i) * 60000) / 1000),
      open: Number.parseFloat(open.toFixed(2)),
      high: Number.parseFloat(high.toFixed(2)),
      low: Number.parseFloat(low.toFixed(2)),
      close: Number.parseFloat(close.toFixed(2)),
      volume: Math.floor(Math.random() * 1000) + 500,
    })
  }
  return data
}

const CandlestickChart = ({ data, width, height }: { data: any[]; width: number; height: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !data.length) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = width
    canvas.height = height

    // Clear canvas
    ctx.fillStyle = "#111827"
    ctx.fillRect(0, 0, width, height)

    // Calculate price range
    const prices = data.flatMap((d) => [d.high, d.low])
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)
    const priceRange = maxPrice - minPrice
    const padding = priceRange * 0.1

    // Chart dimensions
    const chartWidth = width - 80
    const chartHeight = height - 60
    const candleWidth = Math.max(2, chartWidth / data.length - 2)

    // Draw grid
    ctx.strokeStyle = "#374151"
    ctx.lineWidth = 1
    for (let i = 0; i <= 5; i++) {
      const y = 30 + (chartHeight / 5) * i
      ctx.beginPath()
      ctx.moveTo(40, y)
      ctx.lineTo(40 + chartWidth, y)
      ctx.stroke()
    }

    // Draw candlesticks
    data.forEach((candle, index) => {
      const x = 40 + index * (chartWidth / data.length) + chartWidth / data.length / 2
      const openY = 30 + chartHeight - ((candle.open - minPrice + padding) / (priceRange + 2 * padding)) * chartHeight
      const closeY = 30 + chartHeight - ((candle.close - minPrice + padding) / (priceRange + 2 * padding)) * chartHeight
      const highY = 30 + chartHeight - ((candle.high - minPrice + padding) / (priceRange + 2 * padding)) * chartHeight
      const lowY = 30 + chartHeight - ((candle.low - minPrice + padding) / (priceRange + 2 * padding)) * chartHeight

      const isGreen = candle.close > candle.open
      const color = isGreen ? "#10B981" : "#EF4444"

      // Draw wick
      ctx.strokeStyle = color
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(x, highY)
      ctx.lineTo(x, lowY)
      ctx.stroke()

      // Draw body
      ctx.fillStyle = color
      const bodyHeight = Math.abs(closeY - openY)
      const bodyY = Math.min(openY, closeY)
      ctx.fillRect(x - candleWidth / 2, bodyY, candleWidth, Math.max(bodyHeight, 1))
    })

    // Draw price labels
    ctx.fillStyle = "#6B7280"
    ctx.font = "12px monospace"
    for (let i = 0; i <= 5; i++) {
      const price = minPrice - padding + ((priceRange + 2 * padding) / 5) * (5 - i)
      const y = 30 + (chartHeight / 5) * i
      ctx.fillText(price.toFixed(2), width - 70, y + 4)
    }
  }, [data, width, height])

  return <canvas ref={canvasRef} className="w-full h-full" />
}

export default function TradingChartComponent({ asset = "SOL/USD" }: { asset?: string }) {
  const [chartData, setChartData] = useState(generateCandlestickData())
  const [selectedInterval, setSelectedInterval] = useState("1h")
  const [chartDimensions, setChartDimensions] = useState({ width: 800, height: 600 })
  const containerRef = useRef<HTMLDivElement>(null)

  const latestCandle = chartData[chartData.length - 1]
  const currentPrice = latestCandle?.close || 204.11
  const openPrice = latestCandle?.open || 203.48
  const highPrice = latestCandle?.high || 204.39
  const lowPrice = latestCandle?.low || 203.07

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setChartDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        })
      }
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)
    return () => window.removeEventListener("resize", updateDimensions)
  }, [])

  // Update chart data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setChartData((prevData) => {
        const newData = [...prevData]
        const lastCandle = newData[newData.length - 1]
        const newOpen = lastCandle.close
        const change1 = (Math.random() - 0.5) * 2
        const change2 = (Math.random() - 0.5) * 2
        const change3 = (Math.random() - 0.5) * 2

        const newHigh = Math.max(newOpen, newOpen + change1, newOpen + change2, newOpen + change3) + Math.random() * 0.5
        const newLow = Math.min(newOpen, newOpen + change1, newOpen + change2, newOpen + change3) - Math.random() * 0.5
        const newClose = newOpen + change3

        newData.push({
          time: Math.floor(new Date().getTime() / 1000),
          open: Number.parseFloat(newOpen.toFixed(2)),
          high: Number.parseFloat(newHigh.toFixed(2)),
          low: Number.parseFloat(newLow.toFixed(2)),
          close: Number.parseFloat(newClose.toFixed(2)),
          volume: Math.floor(Math.random() * 1000) + 500,
        })

        return newData.slice(-50)
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleIntervalChange = (interval: string) => {
    setSelectedInterval(interval)
    setChartData(generateCandlestickData())
  }

  const priceChange = currentPrice - openPrice
  const priceChangePercent = ((priceChange / openPrice) * 100).toFixed(2)

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="border-b border-gray-700 bg-gray-900 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 text-lg">
                {asset} • {selectedInterval}
              </span>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <span className="text-gray-400">O</span>
              <span className="text-green-400 font-mono">{openPrice}</span>
              <span className="text-gray-400">H</span>
              <span className="text-green-400 font-mono">{highPrice}</span>
              <span className="text-gray-400">L</span>
              <span className="text-green-400 font-mono">{lowPrice}</span>
              <span className="text-gray-400">C</span>
              <span className="text-green-400 font-mono">{currentPrice}</span>
              <span className={`font-mono ${priceChange >= 0 ? "text-green-400" : "text-red-400"}`}>
                {priceChange >= 0 ? "+" : ""}
                {priceChange.toFixed(2)} ({priceChangePercent}%)
              </span>
            </div>
          </div>
          <div className="flex space-x-2">
            {["1m", "5m", "15m", "1h", "4h", "1d"].map((interval) => (
              <Button
                key={interval}
                size="sm"
                onClick={() => handleIntervalChange(interval)}
                className={
                  selectedInterval === interval
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-gray-700 border border-gray-600 text-gray-300 hover:bg-gray-600"
                }
              >
                {interval.toUpperCase()}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 bg-gray-900 h-[calc(100vh-120px)]" ref={containerRef}>
        <CandlestickChart data={chartData} width={chartDimensions.width} height={chartDimensions.height} />
      </div>
    </div>
  )
}
