import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import TheatersIcon from "@mui/icons-material/Theaters";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useUserContext } from "../pages/UserContext";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import { message } from "antd";
import { Link } from "react-router-dom";
//search bar
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

//tabs
interface Page {
  name: string;
  path: string;
}

const pages = [
  { name: "Home", path: "/" },
  { name: "Showing", path: "/showing" },
  { name: "Coming Soon", path: "/coming-soon" },
];
const settings = [
  { name: "Account", path: "/EditProfile" },
  { name: "Sign In", path: "/sign-in" },
  { name: "Register", path: "/register" },
  { name: "Log Out", path: "/" },
];

function ResponsiveAppBar() {
  // const { email, userId, userRole } = useUserContext();

  const email = localStorage.getItem("email");
  const userId = localStorage.getItem("userId");
  const userRole = localStorage.getItem("userRole");
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    // Clear items from localStorage
    localStorage.removeItem("email");
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    message.info("Logged Out!");
    handleCloseUserMenu();
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 0,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            SMPL
          </Typography>

          <TheatersIcon sx={{ display: { xs: "none", md: "flex" }, mr: 2 }} />

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page: Page) => (
              <Button href={page.path} sx={{ my: 2, color: "white", display: "block" }}>
                {page.name}
              </Button>
            ))}
          </Box>
          <p>{email ? email : "Not Logged In"}</p>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }} color="inherit">
                <AccountCircleIcon sx={{ display: { xs: "none", md: "flex" } }} fontSize="large" />
              </IconButton>
            </Tooltip>

            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {/* {settings.map((setting) => (
                <MenuItem key={setting.name} onClick={setting.name === "Log Out" ? handleLogout : handleCloseUserMenu}>
                  <Typography textAlign="center">{setting.name}</Typography>
                </MenuItem>
              ))} */}
              {settings.map((setting) => (
                <MenuItem key={setting.name} onClick={setting.name === "Log Out" ? handleLogout : handleCloseUserMenu}>
                  <Link to={setting.path} style={{ textDecoration: "none", color: "inherit" }}>
                    <Typography textAlign="center">{setting.name}</Typography>
                  </Link>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <br></br>
          <br></br>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
