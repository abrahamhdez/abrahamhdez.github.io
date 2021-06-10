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


