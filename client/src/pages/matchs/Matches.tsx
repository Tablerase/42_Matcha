import { Layout } from "@components/Layout";
import { useMatches } from "./useMatches";
import { UserList } from "@/components/UserList";
import LoadingCup from "@/components/LoadingCup/LoadingCup";

export const Matches = () => {
  const { data: users, isLoading, isSuccess } = useMatches();
  console.log("Matches", users);

  let content: JSX.Element = <></>;
  if (isLoading) {
    content = <LoadingCup />;
  }

  if (isSuccess) {
    content = <UserList users={users} />;
  }
  return <Layout>{content}</Layout>;
};
