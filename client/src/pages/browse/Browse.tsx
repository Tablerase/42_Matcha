import { Layout } from "@components/Layout";
import { useFetchUsers, useFetchCurrentUser } from "./usersActions";
import { UserList } from "@components/UserList";
import { UserSearchQuery, PublicUser } from "@app/interfaces";
import { useState, useEffect } from "react";
import { Pagination } from "@mui/material";

export const Browse = () => {
  const { data: user } = useFetchCurrentUser();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState<UserSearchQuery>({});
  const [displayedUsers, setDisplayedUsers] = useState<PublicUser[]>([]);

  // // Search query
  // useEffect(() => {
  //   if (user) {
  //     setSearchQuery({
  //       gender: user.gender,
  //       sexualPreferences: user.preferences,
  //     });
  //   }
  // }, [user]);
  // const updateSearchQuery = (newQuery: Partial<UserSearchQuery>) => {
  //   setSearchQuery((prevQuery) => ({
  //     ...prevQuery,
  //     ...newQuery,
  //   }));
  // };
  const {
    data: users,
    isLoading: usersIsLoading,
    isSuccess: usersIsSuccess,
    isError: usersIsError,
  } = useFetchUsers(searchQuery);

  // Pagination
  useEffect(() => {
    if (users) {
      const offset = (page - 1) * 9;
      const endOffset = offset + 9;
      setDisplayedUsers(users.slice(offset, endOffset));
    }
  }, [page, users]);
  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  // Content rendering
  let content;
  if (usersIsLoading) {
    content = "Loading...";
  }
  if (usersIsSuccess && users) {
    content = (
      <>
        {/* <SearchBar onSubmit={updateSearchQuery}/> */}
        <UserList users={displayedUsers} />
        <Pagination
          count={Math.ceil(users.length / 10)}
          page={page}
          onChange={handlePageChange}
          style={{ marginTop: "16px" }}
        />
      </>
    );
  }
  if (usersIsError) {
    content = "Error fetching users";
  }
  return <Layout>{content}</Layout>;
};
