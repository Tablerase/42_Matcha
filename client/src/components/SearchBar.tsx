import { UserSearchQuery } from "@app/interfaces";
import {
  Box,
  TextField,
  FormControl,
  Button,
  Slider,
  Stack,
  Typography,
} from "@mui/material";
import { useContext, useState } from "react";
import { useAuth } from "@/utils/authContext";

interface SearchBarProps {
  searchParams: UserSearchQuery;
  onSubmit: (params: UserSearchQuery) => void;
}

const SearchBar = ({ searchParams, onSubmit }: SearchBarProps) => {
  const { userData } = useAuth();
  const [inputAge, setInputAge] = useState<number[]>([18, 100]);
  const [localParams, setLocalParams] = useState<UserSearchQuery>(searchParams);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(localParams);
  };

  const handleAgeSlider = (
    e: Event,
    newValue: number | number[],
    activeThumb: number
  ) => {
    setInputAge(newValue as number[]);
    if (typeof newValue !== "object") return;
    localParams.ageMin = newValue[0];
    localParams.ageMax = newValue[1];
    setLocalParams({ ...localParams });
  };

  const handleDistanceChange = (
    e: Event,
    newValue: number | number[],
    activeThumb: number
  ) => {
    setLocalParams({ ...localParams, distance: Number(newValue) });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
      <FormControl fullWidth sx={{ gap: 2 }}>
        <Stack spacing={2} direction="row" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ minWidth: 80 }}>
            Age Filter
          </Typography>
          {userData?.dateOfBirth ? (
            <Slider
              getAriaLabel={() => "Age Range"}
              valueLabelDisplay="on"
              value={[inputAge[0], inputAge[1]]}
              onChange={handleAgeSlider}
              min={18}
              marks={[
                {
                  value:
                    new Date().getFullYear() -
                    new Date(userData!.dateOfBirth).getFullYear(),
                  label: "Me",
                },
              ]}
              disableSwap
            />
          ) : (
            <Slider
              getAriaLabel={() => "Age Range"}
              valueLabelDisplay="on"
              value={[inputAge[0], inputAge[1]]}
              onChange={handleAgeSlider}
              min={18}
              marks={[
                { value: 18, label: "18" },
                { value: 100, label: "100" },
              ]}
              disableSwap
            />
          )}
        </Stack>

        {/* <Stack spacing={2} direction="row" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ minWidth: 80 }}>
            Distance (km)
          </Typography>
          <Slider
            getAriaLabel={() => "Distance"}
            valueLabelDisplay="on"
            value={localParams.distance || 0}
            onChange={handleDistanceChange}
            min={1}
            max={100}
          ></Slider>
        </Stack> */}

        <TextField
          label="Distance (km)"
          type="number"
          value={localParams.distance || ""}
          onChange={(e) =>
            setLocalParams({ ...localParams, distance: Number(e.target.value) })
          }
        />

        <Button type="submit" variant="contained">
          Search
        </Button>
      </FormControl>
    </Box>
  );
};

export default SearchBar;
