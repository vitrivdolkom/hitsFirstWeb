import { colors } from './colors.js'
import { kMeans } from './kMeans.js'
import { DBSCAN } from './DBSCAN.js'
import { findDistance } from './additionalFunctions.js'
import { getMousePos } from './additionalFunctions.js'
import { deleteRepeats } from './additionalFunctions.js'

let canvas = document.querySelector('canvas')
let ctx = canvas.getContext('2d')
let input = document.querySelector('.kMeans')
let clear = document.querySelector('.clear')
let starter = document.querySelector('.start')
let canvas1 = document.querySelector('.DB')
let ctx1 = canvas1.getContext('2d')

var radius = document.getElementById('myRange')
var output = document.getElementById('demo')
output.innerHTML = radius.value

radius.oninput = function () {
    output.innerHTML = this.value
}

var amountOfNeigbours = document.getElementById('myAnotherRange')
var anotherOutput = document.getElementById('anotherDemo')
anotherOutput.innerHTML = amountOfNeigbours.value

amountOfNeigbours.oninput = function () {
    anotherOutput.innerHTML = this.value
}

var amountOfCentroids = document.getElementById('kMeans')
var kMeansOutput = document.getElementById('kMeansDemo')
kMeansOutput.innerHTML = amountOfCentroids.value

amountOfCentroids.oninput = function () {
    kMeansOutput.innerHTML = this.value
}

ctx.canvas.width = 400
ctx.canvas.height = 300
let canvasWidth = 400
let canvasHeight = 300
let drawFlag = false
let prevMouse = { x: 0, y: 0, visit: false }
let points = []
let clickFlag = false

ctx1.canvas.width = 400
ctx1.canvas.height = 300
ctx1.beginPath()
ctx1.lineWidth = 1
ctx1.lineCap = 'round'
ctx1.strokeStyle = '#000000'
ctx1.strokeRect(0, 0, canvasWidth, canvasHeight)

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
    points = []
    clickFlag = false
})

starter.addEventListener('click', function (e) {
    if (clickFlag == true) {
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
        let kMeansCentroids = kMeans(points, +amountOfCentroids.value, 100)
        let DBSCANCentroidsAndNoise = DBSCAN(points, radius.value, amountOfNeigbours.value)
        debugger

        for (let i = 0; i < DBSCANCentroidsAndNoise.length; i++) {
            let point = DBSCANCentroidsAndNoise[i]
            let index = DBSCANCentroidsAndNoise[i].dbClusterIndex
            let color = 'black'
            if (point.noise == false) {
                color = colors[index]
            }
            ctx1.beginPath()
            ctx1.fillStyle = color
            ctx1.arc(point.x, point.y, 10, 0, 2 * Math.PI)
            ctx1.fill()
        }

        for (let i = 0; i < points.length; i++) {
            let point = points[i]
            let clusterIndex = point.clusterIndex
            let color = colors[clusterIndex]

            ctx.beginPath()
            ctx.fillStyle = color
            ctx.arc(point.x, point.y, 10, 0, 2 * Math.PI)
            ctx.fill()
        }

        for (let i = 0; i < kMeansCentroids.length; i++) {
            let centroid = kMeansCentroids[i]
            let color = 'black'

            ctx.beginPath()
            ctx.arc(centroid.x, centroid.y, 10, 0, 2 * Math.PI)
            ctx.strokeStyle = color
            ctx.lineWidth = 2
            ctx.stroke()
        }

        ctx.fillStyle = 'black'
        ctx1.fillStyle = 'black'
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
    drawFlag = false
})
