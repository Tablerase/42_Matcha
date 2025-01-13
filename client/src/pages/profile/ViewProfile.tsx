import { useState } from "react";
import { Tag, ViewProfileProps } from "@/app/interfaces";
import {
  Card,
  CardContent,
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
import { ProfilePictures } from "@/components/ProfilePictures";
import { capitalize } from "@/utils/helpers";
import { tagChipColors } from "@/components/theme";

export const ViewProfile = ({ user, tags, images }: ViewProfileProps) => {
  if (!user.dateOfBirth) {
    user.gender = undefined;
    user.preferences = undefined;
  }
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
    <Card sx={{ m: 4 }}>
      <CardContent>
        <Stack spacing={3}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
            }}
          >
            <ProfilePictures images={images} editMode={false} />
            <Typography variant="h3">
              {capitalize(user.firstName)} {capitalize(user.lastName)}
            </Typography>
            <Typography>@{user.username?.toLowerCase()}</Typography>
            <Typography>{user.bio || "No bio provided"}</Typography>
            <Stack
              direction="row"
              spacing={1.5}
              flexWrap="wrap"
              sx={{
                rowGap: 0.5,
              }}
            >
              {tags && tags?.length > 0 ? (
                tags?.map((tag: Tag) => (
                  <Chip
                    key={tag.id}
                    label={`#${tag.tag}`}
                    sx={{
                      bgcolor: tagChipColors[tag.id % tagChipColors.length],
                    }}
                  />
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No interests added yet
                </Typography>
              )}
            </Stack>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Email
            </Typography>
            <Typography>{user.email?.toLowerCase()}</Typography>
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
            <Typography>{user.city ? user.city : "Not specified"}</Typography>
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
