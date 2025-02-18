import {
  useCallback,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "@utils/authContext";
import { enqueueSnackbar } from "notistack";
import {
  NotificationInterface,
  NotificationPayload,
  SOCKET_EVENTS,
} from "@utils/socket";
import { Socket } from "socket.io-client";
import { initializeSocket } from "./socket";
import LoadingCup from "@/components/LoadingCup/LoadingCup";
import { useFetchCurrentUser } from "@/pages/browse/usersActions";

interface payloadInterface {
  notifications: NotificationInterface[];
  notifMarkAsRead: (id: number) => void;
  notifDelete: (id: number) => void;
  notifClear: () => void;
}

// Create a context to store the payload
const PayloadContext = createContext<payloadInterface | undefined>(undefined);

// Create a consumer for the payload context
export const usePayload = () => {
  const context = useContext(PayloadContext);
  if (context === undefined) {
    throw new Error("usePayload must be used within a PayloadProvider");
  }
  return context;
};

// Create a provider for the payload context
export const PayloadProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [notifications, setNotifications] = useState<NotificationInterface[]>(
    []
  );
  const {
    isAuthenticated: isAuth,
    isLoading: authIsLoading,
    socket,
  } = useAuth();

  useEffect(() => {
    console.log("Socket: PayloadProvider", socket);
    if (
      authIsLoading ||
      isAuth === false ||
      socket === null ||
      socket === undefined
    )
      return;
    // Fetch notifications
    console.log("Socket: before fetch notifications");
    socket.emit(
      SOCKET_EVENTS.NOTIFICATIONS_FETCH,
      (data: NotificationInterface[]) => {
        console.log("Socket: Notifications Fetch", data);
        setNotifications(data);
      }
    );
    socket.on(SOCKET_EVENTS.NOTIFICATIONS, (data: NotificationInterface[]) => {
      console.log("Socket: Notifications", data);
      setNotifications(data);
    });

    // Register event listeners
    socket.on(
      SOCKET_EVENTS.NOTIFICATION_NEW,
      (payload: NotificationInterface, callback) => {
        console.log("Socket: Notification", payload);
        callback("Notification received");
        enqueueSnackbar(payload.content.message, {
          variant: payload.ui_variant || "default",
        });
        setNotifications((prev) => [...prev, payload]);
      }
    );

    return () => {
      socket.off(SOCKET_EVENTS.NOTIFICATIONS);
      socket.off(SOCKET_EVENTS.NOTIFICATION_NEW);
    };
  }, [isAuth, authIsLoading, socket]);

  const notifMarkAsRead = (id: number) => {
    if (!socket) return;
    socket.emit(SOCKET_EVENTS.NOTIFICATION_READ, id);
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const notifDelete = (id: number) => {
    if (!socket) return;
    socket.emit(SOCKET_EVENTS.NOTIFICATION_DELETE, id);
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const notifClear = () => {
    if (!socket) return;
    socket.emit(SOCKET_EVENTS.NOTIFICATIONS_CLEAR);
    setNotifications([]);
  };

  return (
    <PayloadContext.Provider
      value={{
        notifications,
        notifMarkAsRead,
        notifDelete,
        notifClear,
      }}
    >
      {children}
    </PayloadContext.Provider>
  );
};
