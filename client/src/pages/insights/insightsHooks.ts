import { User, UserView, UserLike } from "@/app/interfaces";
import { client } from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";

const fetchUserById = async (id: number) => {
  return await client.get(`/users/${id}`, { withCredentials: true });
};

export const useFetchUserById = (id: number) => {
  return useQuery<User, any>({
    queryFn: async ({ queryKey }) => {
      const userId = queryKey[1] as number;
      const response = await fetchUserById(userId);
      // Access the nested user data
      const user = response.data.data;
      return {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        username: user.username,
        city: user.city,
        bio: user.bio,
        gender: user.gender,
        preferences: user.preferences,
        dateOfBirth: user.date_of_birth,
        fameRate: user.fame_rate,
        lastSeen: user.last_seen,
        tags: user.tags,
      } as User;
    },
    queryKey: ["user", id],
  });
};

const fetchUserViews = async (id: number) => {
  return await client.get<UserView[]>(`/users/${id}/views`, {
    withCredentials: true,
  });
};

export const useViews = (id: number) => {
  return useQuery<UserView[], any>({
    queryFn: async () => {
      const response = await fetchUserViews(id);
      return response.data;
    },
    queryKey: ["views", id],
  });
};

interface ApiLikeResponse {
  id: number;
  liker_user_id: number;
  liked_user_id: number;
  created_at: string;
}

const fetchUserLikes = async (id: number) => {
  return await client.get(`/users/${id}/likes`, {
    withCredentials: true,
  });
};

export const useLikes = (id: number) => {
  return useQuery<UserLike[], any>({
    queryFn: async () => {
      const response = await fetchUserLikes(id);
      const data = response.data.data.map((like: ApiLikeResponse) => ({
        id: like.id,
        likerId: like.liker_user_id,
        likedId: like.liked_user_id,
        likedAt: new Date(like.created_at),
      })) as UserLike[];
      return data;
    },
    queryKey: ["likes", id],
  });
};
