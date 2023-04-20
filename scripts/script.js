import { openModal } from './modal.js'

const astarInfo = document.querySelector('div[data-algo="astar"]')
const antsInfo = document.querySelector('div[data-algo="ants"]')
const treeInfo = document.querySelector('div[data-algo="tree"]')
const clusterInfo = document.querySelector('div[data-algo="cluster"]')
const network = document.querySelector('div[data-algo="network"]')
const genetic = document.querySelector('div[data-algo="genetic"]')

astarInfo.addEventListener('click', () => {
    openModal('Информация об аСтаре')
})

antsInfo.addEventListener('click', () => {
    openModal('Информация об муравьях')
})

treeInfo.addEventListener('click', () => {
    openModal('Информация об дереве')
})

clusterInfo.addEventListener('click', () => {
    openModal('Информация об кластере')
})

network.addEventListener('click', () => {
    openModal('Информация об нейронке')
})

genetic.addEventListener('click', () => {
    openModal('Информация об генетике')
})
