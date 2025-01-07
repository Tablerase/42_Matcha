import { createTheme } from "@mui/material";
import { deepPurple, lightGreen } from "@mui/material/colors";

// const lightGreen = '#d6e2a4';
// const lightPurple = '#b0a4e2'
export const tagChipColors = [
  '#FFDDE1', // pale pink
  '#DFF5E1', // soft pale green
  '#D0F0FD', // light sky blue
  '#E9D8F3', // soft plum
  '#FDF6D8', // pale khaki
  '#F8F8FF', // pale lavender
  '#FFE3D9', // soft salmon
  '#E6FBE9', // very light green
  '#E6F7E1', // pale lime green
  '#D6F0D8', // soft medium sea green
  '#CFECE3', // pale sea green
  '#E0F5F0', // pale aquamarine
  '#E8F5E8', // very pale dark sea green
  '#DFF6F3', // light seafoam green
  '#DAF2E0', // very soft forest green
  '#F0FFDD', // pale chartreuse
  '#E2F9EB', // soft spring green
  '#E3FEEA', // very pale spring green
  '#F3FFDE', // pale green yellow
  '#E9EDE5', // soft dark olive green
  '#EFF6DA', // pale yellow green
  '#E6EDD8', // soft olive drab
  '#F2F9E8', // soft and muted green
  '#EAF4F8', // pale blue
  '#FFF6DB', // pale gold
  '#F6EBF6', // soft thistle
  '#FFD9E6', // soft hot pink
  '#FDF2E5', // pale wheat
];

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
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true, // doesn't have effect on sidebar ?
        disableTouchRipple: true, // doesn't have effect on sidebar ?
      },
    },
    MuiButton: {
      defaultProps: {
        disableRipple: true, // doesn't have effect on sidebar ?
      },
      styleOverrides: {
        root: {
          borderRadius: "20px", // Rounded button edges for a softer look
          padding: "10px 20px",
          boxShadow: "none",
        },
        contained: {
          boxShadow: "none",
        },
        outlined: {
          boxShadow: "none",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {},
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {},
      },
    },
  //   MuiListItemButton: {
  //     defaultProps: {
  //       disableRipple: true,
  //       disableTouchRipple: true
  //     },
  // }
  // MuiInputLabel: {
  //   styleOverrides: {
  //     root: {
  //       color: 'red'
  //     }
  //   }
  // }
  }
});
