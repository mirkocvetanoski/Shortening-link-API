const body = document.querySelector("body");
const nav = document.querySelector(".nav");
const navLinks = document.querySelector(".nav__links");
const header = document.querySelector(".header");
const navFeatures = document.getElementById("features");
const sectionStatistics = document.getElementById("statistics");
const input = document.getElementById("link");
const form = document.querySelector(".form");
const smallText = document.querySelector("small");
let copyBtns = [...document.querySelectorAll(".copy-btn")];
let deleteBtns = [...document.querySelectorAll(".delete-btn")];
const openMenuBtn = document.querySelector(".open__menu");
const closeMenuBtn = document.querySelector(".close__menu");
const openSvg = document.getElementById("open__menu");
const closeSvg = document.getElementById("close__menu");

// API url
const apiURL = `https://api.shrtco.de/v2/`;

// Get from local storage
const localStorageInputs = JSON.parse(localStorage.getItem("links"));

// Input searches
let inputSearches =
  localStorage.getItem("links") !== null ? localStorageInputs : [];

// Smooth scrolling on features
navFeatures.addEventListener("click", function (e) {
  e.preventDefault();
  const yOffset = -90;
  const secCoords = sectionStatistics.getBoundingClientRect();
  // Scrolling
  window.scrollTo({
    left: secCoords.left + window.pageXOffset,
    top: secCoords.top + window.pageYOffset + yOffset,
    behavior: "smooth",
  });
});

// Sticky navigation: Intersection Observer API
const stickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) {
    nav.classList.add("sticky");
  } else {
    nav.classList.remove("sticky");
  }
};

const obsOptions = {
  root: null,
  threshold: 0,
  rootMargin: "175px",
};

const headerObserver = new IntersectionObserver(stickyNav, obsOptions);
headerObserver.observe(header);

// Focus the input when opening page
input.focus();

// Fetching the API and add div below the form

const shortenLink = async function (link, i) {
  try {
    const response = await fetch(
      `${apiURL}shorten?url=${link}.org/very/long/link.html`
    );

    const data = await response.json();

    const shortLink = data.result.short_link;

    // Creating div to insert
    const html = `
      <div class="shortened__links">
        <p>${link || localStorageInputs[i]}</p>
        <p>${shortLink}</p>
        <button class="copy-btn" type="button">Copy</button>
        <button class="delete-btn" type="button">Delete</button>
      </div>`;

    form.insertAdjacentHTML("afterend", html);

    // Select the copy buttons and add event listener to each of them
    copyBtns = [...document.querySelectorAll(".copy-btn")];

    copyBtns.forEach((btn) =>
      btn.addEventListener("click", (e) => {
        // Select the link for copy
        const copiedLink = btn.closest("div").children[1].textContent;

        // Copy to cliboard
        navigator.clipboard.writeText(copiedLink);

        // Inform the user that he copied the link
        e.target.textContent = "Link Copied!";
        e.target.style.backgroundColor = "var(--primary-darkViolet)";

        // Change back the copy button
        setTimeout(() => {
          e.target.textContent = "Copy";
          e.target.style.backgroundColor = "var(--primary-cyan)";
        }, 1000);
      })
    );

    // Select the delete buttons and add event listener to each of them
    deleteBtns = [...document.querySelectorAll(".delete-btn")];

    deleteBtns.forEach((btn) =>
      btn.addEventListener("click", (e) => {
        // Delete the div
        btn.closest("div").remove();

        // Clear from array
        const link = e.target.closest("div").children[0].textContent;
        const index = inputSearches.indexOf(link);

        if (index > -1) {
          inputSearches.splice(index, 1);
        }

        // Update the local storage
        updateLocalStorage(inputSearches);
      })
    );
  } catch (err) {
    body.innerHTML = `<h1>${err.message}. Please try again!</h1>`;
  }
};

// Update local storage
const updateLocalStorage = function (inputs) {
  localStorage.setItem("links", JSON.stringify(inputs));
};

// Init
if (inputSearches.length > 0) {
  inputSearches.forEach((input, i) => {
    shortenLink(input, i);
  });
}

// Event listeners
// Event listener on form
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const inputText = input.value.trim();

  if (!inputText) {
    smallText.style.display = "block";
    smallText.classList.add("empty__input");
    input.classList.add("empty__input");
  } else {
    smallText.style.display = "none";
    smallText.classList.remove("empty__input");
    input.classList.remove("empty__input");

    inputSearches.push(inputText);

    shortenLink(inputText);
  }

  // Update the local storage
  updateLocalStorage(inputSearches);

  // Reset the input
  input.value = "";
});

// Event listener on menu button
openMenuBtn.addEventListener("click", (e) => {
  openMenuBtn.style.display = "none";
  closeMenuBtn.style.display = "block";
  navLinks.style.display = "flex";
});

// Event listener on close button
closeMenuBtn.addEventListener("click", (e) => {
  openMenuBtn.style.display = "block";
  closeMenuBtn.style.display = "none";
  navLinks.style.display = "none";
});

// Event listener on body
body.addEventListener("click", (e) => {
  if (
    e.target !== navLinks &&
    e.target !== closeMenuBtn &&
    e.target !== closeSvg &&
    navLinks.style.display === "flex" &&
    e.target !== openMenuBtn &&
    e.target !== openSvg
  ) {
    openMenuBtn.style.display = "block";
    closeMenuBtn.style.display = "none";
    navLinks.style.display = "none";
  }
});

// Event listener on ESC button
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    openMenuBtn.style.display = "block";
    closeMenuBtn.style.display = "none";
    navLinks.style.display = "none";
  }
});
