import React, { useEffect, useRef } from "react";
import {
  createChart,
  CandlestickSeries,
  DeepPartial,
  ChartOptions,
  UTCTimestamp,
} from "lightweight-charts";
import { toast } from "sonner";
import axios from "axios";
import { BACKEND_URL } from "@/app/config";

const CryptoChart = ({
  symbol,
  interval,
}: {
  symbol: string;
  interval: string;
}) => {
  const chartRef = useRef<HTMLDivElement>(null);

  const fetchChartData = async () => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/api/candles?symbol=${symbol}&interval=${interval}`
      );

      return response.data
      .filter((candle: any) =>
        candle.open != null &&
        candle.high != null &&
        candle.low != null &&
        candle.close != null
      )
      .map((candle: any) => ({
        time: Math.floor(new Date(candle.bucket).getTime() / 1000),
        open: Number(candle.open),
        high: Number(candle.high),
        low: Number(candle.low),
        close: Number(candle.close),
      }));
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch chart data");
      return [];
    }
  };

  useEffect(() => {
    if (!chartRef.current) return;

    const chartOptions: DeepPartial<ChartOptions> = {
      layout: {
        textColor: "white",
        background: { bottomColor: "blue", color: "black" },
      },
      grid: {
        vertLines: {
          color: "transparent", 
        },
        horzLines: {
          color: "transparent", 
        },
      },
    };
    const chart = createChart(chartRef.current, chartOptions);

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#26a69a",
      downColor: "#ef5350",
      borderVisible: false,
      wickUpColor: "#26a69a",
      wickDownColor: "#ef5350",
      
      borderColor : "#404040"
    });
 
    const loadData = async () => {
      const data = await fetchChartData();
      if (data.length > 0) {
        candlestickSeries.setData(data);
        chart.timeScale().fitContent();
      }
    };

    loadData();

    let lastClose = 145;

    const intervalId = setInterval(() => {
      const open = lastClose;
      const rand = (Math.random() - 0.5) * 10; // small variation
      const close = open + rand;
      const high = Math.max(open, close) + Math.random() * 5;
      const low = Math.min(open, close) - Math.random() * 5;
  
      lastClose = close;
  
      candlestickSeries.update({
        time: Math.floor(Date.now() / 1000) as UTCTimestamp,
        open,
        high,
        low,
        close,
      });
    }, 1000);
  

    return () => {
      clearInterval(intervalId); 
      chart.remove();
    };
  }, [symbol, interval]);

  return (
    <div>
      <div ref={chartRef} style={{ width: "100%", height: "400px" }} />
    </div>
  );
};

export default CryptoChart;
