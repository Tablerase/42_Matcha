import { client } from "@utils/axios";
import { useQuery } from "@tanstack/react-query";
import { User } from "@/app/interfaces";

interface MatchUser extends User {
  matchId: number;
  matchDate: Date;
}

const fetchMatches = async (): Promise<MatchUser[]> => {
  const response = await client.get(`/users/0/matches`, {
    withCredentials: true,
  });
  const users = response.data.data;
  const matches = users.map((user: any) => ({
    id: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    username: user.username,
    email: user.email,
    gender: user.gender,
    preferences: user.preferences,
    dateOfBirth: user.date_of_birth,
    bio: user.bio,
    city: user.city,
    fameRate: user.fame_rate,
    lastSeen: user.last_seen,
    matchId: user.match_id,
    matchDate: user.match_date,
  })) as MatchUser[];

  return matches;
};

export const useMatches = () => {
  return useQuery<User[]>({
    queryKey: ["matches"],
    queryFn: fetchMatches,
  });
};
