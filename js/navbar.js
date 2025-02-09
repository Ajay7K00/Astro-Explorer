document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.querySelector(".menu-toggle");
    const navList = document.querySelector(".nav-list");
    const navLinks = document.querySelectorAll(".nav-list a");
    const dropdownMenus = document.querySelectorAll(".dropdown");

    // Toggle mobile menu
    menuToggle.addEventListener("click", function (event) {
        event.stopPropagation(); // Prevents event from bubbling up
        navList.classList.toggle("active");
        menuToggle.classList.toggle("open");
    });

    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener("click", function () {
            navList.classList.remove("active");
            menuToggle.classList.remove("open");
        });
    });

    // Close menu when clicking outside
    document.addEventListener("click", function (event) {
        if (!navList.contains(event.target) && !menuToggle.contains(event.target)) {
            navList.classList.remove("active");
            menuToggle.classList.remove("open");
        }
    });

    // Handle dropdown toggling
    dropdownMenus.forEach(dropdown => {
        const parent = dropdown.parentElement;

        parent.addEventListener("click", function (event) {
            event.stopPropagation(); // Prevent click from closing menu
            dropdown.classList.toggle("show");

            // Close other open dropdowns
            dropdownMenus.forEach(otherDropdown => {
                if (otherDropdown !== dropdown) {
                    otherDropdown.classList.remove("show");
                }
            });
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener("click", function (event) {
        dropdownMenus.forEach(dropdown => {
            if (!dropdown.parentElement.contains(event.target)) {
                dropdown.classList.remove("show");
            }
        });
    });
});
