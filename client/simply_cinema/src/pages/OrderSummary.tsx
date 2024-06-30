import ResponsiveAppBar from '../components/Navbar';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { Box, Container } from '@mui/material';
import { spacing } from '@mui/system';

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

function OrderSummary() {
    return (
        <div className="OrderSummary">
            <ResponsiveAppBar />
            <div>&nbsp;</div>
            <TableContainer component={Paper} style={{maxWidth: 1000, margin: 'auto'}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell colSpan={10}><h1>Summary</h1></TableCell>
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
                            <TableCell>Update</TableCell>
                            <TableCell>Delete</TableCell>
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
                                <TableCell><Button>Update</Button></TableCell>
                                <TableCell><Button>Delete</Button></TableCell>
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
                </Table>
            </TableContainer>
            <div>&nbsp;</div>
            <Box display='flex' flexDirection='row' justifyContent='center' gap='1em'>
                <Button variant='contained'>Continue To Checkout</Button>
            </Box>
        </div>
    );
}

export default OrderSummary;