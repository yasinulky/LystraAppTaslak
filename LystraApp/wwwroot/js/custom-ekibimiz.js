const ekipSwiperUltra = new Swiper('.ekipSwiperUltra', {
    loop: false,
    centeredSlides: false,
    slidesPerView: 3,
    spaceBetween: 24,
    grabCursor: true,
    pagination: {
        el: '.ekip-pagination-ultra',
        clickable: true,
    },
    navigation: {
        nextEl: '.ekip-next-ultra',
        prevEl: '.ekip-prev-ultra',
    },
    breakpoints: {
        0: {
            slidesPerView: 1,
        },
        600: {
            slidesPerView: 2,
        },
        900: {
            slidesPerView: 3,
        }
    }
});
function openMemberModalUltra(button) {
    const slide = button.closest('.swiper-slide');
    const memberData = JSON.parse(slide.dataset.member);
    const modal = document.getElementById('memberModalUltra');
    document.getElementById('memberModalImageUltra').src = memberData.image;
    document.getElementById('memberModalNameUltra').textContent = memberData.name;
    document.getElementById('memberModalRoleUltra').textContent = memberData.role;
    document.getElementById('memberModalBioUltra').textContent = memberData.bio;
    let socialHTML = '';
    if(memberData.email) socialHTML += `<a href='mailto:${memberData.email}' title='E-posta'><i class='fa fa-envelope'></i></a>`;
    if(memberData.linkedin) socialHTML += `<a href='${memberData.linkedin}' target='_blank' title='LinkedIn'><i class='fa fa-linkedin'></i></a>`;
    if(memberData.twitter) socialHTML += `<a href='${memberData.twitter}' target='_blank' title='Twitter'><i class='fa fa-twitter'></i></a>`;
    document.getElementById('memberModalSocialUltra').innerHTML = socialHTML;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}
function closeMemberModalUltra() {
    const modal = document.getElementById('memberModalUltra');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}
document.getElementById('memberModalUltra').addEventListener('click', function(e) {
    if (e.target === this) closeMemberModalUltra();
});
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeMemberModalUltra();
}); 