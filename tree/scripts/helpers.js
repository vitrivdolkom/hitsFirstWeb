export const getLeafName = (node) => {
    return `target_${node.parent}_${node.variant}_${node.question}`
}

export const getVariantName = (node) => {
    return `${node.parent}_${node.variant}`
}

export const mapArrayDeepCopy = (arr) => {
    const result = []
    arr.forEach((element) => {
        result.push(new Map(element))
    })

    return result
}
