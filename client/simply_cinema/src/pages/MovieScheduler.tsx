import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, MenuItem, Select, Button, Box, Typography, TextField } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import axios from 'axios';

// Assuming you have predefined lists of movies, theaters, dates, and times
//const movieList = ['Movie 1', 'Movie 2', 'Movie 3'];
//const theaterList = ['Theater 1', 'Theater 2', 'Theater 3'];
const timeList = ['10:00 AM', '12:30 PM', '03:00 PM', '05:30 PM', '08:00 PM'];

const MovieScheduler: React.FC = () => {
  const [selectedMovie, setSelectedMovie] = useState<string | null>(null);
  const [selectedTheater, setSelectedTheater] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null); // Changed the type to string
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);

  const handleMovieChange = (event: SelectChangeEvent<string>) => {
    setSelectedMovie(event.target.value);
    setSelectedTheater(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setIsFormSubmitted(false); // Reset form submission state
  };

  const handleTheaterChange = (event: SelectChangeEvent<string>) => {
    setSelectedTheater(event.target.value);
    setSelectedDate(null);
    setSelectedTime(null);
    setIsFormSubmitted(false); // Reset form submission state
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
    setSelectedTime(null);
    setIsFormSubmitted(false); // Reset form submission state
  };

  const handleTimeChange = (event: SelectChangeEvent<string>) => {
    setSelectedTime(event.target.value);
    setIsFormSubmitted(false); // Reset form submission state
  };

  const handleSubmit = () => {
    // Handle scheduling logic here
    setIsFormSubmitted(true);
  };

  const [movieList, setMovieList] = useState([]);
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/movies")
      .then(function (res) {
        setMovieList(res.data.map((movie: { title: any; }) => movie.title));
        console.log("Movies fetched in home page", res.data);
      })
      .catch(function (error) {
        console.error("Axios error", error);
      });
  }, []);

  const [theaterList, settheaterList] = useState([]);
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/movies")
      .then(function (res) {
        settheaterList(res.data.map((theater: { title: any; }) => theater.title));
        console.log("Theater fetched in home page", res.data);
      })
      .catch(function (error) {
        console.error("Axios error", error);
      });
  }, []);
  

  useEffect(() => {
    // You can add additional logic here when the form is submitted
    if (isFormSubmitted && selectedDate) {
      console.log('Movie Scheduled:', {
        selectedMovie,
        selectedTheater,
        selectedDate,
        selectedTime,
      });
    }
  }, [isFormSubmitted, selectedMovie, selectedTheater, selectedDate, selectedTime]);

  return (
    <Box>
      <Typography variant="h5">Schedule Movie</Typography>
      <FormControl fullWidth variant="outlined" margin="normal">
        <InputLabel>Select Movie</InputLabel>
        <Select value={selectedMovie || ''} onChange={handleMovieChange} label="Select Movie">
          {movieList.map((movie) => (
            <MenuItem key={movie} value={movie}>
              {movie}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedMovie && (
        <>
          <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel>Select Theatre</InputLabel>
            <Select value={selectedTheater || ''} onChange={handleTheaterChange} label="Select Theatre">
              {theaterList.map((theater) => (
                <MenuItem key={theater} value={theater}>
                  {theater}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {selectedTheater && (
            <>
              <FormControl fullWidth variant="outlined" margin="normal">
                <InputLabel shrink={!!selectedDate} htmlFor="select-date">
                  Select Date
                </InputLabel>
                <TextField
                  id="select-date"
                  type="date"
                  value={selectedDate || ''}
                  onChange={handleDateChange}
                  InputLabelProps={{
                    shrink: !!selectedDate,
                  }}
                />
              </FormControl>

              {selectedDate && (
                <FormControl fullWidth variant="outlined" margin="normal">
                  <InputLabel>Select Time</InputLabel>
                  <Select value={selectedTime || ''} onChange={handleTimeChange} label="Select Time">
                    {timeList.map((time) => (
                      <MenuItem key={time} value={time}>
                        {time}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              {selectedTime && (
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                  Schedule Movie
                </Button>
              )}
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default MovieScheduler;
