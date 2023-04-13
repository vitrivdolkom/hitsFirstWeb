export const prune = (tree) => {
    let node = tree.it

    while (node.children.length) {
        let isUseless = true

        for (let i = 1; i < node.children.length; i++) {
            if (node.children[i].question !== node.children[i - 1].question) {
                isUseless = false
            }
        }

        if (isUseless) {
            console.log(node)
        }
    }
}
