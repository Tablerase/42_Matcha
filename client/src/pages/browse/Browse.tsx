import { Layout } from "@components/Layout";
import { useFetchUsers, useFetchCurrentUser } from "./usersActions";
import { UserList } from "@components/UserList";
import { UserSearchQuery } from "@/app/interfaces";
import { Gender } from "@/app/interfaces";
import { useState } from "react";

export const Browse = () => {
  const { data: user } = useFetchCurrentUser();
  let [searchQuery, setSearchQuery] = useState<UserSearchQuery>({});
  // searchQuery.gender = Gender.Female;
  // searchQuery.sexualPreferences = [Gender.Male]
  const { data: users, isLoading, isSuccess, isError } = useFetchUsers(searchQuery);

  let content;
  if (isLoading) {
    content = "Loading...";
  }
  if (isSuccess && users) {
    content = <>
    {/* <SearchBar onSubmit={setSearchQuery}/> */} 
    <UserList users={users} />
    </>
  }
  if (isError) {
    content = "Error fetching users";
  }
  return (
    <Layout>
      {content}

    </Layout>
  );
};
