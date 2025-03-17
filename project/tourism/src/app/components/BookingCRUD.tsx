"use client";
import { useState, useEffect } from "react";
import axios from "axios";

// Define the type for a Booking
interface Booking {
  id: number;
  hotel_name: string;
  number_of_rooms: number;
  number_of_adults: number;
  number_of_children: number;
  total_cost: number;
  phone_number: string;
  email: string;
  user_id: number;
  user_name: string;
}

const BookingCRUD = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [hotel_name, setHotelName] = useState<string>("");
  const [number_of_rooms, setNumberOfRooms] = useState<number>(0);
  const [number_of_adults, setNumberOfAdults] = useState<number>(0);
  const [number_of_children, setNumberOfChildren] = useState<number>(0);
  const [total_cost, setTotalCost] = useState<number>(0);
  const [phone_number, setPhoneNumber] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [user_id, setUserId] = useState<number>(0);
  const [user_name, setUserName] = useState<string>("");
  const [editing, setEditing] = useState<boolean>(false);
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get("/api/booking");
      setBookings(response.data as Booking[]);
    } catch (error) {
      console.error("Error fetching bookings", error);
    }
  };

  const createBooking = async () => {
    try {
      const response = await axios.post("/api/booking", {
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

      if (response.status === 201) {
        setBookings((prevBookings) => [...prevBookings, response.data as Booking]);
        resetForm();
      } else {
        console.error("Failed to create booking");
      }
    } catch (error) {
      console.error("Error creating booking", error);
    }
  };

  const updateBooking = async () => {
    if (!currentBooking) return;
    try {
      const response = await axios.put(`/api/booking/${currentBooking.id}`, {
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
  
      if (response.status === 200) {
        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking.id === currentBooking.id ? (response.data as Booking) : booking
          )
        );
        resetForm();
        setEditing(false);
      } else {
        console.error("Failed to update booking");
      }
    } catch (error) {
      console.error("Error updating booking", error);
    }
  };

  const deleteBooking = async (id: number) => {
    try {
      const response = await axios.delete(`/api/booking/${id}`);
      if (response.status === 200) {
        setBookings((prevBookings) =>
          prevBookings.filter((booking) => booking.id !== id)
        );
      } else {
        console.error("Failed to delete booking");
      }
    } catch (error) {
      console.error("Error deleting booking", error);
    }
  };

  const handleEdit = (booking: Booking) => {
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
    setHotelName("");
    setNumberOfRooms(0);
    setNumberOfAdults(0);
    setNumberOfChildren(0);
    setTotalCost(0);
    setPhoneNumber("");
    setEmail("");
    setUserId(0);
    setUserName("");
  };

  return (
    <div>
      <h1>Booking Management</h1>

      {/* Form to create or edit bookings */}
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
          value={number_of_rooms || ""}
          onChange={(e) => setNumberOfRooms(Number(e.target.value))}
        />
        <input
          type="number"
          placeholder="Adults"
          value={number_of_adults || ""}
          onChange={(e) => setNumberOfAdults(Number(e.target.value))}
        />
        <input
          type="number"
          placeholder="Children"
          value={number_of_children || ""}
          onChange={(e) => setNumberOfChildren(Number(e.target.value))}
        />
        <input
          type="number"
          placeholder="Total Cost"
          value={total_cost || ""}
          onChange={(e) => setTotalCost(Number(e.target.value))}
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
          value={user_id || ""}
          onChange={(e) => setUserId(Number(e.target.value))}
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

      {/* Display the list of bookings */}
      <h2>Booking List</h2>
      <ul>
        {bookings.map((booking) => (
          <li key={booking.id}>
            {booking.hotel_name} - {booking.number_of_rooms} rooms -{" "}
            {booking.number_of_adults} adults - {booking.number_of_children}{" "}
            children
            <button onClick={() => handleEdit(booking)}>Edit</button>
            <button onClick={() => deleteBooking(booking.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookingCRUD;
