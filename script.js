// Auth logic
const authSection = document.getElementById("authSection");
const appSection = document.getElementById("appSection");
const authForm = document.getElementById("authForm");
const toggleAuthText = document.getElementById("toggleAuth");
const authBtn = document.getElementById("authBtn");
const logoutBtn = document.getElementById("logoutBtn");

let isLoginMode = false;
authBtn.textContent = "Signup";

toggleAuthText.addEventListener("click", () => {
  isLoginMode = !isLoginMode;
  authBtn.textContent = isLoginMode ? "Login" : "Signup";
  toggleAuthText.innerHTML = isLoginMode
    ? `New user? <a href="#">Signup</a>`
    : `Have an account? <a href="#">Login</a>`;
});

authForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;
  let users = JSON.parse(localStorage.getItem("users") || "[]");

  if (isLoginMode) {
    const found = users.find(u => u.email === email && u.pass === pass);
    if (found) { login(); } else { alert("Invalid credentials"); }
  } else {
    if (users.find(u => u.email === email)) { alert("User exists"); return; }
    users.push({ email, pass });
    localStorage.setItem("users", JSON.stringify(users));
    alert("Signup successful! Please login.");
    isLoginMode = true;
    authBtn.textContent = "Login";
    toggleAuthText.innerHTML = `New user? <a href="#">Signup</a>`;
  }
});

function login() {
  localStorage.setItem("loggedIn", "true");
  authSection.classList.add("hidden");
  appSection.classList.remove("hidden");
  loadApp();
}

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("loggedIn");
  location.reload();
});

if (localStorage.getItem("loggedIn") === "true") login();

// Listings logic
let listings = JSON.parse(localStorage.getItem("listings") || "[]");

function displayListings(arr = listings) {
  const container = document.getElementById("listings");
  container.innerHTML = "";
  arr.forEach(item => {
    container.innerHTML += `
      <div class="card">
        <img src="${item.image}" alt="">
        <h3>${item.title}</h3>
        <p>${item.location}</p>
        <p>${item.price}</p>
        <p><em>${item.type}</em></p>
      </div>
    `;
  });
}

function loadApp() {
  displayListings();

  document.getElementById("searchBox").addEventListener("input", applyFilters);
  document.getElementById("typeFilter").addEventListener("change", applyFilters);
  document.getElementById("priceFilter").addEventListener("change", applyFilters);

  document.getElementById("listingForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const newItem = {
      title: document.getElementById("title").value,
      location: document.getElementById("location").value,
      price: document.getElementById("price").value,
      image: document.getElementById("image").value,
      type: document.getElementById("type").value
    };
    listings.push(newItem);
    localStorage.setItem("listings", JSON.stringify(listings));
    applyFilters();
    e.target.reset();
  });
}

function applyFilters() {
  let filtered = [...listings];
  const search = document.getElementById("searchBox").value.toLowerCase();
  const type = document.getElementById("typeFilter").value;
  const priceOrder = document.getElementById("priceFilter").value;

  if (search) filtered = filtered.filter(i => i.location.toLowerCase().includes(search));
  if (type) filtered = filtered.filter(i => i.type === type);
  if (priceOrder) {
    filtered.sort((a, b) => {
      const pa = parseFloat(a.price.replace(/[^\d.]/g, ""));
      const pb = parseFloat(b.price.replace(/[^\d.]/g, ""));
      return priceOrder === "low" ? pa - pb : pb - pa;
    });
  }
  displayListings(filtered);
}