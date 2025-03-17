import { NextResponse } from 'next/server';
import pool from '../../../lib/db'; // Using connection pool

// ✅ Get all bookings
export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM bookings');
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching bookings', error: (error as Error).message }, { status: 500 });
  }
}

// ✅ Create a new booking
export async function POST(req: Request) {
  try {
    const { hotel_name, number_of_rooms, number_of_adults, number_of_children, total_cost, phone_number, email, user_id, user_name } = await req.json();

    const query = `
      INSERT INTO bookings (hotel_name, number_of_rooms, number_of_adults, number_of_children, total_cost, phone_number, email, user_id, user_name)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [hotel_name, number_of_rooms, number_of_adults, number_of_children, total_cost, phone_number, email, user_id, user_name];

    const [result] = await pool.query(query, values);
    return NextResponse.json({ id: (result as any).insertId, hotel_name, number_of_rooms, number_of_adults, number_of_children, total_cost, phone_number, email, user_id, user_name }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating booking', error: (error as any).message }, { status: 500 });
  }
}

// ✅ Update a booking
// ✅ Update a booking
export async function PUT(req: Request, context: { params: { id: string } }) {
  const { params } = context; // Correctly handle dynamic params
  const id = params.id; // The dynamic `id` from the URL
  
  if (!id) {
    return NextResponse.json({ message: 'Booking ID is required' }, { status: 400 });
  }
  
  try {
    // Get the data from the request body
    const { hotel_name, number_of_rooms, number_of_adults, number_of_children, total_cost, phone_number, email, user_id, user_name } = await req.json();

    // Validate the data
    if (!hotel_name || !number_of_rooms || !number_of_adults || !total_cost || !phone_number || !email || !user_id || !user_name) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Prepare the update query
    const query = `
      UPDATE bookings
      SET hotel_name = ?, number_of_rooms = ?, number_of_adults = ?, number_of_children = ?, total_cost = ?, phone_number = ?, email = ?, user_id = ?, user_name = ?
      WHERE id = ?
    `;
    
    // Define the values to be inserted into the query
    const values = [hotel_name, number_of_rooms, number_of_adults, number_of_children, total_cost, phone_number, email, user_id, user_name, id];

    // Execute the update query
    const [result] = await pool.query(query, values);

    // Check if any row was affected, meaning the update was successful
    if ((result as any).affectedRows === 0) {
      return NextResponse.json({ message: 'Booking not found or no changes made' }, { status: 404 });
    }

    // Return the updated booking details
    return NextResponse.json({ id, hotel_name, number_of_rooms, number_of_adults, number_of_children, total_cost, phone_number, email, user_id, user_name }, { status: 200 });
  } catch (error) {
    // Handle unexpected errors
    return NextResponse.json({ message: 'Error updating booking', error: (error as any).message }, { status: 500 });
  }
}
  

// ✅ Delete a booking
// ✅ Delete a booking
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const id = params.id;  // Extract id from URL parameters
    
    try {
      const query = 'DELETE FROM bookings WHERE id = ?';
      await pool.query(query, [id]); // Delete the booking with the specific ID
  
      return NextResponse.json({ message: 'Booking deleted' }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ message: 'Error deleting booking', error: (error as Error).message }, { status: 500 });
    }
  }
  