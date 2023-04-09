export class TreeNode {
    constructor(question) {
        this.question = question
        this.parent = ''
        this.children = []
    }

    addChild(node) {
        this.children.push(node)
    }
}
