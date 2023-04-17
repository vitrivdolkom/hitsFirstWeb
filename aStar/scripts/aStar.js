import { primMaze } from './maze.js'
import { generateMaze } from './maze.js'
import { deleteElement } from './additionalFunctions.js'
import { createMatrix } from './additionalFunctions.js'
import { reconstructPath } from './additionalFunctions.js'
import { openModal } from '../../scripts/modal.js'

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

const wrapperSize = document.querySelector('.wrapper').clientWidth
let canvasSize = wrapperSize > 1840 ? 800 : 500
if (wrapperSize < 1000) {
    canvasSize = 400
} else if (wrapperSize < 600) {
    canvasSize = 200
}

ctx.canvas.width = canvasSize
ctx.canvas.height = canvasSize

let size, start, end, field, copyField
let startFlag = false
let endFlag = false
let alreadyCalculate = false
let stopAlgorithm = false
let secondCalculating = false
let fastDoing = false
let pleasureFlag = false

class Point {
    constructor(i, j) {
        this.x = i
        this.y = j
        this.f = 0
        this.g = 0
        this.h = 0
        this.neighbors = undefined
        this.visited = false
        this.wall = true
        this.prev = undefined
    }
}

function returnStartState() {
    if (alreadyCalculate == false) {
        draw()
        alreadyCalculate = false
        secondCalculating = false
        stopAlgorithm = false
        startFlag = false
        endFlag = false
        answer.innerHTML = ''
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                field[i][j].visited = false
                if (copyField[i][j].wall) {
                    ctx.fillStyle = 'black'
                    ctx.fillRect(
                        field[i][j].x * (canvasSize / size),
                        field[i][j].y * (canvasSize / size),
                        canvasSize / size,
                        canvasSize / size
                    )
                }
            }
        }
    }
}

function findNeighbors(field, currentPoint, size) {
    let neighbors = []

    if (currentPoint.x > 0) {
        if (field[currentPoint.x - 1][currentPoint.y].wall != true) {
            neighbors.push(field[currentPoint.x - 1][currentPoint.y])
        }
    }

    if (currentPoint.y + 1 < size) {
        if (field[currentPoint.x][currentPoint.y + 1].wall != true) {
            neighbors.push(field[currentPoint.x][currentPoint.y + 1])
        }
    }

    if (currentPoint.y > 0) {
        if (field[currentPoint.x][currentPoint.y - 1].wall != true) {
            neighbors.push(field[currentPoint.x][currentPoint.y - 1])
        }
    }

    if (currentPoint.x + 1 < size) {
        if (field[currentPoint.x + 1][currentPoint.y].wall != true) {
            neighbors.push(field[currentPoint.x + 1][currentPoint.y])
        }
    }
    return neighbors
}

function calculateHeuristic(first, second) {
    return Math.abs(first.x - second.x) + Math.abs(first.y - second.y)
}

async function aStar(field, start, end) {
    let openSet = []
    openSet.push(start)
    let cameFrom = []

    while (openSet.length > 0) {
        if (stopAlgorithm == true) {
            return -1
        }
        let win = 0

        for (let i = 1; i < openSet.length; i++) {
            if (openSet[i].f < openSet[win].f) {
                win = i
            }

            if (openSet[i].f == openSet[win].f) {
                if (openSet[i].g > openSet[win].g) {
                    win = i
                }
            }
        }
        let currentNode = openSet[win]
        currentNode.visited = true
        if (!fastDoing) {
            await new Promise((res, rej) => {
                setTimeout(() => res(), 25)
            })
        } else if (fastDoing) {
            await new Promise((res, rej) => {
                setTimeout(() => res(), 0)
            })
        }
        ctx.beginPath()
        ctx.fillStyle = 'yellow'
        ctx.fillRect(
            currentNode.x * (canvasSize / size),
            currentNode.y * (canvasSize / size),
            Math.floor(canvasSize / size),
            Math.floor(canvasSize / size)
        )

        if (currentNode == end) {
            return 1
        }

        deleteElement(openSet, currentNode)
        cameFrom.push(currentNode)

        let neighbors = findNeighbors(field, currentNode, size)

        for (let i = 0; i < neighbors.length; i++) {
            let neighbor = neighbors[i]
            if (!cameFrom.includes(neighbor)) {
                let g = currentNode.g + calculateHeuristic(currentNode, neighbor)

                if (!openSet.includes(neighbor)) {
                    openSet.push(neighbor)
                } else if (g >= neighbor.g) {
                    continue
                }

                neighbor.g = g
                neighbor.h = calculateHeuristic(neighbor, end)
                neighbor.f = neighbor.g + neighbor.h
                neighbor.prev = currentNode
            }
        }
    }
    return 0
}

function draw() {
    ctx.clearRect(0, 0, canvasSize, canvasSize)
    for (let i = 0; i < canvasSize; i += canvasSize / size) {
        for (let j = 0; j < canvasSize; j += canvasSize / size) {
            ctx.beginPath()
            ctx.strokeStyle = 'black'
            if (size < 100) {
                ctx.lineWidth = '1'
            } else if (size < 500) {
                ctx.lineWidth = '0.5'
            } else {
                ctx.lineWidth = '0.1'
            }
            ctx.strokeRect(i, j, canvasSize / size, canvasSize / size)
        }
    }
}

function normalizeCanvas(field) {
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            field[i][j].visited = false
            if (copyField[i][j].wall) {
                ctx.fillStyle = 'black'
                ctx.fillRect(field[i][j].x * (canvasSize / size), field[i][j].y * (canvasSize / size), canvasSize / size, canvasSize / size)
            }
        }
    }
}

const input = document.querySelector('.matrixSize')
const confirmButton = document.querySelector('.confirmSize')
const calculateButton = document.querySelector('.calculate')
const restartButton = document.querySelector('.restart')
const answer = document.querySelector('.lengthOfPath')
const nullField = document.querySelector('.field')
const stopButton = document.querySelector('.stop')
const switcher = document.querySelector('.switcher')
const pleasure = document.querySelector('.pleasure')

pleasure.checked = false
switcher.checked = false

let startX = 0
let startY = 0
let endX = 0
let endY = 0

pleasure.addEventListener('click', function (e) {
    if (!pleasureFlag) {
        openModal('Ставьте размер матрицы не менее 300')
        pleasureFlag = true
    } else {
        pleasureFlag = false
    }
})

switcher.addEventListener('click', function (e) {
    if (!fastDoing) {
        fastDoing = true
    } else {
        fastDoing = false
    }
})

stopButton.addEventListener('click', function (e) {
    if (alreadyCalculate == true) {
        stopAlgorithm = true
        alreadyCalculate = false
    }
})

nullField.addEventListener('click', function (e) {
    if (!alreadyCalculate && !secondCalculating) {
        if (+input.value == input.value && input.value > 1) {
            answer.innerHTML = ''
            size = +input.value
            field = new Array(size)
            field = createMatrix(field, size)
            start = undefined
            end = undefined
            startFlag = false
            endFlag = false
            copyField = field
            draw()
            ctx.fillStyle = '#000000'
            ctx.fill()
            for (let i = 0; i < size; i++) {
                for (let j = 0; j < size; j++) {
                    field[i][j].wall = false
                    ctx.fillStyle = 'white'
                    ctx.fillRect(
                        field[i][j].x * (canvasSize / size),
                        field[i][j].y * (canvasSize / size),
                        canvasSize / size,
                        canvasSize / size
                    )
                    ctx.strokeRect(
                        field[i][j].x * (canvasSize / size),
                        field[i][j].y * (canvasSize / size),
                        canvasSize / size,
                        canvasSize / size
                    )
                }
            }
            normalizeCanvas(field)
        } else if (input.value <= 1) {
            openModal('Введите число, большее 1')
        } else {
            openModal('Введите корректное число')
        }
    }
})

restartButton.addEventListener('click', function (e) {
    if (!alreadyCalculate) {
        returnStartState()
    }
})

confirmButton.addEventListener('click', function (e) {
    if (!alreadyCalculate && !secondCalculating) {
        if (+input.value == input.value && input.value > 1) {
            alreadyCalculate = false
            answer.innerHTML = ''
            size = +input.value
            field = new Array(size)
            field = createMatrix(field, size)
            start = undefined
            end = undefined
            startFlag = false
            endFlag = false
            draw()
            if (!pleasureFlag) {
                field = primMaze(field, size)
            } else {
                field = generateMaze(field, size)
            }
            copyField = field
            normalizeCanvas(field)
            ctx.fillStyle = '#000000'
            ctx.fill()
        } else if (input.value <= 1) {
            openModal('Введите число, большее 1')
        } else {
            openModal('Введите корректное число')
        }
    }
})

canvas.addEventListener('click', function (e) {
    if (!alreadyCalculate) {
        const rect = canvas.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        for (let i = 0; i < canvasSize; i += canvasSize / size) {
            for (let j = 0; j < canvasSize; j += canvasSize / size) {
                if (i < x && j < y && i + canvasSize / size > x && j + canvasSize / size > y) {
                    if (startFlag && startX == i && startY == j) {
                        ctx.fillStyle = 'white'
                        ctx.fillRect(i, j, canvasSize / size, canvasSize / size)
                        ctx.strokeRect(i, j, canvasSize / size, canvasSize / size)
                        startFlag = false
                        start = undefined
                    } else if (endFlag && endX == i && endY == j) {
                        ctx.fillStyle = 'white'
                        ctx.fillRect(i, j, canvasSize / size, canvasSize / size)
                        ctx.strokeRect(i, j, canvasSize / size, canvasSize / size)
                        endFlag = false
                        end = undefined
                    } else if (!startFlag && !field[Math.round(i / (canvasSize / size))][Math.round(j / (canvasSize / size))].wall) {
                        ctx.fillStyle = 'Aquamarine'
                        ctx.fillRect(i, j, canvasSize / size, canvasSize / size)
                        startFlag = true
                        startX = i
                        startY = j
                        start = field[Math.round(i / (canvasSize / size))][Math.round(j / (canvasSize / size))]
                        field[Math.round(i / (canvasSize / size))][Math.round(j / (canvasSize / size))].wall = false
                    } else if (!endFlag && !field[Math.round(i / (canvasSize / size))][Math.round(j / (canvasSize / size))].wall) {
                        ctx.fillStyle = 'Magenta'
                        ctx.fillRect(i, j, canvasSize / size, canvasSize / size)
                        endFlag = true
                        endX = i
                        endY = j
                        end = field[Math.round(i / (canvasSize / size))][Math.round(j / (canvasSize / size))]
                        field[Math.round(i / (canvasSize / size))][Math.round(j / (canvasSize / size))].wall = false
                    } else if (!field[Math.round(i / (canvasSize / size))][Math.round(j / (canvasSize / size))].wall) {
                        ctx.fillStyle = 'black'
                        ctx.fillRect(i, j, canvasSize / size, canvasSize / size)
                        field[Math.round(i / (canvasSize / size))][Math.round(j / (canvasSize / size))].wall = true
                    } else if (field[Math.round(i / (canvasSize / size))][Math.round(j / (canvasSize / size))].wall) {
                        ctx.fillStyle = 'white'
                        ctx.fillRect(i, j, canvasSize / size, canvasSize / size)
                        ctx.strokeRect(i, j, canvasSize / size, canvasSize / size)
                        field[Math.round(i / (canvasSize / size))][Math.round(j / (canvasSize / size))].wall = false
                    }
                }
            }
        }
    }
})

calculateButton.addEventListener('click', async function (e) {
    if (!alreadyCalculate && startFlag && endFlag && !secondCalculating) {
        let openSet = []
        secondCalculating = true
        alreadyCalculate = true
        openSet.push(start)
        if (start == undefined || end == undefined) {
            openModal('Вы не поставили точку старта или точку конца')
        } else {
            const result = await aStar(field, start, end)

            if (result == 1) {
                let path = reconstructPath(start, end)
                for (let i = 0; i < path.length; i++) {
                    if (!fastDoing) {
                        await new Promise((res, rej) => {
                            setTimeout(() => res(), 25)
                        })
                    } else {
                        await new Promise((res, rej) => {
                            setTimeout(() => res(), 0)
                        })
                    }
                    ctx.fillStyle = 'green'
                    ctx.fillRect(
                        Math.round(path[i].x * (canvasSize / size)),
                        Math.round(path[i].y * (canvasSize / size)),
                        canvasSize / size,
                        canvasSize / size
                    )
                    answer.textContent = path.length
                    alreadyCalculate = false
                }
            } else {
                for (let i = 0; i < size; i++) {
                    for (let j = 0; j < size; j++) {
                        if (copyField[i][j].visited) {
                            ctx.fillStyle = 'red'
                            ctx.fillRect(
                                field[i][j].x * (canvasSize / size),
                                field[i][j].y * (canvasSize / size),
                                Math.floor(canvasSize / size),
                                Math.floor(canvasSize / size)
                            )
                        }
                    }
                }

                answer.textContent = ' пути нет'
                stopAlgorithm = false
                alreadyCalculate = false
            }
        }
    } else if (!startFlag || !endFlag) {
        openModal('Вы не поставили стартовую или конечную точку')
    } else if (alreadyCalculate || secondCalculating) {
        openModal('Вы уже вычисляете')
    } else {
        openModal('Очистите лабиринт')
    }
})
