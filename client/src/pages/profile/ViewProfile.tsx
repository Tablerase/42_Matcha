import { useState } from "react";
import { User } from "@/app/interfaces";
import {
  Card,
  CardContent,
  Avatar,
  Typography,
  Stack,
  Box,
  Chip,
  Button,
  CardActions,
} from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import dayjs from "dayjs";

export const ViewProfile = (user: User) => {
  const [editMode, setEditMode] = useState(false);
  // TODO: show either editMode or viewMode depending on the boolean
  return (
    <Card sx={{ maxWidth: 600, margin: "auto", mt: 4 }}>
      <CardContent>
        <Stack spacing={3}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              sx={{ width: 100, height: 100 }}
              // src={user.profilePicture}
            />
            <Stack>
              <Typography variant="h5">
                {user.firstName} {user.lastName}
              </Typography>
              <Typography color="text.secondary">@{user.username}</Typography>
            </Stack>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Bio
            </Typography>
            <Typography>{user.bio || "No bio provided"}</Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Email
            </Typography>
            <Typography>{user.email}</Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Gender
            </Typography>
            <Typography sx={{ textTransform: "capitalize" }}>
              {user.gender}
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Preferences
            </Typography>
            <Typography sx={{ textTransform: "capitalize" }}>
              {user.preferences}
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Date of Birth
            </Typography>
            <Typography>
              {user.dateOfBirth
                ? dayjs(user.dateOfBirth).format("MMMM D, YYYY")
                : "Not specified"}
            </Typography>
          </Box>

          {user.location && (
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Location
              </Typography>
              <Typography>
                {`${user.location.x.toFixed(2)}°N, ${user.location.y.toFixed(
                  2
                )}°E`}
              </Typography>
            </Box>
          )}

          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Interests
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {/* TODO: Add interests/tags when backend integration is ready */}
              <Chip label="Sample Interest" />
            </Stack>
          </Box>
        </Stack>
      </CardContent>
      <CardActions sx={{ justifyContent: "flex-end", p: 2 }}>
        <Button
          variant="contained"
          startIcon={<EditRoundedIcon />}
          onClick={() => {
            /* TODO: Add navigation to edit mode */
          }}
        >
          Edit Profile
        </Button>
      </CardActions>
    </Card>
  );
};
