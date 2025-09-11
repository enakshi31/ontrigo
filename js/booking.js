document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("bookingForm").addEventListener("submit", function (e) {
        e.preventDefault();

        const name = document.getElementById("name").value;
        const destination = document.getElementById("destination").value;
        const checkin = document.getElementById("checkin").value;
        const checkout = document.getElementById("checkout").value;
        const guests = document.getElementById("guests").value;

        if (name && destination && checkin && checkout && guests) {
            alert(`Booking Confirmed!\n\nName: ${name}\nDestination: ${destination}\nCheck-in: ${checkin}\nCheck-out: ${checkout}\nGuests: ${guests}`);
        } else {
            alert(" Please fill all fields.");
        }
    });
});