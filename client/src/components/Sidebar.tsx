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
import { MatchaNavBar } from "./MatchaNavBar";

export const Sidebar = () => {
  return (
    <MatchaNavBar>
      <ListItemButton>
        <ListItemIcon>
          <ContentCut fontSize="small" />
        </ListItemIcon>
        <ListItemText>Cut</ListItemText>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          ⌘X
        </Typography>
      </ListItemButton>
      <ListItemButton>
        <ListItemIcon>
          <ContentCopy fontSize="small" />
        </ListItemIcon>
        <ListItemText>Copy</ListItemText>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          ⌘C
        </Typography>
      </ListItemButton>
      <ListItemButton>
        <ListItemIcon>
          <ContentPaste fontSize="small" />
        </ListItemIcon>
        <ListItemText>Paste</ListItemText>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          ⌘V
        </Typography>
      </ListItemButton>
      <Divider />
      <ListItemButton>
        <ListItemIcon>
          <Cloud fontSize="small" />
        </ListItemIcon>
        <ListItemText>Web Clipboard</ListItemText>
      </ListItemButton>
    </MatchaNavBar>
  );
};
