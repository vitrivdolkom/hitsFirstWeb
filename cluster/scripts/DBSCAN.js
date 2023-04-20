import { findDistance } from './additionalFunctions.js'

function isHere(visited, point) {
    for (const visitedPoint of visited) {
        if (visitedPoint.x === point.x && visitedPoint.y === point.y) {
            return true
        }
    }
    return false
}

function expandCluster(points, cluster, visited, minPts, point, neighbors, epsilon) {
    visited.push(point)
    for (const neighbor of neighbors) {
        if (!isHere(visited, neighbor)) {
            let neighborNeighbors = getNeighbors(points, neighbor, epsilon)
            if (neighborNeighbors.length >= minPts) {
                expandCluster(points, cluster, visited, minPts, neighbor, neighborNeighbors, epsilon)
            }
        }
    }
    cluster.push(point)
}

function getNeighbors(points, point, epsilon) {
    let neighbors = []
    for (const currentPoint of points) {
        if (currentPoint.x != point.x && currentPoint.y != point.y) {
            if (findDistance(currentPoint, point) <= epsilon) {
                neighbors.push(currentPoint)
            }
        }
    }
    return neighbors
}

export function DBSCAN(points, epsilon, minPts) {
    let allPoints = []
    for (const point of points) {
        point.noise = false
        point.dbClusterIndex = -1
    }
    let clusters = []
    let visited = []

    for (const point of points) {
        if (!isHere(visited, point)) {
            visited.push(point)
            let neighbors = getNeighbors(points, point, epsilon)
            if (neighbors.length < minPts) {
                point.noise = true
            } else {
                let cluster = []
                expandCluster(points, cluster, visited, minPts, point, neighbors, epsilon)
                clusters.push(cluster)
            }
        }
    }

    for (let i = 0; i < clusters.length; i++) {
        let cluster = clusters[i]
        for (let j = 0; j < cluster.length; j++) {
            let point = cluster[j]
            point.dbClusterIndex = i
        }
    }
    for (const visitedPoint of visited) {
        allPoints.push(visitedPoint)
    }

    return allPoints
}
