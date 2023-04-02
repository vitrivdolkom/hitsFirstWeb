import { colors } from './colors.js'

let canvas = document.querySelector('canvas')
let ctx = canvas.getContext('2d')
let input = document.querySelector('.kMeans')
let clear = document.querySelector('.clear')
let starter = document.querySelector('.start')

ctx.canvas.width = 1000
ctx.canvas.height = 500
let canvasWidth = 1000
let canvasHeight = 500
let drawFlag = false
let prevMouse = { x: 0, y: 0, visit: false }
let points = []

ctx.beginPath()
ctx.lineWidth = 1
ctx.lineCap = 'round'
ctx.strokeStyle = '#000000'
ctx.strokeRect(0, 0, canvasWidth, canvasHeight)

function getMousePos(canvas, e) {
    let mouse = { x: 0, y: 0, visit: false }
    let rect = canvas.getBoundingClientRect()
    mouse.x = e.clientX - rect.left
    mouse.y = e.clientY - rect.top
    return mouse
}

function findDistance(a, b) {
    let dx = a.x - b.x
    let dy = a.y - b.y
    return Math.sqrt(dx * dx + dy * dy)
}

function kMeans(points, k, maxIterations) {
    let centroids = []
    let i = 0
    while (i < k) {
        let index = Math.floor(Math.random() * points.length)
        if (!points[index].visit) {
            centroids.push(points[index])
            points[index].visit = true
            i++
        }
    }

    for (let iter = 0; iter < maxIterations; iter++) {
        let clusters = new Array(k).fill().map(() => [])

        for (let i = 0; i < points.length; i++) {
            let minDistance = Infinity
            let closestCentroids

            for (let j = 0; j < centroids.length; j++) {
                let distance = findDistance(points[i], centroids[j])

                if (distance < minDistance) {
                    minDistance = distance
                    closestCentroids = j
                }
            }

            clusters[closestCentroids].push(points[i])
            points[i].clusterIndex = closestCentroids
        }

        let flag = true
        for (let i = 0; i < centroids.length; i++) {
            let oldCentroid = centroids[i]
            let cluster = clusters[i]
            if (cluster.length == 0) {
                continue
            }

            let xSum = cluster.reduce((sum, point) => sum + point.x, 0) //Сумма элементов всех иксов(игриков)
            let ySum = cluster.reduce((sum, point) => sum + point.y, 0)
            let newCentroid = [xSum / cluster.length, ySum / cluster.length]
            if (findDistance(oldCentroid, newCentroid) > 0) {
                converged = false
                centroids[i] = newCentroid
            }
        }
        if (flag) {
            break
        }
    }
    for (let i = 0; i < points.length; i++) {
        points[i].visit = false
    }
    return centroids
}

clear.addEventListener('click', function (e) {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)
    ctx.strokeStyle = 'black'
    ctx.strokeRect(0, 0, canvasWidth, canvasHeight)
    points = []
})

starter.addEventListener('click', function (e) {
    if (+input.value == input.value && input.value >= 1) {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight)
        ctx.strokeStyle = 'black'
        ctx.strokeRect(0, 0, canvasWidth, canvasHeight)
        let centroids = kMeans(points, +input.value, 300)
        for (let i = 0; i < points.length; i++) {
            let point = points[i]
            let clusterIndex = point.clusterIndex
            let color = colors[clusterIndex]

            ctx.beginPath()
            ctx.fillStyle = color
            ctx.arc(point.x, point.y, 10, 0, 2 * Math.PI)
            ctx.fill()
        }

        for (let i = 0; i < centroids.length; i++) {
            let centroid = centroids[i]
            let color = 'black'

            ctx.beginPath()
            ctx.arc(centroid.x, centroid.y, 10, 0, 2 * Math.PI)
            ctx.strokeStyle = color
            ctx.lineWidth = 2
            ctx.stroke()
        }

        ctx.fillStyle = 'black'
    } else if (+input.value != input.value) {
        alert('Введите корректное число')
    }
})

canvas.addEventListener('mousedown', function (e) {
    let curClick = getMousePos(canvas, e)
    drawFlag = true
    ctx.beginPath()
    ctx.arc(curClick.x, curClick.y, 10, 0, 2 * Math.PI)
    ctx.fill()
    ctx.moveTo(curClick.x, curClick.y)
    prevMouse.x = curClick.x
    prevMouse.y = curClick.y
})

canvas.addEventListener('mousemove', function (e) {
    if (drawFlag) {
        ctx.beginPath()
        let curClick = getMousePos(canvas, e)
        if (Math.abs(curClick.x - prevMouse.x) > 30 || Math.abs(curClick.y - prevMouse.y) > 30) {
            points.push(curClick)
            ctx.arc(curClick.x, curClick.y, 10, 0, 2 * Math.PI)
            ctx.fill()
            ctx.moveTo(curClick.x, curClick.y)
            prevMouse.x = curClick.x
            prevMouse.y = curClick.y
        }
    }
})

canvas.addEventListener('mouseup', function (e) {
    ctx.beginPath()
    let curClick = getMousePos(canvas, e)
    points.push(curClick)
    ctx.arc(curClick.x, curClick.y, 10, 0, 2 * Math.PI)
    ctx.fill()
    ctx.moveTo(curClick.x, curClick.y)
    drawFlag = false
})
