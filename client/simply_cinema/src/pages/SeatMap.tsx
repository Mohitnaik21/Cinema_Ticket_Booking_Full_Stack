import React, { useState } from 'react';
import './SeatMap.css';
import ResponsiveAppBar from '../components/Navbar';
import { Presentation } from 'lucide-react';

const SeatMapPage = () => {
  const totalRows = 17;
  const seatsPerRow = 16;
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const selectedSeatCount = selectedSeats.length;
  const bookedSeats = ['A2', 'B5', 'C8', 'D12', 'E1', 'F3', 'G6', 'H9', 'I14', 'J4', 'K7', 'L10', 'M13', 'N2', 'O5', 'P8', 'Q11'];
  const calculateSeatPrice = (row: string) => {
    const rowCharCode = row.charCodeAt(0);
    if (rowCharCode >= 65 && rowCharCode <= 68) {
      return 7.99; // Rows A to D
    } else if (rowCharCode >= 69 && rowCharCode <= 78) {
      return 10.99; // Rows E to N
    } else {
      return 12.99; // Rows O to Q
    }
  };
  const ticket = [
    { movieId: '1', movieName: 'Movie A', name: 'Theater A', theaterId: '1', timings: '03:00 PM', screenId: '1', ScreenName: 'Screen 1' },
    // Add more theaters as needed
  ];

  const totalCost = selectedSeats.reduce((acc, seat) => acc + calculateSeatPrice(seat.charAt(0)), 0);

  const handleSeatClick = (seatId: string) => {
    if (!bookedSeats.includes(seatId)) {
      setSelectedSeats((prevSelectedSeats) =>
        prevSelectedSeats.includes(seatId)
          ? prevSelectedSeats.filter((id) => id !== seatId)
          : [...prevSelectedSeats, seatId]
      );
    }
  };

  const handlePayment = () => {
    // Log the IDs of selected seats
    console.log('Selected Seat IDs:', selectedSeats);
    console.log('Passed Details Theater:', ticket);
    // Add logic to handle payment
    console.log('Processing payment...');
  };
  return (
    <>
      <ResponsiveAppBar />
      <div className="theater-details">
        <p>Theater Name: {ticket[0].name}</p>
        <p>Movie: {ticket[0].movieName}</p>
        <p>Screen: {ticket[0].ScreenName}</p>
      </div>
      <div className="SeatMap">
        <Presentation size={100} />
        <div className="presentation-text">
          All eyes this way
        </div>
        <div className="seats seat-grid">
          {Array.from({ length: totalRows }, (_, rowIndex) => (
            <div key={rowIndex} className={`row ${rowIndex === 3 ? 'premium-gap' : ''} ${rowIndex === 13 ? 'recliner-gap' : ''}`}>
              {Array.from({ length: seatsPerRow }, (_, colIndex) => {
                const seatId = `${String.fromCharCode(65 + rowIndex)}${colIndex + 1}`;
                const isBooked = bookedSeats.includes(seatId);
                const isSelected = selectedSeats.includes(seatId);
                return (
                  <div
                    key={colIndex}
                    className={`seat ${isBooked ? 'booked' : ''} ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSeatClick(seatId)}
                  >
                    {seatId}
                  </div>
                );
              })}
              {rowIndex === 3 && (
                <div className="premium-text premium-recliner-line">Premium</div>
              )}

              {rowIndex === 13 && (
                <div className="recliner-text premium-recliner-line">Recliner</div>
              )}
            </div>
          ))}
        </div>

        <div className="selected-seats">
          <h2>Selected Seats</h2>
          <ul>
            {selectedSeats.map((seat) => (
              <li key={seat}>{seat}</li>
            ))}
          </ul>
          <div className='selected-seat-count'>
            <p>Total Seats Selected:<span> {selectedSeatCount}</span></p>
            <div className="total-cost">
              Total Cost: ${totalCost.toFixed(2)}
            </div>
            <button className="payment-button" onClick={handlePayment} disabled={selectedSeatCount === 0}>
              Pay Now
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SeatMapPage;
