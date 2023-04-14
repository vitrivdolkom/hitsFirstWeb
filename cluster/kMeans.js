import { findDistance } from './additionalFunctions.js'

export function kMeans(points, k, maxIterations) {
    let centroids = []
    let i = 0
    while (i < k) {
        let index = Math.floor(Math.random() * points.length)
        if (!points[index].visit) {
            centroids.push(points[index])
            points[index].visit = true
            i++
        }
    }

    for (let iter = 0; iter < maxIterations; iter++) {
        let clusters = new Array(k).fill().map(() => [])

        for (let i = 0; i < points.length; i++) {
            let minDistance = Infinity
            let closestCentroids

            for (let j = 0; j < centroids.length; j++) {
                let distance = findDistance(points[i], centroids[j])

                if (distance < minDistance) {
                    minDistance = distance
                    closestCentroids = j
                }
            }

            clusters[closestCentroids].push(points[i])
            points[i].clusterIndex = closestCentroids
        }
    }
    for (let i = 0; i < points.length; i++) {
        points[i].visit = false
    }
    return centroids
}
