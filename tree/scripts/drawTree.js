const createTreeElement = (node, container) => {
    const li = document.createElement('li')
    li.classList.add('node')

    let isRoot = false

    const block = document.createElement('div')
    block.classList.add('variantAndQuestion')

    if (node.variant) {
        const variant = document.createElement('div')
        variant.textContent = node.variant
        variant.classList.add('variant')
        block.appendChild(variant)
    } else {
        isRoot = true
        li.classList.add('root')
    }

    let question
    if (isRoot) {
        li.textContent = node.question
    } else {
        question = document.createElement('div')
        question.textContent = node.question
        question.classList.add('question')
        block.appendChild(question)
        li.appendChild(block)
    }

    if (node.children.length > 0) {
        const ul = document.createElement('ul')

        node.children.forEach((child) => {
            ul.appendChild(createTreeElement(child))
        })

        if (isRoot) container.appendChild(ul)
        else li.appendChild(ul)
    } else {
        question.classList.add('leaf')
    }

    return li
}

export const drawTree = (tree) => {
    const container = document.querySelector('.content')

    const treeElement = createTreeElement(tree.it, container)
    container.insertBefore(treeElement, container.firstChild)
}
