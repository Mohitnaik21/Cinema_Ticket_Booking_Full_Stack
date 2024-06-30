import { Box, Container, Grid, TableContainer, Table, TableCell, TableRow, Paper, TableHead, TableBody, TableFooter } from '@mui/material';
import ResponsiveAppBar from '../components/Navbar';

const BOOKING_NUMBER = 43;
const EMAIL = 'moviefan@email.com'
const TAX_RATE = 0.08;

function format(n: number) {
    return `${n.toFixed(2)}`;
}

interface Ticket {
    id: number;
    title: string;
    date: string;
    time: string;
    location: string;
    screen: number;
    seat: string;
    price: number;
}

function subtotal(items: readonly Ticket[]) {
    return items.map(({ price }) => price).reduce((sum, i) => sum + i, 0);
}

function createData(
    id: number,
    title: string,
    date: string,
    time: string,
    location: string,
    screen: number,
    seat: string,
    price: number,
) {
    return {id, title, date, time, location, screen, seat, price};
}

const tickets = [
    createData(1, 'Lizard and the Guy', '10/5/23', '4:00 PM', 'Alps', 2, 'C3', 10),
    createData(2, 'Lizard and the Guy', '10/5/23', '4:00 PM', 'Alps', 2, 'C4', 6),
    createData(4, 'Lizard and the Guy: The Chalice of Embers', '10/8/23', '6:15 PM', 'Downtown', 1, 'F10', 12),
    createData(3, 'Lizard and the Guy: The Prisoner of Walton County Correctional Facility', '10/6/23', '9:34 PM', 'Winterville', 3, 'A1', 14),
];

function OrderConfirmation() {
    return (
        <div>
            <ResponsiveAppBar />
            <div>&nbsp;</div>
            <TableContainer component={Paper} style={{maxWidth: 1000, margin: 'auto'}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell colSpan={4}>
                                <h1>Confirmation</h1>
                            </TableCell>
                            <TableCell colSpan={4}>
                                <h2>Booking Number: {BOOKING_NUMBER}</h2>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Ticket ID</TableCell>
                            <TableCell>Movie</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Time</TableCell>
                            <TableCell>Location</TableCell>
                            <TableCell>Screen</TableCell>
                            <TableCell>Seat</TableCell>
                            <TableCell>Price</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tickets.map((ticket) => (
                            <TableRow key={ticket.id}>
                                <TableCell>{ticket.id}</TableCell>
                                <TableCell>{ticket.title}</TableCell>
                                <TableCell>{ticket.date}</TableCell>
                                <TableCell>{ticket.time}</TableCell>
                                <TableCell>{ticket.location}</TableCell>
                                <TableCell>{ticket.screen}</TableCell>
                                <TableCell>{ticket.seat}</TableCell>
                                <TableCell>${format(ticket.price)}</TableCell>
                            </TableRow>
                        ))}
                        <TableRow>
                            <TableCell rowSpan={3}/>
                            <TableCell colSpan={6}>Subtotal</TableCell>
                            <TableCell align='right'>${format(subtotal(tickets))}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Tax</TableCell>
                            <TableCell colSpan={5}>{(TAX_RATE * 100).toFixed(0)}%</TableCell>
                            <TableCell align='right'>${format(subtotal(tickets) * TAX_RATE)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={6}>Total</TableCell>
                            <TableCell align='right'>${format(subtotal(tickets) * (1 + TAX_RATE))}</TableCell>
                        </TableRow>
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={8}>
                                <h1>Your tickets have been sent to {EMAIL}!</h1>
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        </div>
    );
}

export default OrderConfirmation;