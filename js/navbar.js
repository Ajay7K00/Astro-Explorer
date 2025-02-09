document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.querySelector(".menu-toggle");
    const navList = document.querySelector(".nav-list");

    menuToggle.addEventListener("click", function () {
        navList.classList.toggle("active");
        menuToggle.classList.toggle("open");
    });

    document.querySelectorAll(".nav-list a").forEach(item => {
        item.addEventListener("click", function () {
            navList.classList.remove("active");
            menuToggle.classList.remove("open");
        });
    });
});
