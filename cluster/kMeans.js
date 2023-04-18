import { findDistance } from './additionalFunctions.js'

export function kMeans(points, k, maxIterations) {
    let centroids = []
    let i = 0
    let distances = []

    for (let i = 0; i < points.length; i++) {
        distances.push(Infinity)
    }

    let index = Math.floor(Math.random() * points.length)
    centroids.push(points[index])
    points[index].visit = true

    while (i < k - 1) {
        for (let j = 0; j < points.length; j++) {
            let distance = findDistance(points[j], centroids[i])
            distances[j] = Math.min(distances[j], distance)
        }

        let sumOfDistances = 0
        for (let k = 0; k < distances.length; k++) {
            sumOfDistances += distances[k]
        }

        let rand = Math.random() * sumOfDistances
        for (let j = 0; j < distances.length; j++) {
            rand -= distances[j]

            if (rand <= 0 && !points[j].visit) {
                centroids.push(points[j])
                points[j].visit = true
                i++
                break
            }
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
