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
  FormControl,
} from "@mui/material";
import { MuiFileInput } from "mui-file-input";
import { useState } from "react";
import { useUploadImage } from "@/pages/browse/usersActions";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import {
  useUpdateImageStatus,
  useDeleteImage,
} from "@/pages/browse/usersActions";

interface ProfilePicturesProps {
  images?: Image[];
  userData?: FormData;
  editMode?: boolean;
}
const MAX_FILE_SIZE = 1 * 1024 * 1024;

export const ProfilePictures = ({
  images,
  userData,
  editMode = true,
}: ProfilePicturesProps) => {
  const uploadImage = useUploadImage();
  const updateImageStatus = useUpdateImageStatus();
  const deleteImage = useDeleteImage();

  const [files, setFiles] = useState<File[]>([]);
  const [filesError, setFilesError] = useState("");
  const [selectedProfilePic, setSelectedProfilePic] = useState<number | null>(
    images?.find((img) => img.isProfilePic)?.id || null
  );

  const handleFileUpload = (newFiles: File[]) => {
    if (!newFiles || !newFiles.length) {
      setFiles([]);
      return;
    }
    if (newFiles.length + (images?.length || 0) > 5) {
      setFilesError("You can  upload up to 5 images only");
      return;
    }
    const validFiles = newFiles.filter((file) => {
      if (file.size > MAX_FILE_SIZE) {
        const oversizedFiles = newFiles.filter(file => file.size > MAX_FILE_SIZE);
        setFilesError(`Files must be less than 1MB. These files exceed the limit: ${
          oversizedFiles.map(f => f.name).join(', ')
        }`);
        return false;
      }
      else if (!file.type.startsWith("image/")) {
        const nonImageFiles = newFiles.filter(file => !file.type.startsWith("image/"));
        setFilesError(`Only images are allowed. These files have the wrong format: ${
          nonImageFiles.map(f => f.name).join(', ')
          }`);
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

  const handleProfilePicChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    currentImageId?: number
  ) => {
    const newSelectedId = Number(e.target.value);
    setSelectedProfilePic(newSelectedId);
    
    // Update all images
    images?.forEach((image) => {
      updateImageStatus({
        userId: userData!.id,
        id: image.id,
        isProfilePic: image.id === newSelectedId
      });
    });
  };

  return (
    <>
      {!editMode && (
        <>
          <Avatar
            sx={{ width: 100, height: 100 }}
            src={images && images.filter(image => image.isProfilePic)[0]?.url || ""}
          />
          <AvatarGroup spacing={1}>
            {images &&
              images.length > 1 &&
              images
                .filter((image) => !image.isProfilePic)
                .map((image) => (
                  <Avatar
                    key={image.id}
                    sx={{ width: 80, height: 80 }}
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

          {images && images.length > 0 && (
            <Box sx={{ border: "1px solid #ccc", borderRadius: 1, p: 2 }}>
              <Typography>Select profile picture</Typography>
              <Divider />
              <Box sx={{ alignItems: "center" }}>
                <Box sx={{ display: "flex", gap: 2 }}>
                  {images.map((image) => (
                    <>
                      <Stack>
                        <FormControl>
                          <RadioGroup
                            value={selectedProfilePic}
                            onChange={(e) => handleProfilePicChange(e, image!.id)}
                          >
                            <Badge
                              overlap="circular"
                              anchorOrigin={{
                                vertical: "top",
                                horizontal: "right",
                              }}
                              badgeContent={<DeleteForeverIcon />}
                              onClick={() => {
                                deleteImage({
                                  userId: userData!.id,
                                  id: image.id,
                                });
                              }}
                            >
                              <Avatar
                                key={image.id}
                                sx={{ width: 80, height: 80 }}
                                src={image.url}
                              />
                            </Badge>
                            <Radio
                              disableRipple
                              value={image.id}
                              checked={selectedProfilePic === image.id}
                            />
                          </RadioGroup>
                        </FormControl>
                      </Stack>
                    </>
                  ))}
                </Box>
              </Box>
            </Box>
          )}
        </Stack>
      )}
    </>
  );
};
