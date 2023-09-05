import { BOOKS_PER_PAGE, authors, genres, books, html } from "./data.js";


//Define day and night colors as objects
/*const day = {
    dark: '10, 10, 20',
    light: '255, 255, 255',
}

const night = {
    dark: '255, 255, 255',
    light: '10, 10, 20',
}*/

const day = document.getElementById('Daydark');
const body = document.querySelector('body');

Theme.addEventListener('click', function() {
  if (this.classList.contains('day')) {
    this.classList.remove('Night'); // that changes color to white 
    this.classList.add('Day'); // that changes color to black
    body.style.background = 'White';
    body.style.color = 'Black';
    body.style.transition = '2s';
  } else {
    this.classList.remove('Day'); //  that changes color to black
    this.classList.add('Night'); //  that changes color to white 
    body.style.background = 'Black';
    body.style.color = 'White';
    body.style.transition = '2s';
  }
}); 



const fragment = document.createDocumentFragment();
const area = document.querySelector('[data-list-items]')
let index = 0
html.list.button.textContent = "Show More" + "(" + books.length + ")"

const loadBooks = (event) => {
    event.preventDefault()
    html.list.message.classList = 'list__message'
    const extracted = books.slice(index, index + BOOKS_PER_PAGE);
    const booksLeft = books.length - index
    html.list.button.textContent = "Show More" + "(" + booksLeft + ")"
    for (let i = index; i < index + BOOKS_PER_PAGE; i++) {
        const book = books[i]
        const image = book.image
        const title = book.title
        const authorId = book.author
        const id = book.id
        const element = document.createElement('button')
        element.classList = 'preview'
        element.setAttribute('id', id)
        element.innerHTML = /* html */ `
            <img class="preview__image"src="${image}"/>
            <div class="preview__info" data-box>
                <h3 class="preview__title">${title}</h3>
                <div class="preview__author">${authors[authorId]}</div>
            </div> `
        fragment.appendChild(element)   
    }
    area.appendChild(fragment)
    index += extracted.length;
    if (index >= books.length) {
        html.list.button.disabled = true;
        html.list.button.classList.add('button--disabled');
    }
}
html.list.button.addEventListener('click', loadBooks)
window.addEventListener('load', loadBooks)

document.addEventListener('click', (event) => {
    if (html.list.overlay.active.hasAttribute('open')) {
        html.list.overlay.active.removeAttribute('open')
    } else {
        const button = event.target.closest('.preview')
        if (button == null) {
            return;
        }
        const book = books.find(book => book.id === button.id)
        const year = new Date(book.published).getFullYear()
        console.log(year)
        const title = html.list.overlay.title
        title.innerText = book.title
        const image = book.image
        const imageElement = document.querySelector('[data-list-image]')
        imageElement.src = image
        const blurElement = document.querySelector('[data-list-blur]')
        blurElement.src=image
        const description = html.list.overlay.description
        description.innerText = book.description
        const subtitle = html.list.overlay.subtitle
        subtitle.innerText = `${authors[book.author]} (` + `${year})`
        html.list.overlay.active.setAttribute('open', true)
    }
  })

const handleSearchToggle = (event) => {
    event.preventDefault();
    if (html.search.dialog.hasAttribute('open')) {
        html.search.dialog.removeAttribute('open')
    } else {
        html.search.dialog.setAttribute('open', true)
    }

const searchableButtons = document.querySelectorAll('[data-searchable]');

searchableButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Do something when a searchable button is clicked
  });
});
}
html.search.button.addEventListener('click', handleSearchToggle)
html.search.cancel.addEventListener('click', handleSearchToggle)


const handleSettingsToggle = (event) => {
    event.preventDefault();
    if (html.settings.dialog.hasAttribute('open')) {
        html.settings.dialog.removeAttribute('open')
    } else {
        html.settings.dialog.setAttribute('open', true)
    }
}

html.settings.button.addEventListener('click', handleSettingsToggle)
html.settings.cancel.addEventListener('click', handleSettingsToggle)

const handleSettingsSave = (event) => {
    event.preventDefault();
    console.log(html.settings.theme.value)
    if (html.settings.theme.value == 'night') {
        document.documentElement.style.setProperty("--color-dark", "255, 255, 255");
    document.documentElement.style.setProperty("--color-light", "10, 10, 20");
    } else {
        document.documentElement.style.setProperty("--color-dark", "10, 10, 20");
    document.documentElement.style.setProperty("--color-light", "255, 255, 255");
    }
    html.settings.dialog.removeAttribute('open')

}
html.settings.save.addEventListener('click', handleSettingsSave)

/*const createGenreOptionsHtml = (event) => {
    event.preventDefault();
    const fragment = document.createDocumentFragment();

    for (const [key, value] of Object.entries(genres)) {
        const option = document.createElement('option')
        option.value = key;
        option.innerText = value;
        fragment.appendChild(option)
    }

    html.search.genre.appendChild(fragment);
};

html.search.button.addEventListener('click', createGenreOptionsHtml)*/


const createGenreOptionsHtml = (event) => {
    event.preventDefault();
    const fragment = document.createDocumentFragment();
const selectElement = document.getElementById("genre-select");

genres.forEach((genre) => {
  const optionElement = document.createElement("option");
  optionElement.value = genre;
  optionElement.textContent = genre;
  selectElement.appendChild(optionElement);
})
}; 



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
html.search.author.addEventListener('click', createAuthorOptionsHtml)


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
        element.innerHTML = /* html */ `
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
  }
  
  
  

html.search.submit.addEventListener('click', handleSearchSubmit)

const handleSearchResults = (found) => {

    if (typeof found === 'undefined') {
        html.search.dialog.removeAttribute('open')
        return;
    } else if (found.length === 0) {
        area.innerHTML = ''
        html.list.message.classList = 'list__message_show'
         
    } else {
        html.list.message.classList = 'list__message'
        area.innerHTML = ''
        for (let i = 0; i < found.length; i++) {
            const book = found[i]
            const image = book.image
            const title = book.title
            const authorId = book.author
            const id = book.id
            const element = document.createElement('button')
            element.classList = 'preview'
            element.setAttribute('id', id)
            element.innerHTML = /* html */ `
            <img class="preview__image"src="${image}"/>
            <div class="preview__info" data-box>
                <h3 class="preview__title">${title}</h3>
                <div class="preview__author">${authors[authorId]}</div>
            </div> `
       fragment.appendChild(element)
         
        }

        area.appendChild(fragment)
        
    } 
    html.search.dialog.removeAttribute('open')
}


