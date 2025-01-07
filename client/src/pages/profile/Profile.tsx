import { Layout } from "@components/Layout";
import { useFetchCurrentUser } from "../browse/usersActions";
import { ViewProfile } from "./ViewProfile";
import { LinearProgress } from "@mui/material";
import { useFetchUserTags } from "../browse/usersActions";
import { useFetchUserImages } from "../browse/usersActions";

export const Profile = () => {
  const { data: user, isLoading: userIsLoading, isError: userIsError, isSuccess: userIsSuccess, error } = useFetchCurrentUser();
  const { data: tags } = useFetchUserTags(user?.id);
  const {
    data: images,
    isLoading: imagesIsLoading,
    isError: imagesIsError,
    isSuccess: imagesIsSuccess,
  } = useFetchUserImages(user?.id);
  let content;
  if (userIsLoading || imagesIsLoading) {
    content = <LinearProgress />;
  }
  if (userIsSuccess && user && images && imagesIsSuccess) {
    content = <ViewProfile tags={tags} user={user} images={images} />;
  }
  if (userIsError || imagesIsError) {
    content = <>{error.toString()}</>;
  }
  return (
    <>
      <Layout>{content}</Layout>
    </>
  );
};
