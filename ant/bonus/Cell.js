import { inRange } from './helpers.js   '

export const EVAPORATION_TIME = 0.1
export const PHEROMONE_EVAPORATION = 0.95

export class Cell {
    constructor(x, y, row, column, size) {
        this.x = x
        this.y = y
        this.row = row
        this.column = column
        this.size = size
        this.foodMarker = 1
        this.homeMarker = 1
        this.empty = true
        this.isHome = false
        this.isFood = false
        this.isWall = false
        this.color = 'black'
        this.start = null
    }

    setIsFood(foodBlock) {
        this.isFood = true
        this.foodBlock = foodBlock
        this.foodMarker = this.foodBlock.amount * 200
    }

    setIsWall() {
        this.isWall = true
    }

    setIsHome(amount) {
        this.isHome = true
        this.homeMarker = 200000000000
    }

    draw(context) {
        let color =
            this.foodMarker > 300
                ? `rgba(0, 0, ${inRange(this.foodMarker, 1, 7000, 40, 240)}, 1)`
                : `rgba(${inRange(this.homeMarker, 1, 40000, 10, 200)},0, 0, 1)`

        color = this.isHome ? 'rgb(255, 0, 0)' : color
        color = this.isFood ? `rgb(26, ${inRange(this.foodMarker / 200, 0, 500, 40, 200)}, 1)` : color
        color = this.isWall ? 'grey' : color

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
            this.foodMarker += ant.food
        } else {
            this.homeMarker += ant.home
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

        if (evaporate) {
            this.start = new Date()
        }

        this.draw(context)
    }
}
