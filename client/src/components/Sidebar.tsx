import * as React from "react";
import Divider from "@mui/material/Divider";
// import Paper from "@mui/material/Paper";
import ListItemButton from "@mui/material/ListItemButton";
// import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Typography from "@mui/material/Typography";
import ContentCut from "@mui/icons-material/ContentCut";
import ContentCopy from "@mui/icons-material/ContentCopy";
import ContentPaste from "@mui/icons-material/ContentPaste";
import Cloud from "@mui/icons-material/Cloud";
import ChatIcon from "@mui/icons-material/Chat";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { MatchaNavBar } from "./MatchaNavBar";

export const Sidebar = () => {
  return (
    <MatchaNavBar>
      <ListItemButton>
        <ListItemIcon sx={{ minWidth: "2em" }}>
          <ChatIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Chat</ListItemText>
      </ListItemButton>
      <ListItemButton>
        <ListItemIcon sx={{ minWidth: "2em" }}>
          <AccountCircleIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Account</ListItemText>
      </ListItemButton>
      <ListItemButton>
        <ListItemIcon sx={{ minWidth: "2em" }}>
          <SearchIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Browse</ListItemText>
      </ListItemButton>
      <ListItemButton>
        <ListItemIcon sx={{ minWidth: "2em" }}>
          <FavoriteIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Matches</ListItemText>
      </ListItemButton>
      <ListItemButton>
        <ListItemIcon sx={{ minWidth: "2em" }}>
          <NotificationsIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Notifications</ListItemText>
      </ListItemButton>
      <ListItemButton>
        <ListItemIcon sx={{ minWidth: "2em" }}>
          <LogoutIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Logout</ListItemText>
      </ListItemButton>
    </MatchaNavBar>
  );
};
