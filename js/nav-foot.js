document.addEventListener("DOMContentLoaded", function() {
    // Load Navbar
    fetch("../navbar.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("navbar-container").innerHTML = data;
        });

    // Load Footer
    fetch("../footer.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("footer-container").innerHTML = data;
        });
});
