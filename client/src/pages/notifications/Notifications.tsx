import { Layout } from "@/components/Layout";
import LoadingCup from "@/components/LoadingCup/LoadingCup";
import { Typography, Box } from "@mui/material";
import { useAuth } from "@/utils/authContext";
import { useFetchCurrentUser } from "../browse/usersActions";
import { useState } from "react";
import { NotificationInterface, NotificationPayload } from "@/utils/socket";
import { usePayload } from "@/utils/payloadProvider";

export const Notifications = () => {
  const {
    data: userData,
    isSuccess: userIsSuccess,
    isLoading: userIsLoading,
  } = useFetchCurrentUser();
  const { notifications, notifMarkAsRead, notifDelete, notifClear } =
    usePayload();

  /* ______________________________ Render ______________________________ */
  let content;

  if (notifications && userIsLoading) {
    content = <LoadingCup />;
  }

  if (userIsSuccess && notifications.length > 0) {
    content = (
      <>
        <Typography variant="h4">Notifications</Typography>
        {notifications.map((notification: NotificationPayload) => (
          <div key={notification.id}>
            <Typography>{notification.message}</Typography>
            <button onClick={() => notifMarkAsRead(notification.id)}>
              Mark as read
            </button>
            <button onClick={() => notifDelete(notification.id)}>Delete</button>
          </div>
        ))}
        <button onClick={() => notifClear()}>Clear all</button>
      </>
    );
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
