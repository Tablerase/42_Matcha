import { AxiosResponse } from "axios";
import { client } from "@utils/axios";
import {
  useQuery,
  useQueryClient,
  QueryObserverResult,
  useMutation,
  MutationObserverResult,
  UseBaseMutationResult,
} from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

interface UserLogin {
  username: string;
  password: string;
}

const loginUser = async (
  username: string,
  password: string
): Promise<AxiosResponse<UserLogin, any>> => {
  return await client.post<UserLogin>("/auth/login", { username, password });
};

export const useLoginUser = (
  username: string,
  password: string
): UseBaseMutationResult<
  AxiosResponse<UserLogin, any>,
  unknown,
  UserLogin,
  unknown
> => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (user) => loginUser(username, password),
    onSuccess: () => {
      // queryClient.invalidateQueries(["currentUser"]);
      navigate("/", { replace: true });
    },
  });
};
