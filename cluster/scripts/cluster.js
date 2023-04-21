import { colors } from './colors.js'
import { kMeans } from './kMeans.js'
import { DBSCAN } from './DBSCAN.js'
import { getMousePos } from './additionalFunctions.js'
import { deleteRepeats } from './additionalFunctions.js'
import { hierarchicalClustering } from './hierarchical.js'

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const input = document.querySelector('.kMeans')
const clear = document.querySelector('.clear')
const starter = document.querySelector('.start')
const canvas1 = document.querySelector('.DB')
const ctx1 = canvas1.getContext('2d')
const canvas2 = document.querySelector('.HIER')
const ctx2 = canvas2.getContext('2d')

const radius = document.getElementById('myRange')
const output = document.getElementById('demo')
output.innerHTML = radius.value

radius.oninput = function () {
    output.innerHTML = this.value
}

const amountOfNeigbours = document.getElementById('myAnotherRange')
const anotherOutput = document.getElementById('anotherDemo')
anotherOutput.innerHTML = amountOfNeigbours.value

amountOfNeigbours.oninput = function () {
    anotherOutput.innerHTML = this.value
}

const amountOfCentroids = document.getElementById('kMeans')
const kMeansOutput = document.getElementById('kMeansDemo')
kMeansOutput.innerHTML = amountOfCentroids.value

amountOfCentroids.oninput = function () {
    kMeansOutput.innerHTML = this.value
}

const canvasWidth = 390
const canvasHeight = 300
ctx.canvas.width = canvasWidth
ctx.canvas.height = canvasHeight
let drawFlag = false
const prevMouse = { x: 0, y: 0, visit: false }
let points = []
let clickFlag = false

ctx1.canvas.width = canvasWidth
ctx1.canvas.height = canvasHeight
ctx1.beginPath()
ctx1.lineWidth = 1
ctx1.lineCap = 'round'
ctx1.strokeStyle = '#000000'
ctx1.strokeRect(0, 0, canvasWidth, canvasHeight)

ctx2.canvas.width = canvasWidth
ctx2.canvas.height = canvasHeight
ctx2.beginPath()
ctx2.lineWidth = 1
ctx2.lineCap = 'round'
ctx2.strokeStyle = '#000000'
ctx2.strokeRect(0, 0, canvasWidth, canvasHeight)

ctx.beginPath()
ctx.lineWidth = 1
ctx.lineCap = 'round'
ctx.strokeStyle = '#000000'
ctx.strokeRect(0, 0, canvasWidth, canvasHeight)

clear.addEventListener('click', function (e) {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)
    ctx.strokeStyle = 'black'
    ctx.strokeRect(0, 0, canvasWidth, canvasHeight)
    ctx1.clearRect(0, 0, canvasWidth, canvasHeight)
    ctx1.strokeStyle = 'black'
    ctx1.strokeRect(0, 0, canvasWidth, canvasHeight)
    ctx2.clearRect(0, 0, canvasWidth, canvasHeight)
    ctx2.strokeStyle = 'black'
    ctx2.strokeRect(0, 0, canvasWidth, canvasHeight)
    points = []
    clickFlag = false
})

starter.addEventListener('click', function (e) {
    if (clickFlag === true) {
        deleteRepeats(points)
        clickFlag = false
    }
    if (+amountOfCentroids.value == amountOfCentroids.value && points.length >= amountOfCentroids.value) {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight)
        ctx.strokeStyle = 'black'
        ctx.strokeRect(0, 0, canvasWidth, canvasHeight)
        ctx1.clearRect(0, 0, canvasWidth, canvasHeight)
        ctx1.strokeStyle = 'black'
        ctx1.strokeRect(0, 0, canvasWidth, canvasHeight)
        ctx2.clearRect(0, 0, canvasWidth, canvasHeight)
        ctx2.strokeStyle = 'black'
        ctx2.strokeRect(0, 0, canvasWidth, canvasHeight)
        let kMeansCentroids = kMeans(points, +amountOfCentroids.value, 100)
        let DBSCANCentroidsAndNoise = DBSCAN(points, radius.value, amountOfNeigbours.value)
        let hierarchicalClusters = hierarchicalClustering(points, +amountOfCentroids.value)

        for (let i = 0; i < hierarchicalClusters.length; i++) {
            for (const point of hierarchicalClusters[i]) {
                let index = i
                let color = colors[index]
                ctx2.beginPath()
                ctx2.fillStyle = color
                ctx2.arc(point.x, point.y, 10, 0, 2 * Math.PI)
                ctx2.fill()
            }
        }

        for (const point of DBSCANCentroidsAndNoise) {
            const index = point.dbClusterIndex
            let color = 'black'
            if (point.noise === false) {
                color = colors[index]
            }
            ctx1.beginPath()
            ctx1.fillStyle = color
            ctx1.arc(point.x, point.y, 10, 0, 2 * Math.PI)
            ctx1.fill()
        }

        for (const point of points) {
            const color = colors[point.clusterIndex]

            ctx.beginPath()
            ctx.fillStyle = color
            ctx.arc(point.x, point.y, 10, 0, 2 * Math.PI)
            ctx.fill()
        }

        for (const centroid of kMeansCentroids) {
            const color = 'black'

            ctx.beginPath()
            ctx.arc(centroid.x, centroid.y, 10, 0, 2 * Math.PI)
            ctx.strokeStyle = color
            ctx.lineWidth = 2
            ctx.stroke()
        }

        ctx.fillStyle = 'black'
        ctx1.fillStyle = 'black'
        ctx2.fillStyle = 'black'
    } else if (points.length < amountOfCentroids.value) {
        alert('Поставьте больше точек или уменьшите кол-во главных')
    }
})

canvas.addEventListener('mousedown', function (e) {
    let curClick = getMousePos(canvas, e)
    clickFlag = true
    drawFlag = true
    ctx.beginPath()
    ctx.arc(curClick.x, curClick.y, 10, 0, 2 * Math.PI)
    ctx.fill()
    ctx.moveTo(curClick.x, curClick.y)
    ctx1.beginPath()
    ctx1.arc(curClick.x, curClick.y, 10, 0, 2 * Math.PI)
    ctx1.fill()
    ctx1.moveTo(curClick.x, curClick.y)
    ctx2.beginPath()
    ctx2.arc(curClick.x, curClick.y, 10, 0, 2 * Math.PI)
    ctx2.fill()
    ctx2.moveTo(curClick.x, curClick.y)
    points.push(curClick)
    prevMouse.x = curClick.x
    prevMouse.y = curClick.y
})

canvas.addEventListener('mousemove', function (e) {
    if (drawFlag) {
        ctx.beginPath()
        ctx1.beginPath()
        let curClick = getMousePos(canvas, e)
        if (Math.abs(curClick.x - prevMouse.x) > 30 || Math.abs(curClick.y - prevMouse.y) > 30) {
            points.push(curClick)
            ctx.arc(curClick.x, curClick.y, 10, 0, 2 * Math.PI)
            ctx.fill()
            ctx.moveTo(curClick.x, curClick.y)
            ctx1.arc(curClick.x, curClick.y, 10, 0, 2 * Math.PI)
            ctx1.fill()
            ctx1.moveTo(curClick.x, curClick.y)
            ctx2.arc(curClick.x, curClick.y, 10, 0, 2 * Math.PI)
            ctx2.fill()
            ctx2.moveTo(curClick.x, curClick.y)
            prevMouse.x = curClick.x
            prevMouse.y = curClick.y
        }
    }
})

canvas.addEventListener('mouseup', function (e) {
    ctx.beginPath()
    ctx1.beginPath()
    let curClick = getMousePos(canvas, e)
    points.push(curClick)
    ctx.arc(curClick.x, curClick.y, 10, 0, 2 * Math.PI)
    ctx.fill()
    ctx.moveTo(curClick.x, curClick.y)
    ctx1.arc(curClick.x, curClick.y, 10, 0, 2 * Math.PI)
    ctx1.fill()
    ctx1.moveTo(curClick.x, curClick.y)
    ctx2.arc(curClick.x, curClick.y, 10, 0, 2 * Math.PI)
    ctx2.fill()
    ctx2.moveTo(curClick.x, curClick.y)
    drawFlag = false
})

canvas1.addEventListener('mousedown', function (e) {
    let curClick = getMousePos(canvas1, e)
    clickFlag = true
    drawFlag = true
    ctx.beginPath()
    ctx.arc(curClick.x, curClick.y, 10, 0, 2 * Math.PI)
    ctx.fill()
    ctx.moveTo(curClick.x, curClick.y)
    ctx1.beginPath()
    ctx1.arc(curClick.x, curClick.y, 10, 0, 2 * Math.PI)
    ctx1.fill()
    ctx1.moveTo(curClick.x, curClick.y)
    ctx2.beginPath()
    ctx2.arc(curClick.x, curClick.y, 10, 0, 2 * Math.PI)
    ctx2.fill()
    ctx2.moveTo(curClick.x, curClick.y)
    points.push(curClick)
    prevMouse.x = curClick.x
    prevMouse.y = curClick.y
})

canvas1.addEventListener('mousemove', function (e) {
    if (drawFlag) {
        ctx.beginPath()
        ctx1.beginPath()
        let curClick = getMousePos(canvas1, e)
        if (Math.abs(curClick.x - prevMouse.x) > 30 || Math.abs(curClick.y - prevMouse.y) > 30) {
            points.push(curClick)
            ctx.arc(curClick.x, curClick.y, 10, 0, 2 * Math.PI)
            ctx.fill()
            ctx.moveTo(curClick.x, curClick.y)
            ctx1.arc(curClick.x, curClick.y, 10, 0, 2 * Math.PI)
            ctx1.fill()
            ctx1.moveTo(curClick.x, curClick.y)
            ctx2.arc(curClick.x, curClick.y, 10, 0, 2 * Math.PI)
            ctx2.fill()
            ctx2.moveTo(curClick.x, curClick.y)
            prevMouse.x = curClick.x
            prevMouse.y = curClick.y
        }
    }
})

canvas1.addEventListener('mouseup', function (e) {
    ctx.beginPath()
    ctx1.beginPath()
    let curClick = getMousePos(canvas1, e)
    points.push(curClick)
    ctx.arc(curClick.x, curClick.y, 10, 0, 2 * Math.PI)
    ctx.fill()
    ctx.moveTo(curClick.x, curClick.y)
    ctx1.arc(curClick.x, curClick.y, 10, 0, 2 * Math.PI)
    ctx1.fill()
    ctx1.moveTo(curClick.x, curClick.y)
    ctx2.arc(curClick.x, curClick.y, 10, 0, 2 * Math.PI)
    ctx2.fill()
    ctx2.moveTo(curClick.x, curClick.y)
    drawFlag = false
})

canvas2.addEventListener('mousedown', function (e) {
    let curClick = getMousePos(canvas2, e)
    clickFlag = true
    drawFlag = true
    ctx.beginPath()
    ctx.arc(curClick.x, curClick.y, 10, 0, 2 * Math.PI)
    ctx.fill()
    ctx.moveTo(curClick.x, curClick.y)
    ctx1.beginPath()
    ctx1.arc(curClick.x, curClick.y, 10, 0, 2 * Math.PI)
    ctx1.fill()
    ctx1.moveTo(curClick.x, curClick.y)
    ctx2.beginPath()
    ctx2.arc(curClick.x, curClick.y, 10, 0, 2 * Math.PI)
    ctx2.fill()
    ctx2.moveTo(curClick.x, curClick.y)
    points.push(curClick)
    prevMouse.x = curClick.x
    prevMouse.y = curClick.y
})

canvas2.addEventListener('mousemove', function (e) {
    if (drawFlag) {
        ctx.beginPath()
        ctx1.beginPath()
        let curClick = getMousePos(canvas2, e)
        if (Math.abs(curClick.x - prevMouse.x) > 30 || Math.abs(curClick.y - prevMouse.y) > 30) {
            points.push(curClick)
            ctx.arc(curClick.x, curClick.y, 10, 0, 2 * Math.PI)
            ctx.fill()
            ctx.moveTo(curClick.x, curClick.y)
            ctx1.arc(curClick.x, curClick.y, 10, 0, 2 * Math.PI)
            ctx1.fill()
            ctx1.moveTo(curClick.x, curClick.y)
            ctx2.arc(curClick.x, curClick.y, 10, 0, 2 * Math.PI)
            ctx2.fill()
            ctx2.moveTo(curClick.x, curClick.y)
            prevMouse.x = curClick.x
            prevMouse.y = curClick.y
        }
    }
})

canvas2.addEventListener('mouseup', function (e) {
    ctx.beginPath()
    ctx1.beginPath()
    let curClick = getMousePos(canvas2, e)
    points.push(curClick)
    ctx.arc(curClick.x, curClick.y, 10, 0, 2 * Math.PI)
    ctx.fill()
    ctx.moveTo(curClick.x, curClick.y)
    ctx1.arc(curClick.x, curClick.y, 10, 0, 2 * Math.PI)
    ctx1.fill()
    ctx1.moveTo(curClick.x, curClick.y)
    ctx2.arc(curClick.x, curClick.y, 10, 0, 2 * Math.PI)
    ctx2.fill()
    ctx2.moveTo(curClick.x, curClick.y)
    drawFlag = false
})
