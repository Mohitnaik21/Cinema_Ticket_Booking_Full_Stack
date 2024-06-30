import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import MovieCard from "../components/HomePageComponents/MovieCard";
import axios from "axios";
import TextField from "@mui/material/TextField";
import { useMediaQuery } from "@mui/material";

function Showing() {
  const [movieList, setMovieList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const isSmallScreen = useMediaQuery("(max-width: 1750px)");

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

  const showingMovieList = movieList.filter((movie: any) => movie.status === 2);
  const upcomingMovieList = movieList.filter((movie: any) => movie.status === 1);
  const filteredShowingMovies = showingMovieList.filter((movie: any) =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUpcomingMovies = upcomingMovieList.filter((movie: any) =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Box sx={{ m: 10 }}>
        <TextField
          label="Search Movie"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ marginBottom: 2 }}
        />
        <h1>Now Showing 🍿</h1>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: "40px",
          }}
        >
          {filteredShowingMovies.map((movie: any, index) => (
            <Box
              key={index}
              sx={{
                width: isSmallScreen ? "calc(25% - 40px)" : "calc(20% - 40px)",
                flex: "1 0 auto",
              }}
            >
              <MovieCard
                movieId={movie.id} // Pass the id as movieId
                title={movie.title}
                imageUrl={movie.image_url}
                genre={movie.genre}
                duration={movie.runtime}
                rating={movie.review_score}
                trailerUrl={movie.trailer_url}
              />
            </Box>
          ))}
        </Box>
        <h1>Coming Soon 🎬</h1>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: "40px",
          }}
        >
          {filteredUpcomingMovies.map((movie: any, index) => (
            <Box
              key={index}
              sx={{
                width: isSmallScreen ? "calc(25% - 40px)" : "calc(20% - 40px)",
                flex: "1 0 auto",
              }}
            >
              <MovieCard
                movieId={movie.id} 
                title={movie.title}
                imageUrl={movie.image_url}
                genre={movie.genre}
                duration={movie.runtime}
                rating={movie.review_score}
                trailerUrl={movie.trailer_url}
              />
            </Box>
          ))}
        </Box>
      </Box>
    </div>
  );
}

export default Showing;
