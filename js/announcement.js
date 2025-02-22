// document.addEventListener("DOMContentLoaded", function () {
//     function startScrolling(listId) {
//         const list = document.getElementById(listId);
//         if (!list) return;

//         let items = list.children;
//         let delay = 3000; // 3 seconds pause before scrolling
//         let scrollSpeed = 800; // Scroll transition speed in ms

//         function scroll() {
//             if (items.length > 1) {
//                 list.style.transition = `transform ${scrollSpeed}ms ease-in-out`;
//                 list.style.transform = `translateY(-${items[0].offsetHeight}px)`;

//                 setTimeout(() => {
//                     list.appendChild(items[0]); // Move first item to the end
//                     list.style.transition = "none"; // Disable transition for instant reset
//                     list.style.transform = "translateY(0)"; // Reset position
//                 }, scrollSpeed);
//             }
//         }

//         setInterval(scroll, delay + scrollSpeed);
//     }

//     startScrolling("announcement-list");
//     startScrolling("publications-list");
// });
