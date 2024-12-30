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
  Avatar,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import InputLabel from "@mui/material/InputLabel";
import { SelectChangeEvent } from "@mui/material/Select";
import { Tag, User } from "@/app/interfaces";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { MultipleSelectChip } from "@/components/MultipleSelectChip";
import {
  useUpdateUserProfile,
  useFetchAllTags,
  useDeleteUserTags,
} from "@pages/browse/usersActions";
import dayjs, { Dayjs } from "dayjs";
import { useAddUserTags } from "@pages/browse/usersActions";

interface FormData extends Omit<User, "dateOfBirth"> {
  dateOfBirth: Dayjs | null;
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  gender: string;
  preferences: string;
  bio: string;
  location?: { x: number; y: number };
  fameRate: number;
  lastSeen: Date;
  interests: Tag[];
}

interface EditProfileProps {
  user: Partial<User>;
  userTags?: Tag[];
  setEditMode: () => void;
}

export const EditProfile = ({
  user,
  userTags,
  setEditMode,
}: EditProfileProps) => {
  const { data: tags } = useFetchAllTags();
  const [formData, setFormData] = useState<FormData>({
    id: user.id || 0,
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.email || "",
    username: user.username || "",
    gender: user.gender || "",
    preferences: user.preferences || "bisexual",
    bio: user.bio || "",
    location: user.location,
    fameRate: user.fameRate || 0,
    lastSeen: user.lastSeen || new Date(),
    dateOfBirth: user.dateOfBirth ? dayjs(user.dateOfBirth) : null,
    interests: [],
  });

  const handleChange =
    (field: keyof FormData) =>
    (
      event:
        | React.ChangeEvent<HTMLInputElement | { value: unknown }>
        | SelectChangeEvent
    ) => {
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

  const [interests, setInterests] = useState<Tag[]>(userTags || []);
  // const [preferences, setPreferences] = useState<string[]>([]);

  const handleChangeTags = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    setInterests(tags?.filter((tag) => value.includes(tag.tag)) || []);
    setFormData({ ...formData, interests: interests });
  };

  // const preferences = [{id: 1, tag: "homosexual"}, {id: 2, tag: "heterosexual"}, {id: 3, tag: "bisexual"}];

  const updateUser = useUpdateUserProfile();
  const updateUserTags = useAddUserTags();
  const deleteUserTags = useDeleteUserTags();

  const handleSubmit = async () => {
    const updatedUser = {
      ...formData,
      bio: formData.bio || "",
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      gender: formData.gender,
      username: formData.username,
      dateOfBirth: formData.dateOfBirth
        ? formData.dateOfBirth.toDate()
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
    setEditMode();
  };

  // TODO: geolocation

  // if ("geolocation" in navigator) {
  //   // Prompt user for permission to access their location
  //   navigator.geolocation.getCurrentPosition(
  //     // Success callback function
  //     (position) => {
  //       // Get the user's latitude and longitude coordinates
  //       const lat = position.coords.latitude;
  //       const lng = position.coords.longitude;

  //       // Do something with the location data, e.g. display on a map
  //       console.log(`Latitude: ${lat}, longitude: ${lng}`);
  //     },
  //     // Error callback function
  //     (error) => {
  //       // Handle errors, e.g. user denied location sharing permissions
  //       console.error("Error getting user location:", error);
  //     }
  //   );
  // } else {
  //   // Geolocation is not supported by the browser
  //   console.error("Geolocation is not supported by this browser.");
  // }

  return (
    <Card sx={{ maxWidth: 600, margin: "auto", mt: 4 }}>
      <CardContent>
        <Stack spacing={3}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              sx={{ width: 100, height: 100 }}
              // src={user.profilePicture}
            />
            <Button variant="outlined" startIcon={<EditRoundedIcon />}>
              Change Photo
            </Button>
          </Box>
          <TextField
            label="Bio"
            value={formData.bio}
            onChange={handleChange("bio")}
            multiline
            rows={4}
            fullWidth
          />
          <TextField
            label="First Name"
            value={formData.firstName}
            onChange={handleChange("firstName")}
            fullWidth
          />

          <TextField
            label="Last Name"
            value={formData.lastName}
            onChange={handleChange("lastName")}
            fullWidth
          />

          <TextField
            label="Username"
            value={formData.username}
            onChange={handleChange("username")}
            fullWidth
          />

          <TextField
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleChange("email")}
            fullWidth
          />

          <FormControl fullWidth>
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
              <FormControlLabel value="male" control={<Radio />} label="Male" />
              <FormControlLabel
                value="other"
                control={<Radio />}
                label="Other"
              />
            </RadioGroup>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Preferences</InputLabel>
            {/* <MultipleSelectChip items={preferences}  handleChange={handleChangeTags}/> */}
          </FormControl>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Date of birth"
              value={formData.dateOfBirth}
              onChange={handleDateChange}
              format="DD/MM/YYYY"
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !formData.dateOfBirth,
                },
              }}
            />
          </LocalizationProvider>
          {/* TODO: add proper location logic with parsing and setting coordinates */}
          <TextField label="Location" fullWidth />

          <FormControl fullWidth>
            <InputLabel id="tags">Interests</InputLabel>
            <MultipleSelectChip
              items={tags}
              userTags={interests}
              handleChange={handleChangeTags}
            />
          </FormControl>
        </Stack>
      </CardContent>
      <CardActions sx={{ justifyContent: "flex-end", p: 2 }}>
        <Button variant="outlined" onClick={setEditMode}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          Save Changes
        </Button>
      </CardActions>
    </Card>
  );
};
