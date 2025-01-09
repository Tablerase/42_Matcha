import { Layout } from "@components/Layout";
import { useFetchUsers, useFetchCurrentUser } from "./usersActions";
import { UserList } from "@components/UserList";
import { UserSearchQuery, Gender } from "@app/interfaces";
import { useState, useEffect } from "react";

export const Browse = () => {
  const { data: user } = useFetchCurrentUser();
  const [searchQuery, setSearchQuery] = useState<UserSearchQuery>({});

  useEffect(() => {
    if (user) {
      setSearchQuery({
        gender: user.gender,
        sexualPreferences: user.preferences,
      });
    }
  }, [user]);

  const updateSearchQuery = (newQuery: Partial<UserSearchQuery>) => {
    setSearchQuery((prevQuery) => ({
      ...prevQuery,
      ...newQuery,
    }));
  };

  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
  } = useFetchUsers(searchQuery);

  let content;
  if (isLoading) {
    content = "Loading...";
  }
  if (isSuccess && users) {
    content = (
      <>
        {/* <SearchBar onSubmit={updateSearchQuery}/> */}
        <UserList users={users} />
      </>
    );
  }
  if (isError) {
    content = "Error fetching users";
  }
  return <Layout>{content}</Layout>;
};
