document.addEventListener("DOMContentLoaded", function () {
    const video = document.querySelector(".bg-video");

    if (video) {
        video.playbackRate = 0.8; // Start slightly slow

        // Smooth fade-in effect
        video.style.opacity = "0";
        video.style.transition = "opacity 2s ease-in-out";
        setTimeout(() => {
            video.style.opacity = "1";
        }, 500);

        video.addEventListener("timeupdate", function () {
            const remainingTime = 5.2 - video.currentTime;

            // Instead of dropping the frame rate drastically, we slow down gently
            if (remainingTime <= 1.8) video.playbackRate = 0.7;
            if (remainingTime <= 1.2) video.playbackRate = 0.6;
            if (remainingTime <= 0.9) video.playbackRate = 0.5;
            if (remainingTime <= 0.7) video.playbackRate = 0.4;
            if (remainingTime <= 0.5) video.playbackRate = 0.3;
            if (remainingTime <= 0.3) video.playbackRate = 0.2;
            if (remainingTime <= 0.2) video.playbackRate = 0.15;
            if (remainingTime <= 0.1) video.playbackRate = 0.1; // Just a touch of motion

            // Fade out slightly to blend the stop naturally
            if (remainingTime <= 0.8) {
                video.style.transition = "opacity 2s ease-out";
                video.style.opacity = "0.8";
            }
            if (remainingTime <= 0.3) {
                video.style.opacity = "0.5";
            }

            // Stop exactly at 5.2s without a jarring freeze
            if (video.currentTime >= 5.2) {
                video.pause();
                video.currentTime = 5.2;
                video.style.opacity = "0.4"; // Keep it subtly faded to make the stop natural
            }
        });
    }
});
