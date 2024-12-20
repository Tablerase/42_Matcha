import { useState } from "react";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import CheckBox from "@mui/material/Checkbox";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";

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

//TODO: also should take handleChange handler as props
export const MultipleSelectChip = (items: string[]) => {
  const [choice, setChoice] = useState<string[]>([]);

  // const handleChange = (event: SelectChangeEvent<typeof choice>) => {
  //   const {
  //     target: { value },
  //   } = event;
  //   setChoice(
  //     // On autofill we get a stringified value.
  //     typeof value === "string" ? value.split(",") : value
  //   );
  // };

  return (
    <>
      <Select
      // pass label as a prop!
        labelId="Interests"
        id="Interests"
        multiple
        value={choice}
        // onChange={handleChange}
        input={<OutlinedInput id="select-multiple-chip" label="Interests" />}
        renderValue={(selected) => (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {selected.map((value) => (
              <Chip key={value} label={value} />
            ))}
          </Box>
        )}
        MenuProps={MenuProps}
      >
        {Object.values(items).map((item) => (
          <MenuItem key={item} value={item}>
            <CheckBox checked={choice.includes(item)} />
            <ListItemText primary={item} />
          </MenuItem>
        ))}
      </Select>
    </>
  );
};
