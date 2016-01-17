'use strict';
// Getting started
var animate = window.requestAnimationFrame || window.webkitRequestAnimationFrame ||
function(callback) {
    window.setTimeout(callback, 1000 / 60);
};

var canvas = document.createElement('canvas');
var width = 400;
var height = 600;

canvas.width = width;
canvas.height = height;
var context = canvas.getContext('2d');

// Create our objects
var player = new Player();
var computer = new Computer();
var ball = new Ball(200, 300);

var render = function() {
    context.fillStyle = '#FF00FF';
    context.fillRect(0, 0, width, height);
    player.render();
    computer.render();
    ball.render();
};

var update = function() {
    ball.update();
};

var step = function() {
    update();
    render();
    animate(step);
};

window.onload = function() {
    document.body.appendChild(canvas);
    animate(step);
};

// Paddle and ball
function Paddle(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
}

Paddle.prototype.render = function() {
    context.fillStyle = '#0000FF';
    context.fillRect(this.x, this.y, this.width, this.height);
};

function Player() {
    this.paddle = new Paddle(175, 580, 50, 10);
}

function Computer() {
    this.paddle = new Paddle(175, 10, 50, 10);
}

Player.prototype.render = function() {
    this.paddle.render();
};

Computer.prototype.render = function() {
    this.paddle.render();
};

function Ball(x, y) {
    this.x = x;
    this.y = y;
    this.xSpeed = 0;
    this.ySpeed = 3;
    this.radius = 5;
}

Ball.prototype.render = function() {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 2 * Math.PI, false);
    context.fillStyle = '#000000';
    context.fill();
};

Ball.prototype.update = function() {
    this.x += this.xSpeed;
    this.y += this.ySpeed;
};
