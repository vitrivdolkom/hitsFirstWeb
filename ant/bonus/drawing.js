import { ctx } from './canvas.js'

export const drawColony = (x, y) => {
    const size = 50
    ctx.beginPath()
    ctx.arc(x, y, size, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(255, 0, 0, 1)'
    ctx.fill()
}

export const drawFood = (x, y, foodAmount) => {
    ctx.beginPath()
    ctx.arc(x, y, foodAmount / 10, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(0, 255, 0, ${foodAmount / 1000})`
    ctx.fill()
}
