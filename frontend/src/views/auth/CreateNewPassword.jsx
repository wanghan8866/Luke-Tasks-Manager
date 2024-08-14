import { useState, useEffect } from "react";
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate, useSearchParams } from "react-router-dom";
import apiInstance from "../../utils/axios";

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function CreateNewPassword() {
    
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate();
    const [searchParam] = useSearchParams();

    const otp = searchParam.get("otp");
    const uuidb64 = searchParam.get("uuidb64");
    const refresh_token = searchParam.get("refresh_token");



  const handleSubmit = async (event) => {
    setIsLoading(true);
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
        password: data.get('password'),
      password2: data.get('password2'),
    });
    const password = data.get('password');
    const password2 = data.get('password');

    if (password2 !== password) {
        alert("Passwords does not match!");
        return;
      } else {
        const formdata = new FormData();
        formdata.append("password", password);
        formdata.append("otp", otp);
        formdata.append("uuidb64", uuidb64);
        formdata.append("refresh_token", refresh_token);
  
        try {
          await apiInstance
            .post(`user/password-change/`, formdata)
            .then((res) => {
              console.log(res.data);
            //   alert()
              setIsLoading(false);
              navigate("/login/");
              alert(res.data.Message)
            });
        } catch (error) {
          console.log(error);
          setIsLoading(false);
        }
      }

  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="New Password"
              type="password"
              id="password"

            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password2"
              label="Conform Password"
              type="password"
              id="password2"
    
            />

            {!isLoading &&
            ( <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In <i className="fas fa-user-plus"></i>
              </Button>

            )}
            {isLoading &&
            ( <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Processing <i className="fas fa-spinner fa-spin"></i>
              </Button>

            )}
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}