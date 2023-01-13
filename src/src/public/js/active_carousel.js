window.addEventListener('load', () => {
    const carousel_inners = document.querySelectorAll('.carousel-inner');
    for (var i = 0; i < carousel_inners.length; i++) {
        carousel_inners[i].firstElementChild.classList.add("active");
    }
})