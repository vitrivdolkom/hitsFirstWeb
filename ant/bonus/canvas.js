export const canvas = document.querySelector('canvas')
export const canvasRect = canvas.getBoundingClientRect()
export const ctx = canvas.getContext('2d')

export const withPixel = (num) => {
    return `${num}px`
}
