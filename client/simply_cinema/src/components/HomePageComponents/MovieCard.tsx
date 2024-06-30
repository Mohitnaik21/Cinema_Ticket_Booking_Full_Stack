import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Rating from "@mui/material/Rating";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Iframe from "react-iframe";
import { useNavigate } from "react-router-dom";
interface MovieCardProps {
  movieId :number,
  title: string;
  imageUrl: string;
  genre: any;
  duration: number;
  rating: number;
  trailerUrl: string;
}
const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours > 0 && remainingMinutes > 0) {
    return `${hours}h ${remainingMinutes}m`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else {
    return `${remainingMinutes}m`;
  }
};

function MovieCard({ movieId ,title, imageUrl, genre, duration, rating, trailerUrl }: MovieCardProps) {
  const [open, setOpen] = useState(false);
  const [selectedTrailer, updateSelectedTrailer] = useState("");
  const formattedDuration = formatDuration(duration);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const navigate = useNavigate();
  const getEmbedUrlFromWatchUrl = (watchUrl: string) => {
    const videoIdMatch = watchUrl.match(/(?:\?|&)v=([^&]+)/);
    const videoId = videoIdMatch ? videoIdMatch[1] : null;

    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };
  const handleOpenTrailor = (currentTrailerUrl: string) => {
    // Set the trailer URL to the current movie's trailer ID
    const embedUrl = getEmbedUrlFromWatchUrl(currentTrailerUrl);
    if (embedUrl) {
      updateSelectedTrailer(embedUrl);
      setOpen(true);
    } else {
      console.error("Invalid YouTube watch URL");
    }
    setOpen(true);
  };

  const handleBookMovie = () => {
     // Get today's date in the format YYYY-MM-DD
     const today = new Date();
     const year = today.getFullYear();
     const month = String(today.getMonth() + 1).padStart(2, "0");
     const day = String(today.getDate()).padStart(2, "0");
     const todayString = `${year}-${month}-${day}`;
     // Navigate to the "Showtiming" page with the movie ID and today's date as parameters
     navigate(`/Showtiming/${movieId}/${todayString}`);
  };

  return (
    <div className="Showing">
      <Card sx={{ width: 300, height: 450 }}>
        <CardMedia sx={{ height: 300 }} image={imageUrl} title={title} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignContent: "center",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {genre} | {formattedDuration}
            </Typography>
            <Rating name="read-only" value={rating} readOnly />
          </div>
          <Button onClick={() => handleOpenTrailor(trailerUrl)}>View Trailer</Button>
          <Button onClick={handleBookMovie}>Book Movie</Button>
        </CardContent>
      </Card>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            minWidth: 300,
            minHeight: 200,
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Trailer
          </Typography>
          <iframe
            width="853"
            height="480"
            // src="https://www.youtube.com/embed/X8gtZPgYkZo"
            src={selectedTrailer}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Embedded youtube"
          />
          <Button onClick={handleClose}>Close</Button>
        </Box>
      </Modal>
    </div>
  );
}

export default MovieCard;
