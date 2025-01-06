import { createContext, useState, useContext, useEffect } from "react";
import { routes } from "../utils/routes";
import { Navigate, Outlet } from "react-router-dom";
import { client } from "./axios";

interface AuthContextType {
  isAuthenticated: boolean;
  // login: () => void;
  // logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuthStatus = async () => {
    setIsLoading(true);
    try {
      const response = await client.get("/auth/check", {
        withCredentials: true,
      });

      if (response.status === 200) {
        console.log("User is authenticated");
        setIsAuthenticated(true);
      } else {
        console.log("User is not authenticated");
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  if (isLoading) {
    // TODO: Add a loading spinner or component
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading }}>
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
