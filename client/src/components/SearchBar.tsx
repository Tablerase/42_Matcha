import React, { useState } from "react";
import {
  Box,
  Drawer,
  FormControl,
  Slider,
  Stack,
  TextField,
  Typography,
  Button,
  Fab,
  Zoom,
} from "@mui/material";
import { UserSearchQuery } from "@app/interfaces";
import {
  InputAdornment,
  Select,
  Chip,
  OutlinedInput,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import { useAuth } from "@/utils/authContext";
import { useFetchAllTags } from "@/pages/browse/usersActions";
import { set } from "date-fns";

interface SearchBarProps {
  searchParams: UserSearchQuery;
  onSubmit: (params: UserSearchQuery) => void;
}

const SearchBar = ({ searchParams, onSubmit }: SearchBarProps) => {
  const { userData } = useAuth();
  const { data: tags, isLoading: tagLoaded } = useFetchAllTags();
  const [inputAge, setInputAge] = useState<number[]>([18, 100]);
  const [localParams, setLocalParams] = useState<UserSearchQuery>(searchParams);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(localParams);
    setDrawerOpen(false);
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = Number(e.target.value);
    setLocalParams({
      ...localParams,
      distance: value === 0 ? 1 : value,
      latitude: userData!.location?.x,
      longitude: userData!.location?.y,
    });
  };

  const handleTagsChange = (e: SelectChangeEvent<string[]>) => {
    const value = e.target.value as string[];
    setLocalParams({ ...localParams, tags: value });
  };

  if (tagLoaded) return <div>Loading...</div>;

  return (
    <>
      <Zoom
        in={true}
        style={{
          transitionDelay: "100ms",
        }}
        unmountOnExit
      >
        <Fab
          aria-label="manage search"
          color="primary"
          onClick={() => setDrawerOpen(true)}
          style={{ position: "fixed", bottom: 16, left: 16 }}
        >
          <ManageSearchIcon />
        </Fab>
      </Zoom>
      <Drawer
        anchor="top"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
          <FormControl fullWidth sx={{ gap: 2 }}>
            <Stack
              spacing={2}
              direction="row"
              alignItems="center"
              sx={{ m: 1 }}
            >
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
                  sx={{ m: 1 }}
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

            {userData?.location === null ? (
              <TextField
                label="Allow location in your profile to filter by distance"
                value={userData.location}
                disabled
              />
            ) : (
              <TextField
                label="Distance"
                type="number"
                value={localParams.distance || ""}
                sx={{ m: 1 }}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">km</InputAdornment>
                    ),
                  },
                }}
                onChange={handleDistanceChange}
              />
            )}

            <Select
              sx={{ m: 1 }}
              multiple
              displayEmpty
              value={localParams.tags?.map((tag) => tag) || []}
              onChange={handleTagsChange}
              input={<OutlinedInput />}
              renderValue={(selected) => {
                if ((selected as string[]).length === 0) {
                  return <em>Tags</em>;
                } else
                  return (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip
                          key={value}
                          color="primary"
                          label={value}
                          onMouseDown={(event) => event.stopPropagation()}
                          onDelete={(event) => {
                            event.stopPropagation();
                            event.preventDefault();
                            const newTags = localParams.tags?.filter(
                              (tag) => tag !== value
                            );
                            setLocalParams({ ...localParams, tags: newTags });
                          }}
                        />
                      ))}
                    </Box>
                  );
              }}
            >
              <MenuItem disabled value="">
                Tags
              </MenuItem>
              {tags?.map((tag) => (
                <MenuItem key={tag.tag} value={tag.tag}>
                  {tag.tag}
                </MenuItem>
              ))}
            </Select>

            <Button type="submit" variant="contained">
              Search
            </Button>
          </FormControl>
        </Box>
      </Drawer>
    </>
  );
};

export default SearchBar;
