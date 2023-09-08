// Import constants and objects from data.js
import { BOOKS_PER_PAGE } from "./data.js";
import { authors } from "./data.js";
import { genres } from "./data.js";
import { books } from "./data.js";
import { html } from "./data.js";

// Get references to DOM elements
const day = document.getElementById('Daydark');
const body = document.querySelector('body');

/**
 * Event listener to toggle between day and night modes.
 * Changes background and text colors accordingly.
 */
Theme.addEventListener('click', function() {
  if (this.classList.contains('day')) {
    this.classList.remove('Night'); 
    this.classList.add('Day'); 
    body.style.background = 'White';
    body.style.color = 'Black';
    body.style.transition = '2s';
  } else {
    this.classList.remove('Day'); 
    this.classList.add('Night'); 
    body.style.background = 'Black';
    body.style.color = 'White';
    body.style.transition = '2s';
  }
}); 

// Get reference to author select element
const authorSelect = document.getElementById("author-select");

/**
 * Populate the author select element with options.
 * @function
 */
function populateAuthorOptions() {
  authorSelect.innerHTML = '<option value="">Select an Author</option>';

  for (const [key, value] of Object.entries(authors)) {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = value;
    authorSelect.appendChild(option);
  }
}

// Call the function to populate author options on page load
populateAuthorOptions();

// Event listener for author select element
authorSelect.addEventListener("change", function () {
  const selectedAuthorId = this.value;

  // Filter books by the selected author
  const filteredBooks = books.filter((book) => book.author === selectedAuthorId);

  // Display the filtered books
  displayBooks(filteredBooks);
});

/**
 * Display a list of books based on the provided book array.
 * Clears existing books and updates the message.
 * @param {Object[]} bookArray - An array of book objects to display.
 */
function displayBooks(bookArray) {
  // Clear existing books
  area.innerHTML = '';

  if (bookArray.length === 0) {
    html.list.message.textContent = 'No results found.';
  } else {
    html.list.message.textContent = `${bookArray.length} books found.`;

    const fragment = document.createDocumentFragment();

    bookArray.slice(0, BOOKS_PER_PAGE).forEach((book) => {
      const element = document.createElement('button');
      element.classList = 'preview';
      element.setAttribute('id', book.id);
      element.innerHTML = /* html */ `
        <img class="preview__image" src="${book.image}" />
        <div class="preview__info" data-box>
          <h3 class="preview__title">${book.title}</h3>
          <div class="preview__author">${authors[book.author]}</div>
        </div> `;
      fragment.appendChild(element);
    });

    area.appendChild(fragment);
  }

  html.list.button.disabled = true;
  html.list.button.classList.add('button--disabled');
}

// Get reference to genre select element
const genreSelect = document.getElementById("genre-select");

/**
 * Populate the genre select element with options.
 * @function
 */
function populateGenreOptions() {
  genreSelect.innerHTML = '<option value="">Select a Genre</option>';

  for (const [key, value] of Object.entries(genres)){
    const option = document.createElement("option");
    option.value = key;
    option.textContent = value;
    genreSelect.appendChild(option);
  }
}

// Call the function to populate genre options on page load
populateGenreOptions();

// Event listener for genre select element
genreSelect.addEventListener("change", function () {
  const selectedGenreId = this.value;

  // Filter books by the selected genre
  const filteredBooks = books.filter((book) => book.genre === selectedGenreId);

  // Display the filtered books
  displayBooks(filteredBooks);
});

/**
 * Display a list of books based on the provided book array and genre.
 * Clears existing books and updates the message.
 * @param {Object[]} bookArray - An array of book objects to display.
 * @param {string} genre - The selected genre to filter by.
 */
function displayBooksByGenre(bookArray, genre) {
  // Clear existing books
  area.innerHTML = '';

  const filteredBooks = bookArray.filter(book => book.genre === genre);

  if (filteredBooks.length === 0) {
    html.list.message.textContent = `No ${genre} books found.`;
  } else {
    html.list.message.textContent = `${filteredBooks.length} ${genre} books found.`;

    const fragment = document.createDocumentFragment();

    filteredBooks.slice(0, BOOKS_PER_PAGE).forEach((book) => {
      const element = document.createElement('button');
      element.classList = 'preview';
      element.setAttribute('id', book.id);
      element.innerHTML = /* html */ `
        <img class="preview__image" src="${book.image}" />
        <div class="preview__info" data-box>
          <h3 class="preview__title">${book.title}</h3>
          <div class="preview__author">${genre[book.genre]}</div>
        </div> `;
      fragment.appendChild(element); 
    });

    area.appendChild(fragment);
  }

  html.list.button.disabled = true;
  html.list.button.classList.add('button--disabled');
}

// Create a document fragment for efficient DOM manipulation
const fragment = document.createDocumentFragment();

// Get reference to the area for displaying books
const area = document.querySelector('[data-list-items]');

// Initialize the index for pagination
let index = 0;

// Update the "Show More" button text with the total number of books
html.list.button.textContent = "Show More" + "(" + books.length + ")";

// Function to load more books on button click
const loadBooks = (event) => {
  event.preventDefault();
  html.list.message.classList = 'list__message';
  const extracted = books.slice(index, index + BOOKS_PER_PAGE);
  const booksLeft = books.length - index;
  html.list.button.textContent = "Show More" + "(" + booksLeft + ")";
  for (let i = index; i < index + BOOKS_PER_PAGE; i++) {
    const book = books[i];
    const image = book.image;
    const title = book.title;
    const authorId = book.author;
    const id = book.id;
    const element = document.createElement('button');
    element.classList = 'preview';
    element.setAttribute('id', id);
    element.innerHTML = /* html */ `
      <img class="preview__image"src="${image}"/>
      <div class="preview__info" data-box>
        <h3 class="preview__title">${title}</h3>
        <div class="preview__author">${authors[authorId]}</div>
      </div> `;
    fragment.appendChild(element);
  }
  area.appendChild(fragment);
  index += extracted.length;
  if (index >= books.length) {
    html.list.button.disabled = true;
    html.list.button.classList.add('button--disabled');
  }
};

// Add event listener to "Show More" button
html.list.button.addEventListener('click', loadBooks);

// Load initial set of books on page load
window.addEventListener('load', loadBooks);

// Event listener for displaying book details on button click
document.addEventListener('click', (event) => {
  if (html.list.overlay.active.hasAttribute('open')) {
    html.list.overlay.active.removeAttribute('open');
  } else {
    const button = event.target.closest('.preview');
    if (button == null) {
      return;
    }
    const book = books.find(book => book.id === button.id);
    const year = new Date(book.published).getFullYear();
    const title = html.list.overlay.title;
    title.innerText = book.title;
    const image = book.image;
    const imageElement = document.querySelector('[data-list-image]');
    imageElement.src = image;
    const blurElement = document.querySelector('[data-list-blur]');
    blurElement.src = image;
    const description = html.list.overlay.description;
    description.innerText = book.description;
    const subtitle = html.list.overlay.subtitle;
    subtitle.innerText = `${authors[book.author]} (` + `${year})`;
    html.list.overlay.active.setAttribute('open', true);
  }
});

// Event handler to toggle the search dialog
const handleSearchToggle = (event) => {
  event.preventDefault();
  if (html.search.dialog.hasAttribute('open')) {
    html.search.dialog.removeAttribute('open');
  } else {
    html.search.dialog.setAttribute('open', true);
  }
};

// Add event listener to the search button
html.search.button.addEventListener('click', handleSearchToggle);

// Add event listener to the search cancel button
html.search.cancel.addEventListener('click', handleSearchToggle);

// Event handler to toggle the settings dialog
const handleSettingsToggle = (event) => {
  event.preventDefault();
  if (html.settings.dialog.hasAttribute('open')) {
    html.settings.dialog.removeAttribute('open');
  } else {
    html.settings.dialog.setAttribute('open', true);
  }
};

// Add event listener to the settings button
html.settings.button.addEventListener('click', handleSettingsToggle);

// Add event listener to the settings cancel button
html.settings.cancel.addEventListener('click', handleSettingsToggle);

// Event handler to save settings
const handleSettingsSave = (event) => {
  event.preventDefault();
  console.log(html.settings.theme.value);
  if (html.settings.theme.value == 'night') {
    document.documentElement.style.setProperty("--color-dark", "255, 255, 255");
    document.documentElement.style.setProperty("--color-light", "10, 10, 20");
  } else {
    document.documentElement.style.setProperty("--color-dark", "10, 10, 20");
    document.documentElement.style.setProperty("--color-light", "255, 255, 255");
  }
  html.settings.dialog.removeAttribute('open');
};

// Add event listener to the settings save button
html.settings.save.addEventListener('click', handleSettingsSave);

// Event handler to create genre options in the search dialog
const createGenreOptionsHtml = (event) => {
  event.preventDefault();
  const fragment = document.createDocumentFragment();
  const selectElement = document.getElementById("genre-select");

  genres.forEach((genre) => {
    const optionElement = document.createElement("option");
    optionElement.value = genre;
    optionElement.textContent = genre;
    selectElement.appendChild(optionElement);
  });
};

// Event handler to create author options in the search dialog
const createAuthorOptionsHtml = (event) => {
  event.preventDefault();
  const fragment = document.createDocumentFragment();

  for (const [key, value] of Object.entries(authors)) {
    const option = document.createElement('option')
    option.value = key;
    option.innerText = value;
    fragment.appendChild(option)
  }
  html.search.author.appendChild(fragment);
};

// Add event listener to create author options in the search dialog
html.search.author.addEventListener('click', createAuthorOptionsHtml);

// Event listener to handle search functionality
document.addEventListener('DOMContentLoaded', function () {
  const searchButton = document.querySelector('[data-header-search]');

  searchButton.addEventListener('click', function () {
    // Handle the search functionality here
    // You can open the search overlay or perform a search action
  });
});

// Event listener to open search overlay
const searchOverlay = document.querySelector('[data-search-overlay]');

searchButton.addEventListener('click', function () {
  searchOverlay.showModal(); // This will open the search overlay
});

// Event listener to handle settings functionality
document.addEventListener('DOMContentLoaded', function () {
  const settingsButton = document.querySelector('[data-header-settings]');

  settingsButton.addEventListener('click', function () {
    // Handle the settings functionality here
    // You can open the settings overlay or perform a settings action
  });
});

// Event listener to open settings overlay
const settingsOverlay = document.querySelector('[data-settings-overlay]');

settingsButton.addEventListener('click', function () {
  settingsOverlay.showModal(); // This will open the settings overlay
});

// Event handler to handle search form submission
const handleSearchSubmit = (event) => {
  event.preventDefault();
  const search = {
    "title": html.search.title.value,
    "author": html.search.author.value,
    "genre": html.search.genre.value
  };
  const found = [];
  for (let x in search) {
    if (search[x] !== "") {
      found.push(...books.filter(book => book[x] === search[x]));
    }
  }
  if (found.length > 0) {
    html.list.message.textContent = `${found.length} books found.`
    area.textContent = "";
    found.slice(0, BOOKS_PER_PAGE).forEach((book) => {
      const element = document.createElement('button')
      element.classList = 'preview'
      element.setAttribute('id', book.id)
      element.innerHTML = /* html*/ `
        <img class="preview__image"src="${book.image}"/>
        <div class="preview__info" data-box>
          <h3 class="preview__title">${book.title}</h3>
          <div class="preview__author">${authors[book.author]}</div>
        </div> `
      area.appendChild(element)
    })
  } else {
    html.list.message.textContent = `No results found.`
  }
  html.list.button.disabled = true;
  html.list.button.classList.add('button--disabled');
};
