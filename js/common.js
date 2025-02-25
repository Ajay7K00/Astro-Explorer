document.addEventListener("DOMContentLoaded", function () {
    let basePath = window.location.pathname.includes("Astro-Explorer") ? "/Astro-Explorer" : "";

    // Load Navbar
    document.getElementById("navbar-container").innerHTML = `
        <nav class="navbar">
            <div class="logo">
                <img src="${basePath}/img/sun.png" alt="logo">
            </div>
            <section class="nav-text">
                <p class="text-nav">SPACE</p>
                <p class="text-nav-small">Space-weather & Plasma Analysis Center for Exploration</p>
            </section>
            <ul class="nav-list">
                <li><a href="${basePath}/index.html">Home</a></li>
                <li><a href="#">Explore</a>
                    <ul class="dropdown">
                        <li><a href="${basePath}/html/Posters.html">Posters</a></li>
                    </ul>
                </li>
                <li><a href="${basePath}/html/people.html">People</a></li>
                <li><a href="${basePath}/html/publications.html">Publications</a></li>
                <li><a href="${basePath}/html/support.html">Support Us</a></li>
            </ul>
            <div class="menu-toggle">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </nav>
    `;

    // Load Footer
    document.getElementById("footer-container").innerHTML = `
        <footer class="footer">
            <div class="footer-container">
                <div class="footer-logo">
                    <img src="${basePath}/img/sun.png" alt="SPACE Lab Logo">
                </div>
                <div class="footer-links">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><a href="${basePath}/index.html">Home</a></li>
                        <li><a href="${basePath}/html/people.html">People</a></li>
                        <li><a href="${basePath}/html/publications.html">Publications</a></li>
                        <li><a href="${basePath}/html/support.html">Support Us</a></li>
                    </ul>
                </div>
                <div class="footer-contact">
                    <h3>Contact Us</h3>
                    <p>Email: <a href="mailto:info@sparclab.com">spac3.1a6@gmail.com</a></p>
                    <p>Follow us:</p>
                    <div class="social-icons-footer">
                        <a href="#" target="_blank"><i class="fab fa-twitter"></i></a>
                        <a href="#" target="_blank"><i class="fab fa-linkedin"></i></a>
                        <a href="#" target="_blank"><i class="fab fa-github"></i></a>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                &copy; 2025 SPACE Lab | Space-weather, Plasma & Aeronomy Center for Exploration. All rights reserved.
            </div>
        </footer>
    `;

    // 🔹 Run the navbar toggle script AFTER navbar loads
    initNavbarToggle();
});

function initNavbarToggle() {
    const menuToggle = document.querySelector(".menu-toggle");
    const navList = document.querySelector(".nav-list");
    const navLinks = document.querySelectorAll(".nav-list a");
    const dropdownMenus = document.querySelectorAll(".dropdown");

    if (!menuToggle || !navList) {
        console.error("Navbar elements not found.");
        return;
    }

    // Toggle mobile menu
    menuToggle.addEventListener("click", function (event) {
        event.stopPropagation();
        navList.classList.toggle("active");
        menuToggle.classList.toggle("open");

        if (!navList.classList.contains("active")) {
            closeAllDropdowns();
        }
    });

    // Handle link clicks (dropdown toggle or navigation)
    navLinks.forEach(link => {
        link.addEventListener("click", function (event) {
            const dropdown = link.nextElementSibling;

            if (dropdown && dropdown.classList.contains("dropdown")) {
                event.preventDefault(); // Prevent navigation
                dropdown.classList.toggle("show");

                // Close other dropdowns
                dropdownMenus.forEach(otherDropdown => {
                    if (otherDropdown !== dropdown) {
                        otherDropdown.classList.remove("show");
                    }
                });
            } else {
                closeNavbar();
            }
        });
    });

    // Close navbar and dropdowns when clicking outside
    document.addEventListener("click", function (event) {
        if (!navList.contains(event.target) && !menuToggle.contains(event.target)) {
            closeNavbar();
            closeAllDropdowns();
        }
    });

    function closeNavbar() {
        navList.classList.remove("active");
        menuToggle.classList.remove("open");
    }

    function closeAllDropdowns() {
        dropdownMenus.forEach(dropdown => dropdown.classList.remove("show"));
    }
}
