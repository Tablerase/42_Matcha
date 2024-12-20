import { Layout } from "@components/Layout";
import { useFetchCurrentUser } from "../browse/usersActions";
import { ViewProfile } from "./ViewProfile";
import { EditProfile } from "./EditProfile";
import { LinearProgress } from "@mui/material";

export const Profile = () => {
  const { data: user, isLoading, error, isSuccess } = useFetchCurrentUser();
  let content = <h1>Hello</h1>;
  if (isLoading) {
    content = <LinearProgress />;
  }
  if (isSuccess && user) {
    content = <EditProfile {...user} />;
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
