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

export function createMatrix(field, size) {
    for (let i = 0; i < size; i++) {
        field[i] = new Array(size)
    }

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            field[i][j] = new Point(i, j)
        }
    }

    return field
}

export function reconstructPath(start, end) {
    const finalPath = []
    let current = end
    finalPath.push(current)
    while (current != start) {
        current = current.prev
        finalPath.push(current)
    }
    return finalPath.reverse()
}

export function deleteElement(array, element) {
    for (let i = array.length - 1; i >= 0; i--) {
        if (array[i] == element) {
            array.splice(i, 1)
        }
    }
}
