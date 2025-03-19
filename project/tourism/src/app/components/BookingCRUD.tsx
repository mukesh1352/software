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
  cost_per_room: number;
  total_cost: number;
}

const BookingCRUD = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [formData, setFormData] = useState<Partial<Booking>>({ cost_per_room: 100 });
  const [editing, setEditing] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/booking");
      setBookings(response.data as Booking[]);
    } catch (err) {
      setError("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalCost = (rooms: number, adults: number, children: number, costPerRoom: number) => {
    return rooms * costPerRoom + adults * 50 + children * 30;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedValue = name.includes("number") ? Number(value) : value;
    
    setFormData((prev) => {
      const updatedForm = { ...prev, [name]: updatedValue };
      if (["number_of_rooms", "number_of_adults", "number_of_children"].includes(name)) {
        updatedForm.total_cost = calculateTotalCost(
          updatedForm.number_of_rooms || 0,
          updatedForm.number_of_adults || 0,
          updatedForm.number_of_children || 0,
          updatedForm.cost_per_room || 100
        );
      }
      return updatedForm;
    });
  };

  const handleSubmit = async () => {
    try {
      const response = editing
        ? await axios.put(`/api/booking/${currentBooking?.id}`, formData)
        : await axios.post("/api/booking", formData);
      
      if (response.status === 200 || response.status === 201) {
        fetchBookings();
        resetForm();
      }
    } catch (err) {
      setError("Failed to process booking");
    }
  };

  const handleEdit = (booking: Booking) => {
    setEditing(true);
    setCurrentBooking(booking);
    setFormData({
      ...booking,
      total_cost: calculateTotalCost(
        booking.number_of_rooms,
        booking.number_of_adults,
        booking.number_of_children,
        booking.cost_per_room
      ),
    });
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/booking/${id}`);
      fetchBookings();
    } catch (err) {
      setError("Failed to delete booking");
    }
  };

  const resetForm = () => {
    setFormData({ cost_per_room: 100 });
    setEditing(false);
    setCurrentBooking(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-semibold text-center mb-6">Booking Management</h1>
      {error && <p className="text-red-600 text-center">{error}</p>}
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <>
          <table className="w-full border-collapse border border-gray-300 mt-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Hotel Name</th>
                <th className="border p-2">Rooms</th>
                <th className="border p-2">Adults</th>
                <th className="border p-2">Children</th>
                <th className="border p-2">User</th>
                <th className="border p-2">Total Cost</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="text-center">
                  <td className="border p-2">{booking.hotel_name}</td>
                  <td className="border p-2">{booking.number_of_rooms}</td>
                  <td className="border p-2">{booking.number_of_adults}</td>
                  <td className="border p-2">{booking.number_of_children}</td>
                  <td className="border p-2">{booking.user_name}</td>
                  <td className="border p-2">${booking.total_cost}</td>
                  <td className="border p-2">
                    <button onClick={() => handleEdit(booking)} className="px-3 py-1 bg-blue-500 text-white rounded mr-2">Edit</button>
                    <button onClick={() => handleDelete(booking.id)} className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default BookingCRUD;