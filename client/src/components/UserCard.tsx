import { Card, CardContent, Typography, CardMedia, Box } from "@mui/material";
import { PublicUser } from "@app/interfaces";
import { useFetchUserProfilePic } from "@/pages/browse/usersActions";

interface UserCardProps {
  user: PublicUser;
}

export const UserCard = ({ user }: UserCardProps) => {
  const { data: profilePic, isLoading } = useFetchUserProfilePic(user.id);

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
        image={
          profilePic?.url ||
          "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        }
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
          {user.city || "Location not specified"}
        </Typography>
      </CardContent>
    </Card>
  );
};
