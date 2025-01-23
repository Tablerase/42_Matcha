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
import { useTheme, useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { routes } from "@/utils/routes";
import { useLogout } from "@/pages/auth/authActions";
import { useAuth } from "@/utils/authContext";

export const Sidebar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const logout = useLogout();
  const { userData } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <MatchaNavBar
      sx={{
        display: "flex",
        ...(isMobile
          ? {
              flexDirection: "row",
              position: "fixed",
              bottom: 0,
              width: "100%",
              // height: "auto",
              padding: 0,
              justifyContent: "space-around",
            }
          : {
              position: "fixed",
              flexDirection: "column",
              minHeight: "100%",
              right: 0,
              padding: 0,
              flexGrow: 1,
            }),
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "row" : "column",
          width: "100%",
        }}
      >
        <ListItemButton
          disableRipple
          disableTouchRipple
          onClick={() => navigate(routes.BROWSE)}
          disabled={userData && !userData.dateOfBirth}
        >
          <ListItemIcon>
            <SearchIcon fontSize="small" />
          </ListItemIcon>
          {!isMobile && <ListItemText>Browse</ListItemText>}
        </ListItemButton>
        <ListItemButton
          disableRipple
          disableTouchRipple
          onClick={() => navigate(routes.MATCHES)}
        >
          <ListItemIcon>
            <FavoriteIcon fontSize="small" />
          </ListItemIcon>
          {!isMobile && <ListItemText>Matches</ListItemText>}
        </ListItemButton>
        <ListItemButton
          disableRipple
          disableTouchRipple
          onClick={() => navigate(routes.ME)}
        >
          <ListItemIcon>
            <AccountCircleIcon fontSize="small" />
          </ListItemIcon>
          {!isMobile && <ListItemText>Profile</ListItemText>}
        </ListItemButton>
        <ListItemButton
          disableRipple
          disableTouchRipple
          onClick={() => navigate(routes.CHAT)}
        >
          <ListItemIcon>
            <ChatIcon fontSize="small" />
          </ListItemIcon>
          {!isMobile && <ListItemText>Chat</ListItemText>}
        </ListItemButton>
        {/* TODO: When clicking on Notifications show Drawer */}
        <ListItemButton disableRipple disableTouchRipple>
          <ListItemIcon>
            <NotificationsIcon fontSize="small" />
          </ListItemIcon>
          {!isMobile && <ListItemText>Notifications</ListItemText>}
        </ListItemButton>
      </Box>
      <Box
        sx={{
          mt: isMobile ? 0 : "auto",
          width: isMobile ? "auto" : "100%",
        }}
      >
        {!isMobile && <Divider />}
        {/* Logout */}
        <ListItemButton disableRipple disableTouchRipple onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          {!isMobile && <ListItemText>Logout</ListItemText>}
        </ListItemButton>
      </Box>
    </MatchaNavBar>
  );
};
