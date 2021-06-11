let bookList = document.querySelector("tbody");
let submitBookButton = document.querySelector(".book-form__submit");
let removeAllBooks = document.querySelector(".remove-all");
removeAllBooks.addEventListener("click", clearAll);

let read = "&#10003;";
let unread = "&mdash;";

let library = [];

class Book {
  constructor(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.delete = "&#10007; remove";
  }
}

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

function addBookToLibrary(newBook) {
  library.push(newBook);
  displayLibrary();
}

function displayLibrary() {
  let bookListItems = [];
  for (let i = 0; i < library.length; i++) {
    bookListItems.push(
      `<tr>
    <td class="title">${library[i].title}</td>
    <td class="author">${library[i].author}</td>
    <td class="pages">${library[i].pages}</td>
    <td class="read" data-index="${i}">${library[i].read}</td>
    <td class="delete" data-index="${i}">${library[i].delete}</td>
    </tr>`
    );
  }

  bookList.innerHTML = bookListItems.join("");
  let isRead = document.querySelectorAll(".read");
  isRead.forEach((icon) => icon.addEventListener("click", toggleRead));

  let deleteButtons = document.querySelectorAll(".delete");
  deleteButtons.forEach((button) =>
    button.addEventListener("click", deleteBook)
  );
  updateTally();
  return deleteButtons;
}

function toggleRead(e) {
  let index = e.target.dataset.index;
  if (library[index].read === read) {
    library[index].read = unread;
  } else {
    library[index].read = read;
  }
  displayLibrary();
}

function deleteBook(e) {
  let index = parseInt(e.target.dataset.index);
  library.splice(index, 1);
  displayLibrary();
}

function updateTally() {
  let tally = document.querySelector(".tally");
  let totalRead = 0;
  let total = library.length;
  for (let i = 0; i < library.length; i++) {
    if (library[i].read === read) {
      totalRead++;
    }
  }
  if (total === totalRead) {
    tally.textContent =
      "Great job! You have read all the books in your library!";
  } else if (totalRead === 0) {
    tally.textContent = "You have not read any books in your library";
  } else {
    tally.textContent = `You have read ${totalRead} of ${total} books`;
  }
}

//clear all input fields
function clearAll() {
  library = [];
  displayLibrary();
}

//Form validation
const form = document.querySelector("form");
let inputs = [...document.querySelectorAll(".book-form__input-field")];
inputs.forEach((input) => input.addEventListener("blur", checkValidity));

const bookTitle = document.querySelector("#title");
const titleError = document.querySelector(".title-error");

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

submitBookButton.addEventListener("click", checkValidityAll);
submitBookButton.addEventListener("keydown", checkValidityAll);
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
