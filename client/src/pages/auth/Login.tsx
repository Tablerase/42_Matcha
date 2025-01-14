import { Link, Typography, Box, Container, Paper } from "@mui/material";
import { theme } from "@components/theme";
import { LoginForm } from "@/components/LoginForm";
import { routes } from "@/utils/routes";

export const Login = () => {
  return (
    <Container maxWidth="xs" sx={{ paddingTop: theme.spacing(8) }}>
      <Paper
        elevation={2}
        sx={{
          p: theme.spacing(4),
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: 2,
          bgcolor: "background.paper",
        }}
      >
        <Typography
          component="h1"
          variant="h4"
          sx={{
            mb: theme.spacing(4),
            color: "primary.main",
            fontWeight: "bold",
          }}
        >
          Sign In
        </Typography>

        <LoginForm />

        <Box sx={{ mt: theme.spacing(3) }}>
          <Typography
            variant="body2"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            Don't have an account?
            <Link href={routes.REGISTER} color="primary" underline="hover">
              Sign up
            </Link>
          </Typography>
          <Typography
            variant="body2"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            Forgot password?
            <Link href="#" color="primary" underline="hover">
              Click here
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};
