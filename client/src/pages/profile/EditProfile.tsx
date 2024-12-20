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
import { User } from "@/app/interfaces";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { MultipleSelectChip } from "@/components/MultipleSelectChip";

interface FormData extends Omit<User, "dateOfBirth"> {
  dateOfBirth: Date | null;
}

export const EditProfile = (user: User) => {
  const [formData, setFormData] = useState<FormData>({
    id: 0,
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
    bio: "",
    dateOfBirth: null,
    location: { x: 0, y: 0 },
    lastSeen: new Date(),
    username: "",
    preferences: "",
    fameRate: 0,
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

  const handleDateChange = (date: Date | null) => {
    setFormData({ ...formData, dateOfBirth: date });
  };

  // for interests tags + preferences
  const [personName, setPersonName] = useState<string[]>([]);

  const handleChangeTags = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
    setPersonName(typeof value === "string" ? value.split(",") : value);
  };

  // TODO: fetch from the backend
  const items = ["wine", "games", "sport", "travel"];

  const preferences = ["homosexual", "heterosexual", "bisexual"];

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
            value={formData!.bio}
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
            <MultipleSelectChip {...preferences} />
          </FormControl>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Date of birth"
              onChange={() => handleDateChange}
            />
          </LocalizationProvider>
          {/* TODO: add proper location logic with parsing and setting coordinates */}
          <TextField label="Location" fullWidth />

          <FormControl fullWidth>
            <InputLabel id="tags">Interests</InputLabel>
            <MultipleSelectChip {...items} />
          </FormControl>
        </Stack>
      </CardContent>
      <CardActions sx={{ justifyContent: "flex-end", p: 2 }}>
        <Button variant="outlined">Cancel</Button>
        <Button variant="contained">Save Changes</Button>
      </CardActions>
    </Card>
  );
};
