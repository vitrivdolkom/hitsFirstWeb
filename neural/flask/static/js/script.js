const canv = document.querySelector('canvas')
const ctx = canv.getContext('2d')
const answer = document.querySelector('.answer')
const clearButton = document.querySelector('#clearButton')
const solveButton = document.querySelector('#solveButton')

let isMouseDown = false
const cords = []

document.addEventListener('mousedown', function () {
    isMouseDown = true
})

document.addEventListener('mouseup', function () {
    isMouseDown = false
    ctx.beginPath()
})

ctx.lineWidth = 4
canv.width = 50
canv.height = 50
canv.addEventListener('mousemove', function (e) {
    if (isMouseDown) {
        cords.push([e.clientX - canv.offsetLeft, e.clientY - canv.offsetTop])

        ctx.lineTo(e.clientX - canv.offsetLeft, e.clientY - canv.offsetTop)
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(e.clientX - canv.offsetLeft, e.clientY - canv.offsetTop, 2, 0, Math.PI * 2)
        ctx.fill()

        ctx.beginPath()
        ctx.moveTo(e.clientX - canv.offsetLeft, e.clientY - canv.offsetTop)
    }
})

clearButton.addEventListener('click', clearall)
solveButton.addEventListener('click', getAnswer)

function clearall() {
    ctx.clearRect(0, 0, canv.width, canv.height)
    cords = []
    ansplace.textContent = '-'
    ctx.beginPath()
}

function getAnswer() {
    const dataURL = canv.toDataURL('image/png')
    $.post(
        '/solver',
        {
            data: JSON.stringify(dataURL),
        },
        function (data, status, xhr) {
            answer.textContent = data['ans']
        }
    )
}
