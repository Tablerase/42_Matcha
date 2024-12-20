import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Stack from "@mui/material/Stack";
import Select from "@mui/material/Select";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import { useState } from "react";
import { MenuItem, CardContent, TextField, Avatar } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import CheckBox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import InputLabel from "@mui/material/InputLabel";
import Chip from "@mui/material/Chip";
import OutlinedInput from "@mui/material/OutlinedInput";
import { SelectChangeEvent } from "@mui/material/Select";
import { User } from "@/app/interfaces";
import EditRoundedIcon from "@mui/icons-material/EditRounded";

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

  // for interests tags
  const [personName, setPersonName] = useState<string[]>([]);

  const handleChangeTags = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      typeof value === "string" ? value.split(",") : value
    );
  };
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const names = [
    "Oliver Hansen",
    "Van Henry",
    "April Tucker",
    "Ralph Hubbard",
    "Omar Alexander",
    "Carlos Abbott",
    "Miriam Wagner",
    "Bradley Wilkerson",
    "Virginia Andrews",
    "Kelly Snyder",
  ];

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
            <InputLabel>Gender</InputLabel>
            <Select
              value={formData.gender}
              onChange={
                handleChange("gender") as (
                  event: SelectChangeEvent<string>
                ) => void
              }
              label="Gender"
            >
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Preferences</InputLabel>
            <Select
              value={formData!.preferences}
              onChange={handleChange("preferences")}
              label="Preferences"
            >
              <MenuItem value="heterosexual">Heterosexual</MenuItem>
              <MenuItem value="homosexual">Homosexual</MenuItem>
              <MenuItem value="bisexual">Bisexual</MenuItem>
            </Select>
          </FormControl>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Date of birth"
              onChange={() => handleDateChange}
            />
          </LocalizationProvider>
            {/* TODO: add proper location logic with parsing and setting coordinates */}
          <TextField
            label="Location"
            fullWidth
          />

          <FormControl fullWidth>
            <InputLabel id="tags">Interests</InputLabel>
            <Select
              labelId="Interests"
              id="Interests"
              multiple
              value={personName}
              onChange={handleChangeTags}
              input={
                <OutlinedInput id="select-multiple-chip" label="Interests" />
              }
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {names.map((name) => (
                <MenuItem key={name} value={name}>
                  <CheckBox checked={personName.includes(name)} />
                  <ListItemText primary={name} />
                </MenuItem>
              ))}
            </Select>
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
