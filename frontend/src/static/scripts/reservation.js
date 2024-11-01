document.addEventListener('DOMContentLoaded', () => {
    loadBooks();
});

function loadBooks() {
    fetch('/admin/books')
        .then(response => response.json())
        .then(books => {
            const bookList = document.getElementById('bookList');
            bookList.innerHTML = ''; // Очистити список перед заповненням
            books.forEach(book => {
                const bookItem = document.createElement('article');
                bookItem.className = 'book-item';
                bookItem.innerHTML = `
                        <h3>${book.title}</h3>
                        <p>Автор: ${book.author}</p>
                        <p>Статус: ${book.status}</p>
                        <button class="reserve-btn" onclick="reserveBook('${book._id}')" ${book.status === 'reserved' ? 'disabled' : ''}>Забронювати</button>
                    `;
                bookList.appendChild(bookItem);
            });
        })
        .catch(error => console.error("Error:", error));
}

function reserveBook(bookId) {
    fetch(`/reserve_book/${bookId}`, {
        method: 'POST'
    })
        .then(response => response.json())
        .then(data => {
            alert(data.message || data.error);
            loadBooks(); // Оновити список книг
        })
        .catch(error => console.error("Error:", error));
}