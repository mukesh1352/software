import { NextResponse } from 'next/server';
import pool from '../../lib/db'; // Using connection pool
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

// ✅ Get all bookings
export async function GET() {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM bookings');
    return NextResponse.json(rows, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ message: 'Error fetching bookings', error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: 'Unknown error occurred' }, { status: 500 });
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

    const [result] = await pool.query<ResultSetHeader>(query, values);
    return NextResponse.json({ id: result.insertId, hotel_name, number_of_rooms, number_of_adults, number_of_children, total_cost, phone_number, email, user_id, user_name }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ message: 'Error creating booking', error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: 'Unknown error occurred' }, { status: 500 });
  }
}

// ✅ Delete a booking
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const id = params.id; // Extract id from URL parameters
  
  try {
    // Check if the booking exists before deleting
    const checkQuery = 'SELECT * FROM bookings WHERE id = ?';
    const [existingBooking] = await pool.query<RowDataPacket[]>(checkQuery, [id]);

    if (existingBooking.length === 0) {
      return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
    }

    const query = 'DELETE FROM bookings WHERE id = ?';
    await pool.query(query, [id]); // Delete the booking with the specific ID

    return NextResponse.json({ message: 'Booking deleted' }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ message: 'Error deleting booking', error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: 'Unknown error occurred' }, { status: 500 });
  }
}
