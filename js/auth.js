// Redirect to login if not logged in
if (!localStorage.getItem('isLoggedIn')) {
  window.location.href = '/html/login.html';
}
