let books = [];
const RENDER_EVENT = 'render-book';

document.addEventListener('DOMContentLoaded', function() {
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
    });

    // Simpan data buku dengan localStorage
    loadBooksData();
});

function addBook() {
    const titleBook = document.getElementById('inputBookTitle').value;
    const authorBook = document.getElementById('inputBookAuthor').value;
    const yearBook = document.getElementById('inputBookYear').value;
    const isCompleted = document.getElementById('inputBookIsComplete').checked;

    const generatedID = generateID();
    const bookObject = generateBookObject(generatedID, titleBook, authorBook, yearBook, isCompleted);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
}

function generateID() {
    return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
    return {
        id,
        title,
        author,
        year,
        isCompleted
    }
}

document.addEventListener(RENDER_EVENT, function () {
    console.log(books);
});

function makeBookShelf(bookObject) {
    const textTitle = document.createElement('h3');
    textTitle.innerText = bookObject.title;

    const textAuthor = document.createElement('p');
    textAuthor.innerText = `Penulis : ${bookObject.author}`;

    const textYear = document.createElement('p');
    textYear.innerText = `Tahun : ${bookObject.year}`;

    const textContainer = document.createElement('div');
    textContainer.classList.add('inner');
    textContainer.append(textTitle, textAuthor, textYear);

    const actionContainer = document.createElement('div');
    actionContainer.classList.add('action');

    const moveButton = document.createElement('button');
    moveButton.innerText = bookObject.isCompleted ? 'Belum selesai dibaca' : 'Selesai dibaca';
    moveButton.classList.add('green');
    moveButton.addEventListener('click', function() {
        if (bookObject.isCompleted) {
            removeBook(bookObject.id);
        } else {
            addBookToCompleted(bookObject.id);
        }
    });
    actionContainer.append(moveButton);

    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Hapus buku';
    deleteButton.classList.add('red');
    deleteButton.addEventListener('click', function() {
        removeBook(bookObject.id);
    });
    actionContainer.append(deleteButton);

    // const actionContainer = document.createElement('div');
    // actionContainer.classList.add('action');

    // const moveButton = document.createElement('button');
    // moveButton.innerText = bookObject.isCompleted ? 'Belum selesai dibaca' : 'Selesai dibaca';
    // moveButton.classList.add('green');
    // actionContainer.append(moveButton);

    // const deleteButton = document.createElement('button');
    // deleteButton.innerText = 'Hapus buku';
    // deleteButton.classList.add('red');
    // actionContainer.append(deleteButton);

    const container = document.createElement('div');
    container.classList.add('item', 'shadow');
    container.append(textContainer, actionContainer);
    container.setAttribute('id', `book-${bookObject.id}`);

    return container;
}

document.addEventListener(RENDER_EVENT, function() {
    const incompleteBooksList = document.getElementById('incompleteBookshelfList');
    incompleteBooksList.innerHTML = '';

    const completeBooksList = document.getElementById('completeBookshelfList');
    completeBooksList.innerHTML = '';

    for (const booksItem of books) {
        const booksElement = makeBookShelf(booksItem);
        if (!booksItem.isCompleted) {
            incompleteBooksList.append(booksElement);
        } else {
            completeBooksList.append(booksElement);
        }
    }
});

function addBookToCompleted (bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function findBook (bookId) {
    for (const booksItem of books) {
        if (booksItem.id === bookId) {
            return booksItem
        }
    }
    return null;
}

function removeBook (bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget === -1) return;

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function findBookIndex (bookId) {
    for (const index in books) {
        if (books[index].id === bookId) {
            return index;
        }
    }

    return -1;
}

function saveBooksData() {
    localStorage.setItem('books', JSON.stringify(books));
}

function loadBooksData() {
    const storedBooks = localStorage.getItem('books');

    if (storedBooks) {
        books = JSON.parse(storedBooks);
        document.dispatchEvent(new Event(RENDER_EVENT));
    }
}

// Simpan data buku dengan localStorage
window.addEventListener('unload', function () {
    saveBooksData();
});