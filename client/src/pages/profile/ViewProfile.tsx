import { useState } from "react";
import { Tag, User } from "@/app/interfaces";
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
import { EditProfile } from "./EditProfile";
import { ViewProfileProps } from "@/app/interfaces";
import { AvatarGroup } from "@mui/material";

export const ViewProfile = ({ user, tags, images }: ViewProfileProps) => {
  console.log(user.location_postal);
  console.log(images);
  const [editMode, setEditMode] = useState(false);
  if (editMode) {
    return (
      <EditProfile
        user={user}
        userTags={tags}
        setEditMode={() => setEditMode(false)}
      />
    );
  }
  return (
    <Card sx={{ maxWidth: 600, margin: "auto", mt: 4 }}>
      <CardContent>
        <Stack spacing={3}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              sx={{ width: 100, height: 100 }}
              src={images ? images[0]?.url : " "}
            />
            <AvatarGroup>
              {images && images?.length > 1 &&
                images.slice(1, 4).map((image) => (
                  <Avatar
                    sx={{ width: 80, height: 80 }}
                    src={image.url}
                  />
                ))}
            </AvatarGroup>
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
              Date of Birth
            </Typography>
            <Typography>
              {user.dateOfBirth
                ? dayjs(user.dateOfBirth).format("MMMM D, YYYY")
                : "Not specified"}
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Gender
            </Typography>
            <Typography sx={{ textTransform: "capitalize" }}>
              {user.gender ? user.gender : "Not specified"}
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Preferences
            </Typography>
            <Typography sx={{ textTransform: "capitalize" }}>
              {user.preferences ? user.preferences : "Not specified"}
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Location
            </Typography>
            <Typography>
              {user.location_postal ? user.location_postal : "Not specified"}
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Interests
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {tags && tags?.length > 0 ? (
                tags?.map((tag: Tag) => <Chip key={tag.id} label={`#${tag.tag}`} />)
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No interests added yet
                </Typography>
              )}
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
            setEditMode(true);
          }}
        >
          Edit Profile
        </Button>
      </CardActions>
    </Card>
  );
};
