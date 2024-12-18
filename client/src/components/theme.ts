import { createTheme } from '@mui/material';
import { blue, green, red } from '@mui/material/colors';

export const theme = createTheme({
  palette: {
    primary: {
      main: red[500],
      light: blue[500],
    },
    secondary: {
      main: green[500],
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 1163,
      md: 1163,
      lg: 1200,
      xl: 1536,
    },
  },
  typography: {
    allVariants: {},
    h1: {
      fontFamily: 'Fasthand',
      fontSize: '3rem',
    },
    h5: {
      fontFamily: 'Roboto Slab',
    },
    body2: {
      fontFamily: 'Roboto',
    },
  },
  components: {
  },
});