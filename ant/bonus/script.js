import { COLONY_RADIUS, FOOD_RADIUS } from './constants.js'
import { WorldMap } from './Map.js'

window.addEventListener('load', function () {
    const canvasWrapper = document.querySelector('.canvasWrapper')
    const locateColonyInput = document.querySelector('#colony')
    const locateFood = document.querySelector('#food')
    const executeBtn = document.querySelector('.execute')

    const foodAmountInput = document.querySelector('#foodAmount')
    const foodAmountSpan = document.querySelector('.numberFood')

    const antAmountInput = document.querySelector('#antAmount')
    const antAmountSpan = document.querySelector('.numberAnt')

    const menu = document.querySelector('.top')
    const openMenu = document.querySelector('.openMenu')

    foodAmountSpan.textContent = +foodAmountInput.value
    antAmountSpan.textContent = +antAmountInput.value

    // todo canvas
    const canvas = document.querySelector('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = canvasWrapper.clientWidth
    canvas.height = canvasWrapper.clientHeight
    ctx.fillStyle = `rgb(255, 0, 0)`

    // todo variables
    let colonyCoordinates = { x: canvas.width / 2, y: canvas.height / 2, isSelected: false }
    let foodCoordinates = []

    let map = new WorldMap(canvas, colonyCoordinates.x, colonyCoordinates.y, locateFood, foodCoordinates, +antAmountInput.value)

    // todo event listeners
    foodAmountInput.addEventListener('input', function (e) {
        foodAmountSpan.textContent = +e.target.value
    })

    antAmountInput.addEventListener('input', function (e) {
        antAmountSpan.textContent = +e.target.value
        map.antsNum = +e.target.value
    })

    openMenu.addEventListener('click', function (e) {
        menu.classList.toggle('show')
        openMenu.childNodes[0].classList.toggle('up')
    })

    canvas.addEventListener('click', (e) => {
        const x = e.offsetX
        const y = e.offsetY

        if (locateFood.checked) {
            foodCoordinates.push({ x: x, y: y, amount: +foodAmountSpan.textContent })
            ctx.save()
            ctx.fillStyle = 'green'
            ctx.fillRect(x - FOOD_RADIUS, y - FOOD_RADIUS, FOOD_RADIUS * 2, FOOD_RADIUS * 2)
            ctx.restore()

            return
        }

        if (locateColonyInput.checked) {
            if (colonyCoordinates.isSelected) {
                alert('No')
                return
            }

            colonyCoordinates.x = x
            colonyCoordinates.y = y
            colonyCoordinates.isSelected = true

            ctx.fillRect(x - COLONY_RADIUS, y - COLONY_RADIUS, COLONY_RADIUS * 2, COLONY_RADIUS * 2)

            map.updateColony(colonyCoordinates)
            return
        }
    })

    executeBtn.addEventListener('click', function (e) {
        executeBtn.disabled = true
        map.first()
        let i = 0
        function animate() {
            if (!(i % 2000000)) map.firstDraw(ctx)
            map.render(ctx)
            requestAnimationFrame(animate)

            // setTimeout(() => {
            //     requestAnimationFrame(animate)
            // }, 1000 / 60)

            ++i
        }

        animate()
    })
})
