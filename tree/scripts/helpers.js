export const getLeafName = (node) => {
    return `target_${node.parent}_${node.variant}_${node.question}`
}

export const getVariantName = (node) => {
    return `${node.parent}_${node.variant}`
}
