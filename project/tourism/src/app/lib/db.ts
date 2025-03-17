import mysql from 'mysql2/promise';

// Create a database connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'mukesh',
    password: 'mukesh123',
    database: 'tourism',
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,  // Adjust as needed
    queueLimit: 0
});

// Function to test database connection
async function testDBConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Successfully connected to the database!');
        connection.release();
    } catch (err) {
        if (err instanceof Error) {
            console.error('❌ Error connecting to the database:', err.message);
        } else {
            console.error('❌ Error connecting to the database:', err);
        }
    }
}

// Run test connection
testDBConnection();

export default pool;
