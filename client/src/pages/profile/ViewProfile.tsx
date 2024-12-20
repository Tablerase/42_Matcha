import { User } from "@app/interfaces"
import Button from "@mui/material/Button"
import { useNavigate } from "react-router-dom";
import { EditProfile } from "./EditProfile";

export const ViewProfile = (user: User) => {
  return (
    <>
    <h1>View Profile</h1>
    <Button>Edit Profile</Button>
    {/* <EditProfile/> */}
    </>
  );
};
