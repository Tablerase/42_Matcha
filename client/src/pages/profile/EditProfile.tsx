import { useState } from "react";
import { UserUpdateForm } from "./UserUpdateForm";
import {
  CardContent,
  Typography,useMediaQuery, Box, Button, Stack, Card, CardActions
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { Tag, UserUpdateFormProps } from "@/app/interfaces";
import {
  useFetchAllTags,
} from "@pages/browse/usersActions";
import { EditProfileProps } from "@/app/interfaces";
import { useFetchUserImages } from "@pages/browse/usersActions";
import { theme } from "@components/theme";

export const EditProfile = ({
  user,
  userTags,
  setEditMode,
}: EditProfileProps) => {
  const { data: tags } = useFetchAllTags();
  const { data: images } = useFetchUserImages(user.id);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [dateOfBirth, setDateOfBirth] = useState<string>("");
  const [interests, setInterests] = useState<Tag[]>(userTags ?? []);

  const handleChangeTags = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    setInterests(tags?.filter((tag) => value.includes(tag.tag)) || []);
  };

  const formProps: UserUpdateFormProps = {
    user: user,
    tags: tags,
    userTags: interests,
    oldTags: userTags,
    onDateChange: setDateOfBirth,
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
          <Stack spacing={3}>
          <Typography variant="h4">Personal Info</Typography>
          <UserUpdateForm {...formProps}/> 
          </Stack>
        </Box>
      </CardContent>
      <CardActions sx={{ justifyContent: "center" }}>
        <Button variant="outlined" onClick={setEditMode}>
          Cancel
        </Button>
      </CardActions>
    </Card>
  );
};
