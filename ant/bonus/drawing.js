import { ctx } from './canvas.js'

export const drawColony = (coord) => {
    const size = 50
    ctx.beginPath()
    ctx.arc(coord.x, coord.y, size, 0, Math.PI * 2)

    ctx.fillStyle = 'rgba(0, 0, 255, 1)'
    ctx.fill()
}

export const drawFood = (coord, foodAmount) => {
    ctx.beginPath()
    ctx.arc(coord.x, coord.y, foodAmount / 10, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(0, 255, 0, ${foodAmount / 1000})`
    ctx.fill()
}
