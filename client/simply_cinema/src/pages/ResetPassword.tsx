import React, { useState } from "react";
import ResponsiveAppBar from "../components/Navbar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import axios from "axios";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

const input_variant = "standard";
const input_size = "small";

const ResetPassword = ({ email }: { email: string }) => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordChange = (event: any) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event: any) => {
    setConfirmPassword(event.target.value);
  };

  const handleResetPassword = () => {
    if (password === confirmPassword) {
      const obj = {
        email: email,
        new_password: password,
      };
      axios
        .post("http://127.0.0.1:8000/reset-password", obj)
        .then(function (res) {
          if (res.data) {
            message.success("Password change successful");
            console.log("Forgot password response: ", res.data);
            navigate("/", { replace: true });
          } else {
            console.log("Failing");
            message.error("Failing");
          }
        })
        .catch(function (error) {
          console.error("Axios error", error);
        });
    } else {
      console.error("Passwords do not match");
      message.error("Passwords do not match");
    }
  };
  return (
    <div className="ForgotPassword">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <h1>Reset Password</h1>
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="outlined-basic"
            label="New Password"
            variant={input_variant}
            size={input_size}
            fullWidth
            type="password"
            onChange={handlePasswordChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="outlined-basic"
            label="Confirm New Password"
            variant={input_variant}
            size={input_size}
            fullWidth
            type="password"
            onChange={handleConfirmPasswordChange}
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" fullWidth onClick={handleResetPassword}>
            Change Password
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default ResetPassword;
