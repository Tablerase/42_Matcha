import { theme } from "@/components/theme";
import { useAuth } from "@/utils/authContext";
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
  ListItemButton,
  ListItemText,
  Paper,
  Skeleton,
  Typography,
} from "@mui/material";
import { Box, useMediaQuery } from "@mui/system";
import { useState } from "react";
import {
  useFetchCurrentUser,
  useFetchUserProfilePic,
} from "../browse/usersActions";
import { User } from "@/app/interfaces";
import LoadingCup from "@/components/LoadingCup/LoadingCup";
import { useFetchUserById } from "../insights/insightsHooks";

const ChatDrawerItem = ({
  chat,
  chatUser,
  activeChat,
  setActiveChat,
}: {
  chat: ChatInterface;
  chatUser: number;
  activeChat: number | null;
  setActiveChat: (chatId: number) => void;
}): React.JSX.Element => {
  const { data: user, isLoading: userLoading } = useFetchUserById(chatUser);
  const { data: picture, isLoading: pictureLoading } =
    useFetchUserProfilePic(chatUser);

  if (userLoading || pictureLoading) {
    return <Skeleton variant="rectangular" width="100%" height="64px" />;
  }

  return (
    <ListItemButton
      onClick={() => setActiveChat(chat.id)}
      selected={activeChat === chat.id}
    >
      <ListItemAvatar>
        <Avatar alt={user?.username} src={picture?.url} />
      </ListItemAvatar>
      <ListItemText primary={user?.username} />
    </ListItemButton>
  );
};

export const ChatDrawer = ({
  isMobile,
  chats,
  currentUser,
  activeChat,
  setActiveChat,
}: {
  isMobile: boolean;
  chats: ChatInterface[];
  currentUser: User;
  activeChat: number | null;
  setActiveChat: (chatId: number) => void;
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  let drawerList = (
    <List>
      {chats.map((chat: ChatInterface) => (
        <ChatDrawerItem
          key={chat.id}
          chat={chat}
          chatUser={
            chat.user1Id === currentUser.id ? chat.user2Id : chat.user1Id
          }
          activeChat={activeChat}
          setActiveChat={setActiveChat}
        />
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
          zIndex: 1,
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
  const [activeChat, setActiveChat] = useState<number | null>(null);
  const {
    data: userData,
    isLoading: userDataLoading,
    isSuccess: userDataIsSuccess,
  } = useFetchCurrentUser();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  let content;
  if (userDataLoading) {
    content = <LoadingCup />;
  }

  // TODO: Create an empty chat when match is made
  // TODO: Create event listener for new chat messages
  // TODO: Add chat messages and create a chat component
  if (userDataIsSuccess && userData && chats) {
    if (chats.length === 0) {
      content = (
        <Typography variant="h4" textAlign={"center"}>
          No chats yet
        </Typography>
      );
    } else {
      content = (
        <>
          <ChatDrawer
            isMobile={isMobile}
            chats={chats}
            currentUser={userData}
            activeChat={activeChat}
            setActiveChat={setActiveChat}
          />
          {activeChat ? (
            <Typography variant="h4">Chat {activeChat} active</Typography>
          ) : (
            <Typography variant="h4">Select a chat</Typography>
          )}
        </>
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
