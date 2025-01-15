import { useFetchUsers } from "./usersActions";
import { UserSearchQuery, UsersSortParams, User } from "@app/interfaces";
import { useState, useEffect } from "react";
import { Pagination } from "@mui/material";
import { useAuth } from "@/utils/authContext";
import LoadingCup from "@/components/LoadingCup/LoadingCup";
import { UserList } from "@components/UserList";
import { Layout } from "@components/Layout";
import SearchBar from "@components/SearchBar";
import { Sort } from "@mui/icons-material";

export const Browse = () => {
  const [browseStatus, setBrowseStatus] = useState(false);
  // TODO: ADD appBar with tabs for Browse and Search modes depending on browseStatus
  const { userData, isLoading: userDataLoading } = useAuth();
  const { tags, isLoading: tagLoading } = useAuth();
  const [page, setPage] = useState(1);
  const [searchParams, setSearchParams] = useState<UserSearchQuery>({
    gender: userData?.gender,
    sexualPreferences: userData?.preferences,
  });
  const [sortParams, setSortParams] = useState<UsersSortParams>({
    age: "asc",
  });
  const [displayedUsers, setDisplayedUsers] = useState<User[]>([]);

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

  // Sort users
  const sortUsers = (sortParams: UsersSortParams) => {
    users?.sort((a, b) => {
      if (sortParams.age === "desc") {
        return b.age! - a.age!;
      }
      if (sortParams.fameRate === "desc") {
        return b.fameRate! - a.fameRate!;
      }
      if (sortParams.distance === "desc") {
        return b.distance! - a.distance!;
      }
      if (sortParams.age) {
        return a.age! - b.age!;
      }
      if (sortParams.fameRate) {
        return a.fameRate! - b.fameRate!;
      }
      if (sortParams.distance) {
        return a.distance! - b.distance!;
      }
      // TODO: Implement commonTags sorting
      // if (sortParams.commonTags) {
      //   return a.tags!.length - b.tags!.length;
      // }
      return 0;
    });
    setPage(1);
  };

  // Pagination
  const itemsPerPage = 9;
  useEffect(() => {
    if (users) {
      const offset = (page - 1) * itemsPerPage;
      const endOffset = offset + itemsPerPage;
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
  if (usersIsLoading || userDataLoading || tagLoading) {
    content = <LoadingCup />;
  }
  if (usersIsSuccess && users) {
    content = (
      <>
        <UserList users={displayedUsers} />
        <Pagination
          count={Math.ceil(users.length / itemsPerPage)}
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
  if (!userData) {
    content = "Please log in to view";
  }

  return (
    <Layout>
      <SearchBar
        userData={userData!}
        tags={tags!}
        searchParams={searchParams}
        sortParams={sortParams}
        setSortParams={setSortParams}
        onSubmit={updateSearchQuery}
      />
      {content}
    </Layout>
  );
};
