export const EVAPORATION_TIME = 1000

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
    }

    setIsFood(foodBlock) {
        this.isFood = true
        this.foodBlock = foodBlock
    }

    setIsHome() {
        this.isHome = true
    }

    draw(context) {
        const color = this.isHome ? 'red' : this.isFood ? 'green' : 'grey'

        // context.beginPath()
        // context.save()
        // context.strokeStyle = color
        // context.strokeRect(this.x, this.y, this.size, this.size)
        // context.restore()
    }

    visit(ant) {
        if (ant.goHome) {
            this.foodMarker += ant.food / 10
        } else {
            this.homeMarker += 10
        }
    }

    update() {
        if (this.empty) {
            this.empty = false
            this.start = performance.now()
        }

        const lifetime = performance.now() - this.start
        const evaporate = Math.max(1, lifetime / EVAPORATION_TIME)

        this.foodMarker += 1 - evaporate
        this.homeMarker += 1 - evaporate
    }
}
