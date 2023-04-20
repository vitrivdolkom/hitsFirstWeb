let euclid = document.querySelector('#euclid')
let manhetten = document.querySelector('#manhetten')
let chebyshev = document.querySelector('#chebyshev')

export function findDistance(a, b) {
    let dx = a.x - b.x
    let dy = a.y - b.y
    if (euclid.checked) {
        return Math.sqrt(dx ** 2 + dy ** 2)
    } else if (manhetten.checked) {
        return Math.abs(dx) + Math.abs(dy)
    } else if (chebyshev.checked) {
        return Math.max(Math.abs(dx), Math.abs(dy))
    }
}

export function getMousePos(canvas, e) {
    let mouse = { x: 0, y: 0, clusterIndex: -1, dbClusterIndex: -1, noise: false }
    let rect = canvas.getBoundingClientRect()
    mouse.x = e.clientX - rect.left
    mouse.y = e.clientY - rect.top
    return mouse
}

export function deleteRepeats(array) {
    for (let i = 0; i < array.length; i++) {
        for (let j = i + 1; j < array.length; j++) {
            if (
                (array[i].x === array[j].x && array[i].y === array[j].y) ||
                (Math.abs(array[i].x - array[j].x) <= 10 && Math.abs(array[i].y - array[j].y) <= 10)
            ) {
                array.splice(j, 1)
            }
        }
    }
}
