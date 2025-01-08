import { client } from "@utils/axios";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { queryClient } from "../../app/App";
import { User, UserLogin } from "@app/interfaces";
import { routes } from "@utils/routes";
import { useAuth } from "@utils/authContext";

export const loginUser = async (data: UserLogin) => {
  const user = await client.post<User>("/auth/login", data, {
    withCredentials: true,
  });
  return user.data as User;
};

export const useLogin = () => {
  const navigate = useNavigate();
  const { login: setAuth } = useAuth(); 
  const { mutate: login } = useMutation({
    mutationKey: ["currentUser"],
    mutationFn: loginUser,
    onSuccess: () => {
      console.log("Login successful");
      setAuth();
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      navigate(routes.BROWSE, { replace: true });
    },
  });
  return login;
};

/**
 * Logout
 */

export const logoutUser = async () => {
  try {
    const response = await client.post(
      "/auth/logout",
      {},
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Logout failed:", error);
    throw error;
  }
};

export const useLogout = () => {
  const navigate = useNavigate();
  const { logout: setAuth } = useAuth();

  const { mutate: logout } = useMutation({
    mutationKey: ["currentUser"],
    mutationFn: logoutUser,
    onSuccess: () => {
      console.log("Logout successful");
      setAuth();
      queryClient.clear();
      navigate("/", { replace: true });
    },
  });
  return logout;
};
