import { Layout } from "@/components/Layout";
import LoadingCup from "@/components/LoadingCup/LoadingCup";
import { Typography, Box } from "@mui/material";
import { useAuth } from "@/utils/authContext";

export const Notifications = () => {
  const {
    userData,
    socket,
    isLoading: dataIsLoading,
    isSuccess: dataIsSuccess,
    isError: dataIsError,
  } = useAuth();

  /* ______________________________ Render ______________________________ */
  let content;

  if (dataIsLoading) {
    content = <LoadingCup />;
  }

  if (dataIsSuccess) {
    if (socket && socket.active) {
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
