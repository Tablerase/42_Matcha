import React from "react";
import { Sidebar } from "@components/Sidebar";
import { Props } from "@app/interfaces";
import { Container, Box } from "@mui/material";

export const Layout: React.FC<Props> = (props) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "row-reverse" }}>
      <Sidebar />
      <Container sx={{ flexGrow: 1 }}>
        <Box component="main">{props.children}</Box>
      </Container>
    </Box>
  );
};
