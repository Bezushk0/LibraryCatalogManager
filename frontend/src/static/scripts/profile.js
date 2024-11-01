document.addEventListener('DOMContentLoaded', function () {
    const profileSection = document.getElementById("my-profile");

    function loadProfile() {
        fetch('/profile')
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Не вдалося отримати дані профілю');
            })
            .then(data => {
                profileSection.querySelector('h2').textContent = `Мій профіль`;
                profileSection.querySelector('p:nth-of-type(1)').textContent = `Ім'я: ${data.name}`;
                profileSection.querySelector('p:nth-of-type(2)').textContent = `Електронна пошта: ${data.email}`;
            })
            .catch(error => {
                console.error(error);
                profileSection.innerHTML = "<p>Не вдалося завантажити профіль. Будь ласка, спробуйте ще раз.</p>";
            });
    }

    loadProfile();
});
