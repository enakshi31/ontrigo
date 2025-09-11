document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("packageForm").addEventListener("submit", function (event) {
        event.preventDefault();

        const destination = document.getElementById("destination").value;
        const checkin = document.getElementById("checkin").value;
        const checkout = document.getElementById("checkout").value;
        const guests = document.getElementById("guests").value;
        const packageType = document.getElementById("packageType").value;

        if (destination && checkin && checkout && guests && packageType) {
            alert(` Package booked successfully!\n\nDestination: ${destination}\nStart: ${checkin}\nEnd: ${checkout}\nTravelers: ${guests}\nPackage: ${packageType}`);
        } else {
            alert(" Please complete all fields.");
        }
    });
});