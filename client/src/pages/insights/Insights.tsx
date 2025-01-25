import { Layout } from "@/components/Layout";
import { Box, Divider, List, ListItem } from "@mui/material";

export const Insights = () => {
  return (
    <Layout>
      <Box
        sx={{
          display: "flex",
          direction: "row",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <List>
          <ListItem>Insight 1</ListItem>
          <ListItem>Insight 2</ListItem>
          <ListItem>Insight 3</ListItem>
        </List>
        <Divider orientation="vertical" flexItem />
        <List>
          <ListItem>Insight 4</ListItem>
          <ListItem>Insight 5</ListItem>
          <ListItem>Insight 6</ListItem>
        </List>
      </Box>
    </Layout>
  );
};
