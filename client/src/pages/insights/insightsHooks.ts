import { UserView, UserLike } from "@/app/interfaces";
import { client } from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";

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

const fetchUserLikes = async (id: number) => {
  return await client.get<UserLike[]>(`/users/${id}/likes`, {
    withCredentials: true,
  });
};

export const useLikes = (id: number) => {
  return useQuery<UserLike[], any>({
    queryFn: async () => {
      const response = await fetchUserLikes(id);
      const data = response.data;
      // return data.map((like: any) => ({
      // id: like.id,
      // likerUserId: like.likerUserId,
      // likedUserId: like.likedUserId,
      // createdAt: like.createdAt,
      // })) as UserLike[];
      return data;
    },
    queryKey: ["likes", id],
  });
};
