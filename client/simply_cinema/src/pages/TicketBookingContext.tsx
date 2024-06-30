import React, { createContext, useContext, ReactNode } from "react";

interface TicketBookingContextProps {
  movieName: string | null;
  theaterLocation: string | null;
  date: string | null;
  time: string | null;
  screen: string | null;
  seat: string | null;
  price: number | null;

  setTicketBookingContext: (
    movieName: string,
    theaterLocation: string,
    date: string,
    time: string,
    screen: string,
    seat: string,
    price: number
  ) => void;
}

const TicketBookingContext = createContext<TicketBookingContextProps | undefined>(undefined);

export const useTicketBookingContext = () => {
  const context = useContext(TicketBookingContext);
  if (!context) {
    throw new Error("useTicketBookingContext must be used within a TicketBookingProvider");
  }
  return context;
};

interface TicketBookingProviderProps {
  children: ReactNode;
}

export const TicketBookingProvider: React.FC<TicketBookingProviderProps> = ({ children }) => {
  const [movieName, setMovieName] = React.useState<string | null>(null);
  const [theaterLocation, setTheaterLocation] = React.useState<string | null>(null);
  const [date, setDate] = React.useState<string | null>(null);
  const [time, setTime] = React.useState<string | null>(null);
  const [screen, setScreen] = React.useState<string | null>(null);
  const [seat, setSeat] = React.useState<string | null>(null);
  const [price, setPrice] = React.useState<number | null>(null);

  const setTicketBookingContext = (
    newMovieName: string,
    newTheaterLocation: string,
    newDate: string,
    newTime: string,
    newScreen: string,
    newSeat: string,
    newPrice: number
  ) => {
    setMovieName(newMovieName);
    setTheaterLocation(newTheaterLocation);
    setDate(newDate);
    setTime(newTime);
    setScreen(newScreen);
    setSeat(newSeat);
    setPrice(newPrice);
  };

  const ticketBookingContextValue: TicketBookingContextProps = {
    movieName,
    theaterLocation,
    date,
    time,
    screen,
    seat,
    price,
    setTicketBookingContext,
  };

  return <TicketBookingContext.Provider value={ticketBookingContextValue}>{children}</TicketBookingContext.Provider>;
};