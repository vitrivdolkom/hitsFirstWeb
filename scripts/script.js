import { algorithmsInfo } from './algorithmsInfo.js'
import { openModal } from './modal.js'

const astarInfo = document.querySelector('div[data-algo="astar"]')
const antsInfo = document.querySelector('div[data-algo="ants"]')
const treeInfo = document.querySelector('div[data-algo="tree"]')
const clusterInfo = document.querySelector('div[data-algo="cluster"]')
const network = document.querySelector('div[data-algo="network"]')
const genetic = document.querySelector('div[data-algo="genetic"]')

astarInfo.addEventListener('click', () => {
    openModal(algorithmsInfo.astar)
})

antsInfo.addEventListener('click', () => {
    openModal(algorithmsInfo.ants)
})

treeInfo.addEventListener('click', () => {
    openModal(algorithmsInfo.tree)
})

clusterInfo.addEventListener('click', () => {
    openModal(algorithmsInfo.cluster)
})

network.addEventListener('click', () => {
    openModal(algorithmsInfo.network)
})

genetic.addEventListener('click', () => {
    openModal(algorithmsInfo.genetic)
})
