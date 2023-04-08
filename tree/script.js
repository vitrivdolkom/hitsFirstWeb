import { DecisionTree } from './DecisionTree.js'

const inputFile = document.querySelector("input[name='readCsv']")
const createTreeBtn = document.querySelector('.createTree')
const fileRegex = new RegExp('(.*?).(csv)$', 'i')

inputFile.addEventListener('change', handleFile)
createTreeBtn.addEventListener('click', createTree)

const tree = new DecisionTree()
let fullData

function handleFile(e) {
    const file = e.target.files[0]

    if (file && fileRegex.test(file.name)) {
        const reader = new FileReader()

        reader.onload = (e) => setTable(e.target.result)

        reader.readAsText(file)
    } else {
        e.target.vaule = ''
        alert('Error')
    }
}

function setTable(text) {
    const rows = text.split('\n')
    const headers = rows[0].split(',')
    const target = headers[headers.length - 1]
    const id = headers[0]

    const data = []

    for (let i = 1; i < rows.length; i++) {
        if (!rows[i]) continue

        const values = rows[i].split(',')
        const obj = new Map()

        for (let j = 0; j < headers.length; j++) {
            obj.set(headers[j], values[j])
        }

        data.push(obj)
    }

    fullData = data
    tree.target = target
    tree.id = id
}

function createTree() {
    if (!tree.target) return

    tree.createTree(fullData)
}
