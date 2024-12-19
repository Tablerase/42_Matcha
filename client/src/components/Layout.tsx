import React from "react";
import { Sidebar } from "@components/Sidebar";
import { Props } from "@utils/interfaces";
import { Container } from "@mui/material";

export const Layout: React.FC<Props> = (props) => {
  return (
    <>
      <Sidebar />
      <Container>
        <main>{props.children}</main>
      </Container>
    </>
  );
};
