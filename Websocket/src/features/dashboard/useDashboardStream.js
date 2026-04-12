import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const initialState = {
  generatedAt: null,
  metrics: {
    activeSessions: 0,
    throughput: 0,
    errorRate: 0,
    satisfaction: 0,
    queueDepth: 0
  },
  timeline: [],
  services: [],
  regions: []
};

export function useDashboardStream() {
  const [data, setData] = useState(initialState);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socket = io({
      path: "/socket.io",
      transports: ["websocket", "polling"]
    });

    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => setIsConnected(false));
    socket.on("dashboard:update", (snapshot) => setData(snapshot));

    return () => {
      socket.disconnect();
    };
  }, []);

  return { data, isConnected };
}
