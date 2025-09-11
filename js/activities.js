document.querySelectorAll(".book-btn").forEach(button => {
  button.addEventListener("click", () => {
    let activity = button.parentElement.querySelector("h3").textContent;
    alert(`You booked: ${activity}! Our team will contact you soon.`);
  });
});

const searchInput = document.getElementById("searchInput");
const activityCards = document.querySelectorAll(".activity-card");

searchInput.addEventListener("keyup", () => {
  let filter = searchInput.value.toLowerCase();
  activityCards.forEach(card => {
    let title = card.querySelector("h3").textContent.toLowerCase();
    card.style.display = title.includes(filter) ? "block" : "none";
  });
});
