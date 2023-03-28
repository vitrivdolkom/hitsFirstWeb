export const canvas = document.querySelector('canvas')
export const canvasRect = canvas.getBoundingClientRect()
export const ctx = canvas.getContext('2d')

const canvasWrapper = document.querySelector('.canvasWrapper')

canvas.width = canvasWrapper.clientWidth
canvas.height = canvasWrapper.clientHeight

export const withPixel = (num) => {
    return `${num}px`
}
