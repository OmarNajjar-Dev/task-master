// Variable to hold the language data
let langData = {};

// Fetch language data from data.json
fetch('../data/lang.json')
  .then(response => response.json())
  .then(data => {
    langData = data;
    // Initialize UI language after the JSON data is loaded
    updateLanguage();
  })
  .catch(error => console.error('Error loading language file:', error));

// Function to update UI texts based on the current language
function updateLanguage() {
  // Default language is English; switch to Arabic if the body has class "ar"
  const currentLang = document.body.classList.contains('ar') ? 'ar' : 'en';

  // Optionally update the <html> lang attribute for accessibility
  document.documentElement.lang = currentLang;

  // Update all elements with a data-key attribute
  const elements = document.querySelectorAll('[data-key]');
  elements.forEach(el => {
    const key = el.getAttribute('data-key');
    const text = langData[currentLang] && langData[currentLang][key];

    // Update placeholder if available; otherwise update text content
    if (el.placeholder !== undefined && el.placeholder !== "") {
      el.placeholder = text;
    } else {
      el.textContent = text;
    }
  });
}

// Toggle language when the user clicks the language toggle button
const langToggleBtn = document.getElementById('lang-toggle');
langToggleBtn.addEventListener('click', () => {
  // Toggle the "ar" class on the body element
  document.body.classList.toggle('ar');
  // Update the UI texts based on the new language
  updateLanguage();
});

// Ensure the language is updated when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', updateLanguage);
