document.addEventListener('DOMContentLoaded', function() {
    scrollNav();

    fixedNav();
})

function fixedNav() {
    const navBar = document.querySelector('.header')

    const observer = new IntersectionObserver( function (entries) {
        if (entries[0].isIntersecting) {
            navBar.classList.remove('fixed');
        }
        else {
            navBar.classList.add('fixed');
        }
    })

    // Element to observe
    observer.observe(document.querySelector('main'));
}

function scrollNav() {
    const links = document.querySelectorAll('.header__nav a');

    links.forEach( function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const section = document.querySelector(e.target.attributes.href.value);

            section.scrollIntoView({
                behavior: 'smooth'
            })
        })
    })
}



document.addEventListener('DOMContentLoaded', function() {
    createGallery();
});

function createGallery() {
    const gallery = document.querySelector('.gallery__list')

    for (let i = 1; i < 13; i++) {
        const img = document.createElement('IMG');
        img.src = `build/img/thumb/${i}.webp`;
        img.dataset.imgId = i;
        img.classList.add('gallery__image')
        img.onclick = showImg;

        const list = document.createElement('LI')
        list.appendChild(img)
        gallery.appendChild(list)
    }
}

function showImg(e){
    
    const id = parseInt(e.target.dataset.imgId)

    // Generating image
    const img = document.createElement('IMG');
    img.src = `build/img/grande/${id}.webp`;

    // Overlay
    const overlay = document.createElement('DIV');
    overlay.appendChild(img);
    overlay.classList.add('overlay-gallery');

    // Button
    const btn = document.createElement('P');
    btn.textContent = 'X';
    btn.classList.add('btn-close');
    overlay.appendChild(btn);
    btn.onclick = function () {
        overlay.remove();
        body.classList.remove('body-fixed')
    }

    // Show HTML
    const body = document.querySelector('body');
    body.appendChild(overlay);
    body.classList.add('body-fixed')

}