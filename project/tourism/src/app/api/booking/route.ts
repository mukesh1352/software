import { NextResponse } from 'next/server';
import pool from '../../lib/db'; // Using connection pool

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
export async function PUT(req: Request) {
    try {
        const { id, hotel_name, number_of_rooms, number_of_adults, number_of_children, total_cost, phone_number, email, user_id, user_name } = await req.json();

        const query = `
            UPDATE bookings
            SET hotel_name = ?, number_of_rooms = ?, number_of_adults = ?, number_of_children = ?, total_cost = ?, phone_number = ?, email = ?, user_id = ?, user_name = ?
            WHERE id = ?
        `;
        const values = [hotel_name, number_of_rooms, number_of_adults, number_of_children, total_cost, phone_number, email, user_id, user_name, id];

        await pool.query(query, values);
        return NextResponse.json({ id, hotel_name, number_of_rooms, number_of_adults, number_of_children, total_cost, phone_number, email, user_id, user_name }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error updating booking', error: (error as any).message }, { status: 500 });
    }
}

// ✅ Delete a booking
export async function DELETE(req: Request) {
    try {
        const { id } = await req.json();

        const query = 'DELETE FROM bookings WHERE id = ?';
        await pool.query(query, [id]);

        return NextResponse.json({ message: 'Booking deleted' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error deleting booking', error: (error as Error).message }, { status: 500 });
    }
}
