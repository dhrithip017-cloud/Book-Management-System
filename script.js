
const API = '/books';

const bookList = document.getElementById('bookList');
const bookForm = document.getElementById('bookForm');
const message = document.getElementById('message');

// Display all books
async function loadBooks() {

    try {
        const response = await fetch(API);

        if (!response.ok) {
            throw new Error("Unable to load books");
        }

        const books = await response.json();

        bookList.innerHTML = '';

        books.forEach(book => {

            bookList.innerHTML += `
                <tr>
                    <td>${book.id}</td>
                    <td>${escapeHTML(book.title)}</td>
                    <td>${escapeHTML(book.author)}</td>
                    <td>${book.price}</td>

                    <td>
                        <button onclick="editBook(${book.id})">
                            Edit
                        </button>

                        <button onclick="deleteBook(${book.id})">
                            Delete
                        </button>
                    </td>
                </tr>
            `;
        });

    } catch (error) {
        message.textContent = error.message;
    }
}

// Safely display book text
function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[char]);
}

// Add or update book
bookForm.addEventListener('submit', async function(e) {

    e.preventDefault();

    const id = document.getElementById('bookId').value;

    const book = {
        title: document.getElementById('title').value,
        author: document.getElementById('author').value,
        price: Number(document.getElementById('price').value)
    };

    try {

        const response = await fetch(
            id ? `${API}/${id}` : API,
            {
                method: id ? 'PUT' : 'POST',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify(book)
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message);
        }

        message.textContent = result.message;

        resetForm();

        loadBooks();

    } catch (error) {
        message.textContent = error.message;
    }
});

// Edit book
async function editBook(id) {

    try {

        const response = await fetch(`${API}/${id}`);

        const book = await response.json();

        if (!response.ok) {
            throw new Error(book.message);
        }

        document.getElementById('bookId').value = book.id;

        document.getElementById('title').value = book.title;

        document.getElementById('author').value = book.author;

        document.getElementById('price').value = book.price;

        message.textContent =
            "Edit the details and click Save Book";

    } catch (error) {
        message.textContent = error.message;
    }
}

// Delete book
async function deleteBook(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this book?"
    );

    if (!confirmDelete) {
        return;
    }

    try {

        const response = await fetch(`${API}/${id}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message);
        }

        message.textContent = result.message;

        loadBooks();

    } catch (error) {
        message.textContent = error.message;
    }
}

// Clear form
function resetForm() {

    bookForm.reset();

    document.getElementById('bookId').value = '';

}

// Load books when page opens
loadBooks();
