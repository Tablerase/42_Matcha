import { format } from "timeago.js";
import { Layout } from "@/components/Layout";
import { Profile } from "../profile/Profile";
import {
  Avatar,
  Box,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Popover,
  Skeleton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { ReactElement, useState } from "react";
import { useAuth } from "@/utils/authContext";
import { useLikes, useViews, useFetchUserById } from "./insightsHooks";
import LoadingCup from "@/components/LoadingCup/LoadingCup";
import { UserLike, UserView } from "@/app/interfaces";

interface InsightsListProps {
  Icon: ReactElement;
  ListItems: UserLike[] | UserView[];
}

const InsightsItem = ({
  Icon,
  item,
  userId,
}: {
  Icon: ReactElement;
  item: UserLike | UserView;
  userId: number;
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const {
    data: user,
    isLoading: userIsLoading,
    isSuccess: userIsSuccess,
    isError: userIsError,
  } = useFetchUserById(userId);
  const theme = useTheme();

  // Event handlers
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Render

  if (userIsLoading) {
    return (
      <Stack direction="row" alignItems="center" spacing={2} padding={1}>
        <Skeleton variant="circular" width={40} height={40} />
        <Skeleton variant="rectangular" width={100} height={10} />
      </Stack>
    );
  }

  if (userIsError) {
    return (
      <>
        <Typography>Error fetching user</Typography>
      </>
    );
  }

  if (userIsSuccess) {
    return (
      <>
        <ListItem
          key={user.id}
          onClick={handleClick}
          sx={{
            cursor: "pointer",
            "&:hover": {
              backgroundColor: theme.palette.action.hover,
            },
          }}
        >
          <ListItemAvatar>
            <Avatar>{Icon}</Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={
              user.username.charAt(0).toUpperCase() + user.username.slice(1)
            }
            secondary={
              "likedAt" in item && item.likedAt instanceof Date
                ? format(item.likedAt)
                : "No date available"
            }
          ></ListItemText>
        </ListItem>

        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <Profile me={false} user={user} userIsSuccess={true} />
        </Popover>
      </>
    );
  }
  return <></>;
};

const InsightsList = ({ Icon, ListItems }: InsightsListProps) => {
  if ((ListItems[0] as UserLike).likedAt !== undefined) {
    ListItems = ListItems as UserLike[];
  } else {
    ListItems = ListItems as UserView[];
  }

  return (
    <List>
      {ListItems.map((item: UserLike | UserView) => (
        <InsightsItem
          Icon={Icon}
          item={item}
          userId={"likerId" in item ? item.likerId : item.viewerId}
          key={item.id}
        />
      ))}
    </List>
  );
};

export const Insights = () => {
  const {
    userData,
    isLoading: userDataLoading,
    isSuccess: userDataSuccess,
    isError: userDataError,
  } = useAuth();
  const {
    data: likes,
    isLoading: likesLoading,
    isSuccess: likesSuccess,
    error: likesErrors,
  } = useLikes(userData?.id ?? 0);
  const {
    data: views,
    isLoading: viewsLoading,
    isSuccess: viewsSuccess,
    error: viewsErrors,
  } = useViews(userData?.id ?? 0);

  /* _____________________________ Render ____________________________ */
  let content;
  if (userDataLoading || likesLoading) {
    content = <LoadingCup />;
  }

  if (likesErrors || userDataError) {
    content = (
      <>
        <Typography>Error fetching data</Typography>
      </>
    );
  }

  if (userDataSuccess && likesSuccess) {
    content = (
      <>
        <Paper
          elevation={3}
          sx={{ padding: "16px", width: { xs: "90%", md: "auto" } }}
        >
          <Typography variant="h4">Views</Typography>
          <List>
            <ListItem>Insight 1</ListItem>
            <ListItem>Insight 2</ListItem>
          </List>
        </Paper>
        <Paper
          elevation={3}
          sx={{ padding: "16px", width: { xs: "90%", md: "auto" } }}
        >
          <Typography variant="h4">Likes</Typography>
          <InsightsList Icon={<FavoriteIcon />} ListItems={likes} />
        </Paper>
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
          alignItems: "center",
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
