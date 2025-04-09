/**
 * 🌐 Language Management Module
 * Manage UI language based on user preference.
 *
 * Features:
 * - Fetch language data from a JSON file.
 * - Update UI texts based on the current language.
 * - Toggle between English and Arabic.
 * - Persist language setting using localStorage.
 */

// Variable to hold the language data from JSON.
let langData = {};

// Fetch language data from the JSON file.
fetch("../data/lang.json")
  .then((response) => response.json())
  .then((data) => {
    langData = data;
    updateLanguage();
  })
  .catch((error) => console.error("Error loading language file:", error));

// Update the UI texts based on the current language.
function updateLanguage() {
  // Get the stored language from localStorage (default to English).
  const storedLang = localStorage.getItem("lang");

  // Apply the stored language by toggling the 'ar' class on the body.
  if (storedLang === "ar") {
    document.body.classList.add("ar");
  } else {
    document.body.classList.remove("ar");
  }

  // Determine the current language.
  const currentLang = document.body.classList.contains("ar") ? "ar" : "en";

  // Set the language attribute on the <html> element for accessibility.
  document.documentElement.lang = currentLang;

  // Update all elements with a data-key attribute using the fetched language data.
  document.querySelectorAll("[data-key]").forEach((element) => {
    const key = element.getAttribute("data-key");
    const text = langData[currentLang] && langData[currentLang][key];
    // Update the element's placeholder if available, otherwise update its text content.
    if (element.placeholder !== undefined && element.placeholder !== "") {
      element.placeholder = text;
    } else {
      element.textContent = text;
    }
  });
}

// Get the language toggle button element.
const langToggleBtn = document.getElementById("lang-toggle");

// Toggle the language when the toggle button is clicked.
langToggleBtn.addEventListener("click", () => {
  // Toggle the 'ar' class on the body element.
  document.body.classList.toggle("ar");

  // Determine the new language and save it in localStorage.
  const newLang = document.body.classList.contains("ar") ? "ar" : "en";
  localStorage.setItem("lang", newLang);
  
  // Update the UI texts with the new language.
  updateLanguage();
});

// Apply the stored language setting when the DOM content is loaded.
document.addEventListener("DOMContentLoaded", () => {
  const storedLang = localStorage.getItem("lang");
  if (storedLang === "ar") {
    document.body.classList.add("ar");
  } else {
    document.body.classList.remove("ar");
  }
  updateLanguage();
});
