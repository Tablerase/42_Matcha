import { Layout } from "@/components/Layout";
import LoadingCup from "@/components/LoadingCup/LoadingCup";
import { Typography, Box } from "@mui/material";
import { useAuth } from "@/utils/authContext";
import { useFetchCurrentUser } from "../browse/usersActions";

export const Notifications = () => {
  const { socket, isLoading: dataIsLoading } = useAuth();
  const {
    data: userData,
    isSuccess: userIsSuccess,
    isLoading: userIsLoading,
  } = useFetchCurrentUser();

  /* ______________________________ Render ______________________________ */
  let content;

  if (dataIsLoading || userIsLoading) {
    content = <LoadingCup />;
  }

  if (userIsSuccess) {
    if (socket && socket.connected) {
      content = (
        <Typography variant="h4" sx={{ textAlign: "center" }}>
          Connected to server
        </Typography>
      );
    }
  }

  return (
    <Layout>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" }, // Column on mobile, row on desktop
          justifyContent: "center",
          alignItems: {
            xs: "center",
            md: "flex-start",
          },
          height: "100%",
          marginTop: "24px",
          gap: {
            xs: "24px", // Vertical gap for mobile
            md: "10vw", // Horizontal gap for desktop
          },
        }}
      >
        {content}
      </Box>
    </Layout>
  );
};
