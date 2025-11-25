// SQLite integration setup
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

// Serve static files from the parent directory
app.use(express.static(path.join(__dirname, '..')));
// Login endpoint
app.post('/api/login', (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return res.status(400).json({ error: 'Email and password are required.' });
	}
	const sql = 'SELECT * FROM traveller WHERE email = ? AND password = ?';
	db.get(sql, [email, password], (err, row) => {
		if (err) {
			return res.status(500).json({ error: err.message });
		}
		if (row) {
			res.json({ success: true, message: 'Login successful!', customerid: row.customerid });
		} else {
			res.status(401).json({ error: 'Invalid email or password.' });
		}
	});
});
// Register a new user
app.post('/api/register', (req, res) => {
	const { userName, address, email, phone_number, password } = req.body;
	if (!userName || !address || !email || !phone_number || !password) {
		return res.status(400).json({ error: 'All fields are required.' });
	}
	const sql = 'INSERT INTO traveller (userName, address, email, phone_number, password) VALUES (?, ?, ?, ?, ?)';
	db.run(sql, [userName, address, email, phone_number, password], function (err) {
		if (err) {
			return res.status(500).json({ error: err.message });
		}
		res.json({ message: 'User registered successfully!' });
	});
});

// Create a payment record
app.post('/api/payment', (req, res) => {
	const { customerid, payment_method, paymentdate, amount, bookingid } = req.body;
	if (!customerid || !payment_method || !paymentdate || !amount) {
		return res.status(400).json({ error: 'customerid, payment_method, paymentdate, and amount are required.' });
	}
	const sql = 'INSERT INTO payment (customerid, payment_method, paymentdate, amount, bookingid) VALUES (?, ?, ?, ?, ?)';
	db.run(sql, [customerid, payment_method, paymentdate, amount, bookingid || 0], function (err) {
		if (err) {
			return res.status(500).json({ error: err.message });
		}
		res.json({ message: 'Payment created successfully!', paymentid: this.lastID });
	});
});


// SQLite database connection
const db = new sqlite3.Database('./ontrigo.db', (err) => {
	if (err) {
		console.error('Could not connect to SQLite database', err);
	} else {
		console.log('Connected to SQLite database');
		// Create tables if they don't exist
		db.run(`PRAGMA foreign_keys = ON`);
		db.run(`CREATE TABLE IF NOT EXISTS traveller (
			customerid INTEGER PRIMARY KEY AUTOINCREMENT,
			userName TEXT NOT NULL,
			address TEXT NOT NULL,
			email TEXT NOT NULL UNIQUE,
			phone_number TEXT NOT NULL,
			password TEXT NOT NULL
		)`);
		db.run(`CREATE TABLE IF NOT EXISTS payment (
			paymentid INTEGER PRIMARY KEY AUTOINCREMENT,
			bookingid INTEGER NOT NULL,
			customerid INTEGER NOT NULL,
			payment_method TEXT NOT NULL,
			paymentdate TEXT NOT NULL,
			amount REAL NOT NULL
		)`);
		db.run(`CREATE TABLE IF NOT EXISTS bookedpackage (
			packageid INTEGER PRIMARY KEY AUTOINCREMENT,
			customerid INTEGER NOT NULL,
			paymentid INTEGER NOT NULL,
			guests INTEGER NOT NULL,
			room_type TEXT NOT NULL,
			checkin_date TEXT NOT NULL,
			checkout_date TEXT NOT NULL,
			duration INTEGER NOT NULL,
			destination TEXT NOT NULL,
			FOREIGN KEY (customerid) REFERENCES traveller(customerid) ON DELETE CASCADE ON UPDATE CASCADE
		)`);
		db.run(`CREATE TABLE IF NOT EXISTS contact_message (
			messageid INTEGER PRIMARY KEY AUTOINCREMENT,
			customerid INTEGER NOT NULL,
			full_name TEXT,
			email TEXT,
			message TEXT NOT NULL,
			FOREIGN KEY (customerid) REFERENCES traveller(customerid)
		)`);
	}
});

// Example endpoint: fetch all travellers
// Save contact form submission
// Endpoint to book a package with check-in/check-out and auto duration
app.post('/api/bookedpackage', (req, res) => {
	const { customerid, paymentid, guests, room_type, checkin_date, checkout_date, destination } = req.body;
	if (!customerid || !paymentid || !guests || !room_type || !checkin_date || !checkout_date || !destination) {
		return res.status(400).json({ error: 'All fields are required.' });
	}
	// Calculate duration in days
	const checkin = new Date(checkin_date);
	const checkout = new Date(checkout_date);
	const duration = Math.ceil((checkout - checkin) / (1000 * 60 * 60 * 24));
	if (isNaN(duration) || duration <= 0) {
		return res.status(400).json({ error: 'Invalid check-in/check-out dates.' });
	}
	db.run(`INSERT INTO bookedpackage (customerid, paymentid, guests, room_type, checkin_date, checkout_date, duration, destination)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
		[customerid, paymentid, guests, room_type, checkin_date, checkout_date, duration, destination],
		function (err) {
			if (err) {
				return res.status(500).json({ error: err.message });
			}
			res.json({ message: 'Package booked successfully!', duration });
		});
});
app.post('/api/contact', (req, res) => {
	let { full_name, email, message, customerid } = req.body;
	if (!message) {
		return res.status(400).json({ error: 'Message is required.' });
	}
	// If name or email not provided, try to get from traveller table
	if ((!full_name || !email) && customerid) {
		db.get('SELECT userName, email FROM traveller WHERE customerid = ?', [customerid], (err, row) => {
			if (err) {
				return res.status(500).json({ error: err.message });
			}
			if (row) {
				if (!full_name) full_name = row.userName;
				if (!email) email = row.email;
			}
			db.run('INSERT INTO contact_message (customerid, full_name, email, message) VALUES (?, ?, ?, ?)', [customerid, full_name, email, message], function (err) {
				if (err) {
					return res.status(500).json({ error: err.message });
				}
				res.json({ message: 'Message submitted successfully!' });
			});
		});
	} else {
		db.run('INSERT INTO contact_message (customerid, full_name, email, message) VALUES (?, ?, ?, ?)', [customerid || null, full_name, email, message], function (err) {
			if (err) {
				return res.status(500).json({ error: err.message });
			}
			res.json({ message: 'Message submitted successfully!' });
		});
	}
});

// GET endpoint for /api/contact to avoid 405 error
app.get('/api/contact', (req, res) => {
	db.all('SELECT * FROM contact_message', (err, rows) => {
		if (err) {
			return res.status(500).json({ error: err.message });
		}
		res.json(rows);
	});
});
app.get('/api/bookedpackage', (req, res) => {
	db.all('SELECT * FROM bookedpackage', (err, rows) => {
		if (err) {
			return res.status(500).json({ error: err.message });
		}
		res.json(rows);
	});
});
app.get('/api/travellers', (req, res) => {
	db.all('SELECT * FROM traveller', (err, rows) => {
		if (err) {
			return res.status(500).json({ error: err.message });
		}
		res.json(rows);
	});
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
