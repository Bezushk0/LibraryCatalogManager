document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById("modal");
    const authForm = document.getElementById("authForm");
    const registerForm = document.getElementById("registerForm");
    const modalTitle = document.getElementById("modal-title");

    document.querySelector('a[href="#contact"]').addEventListener("click", function (event) {
        event.preventDefault();
        modal.style.display = "block";
        authForm.style.display = "block";
        registerForm.style.display = "none";
        modalTitle.textContent = "Вхід";
    });

    document.getElementById("register").addEventListener("click", function () {
        authForm.style.display = "none";
        registerForm.style.display = "block";
        modalTitle.textContent = "Реєстрація";
    });

    document.getElementById("backToLogin").addEventListener("click", function () {
        authForm.style.display = "block";
        registerForm.style.display = "none";
        modalTitle.textContent = "Вхід";
    });

    document.querySelector(".close-button").addEventListener("click", function () {
        modal.style.display = "none";
    });

    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
});
