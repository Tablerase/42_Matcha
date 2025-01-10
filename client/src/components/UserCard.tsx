import {
  Card,
  CardContent,
  Typography,
  CardMedia,
  Box,
  Skeleton,
} from "@mui/material";
import { UserCardProps } from "@app/interfaces";
import { useFetchUserProfilePic } from "@/pages/browse/usersActions";

export const UserCard = ({ user }: UserCardProps) => {
  const { data: profilePic, isLoading: profilePicIsLoading } =
    useFetchUserProfilePic(user.id);

  console.log(profilePic);

  if (profilePicIsLoading) {
    return (
      <Card
        sx={{
          maxWidth: 345,
          margin: 2,
        }}
      >
        <Skeleton variant="rectangular" height={200} animation="wave" />
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Skeleton variant="text" width={100} animation="wave" />
            <Skeleton variant="text" width={50} animation="wave" />
          </Box>
          <Skeleton variant="text" width={150} animation="wave" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        maxWidth: 345,
        margin: 2,
        transition: "transform 0.2s",
        "&:hover": {
          transform: "scale(1.02)",
          cursor: "pointer",
        },
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={profilePic?.url || ""}
        alt={`${user.username}'s profile picture`}
        sx={{ objectFit: "cover" }}
      />
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" sx={{ textTransform: "capitalize" }}>
            {user.username}
          </Typography>
          <Typography variant="body1">{user.age} years</Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {user.city || "Matching city"}
        </Typography>
      </CardContent>
    </Card>
  );
};
