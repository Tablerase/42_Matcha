import { useFetchUsers, useFetchCurrentUser } from "./usersActions";
import { UserSearchQuery, PublicUser, User, Gender } from "@app/interfaces";
import { useState, useEffect } from "react";
import { Pagination } from "@mui/material";
import { useAuth } from "@/utils/authContext";
import LoadingCup from "@/components/LoadingCup/LoadingCup";
import { UserList } from "@components/UserList";
import { Layout } from "@components/Layout";
import SearchBar from "@components/SearchBar";

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
    content = <LoadingCup />;
  }
  if (usersIsSuccess && users) {
    content = (
      <>
        <SearchBar searchParams={searchParams} onSubmit={updateSearchQuery} />
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
