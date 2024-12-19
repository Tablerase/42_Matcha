import { Layout } from "@components/Layout"
import { useFetchUserById } from "../browse/usersActions";

export const Profile = () => {
  // TODO: Get current user 

  const {data: user, isLoading, isError, isSuccess} = useFetchUserById(1);
  console.log(user);
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading profile</div>;

  return (
    <Layout>
      <h1>Profile</h1>
      {/* {user && (
        <div>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
        </div>
      )} */}
    </Layout>
  );
};