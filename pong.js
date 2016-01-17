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
var player = new Player();
var computer = new Computer();
var ball = new Ball(200, 300);
var playerScore = 0;
var computerScore = 0;

document.getElementById('player-score').innerHTML = playerScore;
document.getElementById('computer-score').innerHTML = computerScore;

var keysDown = {};

var render = function() {
    context.fillStyle = '#dddddd';
    context.fillRect(0, 0, width, height);
    player.render();
    computer.render();
    ball.render();
};

var update = function() {
    player.update();
    computer.update(ball);
    ball.update(player.paddle, computer.paddle);
};

var step = function() {
    update();
    render();
    animate(step);
};

function Paddle(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.xSpeed = 0;
    this.ySpeed = 0;
}

Paddle.prototype.render = function() {
    context.fillStyle = '#0000FF';
    context.fillRect(this.x, this.y, this.width, this.height);
};

Paddle.prototype.move = function(x, y) {
    this.x += x;
    this.y += y;
    this.xSpeed = x;
    this.ySpeed = y;
    if (this.x < 0) { // all the way left
        this.x = 0;
        this.xSpeed = 0;
    } else if (this.x + this.width > 400) { // all the way right
        this.x = 400 - this.width;
        this.xSpeed = 0;
    }
};

function Player() {
    this.paddle = new Paddle(175, 580, 50, 10);
}

Player.prototype.render = function() {
    this.paddle.render();
};

Player.prototype.update = function() {
    for (var key in keysDown) {
        var value = Number(key);
        if (value === 37) { // left arrow
            this.paddle.move(-4, 0);
        } else if (value === 39) { // right arrow
            this.paddle.move(4, 0);
        } else {
            this.paddle.move(0, 0);
        }
    }
};

function Computer() {
    this.paddle = new Paddle(175, 10, 50, 10);
}

Computer.prototype.render = function() {
    this.paddle.render();
};

Computer.prototype.update = function(ball) {
    var xPos = ball.x;
    var diff = -((this.paddle.x + (this.paddle.width / 2)) - xPos);
    if (diff < 0 && diff < -4) { // max speed left
        diff = -5;
    } else if (diff > 0 && diff > 4) { // max speed right
        diff = 5;
    }
    this.paddle.move(diff, 0);
    if (this.paddle.x < 0) {
        this.paddle.x = 0;
    } else if (this.paddle.x + this.paddle.width > 400) {
        this.paddle.x = 400 - this.paddle.width;
    }
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
    context.fillStyle = '#202020';
    context.fill();
};

Ball.prototype.update = function(paddle1, paddle2) {
    this.x += this.xSpeed;
    this.y += this.ySpeed;
    var topX = this.x - 5;
    var topY = this.y - 5;
    var bottomX = this.x + 5;
    var bottomY = this.y + 5;

    // Collision detection
    if (this.x - 5 < 0) { // hitting left wall
        this.x = 5;
        this.xSpeed = -this.xSpeed;
    } else if (this.x + 5 > 400) { // hiting right wall
        this.x = 395;
        this.xSpeed = -this.xSpeed;
    }

    if (this.y < 0) { // Player point scored
        this.xSpeed = 0;
        this.ySpeed = 3;
        this.x = 200;
        this.y = 300;
        playerScore++;
        document.getElementById('player-score').innerHTML = playerScore;
    }

    if (this.y > 600) { // Computer point scored
        this.xSpeed = 0;
        this.ySpeed = 3;
        this.x = 200;
        this.y = 300;
        computerScore++;
        document.getElementById('computer-score').innerHTML = computerScore;
    }

    if (topY > 300) {
        if (topY < (paddle1.y + paddle1.height) && bottomY > paddle1.y && topX < (paddle1.x + paddle1.width) && bottomX > paddle1.x) {
            // hit the player's paddle
            this.ySpeed = -3;
            this.xSpeed += paddle1.xSpeed / 2;
            this.y += this.ySpeed;
        }
    } else {
        if (topY < (paddle2.y + paddle2.height) && bottomY > paddle2.y && topX < (paddle2.x + paddle2.width) && bottomX > paddle2.x) {
            // hit the computer's paddle
            this.ySpeed = 3;
            this.xSpeed += paddle2.xSpeed / 2;
            this.y += this.ySpeed;
        }
    }
};

window.onload = function() {
    document.body.appendChild(canvas);
    animate(step);
};

window.addEventListener('keydown', function(event) {
    keysDown[event.keyCode] = true;
});

window.addEventListener('keyup', function(event) {
    delete keysDown[event.keyCode];
});
