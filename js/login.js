const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

// Handle sign-up form submission
const signupForm = document.getElementById('signup-form');
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const userName = document.getElementById('signup-name').value;
        const address = document.getElementById('signup-address').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const phone_number = document.getElementById('signup-phone').value;
        try {
            const res = await fetch('http://localhost:3001/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userName, address, email, phone_number, password })
            });
            const data = await res.json();
            if (res.ok) {
                alert('Registration successful!');
                signupForm.reset();
            } else {
                alert(data.error || 'Registration failed.');
            }
        } catch (err) {
            alert('Error connecting to server.');
        }
    });
}

// Handle sign-in form submission
const signinForm = document.querySelector('.form-container.sign-in form');
if (signinForm) {
    signinForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = signinForm.querySelector('input[type="email"]').value;
        const password = signinForm.querySelector('input[type="password"]').value;
        try {
            const res = await fetch('http://localhost:3001/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (res.ok && data.success) {
                localStorage.setItem('isLoggedIn', 'true');
                if (data.customerid) {
                    localStorage.setItem('customerid', data.customerid);
                }
                window.location.href = '../main.html';
            } else {
                alert(data.error || 'Login failed.');
            }
        } catch (err) {
            alert('Error connecting to server.');
        }
    });
}