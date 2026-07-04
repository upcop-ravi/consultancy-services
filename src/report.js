// src/report.js
import { supabase } from "./supabase.js";

const tableBody = document.querySelector("#report-table tbody");

function addRow(data) {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${data.recruiter_name ?? ""}</td>
    <td>${data.contact_person ?? ""}</td>
    <td>${data.phone_no ?? ""}</td>
    <td>${data.email ?? ""}</td>
    <td>${data.job_profile ?? ""}</td>
  `;
  tableBody.appendChild(tr);
}

async function loadReport() {
  const { data, error } = await supabase
    .from("recruiters")
    .select("recruiter_name, contact_person, phone_no, email, job_profile")
    .order("id", { ascending: true });

  if (error) {
    console.error("Failed to fetch report:", error);
    tableBody.innerHTML = `<tr><td colspan="5" style="color:#ef5350;">Error loading data</td></tr>`;
    return;
  }

  if (data.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="5" style="color:#90caf9;">No recruiter records found.</td></tr>`;
    return;
  }

  data.forEach(addRow);
}

loadReport();
