import { useFetchUsers } from "./usersActions";
import { UserSearchQuery, UsersSortParams, User } from "@app/interfaces";
import { useState, useEffect } from "react";
import { Pagination, AppBar, Tabs, Tab, Box } from "@mui/material";
import { useAuth } from "@/utils/authContext";
import LoadingCup from "@/components/LoadingCup/LoadingCup";
import { UserList } from "@components/UserList";
import { Layout } from "@components/Layout";
import SearchBar from "@components/SearchBar";
import { Sort } from "@mui/icons-material";

interface TabPanelProps {
  children?: React.ReactNode;
  value: boolean;
  index: boolean;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index } = props;

  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export const Browse = () => {
  // State
  const [browseStatus, setBrowseStatus] = useState(false);
  const { userData, isLoading: userDataLoading } = useAuth();
  const { tags, isLoading: tagLoading } = useAuth();

  // Search and sort state
  const [searchParams, setSearchParams] = useState<UserSearchQuery>({
    gender: userData?.gender,
    sexualPreferences: userData?.preferences,
  });
  const [sortParams, setSortParams] = useState<UsersSortParams>({
    age: "asc",
  });
  const [sortedUsers, setSortedUsers] = useState<User[]>([]);

  // Pagination state
  const [displayedUsers, setDisplayedUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);

  // Update search params
  const updateSearchQuery = (params: UserSearchQuery) => {
    setSearchParams(params);
    setPage(1);
  };

  // Fetch users
  let {
    data: users,
    isLoading: usersIsLoading,
    isSuccess: usersIsSuccess,
    isError: usersIsError,
  } = useFetchUsers(searchParams);

  // Sort users
  useEffect(() => {
    if (users) {
      const sortedUsers = [...users].sort((a, b) => {
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
        // TODO: CommonTags calculation to sort each user by score of common tags
        return 0;
      });
      setSortedUsers(sortedUsers);
    }
    // Create a new array to trigger re-render
    // Update state with new sorted array
    setPage(1);
  }, [sortParams, users]); // Remove users from dependencies if using setUsers

  // Pagination
  const itemsPerPage = 9;
  useEffect(() => {
    if (users) {
      const offset = (page - 1) * itemsPerPage;
      const endOffset = offset + itemsPerPage;
      setDisplayedUsers(sortedUsers.slice(offset, endOffset));
      // setDisplayedUsers(users.slice(offset, endOffset));
    }
  }, [page, users, sortedUsers]);
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

  const handleChange = (event: React.SyntheticEvent, newValue: boolean) => {
    setBrowseStatus(newValue);
  };

  return (
    <Layout>
      <Box sx={{ width: "100%" }}>
        <SearchBar
          browseStatus={browseStatus}
          userData={userData}
          tags={tags}
          searchParams={searchParams}
          sortParams={sortParams}
          setSortParams={setSortParams}
          onSubmit={updateSearchQuery}
        />
        <AppBar position="static" color="default">
          <Tabs
            value={browseStatus}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label="Browse" value={false} />
            <Tab label="Search" value={true} />
          </Tabs>
        </AppBar>

        <TabPanel value={browseStatus} index={false}>
          {/* Browse mode content */}
        </TabPanel>

        <TabPanel value={browseStatus} index={true}>
          {/* Search mode content */}
        </TabPanel>
        {content}
      </Box>
    </Layout>
  );
};
