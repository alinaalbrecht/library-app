//Get DOM elements
let bookList = document.querySelector("tbody");

let submitBookButton = document.querySelector(".book-form__submit");
submitBookButton.addEventListener("click", checkValidityAll);
submitBookButton.addEventListener("keydown", checkValidityAll);

let removeAllBooks = document.querySelector(".book-table__remove-all");
removeAllBooks.addEventListener("click", clearAll);
removeAllBooks.addEventListener("keydown", clearAll);

let read = "&#10003;";
let unread = "&mdash;";

//Set up library array that will save to localStorage
let library = JSON.parse(localStorage.getItem("library") || "[]");

//render saved library list on page load
(function () {
  displayLibrary();
})();

//save library to localStorage
function saveLibrary() {
  localStorage.setItem("library", JSON.stringify(library));
}

//Book constructor
class Book {
  constructor(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.delete = "&#10007; remove";
  }
}

//Make a new book from user input
function createNewBook() {
  let titleInput = document.querySelector("#title").value;
  let authorInput = document.querySelector("#author").value;
  let pagesInput = document.querySelector("#pages").value;
  let handleRadio = document.querySelector('input[name="read"]:checked').value;
  let readRadio = "";
  if (handleRadio === "read") {
    readRadio = read;
  } else {
    readRadio = unread;
  }
  let newBook = new Book();
  newBook.title = titleInput;
  newBook.author = authorInput;
  newBook.pages = pagesInput;
  newBook.read = readRadio;
  inputs.forEach((input) => (input.value = ""));
  addBookToLibrary(newBook);
  return newBook;
}

//push new book to library array
function addBookToLibrary(newBook) {
  library.push(newBook);
  displayLibrary();
  saveLibrary();
}

//render library array to DOM and add event listeners to new library elements
function displayLibrary() {
  let bookListItems = [];
  for (let i = 0; i < library.length; i++) {
    bookListItems.push(
      `<tr>
    <td class="title">${library[i].title}</td>
    <td class="author">${library[i].author}</td>
    <td class="pages">${library[i].pages}</td>
    <td class="read" tabindex="0" data-index="${i}">${library[i].read}</td>
    <td class="delete" tabindex="0" data-index="${i}">${library[i].delete}</td>
    </tr>`
    );
  }

  bookList.innerHTML = bookListItems.join("");
  let isRead = document.querySelectorAll(".read");
  isRead.forEach((icon) => icon.addEventListener("click", toggleRead));
  isRead.forEach((icon) => icon.addEventListener("keydown", toggleRead));

  let deleteButtons = document.querySelectorAll(".delete");
  deleteButtons.forEach((button) =>
    button.addEventListener("click", deleteBook)
  );
  deleteButtons.forEach((button) =>
    button.addEventListener("keydown", deleteBook)
  );
  updateTally();
  return deleteButtons;
}

//change read status between read/unread
function toggleRead(e) {
  if (e.keyCode === 13 || e.keyCode === undefined) {
    let index = e.target.dataset.index;
    if (library[index].read === read) {
      library[index].read = unread;
    } else {
      library[index].read = read;
    }
    displayLibrary();
  }
}

//remove book from libary
function deleteBook(e) {
  if (e.keyCode === 13 || e.keyCode === undefined) {
    let index = parseInt(e.target.dataset.index);
    library.splice(index, 1);
    displayLibrary();
    saveLibrary();
  }
}

//tell user how many books from their library they have read
function updateTally() {
  let tally = document.querySelector(".book-table__tally");
  let totalRead = 0;
  let total = library.length;
  for (let i = 0; i < library.length; i++) {
    if (library[i].read === read) {
      totalRead++;
    }
  }
  if (total === 0) {
    tally.textContent =
      "You don't have books in your library yet. Add some now!";
  } else if (total === totalRead) {
    tally.textContent =
      "Great job! You have read all the books in your library!";
  } else if (totalRead === 0) {
    tally.textContent = "You have not read any books in your library";
  } else {
    tally.textContent = `You have read ${totalRead} of ${total} books`;
  }
}

//remove all books from library
function clearAll(e) {
  if (e.keyCode === 13 || e.keyCode === undefined) {
    library = [];
    displayLibrary();
    saveLibrary();
  }
}

//Form validation
/* const form = document.querySelector("form"); */
let inputs = [...document.querySelectorAll(".book-form__input-field")];
inputs.forEach((input) => input.addEventListener("blur", checkValidity));

function checkValidity(e) {
  const errorMessage = e.target.parentElement.children[2];
  if (e.target.validity.valid) {
    errorMessage.textContent = "";
  } else {
    showError(errorMessage);
  }
}

function showError(target) {
  const errorName = target.dataset.name;
  target.textContent = `Please enter a ${errorName}`;
}

function checkValidityAll(e) {
  if (e.keyCode === 13 || e.keyCode === undefined) {
    let totalErrors = 0;
    for (let i = 0; i < inputs.length; i++) {
      if (!inputs[i].validity.valid) {
        showError(inputs[i].parentElement.children[2]);
        totalErrors++;
      }
    }
    if (totalErrors === 0) {
      createNewBook();
    }
  }
}
