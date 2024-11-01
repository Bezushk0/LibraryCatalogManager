function updateMenu(isLoggedIn, userRole) {
    const loginLink = document.getElementById('login-link');
    const profileLink = document.getElementById('profile-link');

    if (isLoggedIn) {
        loginLink.style.display = 'none';
        profileLink.style.display = 'block';

        if (userRole === 'admin') {
            profileLink.href = '/admin_home';
        } else {
            profileLink.href = '/user_home';
        }
    } else {
        loginLink.style.display = 'block';
        profileLink.style.display = 'none';
    }
}

authForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (!username || !password) {
        alert("Будь ласка, заповніть всі поля.");
        return;
    }

    fetch('/login', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
})
    .then(response => response.json())
    .then(data => {
        console.log("Відповідь від сервера:", data);
        
        if (data.redirect_url) {
            window.location.href = data.redirect_url;
        } else {
            alert("Помилка при вході. Перевірте ім'я користувача та пароль.");
        }
    });
});


registerForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const username = document.getElementById("new-username").value;
    const password = document.getElementById("new-password").value;
    const email = document.getElementById("email").value;

    if (!username || !password || !email) {
        alert("Будь ласка, заповніть всі поля.");
        return;
    }

    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password, email })
    })
        .then(response => {
            if (response.ok) {
                return response.json().then(data => {
                    alert("Реєстрація пройшла успішно!");
                    updateMenu(true, data.role);
                    modal.style.display = "none";
                    window.location.href = data.role === 'admin' ? '/admin_home' : '/user_home';
                });
            } else {
                return response.json().then(data => {
                    alert(data.error);
                });
            }
        });
});



