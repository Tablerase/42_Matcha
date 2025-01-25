import { Layout } from "@/components/Layout";
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  Paper,
  Typography,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { ReactElement } from "react";
import { useAuth } from "@/utils/authContext";
import { useLikes } from "./insightsHooks";

interface InsightsListProps {
  Icon: ReactElement;
}

const InsightsList = ({ Icon }: InsightsListProps) => {
  return (
    <List>
      <ListItem>
        <ListItemAvatar>{Icon}</ListItemAvatar>
      </ListItem>
    </List>
  );
};

export const Insights = () => {
  const { userData, isLoading: userDataLoading } = useAuth();

  // TODO: Fetch likes
  if (userDataLoading || likes.isLoading) {
    return <Layout>Loading...</Layout>;
  }
  const likes = useLikes(userData?.id || 0);

  return (
    <Layout>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" }, // Column on mobile, row on desktop
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          marginTop: "24px",
          gap: {
            xs: "24px", // Vertical gap for mobile
            md: "10vw", // Horizontal gap for desktop
          },
        }}
      >
        <Paper
          elevation={3}
          sx={{ padding: "16px", width: { xs: "90%", md: "auto" } }}
        >
          <Typography variant="h4">Views</Typography>
          <List>
            <ListItem>Insight 1</ListItem>
            <ListItem>Insight 2</ListItem>
            <ListItem>Insight 3</ListItem>
          </List>
        </Paper>
        <Paper
          elevation={3}
          sx={{ padding: "16px", width: { xs: "90%", md: "auto" } }}
        >
          <Typography variant="h4">Likes</Typography>
          <InsightsList Icon={<FavoriteIcon />} />
        </Paper>
      </Box>
    </Layout>
  );
};
