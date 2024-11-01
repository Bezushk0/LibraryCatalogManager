document.addEventListener("DOMContentLoaded", () => {
    loadBooks();

    const addBookForm = document.getElementById("add-book-form");
    addBookForm.addEventListener("submit", (e) => {
        e.preventDefault();
        addBook();
    });
});

function loadBooks() {
    fetch('/admin/books')
        .then(response => response.json())
        .then(data => {
            const tbody = document.querySelector('#books-table tbody');
            tbody.innerHTML = '';
            data.forEach(book => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${book.title}</td>
                    <td>${book.author}</td>
                    <td>${book.isbn}</td>
                    <td>${book.status}</td> <!-- Додаємо колонку для статусу -->
                    <td>
                        <button onclick="editBook('${book._id}')">Редагувати</button>
                        <button onclick="deleteBook('${book._id}')">Видалити</button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        });
}

function addBook() {
    const title = document.getElementById("book-title").value;
    const author = document.getElementById("book-author").value;
    const isbn = document.getElementById("book-isbn").value;

    fetch('/admin/books', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, author, isbn })
    })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert(data.message);
                loadBooks();
                document.getElementById("add-book-form").reset();
            } else {
                alert(data.error);
            }
        });
}

function deleteBook(bookId) {
    fetch(`/admin/books/${bookId}`, { method: 'DELETE' })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            loadBooks();
        });
}

function editBook(bookId) {
    const title = prompt("Введіть нову назву книги:");
    const author = prompt("Введіть нового автора:");
    const isbn = prompt("Введіть новий ISBN:");
    const status = prompt("Введіть новий статус (available/reserved):");

    fetch(`/admin/books/${bookId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, author, isbn, status })
    })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            loadBooks();
        });
}
