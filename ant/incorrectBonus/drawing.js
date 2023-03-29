import { ctx, canvas, withPixel } from './canvas.js'

export const drawColony = (coord) => {
    const colony = document.createElement('div')

    colony.classList.add('colony')
    canvas.appendChild(colony)

    colony.style.top = withPixel(coord.y - colony.clientHeight / 2)
    colony.style.left = withPixel(coord.x - colony.clientWidth / 2)
}

export const drawFood = (e, amount, coord) => {
    const colony = document.createElement('div')
    colony.classList.add('food')
    colony.style.width = withPixel(Math.floor(amount / 3))
    colony.style.height = withPixel(Math.floor(amount / 3))

    canvas.appendChild(colony)

    colony.style.top = withPixel(coord.y - colony.clientHeight / 2)
    colony.style.left = withPixel(coord.x - colony.clientWidth / 2)

    const datat = ctx.getImageData(coord.x, coord.y, 10, 10).data
}

export const drawAnt = (i, fromX, fromY) => {
    const colony = document.querySelector('.colony')
    const x = fromX
    const y = fromY

    const ant = document.createElement('div')
    ant.classList.add('ant')
    ant.setAttribute('data-ant-id', i)

    canvas.appendChild(ant)

    ant.style.top = withPixel(Math.floor(y))
    ant.style.left = withPixel(Math.floor(x))
}
