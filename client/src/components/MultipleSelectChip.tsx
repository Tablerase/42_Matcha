import { useState } from "react";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import CheckBox from "@mui/material/Checkbox";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import { SelectChangeEvent } from "@mui/material/Select";
import { Tag } from "@/app/interfaces";

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

interface MultipleSelectChipProps {
  items?: Tag[];
  userTags?: Tag[];
  handleChange: (event: SelectChangeEvent<string[]>) => void;
}

function isTagInBothArrays(tag: string, array1?: Tag[], array2?: Tag[]) {
  // Check if the tag exists in both arrays
  if (!array1 || !array2) return ;
  const isInArray1 = array1.some(item => item.tag === tag);
  const isInArray2 = array2.some(item => item.tag === tag);

  return isInArray1 && isInArray2;
}

export const MultipleSelectChip = ({items, userTags, handleChange}: MultipleSelectChipProps) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const onSelectChange = (event: SelectChangeEvent<string[]>) => {
    const newSelected = event.target.value as string[];
    setSelectedItems(newSelected);
    handleChange(event);
  };
  const tagsArr = userTags?.map((tag) => tag.tag) || [];
  return (
    <>
      <Select
        labelId="Interests"
        id="Interests"
        multiple
        value={tagsArr}
        onChange={onSelectChange}
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
        {items?.map((item) => (
          <MenuItem key={item.id} value={item.tag}>
            <CheckBox checked={isTagInBothArrays(item.tag, items, userTags)} />
            <ListItemText primary={item.tag} />
          </MenuItem>
        ))}
      </Select>
    </>
  );
};
