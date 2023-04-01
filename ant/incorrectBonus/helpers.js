export const getRandom = (min, max) => {
    return Math.random() * (max - min) + min
}

export const fillColonyPoints = (points, coord) => {
    const colony = document.querySelector('.colony')

    for (let i = coord.y - colony.clientHeight / 2; i < coord.y + colony.clientHeight / 2; i++) {
        for (let j = coord.x - colony.clientWidth / 2; j < coord.x + colony.clientWidth / 2; j++) {
            points[i][j].isHome = true
        }
    }
}

export const fillFoodPoints = (amount, points, coord) => {
    const foods = document.querySelectorAll('.food')

    const food = foods[foods.length - 1]

    for (let i = coord.y - Math.floor(food.clientHeight / 2); i < coord.y + Math.floor(food.clientHeight / 2); i++) {
        for (let j = coord.x - Math.floor(food.clientWidth / 2); j < coord.x + Math.floor(food.clientWidth / 2); j++) {
            points[i][j].isFood = true
            points[i][j].food = amount
        }
    }
}
