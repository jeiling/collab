import { useEffect, useRef, useCallback } from "react";
import useUserStore from "@/app/store/useUserStore";
import { WebSocketEvent } from "@/app/types/user";

const WS_URL = "wss://fe-ws.commeet.co/ws";

export default function useWebSocket(
  onStatusUpdate?: (payload: { recordId: number; users: string[] }) => void
) {
  const ws = useRef<WebSocket | null>(null);
  const userName = useUserStore((state) => state.userName);
  const setEditingStatus = useUserStore((state) => state.setEditingStatus);

  useEffect(() => {
    ws.current = new WebSocket(WS_URL);

    ws.current.onmessage = (event) => {
      try {
        const data: WebSocketEvent = JSON.parse(event.data);
        if (data.type === "editing_status_update") {
          setEditingStatus(data.payload.recordId, data.payload.users);
          if (onStatusUpdate) {
            onStatusUpdate(data.payload);
          }
        }
      } catch {
        console.error("無法解析 WebSocket 訊息:", event.data);
      }
    };

    return () => {
      ws.current?.close();
    };
  }, [onStatusUpdate, setEditingStatus]);

  const send = useCallback(
    <T extends WebSocketEvent["payload"]>(
      type: WebSocketEvent["type"],
      payload: T
    ) => {
      const message = JSON.stringify({ type, payload });
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.send(message);
      } else {
        console.warn("WebSocket 尚未連線");
      }
    },
    []
  );

  const sendStartEditing = useCallback(
    (recordId: number) => {
      if (!userName) return;
      send("start_editing", { recordId, userName });
    },
    [send, userName]
  );

  const sendStopEditing = useCallback(
    (recordId: number) => {
      if (!userName) return;
      send("stop_editing", { recordId, userName });
    },
    [send, userName]
  );

  return {
    sendStartEditing,
    sendStopEditing,
  };
}
