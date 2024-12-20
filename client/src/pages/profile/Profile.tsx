import { Layout } from "@components/Layout";
import { useFetchCurrentUser } from "../browse/usersActions";
import { ViewProfile } from "./ViewProfile";
import { LinearProgress } from "@mui/material";

export const Profile = () => {
  const { data: user, isLoading, error, isSuccess } = useFetchCurrentUser();
  let content;
  if (isLoading) {
    content = <LinearProgress />;
  }
  if (isSuccess && user) {
    content = <ViewProfile {...user} />;
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
