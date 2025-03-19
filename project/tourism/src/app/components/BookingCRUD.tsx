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
      } else {
        await axios.post("/api/booking", formData);
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
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-semibold text-center mb-6">Booking Management</h1>
      <div className="space-y-4">
        {["hotel_name", "number_of_rooms", "number_of_adults", "number_of_children", "user_id", "user_name", "cost_per_room"].map((field) => (
          <div key={field}>
            <label className="block text-gray-700 font-medium">{field.replace("_", " ").toUpperCase()}</label>
            <input
              type={field.includes("number") || field === "cost_per_room" ? "number" : "text"}
              name={field}
              value={formData[field as keyof Booking] || ""}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}
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
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Existing Bookings</h2>
        <ul>
          {bookings.map((booking) => (
            <li key={booking.id} className="flex justify-between p-2 border-b">
              <span>{booking.hotel_name} - ${booking.total_cost}</span>
              <div>
                <button onClick={() => handleEdit(booking)} className="px-3 py-1 bg-blue-500 text-white rounded mr-2">Edit</button>
                <button onClick={() => handleDelete(booking.id)} className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BookingCRUD;