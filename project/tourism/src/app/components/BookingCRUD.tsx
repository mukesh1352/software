import { useState, useEffect } from "react";
import axios from "axios";

interface Booking {
  id: number;
  hotel_name: string;
  number_of_rooms: number;
  number_of_adults: number;
  number_of_children: number;
  user_id: number;
  user_name: string;
  total_cost: number;
  phone_number: string;
  email: string;
}

const BookingCRUD = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [formData, setFormData] = useState<Partial<Booking>>({});
  const [editing, setEditing] = useState(false);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const response = editing
        ? await axios.put(`/api/booking/${currentBooking?.id}`, formData)
        : await axios.post("/api/booking", formData);
      
      if (response.status === 200 || response.status === 201) {
        fetchBookings();
        resetForm();
      } else {
        console.error("Failed to process booking");
      }
    } catch (error) {
      console.error("Error processing booking", error);
    }
  };

  const handleEdit = (booking: Booking) => {
    setEditing(true);
    setCurrentBooking(booking);
    setFormData(booking);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/booking/${id}`);
      setBookings(bookings.filter((booking) => booking.id !== id));
    } catch (error) {
      console.error("Error deleting booking", error);
    }
  };

  const resetForm = () => {
    setFormData({});
    setEditing(false);
    setCurrentBooking(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-semibold text-center mb-6">Booking Management</h1>
      <div className="space-y-4">
        {[
          "hotel_name", "number_of_rooms", "number_of_adults", "number_of_children", "user_id", "user_name", "total_cost", "phone_number", "email"
        ].map((field) => (
          <input
            key={field}
            type={field.includes("number") ? "number" : "text"}
            name={field}
            placeholder={field.replace("_", " ").toUpperCase()}
            value={formData[field as keyof Booking] || ""}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ))}
        <button
          onClick={handleSubmit}
          className={`w-full p-3 ${editing ? "bg-blue-600" : "bg-green-600"} text-white rounded-md hover:opacity-90`}
        >
          {editing ? "Update Booking" : "Create Booking"}
        </button>
      </div>
      <h2 className="text-2xl font-semibold mt-8 mb-4">Booking List</h2>
      <ul className="space-y-4">
        {bookings.map((booking) => (
          <li
            key={booking.id}
            className="flex justify-between items-center p-4 border border-gray-300 rounded-md shadow-sm"
          >
            <div>
              <p><strong>{booking.hotel_name}</strong> - {booking.number_of_rooms} rooms</p>
            </div>
            <div>
              <button
                onClick={() => handleEdit(booking)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(booking.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookingCRUD;