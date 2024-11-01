document.addEventListener('DOMContentLoaded', () => {
    loadReservedBooks();
});

function loadReservedBooks() {
    fetch('/admin/books/reserved')
        .then(response => response.json())
        .then(books => {
            const reservedBookList = document.getElementById('reservedBookList');
            reservedBookList.innerHTML = '';
            books.forEach(book => {
                const bookItem = document.createElement('article');
                bookItem.className = 'book-item';
                bookItem.innerHTML = `
                        <h3>${book.title}</h3>
                        <p>Автор: ${book.author}</p>
                        <p>Статус: ${book.status}</p>
                        <p>Заброньовано користувачем: ${book.reserved_by}</p>
                    `;
                reservedBookList.appendChild(bookItem);
            });
        })
        .catch(error => console.error("Error:", error));
}