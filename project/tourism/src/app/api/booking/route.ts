import { NextResponse } from 'next/server';
import pool from '../../lib/db'; // Using connection pool

// ✅ Get all bookings
export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM bookings');
    return NextResponse.json(rows, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Error fetching bookings', error: error.message }, { status: 500 });
  }
}

// ✅ Create a new booking
export async function POST(req: Request) {
  try {
    const { hotel_name, number_of_rooms, number_of_adults, number_of_children, total_cost, phone_number, email, user_id, user_name } = await req.json();

    // Validate required fields
    if (!hotel_name || !number_of_rooms || !number_of_adults || !total_cost || !phone_number || !email || !user_id || !user_name) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const query = `
      INSERT INTO bookings (hotel_name, number_of_rooms, number_of_adults, number_of_children, total_cost, phone_number, email, user_id, user_name)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [hotel_name, number_of_rooms, number_of_adults, number_of_children, total_cost, phone_number, email, user_id, user_name];

    const [result] = await pool.query(query, values);
    return NextResponse.json({ id: (result as any).insertId, hotel_name, number_of_rooms, number_of_adults, number_of_children, total_cost, phone_number, email, user_id, user_name }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Error creating booking', error: error.message }, { status: 500 });
  }
}

// ✅ Update a booking
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const id = params.id; // Extract the id from the URL path

  try {
    // Get the data from the request
    const { hotel_name, number_of_rooms, number_of_adults, number_of_children, total_cost, phone_number, email, user_id, user_name } = await req.json();

    // Validate required fields
    if (!hotel_name || !number_of_rooms || !number_of_adults || !total_cost || !phone_number || !email || !user_id || !user_name) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Check if the booking exists before updating
    const checkQuery = 'SELECT * FROM bookings WHERE id = ?';
    const [existingBooking] = await pool.query(checkQuery, [id]);

    if ((existingBooking as any[]).length === 0) {
      return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
    }

    // Prepare the update query
    const query = `
      UPDATE bookings
      SET hotel_name = ?, number_of_rooms = ?, number_of_adults = ?, number_of_children = ?, total_cost = ?, phone_number = ?, email = ?, user_id = ?, user_name = ?
      WHERE id = ?
    `;
    const values = [hotel_name, number_of_rooms, number_of_adults, number_of_children, total_cost, phone_number, email, user_id, user_name, id];

    // Execute the update query
    const [result] = await pool.query(query, values);

    if ((result as any).affectedRows === 0) {
      return NextResponse.json({ message: 'No changes made' }, { status: 400 });
    }

    return NextResponse.json({ id, hotel_name, number_of_rooms, number_of_adults, number_of_children, total_cost, phone_number, email, user_id, user_name }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ message: 'Error updating booking', error: error.message }, { status: 500 });
  }
}

// ✅ Delete a booking
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const id = params.id;  // Extract id from URL parameters
  
  try {
    // Check if the booking exists before deleting
    const checkQuery = 'SELECT * FROM bookings WHERE id = ?';
    const [existingBooking] = await pool.query(checkQuery, [id]);

    if ((existingBooking as any[]).length === 0) {
      return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
    }

    const query = 'DELETE FROM bookings WHERE id = ?';
    await pool.query(query, [id]); // Delete the booking with the specific ID

    return NextResponse.json({ message: 'Booking deleted' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Error deleting booking', error: error.message }, { status: 500 });
  }
}
