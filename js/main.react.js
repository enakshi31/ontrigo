// React renderer for the tour grid. Uses JSX (Babel) and React 18 via CDN.

const packages = [
    {
        name: "New York City",
        img: "photos/newyork.jpg",
        desc: "Explore the bustling streets and iconic landmarks of New York City.",
        duration: "3 Days",
        price: "$599",
        highlights: "Statue of Liberty, Central Park, Times Square"
    },
    {
        name: "Paris",
        img: "photos/paris.jpg",
        desc: "Discover the romance and charm of Paris, the city of lights.",
        duration: "5 Days",
        price: "$999",
        highlights: "Eiffel Tower, Louvre Museum, Notre-Dame Cathedral"
    },
    {
        name: "Tokyo",
        img: "photos/tokyo.jpg",
        desc: "Experience the vibrant culture and futuristic technology of Tokyo.",
        duration: "7 Days",
        price: "$1299",
        highlights: "Shibuya Crossing, Tokyo Tower, Akihabara"
    },
    {
        name: "Rome",
        img: "photos/rome.jpg",
        desc: "Step back in time and explore the ancient history of Rome.",
        duration: "4 Days",
        price: "$799",
        highlights: "Colosseum, Vatican City, Pantheon"
    },
    {
        name: "Sydney",
        img: "photos/sydney.jpg",
        desc: "Enjoy the stunning harbors, beaches, and landmarks of Sydney.",
        duration: "6 Days",
        price: "$1099",
        highlights: "Sydney Opera House, Bondi Beach, Harbour Bridge"
    },
    {
        name: "Cape Town",
        img: "photos/capetown.jpg",
        desc: "Discover the natural beauty and vibrant culture of Cape Town.",
        duration: "5 Days",
        price: "$849",
        highlights: "Table Mountain, V&A Waterfront, Robben Island"
    },
    {
        name: "Rio de Janeiro",
        img: "photos/rio.jpg",
        desc: "Experience the lively culture and stunning landscapes of Rio de Janeiro.",
        duration: "5 Days",
        price: "$899",
        highlights: "Christ the Redeemer, Copacabana Beach, Sugarloaf Mountain"
    },
    {
        name: "Dubai",
        img: "photos/dubai.jpg",
        desc: "Immerse yourself in the luxury and innovation of Dubai.",
        duration: "4 Days",
        price: "$999",
        highlights: "Burj Khalifa, Dubai Mall, Desert Safari"
    },
    {
        name: "Istanbul",
        img: "photos/istanbul.jpg",
        desc: "Experience the rich history and diverse culture of Istanbul.",
        duration: "5 Days",
        price: "$799",
        highlights: "Hagia Sophia, Blue Mosque, Grand Bazaar"
    }
];

function TourCard({ pkg }) {
    return (
        <div className="tour">
            <img src={pkg.img} alt={pkg.name} />
            <h3>{pkg.name}</h3>
            <p>{pkg.desc}</p>
            <ul>
                <li>Duration: {pkg.duration}</li>
                <li>Price: {pkg.price}</li>
                <li>Highlights: {pkg.highlights}</li>
            </ul>
            <button><a href="html/booking.html" target="_blank" rel="noopener noreferrer">Book now</a></button>
        </div>
    );
}

function App() {
    return (
        <>
            {packages.map((p, i) => (
                <TourCard pkg={p} key={i} />
            ))}
        </>
    );
}

// Keep the same logout behavior as before and mount React when DOM is ready.
function initApp() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function (e) {
            e.preventDefault();
            localStorage.removeItem('isLoggedIn');
            window.location.href = '/html/login.html';
        });
    }

    const target = document.getElementById('tourGrid');
    if (target) {
        ReactDOM.createRoot(target).render(<App />);
    } else {
        console.error('tourGrid element not found');
    }
}

// Babel transforms this script async, so DOM might already be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    // DOM already loaded, execute immediately
    initApp();
}
