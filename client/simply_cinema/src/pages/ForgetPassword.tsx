import React, { useState } from "react";
import ResponsiveAppBar from "../components/Navbar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import axios from "axios";
import ResetPassword from "./ResetPassword";
import { message } from "antd";

const input_variant = "standard";
const input_size = "small";

function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationCodeSent, setVerificationCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const handleResetPassword = () => {
    if (email.length > 0) {
      const emailObj = {
        email: email,
      };
      axios
        .post("http://127.0.0.1:8000/forgot-password", emailObj)
        .then(function (res) {
          if (res.data) {
            // Authentication success
            setVerificationCodeSent(true);
            message.success("Verification code sent to email! Check your inbox to verify and reset password.");
            console.log("Forgot password response: ", res.data);
          } else {
            // Authentication failed
            console.log("Failing");
            message.error("Failing");
          }
        })
        .catch(function (error) {
          console.error("Axios error", error);
        });
      console.log("Sending password reset email...");
    }
  };

  const handleVerifyCode = () => {
    if (email.length > 0) {
      const verificationObj = {
        email: email,
        code: verificationCode,
      };
      axios
        .post("http://127.0.0.1:8000/verify-reset-password", verificationObj)
        .then(function (res) {
          if (res.data) {
            // setVerificationCodeSent(true);

            console.log("Verify reset password response: ", res.data);
            if (res.data.result === true) {
              message.success("Successfully verified code!");
              setIsVerified(true);
              //   setTimeout(function () {
              //     window.location.href = "/reset-password/";
              //   }, 1000);
            } else {
              console.log("Failed to verify code for password reset");
              message.error("Failed to verify code for password reset");
            }
          }
        })
        .catch(function (error) {
          console.error("Axios error", error);
        });
    }
  };

  return (
    <div className="ForgotPassword">
      <ResponsiveAppBar />
      <Container maxWidth="sm">
        <Box sx={{ height: "100vh", padding: "15px 20px 0px 20px", boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)" }}>
          {!isVerified && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <h1>Forgot Password</h1>
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
                <Button variant="contained" fullWidth onClick={handleResetPassword}>
                  Reset Password
                </Button>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="verificationCode"
                  label="Verification Code"
                  fullWidth
                  disabled={!verificationCodeSent}
                  onChange={(e) => setVerificationCode(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" fullWidth onClick={handleVerifyCode} disabled={!verificationCodeSent}>
                  Verify Code
                </Button>
              </Grid>
            </Grid>
          )}
          {isVerified && <ResetPassword email={email} />}
        </Box>
      </Container>
    </div>
  );
}

export default ForgetPassword;
