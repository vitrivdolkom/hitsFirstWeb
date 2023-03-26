const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
ctx.canvas.width = 500;
ctx.canvas.height = 500;
let size;
let canvasWidth = 500;
let canvasHeight = 500;
let startFlag = false;
let endFlag = false;
let start, end;
let field;

class priorityQueue {
  constructor() {
    this.items = [];
  }

  enqueue(item, priority) {
    let element = { item, priority };
  }
}

class Point {
  constructor(i, j) {
    this.x = i;
    this.y = j;
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.neighbors = undefined;
    this.visited = false;
    this.wall = false;
    this.prev = undefined;
  }
}

function createMatrix(field, size) {
  for (var i = 0; i < size; i++) {
    field[i] = new Array(size);
  }

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      field[i][j] = new Point(i, j);
    }
  }

  return field;
}

function generateMaze(field) {
  let row = Math.floor(Math.random() * size);
  let col = Math.floor(Math.random() * size);
  let countWalls = 0;
  field[row][col].wall = false;

  let stack = [field[row][col]];

  while (stack.length > 0) {
    let currentCell = stack.pop();

    let neighbors = findNeighbors(field, field[row][col], size);
    if (neighbors.length > 0) {
      let randomIndex = Math.floor(Math.random() * neighbors.length);
      let nextRow = Math.floor(Math.random() * size);
      let nextCol = Math.floor(Math.random() * size);

      let randomNumber = Math.floor(Math.random() * 100) + 1;
      if (randomNumber > 85) {
        field[nextRow][nextCol].wall = true;
        ctx.fillStyle = "black";
        ctx.fillRect(
          Math.round(field[nextRow][nextCol].x * (canvasWidth / size)),
          Math.round(field[nextRow][nextCol].y * (canvasWidth / size)),
          canvasWidth / size,
          canvasHeight / size
        );
        countWalls++;
      }

      stack.push(field[nextRow][nextCol]);
    }
    if (countWalls > (size * size) / 2) {
      break;
    }
  }

  return field;
}

function reconstructPath(start, end) {
  let finalPath = [];
  let current = end;
  finalPath.push(current);
  while (current != start) {
    current = current.prev;
    finalPath.push(current);
  }
  return finalPath.reverse();
}

function deleteElement(array, element) {
  for (let i = array.length - 1; i >= 0; i--) {
    if (array[i] == element) {
      array.splice(i, 1);
    }
  }
}

function findNeighbors(field, currentPoint, size) {
  let neighbors = [];

  if (currentPoint.x > 0) {
    if (field[currentPoint.x - 1][currentPoint.y].wall != true) {
      neighbors.push(field[currentPoint.x - 1][currentPoint.y]);
    }
  }

  if (currentPoint.y + 1 < size) {
    if (field[currentPoint.x][currentPoint.y + 1].wall != true) {
      neighbors.push(field[currentPoint.x][currentPoint.y + 1]);
    }
  }

  if (currentPoint.y > 0) {
    if (field[currentPoint.x][currentPoint.y - 1].wall != true) {
      neighbors.push(field[currentPoint.x][currentPoint.y - 1]);
    }
  }

  if (currentPoint.x + 1 < size) {
    if (field[currentPoint.x + 1][currentPoint.y].wall != true) {
      neighbors.push(field[currentPoint.x + 1][currentPoint.y]);
    }
  }
  return neighbors;
}

function calculateHeuristic(first, second) {
  return Math.abs(first.x - second.x) + Math.abs(first.y - second.y);
}

function aStar(field, start, end) {
  let openSet = [];
  openSet.push(start);
  let cameFrom = [];

  while (openSet.length > 0) {
    let win = 0;

    for (let i = 1; i < openSet.length; i++) {
      if (openSet[i].f < openSet[win].f) {
        win = i;
      }

      if (openSet[i].f == openSet[win].f) {
        if (openSet[i].g > openSet[win].g) {
          win = i;
        }
      }
    }
    let currentNode = openSet[win];

    if (currentNode == end) {
      return 1;
    }

    deleteElement(openSet, currentNode);
    cameFrom.push(currentNode);

    let neighbors = findNeighbors(field, currentNode, size);

    for (let i = 0; i < neighbors.length; i++) {
      let neighbor = neighbors[i];
      if (!cameFrom.includes(neighbor)) {
        let g = currentNode.g + calculateHeuristic(currentNode, neighbor);

        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor);
        } else if (g >= neighbor.g) {
          continue;
        }

        neighbor.g = g;
        neighbor.h = calculateHeuristic(neighbor, end);
        neighbor.f = neighbor.g + neighbor.h;
        neighbor.prev = currentNode;
      }
    }
  }
  return 0;
}

function draw() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  for (let i = 0; i < canvasWidth; i += canvasWidth / size) {
    for (let j = 0; j < canvasHeight; j += canvasHeight / size) {
      ctx.beginPath();
      ctx.strokeStyle = "black";
      ctx.lineWidth = "1";
      ctx.strokeRect(i, j, canvasWidth / size, canvasHeight / size);
    }
  }
}

let input = document.querySelector(".matrixSize");
let confirmButton = document.querySelector(".confirmSize");
let inputObstacle = document.querySelector(".obstacle");
let calculateButton = document.querySelector(".calculate");

let startX;
let startY;
let endX;
let endY;
let removeObstacles = false;

inputObstacle.addEventListener("click", function (e) {
  if (removeObstacles == false) {
    removeObstacles = true;
  } else {
    removeObstacles = false;
  }
});

confirmButton.addEventListener("click", function (e) {
  size = +input.value;
  field = new Array(size);
  field = createMatrix(field, size);
  start = undefined;
  end = undefined;
  startFlag = false;
  endFlag = false;
  draw();
  field = generateMaze(field);
  ctx.fillStyle = "#000000";
  ctx.fill();
});

canvas.addEventListener("click", function (e) {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  for (let i = 0; i < canvasWidth; i += canvasWidth / size) {
    for (let j = 0; j < canvasHeight; j += canvasHeight / size) {
      if (
        i < x &&
        j < y &&
        i + canvasWidth / size > x &&
        j + canvasHeight / size > y
      ) {
        if (startFlag == true && startX == i && startY == j) {
          ctx.fillStyle = "white";
          ctx.fillRect(i, j, canvasWidth / size, canvasHeight / size);
          ctx.strokeRect(i, j, canvasWidth / size, canvasHeight / size);
          startFlag = false;
          start = undefined;
        } else if (endFlag == true && endX == i && endY == j) {
          ctx.fillStyle = "white";
          ctx.fillRect(i, j, canvasWidth / size, canvasHeight / size);
          ctx.strokeRect(i, j, canvasWidth / size, canvasHeight / size);
          endFlag = false;
          end = undefined;
        } else if (startFlag == false) {
          ctx.fillStyle = "aqua";
          ctx.fillRect(i, j, canvasWidth / size, canvasHeight / size);
          startFlag = true;
          startX = i;
          startY = j;
          start =
            field[Math.round(i / (canvasWidth / size))][
              Math.round(j / (canvasHeight / size))
            ];
        } else if (endFlag == false) {
          ctx.fillStyle = "red";
          ctx.fillRect(i, j, canvasWidth / size, canvasHeight / size);
          endFlag = true;
          endX = i;
          endY = j;
          end =
            field[Math.round(i / (canvasWidth / size))][
              Math.round(j / (canvasHeight / size))
            ];
        } else if (removeObstacles == false) {
          ctx.fillStyle = "black";
          ctx.fillRect(i, j, canvasWidth / size, canvasHeight / size);
          field[Math.round(i / (canvasWidth / size))][
            Math.round(j / (canvasHeight / size))
          ].wall = true;
        } else if (removeObstacles == true) {
          ctx.fillStyle = "white";
          ctx.fillRect(i, j, canvasWidth / size, canvasHeight / size);
          ctx.strokeRect(i, j, canvasWidth / size, canvasHeight / size);
          field[Math.round(i / (canvasWidth / size))][
            Math.round(j / (canvasHeight / size))
          ].wall = false;
        }
      }
    }
  }
});

calculateButton.addEventListener("click", function (e) {
  let openSet = [];
  let closedSet = [];

  openSet.push(start);
  if (start == undefined || end == undefined) {
    alert("Вы не поставили точку старта или точку конца");
  } else {
    if (aStar(field, start, end) == 1) {
      console.log("Путь найден");
      let path = reconstructPath(start, end);
      console.log(path);
      for (let i = 0; i < path.length - 1; i++) {
        ctx.moveTo(
          Math.round(path[i].x * (canvasWidth / size)) + canvasWidth / size / 2,
          Math.round(path[i].y * (canvasHeight / size)) + canvasWidth / size / 2
        );
        ctx.lineTo(
          Math.round(path[i + 1].x * (canvasWidth / size)) +
            canvasWidth / size / 2,
          Math.round(path[i + 1].y * (canvasHeight / size)) +
            canvasWidth / size / 2
        );
        ctx.save();
        ctx.strokeStyle = "green";
        if (size <= 5) {
          ctx.lineWidth = "13";
        } else if (size <= 10) {
          ctx.lineWidth = "7";
        } else {
          ctx.lineWidth = "3";
        }
        ctx.stroke();
        ctx.restore();
        /*ctx.fillStyle = "green";
        ctx.fillRect(
          path[i].x * (canvasWidth / size),
          path[i].y * (canvasHeight / size),
          canvasWidth / size,
          canvasHeight / size
        );*/
      }
    } else {
      console.log("Пути нет");
    }
  }
});
