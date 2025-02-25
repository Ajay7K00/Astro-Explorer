document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("navbar-container").innerHTML = `
        <nav class="navbar">
            <div class="logo">
                <img src="/img/sun.png" alt="logo">
            </div>
            <section class="nav-text">
                <p class="text-nav">SPACE</p>
                <p class="text-nav-small">Space-weather & Plasma Analysis Center for Exploration</p>
            </section>
            <ul class="nav-list">
                <li><a href="/index.html">Home</a></li>
                <li><a href="#">Explore</a>
                    <ul class="dropdown">
                        <li><a href="/html/Posters.html">Posters</a></li>
                    </ul>
                </li>
                <li><a href="/html/people.html">People</a></li>
                <li><a href="/html/publications.html">Publications</a></li>
                <li><a href="/html/support.html">Support Us</a></li>
            </ul>
            <div class="menu-toggle">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </nav>
    `;

    document.getElementById("footer-container").innerHTML = `
        <!-- footer.html -->
<footer class="footer">
    <div class="footer-container">
        <!-- Logo -->
        <div class="footer-logo">
            <img src="img/sun.png" alt="SPACE Lab Logo">
        </div>

        <!-- Quick Links -->
        <div class="footer-links">
            <h3>Quick Links</h3>
            <ul>
                <li><a href="index.html">Home</a></li>
                <li><a href="people.html">People</a></li>
                <li><a href="publications.html">Publications</a></li>
                <li><a href="support.html">Support Us</a></li>
            </ul>
        </div>

        <!-- Contact Info -->
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

    <!-- Copyright -->
    <div class="footer-bottom">
        &copy; 2025 SPACE Lab | Space-weather, Plasma & Aeronomy Center for Exploration. All rights reserved.
    </div>
</footer>

    `;
});
