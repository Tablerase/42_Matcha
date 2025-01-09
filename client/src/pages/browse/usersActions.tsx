import { AxiosError, AxiosResponse } from "axios";
import { client } from "@utils/axios";
import { useQuery, QueryObserverResult } from "@tanstack/react-query";
import { User, UserResponse, Tag, UserSearchQuery, PublicUser } from "@app/interfaces";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/app/App";
import { formatCoordinates } from "@/utils/helpers";
import { Image, FormData } from "@/app/interfaces";
import { capitalize } from "@/utils/helpers";
import { enqueueSnackbar } from 'notistack';
import { formatPreferences } from "@/utils/helpers";

interface ValidationError {
  code: string;
  message: string;
  path: string[];
  validation: string;
}

interface ErrorResponse {
  error?: ValidationError[];
  message?: string;
  status: number;
}

const fetchUsers = async (params?: UserSearchQuery) => {
  return await client.get("/users/search", {params: {...params}, withCredentials: true});
};

export const useFetchUsers = (params?: UserSearchQuery) => {
  return useQuery<PublicUser[], any>({
    queryFn: async () => {
      const response = await fetchUsers(params);
      const data = response.data.data;
      return data.map((user: any) => ({
        id: user.id,
        username: user.username,
        age: user.age
      })) as PublicUser[]
    },
    queryKey: ["users", "searchParams"],
  });
};

const fetchUserById = async (id: number): Promise<AxiosResponse<User, any>> => {
  return await client.get<User>(`/users/${id}`, { withCredentials: true });
};

const fetchCurrentUser = async (): Promise<
  AxiosResponse<UserResponse, any>
> => {
  return await client.get<UserResponse>(`/users/me`, { withCredentials: true });
};

const updateUser = async (data: FormData) => {
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
    city: data.city,
  };
  const user = await client.put<User>(`/users/${data.id}`, updates, {
    withCredentials: true,
  });
  return user.data as User;
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
    queryKey: ["currentUser", id],
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
        preferences: formatPreferences(userData.preferences),
        dateOfBirth: userData.date_of_birth,
        bio: userData.bio,
        location: userData.location,
        city: userData.city,
        fameRate: userData.fame_rate,
        lastSeen: userData.last_seen,
      } as User;
    },
    queryKey: ["currentUser"],
  });
};

export const useUpdateUserProfile = () => {
  const { mutate: updateUserData, error: updateUserError } = useMutation({
    mutationKey: ["currentUser"],
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      if (error.response?.data?.status === 500) {
        if (error.response.data?.message?.includes("duplicate key")) {
          const duplicateField = error.response.data.message.match(/"([^"]+)"/);
          if (duplicateField) {
            const fieldName = capitalize(
              duplicateField[0]
                .replace("users_", "")
                .replace("_key", "")
                .replace(/"/g, '')
            );
            enqueueSnackbar(`${fieldName} is already in use, try again`);
            return;
          }
        }
        enqueueSnackbar(`Internal server error, changes not saved`);
        return;
      }
    }
  });
  
  return { updateUserData, updateUserError };
};

/*TAGS*/

const fetchAllTags = async (): Promise<AxiosResponse> => {
  return await client.get(`/tags`, { withCredentials: true });
};

export const fetchUserTags = async (
  userId?: number
): Promise<AxiosResponse> => {
  return await client.get(`/users/${userId}/tags`, { withCredentials: true });
};

const updateUserTags = async ({
  userId,
  tagId,
}: {
  userId?: number;
  tagId: number;
}) => {
  const response = await client.post(`/users/${userId}/tags`, { tagId });
  return response.data;
};

const deleteUserTags = async ({
  userId,
  tagId,
}: {
  userId?: number;
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

export const useAddUserTags = () => {
  const { mutate: update } = useMutation({
    mutationKey: ["userTags"],
    mutationFn: (variables: { userId?: number; tagId: number }) =>
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
    mutationFn: (variables: { userId?: number; tagId: number }) =>
      deleteUserTags(variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userTags"] });
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

/*IMAGES*/

const fetchImages = async (userId?: number) => {
  if (!userId) return [];
  const response = await client.get(`/users/${userId}/images`, {
    params: { userId },
    withCredentials: true,
  });
  return response.data;
};

const uploadImage = async (data: Image) => {
  const response = await client.post(
    `/users/${data.userId}/images`,
    { userId: data.userId, url: data.url },
    {
      withCredentials: true,
    }
  );
  return response.data;
};

const deleteImage = async (data: Partial<Image>) => {
  const response = await client.delete(`/users/${data.userId}/images`, {
    params: { user_id: data.userId, imageId: data.id },
    withCredentials: true,
  });
  return response.data;
};

const updateImageStatus = async (data: Partial<Image>) => {
  const response = await client.put(
    `/users/${data.userId}/images`,
    { isProfile: data.isProfilePic, imageId: data.id },
    {
      withCredentials: true,
    }
  );
  return response.data;
};

export const useFetchUserImages = (userId?: number) => {
  return useQuery<Image[], any>({
    queryFn: async () => {
      const { data } = await fetchImages(userId);
      return data.map((image: any) => ({
        id: image.id,
        userId: image.user_id,
        url: image.image_url,
        isProfilePic: image.is_profile,
      }));
    },
    queryKey: ["currentUserImages", userId],
    enabled: !!userId,
    initialData: [],
  });
};

export const useUploadImage = () => {
  const { mutate: upload } = useMutation({
    mutationKey: ["currentUserImages"],
    mutationFn: uploadImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserImages"] });
    },
  });
  return upload;
};

export const useDeleteImage = () => {
  const { mutate: deleteImageMutation } = useMutation({
    mutationKey: ["currentUserImages"],
    mutationFn: deleteImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserImages"] });
    },
  });
  return deleteImageMutation;
};

export const useUpdateImageStatus = () => {
  const { mutate: updateImage } = useMutation({
    mutationKey: ["currentUserImages"],
    mutationFn: updateImageStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserImages"] });
    },
  });
  return updateImage;
};
