import {
  Card,
  CardContent,
  Typography,
  CardMedia,
  Box,
  Skeleton,
  IconButton,
} from "@mui/material";
import { UserCardProps } from "@app/interfaces";
import { useFetchUserProfilePic } from "@/pages/browse/usersActions";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { client } from "@/utils/axios";
import { useMutation, useQuery } from "@tanstack/react-query";

export const UserCard = ({ user }: UserCardProps) => {
  const { data: profilePic, isLoading: profilePicIsLoading } =
    useFetchUserProfilePic(user.id);

  // Check if user is liked
  const { data: isUserLiked, refetch: refetchLikeStatus } = useQuery({
    queryKey: ["isUserLiked", user.id],
    queryFn: async () => {
      const response = await client.get(`/users/${user.id}/liked/`);
      const data = {
        liked: response.data.data.isLiked,
      };
      if (data.liked === true) {
        return true;
      }
      return false;
    },
  });

  // Like/Unlike mutation
  const { mutate: toggleLike, isPending: isLikeLoading } = useMutation({
    mutationFn: async () => {
      if (isUserLiked) {
        return client.delete(`/users/${user.id}/likes/`);
      }
      return client.post(`/users/${user.id}/likes/`);
    },
    onSuccess: () => {
      refetchLikeStatus();
    },
  });

  const handleLike = async () => {
    if (!isLikeLoading) {
      toggleLike();
    }
  };

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
            <Skeleton variant="text" width={40} animation="wave" />
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
        position: "relative",
        transition: "transform 0.2s",
        "&:hover": {
          transform: "scale(1.02)",
          cursor: "pointer",
        },
      }}
    >
      <IconButton
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.9)",
          },
          zIndex: 1,
        }}
        aria-label="Like"
        color="primary"
        onClick={handleLike}
      >
        {/* <FavoriteIcon /> */}
        {isUserLiked ? <Favorite /> : <FavoriteBorder />}
      </IconButton>
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
