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
  Typography,
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
import { getIpData, isValidUsername } from "@/utils/helpers";
import { EditProfileProps, FormData } from "@/app/interfaces";
import { isValidEmail } from "@/utils/helpers";
import { MuiFileInput } from 'mui-file-input'
import { useUploadImage } from "@pages/browse/usersActions";

export const EditProfile = ({
  user,
  userTags,
  setEditMode,
}: EditProfileProps) => {
  const { data: tags } = useFetchAllTags();
  const updateUser = useUpdateUserProfile();
  const updateUserTags = useAddUserTags();
  const deleteUserTags = useDeleteUserTags();
  const uploadImage = useUploadImage();
  
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
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      gender: formData.gender,
      preferences: formData.preferences,
      username: formData.username,
      location: formData.location,
      location_postal: formData.location_postal,
      dateOfBirth: formData.dateOfBirth
        ? formData.dateOfBirth
            .startOf("day")
            .add(formData.dateOfBirth.utcOffset(), "minutes")
            .toDate()
        : undefined,
    };
    console.log(updatedUser);
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

  const [file, setFile] = useState<File | null>(null)

  const handleFileUpload = (newFile: File | null) => {
    setFile(newFile);
    
    if (!newFile) {
      return;
    }
  
    // Validate file size (max 5MB)
    if (newFile.size > 5 * 1024 * 1024) {
      console.error('File too large');
      return;
    }
  
    const reader = new FileReader();
    
    reader.onload = () => {
      const result = reader.result as string;
      uploadImage({ userId: formData.id, url: result });
    };
  
    reader.onerror = () => {
      console.error('Error reading file');
    };
  
    try {
      reader.readAsDataURL(newFile);
    } catch (error) {
      console.error('Failed to read file:', error);
    }
  };

  return (
    <Card sx={{ maxWidth: 600, margin: "auto", mt: 4 }}>
      <CardContent>
        <Stack spacing={3}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              sx={{ width: 100, height: 100 }}
              // src={user.profilePicture}
            />
             <MuiFileInput 
             value={file} 
             onChange={handleFileUpload}
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
            error={!!bioError}
            helperText={bioError}
            rows={4}
            fullWidth
          />
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
              <FormControlLabel value="male" control={<Radio />} label="Male" />
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

          <Typography>Location:</Typography>
          <Button variant="contained" onClick={() => handleLocationUpdate()}>
            Locate Me!
          </Button>

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
