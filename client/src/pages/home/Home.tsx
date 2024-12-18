import { Stack, Button, Typography, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { routes } from "@utils/routes";

export const Home = () => {
  const navigate = useNavigate();

  return (
    <Container 
      maxWidth="sm" 
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 4
      }}
    >
      <Typography variant="h2" component="h1" textAlign="center">
        Welcome to Matcha
      </Typography>
      <Stack spacing={2} direction="row">
        <Button 
          variant="outlined" 
          onClick={() => navigate(routes.LOGIN)}
        >
          Log in
        </Button>
        <Button 
          variant="outlined"
          onClick={() => navigate(routes.REGISTER)}
        >
          Sign up
        </Button>
      </Stack>
    </Container>
  );
};
