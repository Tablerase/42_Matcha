import { AxiosResponse } from "axios";
import { client } from "@utils/axios";
import { useQuery, QueryObserverResult } from "@tanstack/react-query";

interface User {
  id: number;
  email: string;
  username: string;
}

const fetchUsers = async (): Promise<AxiosResponse<User[], any>> => {
  return await client.get<User[]>("/users");
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
