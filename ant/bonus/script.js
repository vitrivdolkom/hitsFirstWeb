import { getRandomArbitrary } from './helpers.js'

window.addEventListener('load', function () {
    const canvasWrapper = document.querySelector('.canvasWrapper')
    const locateColonyInput = document.querySelector('input[name=locateColony]')
    const locateFood = document.querySelector('input[name=locateFood]')
    const foodAmount = document.querySelector('input[type=range]')
    const executeBtn = document.querySelector('.execute')
    const ANTS_NUM = 200

    // todo canvas
    const canvas = document.querySelector('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = canvasWrapper.clientWidth
    canvas.height = canvasWrapper.clientHeight

    ctx.fillStyle = `rgba(255, 0, 0, 1)`

    class Colony {
        constructor(x, y, antsNum, canvas) {
            this.food = 0
            this.x = x
            this.y = y
            this.radius = 50
            this.isLocated = false
            this.antsNum = antsNum
            this.ants = new Array(this.antsNum)

            for (let i = 0; i < this.antsNum; i++) {
                this.ants[i] = new Ant()
                const angle = getRandomArbitrary(0, 360)

                const antCoordinates = {
                    x: Math.round(this.x + this.radius * Math.cos((angle * Math.PI) / 180)),
                    y: Math.round(this.y + this.radius * Math.sin((angle * Math.PI) / 180)),
                }

                this.ants[i] = new Ant(this, i, antCoordinates.x, antCoordinates.y, canvas.width, canvas.height, angle)
            }
        }

        drawAnts(context, view) {
            for (let i = 0; i < this.antsNum; i++) {
                this.ants[i].draw(context, view)
                // this.ants[i].drawVisit(context)
            }
        }

        draw(context) {
            context.beginPath()
            context.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
            context.fill()
        }

        update(view) {
            for (let i = 0; i < this.antsNum; i++) {
                this.ants[i].update(view)
            }
        }
    }

    class Ant {
        constructor(colony, id, x, y, maxX, maxY, angle) {
            this.colony = colony
            this.id = id
            this.x = x
            this.y = y
            this.radius = 2
            this.angle = angle
            this.alfa = 1
            this.beta = 1
            this.maxX = maxX
            this.maxY = maxY
            this.food = 0
            this.prevPoint = { x: this.x, y: this.y }
            this.path = []
        }

        draw(context, view) {
            debugger
            const prevPixel = Math.round(this.prevPoint.y) * this.maxX + Math.round(this.prevPoint.x)

            const red = view[prevPixel]
            const green = view[prevPixel + 1]
            const blue = view[prevPixel + 2]
            const alfa = view[prevPixel + 3]

            context.beginPath()
            context.arc(this.prevPoint.x, this.prevPoint.y, this.radius, 0, Math.PI * 2)
            context.save()
            context.fillStyle = `rgba(${red}, ${green}, ${blue}, ${alfa})`
            context.fill()
            context.restore()

            context.beginPath()
            context.arc(this.prevPoint.x, this.prevPoint.y, this.radius, 0, Math.PI * 2)
            context.save()
            context.fillStyle = 'rgba(255, 0, 0, 0.2)'
            context.fill()
            context.restore()

            context.beginPath()
            context.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
            context.fill()
        }

        drawVisit(context) {
            debugger
            for (let i = 0; i < this.path.length; i++) {
                context.beginPath()
                context.arc(this.path[i].x, this.path[i].y, this.radius, 0, Math.PI * 2)
                context.save()
                context.fillStyle = `rgba(255, 0, 0, 0.2)`
                context.fill()
                context.restore()
            }
        }

        checkStep(x, y) {
            return x >= 0 && y >= 0 && x < this.maxX && y < this.maxY
        }

        update(view) {
            const alfa = this.alfa
            const beta = this.beta
            const radian = (this.angle * Math.PI) / 180
            const x = this.x
            const y = this.y
            const distanceToWatch = 5
            const distanceToGo = 5

            const coordinates = [
                {
                    x: Math.round(x + distanceToWatch * Math.cos(radian - Math.PI / 2)),
                    y: Math.round(y + distanceToWatch * Math.sin(radian - Math.PI / 2)),
                },
                {
                    x: Math.round(x + distanceToWatch * Math.cos(radian - Math.PI / 3)),
                    y: Math.round(y + distanceToWatch * Math.sin(radian - Math.PI / 3)),
                },
                {
                    x: Math.round(x + distanceToWatch * Math.cos(radian + Math.PI / 3)),
                    y: Math.round(y + distanceToWatch * Math.sin(radian + Math.PI / 3)),
                },
                {
                    x: Math.round(x + distanceToWatch * Math.cos(radian + Math.PI / 2)),
                    y: Math.round(y + distanceToWatch * Math.sin(radian + Math.PI / 2)),
                },
            ]

            const segments = new Array(3)

            let sumP = 0
            for (let i = 0; i < segments.length; i++) {
                const pixelFrom = {
                    x: Math.min(coordinates[i].x, coordinates[i + 1].x),
                    y: Math.max(coordinates[i].y, coordinates[i + 1].y),
                }
                const pixelTo = { x: Math.max(coordinates[i].x, coordinates[i + 1].x), y: Math.min(coordinates[i].y, coordinates[i + 1].y) }

                if (pixelFrom.x === pixelTo.x) {
                    pixelFrom.x = x
                }

                if (pixelFrom.y === pixelTo.y) {
                    pixelFrom.y = y
                }
                if (!this.checkStep(pixelFrom.x, pixelFrom.y)) {
                    segments[i] = { visit: 0, pheromones: 0, probabilities: 0, isInvalid: true, angle: 0 }
                    continue
                }

                let red = 0
                let green = 0
                let blue = 0

                for (let j = 0; j <= distanceToGo; ++j) {
                    for (let k = 0; k <= distanceToGo; ++k) {
                        const index = Math.round(pixelFrom.y) * this.maxX + Math.round(pixelFrom.x)
                        const l = index + this.maxX * j * 4 + k * 4

                        const alpha = view[l + 3] / 255
                        red += view[l] * alpha
                        green += view[l + 1] * alpha
                        blue += view[l + 2] * alpha
                    }
                }

                red = !red ? 1 : red
                green = !green ? 1 : green

                segments[i] = { visit: red, pheromones: green, probabilities: 0, isInvalid: false, angle: 0 }
                sumP += Math.pow(red, alfa) * Math.pow(green, beta)
            }

            if (!segments[0].isInvalid) segments[0].angle = -45
            if (!segments[1].isInvalid) segments[1].angle = 0
            if (!segments[2].isInvalid) segments[2].angle = 45

            for (let i = 0; i < segments.length; ++i) {
                const p = (Math.pow(segments[i].visit, alfa) * Math.pow(segments[i].pheromones, beta)) / sumP
                const toSegmentX = x + distanceToGo * Math.cos(radian + (segments[i].angle * Math.PI) / 180)
                const toSegmentY = y + distanceToGo * Math.sin(radian + (segments[i].angle * Math.PI) / 180)
                segments[i].probabilities = this.checkStep(toSegmentX, toSegmentY) ? p : 0
            }

            segments.sort((a, b) => a.probabilities - b.probabilities)

            const probabilitiesSum = segments.reduce((sum, el) => (sum += el.probabilities), 0)
            const probabilitiesSegment = []

            probabilitiesSegment.push({ from: 0, to: segments[0].probabilities })
            let currentSum = segments[0].probabilities

            for (let i = 0; i < 2; i++) {
                probabilitiesSegment.push({ from: currentSum, to: currentSum + segments[i + 1].probabilities })
                currentSum += segments[i + 1].probabilities
            }

            const rand = getRandomArbitrary(0, probabilitiesSum)
            let toSegment = { isFinded: false }

            for (let i = 0; i < probabilitiesSegment.length; i++) {
                const segment = probabilitiesSegment[i]

                if (segment.from <= rand && segment.to > rand) {
                    toSegment.visit = segments[i].visit
                    toSegment.pheromones = segments[i].pheromones
                    toSegment.angle = segments[i].angle
                    toSegment.isFinded = true
                    break
                }
            }

            if (!toSegment.isFinded) {
                toSegment.x = x + distanceToGo * Math.cos(radian + Math.PI)
                toSegment.y = y + distanceToGo * Math.sin(radian + Math.PI)
                toSegment.angle = 180
            } else {
                toSegment.x = x + distanceToGo * Math.cos(radian + (toSegment.angle * Math.PI) / 180)
                toSegment.y = y + distanceToGo * Math.sin(radian + (toSegment.angle * Math.PI) / 180)
            }

            if (toSegment.pheromones >= 255) {
                debugger
                this.food = true
            }

            this.angle = this.angle + toSegment.angle

            this.prevPoint.x = this.x
            this.prevPoint.y = this.y
            this.x = toSegment.x
            this.y = toSegment.y

            this.path = [...this.path, { x: this.x, y: this.y }]
        }
    }

    class Map {
        constructor(canvas, colonyX, colonyY, view) {
            this.canvas = canvas
            this.width = this.canvas.width
            this.height = this.canvas.height
            this.view = view
            this.colony = new Colony(colonyX, colonyY, ANTS_NUM, this.canvas)
        }

        render(context) {
            this.colony.update(this.view)
            this.colony.drawAnts(context, this.view)
            this.colony.draw(context)
        }
    }

    const ctxImage = ctx.getImageData(0, 0, canvas.width, canvasWrapper.clientHeight)
    const view = ctxImage.data

    const map = new Map(canvas, 700, 700, view)
    // map.colony.draw(ctx)

    function animate() {
        map.render(ctx)
        requestAnimationFrame(animate)

        // setTimeout(() => {
        //     requestAnimationFrame(animate)
        // }, 1000 / 60)
    }

    animate()
})
