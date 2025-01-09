import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import { useState } from "react";
import { UserUpdateForm, UserUpdateFormProps } from "./UserUpdateForm";
import {
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { Tag } from "@/app/interfaces";
import {
  useUpdateUserProfile,
  useFetchAllTags,
  useDeleteUserTags,
} from "@pages/browse/usersActions";
import { useAddUserTags } from "@pages/browse/usersActions";
import { getIpData, isValidUsername } from "@/utils/helpers";
import { EditProfileProps } from "@/app/interfaces";
import { isValidEmail } from "@/utils/helpers";
import { ProfilePictures } from "@/components/ProfilePictures";
import { useFetchUserImages } from "@pages/browse/usersActions";
import { useMediaQuery } from "@mui/material";
import { theme } from "@components/theme";
import { capitalize } from "@/utils/helpers";

export const EditProfile = ({
  user,
  userTags,
  setEditMode,
}: EditProfileProps) => {
  const { data: tags } = useFetchAllTags();
  const { data: images } = useFetchUserImages(user.id);
  const { updateUserData } = useUpdateUserProfile();
  const updateUserTags = useAddUserTags();
  const deleteUserTags = useDeleteUserTags();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [interests, setInterests] = useState<Tag[]>(userTags || []);

  const handleChangeTags = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    setInterests(tags?.filter((tag) => value.includes(tag.tag)) || []);
  };

  const handleSubmit = async () => {
    for (const tag of interests) {
      if (userTags?.includes(tag)) continue;
      else if (!userTags?.includes(tag))
        updateUserTags({ userId: user.id, tagId: tag.id });
    }
    if (userTags) {
      for (const tag of userTags) {
        if (!interests?.some((interest) => tag.id === interest.id)) {
          deleteUserTags({ userId: user.id, tagId: tag.id });
        }
      }
    }
    setEditMode();
  };

  const handleLocationUpdate = async () => {
    // if ("geolocation" in navigator) {
    //   navigator.geolocation.getCurrentPosition(
    //     (position) => {
    //       setFormData({
    //         ...formData,
    //         location: {
    //           x: position.coords.latitude,
    //           y: position.coords.longitude,
    //         },
    //       });
    //     },
    //     (error) => {
    //       console.error("Error getting user location:", error);
    //     }
    //   );
    // }
    try {
      const data = await getIpData();
      // setFormData({
      //   ...formData,
      //   location: { x: data.latitude, y: data.longitude },
      //   location_postal: data.postal,
      // });
    } catch (e) {
      console.error(e);
    }
  };

  const formProps: UserUpdateFormProps = {
    user: user,
    tags: tags,
    userTags: interests,
    onTagsChange: handleChangeTags
  }

  return (
    <Card sx={{ m: 4 }}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: "flex-start",
            justifyContent: "space-evenly",
            gap: 3,
            "& > *": {
              maxWidth: isMobile ? "100%" : "50%",
              width: "100%",
            },
          }}
        >
          <UserUpdateForm {...formProps}/> 
          <Stack spacing={3}>
            <Typography variant="h4">Additional Info</Typography>

            <Typography variant="h4">Location</Typography>
            <Button variant="contained" onClick={() => handleLocationUpdate()}>
              Locate Me!
            </Button>

            <Typography variant="h4">Pictures</Typography>
            {/* <ProfilePictures images={images} userData={formData} /> */}
          </Stack>
        </Box>
      </CardContent>
      <CardActions sx={{ justifyContent: "flex-end", p: 2 }}>
        <Button variant="outlined" onClick={setEditMode}>
          Cancel
        </Button>
      </CardActions>
    </Card>
  );
};
