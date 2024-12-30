import { Layout } from "@components/Layout";
import { useFetchCurrentUser } from "../browse/usersActions";
import { ViewProfile } from "./ViewProfile";
import { LinearProgress } from "@mui/material";
import { useFetchUserTags } from "../browse/usersActions";

export const Profile = () => {
  const { data: user, isLoading, error, isSuccess } = useFetchCurrentUser();
  const { data: tags } = useFetchUserTags(user?.id);

  let content;
  if (isLoading) {
    content = <LinearProgress />;
  }
  if (isSuccess && user) {
    content = <ViewProfile tags={tags} user={user}/>;
  }
  if (error) {
    content = <>{error.toString()}</>;
  }
  return (
    <>
      <Layout>{content}</Layout>
    </>
  );
};
