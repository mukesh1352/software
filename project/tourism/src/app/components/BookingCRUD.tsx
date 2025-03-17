"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';

const BookingCRUD = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [hotel_name, setHotelName] = useState('');
  const [number_of_rooms, setNumberOfRooms] = useState(0);
  const [number_of_adults, setNumberOfAdults] = useState(0);
  const [number_of_children, setNumberOfChildren] = useState(0);
  const [total_cost, setTotalCost] = useState(0);
  const [phone_number, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [user_id, setUserId] = useState(0);
  const [user_name, setUserName] = useState('');
  const [editing, setEditing] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<any>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('/api/booking');
      setBookings(response.data as any[]);
    } catch (error) {
      console.error('Error fetching bookings', error);
    }
  };

  const createBooking = async () => {
    try {
      const response = await axios.post('/api/booking', {
        hotel_name,
        number_of_rooms,
        number_of_adults,
        number_of_children,
        total_cost,
        phone_number,
        email,
        user_id,
        user_name,
      });
      setBookings([...bookings, response.data]);
      resetForm();
    } catch (error) {
      console.error('Error creating booking', error);
    }
  };

  const updateBooking = async () => {
    try {
      const response = await axios.put('/api/booking', {
        id: currentBooking.id,
        hotel_name,
        number_of_rooms,
        number_of_adults,
        number_of_children,
        total_cost,
        phone_number,
        email,
        user_id,
        user_name,
      });
      const updatedBookings = bookings.map((booking) =>
        booking.id === currentBooking.id ? response.data : booking
      );
      setBookings(updatedBookings);
      resetForm();
      setEditing(false);
    } catch (error) {
      console.error('Error updating booking', error);
    }
  };

  const deleteBooking = async (id: number) => {
    try {
      await axios.delete(`/api/bookings/${id}`);
      setBookings(bookings.filter((booking) => booking.id !== id));
    } catch (error) {
      console.error('Error deleting booking', error);
    }
  };

  const handleEdit = (booking: any) => {
    setEditing(true);
    setCurrentBooking(booking);
    setHotelName(booking.hotel_name);
    setNumberOfRooms(booking.number_of_rooms);
    setNumberOfAdults(booking.number_of_adults);
    setNumberOfChildren(booking.number_of_children);
    setTotalCost(booking.total_cost);
    setPhoneNumber(booking.phone_number);
    setEmail(booking.email);
    setUserId(booking.user_id);
    setUserName(booking.user_name);
  };

  const resetForm = () => {
    setHotelName('');
    setNumberOfRooms(0);
    setNumberOfAdults(0);
    setNumberOfChildren(0);
    setTotalCost(0);
    setPhoneNumber('');
    setEmail('');
    setUserId(0);
    setUserName('');
  };

  return (
    <div>
      <h1>Booking Management</h1>
      <div>
        <input
          type="text"
          placeholder="Hotel Name"
          value={hotel_name}
          onChange={(e) => setHotelName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Rooms"
          value={number_of_rooms}
          onChange={(e) => setNumberOfRooms(parseInt(e.target.value))}
        />
        <input
          type="number"
          placeholder="Adults"
          value={number_of_adults}
          onChange={(e) => setNumberOfAdults(parseInt(e.target.value))}
        />
        <input
          type="number"
          placeholder="Children"
          value={number_of_children}
          onChange={(e) => setNumberOfChildren(parseInt(e.target.value))}
        />
        <input
          type="number"
          placeholder="Total Cost"
          value={total_cost}
          onChange={(e) => setTotalCost(parseFloat(e.target.value))}
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={phone_number}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="number"
          placeholder="User ID"
          value={user_id}
          onChange={(e) => setUserId(parseInt(e.target.value))}
        />
        <input
          type="text"
          placeholder="User Name"
          value={user_name}
          onChange={(e) => setUserName(e.target.value)}
        />
        {editing ? (
          <button onClick={updateBooking}>Update Booking</button>
        ) : (
          <button onClick={createBooking}>Create Booking</button>
        )}
      </div>

      <h2>Booking List</h2>
      <ul>
        {bookings.map((booking) => (
          <li key={booking.id}>
            {booking.hotel_name} - {booking.number_of_rooms} rooms - {booking.number_of_adults} adults -{' '}
            {booking.number_of_children} children
            <button onClick={() => handleEdit(booking)}>Edit</button>
            <button onClick={() => deleteBooking(booking.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookingCRUD;
