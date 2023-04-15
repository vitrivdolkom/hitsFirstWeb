import { TreeNode } from './TreeNode.js'

export class Tree {
    constructor() {
        this.it = null
        this.leafs = []
    }

    addNode(question) {
        if (!this.it) {
            const node = new TreeNode(question)
            this.it = node
            return
        }
    }

    addBranch(from, answer, question, isLeaf = false, columns, s) {
        const node = this.dfs(this.it, from)
        const newNode = new TreeNode(question)

        newNode.set(from, answer, columns, s)

        node.children.push(newNode)
        if (isLeaf) this.leafs.push(newNode)
    }

    dfs(node, question) {
        if (node.question !== question) {
            for (let i = 0; i < node.children.length; i++) {
                const child = node.children[i]

                const toNode = this.dfs(child, question)

                if (toNode === undefined) continue

                return toNode
            }
        } else {
            return node
        }
    }
}
