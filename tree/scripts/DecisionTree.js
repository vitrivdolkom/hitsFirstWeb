import { Tree } from './Tree.js'

export class DecisionTree {
    constructor() {
        this.target = ''
        this.entropy = 0
        this.columns = new Map()
        this.targetVariants = null
        this.isRoot = false
        this.id = ''
        this.tree = new Tree()
    }

    setColumns(s) {
        const targetVariants = new Map()
        const columns = new Map()

        s[0].forEach((value, key) => {
            if (key !== this.id && key !== this.target) {
                s.forEach((element, index) => {
                    let column = columns.get(key)

                    if (column === undefined) {
                        columns.set(key, new Map())
                        column = columns.get(key)
                    }

                    const prev = columns.get(key).get(element.get(key))

                    if (prev === undefined) {
                        column.set(element.get(key), [index])
                    } else {
                        column.set(element.get(key), [...prev, index])
                    }
                })
            }
        })

        s.forEach((element) => {
            let prev = targetVariants.get(element.get(this.target))

            if (prev === undefined) {
                targetVariants.set(element.get(this.target), 1)
            } else {
                targetVariants.set(element.get(this.target), prev + 1)
            }
        })

        return [targetVariants, columns]
    }

    calculateEntropy(s, targetVariants) {
        let entropy = 0
        const size = s.length

        targetVariants.forEach((value) => {
            const p = value / size
            entropy += -1 * (p * Math.log2(p))
        })

        return entropy
    }

    calculateColumnsEntropy(s, columns, targetVariants, fullEntropy) {
        let bestIG = -1
        let bestColumn

        columns.forEach((column, columnName) => {
            let entropy = 0

            column.forEach((indexes, variant) => {
                let currentEntropy = 0
                const p = indexes.length / s.length

                targetVariants.forEach((value, key) => {
                    let counter = 0

                    indexes.forEach((row) => {
                        if (s[row].get(this.target) === key) counter++
                    })

                    const currentP = counter / indexes.length
                    currentEntropy += !currentP ? 0 : -1 * (currentP * Math.log2(currentP))
                })
                entropy += p * currentEntropy
            })

            const IG = fullEntropy - entropy

            if (bestIG < IG) {
                bestIG = IG
                bestColumn = columnName
            }

            columns.get(columnName).set('IG', IG)
        })

        return bestColumn
    }

    createNode(s) {
        let [targetVariants, columns] = this.setColumns(s)
        let entropy = this.calculateEntropy(s, targetVariants)

        const bestColumnName = this.calculateColumnsEntropy(s, columns, targetVariants, entropy)

        return bestColumnName
    }

    determineLeaf(s, columns, columnName) {
        const toColumn = columns.get(columnName)

        toColumn.forEach((indexes, variant) => {
            let max = -1
            let best = ''
            const answer = new Map()

            indexes.forEach((index) => {
                let prev = answer.get(s[index].get(this.target))

                if (prev === undefined) {
                    answer.set(s[index].get(this.target), 1)
                } else {
                    answer.set(s[index].get(this.target), prev + 1)
                }

                const count = answer.get(s[index].get(this.target))
                if (count > max) {
                    max = count
                    best = s[index].get(this.target)
                }
            })

            this.tree.addBranch(columnName, variant, `${best}`, true, columns, s)
        })
    }

    createTree(s, bestColumn, depth, maxDepth) {
        let [targetVariants, columns] = this.setColumns(s)

        if (s[0].size === 3 || depth > maxDepth) {
            this.determineLeaf(s, columns, bestColumn)
            return
        }

        let bestColumnName = bestColumn
        let entropy

        if (!bestColumn) {
            entropy = this.calculateEntropy(s, targetVariants)
            bestColumnName = this.calculateColumnsEntropy(s, columns, targetVariants, entropy)
        }

        const toColumn = columns.get(bestColumnName)
        if (!this.tree.it) this.tree.addNode(bestColumnName)

        const q = []
        const columnsToDelete = [bestColumnName]

        toColumn.forEach((indexes, variant) => {
            if (variant !== 'IG') {
                const newS = { s: [], best: '' }

                indexes.forEach((index) => {
                    columnsToDelete.forEach((columnName) => {
                        s[index].delete(columnName)
                    })
                })

                // if (s[indexes[0]].size > 3) {
                //     indexes.forEach((index) => {
                //         s[index].delete(bestColumnName)
                //     })
                // }

                indexes.forEach((index) => {
                    newS.s.push(s[index])
                })

                if (newS.s[0].size > 2) {
                    const best = this.createNode(newS.s)

                    columnsToDelete.push(best)
                    newS.best = best
                    q.push(newS)

                    this.tree.addBranch(bestColumnName, variant, best, false, columns, targetVariants, s)
                }
                // } else {
                //     this.determineLeaf(s, columns, bestColumnName)
                // }
            }
        })

        if (!q.length) {
            this.determineLeaf(s, columns, bestColumnName)
        }

        for (let i = 0; i < q.length; i++) {
            const currentS = q[i].s

            currentS.forEach((element) => {
                columnsToDelete
                    .filter((columnName) => columnName !== q[i].best)
                    .forEach((columnName) => {
                        element.delete(columnName)
                    })
            })

            this.createTree(currentS, q[i].best, depth + 1, maxDepth)
        }

        return this.tree
    }
}
