import { findDistance } from './additionalFunctions.js'

function isHere(visited, point) {
    for (let i = 0; i < visited.length; i++) {
        if (visited[i].x == point.x && visited[i].y == point.y) {
            return true
        }
    }
    return false
}

function expandCluster(points, cluster, visited, minPts, point, neighbors, epsilon) {
    visited.push(point)
    for (let neighbor of neighbors) {
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
    for (let i = 0; i < points.length; i++) {
        if (points[i].x != point.x && points[i].y != point.y) {
            if (findDistance(points[i], point) <= epsilon) {
                neighbors.push(points[i])
            }
        }
    }
    return neighbors
}

export function DBSCAN(points, epsilon, minPts) {
    debugger
    let allPoints = []
    for (let i = 0; i < points.length; i++) {
        points[i].noise = false
        points[i].dbClusterIndex = -1
    }
    let clusters = []
    let visited = []

    for (let i = 0; i < points.length; i++) {
        let point = points[i]
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
    for (let i = 0; i < visited.length; i++) {
        allPoints.push(visited[i])
    }

    return allPoints
}
