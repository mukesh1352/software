"use client";
import { useState, useEffect } from "react";

interface Booking {
  id: number;
  hotel_name: string;
  number_of_rooms: number;
  number_of_adults: number;
  number_of_children: number;
  total_cost: number;
  user_id: number;
  user_name: string;
}

export default function Admin() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [hotelName, setHotelName] = useState("");
  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [costPerRoom, setCostPerRoom] = useState(1000);
  const [userId, setUserId] = useState(1);
  const [userName, setUserName] = useState("admin");
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch("http://localhost:8000/bookings");
        if (!res.ok) throw new Error("Failed to fetch bookings");
        const data = await res.json();
        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };
    fetchBookings();
  }, []);

  const createBooking = async () => {
    const bookingData = {
      hotel_name: hotelName,
      number_of_rooms: rooms,
      number_of_adults: adults,
      number_of_children: children,
      total_cost: rooms * costPerRoom,
      user_id: userId,
      user_name: userName,
    };

    try {
      const res = await fetch("http://localhost:8000/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });
      if (!res.ok) throw new Error("Failed to create booking");
      const newBooking = await res.json();
      setBookings([...bookings, newBooking]);
      resetForm();
    } catch (error) {
      console.error("Error creating booking:", error);
    }
  };

  const updateBooking = async () => {
    if (editingId === null) return;
    const updatedBooking = {
      hotel_name: hotelName,
      number_of_rooms: rooms,
      number_of_adults: adults,
      number_of_children: children,
      total_cost: rooms * costPerRoom,
      user_id: userId,
      user_name: userName,
    };

    try {
      const res = await fetch(`http://localhost:8000/bookings/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedBooking),
      });
      if (!res.ok) throw new Error("Failed to update booking");
      setBookings(bookings.map((b) => (b.id === editingId ? { ...b, ...updatedBooking, id: b.id } : b)));
      resetForm();
    } catch (error) {
      console.error("Error updating booking:", error);
    }
  };

  const deleteBooking = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:8000/bookings/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete booking");
      setBookings(bookings.filter((b) => b.id !== id));
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  const resetForm = () => {
    setHotelName("");
    setRooms(1);
    setAdults(1);
    setChildren(0);
    setCostPerRoom(1000);
    setEditingId(null);
  };

  const editBooking = (booking: Booking) => {
    setEditingId(booking.id);
    setHotelName(booking.hotel_name);
    setRooms(booking.number_of_rooms);
    setAdults(booking.number_of_adults);
    setChildren(booking.number_of_children);
    setCostPerRoom(booking.total_cost / booking.number_of_rooms);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Admin Booking Management</h1>
      <div style={{ marginBottom: "20px" }}>
        <input placeholder="Hotel Name" value={hotelName} onChange={(e) => setHotelName(e.target.value)} />
        <input type="number" placeholder="Rooms" value={rooms} min="1" onChange={(e) => setRooms(Number(e.target.value))} />
        <input type="number" placeholder="Adults" value={adults} min="1" onChange={(e) => setAdults(Number(e.target.value))} />
        <input type="number" placeholder="Children" value={children} min="0" onChange={(e) => setChildren(Number(e.target.value))} />
        <input type="number" placeholder="Cost per Room" value={costPerRoom} min="500" onChange={(e) => setCostPerRoom(Number(e.target.value))} />
        {editingId ? (
          <button onClick={updateBooking}>Update Booking</button>
        ) : (
          <button onClick={createBooking}>Create Booking</button>
        )}
        <button onClick={resetForm}>Reset</button>
      </div>

      <h2>Existing Bookings</h2>
      {bookings.length > 0 ? (
        <table border={1} cellPadding={5} style={{ width: "100%", textAlign: "left" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Hotel</th>
              <th>Rooms</th>
              <th>Adults</th>
              <th>Children</th>
              <th>Total Cost</th>
              <th>User</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.id}</td>
                <td>{booking.hotel_name}</td>
                <td>{booking.number_of_rooms}</td>
                <td>{booking.number_of_adults}</td>
                <td>{booking.number_of_children}</td>
                <td>{booking.total_cost}</td>
                <td>{booking.user_name}</td>
                <td>
                  <button onClick={() => editBooking(booking)}>Edit</button>
                  <button onClick={() => deleteBooking(booking.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No bookings available</p>
      )}
    </div>
  );
}
