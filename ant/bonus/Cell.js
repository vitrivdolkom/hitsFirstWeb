import { inRange } from './helpers.js   '

export const EVAPORATION_TIME = 1
export const PHEROMONE_EVAPORATION = 0.9

export class Cell {
    constructor(x, y, row, column, size) {
        this.x = x
        this.y = y
        this.row = row
        this.column = column
        this.size = size
        this.foodMarker = 1
        this.homeMarker = 1
        this.distanceToHome = 100000
        this.distanceToFood = 100000
        this.empty = true
        this.isHome = false
        this.isFood = false
        this.color = 'black'
        this.start = null
    }

    setIsFood(foodBlock) {
        this.isFood = true
        this.foodBlock = foodBlock
        this.foodMarker = this.foodBlock.amount
    }

    visitFood() {
        if (!this.foodBlock.isEaten) {
            this.foodBlock.eatit()
            return true
        } else {
            return false
        }
    }

    setIsHome(amount) {
        this.isHome = true
        this.homeMarker = amount
    }

    draw(context) {
        if (this.isHome || this.isFood) return

        const color =
            this.foodMarker > 10
                ? `rgba(0, ${inRange(this.foodMarker, 0, 1500, 0, 255)}, 0, 1)`
                : `rgba(${inRange(this.homeMarker, 0, 100, 0, 255)},0, 0, 1)`

        this.color = color

        context.beginPath()
        context.save()
        context.fillStyle = 'black'
        context.fillRect(this.x, this.y, this.size, this.size)
        context.restore()

        context.beginPath()
        context.save()
        context.fillStyle = color
        context.fillRect(this.x, this.y, this.size, this.size)
        context.restore()

        // context.beginPath()
        // context.save()
        // context.fillStyle = color
        // context.arc(this.x, this.y, this.size / 3, 0, Math.PI * 2)
        // context.restore()
    }

    visit(ant) {
        if (ant.goHome) {
            this.foodMarker += ant.isHero ? ant.food : ant.food / 10
        } else {
            this.homeMarker += 10
        }
    }

    update(context) {
        if (this.isHome || this.isFood) return

        if (this.empty) {
            this.empty = false
            this.start = new Date()
        }

        const now = new Date()
        const lifetime = (now.getTime() - this.start.getTime()) / 1000
        const evaporate = Math.floor(Math.max(1, lifetime / EVAPORATION_TIME))
        this.foodMarker *= Math.pow(PHEROMONE_EVAPORATION, evaporate)
        // this.homeMarker *= Math.pow(PHEROMONE_EVAPORATION, evaporate)

        this.foodMarker = Math.max(1, this.foodMarker)
        // this.homeMarker = Math.max(1, this.homeMarker)

        this.start = new Date()
        this.draw(context)
    }
}
