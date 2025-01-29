import { Layout } from "@/components/Layout";
import LoadingCup from "@/components/LoadingCup/LoadingCup";
import { Typography, Box } from "@mui/material";
import { useAuth } from "@/utils/authContext";
import { socket, SOCKET_EVENTS } from "@/utils/socket";

export const Notifications = () => {
  const {
    userData,
    isLoading: userDataLoading,
    isSuccess: userDataSuccess,
    isError: userDataError,
  } = useAuth();

  /* ______________________________ Render ______________________________ */
  let content;

  if (socket.active) {
    content = (
      <Typography variant="h4" sx={{ textAlign: "center" }}>
        Connected to server
      </Typography>
    );
  }

  if (userDataLoading) {
    content = <LoadingCup />;
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
