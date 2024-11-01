document.addEventListener('DOMContentLoaded', () => {
    loadUsers();
});

function loadUsers() {
    fetch('/admin/users')
        .then(response => response.json())
        .then(users => {
            const tableBody = document.getElementById('usersTable').getElementsByTagName('tbody')[0];
            tableBody.innerHTML = '';
            users.forEach(user => {
                const row = tableBody.insertRow();
                row.innerHTML = `
                    <td>${user.username}</td>
                    <td>${user.email}</td>
                    <td>
                        <select onchange="updateRole('${user._id}', this.value)">
                            <option value="user" ${user.role === 'user' ? 'selected' : ''}>Користувач</option>
                            <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Адмін</option>
                        </select>
                    </td>
                    <td><button onclick="deleteUser('${user._id}')">Видалити</button></td>
                `;
            });
        })
        .catch(error => console.error("Error:", error));
}

function deleteUser(userId) {
    fetch(`/admin/users/${userId}`, {
        method: 'DELETE'
    })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            loadUsers();
        })
        .catch(error => console.error("Error:", error));
}

function updateRole(userId, newRole) {
    fetch(`/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: newRole })
    })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
        })
        .catch(error => console.error("Error:", error));
}
