export class Tree {
    constructor() {
        this.it = new Map()
    }

    addNode(question) {
        if (this.last === undefined) {
            const node = new Map()
            node.set('question', question)
            this.it.set('root', node)
            this.last = this.it.get('root')

            return
        }
    }

    addBranch(answer) {}
}
