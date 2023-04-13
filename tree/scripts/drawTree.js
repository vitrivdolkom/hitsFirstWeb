import { getLeafName, getVariantName } from './helpers.js'

const createTreeElement = (node, container) => {
    const li = document.createElement('li')
    li.classList.add('node')

    let isRoot = false

    const block = document.createElement('div')
    block.classList.add('variantAndQuestion')

    if (node.variant) {
        const variant = document.createElement('div')
        variant.textContent = node.variant
        variant.setAttribute('data-variant', getVariantName(node))
        variant.classList.add('variant')
        variant.classList.add('rect')
        block.appendChild(variant)
    } else {
        isRoot = true
        li.classList.add('rootNode')
    }

    let question
    let questionText = document.createElement('div')
    questionText.classList.add('question')
    questionText.classList.add('rect')
    if (isRoot) questionText.classList.add('root')
    questionText.textContent = node.question

    if (isRoot) {
        li.appendChild(questionText)
    } else {
        question = document.createElement('li')
        question.appendChild(questionText)

        block.appendChild(question)
        li.appendChild(block)
    }

    if (node.children.length > 0) {
        const ul = document.createElement('ul')
        questionText.setAttribute('data-question', node.question)

        node.children.forEach((child) => {
            ul.appendChild(createTreeElement(child))
        })

        if (isRoot) container.appendChild(ul)
        else question.appendChild(ul)
    } else {
        questionText.classList.add('leaf')
        questionText.setAttribute('data-question', getLeafName(node))
    }

    return li
}

export const drawTree = (tree) => {
    const container = document.querySelector('.content')
    container.textContent = ''

    const treeElement = createTreeElement(tree.it, container)
    container.insertBefore(treeElement, container.firstChild)
}
