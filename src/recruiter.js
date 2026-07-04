import { supabase } from "./supabase.js";

const form = document.getElementById("recruiter-form");
const messageBox = document.getElementById("message");

function showMessage(text, isError = false) {
  messageBox.textContent = text;
  messageBox.style.color = isError ? "#ef5350" : "#66bb6a";
  messageBox.style.opacity = "1";
  setTimeout(() => (messageBox.style.opacity = "0"), 3000);
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = {
    recruiter_name: form.recruiter_name.value.trim(),
    contact_person: form.contact_person.value.trim(),
    phone_no: form.phone_no.value.trim(),
    email: form.email.value.trim(),
    job_profile: form.job_profile.value.trim(),
  };

  // basic validation
  if (Object.values(data).some((v) => v === "")) {
    showMessage("All fields are required.", true);
    return;
  }

  const { error } = await supabase.from("recruiters").insert([data]);
  if (error) {
    console.error(error);
    showMessage("Failed to save data.", true);
    return;
  }
  showMessage("Recruiter saved successfully!");
  form.reset();
});
