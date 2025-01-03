import { AxiosResponse } from "axios";
import { client } from "@utils/axios";
import { useQuery, QueryObserverResult } from "@tanstack/react-query";
import { User, UserResponse, Tag } from "@app/interfaces";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/app/App";
import { formatCoordinates } from "@/utils/helpers";

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

export const fetchUserTags = async (userId?: number): Promise<AxiosResponse> => {
  return await client.get(`/users/${userId}/tags`, { withCredentials: true });
};

const updateUser = async (data: Partial<User>) => {
  const coordinates = formatCoordinates(data.location);
  const updates = {
    bio: data.bio,
    first_name: data.firstName,
    last_name: data.lastName,
    username: data.username,
    email: data.email,
    gender: data.gender,
    preferences: data.preferences,
    date_of_birth: data.dateOfBirth,
    location: coordinates,
    location_postal: data.location_postal
  };
  const user = await client.put<User>(`/users/${data.id}`, updates, {
    withCredentials: true,
  });
  return user.data as User;
};

const updateUserTags = async ({
  userId,
  tagId,
}: {
  userId: number;
  tagId: number;
}) => {
  const response = await client.post(`/users/${userId}/tags`, { tagId });
  return response.data;
};

const deleteUserTags = async ({
  userId,
  tagId,
}: {
  userId: number;
  tagId: number;
}) => {
  const response = await client.delete(`/users/${userId}/tags`, {
    data: { tagId: tagId },
  });
  return response.data;
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
        location_postal: userData.location_postal,
        fameRate: userData.fame_rate,
        lastSeen: userData.last_seen,
      } as User;
    },
    queryKey: ["currentUser"]
  });
};

export const useAddUserTags = () => {
  const { mutate: update } = useMutation({
    mutationKey: ["userTags"],
    mutationFn: (variables: { userId: number; tagId: number }) =>
      updateUserTags(variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userTags"] });
    },
  });
  return update;
};

export const useDeleteUserTags = () => {
  const { mutate: update } = useMutation({
    mutationKey: ["userTags"],
    mutationFn: (variables: { userId: number; tagId: number }) =>
      deleteUserTags(variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userTags"] });
    },
  });
  return update;
};

export const useUpdateUserProfile = () => {
  const { mutate: update } = useMutation({
    mutationKey: ["user"],
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
  return update;
};

export const useFetchUserTags = (userId?: number) => {
  return useQuery<Tag[], any>({
    queryFn: async () => {
      const { data } = await fetchUserTags(userId);
      return data.data;
    },
    queryKey: ["userTags"],
    enabled: !!userId,
  });
};
