import {
  createContext,
  useState,
  useContext,
  useEffect,
  Suspense,
} from "react";
import { routes } from "../utils/routes";
import { Navigate, Outlet } from "react-router-dom";
import { client } from "./axios";
import { User } from "@/app/interfaces";
import { Box, Skeleton } from "@mui/material";
import LoadingCup from "@/components/LoadingCup/LoadingCup";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  userData: User | null;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<User | null>(null);

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
          const user = response.data.user;
          const parsedUser: User = {
            id: user.id,
            username: user.username,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            gender: user.gender,
            preferences: user.preferences,
            dateOfBirth: user.date_of_birth,
            bio: user.bio,
            location: user.location,
            city: user.city,
            fameRate: user.fame_rate,
            tags: user.tags,
            lastSeen: user.last_seen,
          };
          setUserData(parsedUser);
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
    // setIsAuthenticated(true);
    checkAuthStatus();
  };

  const logout = async () => {
    setIsAuthenticated(false);
    setUserData(null);
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  if (isLoading) {
    return <LoadingCup />;
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, isLoading, userData }}
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
