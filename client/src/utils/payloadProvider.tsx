import { createContext, useContext, useState } from "react";
import { NotificationInterface } from "./socket";

interface payloadInterface {
  notifications: NotificationInterface[];
  setNotifications: (notifications: NotificationInterface[]) => void;
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

  return (
    <PayloadContext.Provider value={{ notifications, setNotifications }}>
      {children}
    </PayloadContext.Provider>
  );
};
