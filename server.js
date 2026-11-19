
const express = require('express');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Books data
let books = [
    {
        id: 1,
        title: "JavaScript Basics",
        author: "John",
        price: 300
    },
    {
        id: 2,
        title: "Node.js Guide",
        author: "David",
        price: 450
    }
];

// 1. GET - Display all books
app.get('/books', (req, res) => {
    res.json(books);
});

// 2. GET - Display book by ID
app.get('/books/:id', (req, res) => {
    const id = Number(req.params.id);

    const book = books.find(b => b.id === id);

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    res.json(book);
});

// 3. POST - Add new book
app.post('/books', (req, res) => {
    const { title, author, price } = req.body;

    if (
        typeof title !== 'string' || !title.trim() ||
        typeof author !== 'string' || !author.trim() ||
        price === undefined ||
        !Number.isFinite(Number(price)) ||
        Number(price) < 0
    ) {
        return res.status(400).json({
            message: "Please enter valid book details"
        });
    }

    const newBook = {
        id: books.length
            ? Math.max(...books.map(b => b.id)) + 1
            : 1,
        title: title.trim(),
        author: author.trim(),
        price: Number(price)
    };

    books.push(newBook);

    res.status(201).json({
        message: "Book added successfully",
        book: newBook
    });
});

// 4. PUT - Update book
app.put('/books/:id', (req, res) => {
    const id = Number(req.params.id);

    const book = books.find(b => b.id === id);

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    const { title, author, price } = req.body;

    if (
        typeof title !== 'string' || !title.trim() ||
        typeof author !== 'string' || !author.trim() ||
        price === undefined ||
        !Number.isFinite(Number(price)) ||
        Number(price) < 0
    ) {
        return res.status(400).json({
            message: "Please enter valid book details"
        });
    }

    book.title = title.trim();
    book.author = author.trim();
    book.price = Number(price);

    res.json({
        message: "Book updated successfully",
        book: book
    });
});

// 5. DELETE - Delete book
app.delete('/books/:id', (req, res) => {
    const id = Number(req.params.id);

    const index = books.findIndex(b => b.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    books.splice(index, 1);

    res.json({
        message: "Book deleted successfully"
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
