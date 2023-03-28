const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
ctx.canvas.width = 1000
ctx.canvas.height = 1000
let size, start, end, field, copyField
let canvasWidth = 1000
let canvasHeight = 1000
let startFlag = false
let endFlag = false
let alreadyCalculate = false
let stopAlgorithm = false
let secondCalculating = false
let fastDoing = false

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

function createMatrix(field, size) {
    for (var i = 0; i < size; i++) {
        field[i] = new Array(size)
    }

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            field[i][j] = new Point(i, j)
        }
    }

    return field
}

/*function maze(field) {
    let startX = Math.floor(Math.random() * size)
    let startY = Math.floor(Math.random() * size)
    field[startY][startX].wall = false

    const stack = [[startX, startY]]

    while (stack.length > 0) {
        debugger
        const [currentX, currentY] = stack.pop()
        field[currentY][currentX].mazeVisit = true
        const neighbors = []

        if (currentX > 0 && field[currentY][currentX - 1].wall && !field[currentY][currentX - 1].mazeVisit) {
            neighbors.push([currentX - 1, currentY])
        }

        if (currentX < size - 1 && field[currentY][currentX + 1].wall && !field[currentY][currentX + 1].mazeVisit) {
            neighbors.push([currentX + 1, currentY])
        }

        if (currentY > 0 && field[currentY - 1][currentX].wall && !field[currentY - 1][currentX].mazeVisit) {
            neighbors.push([currentX, currentY - 1])
        }

        if (currentY < size - 1 && field[currentY + 1][currentX].wall && !field[currentY + 1][currentX].mazeVisit) {
            neighbors.push([currentX, currentY + 1])
        }

        if (neighbors.length > 0) {
            const [nextX, nextY] = neighbors[Math.floor(Math.random() * neighbors.length)]
            field[nextY][nextX].wall = false
            stack.push([nextX, nextY])
        }
    }

    return field
}*/

function generateMaze(field) {
    let walls = 0
    while (walls < (size * size) / 2.5) {
        let startX = Math.floor(Math.random() * size)
        let startY = Math.floor(Math.random() * size)
        field[startY][startX].wall = false

        const stack = [[startX, startY]]

        while (stack.length > 0) {
            debugger
            const [currentX, currentY] = stack.pop()
            const neighbors = []

            if (currentX > 0 && field[currentY][currentX - 1].wall) {
                neighbors.push([currentX - 1, currentY])
            }

            if (currentX < size - 1 && field[currentY][currentX + 1].wall) {
                neighbors.push([currentX + 1, currentY])
            }

            if (currentY > 0 && field[currentY - 1][currentX].wall) {
                neighbors.push([currentX, currentY - 1])
            }

            if (currentY < size - 1 && field[currentY + 1][currentX].wall) {
                neighbors.push([currentX, currentY + 1])
            }

            if (neighbors.length > 0) {
                const [nextX, nextY] = neighbors[Math.floor(Math.random() * neighbors.length)]
                field[nextY][nextX].wall = false
                walls++
                stack.push([nextX, nextY])
            }
        }
    }

    return field
}

/*function makeCaves(field) {
    let caves = []
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (field[i][j].wall == true) {
                let amountOfNeighbors = 0
                for (let a = 0; a < 3; a++) {
                    for (let b = 0; b < 3; b++) {
                        let neighborX = i - a
                        let neighborY = j - b
                        if (neighborX >= 0 && neighborX < size && neighborY >= 0 && neighborY < size) {
                            if (field[neighborX][neighborY].wall == false) {
                                amountOfNeighbors++
                            }
                        }
                    }
                }

                if (amountOfNeighbors >= 8) {
                    caves.push(field[i][j])
                }
            }
        }
    }

    for (let i = 0; i < caves.length; i++) {
        caves[i].wall = false
        ctx.fillStyle = 'white'
        ctx.fillRect(caves[i].x * (canvasWidth / size), caves[i].y * (canvasWidth / size), canvasWidth / size, canvasHeight / size)
        ctx.strokeRect(caves[i].x * (canvasWidth / size), caves[i].y * (canvasWidth / size), canvasWidth / size, canvasHeight / size)
    }
}

function clearDeadEnds(field) {
    for (let k = 0; k < 6; k++) {
        let deadEnd = []
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (field[i][j].wall == false) {
                    let numberOfNormalNeigbours = 0
                    if (i - 1 >= 0 && field[i - 1][j].wall == false) {
                        numberOfNormalNeigbours++
                    }

                    if (i + 1 < size && field[i + 1][j].wall == false) {
                        numberOfNormalNeigbours++
                    }

                    if (j - 1 >= 0 && field[i][j - 1].wall == false) {
                        numberOfNormalNeigbours++
                    }

                    if (j + 1 < size && field[i][j + 1].wall == false) {
                        numberOfNormalNeigbours++
                    }

                    if (numberOfNormalNeigbours <= 1) {
                        deadEnd.push(field[i][j])
                    }
                }
            }
        }
        for (let i = 0; i < deadEnd.length; i++) {
            deadEnd[i].wall = true
            ctx.fillStyle = 'black'
            ctx.fillRect(deadEnd[i].x * (canvasWidth / size), deadEnd[i].y * (canvasWidth / size), canvasWidth / size, canvasHeight / size)
        }
    }
}

function generateMaze(field) {
    let row = Math.floor(Math.random() * size)
    let col = Math.floor(Math.random() * size)
    let countWalls = 0
    field[row][col].wall = false

    let stack = [field[row][col]]

    while (stack.length > 0) {
        let currentCell = stack.pop()

        let neighbors = findNeighbors(field, field[row][col], size)
        if (neighbors.length > 0) {
            let randomIndex = Math.floor(Math.random() * neighbors.length)
            let nextRow = Math.floor(Math.random() * size)
            let nextCol = Math.floor(Math.random() * size)

            let randomNumber = Math.floor(Math.random() * 100) + 1
            if (randomNumber > 95) {
                field[nextRow][nextCol].wall = true
                ctx.fillStyle = 'black'
                ctx.fillRect(
                    field[nextRow][nextCol].x * (canvasWidth / size),
                    field[nextRow][nextCol].y * (canvasWidth / size),
                    canvasWidth / size,
                    canvasHeight / size
                )
                countWalls++
            }

            stack.push(field[nextRow][nextCol])
        }
        if (countWalls > (size * size) / 2) {
            break
        }
    }

    return field
} */

function returnStartState() {
    if (alreadyCalculate == false) {
        draw()
        alreadyCalculate = false
        secondCalculating = false
        stopAlgorithm = false
        startFlag = false
        endFlag = false
        answer.innerHTML = ''
        textForAnswer.innerHTML = ''
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                field[i][j].visited = false
                if (copyField[i][j].wall == true) {
                    ctx.fillStyle = 'black'
                    ctx.fillRect(
                        field[i][j].x * (canvasWidth / size),
                        field[i][j].y * (canvasWidth / size),
                        canvasWidth / size,
                        canvasHeight / size
                    )
                }
            }
        }
    }
}

function reconstructPath(start, end) {
    let finalPath = []
    let current = end
    finalPath.push(current)
    while (current != start) {
        current = current.prev
        finalPath.push(current)
    }
    return finalPath.reverse()
}

function deleteElement(array, element) {
    for (let i = array.length - 1; i >= 0; i--) {
        if (array[i] == element) {
            array.splice(i, 1)
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
        if (fastDoing == false) {
            await new Promise((res, rej) => {
                setTimeout(() => res(), 25)
            })
        } else if (fastDoing == true) {
            await new Promise((res, rej) => {
                setTimeout(() => res(), 0)
            })
        }
        ctx.beginPath()
        ctx.fillStyle = 'yellow'
        ctx.fillRect(
            currentNode.x * (canvasWidth / size),
            currentNode.y * (canvasWidth / size),
            Math.floor(canvasWidth / size),
            Math.floor(canvasHeight / size)
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
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)
    for (let i = 0; i < canvasWidth; i += canvasWidth / size) {
        for (let j = 0; j < canvasHeight; j += canvasHeight / size) {
            ctx.beginPath()
            ctx.strokeStyle = 'black'
            if (size < 100) {
                ctx.lineWidth = '1'
            } else if (size <= 500) {
                ctx.lineWidth = '0.5'
            } else {
                ctx.lineWidth = '0.1'
            }
            ctx.strokeRect(i, j, canvasWidth / size, canvasHeight / size)
        }
    }
}

function normalizeCanvas(field) {
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            field[i][j].visited = false
            if (copyField[i][j].wall == true) {
                ctx.fillStyle = 'black'
                ctx.fillRect(
                    field[i][j].x * (canvasWidth / size),
                    field[i][j].y * (canvasWidth / size),
                    canvasWidth / size,
                    canvasHeight / size
                )
            }
        }
    }
}

let input = document.querySelector('.matrixSize')
let confirmButton = document.querySelector('.confirmSize')
let calculateButton = document.querySelector('.calculate')
let restartButton = document.querySelector('.restart')
let answer = document.querySelector('.lengthOfPath')
let textForAnswer = document.querySelector('.length')
let nullField = document.querySelector('.field')
let stopButton = document.querySelector('.stop')
let switcher = document.querySelector('.switcher')

let startX
let startY
let endX
let endY

switcher.addEventListener('click', function (e) {
    if (fastDoing == false) {
        fastDoing = true
    } else {
        fastDoing = false
    }
})

stopButton.addEventListener('click', function (e) {
    stopAlgorithm = true
    alreadyCalculate = false
})

nullField.addEventListener('click', function (e) {
    if (alreadyCalculate == false && secondCalculating == false) {
        if (+input.value == input.value && input.value > 1) {
            answer.innerHTML = ''
            textForAnswer.innerHTML = ''
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
                        field[i][j].x * (canvasWidth / size),
                        field[i][j].y * (canvasWidth / size),
                        canvasWidth / size,
                        canvasHeight / size
                    )
                    ctx.strokeRect(
                        field[i][j].x * (canvasWidth / size),
                        field[i][j].y * (canvasWidth / size),
                        canvasWidth / size,
                        canvasHeight / size
                    )
                }
            }
            normalizeCanvas(field)
        } else if (input.value <= 1) {
            alert('Введите число, большее 1')
        } else {
            alert('Введите корректное число')
        }
    }
})

restartButton.addEventListener('click', function (e) {
    if (alreadyCalculate == false) {
        returnStartState()
    }
})

confirmButton.addEventListener('click', function (e) {
    if (alreadyCalculate == false && secondCalculating == false) {
        if (+input.value == input.value && input.value > 1) {
            alreadyCalculate = false
            answer.innerHTML = ''
            textForAnswer.innerHTML = ''
            size = +input.value
            field = new Array(size)
            field = createMatrix(field, size)
            start = undefined
            end = undefined
            startFlag = false
            endFlag = false
            draw()
            field = generateMaze(field)
            copyField = field
            normalizeCanvas(field)
            ctx.fillStyle = '#000000'
            ctx.fill()
        } else if (input.value <= 1) {
            alert('Введите число, большее 1')
        } else {
            alert('Введите корректное число')
        }
    }
})

canvas.addEventListener('click', function (e) {
    if (alreadyCalculate == false) {
        const rect = canvas.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        for (let i = 0; i < canvasWidth; i += canvasWidth / size) {
            for (let j = 0; j < canvasHeight; j += canvasHeight / size) {
                if (i < x && j < y && i + canvasWidth / size > x && j + canvasHeight / size > y) {
                    if (startFlag == true && startX == i && startY == j) {
                        ctx.fillStyle = 'white'
                        ctx.fillRect(i, j, canvasWidth / size, canvasHeight / size)
                        ctx.strokeRect(i, j, canvasWidth / size, canvasHeight / size)
                        startFlag = false
                        start = undefined
                    } else if (endFlag == true && endX == i && endY == j) {
                        ctx.fillStyle = 'white'
                        ctx.fillRect(i, j, canvasWidth / size, canvasHeight / size)
                        ctx.strokeRect(i, j, canvasWidth / size, canvasHeight / size)
                        endFlag = false
                        end = undefined
                    } else if (
                        startFlag == false &&
                        field[Math.round(i / (canvasWidth / size))][Math.round(j / (canvasHeight / size))].wall == false
                    ) {
                        ctx.fillStyle = 'Aquamarine'
                        ctx.fillRect(i, j, canvasWidth / size, canvasHeight / size)
                        startFlag = true
                        startX = i
                        startY = j
                        start = field[Math.round(i / (canvasWidth / size))][Math.round(j / (canvasHeight / size))]
                        field[Math.round(i / (canvasWidth / size))][Math.round(j / (canvasHeight / size))].wall = false
                    } else if (
                        endFlag == false &&
                        field[Math.round(i / (canvasWidth / size))][Math.round(j / (canvasHeight / size))].wall == false
                    ) {
                        ctx.fillStyle = 'Magenta'
                        ctx.fillRect(i, j, canvasWidth / size, canvasHeight / size)
                        endFlag = true
                        endX = i
                        endY = j
                        end = field[Math.round(i / (canvasWidth / size))][Math.round(j / (canvasHeight / size))]
                        field[Math.round(i / (canvasWidth / size))][Math.round(j / (canvasHeight / size))].wall = false
                    } else if (field[Math.round(i / (canvasWidth / size))][Math.round(j / (canvasHeight / size))].wall == false) {
                        ctx.fillStyle = 'black'
                        ctx.fillRect(i, j, canvasWidth / size, canvasHeight / size)
                        field[Math.round(i / (canvasWidth / size))][Math.round(j / (canvasHeight / size))].wall = true
                    } else if (field[Math.round(i / (canvasWidth / size))][Math.round(j / (canvasHeight / size))].wall == true) {
                        ctx.fillStyle = 'white'
                        ctx.fillRect(i, j, canvasWidth / size, canvasHeight / size)
                        ctx.strokeRect(i, j, canvasWidth / size, canvasHeight / size)
                        field[Math.round(i / (canvasWidth / size))][Math.round(j / (canvasHeight / size))].wall = false
                    }
                }
            }
        }
    }
})

calculateButton.addEventListener('click', async function (e) {
    if (alreadyCalculate == false && startFlag == true && endFlag == true && secondCalculating == false) {
        let openSet = []
        secondCalculating = true
        alreadyCalculate = true
        openSet.push(start)
        if (start == undefined || end == undefined) {
            alert('Вы не поставили точку старта или точку конца')
        } else {
            const result = await aStar(field, start, end)

            if (result == 1) {
                let path = reconstructPath(start, end)
                for (let i = 0; i < path.length; i++) {
                    if (fastDoing == false) {
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
                        Math.round(path[i].x * (canvasWidth / size)),
                        Math.round(path[i].y * (canvasWidth / size)),
                        canvasWidth / size,
                        canvasHeight / size
                    )
                    textForAnswer.innerHTML = 'Длина вашего пути равна:'
                    answer.innerHTML = path.length
                    alreadyCalculate = false
                }
            } else {
                for (let i = 0; i < size; i++) {
                    for (let j = 0; j < size; j++) {
                        if (copyField[i][j].visited == true) {
                            ctx.fillStyle = 'red'
                            ctx.fillRect(
                                field[i][j].x * (canvasWidth / size),
                                field[i][j].y * (canvasWidth / size),
                                Math.floor(canvasWidth / size),
                                Math.floor(canvasWidth / size)
                            )
                        }
                    }
                }

                if (stopAlgorithm == true) {
                    textForAnswer.innerHTML = 'Вы остановили поиск пути'
                } else {
                    textForAnswer.innerHTML = 'Путь не найден'
                }
                stopAlgorithm = false
                alreadyCalculate = false
            }
        }
    } else if (startFlag == false || endFlag == false) {
        alert('Вы не поставили стартовую или конечную точку')
    } else if (alreadyCalculate == true || secondCalculating == true) {
        alert('Вы уже вычисляете')
    } else {
        alert('Очистите лабиринт')
    }
})
