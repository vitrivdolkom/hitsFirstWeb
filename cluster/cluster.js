var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

ctx.canvas.width = 800;
ctx.canvas.height = 400;
let canvasWidth = 800;
let canvasHeight = 400;

ctx.clearRect(0, 0, canvasWidth, canvasHeight);
ctx.beginPath();
ctx.strokeStyle = "black";
