import { openModal } from './modal.js'

const toModal = document.querySelectorAll('.openModal')

toModal.forEach((link) => {
    link.addEventListener('click', () => {
        openModal('f;jsdlfkdf')
    })
})
