import { theme } from "@/components/theme";
import { Layout } from "@components/Layout";
import { ChatBubble } from "@mui/icons-material";
import ForumIcon from "@mui/icons-material/Forum";
import {
  Avatar,
  Drawer,
  Fab,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import { Box, useMediaQuery } from "@mui/system";
import { useState } from "react";

export const ChatDrawer = ({
  isMobile,
  chats,
}: {
  isMobile: boolean;
  chats: any;
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  let drawerList = (
    <List>
      {chats.map((chat: any) => (
        <ListItem key={chat.id}>
          <ListItemAvatar>
            {/* User profic pic */}
            <Avatar />
          </ListItemAvatar>
          <ListItemText primary={chat.username} />
        </ListItem>
      ))}
    </List>
  );

  let drawer;
  drawer = (
    <>
      {isMobile && (
        <Fab
          color="primary"
          sx={{
            position: "fixed",
            top: "12px",
            right: "12px",
            zIndex: 1000,
          }}
          onClick={() =>
            drawerOpen ? setDrawerOpen(false) : setDrawerOpen(true)
          }
        >
          <ForumIcon />
        </Fab>
      )}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          width: "300px",
          flexShrink: 0,
          height: "100%",
          zIndex: -1,
        }}
      >
        {drawerList}
      </Drawer>
    </>
  );

  return drawer;
};

export const Chat = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const chats = [
    {
      id: 1,
      username: "John Doe",
    },
    {
      id: 2,
      username: "Jane Doe",
    },
  ];
  const conversations = [
    {
      id: 1,
      name: "John Doe",
      lastMessage: "Hello, how are you?",
    },
    {
      id: 2,
      name: "Jane Doe",
      lastMessage: "I'm good, thank you!",
    },
  ];

  let content;

  content = (
    <>
      <ChatDrawer isMobile={isMobile} chats={chats} />
    </>
  );

  return (
    <Layout>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" }, // Column on mobile, row on desktop
          justifyContent: "center",
          alignItems: {
            xs: "center",
            md: "flex-end",
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
