import { createTheme } from "@mui/material";
import { deepPurple, lightGreen } from "@mui/material/colors";

// const lightGreen = '#d6e2a4';
// const lightPurple = '#b0a4e2'

const palette = {
  primary: {
    main: deepPurple[100], // Light matcha green
    light: "#D8E8D4", // Lighter matcha shade for hover and accents
    dark: "#7A9A6E", // Darker matcha for deeper elements
  },
  secondary: {
    main: deepPurple[200], // Subtle matcha green for secondary actions or buttons
  },
  background: {
    default: lightGreen[100], // Light background for a calm aesthetic
    paper: "#FFFFFF", // Clean white for card elements and containers
  },
  text: {
    primary: "#333333", // Darker text for readability
    secondary: "#757575", // Lighter grey text for secondary information
  },
  action: {
    hover: "#D8E8D4", // Subtle green hover effect for buttons and links
    selected: "#A4D6A7", // Green selection for interactive elements
  },
};

export const theme = createTheme({
  palette: { ...palette },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  typography: {
    allVariants: {
      color: palette.text.primary,
    },
    h1: {
      fontFamily: "Fasthand, sans-serif",
      fontSize: "3rem",
      fontWeight: 600,
      color: palette.text.primary,
    },
    h5: {
      fontFamily: "Roboto Slab, serif",
      fontWeight: 500,
      fontSize: "1.5rem",
    },
    body2: {
      fontFamily: "Roboto, sans-serif",
      fontWeight: 400,
      fontSize: "1rem",
    },
    button: {
      fontFamily: "Roboto, sans-serif",
      fontWeight: 600,
      textTransform: "none",
      fontSize: "1rem",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
              body {
                background-color: ${palette.background.default};
                word-break: break-word;
              }
            `,
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "20px", // Rounded button edges for a softer look
          padding: "10px 20px",
          boxShadow: "none",
          // '&:hover': {
          //   backgroundColor: '#A4D6A7', // Subtle green hover effect
          //   color: '#FFFFFF',
          //   transition: 'color 0.3s ease-in-out',
          // },
        },
        contained: {
          boxShadow: "none",
          // '&:hover': {
          //   color: '#FFFFFF',
          // },
        },
        outlined: {
          boxShadow: "none",
          // '&:hover': {
          //   color: '#FFFFFF',
          // },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "12px", // Soft rounded edges for cards and paper elements
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Light shadow for depth
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiInputBase-root": {
            borderRadius: "8px", // Rounded corners for input fields
            backgroundColor: "#F4F9F4", // Subtle background for input fields
          },
        },
      },
    },
  },
});
