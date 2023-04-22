const num = document.querySelector('#number')
const distfield = document.querySelector('#dist')
const clearButton = document.querySelector('#clearButton')
const solveButton = document.querySelector('#solveButton')
const canv = document.querySelector('canvas')
const ctx = canv.getContext('2d')

const canvasSize = document.querySelector('.wrapper').clientWidth > 1520 ? 500 : 300
canv.width = canvasSize
canv.height = canvasSize

let cords = []
let deflt = 0

clearButton.addEventListener('click', clearall)
solveButton.addEventListener('click', solveExchange)

canv.addEventListener('mousedown', function (e) {
    num.textContent = +num.textContent + 1
    ctx.lineWidth = 0.1
    for (const currentCoords of cords) {
        ctx.strokeStyle = 'black'
        ctx.beginPath()
        ctx.moveTo(currentCoords[0], currentCoords[1])

        ctx.lineTo(e.clientX - canv.offsetLeft, e.clientY - canv.offsetTop)
        ctx.stroke()
    }
    ctx.beginPath()
    ctx.lineTo(e.clientX - canv.offsetLeft, e.clientY - canv.offsetTop)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(e.clientX - canv.offsetLeft, e.clientY - canv.offsetTop, 8, 0, Math.PI * 2)

    ctx.fill()

    ctx.beginPath()
    ctx.moveTo(e.clientX - canv.offsetLeft, e.clientY - canv.offsetTop)
    cords.push([e.clientX - canv.offsetLeft, e.clientY - canv.offsetTop])
})

function clearall() {
    ctx.clearRect(0, 0, canv.width, canv.height)
    cords = []
    num.textContent = 0
    distfield.textContent = 0
    ctx.beginPath()
}

function solveExchange() {
    distfield.textContent = '...'
    for (const fromCoords of cords) {
        for (const toCoords of cords) {
            ctx.strokeStyle = 'white'
            ctx.moveTo(fromCoords[0], fromCoords[1])
            ctx.lineWidth = 3
            ctx.lineTo(toCoords[0], toCoords[1])
            ctx.stroke()
            ctx.strokeStyle = 'black'
            ctx.moveTo(fromCoords[0], fromCoords[1])
            ctx.lineWidth = 1
            ctx.lineTo(toCoords[0], toCoords[1])
            ctx.stroke()
        }
    }
    distfield.textContent = '...'
    $.post(
        '/GetDots',
        {
            data: JSON.stringify(cords),
        },
        function (data, status, xhr) {
            const lastroot = data['ans'][data['ans'].length - 1][1]
            const lastlength = data['ans'][data['ans'].length - 1][0]
            for (let i = 0; i < data['ans'].length - 1; ++i) {
                show(data['ans'][i][1], 'red', lastroot, lastlength)
            }

            show(data['ans'][data['ans'].length - 1][1], 'green', lastroot, lastlength)
        }
    )
}

async function show(data, color, lastroot, lastlength) {
    await new Promise((resolve, reject) => setTimeout(resolve, 40))
    RootCleaner()
    for (let ind = 0; ind < data.length - 1; ++ind) {
        ctx.beginPath()
        ctx.moveTo(cords[data[ind] - 1][0], cords[data[ind] - 1][1])
        ctx.strokeStyle = 'white'
        ctx.lineWidth = 3
        ctx.lineTo(cords[data[ind + 1] - 1][0], cords[data[ind + 1] - 1][1])
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(cords[data[ind] - 1][0], cords[data[ind] - 1][1])
        ctx.strokeStyle = color
        ctx.lineWidth = 3
        ctx.lineTo(cords[data[ind + 1] - 1][0], cords[data[ind + 1] - 1][1])
        ctx.stroke()
    }
    if (color === 'green') {
        distfield.innerHTML = lastlength.toFixed(3)
    }
}

function RootCleaner() {
    for (const fromCoords of cords) {
        for (const toCoords of cords) {
            ctx.strokeStyle = 'white'
            ctx.moveTo(fromCoords[0], fromCoords[1])
            ctx.lineWidth = 3
            ctx.lineTo(toCoords[0], toCoords[1])
            ctx.stroke()
            ctx.strokeStyle = 'black'
            ctx.moveTo(fromCoords[0], fromCoords[1])
            ctx.lineWidth = 1
            ctx.lineTo(toCoords[0], toCoords[1])
            ctx.stroke()
        }
    }
}
