import React, { useState, useEffect } from 'react';
import ResponsiveAppBar from '../components/Navbar';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Showtiming.css';
import { useParams } from "react-router-dom";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
const Showtiming: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedTheater, setSelectedTheater] = useState<string | null>(null);
  const { movieId, date: urlDate } = useParams();
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [movieName, setMovieName] = useState<string>('');
  const [noDataMessage, setNoDataMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    setSelectedTime(null);
    setSelectedTheater(null);
    setNoDataMessage(null); // Reset the noDataMessage when date changes
  };


  const handleTimeClick = (time: string, theaterId: string) => {
    if (selectedTheater === theaterId && selectedTime === time) {
      setSelectedTime(null);
      setSelectedTheater(null);
    } else {
      setSelectedTime(time);
      setSelectedTheater(theaterId);
    }
    // console.log(`Selected Time: ${time}, Selected Theater: ${theaterId}`)
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
  
    if (selectedDate && selectedTime && selectedTheater) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      console.log('Movie ID:', movieId);
      console.log('Formatted Date:', formattedDate);
      console.log('Selected Time:', selectedTime);
      console.log('Theater ID:', selectedTheater);
      navigate(`/SeatMap/${movieId}/${formattedDate}/${selectedTime}/${selectedTheater}`);
    }
  };

  interface Theater {
    movie_id: string;
    movie_title: string;
    theater_id: string;
    name: string;
    timings: string[];
  }

  useEffect(() => {
    // Determine which date to use: selectedDate or urlDate
    let formattedDate: string;
    if (selectedDate) {
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth() + 1; // Months are zero-based
      const day = selectedDate.getDate();

      // Format the date as "YYYY-MM-DD"
      formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    } else {
      // Use the date from URL parameters as a fallback
      formattedDate = urlDate || '';
    }
    // console.log('Formatted Date:', formattedDate);

    // Fetch theater data based on movieId and date from API
    axios.get(`http://127.0.0.1:8000/get-timings-on-date`, {
      params: {
        movie_id: movieId,
        date: formattedDate, // Use selectedDate or urlDate
      },
    })

      .then(response => {
        // console.log('Incoming Data:', response.data);

        if (response.data.length > 0) {
          setTheaters(response.data);
          setMovieName(response.data[0].movie_title);
        } else {
          setTheaters([]);
          setMovieName('');
          setNoDataMessage('The show is not yet scheduled, keep tuned.');
        }
      })
      .catch(error => {
        console.error('Error fetching theater data:', error);
      });
  }, [movieId, urlDate, selectedDate]);


  return (
    <div className="Showtiming">
      <ResponsiveAppBar />
      <div>
        <form onSubmit={handleSubmit}>
          <div>
            <h1>Movie Show Timings for Movie: {movieName}</h1>
            <label htmlFor="date">Select Date:</label>
            <DatePicker
              id="date"
              selected={selectedDate}
              onChange={handleDateChange}
              dateFormat="yyyy-MM-dd"
              placeholderText="Select a date"
              minDate={new Date()} // Restricts selection of previous dates
            />
          </div>
          <div>
            {selectedDate && (
              <div className="theater-container">
                {theaters.length > 0 ? (
                  theaters.map((theater, index) => ( 
                    <div key={index} className="theater">
                      <h2>{theater.name}</h2>
                      <div className="show-timings">
                        {theater.timings.map((time) => (
                          <button
                            key={time}
                            type="button"
                            onClick={() => handleTimeClick(time, theater.theater_id)}
                            className={time === selectedTime && theater.theater_id === selectedTheater ? 'selected' : ''}
                            // Check both time and theater.theaterId to disable the button
                            disabled={time === selectedTime && theater.theater_id === selectedTheater}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                      {index !== theaters.length - 1 && <hr className="theater-divider" />}
                    </div>
                  ))
                ) : (
                  <p>{noDataMessage}</p>
                )}
              </div>
            )}
          </div>
          <hr className="theater-divider" />
          <div className="button-container">
            <button type="submit" disabled={!selectedTime || !selectedTheater}>
              Proceed to Seat Selection
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Showtiming;
