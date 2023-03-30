import { getCellIndexes } from './helpers.js'

export class Food {
    constructor(amount, x, y) {
        this.amount = amount
        this.x = Math.round(x)
        this.y = Math.round(y)
        this.size = 100
    }

    draw(ctx) {
        ctx.beginPath()
        // ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.save()
        ctx.fillStyle = `rgba(0, ${this.amount}, 0, 1)`
        ctx.fillRect(this.x, this.y, this.size, this.size)
        ctx.fill()
        ctx.restore()
    }

    fillCels(colors, pxPerCell) {
        for (let i = 0; i < this.size; i += pxPerCell) {
            for (let j = 0; j < this.size; j++) {
                const toX = this.x + i
                const toY = this.y + j
                const { row, column } = getCellIndexes(toX, toY, pxPerCell)
                colors[row][column].isFood = true
                colors[row][column].foodAmount = this.amount
            }
        }
    }
}
