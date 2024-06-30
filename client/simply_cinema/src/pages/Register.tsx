import React from 'react';
import ResponsiveAppBar from '../components/Navbar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import AddCardIcon from '@mui/icons-material/AddCard';
import Modal from '@mui/material/Modal';
import { Divider } from '@mui/material';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import axios from 'axios';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';


const user: { [key: string]: any } = {
  email: "",
  password: "", //make sure it matches confirm password first
  first_name: "",
  last_name: "",
  phone_number: "",
  //role: "user",
  //is_active: false, //set true after verification
  //is_suspended: false, //can be suspended by admin 
  city: "",
  country: "",
  postal_code: "",
  state: "",
  street: "", //address line 1
  unit: "", //address line 2
  receive_promotions: false
};

const card: { [key: string]: any } = {
  card_number: "",
  expiration_date: "",
  cvv: "",
  //user_id: 0, db will create userid
  city: "",
  country: "",
  name: "",
  postal_code: "",
  state: "",
  street: "",
  unit: ""
};

//for snackbar
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

interface ChipData {
  key: number;
  label: string;
}

const ListItem = styled('li')(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

/**
 *  Converts string to number if it can.
 *  "11" -> 11
 * @param input 
 * @returns 
 */
function convert(input: string): string | number {
  const parsedFloat = parseFloat(input);
  if (!isNaN(parsedFloat)) {
    return parsedFloat;
  }
  const parsedInt = parseInt(input, 10);
  if (!isNaN(parsedInt)) {
    return parsedInt;
  }
  return input;
}

const input_variant = "standard";
const input_size = "small";

function Register() {
  const [chipData, setChipData] = React.useState<ChipData[]>([
    { key: 0, label: 'Add Card' },
  ]);
  const navigate = useNavigate()
  const [newUser, setNewUser] = React.useState(user);
  const [email, setEmail] = React.useState("");
  const [confirmPS, setConfirmPS] = React.useState("");
  const [userFieldAlert, setUserFieldAlert] = React.useState([false, false, false, false, false, false])
  const [cardFieldAlert, setCardFieldAlert] = React.useState([false, false, false, false, false, false, false, false, false, false])
  const [newCard, setNewCard] = React.useState(card);
  const [cards, setCards] = React.useState<{ [key: string]: any }[]>([]);
  const [createAccountSent, setCreateAccountSent] = React.useState(false);
  const [verificationCode, setVerificationCode] = React.useState("");
  const [isVerified, setIsVerified] = React.useState(false);
  //for snackbar
  const [maxCardAlert, setMaxCardAlert] = React.useState(false);
  const [mismatchAlert, setMismatchAlert] = React.useState(false);
  const [requiredAlert, setRequiredAlert] = React.useState(false);
  const [emptyAlert, setEmptyAlert] = React.useState(false);
  const handleCloseNotif = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setMaxCardAlert(false);
    setMismatchAlert(false);
    setRequiredAlert(false);
    setEmptyAlert(false); //Ill just set them all to false
  };

  const handleVerifyCode = () => {
    if(email.length > 0) {
      const verificationObj = {
        email: email,
        code: verificationCode
      };
      axios
        .post("http://127.0.0.1:8000/verify-account", verificationObj)
        .then(function (response) {
          if(response.data === "True") {
              message.success("Successfully verified account!");
              setIsVerified(true);
              navigate("/sign-in")
          } else {
              console.log("Failed to verify code for account verification");
              message.error("Failed to verify code for account verification");
          }
        })
    }
  }

  function handleUserFieldChange(e: React.ChangeEvent<HTMLInputElement>) {
    const updatedUser = {...newUser};
    updatedUser[e.target.id] = e.target.value;
    setNewUser(updatedUser);
  }

  function handleUserFieldChangeCheckbox(e: React.ChangeEvent<HTMLInputElement>) {
    const updatedUser = {...newUser};
    updatedUser[e.target.id] = e.target.checked;
    setNewUser(updatedUser);
  }

  function handleCardFieldChange(e: React.ChangeEvent<HTMLInputElement>) {
    const updatedCard = {...newCard};
    updatedCard[e.target.id] = e.target.value;
    setNewCard(updatedCard);
  }

  const handleCreateAccount = () => {
    const map = ["first_name", "last_name", "phone_number", "email", "password"];
    const updateAlert = [...userFieldAlert];
    setUserFieldAlert(updateAlert);
    for (let i = 0; i < map.length; i++) {
      updateAlert[i] = (newUser[map[i]].length === 0);
    }
    updateAlert[5] = (confirmPS.length === 0);
    if (updateAlert.some(val => val === true)) {
      setRequiredAlert(true);
      return;
    };
    if (confirmPS !== newUser.password) {
      updateAlert[4] = true;
      updateAlert[5] = true;
      setMismatchAlert(true);
      return;
    } 
    //made it past all the checks send request to endpoint
    //console.log(newUser);
    setEmail(newUser.email);
    var data = new Array();
    data.push(newUser);
    for (let i = 0; i < cards.length; i++) {
      data.push(cards[i]);
    }
    const emailObj = {
      email: newUser.email,
    }
    axios
      .post("http://127.0.0.1:8000/email-available", emailObj)
      .then(function (response) {
        if(response.data === "True") {
          axios
          .post("http://127.0.0.1:8000/create-account", data)
          .then(function (response) {
            setCreateAccountSent(true);
            message.success("Emailed verification code")
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });
        } else {
          message.error("Email already in use")
        }
      })
      .catch(function (error) {
        console.log(error);
      })
  
  };

  const saveCard = () => {
    const map = ["card_number", 
                 "expiration_date", 
                 "cvv", 
                 "city", 
                 "country", 
                 "name", 
                 "postal_code", 
                 "state", 
                 "street", 
                 "unit"];
    const updateAlert = [...cardFieldAlert];
    setCardFieldAlert(updateAlert);
    for (let i = 0; i < map.length; i++) {
      updateAlert[i] = (newCard[map[i]].length === 0);
    }
    if (updateAlert.some(val => val === true)) {
      setEmptyAlert(true);
      return;
    }
    const addCard = {...newCard};
    cards.push(addCard);
    handleClose();
    let lastfour = newCard.card_number.slice(-4);
    setChipData([...chipData, {key: lastfour as number, label: "Visa " + lastfour}]);

    //console.log(cards);
  };

  //for modal
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setNewCard(card);
    setOpen(false);
  };
  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    height: 500,
    bgcolor: 'background.paper',
    boxShadow: 16,
    p: 4,
  };

  //for add card
  const handleDelete = (chipToDelete: ChipData) => () => {
    setChipData((chips) => chips.filter((chip) => chip.key !== chipToDelete.key));
    setCards((cards) => cards.filter((card) => card.card_number.slice(-4) as number !== chipToDelete.key));
  };

  const handleClick = () => {
    if (cards.length === 3) {
      setMaxCardAlert(true);
      return;
    } //if
    setOpen(true);
  };

  return (
    <div className="Register">
      <ResponsiveAppBar />
      <Container maxWidth='sm'>
        <Snackbar open={maxCardAlert} autoHideDuration={6000} onClose={handleCloseNotif} anchorOrigin={{vertical: "top", horizontal: "center"}}>
          <Alert onClose={handleCloseNotif} severity="error" sx={{ width: '100%' }}>
            You may only add up to 3 cards
          </Alert>
        </Snackbar>
        <Snackbar open={mismatchAlert} autoHideDuration={6000} onClose={handleCloseNotif} anchorOrigin={{vertical: "top", horizontal: "center"}}>
          <Alert onClose={handleCloseNotif} severity="error" sx={{ width: '100%' }}>
            Your passwords do not match
          </Alert>
        </Snackbar>
        <Snackbar open={requiredAlert} autoHideDuration={6000} onClose={handleCloseNotif} anchorOrigin={{vertical: "top", horizontal: "center"}}>
          <Alert onClose={handleCloseNotif} severity="error" sx={{ width: '100%' }}>
            These fields are required
          </Alert>
        </Snackbar>
        <Snackbar open={emptyAlert} autoHideDuration={6000} onClose={handleCloseNotif} anchorOrigin={{vertical: "top", horizontal: "center"}}>
          <Alert onClose={handleCloseNotif} severity="error" sx={{ width: '100%' }}>
            These fields are empty
          </Alert>
        </Snackbar>
        <Box sx={{ height: '1400px', padding: '15px 20px 0px 20px', boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)" }} >
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <h2>Account Information</h2>
            </Grid>
            <Grid item xs={6}>
              <TextField id="first_name" 
                         label="First Name"
                         error={userFieldAlert[0]}
                         variant={input_variant} 
                         size={input_size} 
                         fullWidth
                         required
                         onChange={handleUserFieldChange}/>
            </Grid>
            <Grid item xs={6}>
              <TextField id="last_name" 
                         label="Last Name"
                         error={userFieldAlert[1]}
                         variant={input_variant} 
                         size={input_size} 
                         fullWidth
                         required
                         onChange={handleUserFieldChange}/>

            </Grid>
            <Grid item xs={12}>
              <TextField id="phone_number" 
                         label="Phone Number"
                         error={userFieldAlert[2]}
                         variant={input_variant} 
                         size={input_size} 
                         fullWidth
                         required
                         onChange={handleUserFieldChange}/>
            </Grid>
            <Grid item xs={12}>
              <TextField id="email" 
                         label="Email"
                         error={userFieldAlert[3]}
                         variant={input_variant} 
                         size={input_size} 
                         fullWidth
                         required
                         onChange={handleUserFieldChange}/>
            </Grid>
            <Grid item xs={12}>
              <TextField id="password" 
                         label="Password"
                         error={userFieldAlert[4]}
                         variant={input_variant} 
                         size={input_size} 
                         fullWidth
                         required
                         type='password' 
                         onChange={handleUserFieldChange}/>
            </Grid>
            <Grid item xs={12}>
              <TextField id="confirm_password"
                         label="Confirm Password"
                         error={userFieldAlert[5]}
                         variant={input_variant} 
                         size={input_size} 
                         fullWidth
                         required
                         type='password' 
                         onChange={(e) => {setConfirmPS(e.target.value)}}/>
            </Grid>
            <Grid item xs={12}>
              <h2>Home Address</h2>
            </Grid>
            <Grid item xs={12}>
              <TextField id="street" 
                         label="Address 1" 
                         variant={input_variant} 
                         size={input_size} 
                         fullWidth 
                         onChange={handleUserFieldChange}/>
            </Grid>
            <Grid item xs={12}>
              <TextField id="unit" 
                         label="Address 2" 
                         variant={input_variant} 
                         size={input_size} 
                         fullWidth 
                         onChange={handleUserFieldChange}/>
            </Grid>
            <Grid item xs={6}>
              <TextField id="city" 
                         label="City" 
                         variant={input_variant} 
                         size={input_size} 
                         fullWidth 
                         onChange={handleUserFieldChange}/>
            </Grid>
            <Grid item xs={6}>
              <TextField id="state" 
                         label="State" 
                         variant={input_variant} 
                         size={input_size} 
                         fullWidth 
                         onChange={handleUserFieldChange}/>
            </Grid>
            <Grid item xs={6}>
              <TextField id="postal_code" 
                         label="Postal Code" 
                         variant={input_variant} 
                         size={input_size} 
                         fullWidth 
                         onChange={handleUserFieldChange}/>
            </Grid>
            <Grid item xs={6}>
              <TextField id="country" 
                         label="Country" 
                         variant={input_variant} 
                         size={input_size} 
                         fullWidth 
                         onChange={handleUserFieldChange}/>
            </Grid>
            <Grid item xs={12}>
              <Box
                sx={{display: 'flex', justifyContent: 'left', flexWrap: 'wrap', listStyle: 'none', p: 0.5, m: 0,}} component="ul">
                {chipData.map((data) => {
                  let icon;
                  if (data.label === 'Add Card') {
                    icon = <AddCardIcon />;
                  }
                  return (
                    <ListItem key={data.key}>
                      <Chip
                        icon={icon}
                        label={data.label}
                        onDelete={data.label === 'Add Card' ? undefined : handleDelete(data)}
                        onClick={data.label === 'Add Card' ? handleClick : undefined}
                      />
                    </ListItem>
                  );
                })}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel required control={<Checkbox size='small' />} label="I have read and agree to the Terms and Conditions." />
              <FormControlLabel required control={<Checkbox size='small'
                                                            id="receive_promotions"
                                                            onChange={handleUserFieldChangeCheckbox}/>} 
                                                  label="I wish to receive promotions and rewards sent to my email." />
            </Grid>
            <Grid item xs={12}>
              <Button variant='contained' fullWidth onClick={handleCreateAccount}>Create Account</Button>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
                <Link underline='none' href="/sign-in">Already have an account?</Link>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="verificationCode"
                label="Verification Code"
                fullWidth
                disabled={!createAccountSent}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} style={{marginBottom: '100px'}}>
              <Button variant="contained" fullWidth onClick={handleVerifyCode} disabled={!createAccountSent}>
                Verify Code
              </Button>
            </Grid>            
          </Grid>
        </Box>
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Grid container spacing={2.5}>
                    <Grid item xs={12}>
                      <Divider textAlign='left'>Enter Card Information</Divider>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField id="name"
                                 label="Card Holder Name"
                                 error={cardFieldAlert[5]}
                                 variant="outlined" 
                                 size={input_size} 
                                 fullWidth 
                                 onChange={handleCardFieldChange}/>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField id="card_number" 
                                 label="Card Number"
                                 error={cardFieldAlert[0]}
                                 variant="outlined" 
                                 size={input_size} 
                                 fullWidth
                                 onChange={handleCardFieldChange}/>
                    </Grid>
                    <Grid item xs={6}>
                      <TextField id="expiration_date" 
                                 label="Expiry Date"
                                 error={cardFieldAlert[1]}
                                 variant="outlined" 
                                 size={input_size} 
                                 fullWidth
                                 onChange={handleCardFieldChange}/>
                    </Grid>
                    <Grid item xs={6}>
                      <TextField id="cvv" 
                                 label="CVC/CVV"
                                 error={cardFieldAlert[2]}
                                 variant="outlined" 
                                 size={input_size} 
                                 fullWidth
                                 onChange={handleCardFieldChange}/>
                    </Grid>
                    <Grid item xs={12}>
                      <Divider textAlign='left'>Enter Billing Address</Divider>
                    </Grid>
                    <Grid item xs={6}>
                      <TextField id="street" 
                                 label="Address Line 1"
                                 error={cardFieldAlert[8]}
                                 variant="outlined" 
                                 size={input_size} 
                                 fullWidth 
                                 onChange={handleCardFieldChange}/>
                    </Grid>
                    <Grid item xs={6}>
                      <TextField id="unit" 
                                 label="Address Line 2"
                                 error={cardFieldAlert[9]}
                                 variant="outlined" 
                                 size={input_size} 
                                 fullWidth 
                                 onChange={handleCardFieldChange}/>
                    </Grid>
                    <Grid item xs={6}>
                      <TextField id="city" 
                                 label="City" 
                                 error={cardFieldAlert[3]}
                                 variant="outlined" 
                                 size={input_size} 
                                 fullWidth 
                                 onChange={handleCardFieldChange}/>
                    </Grid>
                    <Grid item xs={6}>
                      <TextField id="state" 
                                 label="State" 
                                 error={cardFieldAlert[7]}
                                 variant="outlined"
                                 size={input_size} 
                                 fullWidth 
                                 onChange={handleCardFieldChange}/>
                    </Grid>
                    <Grid item xs={6}>
                      <TextField id="postal_code" 
                                 label="Postal Code" 
                                 error={cardFieldAlert[6]}
                                 variant="outlined" 
                                 size={input_size} 
                                 fullWidth 
                                 onChange={handleCardFieldChange}/>
                    </Grid>
                    <Grid item xs={6}>
                      <TextField id="country" 
                                 label="Country"
                                 error={cardFieldAlert[4]}
                                 variant="outlined" 
                                 size={input_size} 
                                 fullWidth 
                                 onChange={handleCardFieldChange}/>
                    </Grid>
                    <Grid item xs={12}>
                      <Button variant='contained' fullWidth onClick={saveCard}>Save</Button>  
                    </Grid>
                </Grid>
            </Box>
        </Modal>
      </Container>
    </div>
  );
}

export default Register;
