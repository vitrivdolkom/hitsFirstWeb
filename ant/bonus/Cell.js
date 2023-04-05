import { inRange } from './helpers.js   '

export const EVAPORATION_TIME = 5
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
        this.distanceToHome = 1000
        this.distanceToFood = 1000
        this.empty = true
        this.isHome = false
        this.isFood = false
        this.color = 'black'
        this.start = null
    }

    setIsFood(foodBlock) {
        this.isFood = true
        this.foodBlock = foodBlock
        this.foodMarker = this.foodBlock.amount * 200
        this.distanceToFood = 0.00000001
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
        this.distanceToHome = 0.00000001
    }

    draw(context) {
        let color =
            this.foodMarker > 100
                ? `rgba(0, ${inRange(this.foodMarker, 0, 5000, 40, 220)}, 0, 1)`
                : `rgba(${inRange(Math.min(this.homeMarker, 200), 0, 200, 20, 235)},0, 0, 1)`

        color = this.isHome ? 'rgb(255, 0, 0)' : color
        color = this.isFood ? `rgb(26, ${inRange(this.foodMarker / 200, 0, 500, 40, 200)}, 1)` : color

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
    }

    visit(ant) {
        if (ant.goHome) {
            this.foodMarker += ant.isHero ? ant.food : ant.food / 2
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
        const evaporate = Math.round(lifetime / EVAPORATION_TIME)
        this.foodMarker *= Math.pow(PHEROMONE_EVAPORATION, evaporate)
        this.homeMarker *= Math.pow(PHEROMONE_EVAPORATION, evaporate)

        this.foodMarker = Math.max(1, this.foodMarker)
        this.homeMarker = Math.max(1, this.homeMarker)

        if (lifetime > 5 && this.foodMarker > 4000) {
            this.start = new Date()
        } else if (lifetime > 2) {
            this.start = new Date()
        }

        if (this.foodMarker > 5000) this.foodMarker = 4500
        if (this.homeMarker > 200) this.homeMarker = 200

        this.draw(context)
    }
}
