import * as React from 'react';
import {createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';

import Typography from '@mui/material/Typography';

import Link from '@mui/material/Link';
import TopLeftBar from "../user/component/TopLeftBar";



// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function DashboardWrapper({children }) {


  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />


        <TopLeftBar/>
        {children}
   


      </Box>
    </ThemeProvider>
  );
}