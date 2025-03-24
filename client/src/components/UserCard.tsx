import {
  Card,
  CardContent,
  Typography,
  CardMedia,
  Box,
  Skeleton,
  IconButton,
  Popover,
} from "@mui/material";
import { UserCardProps } from "@app/interfaces";
import { useFetchUserProfilePic } from "@/pages/browse/usersActions";
import { Favorite, FavoriteBorder, PersonRemove } from "@mui/icons-material";
import { client } from "@/utils/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import LoadingCup from "./LoadingCup/LoadingCup";
import { useState } from "react";
import { Profile } from "@/pages/profile/Profile";
import { grey } from "@mui/material/colors";
import { set } from "date-fns";

export const UserCard = ({ user, match }: UserCardProps) => {
  const { data: profilePic, isLoading: profilePicIsLoading } =
    useFetchUserProfilePic(user.id);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [subButtonClicked, setSubButtonClicked] = useState(false);

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
    setSubButtonClicked(true);
    if (!isLikeLoading) {
      toggleLike();
    }
  };

  const { mutate: removeMatch } = useMutation({
    mutationFn: async () => {
      await client.delete(`/users/${user.id}/matches/`);
    },
    onSuccess: () => {
      console.log("Match removed successfully");
      // Optionally, you can refetch the matches or update the UI accordingly
    },
    onError: (error) => {
      console.error("Error removing match:", error);
    },
  });
  const handleMatchRemove = async () => {
    setSubButtonClicked(true);
    console.log("Removing match");
    if (window.confirm("Are you sure you want to remove this match?")) {
      removeMatch();
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
  const id = open ? "profile-popover" : undefined;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (subButtonClicked) {
      setSubButtonClicked(false);
      return;
    }
    try {
      client.post(`/users/${user.id}/views/`);
    } catch (error) {
      console.error(error);
    }
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Box
        onClick={handleClick}
        sx={{
          cursor: "pointer",
          "&:hover": { opacity: 0.9 },
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
          {match ? (
            <IconButton
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                backgroundColor: grey[50],
                "&:hover": {
                  backgroundColor: grey[300],
                },
                zIndex: 1,
              }}
              aria-label="Remove Match"
              color="error"
              onMouseDown={handleMatchRemove}
            >
              <PersonRemove />
            </IconButton>
          ) : (
            <IconButton
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                backgroundColor: grey[50],
                "&:hover": {
                  backgroundColor: grey[300],
                },
                zIndex: 1,
              }}
              aria-label="Like"
              color="primary"
              onMouseDown={handleLike}
            >
              {isUserLiked ? <Favorite /> : <FavoriteBorder />}
            </IconButton>
          )}
          <CardMedia
            component="img"
            height="200"
            image={
              profilePic?.url ||
              "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            }
            alt={`${user.username}'s profile picture`}
            sx={{ objectFit: "cover" }}
          />
          {/* <ul>
            <li> Username: {user.username}</li>
            <li> Age: {user.age} years</li>
            <li> FameRate: {user.fameRate}</li>
            <li> Distance: {user.distance} km</li>
            <li> TotalScore: {user.totalScore}</li>
            <li> CommonTags: {user.commonTags}</li>
            <li>Tags: {user.tags?.map((tag) => tag).join(", ") || ""}</li>
          </ul> */}
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
                {user.city}
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
        {/* <Box sx={{ p: 2 }}> */}
        <Profile me={false} user={user} userIsSuccess={true} />
        {/* </Box> */}
      </Popover>
    </>
  );
};
