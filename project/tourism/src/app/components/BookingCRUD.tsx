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
  const [formData, setFormData] = useState<Partial<Booking>>({
    cost_per_room: 100,
  });
  const [editing, setEditing] = useState(false);
  const [currentBookingId, setCurrentBookingId] = useState<number | null>(null);

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

  const calculateTotalCost = (rooms = 0, adults = 0, children = 0, costPerRoom = 100) => {
    return rooms * costPerRoom + adults * 50 + children * 30;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedValue = name.includes("number") ? Number(value) : value;

    setFormData((prev) => {
      const updatedForm = { ...prev, [name]: updatedValue };
      if (["number_of_rooms", "number_of_adults", "number_of_children", "cost_per_room"].includes(name)) {
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
      if (editing && currentBookingId !== null) {
        await axios.put(`/api/booking/${currentBookingId}`, formData);
      }
      fetchBookings();
      resetForm();
    } catch (error) {
      console.error("Error processing booking", error);
    }
  };

  const handleEdit = (booking: Booking) => {
    setEditing(true);
    setCurrentBookingId(booking.id);
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
    } catch (error) {
      console.error("Error deleting booking", error);
    }
  };

  const resetForm = () => {
    setFormData({ cost_per_room: 100 });
    setEditing(false);
    setCurrentBookingId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 flex items-center justify-center">
      <div className="max-w-4xl w-full p-8 bg-white rounded-xl shadow-2xl space-y-6">
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-8">Booking Management</h1>

        {/* Form Section */}
        <div className="space-y-6">
          {editing && (
            <div className="space-y-4">
              {["hotel_name", "number_of_rooms", "number_of_adults", "number_of_children", "user_id", "user_name", "cost_per_room"].map((field) => (
                <div key={field} className="mb-4">
                  <label htmlFor={field} className="block text-lg font-semibold text-gray-700">
                    {field.replace("_", " ").toUpperCase()}
                  </label>
                  <input
                    id={field}
                    name={field}
                    type={field.includes("number") || field === "cost_per_room" ? "number" : "text"}
                    value={formData[field as keyof Booking] || ""}
                    onChange={handleChange}
                    className="w-full p-4 mt-2 bg-gray-100 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              ))}
              <div className="mb-6">
                <label htmlFor="total_cost" className="block text-lg font-semibold text-gray-700">Total Cost</label>
                <input
                  id="total_cost"
                  name="total_cost"
                  type="number"
                  value={formData.total_cost || 0}
                  readOnly
                  className="w-full p-4 mt-2 bg-gray-200 border-2 border-gray-300 rounded-lg cursor-not-allowed"
                />
              </div>
              <button
                onClick={handleSubmit}
                className="w-full p-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 transition duration-300"
              >
                Update Booking
              </button>
            </div>
          )}
        </div>

        {/* Existing Bookings Table */}
        <div className="mt-12 bg-gray-50 rounded-xl shadow-xl p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Existing Bookings</h2>
          <div className="overflow-x-auto rounded-lg shadow-lg">
            <table className="w-full table-auto text-gray-700">
              <thead className="bg-gradient-to-r from-blue-600 to-purple-700 text-lg text-white">
                <tr>
                  <th className="p-4">Hotel</th>
                  <th className="p-4">Rooms</th>
                  <th className="p-4">Adults</th>
                  <th className="p-4">Children</th>
                  <th className="p-4">User</th>
                  <th className="p-4">Total Cost</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id} className="bg-gray-100 hover:bg-gray-200 transition duration-300">
                    <td className="p-4">{booking.hotel_name}</td>
                    <td className="p-4">{booking.number_of_rooms}</td>
                    <td className="p-4">{booking.number_of_adults}</td>
                    <td className="p-4">{booking.number_of_children}</td>
                    <td className="p-4">{booking.user_name}</td>
                    <td className="p-4">${booking.total_cost}</td>
                    <td className="p-4 flex space-x-2">
                      <button
                        onClick={() => handleEdit(booking)}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 transition duration-300"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(booking.id)}
                        className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:bg-gradient-to-r hover:from-red-600 hover:to-red-700 transition duration-300"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCRUD;
