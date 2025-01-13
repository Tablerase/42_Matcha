import { Layout } from "@components/Layout";
import { useFetchUsers, useFetchCurrentUser } from "./usersActions";
import { UserList } from "@components/UserList";
import { UserSearchQuery, PublicUser, User, Gender } from "@app/interfaces";
import { useState, useEffect } from "react";
import { Pagination } from "@mui/material";
import { useAuth } from "@/utils/authContext";

// TODO: Implement search bar and search functionality for users
// pb: query not properly initialized
// state not properly updated
// user undefined so user search query not properly initialized
const setupSearchQuery = (
  user: User,
  params: UserSearchQuery
): UserSearchQuery => {
  let updatedParams = { ...params };
  updatedParams.gender = user.gender;
  updatedParams.sexualPreferences = user.preferences;
  return updatedParams;
};

export const Browse = () => {
  const { userData } = useAuth();
  const [page, setPage] = useState(1);
  const [searchParams, setSearchParams] = useState<UserSearchQuery>({
    gender: userData?.gender,
    sexualPreferences: userData?.preferences,
  });
  const [displayedUsers, setDisplayedUsers] = useState<PublicUser[]>([]);

  // Update search params
  const updateSearchQuery = (params: UserSearchQuery) => {
    setSearchParams(params);
    setPage(1);
  };

  // Fetch users
  const {
    data: users,
    isLoading: usersIsLoading,
    isSuccess: usersIsSuccess,
    isError: usersIsError,
  } = useFetchUsers(searchParams);

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
