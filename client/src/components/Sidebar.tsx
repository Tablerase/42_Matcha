import Divider from "@mui/material/Divider";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import ChatIcon from "@mui/icons-material/Chat";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { MatchaNavBar } from "./MatchaNavBar";
import Box from "@mui/material/Box";

export const Sidebar = () => {
  return (
    <MatchaNavBar sx={{ display: "flex", flexDirection: "column", padding: 0 }}>
      <Box>
        <ListItemButton>
          <ListItemIcon>
            <SearchIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Browse</ListItemText>
        </ListItemButton>
        <ListItemButton>
          <ListItemIcon>
            <FavoriteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Matches</ListItemText>
        </ListItemButton>
        <ListItemButton>
          <ListItemIcon>
            <AccountCircleIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Profile</ListItemText>
        </ListItemButton>
        <ListItemButton>
          <ListItemIcon>
            <ChatIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Chat</ListItemText>
        </ListItemButton>
        <ListItemButton>
          <ListItemIcon>
            <NotificationsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Notifications</ListItemText>
        </ListItemButton>
      </Box>
      <Box sx={{ mt: "auto" }}>
        <Divider />
        <ListItemButton>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </ListItemButton>
      </Box>
    </MatchaNavBar>
  );
};
