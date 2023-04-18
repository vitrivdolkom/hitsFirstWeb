const burger = document.querySelector('.burger')
const nav = document.querySelector('.nav')
const body = document.querySelector('body')
const menuLinks = document.querySelectorAll('.link')

burger.addEventListener('click', () => {
    burger.classList.toggle('active')
    nav.classList.toggle('active')
    body.classList.toggle('lock')
})

menuLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
        if (burger.classList.contains('active')) {
            burger.classList.remove('active')
            nav.classList.remove('active')
            body.classList.remove('lock')
        }
    })
})
