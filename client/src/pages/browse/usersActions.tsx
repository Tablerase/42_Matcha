import { AxiosResponse } from "axios";
import { client } from "@utils/axios";
import { useQuery, QueryObserverResult } from "@tanstack/react-query";
import { User, UserResponse } from "@app/interfaces";

const fetchUsers = async (): Promise<AxiosResponse<User[], any>> => {
  return await client.get<User[]>("/users");
};

const fetchUserById = async (id: number): Promise<AxiosResponse<User, any>> => {
  return await client.get<User>(`/users/${id}`, { withCredentials: true });
};

const fetchCurrentUser = async (): Promise<AxiosResponse<UserResponse, any>> => {
  return await client.get<UserResponse>(`/users/me`, { withCredentials: true });
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

// TODO: not for current user, probably needs to be changed
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

export const useFetchCurrentUser = (): QueryObserverResult<User, any> => {
  return useQuery<User, any>({
    queryFn: async () => {
      const response = await fetchCurrentUser();
      const userData: any = response.data.data;
      console.log(userData);
      return {
        id: userData.id,
        firstName: userData.first_name,
        lastName: userData.last_name,
        email: userData.email,
        username: userData.username,
        gender: userData.gender,
        preferences: userData.preferences,
        dateOfBirth: userData.date_of_birth,
        bio: userData.bio,
        location: userData.location,
        fameRate: userData.fame_rate,
        lastSeen: userData.last_seen
      } as User;
    },
    queryKey: ["currentUser"],
  });
};