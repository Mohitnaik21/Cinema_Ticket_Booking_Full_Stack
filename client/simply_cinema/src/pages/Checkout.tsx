// Install necessary dependencies if not installed
// npm install @mui/material @emotion/react @emotion/styled

import React, { useState } from "react";
import {
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";

// interface CheckoutFormProps {
//   onSubmit: (data: CheckoutFormData) => void;
// }

interface CheckoutFormProps {
  onSubmit: (checkoutData: any, paymentData: any) => void;
}

const Checkout: React.FC<any> = ({ onSubmit }) => {
  const [checkoutFormData, setCheckoutFormData] = useState<any>({
    firstName: "",
    lastName: "",
    email: "",
    country: "",
    address: "",
  });

  const [paymentFormData, setPaymentFormData] = useState<any>({
    cardNumber: "",
    expirationDate: "",
    cvv: "",
    cardholderName: "",
  });

  return (
    <Container maxWidth="md" style={{ marginTop: "40px" }}>
      <Paper elevation={3} style={{ padding: "20px" }}>
        <Typography variant="h5" gutterBottom>
          Checkout Form
        </Typography>
        <form>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField required fullWidth label="First Name" name="firstName" value={checkoutFormData.firstName} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField required fullWidth label="Last Name" name="lastName" value={checkoutFormData.lastName} />
            </Grid>
            <Grid item xs={12}>
              <TextField required fullWidth label="Email" name="email" type="email" value={checkoutFormData.email} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Country</InputLabel>
                <Select label="Country" name="country" value={checkoutFormData.country}>
                  <MenuItem value="us">United States</MenuItem>
                  <MenuItem value="ca">Canada</MenuItem>
                  {/* Add more countries as needed */}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField required fullWidth label="Address" name="address" value={checkoutFormData.address} />
            </Grid>
          </Grid>

          <Typography variant="h6" gutterBottom style={{ marginTop: "20px" }}>
            Payment Information
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField required fullWidth label="Card Number" name="cardNumber" value={paymentFormData.cardNumber} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Expiration Date"
                name="expirationDate"
                value={paymentFormData.expirationDate}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField required fullWidth label="CVV" name="cvv" value={paymentFormData.cvv} />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Cardholder Name"
                name="cardholderName"
                value={paymentFormData.cardholderName}
              />
            </Grid>
          </Grid>
        </form>
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
          <Button size="large">Cancel</Button>
          <Button size="large">Confirm</Button>
        </div>
      </Paper>
    </Container>
  );
};

export default Checkout;
