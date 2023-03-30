import { Ant } from './Ant.js'
import { getRandomArbitrary } from './helpers.js'

export class Colony {
    constructor(x, y, antsNum, canvas) {
        this.food = 0
        this.x = x
        this.y = y
        this.radius = 20
        this.isLocated = false
        this.antsNum = antsNum
        this.ants = new Array(this.antsNum)
        this.canvas = canvas

        for (let i = 0; i < this.antsNum; i++) {
            const angle = getRandomArbitrary(0, 360)

            const antCoordinates = {
                x: Math.round(this.x + this.radius * Math.cos((angle * Math.PI) / 180)),
                y: Math.round(this.y + this.radius * Math.sin((angle * Math.PI) / 180)),
            }

            this.ants[i] = new Ant(this, i, antCoordinates.x, antCoordinates.y, canvas.width, canvas.height, angle)
        }
    }

    drawAnts(context, colors, pxPerCell) {
        // const view = context.getImageData(0, 0, this.canvas.width, this.canvas.height).data
        const view = 0

        for (let i = 0; i < this.antsNum; i++) {
            this.ants[i].draw(context, view, colors, pxPerCell)
        }
    }

    draw(context) {
        context.beginPath()
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        context.fill()
    }

    update(context, colors, pxPerCell) {
        // const view = context.getImageData(0, 0, this.canvas.width, this.canvas.height).data
        const view = 0
        for (let i = 0; i < this.antsNum; i++) {
            this.ants[i].update(view, colors, pxPerCell)
        }
    }
}
