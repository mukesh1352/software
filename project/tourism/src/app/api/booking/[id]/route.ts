import { NextResponse } from 'next/server';
import pool from '../../../lib/db'; // Using connection pool

// ✅ Get a single booking by ID
export async function GET(req: Request, context: { params: { id: string } }) {
  const { id } = context.params; // Extract the ID from the URL path

  try {
    const query = 'SELECT * FROM bookings WHERE id = ?';
    const [rows, fields]: [any[], any[]] = await pool.query(query, [id]);

    if (Array.isArray(rows) && rows.length === 0) {
      return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching booking', error: (error as Error).message }, { status: 500 });
  }
}

// ✅ Update a booking by ID
export async function PUT(req: Request, context: { params: { id: string } }) {
  const { id } = context.params; // Extract the ID from the URL path

  try {
    const { hotel_name, number_of_rooms, number_of_adults, number_of_children, total_cost, phone_number, email, user_id, user_name } = await req.json();

    if (!hotel_name || !number_of_rooms || !number_of_adults || !total_cost || !phone_number || !email || !user_id || !user_name) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Check if the booking exists before updating
    const checkQuery = 'SELECT * FROM bookings WHERE id = ?';
    const [existingBooking]: [any[], any[]] = await pool.query(checkQuery, [id]);

    if (existingBooking.length === 0) {
      return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
    }

    // Update the booking
    const query = `
      UPDATE bookings
      SET hotel_name = ?, number_of_rooms = ?, number_of_adults = ?, number_of_children = ?, total_cost = ?, phone_number = ?, email = ?, user_id = ?, user_name = ?
      WHERE id = ?
    `;
    const values = [hotel_name, number_of_rooms, number_of_adults, number_of_children, total_cost, phone_number, email, user_id, user_name, id];

    const [result] = await pool.query(query, values);

    if ((result as any).affectedRows === 0) {
      return NextResponse.json({ message: 'No changes made' }, { status: 400 });
    }

    return NextResponse.json({ id, hotel_name, number_of_rooms, number_of_adults, number_of_children, total_cost, phone_number, email, user_id, user_name }, { status: 200 });
  } catch (error) {
    console.error('Error updating booking', error);
    return NextResponse.json({ message: 'Failed to update booking', error: (error as Error).message }, { status: 500 });
  }
}

// ✅ Delete a booking by ID
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { id } = params; // Extract the ID from the URL path

  try {
    // Check if the booking exists before deleting
    const checkQuery = 'SELECT * FROM bookings WHERE id = ?';
    const [existingBooking]: [any[], any[]] = await pool.query(checkQuery, [id]);

    if (Array.isArray(existingBooking) && existingBooking.length === 0) {
      return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
    }

    // Delete the booking
    const query = 'DELETE FROM bookings WHERE id = ?';
    await pool.query(query, [id]);

    return NextResponse.json({ message: 'Booking deleted' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting booking', error);
    return NextResponse.json({ message: 'Error deleting booking', error: (error as Error).message }, { status: 500 });
  }
}
