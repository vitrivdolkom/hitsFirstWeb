import { findDistance } from './additionalFunctions.js'

function getDistanceBetweenClusters(firstCluster, secondCluster) {
    let minDistance = Infinity

    for (const firstClusterPoint of firstCluster) {
        for (const secondClusterPoint of secondCluster) {
            const distance = findDistance(firstClusterPoint, secondClusterPoint)

            if (distance < minDistance) {
                minDistance = distance
            }
        }
    }

    return minDistance
}

function findClosestClusters(clusters) {
    let minDistance = Infinity
    let closestClusters = 0
    for (let i = 0; i < clusters.length; i++) {
        for (let j = i + 1; j < clusters.length; j++) {
            let distance = getDistanceBetweenClusters(clusters[i], clusters[j])
            //single-linkage
            if (distance < minDistance) {
                minDistance = distance
                closestClusters = {
                    x: i,
                    y: j,
                }
            }
        }
    }

    return closestClusters
}

function mergeClusters(clusters, closestClusters) {
    let mergedCluster = []

    let firstCluster = clusters[closestClusters.x]
    let secondCluster = clusters[closestClusters.y]

    for (const firstClusterPoint of firstCluster) {
        mergedCluster.push(firstClusterPoint)
    }

    for (const secondClusterPoint of secondCluster) {
        mergedCluster.push(secondClusterPoint)
    }

    clusters.splice(closestClusters.y, 1)
    clusters.splice(closestClusters.x, 1)
    clusters.push(mergedCluster)
}

export function hierarchicalClustering(points, amountOfClusters) {
    let clusters = []
    for (let i = 0; i < points.length; i++) {
        clusters.push([])
        clusters[i].push(points[i])
    }

    while (clusters.length > amountOfClusters) {
        let closestClusters = findClosestClusters(clusters)
        mergeClusters(clusters, closestClusters)
    }

    return clusters
}
