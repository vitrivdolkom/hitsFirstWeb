const getRandomArbitrary = (min, max) => {
    return Math.random() * (max - min) + min
}

export function primMaze(field, size) {
    let x = Math.floor(getRandomArbitrary(0, size))
    let y = Math.floor(getRandomArbitrary(0, size))
    field[x][y].wall = false
    let coords = [{ x: x, y: y }]

    if (y - 2 >= 0) {
        coords.push({ x: x, y: y - 2 })
    }

    if (y + 2 < size) {
        coords.push({ x: x, y: y + 2 })
    }

    if (x - 2 >= 0) {
        coords.push({ x: x - 2, y: y })
    }

    if (x + 2 < size) {
        coords.push({ x: x + 2, y: y })
    }

    while (coords.length > 0) {
        let index = Math.floor(getRandomArbitrary(0, coords.length))
        let x = coords[index].x
        let y = coords[index].y
        if (field[x][y].wall == false) {
            coords.splice(index, 1)
            continue
        }
        field[x][y].wall = false
        coords.splice(index, 1)

        let directions = ['north', 'south', 'east', 'west']
        while (directions.length > 0) {
            let directIndex = Math.floor(getRandomArbitrary(0, directions.length))
            switch (directions[directIndex]) {
                case 'north':
                    if (y - 2 >= 0 && !field[x][y - 2].wall) {
                        field[x][y - 1].wall = false
                        directions = []
                    }
                    break
                case 'south':
                    if (y + 2 < size && !field[x][y + 2].wall) {
                        field[x][y + 1].wall = false
                        directions = []
                    }
                    break
                case 'east':
                    if (x - 2 >= 0 && !field[x - 2][y].wall) {
                        field[x - 1][y].wall = false
                        directions = []
                    }
                    break
                case 'west':
                    if (x + 2 < size && !field[x + 2][y].wall) {
                        field[x + 1][y].wall = false
                        directions = []
                    }
                    break
            }
            directions.splice(directIndex, 1)
        }

        if (y - 2 >= 0 && field[x][y - 2].wall) {
            coords.push({ x: x, y: y - 2 })
        }

        if (y + 2 < size && field[x][y + 2].wall) {
            coords.push({ x: x, y: y + 2 })
        }

        if (x - 2 >= 0 && field[x - 2][y].wall) {
            coords.push({ x: x - 2, y: y })
        }

        if (x + 2 < size && field[x + 2][y].wall) {
            coords.push({ x: x + 2, y: y })
        }
    }

    return field
}

export function generateMaze(field, size) {
    let walls = 0
    while (walls < (size * size) / 2.5) {
        let startX = Math.floor(getRandomArbitrary(0, size))
        let startY = Math.floor(getRandomArbitrary(0, size))
        field[startY][startX].wall = false

        const stack = [[startX, startY]]

        while (stack.length > 0) {
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
