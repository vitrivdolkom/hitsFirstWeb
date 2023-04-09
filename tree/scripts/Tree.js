import { TreeNode } from './TreeNode.js'

export class Tree {
    constructor() {
        this.it = null
    }

    addNode(question) {
        if (!this.it) {
            const node = new TreeNode(question)
            this.it = node
            return
        }
    }

    addBranch(from, answer, question) {
        const node = this.dfs(this.it, from)
        const newNode = new TreeNode(question)

        newNode.parent = from
        newNode.variant = answer

        node.children.push(newNode)
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
