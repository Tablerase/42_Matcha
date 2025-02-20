import { theme } from "@/components/theme";
import { usePayload } from "@/utils/payloadProvider";
import { ChatInterface } from "@/utils/socket";
import { Layout } from "@components/Layout";
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
      {chats.map((chat: ChatInterface) => (
        <ListItem key={chat.id}>
          <ListItemAvatar>
            {/* User profic pic */}
            <Avatar />
          </ListItemAvatar>
          <ListItemText primary={chat.user1Id} />
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
  const { chats } = usePayload();
  // TODO: Add active chat session
  // const [activeChat, setActiveChat] = useState<number | null>(null);
  // TODO: recover current user id
  // const { user } = useAuth();
  // TODO: recover users from the different chats (to display their names, profile pics, etc.)
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
