import { useFetchUsers } from "./usersActions";

export const Browse = () => {
  const { data: users, isLoading, isSuccess, isError } = useFetchUsers();

  return (
    <>
      {isLoading ? <div>Loading...</div> : null}
      {isSuccess && users
        ? users.map((user) => <div key={user.id}>Users</div>)
        : null}
      {isSuccess && !users ? <div>No users found</div> : null}
      {isError ? <div>Something went wrong</div> : null}
    </>
  );
};
