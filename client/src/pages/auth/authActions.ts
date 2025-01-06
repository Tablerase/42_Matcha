import { client } from "@utils/axios";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { queryClient } from "../../app/App";
import { User, UserLogin } from "@app/interfaces";
import { routes } from "@utils/routes";
import { useAuth } from "@/utils/authContext";

export const loginUser = async (data: UserLogin) => {
  const user = await client.post<User>("/auth/login", data, {
    withCredentials: true,
  });
  return user.data as User;
};

export const useLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { mutate: loginMutation } = useMutation({
    mutationKey: ["currentUser"],
    mutationFn: loginUser,
    onSuccess: () => {
      console.log("Login successful");
      login();
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      navigate(routes.BROWSE, { replace: true });
    },
  });
  return loginMutation;
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
  const { mutate: logout } = useMutation({
    mutationKey: ["currentUser"],
    mutationFn: logoutUser,
    onSuccess: () => {
      console.log("Logout successful");
      queryClient.clear();
      navigate("/", { replace: true });
    },
  });
  return logout;
};
