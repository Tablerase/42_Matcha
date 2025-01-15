import {
  Card,
  CardContent,
  Typography,
  CardMedia,
  Box,
  Skeleton,
  IconButton,
  Popover,
  Button,
} from "@mui/material";
import { UserCardProps } from "@app/interfaces";
import { useFetchUserProfilePic } from "@/pages/browse/usersActions";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { client } from "@/utils/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import LoadingCup from "./LoadingCup/LoadingCup";
import { useState } from "react";
import { Profile } from "@/pages/profile/Profile";

export const UserCard = ({ user }: UserCardProps) => {
  const { data: profilePic, isLoading: profilePicIsLoading } =
    useFetchUserProfilePic(user.id);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showProfile, setShowProfile] = useState(false);

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
        {/* <Skeleton variant="rectangular" height={200} animation="wave" /> */}
        <LoadingCup isMainLoading={false} />
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
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setShowProfile(false);
  };

  return (
    <>
      <Box 
        onClick={handleClick}
        sx={{ 
          cursor: 'pointer',
          '&:hover': { opacity: 0.9 }
        }}
      >
        <Card
          aria-describedby={id}
          sx={{
            maxWidth: 345,
            // margin: 2,
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
            onMouseDown={handleLike}
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
            {user.city && (
              <Typography variant="body2" color="text.secondary">
                {user.city || "   "}
              </Typography>
            )}
          </CardContent>
        </Card>
      </Box>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "center",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "center",
        }}
      >
        <Box sx={{ p: 2 }}>
          <Profile me={false} />
        </Box>
      </Popover>
    </>
  );
};
