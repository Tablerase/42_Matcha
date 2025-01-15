import { createContext, useState, useContext, useEffect } from "react";
import { routes } from "../utils/routes";
import { Navigate, Outlet } from "react-router-dom";
import { client } from "./axios";
import { Tag, User } from "@/app/interfaces";
import LoadingCup from "@/components/LoadingCup/LoadingCup";
import { useFetchAllTags, useFetchCurrentUser } from "@/pages/browse/usersActions";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  userData?: User;
  tags?: Tag[];
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const {data: userData, isLoading: userDataLoading, isError, isSuccess} = useFetchCurrentUser();
  const { data: tags, isLoading: tagLoading } = useFetchAllTags();

  const checkAuthStatus = async () => {
    setIsLoading(true);
    try {
      const response = await client.get("/auth/check", {
        withCredentials: true,
      });

      if (response.status === 200) {
        if (response.data.isAuthenticated === true) {
          console.log("User is authenticated");
          setIsAuthenticated(true);
        } else {
          console.log("User not authenticated: " + response.data.message);
          setIsAuthenticated(false);
        }
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      setIsAuthenticated(false);
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
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  if (isLoading) {
    return <LoadingCup />;
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, isLoading, userData, isError, isSuccess, tags }}
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
