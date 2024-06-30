import React, { useState } from 'react';
import Pagination from 'react-bootstrap/Pagination';
import ResponsiveAppBar from '../components/Navbar';
import { Search } from 'react-bootstrap-icons';
import './OrderHistoryPage.css';



interface Order {
  id: number;
  movie: string;
  date: string;
  seats: string[];
}



const OrderHistoryPage: React.FC = () => {
  // Dummy data for illustration purposes
  const dummyOrders: Order[] = [
    { id: 1, movie: 'Animal', date: '2023-12-01', seats: ['Q8', 'Q9'] },
    { id: 2, movie: 'A Haunting in Venice', date: '2023-09-29', seats: ['O8', 'O9'] },
    { id: 3, movie: 'Jawan', date: '2023-09-10', seats:  ['Q8', 'Q9'] },
    { id: 4, movie: 'Oppenheimer', date: '2023-07-23', seats: ['O8', 'O9'] },
    { id: 5, movie: 'Dumb Money', date: '2023-07-21', seats:  ['Q8', 'Q9'] },
    { id: 6, movie: 'Mission: Impossible – Dead Reckoning Part One', date: '2023-07-12', seats: ['O8', 'O9'] },
    { id: 7, movie: 'No Hard Feelings', date: '2023-06-29', seats:  ['Q8', 'Q9'] },

  

  ];

  const itemsPerPage = 5;
  const [activePage, setActivePage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const handlePageChange = (pageNumber: number) => {
    setActivePage(pageNumber);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setActivePage(1);
  };

  const filteredOrders = dummyOrders.filter((order) =>
    order.movie.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = activePage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  return (
    <>
      <ResponsiveAppBar />
      <div>
        <h2>Order History</h2>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by movie"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <Search size={20} />
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Movie</th>
              <th>Date</th>
              <th>Seats</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order, index) => (
              <tr key={order.id}>
                <td>{indexOfFirstItem + index + 1}</td>
                <td>{order.movie}</td>
                <td>{order.date}</td>
                <td>{order.seats.join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination className="pagination-container">
          <Pagination.Prev
            onClick={() => handlePageChange(activePage - 1)}
            disabled={activePage === 1}
          />
          <Pagination.Item active>{activePage}</Pagination.Item>
          <Pagination.Next
            onClick={() => handlePageChange(activePage + 1)}
            disabled={indexOfLastItem >= filteredOrders.length}
          />
        </Pagination>

        <div className="pagination-info">
          Showing page {activePage} out of {totalPages} pages
        </div>
      </div>
    </>
  );
};

export default OrderHistoryPage;
