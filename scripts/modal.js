const modalElem = document.querySelector('.modal')
const modalClose = document.querySelector('.closeModal')
const modalOk = document.querySelector('.okModal')
const modalText = document.querySelector('.modalText')

const closeModal = (e) => {
    const target = e.target

    if (target === modalElem || target === modalOk || target === modalClose || e.code === 'Escape') {
        modalElem.classList.add('disableOpacity')

        setTimeout(() => {
            modalElem.classList.add('hide')
        }, 300)

        window.removeEventListener('keydown', closeModal)
    }
}

export const openModal = (text) => {
    modalText.innerHTML = text

    modalElem.classList.add('show')
    modalElem.classList.remove('disableOpacity')
    modalElem.classList.remove('hide')

    window.addEventListener('keydown', closeModal)
}

modalElem.addEventListener('click', closeModal)
