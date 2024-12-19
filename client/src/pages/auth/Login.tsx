import React, { useState } from "react";
import { TextField, Button, Typography, Box, Container } from "@mui/material";
import { theme } from "@components/theme";
import { useLoginUser } from "./authActions";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { mutate: login } = useLoginUser(username, password);
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Login submitted with:", { username, password });
    login({ username, password });
  };

  return (
    <Container maxWidth="xs" sx={{ paddingTop: "5rem" }}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        // TODO: create a box for the form
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#FFFFFF",
        }}
      >
        <Typography
          variant="h4"
          sx={{ marginBottom: "2rem", color: theme.palette.primary.main }}
        >
          Welcome Back
        </Typography>
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" variant="contained" fullWidth>
          Login
        </Button>
        <Typography variant="body2">
          Don't have an account?
          <Button>Sign up</Button>
        </Typography>
      </Box>
    </Container>
  );
};
