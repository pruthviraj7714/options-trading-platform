import { WS_URL } from "@/app/config";
import { useEffect, useRef, useState } from "react";

const useSocket = (asset: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<WebSocket | null>();

  useEffect(() => {
    const ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      setIsConnected(true);
      setSocket(ws);
    };

    ws.onerror = (error) => {
      console.error(error);
    };

    return () => {
      setSocket(null);
      setIsConnected(false);
    };
  }, [asset]);

  return {
    socket,
    isConnected
  };
};

export default useSocket;
