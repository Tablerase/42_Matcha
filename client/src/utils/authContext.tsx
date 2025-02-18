import {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { routes } from "../utils/routes";
import { Navigate, Outlet } from "react-router-dom";
import { client } from "./axios";
// import { Tag, User } from "@/app/interfaces";
import LoadingCup from "@/components/LoadingCup/LoadingCup";
// import {
//   useFetchAllTags,
//   useFetchCurrentUser,
// } from "@/pages/browse/usersActions";
import { Socket } from "socket.io-client";
import { initializeSocket, SOCKET_EVENTS } from "./socket";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  // isError: boolean;
  // isSuccess: boolean;
  // userData?: User;
  socket: Socket | null;
  // tags?: Tag[];
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [socket, setSocket] = useState<Socket | null>(null);
  // const {
  //   data: userData,
  //   isLoading: userDataLoading,
  //   isError,
  //   isSuccess,
  // } = useFetchCurrentUser();
  // const { data: tags, isLoading: tagLoading } = useFetchAllTags();

  const establishSocketConnection = useCallback(
    (userId: number) => {
      if (!socket && isAuthenticated) {
        try {
          const newSocket = initializeSocket(userId);

          newSocket.on(SOCKET_EVENTS.CONNECT, () => {
            console.log("Socket connected successfully");
            setSocket(newSocket);
          });

          newSocket.on(SOCKET_EVENTS.CONNECT_ERROR, (error) => {
            console.error("Socket connection error:", error);
            setSocket(null);
          });

          newSocket.on(SOCKET_EVENTS.DISCONNECT, () => {
            console.log("Socket disconnected");
            setSocket(null);
          });

          // Attempt to connect
          newSocket.connect();
        } catch (error) {
          console.error("Error initializing socket:", error);
          setSocket(null);
        }
      }
    },
    [socket, isAuthenticated]
  );

  const checkAuthStatus = async () => {
    setIsLoading(true);
    try {
      const response = await client.get("/auth/check", {
        withCredentials: true,
      });

      if (response.status === 200) {
        if (response.data.isAuthenticated === true) {
          console.log("User is authenticated", response.data);
          setIsAuthenticated(true);
          if (response.data.userId) {
            // Only establish connection if we don't already have one
            if (!socket) {
              establishSocketConnection(response.data.userId);
            }
          }
        } else {
          console.log("User not authenticated: " + response.data.message);
          setIsAuthenticated(false);
          if (socket) {
            socket.disconnect();
            setSocket(null);
          }
        }
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async () => {
    setIsAuthenticated(true);
    checkAuthStatus();
  };

  const logout = async () => {
    setIsAuthenticated(false);
    if (socket && socket.connected) {
      socket.disconnect();
    }
    setSocket(null);
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    // Connect socket when authenticated
    if (isAuthenticated) {
      checkAuthStatus();
    }

    // Cleanup function
    return () => {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    };
  }, [isAuthenticated]); // Only re-run when authentication status changes

  if (isLoading) {
    return <LoadingCup />;
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        isLoading,
        // userData,
        socket,
        // isError,
        // isSuccess,
        // tags,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

/**
 * Protected Route component
 */

export const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={routes.LOGIN} replace />;
  }

  return <Outlet />;
};
