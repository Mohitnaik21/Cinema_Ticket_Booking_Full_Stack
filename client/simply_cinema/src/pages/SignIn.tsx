// SignIn.js
import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom"; // Import RouterLink
import ResponsiveAppBar from "../components/Navbar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import axios from "axios";
import { message } from "antd";
import { useUserContext } from "./UserContext";

const input_variant = "standard";
const input_size = "small";

function SignIn() {
  const { setUserDataContext } = useUserContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleSignIn = () => {
    const signInInfo = {
      email: email,
      password: password,
    };

    axios
      .post("http://127.0.0.1:8000/login", signInInfo)
      .then(function (res) {
        if (res.data && res.data.id && res.data.role) {
          // Authentication success
          message.success("Authentication successful. You have logged in!");

          // Store data in local storage
          localStorage.setItem("email", signInInfo.email);
          localStorage.setItem("userId", res.data.id);
          localStorage.setItem("userRole", res.data.role);

          // Redirect based on user role

          setTimeout(function () {
            if (res.data.role === 3) {
              window.location.href = "/admin";
            } else {
              window.location.href = "/";
            }
          }, 1500);

          console.log("Sign in response: ", res.data);
        } else {
          // Authentication failed
          console.log("Authentication failed, no account in the database!");
          message.error("Authentication failed! Please enter correct email or password.");
        }
      })
      .catch(function (error) {
        console.error("Axios error", error);
      });
  };

  return (
    <div className="SignIn">
      <ResponsiveAppBar />
      <Container maxWidth="sm">
        <Box sx={{ height: "100vh", padding: "15px 20px 0px 20px", boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)" }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <h1>Login</h1>
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="outlined-basic"
                label="Email"
                variant={input_variant}
                size={input_size}
                fullWidth
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="outlined-basic"
                label="Password"
                variant={input_variant}
                size={input_size}
                fullWidth
                type="password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <Box sx={{ marginTop: "20px" }}>
                <Link component={RouterLink} to="/forgot-password" underline="none">
                  Forgot password?
                </Link>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel control={<Checkbox size="small" />} label="Remember me for 30 days" />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" fullWidth onClick={handleSignIn}>
                Sign In
              </Button>
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "20px" }}>
                <Link component={RouterLink} to="/register" underline="none">
                  Don't have an account?
                </Link>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </div>
  );
}

export default SignIn;
