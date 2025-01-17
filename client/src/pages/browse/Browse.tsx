import { useFetchUsers } from "./usersActions";
import {
  UserSearchQuery,
  UsersSortParams,
  SortUser,
  Order,
} from "@app/interfaces";
import { useState, useEffect } from "react";
import { Pagination, AppBar, Tabs, Tab, Box } from "@mui/material";
import { useAuth } from "@/utils/authContext";
import LoadingCup from "@/components/LoadingCup/LoadingCup";
import { UserList } from "@components/UserList";
import { Layout } from "@components/Layout";
import SearchBar from "@components/SearchBar";
import { sortUsersByCommonTags, sortWeightedUsers } from "./usersSorting";
import { DEFAULT_SEARCH_PARAMS, MAX_AGE, MIN_AGE } from "@/utils/config";

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
  /* _____________________________ State ____________________________ */
  // State
  const [browseStatus, setBrowseStatus] = useState(false);
  const { userData, isLoading: userDataLoading } = useAuth();
  const { tags, isLoading: tagLoading } = useAuth();
  // Search and sort state
  const [searchParams, setSearchParams] = useState<UserSearchQuery>({
    // ...DEFAULT_SEARCH_PARAMS,
    gender: userData?.gender || DEFAULT_SEARCH_PARAMS.gender,
    sexualPreferences:
      userData?.preferences || DEFAULT_SEARCH_PARAMS.sexualPreferences,
    latitude: userData?.location?.x ?? DEFAULT_SEARCH_PARAMS.latitude,
    longitude: userData?.location?.y ?? DEFAULT_SEARCH_PARAMS.longitude,
  });
  const [sortParams, setSortParams] = useState<UsersSortParams>({
    age: Order.asc,
  });
  const [sortedUsers, setSortedUsers] = useState<SortUser[]>([]);

  // Pagination state
  const [displayedUsers, setDisplayedUsers] = useState<SortUser[]>([]);
  const [page, setPage] = useState(1);

  /* _____________________________ Search Params ____________________________ */
  // Update search params
  const updateSearchQuery = (params: UserSearchQuery) => {
    setSearchParams(params);
    setPage(1);
  };
  // Update search params when UserData loads
  // useEffect(() => {
  //   if (userData) {
  //     setSearchParams((prev) => ({
  //       ...prev,
  //       gender: userData.gender || prev.gender,
  //       sexualPreferences: userData.preferences || prev.sexualPreferences,
  //       latitude: userData.location?.x ?? prev.latitude,
  //       longitude: userData.location?.y ?? prev.longitude,
  //     }));
  //   }
  // }, [userData]);

  // Fetch users
  let {
    data: users,
    isLoading: usersIsLoading,
    isSuccess: usersIsSuccess,
    isError: usersIsError,
  } = useFetchUsers(searchParams);

  // Browse mode
  // useEffect(() => {
  //   if (browseStatus === true && users && userData) {
  //     let sorted = [...users!];
  //     sorted = sortWeightedUsers(userData!, sorted);
  //     setSortedUsers(sorted);
  //     setPage(1);
  //   }
  // }, [browseStatus, users, userData]);

  /* _____________________________ Sort Params ____________________________ */
  // Sort users
  useEffect(() => {
    let sorted: SortUser[] = [];
    if (users && sortParams.commonTags! && userData?.tags) {
      sorted = [...users];
      sorted = sortUsersByCommonTags(
        sorted,
        sortParams.commonTags,
        userData.tags
      );
    } else if (users) {
      sorted = [...users].sort((a, b) => {
        if (sortParams.age === Order.desc) {
          return b.age! - a.age!;
        }
        if (sortParams.fameRate === Order.desc) {
          return b.fameRate! - a.fameRate!;
        }
        if (sortParams.distance === Order.desc) {
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
        return 0;
      });
    }
    // Update state with new sorted array
    setSortedUsers(sorted);
    setPage(1);
  }, [sortParams, userData, users]); // Remove users from dependencies if using setUsers

  /* _____________________________ Pagination ____________________________ */
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

  /* _____________________________ Content ____________________________ */
  let content;
  if (usersIsLoading || userDataLoading || tagLoading) {
    content = <LoadingCup />;
    return content;
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
