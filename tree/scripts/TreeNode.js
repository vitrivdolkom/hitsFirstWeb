export class TreeNode {
    constructor(question) {
        this.question = question
        this.parent = ''
        this.children = []
        this.variant = ''
        this.columns = new Map()
    }

    set(parent, variant, columns, targetVariants, s) {
        this.parent = parent
        this.variant = variant
        this.columns = columns
        this.targetVariants = targetVariants
        this.s = s
    }

    addChild(node) {
        this.children.push(node)
    }
}
