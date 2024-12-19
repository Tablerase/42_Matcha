import { AxiosResponse } from "axios";
import { client } from "@utils/axios";
import { useQuery, QueryObserverResult } from "@tanstack/react-query";
import { User } from "@/app/interfaces";

const fetchUsers = async (): Promise<AxiosResponse<User[], any>> => {
  return await client.get<User[]>("/users");
};

const fetchUserById = async (id: number): Promise<AxiosResponse<User, any>> => {
  return await client.get<User>(`/users/${id}`, { withCredentials: true });
};

export const useFetchUsers = (): QueryObserverResult<User[], any> => {
  return useQuery<User[], any>({
    queryFn: async () => {
      const { data } = await fetchUsers();
      return data;
    },
    queryKey: ["users"],
  });
};

// not for current user
export const useFetchUserById = (
  id: number
): QueryObserverResult<User, any> => {
  return useQuery<User, any>({
    queryFn: async ({ queryKey }) => {
      const userId = queryKey[1] as number;
      const response = await fetchUserById(userId);
      // Access the nested user data
      const userData = response.data;
      return userData as User;
    },
    queryKey: ["user", id],
  });
};
