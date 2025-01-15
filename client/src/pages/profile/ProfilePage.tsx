import { Layout } from "@/components/Layout";
import { Profile } from "./Profile";
import { useAuth } from "@/utils/authContext";

export const ProfilePage = () => {
  const { userData, isLoading, isError, isSuccess } = useAuth();
  return (
    <Layout>
      <Profile
        me={true}
        user={userData}
        userIsLoading={isLoading}
        userIsError={isError}
        userIsSuccess={isSuccess}
      />
    </Layout>
  );
};
