const modalElem = document.querySelector('.modal')
const modalClose = document.querySelector('.closeModal')
const modalOk = document.querySelector('.okModal')
const modalText = document.querySelector('.modalText')

const closeModal = (e) => {
    const target = e.target

    if (target === modalElem || target === modalOk || target === modalClose || e.code === 'Escape') {
        modalElem.style.opacity = 0

        setTimeout(() => {
            modalElem.style.visibility = 'hidden'
        }, 300)

        window.removeEventListener('keydown', closeModal)
    }
}

export const openModal = (text) => {
    modalText.textContent = text
    modalElem.style.visibility = 'visible'
    modalElem.style.opacity = 1
    window.addEventListener('keydown', closeModal)
}

modalElem.addEventListener('click', closeModal)
