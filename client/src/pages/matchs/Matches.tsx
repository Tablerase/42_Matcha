import { Layout } from "@components/Layout";
import { useMatches } from "./useMatches";
import { UserList } from "@/components/UserList";
import LoadingCup from "@/components/LoadingCup/LoadingCup";
import { Box, Typography } from "@mui/material";

export const Matches = () => {
  const { data: users, isLoading, isSuccess } = useMatches();
  console.log("Matches", users);

  let content: JSX.Element = <></>;
  if (isLoading) {
    content = <LoadingCup />;
  }

  if (isSuccess) {
    if (users.length === 0) {
      content = (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Typography
            variant="h4"
            textAlign={"center"}
            padding={"16px"}
            color="text.secondary"
          >
            🫖 You have no matches yet
          </Typography>
        </Box>
      );
    } else {
      content = <UserList users={users} match={true} />;
    }
  }
  return <Layout>{content}</Layout>;
};
