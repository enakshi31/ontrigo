document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("bookingForm").addEventListener("submit", async function (e) {
        e.preventDefault();

        const name = document.getElementById("name").value;
        const destination = document.getElementById("destination").value;
        const checkin = document.getElementById("checkin").value;
        const checkout = document.getElementById("checkout").value;
        const guests = document.getElementById("guests").value;
        const room_type = document.getElementById("room_type").value;

        if (!name || !destination || !checkin || !checkout || !guests || !room_type) {
            alert("Please fill all fields.");
            return;
        }

        // Get customer ID from localStorage (set during login)
        const customerid = localStorage.getItem('customerid');
        if (!customerid) {
            alert('Please login first to make a booking.');
            window.location.href = '/html/login.html';
            return;
        }

        try {
            // Calculate total amount (simplified - you can make this more sophisticated)
            const checkinDate = new Date(checkin);
            const checkoutDate = new Date(checkout);
            const duration = Math.ceil((checkoutDate - checkinDate) / (1000 * 60 * 60 * 24));
            const basePrice = 100; // Base price per day
            const amount = duration * basePrice * parseInt(guests);

            // First, create a payment record
            const paymentResponse = await fetch('http://localhost:3001/api/payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    customerid: parseInt(customerid),
                    payment_method: 'Credit Card',
                    paymentdate: new Date().toISOString().split('T')[0],
                    amount: amount,
                    bookingid: 0 // Placeholder, will be updated
                })
            });

            if (!paymentResponse.ok) {
                throw new Error('Payment creation failed');
            }

            const paymentData = await paymentResponse.json();
            const paymentid = paymentData.paymentid;

            // Now create the booking record
            const bookingResponse = await fetch('http://localhost:3001/api/bookedpackage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    customerid: parseInt(customerid),
                    paymentid: paymentid,
                    guests: parseInt(guests),
                    room_type: room_type,
                    checkin_date: checkin,
                    checkout_date: checkout,
                    destination: destination
                })
            });

            if (!bookingResponse.ok) {
                throw new Error('Booking creation failed');
            }

            const bookingData = await bookingResponse.json();
            
            alert(`Booking Confirmed!\n\nName: ${name}\nDestination: ${destination}\nCheck-in: ${checkin}\nCheck-out: ${checkout}\nGuests: ${guests}\nRoom Type: ${room_type}\nDuration: ${bookingData.duration} days\nTotal Amount: $${amount}`);
            
            // Reset form
            document.getElementById("bookingForm").reset();
            
        } catch (error) {
            console.error('Error creating booking:', error);
            alert('Error creating booking. Please try again. Make sure the server is running on port 3001.');
        }
    });
});