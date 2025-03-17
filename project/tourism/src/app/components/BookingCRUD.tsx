"use client";
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
}

const BookingCRUD = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [formData, setFormData] = useState<Partial<Booking>>({});
  const [editing, setEditing] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  // Fetch existing bookings from API
  const fetchBookings = async () => {
    try {
      const response = await axios.get("/api/booking");
      setBookings(response.data as Booking[]);
    } catch (error) {
      console.error("Error fetching bookings", error);
    }
  };

  // Calculate total cost dynamically
  const calculateTotalCost = (rooms: number, adults: number, children: number) => {
    return rooms * 100 + adults * 50 + children * 30;
  };

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedValue = name.includes("number") ? Number(value) : value;

    setFormData((prev) => {
      const updatedForm = { ...prev, [name]: updatedValue };

      // Dynamically update total cost if relevant fields change
      if (["number_of_rooms", "number_of_adults", "number_of_children"].includes(name)) {
        updatedForm.total_cost = calculateTotalCost(
          updatedForm.number_of_rooms || 0,
          updatedForm.number_of_adults || 0,
          updatedForm.number_of_children || 0
        );
      }

      return updatedForm;
    });
  };

  // Handle form submission (Create / Update)
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

  // Handle edit action
  const handleEdit = (booking: Booking) => {
    setEditing(true);
    setCurrentBooking(booking);

    // Set form data with recalculated total cost
    setFormData({
      ...booking,
      total_cost: calculateTotalCost(
        booking.number_of_rooms,
        booking.number_of_adults,
        booking.number_of_children
      ),
    });
  };

  // Handle delete action
  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/booking/${id}`);
      setBookings(bookings.filter((booking) => booking.id !== id));
    } catch (error) {
      console.error("Error deleting booking", error);
    }
  };

  // Reset form
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
          { label: "Hotel Name", name: "hotel_name", type: "text" },
          { label: "Number of Rooms", name: "number_of_rooms", type: "number" },
          { label: "Number of Adults", name: "number_of_adults", type: "number" },
          { label: "Number of Children", name: "number_of_children", type: "number" },
          { label: "User ID", name: "user_id", type: "number" },
          { label: "User Name", name: "user_name", type: "text" },
        ].map((field) => (
          <div key={field.name}>
            <label className="block text-gray-700 font-medium">{field.label}</label>
            <input
              type={field.type}
              name={field.name}
              value={formData[field.name as keyof Booking] || ""}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}

        {/* Total Cost (Read-Only) */}
        <div>
          <label className="block text-gray-700 font-medium">Total Cost</label>
          <input
            type="number"
            name="total_cost"
            value={formData.total_cost || 0}
            className="w-full p-3 border border-gray-300 rounded-md bg-gray-200 cursor-not-allowed"
            readOnly
          />
        </div>

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
              <p><strong>{booking.hotel_name}</strong> - {booking.number_of_rooms} rooms - {booking.number_of_adults} adults - {booking.number_of_children} children - 💰 ${booking.total_cost}</p>
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
