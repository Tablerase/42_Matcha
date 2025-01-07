import { Image, FormData } from "@/app/interfaces";
import {
  Avatar,
  AvatarGroup,
  Box,
  Checkbox,
  Divider,
  Radio,
  RadioGroup,
  Stack,
  Typography,
  Badge,
} from "@mui/material";
import { MuiFileInput } from "mui-file-input";
import { useState } from "react";
import { useUploadImage } from "@/pages/browse/usersActions";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

interface ProfilePicturesProps {
  images?: Image[];
  userData?: FormData;
  editMode?: boolean;
}

export const ProfilePictures = ({
  images,
  userData,
  editMode = true,
}: ProfilePicturesProps) => {
  const uploadImage = useUploadImage();
  const [files, setFiles] = useState<File[]>([]);
  const [filesError, setFilesError] = useState("");

  const handleFileUpload = (newFiles: File[]) => {
    if (!newFiles || !newFiles.length) {
      setFiles([]);
      return;
    }

    // Validate files
    const validFiles = newFiles.filter((file) => {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setFilesError("Selected file size is too large");
        return false;
      }
      // Validate file type
      else if (!file.type.startsWith("image/")) {
        setFilesError("Selected file is not an image");
        return false;
      } else {
        setFilesError("");
      }

      return true;
    });

    setFiles(validFiles);

    // Process each valid file
    validFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        const result = reader.result as string;
        uploadImage({
          userId: userData!.id,
          url: result,
        });
      };

      reader.onerror = () => {
        console.error(`Error reading file ${file.name}`);
      };

      try {
        reader.readAsDataURL(file);
      } catch (error) {
        console.error(`Failed to read file ${file.name}:`, error);
      }
    });
  };

  return (
    <>
      {!editMode && (
        <>
          <Avatar
            sx={{ width: 100, height: 100 }}
            src={images ? images[0]?.url : " "}
          />
          <AvatarGroup spacing={1}>
            {images &&
              images.length > 1 &&
              images
                .filter((image) => !image.isProfilePic)
                .map((image, id) => (
                  <Avatar
                    key={id}
                    sx={{ width: 40, height: 40 }}
                    src={image.url}
                  />
                ))}
          </AvatarGroup>
        </>
      )}
      {editMode && (
        <Stack spacing={3}>
          {images && images?.length < 5 && (
            <MuiFileInput
              value={files}
              onChange={handleFileUpload}
              multiple
              slotProps={{
                htmlInput: {
                  accept: "image/*",
                },
              }}
              placeholder="Click here to upload pictures"
              error={!!filesError}
              helperText={filesError}
            />
          )}

          {images && images.length > 0 && (<Box sx={{ border: "1px solid #ccc", borderRadius: 1, p: 2 }}>
            <Typography>Select profile picture</Typography>
            <Divider />
            <Box sx={{ alignItems: "center" }}>
              <Box sx={{ display: "flex", gap: 2 }}>
                {
                  images.map((image, id) => (
                    <>
                      <Stack>
                        <RadioGroup>
                          <Badge
                            overlap="circular"
                            anchorOrigin={{
                              vertical: "top",
                              horizontal: "right",
                            }}
                            badgeContent={<DeleteForeverIcon />}
                          >
                            <Avatar
                              key={id}
                              sx={{ width: 80, height: 80 }}
                              src={image.url}
                            />
                          </Badge>
                          <Radio disableRipple />
                        </RadioGroup>
                      </Stack>
                    </>
                  ))}
              </Box>
            </Box>
          </Box>)}
        </Stack>
      )}
    </>
  );
};
