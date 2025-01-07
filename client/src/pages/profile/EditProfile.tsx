import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import { useState } from "react";
import {
  CardContent,
  TextField,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import InputLabel from "@mui/material/InputLabel";
import { SelectChangeEvent } from "@mui/material/Select";
import { Tag } from "@/app/interfaces";
import { MultipleSelectChip } from "@/components/MultipleSelectChip";
import {
  useUpdateUserProfile,
  useFetchAllTags,
  useDeleteUserTags,
} from "@pages/browse/usersActions";
import dayjs, { Dayjs } from "dayjs";
import { useAddUserTags } from "@pages/browse/usersActions";
import { getIpData, isValidUsername } from "@/utils/helpers";
import { EditProfileProps, FormData } from "@/app/interfaces";
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
  const updateUser = useUpdateUserProfile();
  const updateUserTags = useAddUserTags();
  const deleteUserTags = useDeleteUserTags();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [emailError, setEmailError] = useState<string>("");
  const [usernameError, setUsernameError] = useState<string>("");
  const [bioError, setBioError] = useState<string>("");
  const [interests, setInterests] = useState<Tag[]>(userTags || []);
  const [formData, setFormData] = useState<FormData>({
    id: user.id!,
    firstName: user.firstName!,
    lastName: user.lastName!,
    email: user.email!,
    username: user.username!,
    gender: user.gender!,
    preferences: user.preferences || "bisexual",
    bio: user.bio || "",
    location: user.location,
    location_postal: user.location_postal || "",
    fameRate: user.fameRate || 0,
    lastSeen: user.lastSeen || new Date(),
    dateOfBirth: user.dateOfBirth ? dayjs(user.dateOfBirth) : null,
    interests: [],
  });

  const validateForm = () => {
    return !!(
      formData.firstName &&
      formData.lastName &&
      formData.username &&
      formData.email &&
      formData.gender &&
      formData.preferences &&
      formData.location &&
      formData.location_postal &&
      emailError === "" &&
      usernameError === "" &&
      bioError === ""
    );
  };

  const handleChange =
    (field: keyof FormData) =>
    (
      event:
        | React.ChangeEvent<HTMLInputElement | { value: unknown }>
        | SelectChangeEvent
    ) => {
      if (field === "email") {
        const email = event.target.value as string;
        if (!isValidEmail(email)) {
          setEmailError("Please enter a valid email address");
        } else {
          setEmailError("");
        }
      }
      if (field === "username") {
        const username = event.target.value as string;
        if (!username) {
          setUsernameError("This field is required");
        } else if (!isValidUsername(username)) {
          setUsernameError(
            "Username can only contain letters, numbers, and underscores"
          );
        } else {
          setUsernameError("");
        }
      }
      if (field === "bio") {
        const bio = event.target.value as string;
        if (bio.length > 500) {
          setBioError("Bio cannot exceed 500 characters");
        } else {
          setBioError("");
        }
      }
      setFormData({ ...formData, [field]: event.target.value });
    };

  const handleDateChange = (newValue: Dayjs | null) => {
    if (!newValue || !newValue.isValid()) {
      return;
    }
    setFormData({
      ...formData,
      dateOfBirth: newValue,
    });
  };

  const handleChangeTags = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    setInterests(tags?.filter((tag) => value.includes(tag.tag)) || []);
    setFormData({ ...formData, interests: interests });
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    const updatedUser = {
      ...formData,
      bio: formData.bio || "",
      email: formData.email.toLowerCase(),
      firstName: capitalize(formData.firstName),
      lastName: capitalize(formData.lastName),
      gender: formData.gender,
      preferences: formData.preferences,
      username: formData.username.toLowerCase(),
      location: formData.location,
      location_postal: formData.location_postal,
      dateOfBirth: formData.dateOfBirth
        ? formData.dateOfBirth
            .startOf("day")
            .add(formData.dateOfBirth.utcOffset(), "minutes")
            .toDate()
        : undefined,
    };
    updateUser(updatedUser);
    for (const tag of interests) {
      if (userTags?.includes(tag)) continue;
      else if (!userTags?.includes(tag))
        updateUserTags({ userId: formData.id, tagId: tag.id });
    }
    if (userTags) {
      for (const tag of userTags) {
        if (!interests?.some((interest) => tag.id === interest.id)) {
          deleteUserTags({ userId: formData.id, tagId: tag.id });
        }
      }
    }
    // submitPictures()
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
      setFormData({
        ...formData,
        location: { x: data.latitude, y: data.longitude },
        location_postal: data.postal,
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Card sx={{ m: 4 }}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: "center",
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
            <TextField
              label="First Name"
              value={formData.firstName}
              onChange={handleChange("firstName")}
              fullWidth
              required
            />

            <TextField
              label="Last Name"
              value={formData.lastName}
              onChange={handleChange("lastName")}
              fullWidth
              required
            />

            <TextField
              label="Username"
              value={formData.username}
              onChange={handleChange("username")}
              error={!!usernameError}
              helperText={usernameError}
              fullWidth
              required
            />

            <TextField
              error={!!emailError}
              helperText={emailError}
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange("email")}
              fullWidth
              required
            />

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Date of birth"
                value={formData.dateOfBirth}
                onChange={handleDateChange}
                format="DD/MM/YYYY"
                slotProps={{
                  textField: {
                    fullWidth: true,
                  },
                }}
              />
            </LocalizationProvider>

            <FormControl fullWidth required>
              <FormLabel id="gender">Gender</FormLabel>
              <RadioGroup
                row
                aria-labelledby="gender"
                name="gender"
                value={formData.gender}
                onChange={
                  handleChange("gender") as (
                    event: SelectChangeEvent<string>
                  ) => void
                }
              >
                <FormControlLabel
                  value="female"
                  control={<Radio />}
                  label="Female"
                />
                <FormControlLabel
                  value="male"
                  control={<Radio />}
                  label="Male"
                />
                <FormControlLabel
                  value="other"
                  control={<Radio />}
                  label="Other"
                />
              </RadioGroup>
            </FormControl>

            <FormControl fullWidth required>
              <FormLabel id="preferences">Preferences</FormLabel>
              <RadioGroup
                row
                aria-labelledby="preferences"
                name="preferences"
                value={formData.preferences}
                onChange={
                  handleChange("preferences") as (
                    event: SelectChangeEvent<string>
                  ) => void
                }
              >
                <FormControlLabel
                  value="heterosexual"
                  control={<Radio />}
                  label="Heterosexual"
                />
                <FormControlLabel
                  value="homosexual"
                  control={<Radio />}
                  label="Homosexual"
                />
                <FormControlLabel
                  value="bisexual"
                  control={<Radio />}
                  label="Bisexual"
                />
              </RadioGroup>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id="tags">Interests</InputLabel>
              <MultipleSelectChip
                items={tags}
                userTags={interests}
                handleChange={handleChangeTags}
              />
            </FormControl>
          </Stack>
          <Stack spacing={3}>
            <Typography variant="h4">Additional Info</Typography>
            <TextField
              placeholder="Add your bio here"
              value={formData.bio}
              onChange={handleChange("bio")}
              multiline
              error={!!bioError}
              helperText={bioError}
              rows={4}
              fullWidth
            />

            <Typography variant="h4">Location</Typography>
            <Button variant="contained" onClick={() => handleLocationUpdate()}>
              Locate Me!
            </Button>

            <Typography variant="h4">Pictures</Typography>
            <ProfilePictures images={images} userData={formData} />
          </Stack>
        </Box>
      </CardContent>
      <CardActions sx={{ justifyContent: "flex-end", p: 2 }}>
        <Button variant="outlined" onClick={setEditMode}>
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={!validateForm()}
          onClick={handleSubmit}
        >
          Save Changes
        </Button>
      </CardActions>
    </Card>
  );
};
