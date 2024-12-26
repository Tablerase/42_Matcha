import { AxiosResponse } from "axios";
import { client } from "@utils/axios";
import { useQuery, QueryObserverResult } from "@tanstack/react-query";
import { User, UserResponse, Tag } from "@app/interfaces";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/app/App";

const fetchUsers = async (): Promise<AxiosResponse<User[], any>> => {
  return await client.get<User[]>("/users");
};

const fetchUserById = async (id: number): Promise<AxiosResponse<User, any>> => {
  return await client.get<User>(`/users/${id}`, { withCredentials: true });
};

const fetchCurrentUser = async (): Promise<
  AxiosResponse<UserResponse, any>
> => {
  return await client.get<UserResponse>(`/users/me`, { withCredentials: true });
};

const fetchAllTags = async (): Promise<AxiosResponse> => {
  return await client.get(`/tags`, { withCredentials: true });
};

const updateUser = async (data: Partial<User>) => {
  const updates = {
    bio: data.bio,
    date_of_birth: data.dateOfBirth,
    email: data.email,
    first_name: data.firstName,
    gender: data.gender,
    last_name: data.lastName,
    // location: data.location,
  };
  console.log(`DOB: ${updates.date_of_birth}`)
  console.log(updates)
  const user = await client.put<User>(`/users/${data.id}`, updates, {
    withCredentials: true,
  });
  return user.data as User;
};

export const useFetchAllTags = (): QueryObserverResult<Tag[], any> => {
  return useQuery<Tag[], any>({
    queryFn: async () => {
      const { data } = await fetchAllTags();
      return data;
    },
    queryKey: ["tags"],
  });
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

// TODO: not for current user
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
        lastSeen: userData.last_seen,
      } as User;
    },
    queryKey: ["currentUser"],
  });
};

export const useUpdateUserProfile = () => {
  const { mutate: update } = useMutation({
    mutationKey: ["user"],
    mutationFn: updateUser,
    onSuccess: () => {
      console.log("Update successful");
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
  return update;
};
