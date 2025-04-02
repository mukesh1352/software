import { NextResponse } from 'next/server';
import pool from '../../../lib/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

interface Booking {
  id: number;
  hotel_name: string;
  number_of_rooms: number;
  number_of_adults: number;
  number_of_children: number;
  user_id: string;
  user_name: string;
}


// ✅ Get a single booking by ID
export async function GET(req: Request, context: { params: { id: string } }) {
  const { id } = context.params;

  try {
    const query = 'SELECT * FROM bookings WHERE id = ?';
    const [rows] = await pool.query<RowDataPacket[]>(query, [id]);
    const bookings = rows as Booking[];
    if (bookings.length === 0) {
      return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
    }
    return NextResponse.json(bookings[0], { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching booking', error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, context: { params: { id: string } }) {
  const { id } = context.params;

  if (!id) {
    return NextResponse.json({ message: "Invalid booking ID" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { 
      hotel_name,
      number_of_rooms,
      number_of_adults,
      number_of_children,
      user_id,
      user_name
    } = body;

    if (!hotel_name || !number_of_rooms || !number_of_adults || !user_id || !user_name) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Check if booking exists
    const checkQuery = "SELECT * FROM bookings WHERE id = ?";
    const [rows] = await pool.query<RowDataPacket[]>(checkQuery, [id]);
    const existingBooking = rows as Booking[];

    if (existingBooking.length === 0) {
      return NextResponse.json({ message: "Booking not found" }, { status: 404 });
    }

    // Update booking
    const query = `
      UPDATE bookings
      SET hotel_name = ?, number_of_rooms = ?, number_of_adults = ?, 
          number_of_children = ?, user_id = ?, user_name = ?
      WHERE id = ?
    `;
    const values = [
      hotel_name,
      number_of_rooms,
      number_of_adults,
      number_of_children,
      user_id,
      user_name,
      id
    ];

    const [result] = await pool.query<ResultSetHeader>(query, values);

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: "No changes made" }, { status: 400 });
    }

    return NextResponse.json({
      id,
      ...body
    }, { status: 200 });
  } catch (error) {
    console.error("Error updating booking", error);
    return NextResponse.json(
      { message: "Failed to update booking", error: (error as Error).message },
      { status: 500 }
    );
  }
}

// ✅ Delete a booking by ID
export async function DELETE(req: Request, context: { params: { id: string } }) {
  const { id } = context.params;

  try {
    const query = 'DELETE FROM bookings WHERE id = ?';
    const [result] = await pool.query<ResultSetHeader>(query, [id]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Booking deleted' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting booking', error);
    return NextResponse.json(
      { message: 'Error deleting booking', error: (error as Error).message },
      { status: 500 }
    );
  }
}