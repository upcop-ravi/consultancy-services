import { supabase } from "./supabase.js";

const loginForm = document.getElementById("login-form");
const messageBox = document.getElementById("message");

function showMessage(text, isError = false) {
  messageBox.textContent = text;
  messageBox.style.color = isError ? "#ef5350" : "#66bb6a";
  messageBox.style.opacity = "1";
  setTimeout(() => (messageBox.style.opacity = "0"), 3000);
}

// Seed the default admin user if not present (plain‑text password for demo only)
async function seedAdmin() {
  const { data, error } = await supabase
    .from("users")
    .select("username")
    .eq("username", "superadmin")
    .single();

  if (error && error.code === "PGRST116") {
    // No rows returned – insert the admin user
    const { error: insertErr } = await supabase
      .from("users")
      .insert([
        { username: "superadmin", password: "admin123" }
      ]);
    if (insertErr) console.error("Failed to seed admin user:", insertErr);
  }
}

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = loginForm.username.value.trim();
  const password = loginForm.password.value.trim();

  // Basic validation
  if (!username || !password) {
    showMessage("Both fields are required.", true);
    return;
  }

  // Query user record
  const { data, error } = await supabase
    .from("users")
    .select("password")
    .eq("username", username)
    .single();

  if (error) {
    console.error(error);
    showMessage("Invalid credentials.", true);
    return;
  }

  if (data.password === password) {
    showMessage("Login successful! Redirecting...");
    setTimeout(() => {
      window.location.href = "recruiter.html";
    }, 1000);
  } else {
    showMessage("Invalid credentials.", true);
  }
});

// Run seed on load
seedAdmin();
