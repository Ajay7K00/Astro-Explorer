    document.addEventListener("DOMContentLoaded", function () {
        const images = [
            "photo_album/space1.jpg",
            "photo_album/space2.jpg",
        ];

        let currentIndex = 0;
        const albumContainer = document.querySelector(".photo-album");
        const img1 = document.querySelector("#photo-slide-1");
        const img2 = document.querySelector("#photo-slide-2");
        const prevBtn = document.querySelector("#prev-btn");
        const nextBtn = document.querySelector("#next-btn");
    
        let isAnimating = false; // Prevents rapid clicking issues
    
        function updateImages(next = true) {
            if (isAnimating) return;
            isAnimating = true;
    
            const currentImage = document.querySelector(".photo-album img.active");
            const nextImage = document.querySelector(".photo-album img.next");
    
            currentIndex = next
                ? (currentIndex + 1) % images.length
                : (currentIndex - 1 + images.length) % images.length;
    
            nextImage.src = images[currentIndex];
    
            // Reset position for a continuous effect
            nextImage.style.transform = next ? "translateX(100%)" : "translateX(-100%)";
            setTimeout(() => {
                currentImage.style.transition = "transform 1s ease-in-out";
                nextImage.style.transition = "transform 1s ease-in-out";
    
                currentImage.style.transform = next ? "translateX(-100%)" : "translateX(100%)";
                nextImage.style.transform = "translateX(0)";
    
                nextImage.classList.add("active");
                currentImage.classList.remove("active");
    
                setTimeout(() => {
                    currentImage.classList.add("next");
                    currentImage.classList.remove("active");
                    currentImage.style.transform = "translateX(100%)"; // Reset for next transition
                    nextImage.classList.remove("next");
                    isAnimating = false;
                }, 1000);
            }, 50);
        }
    
        // Auto-slide every 4 seconds
        let slideInterval = setInterval(updateImages, 4000);
    
        // Manual controls
        nextBtn.addEventListener("click", () => {
            clearInterval(slideInterval);
            updateImages(true);
            slideInterval = setInterval(updateImages, 4000);
        });
    
        prevBtn.addEventListener("click", () => {
            clearInterval(slideInterval);
            updateImages(false);
            slideInterval = setInterval(updateImages, 4000);
        });
    });