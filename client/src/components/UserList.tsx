import { Grid } from "@mui/material";
import { PublicUser } from "@app/interfaces";
import { UserCard } from "./UserCard";

export const UserList = ({ users }: { users: PublicUser[] }) => {
  return (
    <Grid container spacing={2} sx={{ padding: 2 }}>
      {users.map((user) => (
        <Grid item key={user.id} xs={12} sm={6} md={4} lg={3}>
          <UserCard user={user} />
        </Grid>
      ))}
    </Grid>
  );
};
