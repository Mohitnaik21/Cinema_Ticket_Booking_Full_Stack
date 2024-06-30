import React, { useEffect, useState } from "react";
import ResponsiveAppBar from "../components/Navbar";
import axios from "axios";
import Showing from "./Showing";
import Typography from "@mui/material/Typography";
import Rating from "@mui/material/Rating";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";

function Home() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [movieList, setMovieList] = useState([]);
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/movies")
      .then(function (res) {
        setMovieList(res.data);
        console.log("Movies fetched in home page", res.data);
      })
      .catch(function (error) {
        console.error("Axios error", error);
      });
  }, []);
  return (
    <div className="Home">
      <ResponsiveAppBar />
      {/* <Button onClick={handleOpen}>Open modal</Button> */}
      <Showing />
    </div>
  );
}

export default Home;
