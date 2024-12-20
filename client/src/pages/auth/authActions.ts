import { client } from "@utils/axios";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { queryClient } from "../../app/App";
import { User, UserLogin } from "@app/interfaces";

export const loginUser = async (data: UserLogin) => {
  const user = await client.post<User>("/auth/login", data, {
    withCredentials: true,
  });
  return user.data as User;
};

export const useLogin = () => {
  const navigate = useNavigate();
  const { mutate: login } = useMutation({
    mutationKey: ["user"],
    mutationFn: loginUser,
    onSuccess: () => {
      console.log("Login successful");
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      navigate("/browse", { replace: true });
    },
  });
  return login;
};
