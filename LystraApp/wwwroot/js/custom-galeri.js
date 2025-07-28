const swiper = new Swiper('.gallerySwiper', {
    loop: true,
    autoplay: {
        delay: 3500,
        disableOnInteraction: false,
    },
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 'auto',
    coverflowEffect: {
        rotate: 30,
        stretch: 0,
        depth: 200,
        modifier: 1,
        slideShadows: true,
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    breakpoints: {
        0: {
            slidesPerView: 1,
        },
        600: {
            slidesPerView: 1.2,
        },
        900: {
            slidesPerView: 2.2,
        },
        1200: {
            slidesPerView: 3,
        }
    }
});
// Fullscreen modal logic

document.querySelectorAll('.swiper-slide img').forEach(function(img) {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', function() {
        document.getElementById('modalImage').src = this.src;
        document.getElementById('imgModal').style.display = 'flex';
    });
});
document.getElementById('closeModal').onclick = function() {
    document.getElementById('imgModal').style.display = 'none';
};
document.getElementById('imgModal').onclick = function(e) {
    if (e.target === this) this.style.display = 'none';
};
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') document.getElementById('imgModal').style.display = 'none';
}); 