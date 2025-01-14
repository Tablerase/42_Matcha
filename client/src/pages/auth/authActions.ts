import { client } from "@utils/axios";
import { useMutation } from "@tanstack/react-query";
import { ErrorResponse, useNavigate } from "react-router-dom";
import { queryClient } from "../../app/App";
import { User, UserLogin } from "@app/interfaces";
import { routes } from "@utils/routes";
import { useAuth } from "@utils/authContext";
import { AxiosError } from "axios";
import { enqueueSnackbar } from "notistack";

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
      setAuth();
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      navigate(routes.BROWSE, { replace: true });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      if (error.status === 400) {
        enqueueSnackbar("Invalid credentials", { variant: "error" });
      }
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
