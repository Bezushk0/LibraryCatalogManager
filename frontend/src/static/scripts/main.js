document.addEventListener('DOMContentLoaded', function () {
    // Ініціалізація слайдера Swiper
    new Swiper('.swiper-container', {
        loop: true,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
    });

    const modal = document.getElementById("modal");
    const authForm = document.getElementById("authForm");
    const registerForm = document.getElementById("registerForm");
    const modalTitle = document.getElementById("modal-title");

    // Відкриття модального вікна для входу
    document.querySelector('a[href="#contact"]').addEventListener("click", function (event) {
        event.preventDefault();
        modal.style.display = "block";
        authForm.style.display = "block";
        registerForm.style.display = "none";
        modalTitle.textContent = "Вхід";
    });

    // Перехід на форму реєстрації
    document.getElementById("register").addEventListener("click", function () {
        authForm.style.display = "none";
        registerForm.style.display = "block";
        modalTitle.textContent = "Реєстрація";
    });

    // Повернення на форму входу
    document.getElementById("backToLogin").addEventListener("click", function () {
        authForm.style.display = "block";
        registerForm.style.display = "none";
        modalTitle.textContent = "Вхід";
    });

    // Закриття модального вікна при натисканні на кнопку закриття
    document.querySelector(".close-button").addEventListener("click", function () {
        modal.style.display = "none";
    });

    // Закриття модального вікна при кліку поза його межами
    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
});
