// Set canvas to be in the center of the browser window
const canvas = document.getElementById("pongGame");
const context = canvas.getContext("2d");

// Calculate center position for canvas
const centerX = (window.innerWidth - canvas.width) / 2;
const centerY = (window.innerHeight - canvas.height) / 2;

// Set canvas position and style
canvas.style.left = `${centerX}px`;
canvas.style.top = `${centerY}px`;

let scoreOne = 0;
let scoreTwo = 0;
let isPlayerOneAI = true;
const playerOne = {
    x: 10,
    y: (canvas.height - 80) / 2,
    width: 15,
    height: 80,
    color: '#ffd335',
    speed: 10,
};

const playerTwo = {
    x: canvas.width - 25,
    y: (canvas.height - 80) / 2,
    width: 15,
    height: 80,
    color: '#ffd335',
    speed: 10,
};

const INITIAL_SPEED = 6;
let ballSpeed = INITIAL_SPEED;

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 8,
    color: '#fff',
    speedX: ballSpeed,
    speedY: 0,
};

let keysPressed = {
    "w": false,
    "s": false,
    "ArrowUp": false,
    "ArrowDown": false,
};

const PADDLE_SPEED = 2.5;

window.addEventListener("keydown", (e) => {
    keysPressed[e.key] = true;
});

window.addEventListener("keyup", (e) => {
    keysPressed[e.key] = false;
});

const playerOneDiv = document.getElementById('playerOne');
const scoreDiv = document.getElementById('score');
const playerTwoDiv = document.getElementById('playerTwo');

function setKeyState(key, state) {
    keysPressed[key] = state;
}

const TOLERANCE = 5;

let futureBallY;

function updateAIposition() {
    setKeyState("w", playerOne.y > futureBallY + TOLERANCE);
    setKeyState("s", playerOne.y < futureBallY - TOLERANCE);
}

function PaddleMovement(up, down, player) {
    if (keysPressed[up] && player.y - PADDLE_SPEED > 0) {
        player.y -= PADDLE_SPEED;
    }
    if (keysPressed[down] && player.y + player.height + PADDLE_SPEED < canvas.height) {
        player.y += PADDLE_SPEED;
    }
}

function updatePlayerPositions() {
    if (isPlayerOneAI) {
        updateAIposition();
        PaddleMovement("w", "s", playerOne);
    } else {
        PaddleMovement("w", "s", playerOne);
    }
    PaddleMovement("ArrowUp", "ArrowDown", playerTwo);
}

let i = 0;
function predictFutureBallY() {
    const timeToReachPaddle = Math.abs((playerOne.x - ball.x) / ball.speedX);
    futureBallY = ball.y + ball.speedY * timeToReachPaddle - 40;

    if (futureBallY < ball.radius) {
        futureBallY = ball.radius - (futureBallY - ball.radius) - 40;
    } else if (futureBallY > canvas.height - ball.radius) {
        futureBallY = 2 * (canvas.height - ball.radius) - futureBallY - 40;
    }
    i++;
}

setInterval(predictFutureBallY, 1000);

function displayScores() {
    scoreDiv.textContent = `${scoreOne} : ${scoreTwo}`;
}

function drawElement(element) {
    context.fillStyle = element.color;
    if (element === ball) {
        context.beginPath();
        context.arc(element.x, element.y, element.radius, 0, Math.PI * 2);
        context.fill();
    } else {
        context.fillRect(element.x, element.y, element.width, element.height);
    }
}

function normalizeSpeed() {
    const angle = Math.atan2(ball.speedY, ball.speedX);
    ball.speedX = ballSpeed * Math.cos(angle);
    ball.speedY = ballSpeed * Math.sin(angle);
}

function ballWallCollision() {
    if (ball.y + ball.speedY > canvas.height - ball.radius || ball.y + ball.speedY < ball.radius) {
        ball.speedY = -ball.speedY;
        normalizeSpeed();
    }
    if (ball.x + ball.speedX > canvas.width - ball.radius) {
        scoreOne++;
        resetBall();
    } else if (ball.x - ball.speedX < ball.radius) {
        scoreTwo++;
        resetBall();
    }
}

function ballPaddleCollision(player) {
    if (
        ball.x < player.x + player.width + ball.radius &&
        ball.x > player.x - ball.radius &&
        ball.y < player.y + player.height + ball.radius &&
        ball.y > player.y - ball.radius
    ) {
        let paddleCenter = player.y + player.height / 2;
        let hitPos = (ball.y - paddleCenter) / (player.height / 2);
        ball.speedY = hitPos * ballSpeed;
        if (ball.speedX > 0) {
            ball.x = player.x - ball.radius;
        } else {
            ball.x = player.x + player.width + ball.radius;
        }
        ball.speedX = -ball.speedX;
        normalizeSpeed();
    }
}

function resetBall() {
    ballSpeed = INITIAL_SPEED;
    if (scoreOne > scoreTwo) {
        ball.speedX = ballSpeed;
    } else {
        ball.speedX = -ballSpeed;
    }
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speedY = 0;
    resetPaddles();
}

function resetPaddles() {
    playerOne.y = (canvas.height - playerOne.height) / 2;
    playerTwo.y = (canvas.height - playerTwo.height) / 2;
}

function drawElements() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawElement(playerOne);
    drawElement(playerTwo);
    drawElement(ball);
    displayScores();
}

function loop() {
    updatePlayerPositions();
    ballWallCollision();
    ballPaddleCollision(playerOne);
    ballPaddleCollision(playerTwo);
    ball.x += ball.speedX;
    ball.y += ball.speedY;
    drawElements();
    requestAnimationFrame(loop);
}

// Adjust paddle positions dynamically when canvas width changes
function adjustPaddlePositions() {
    playerTwo.x = canvas.width - playerTwo.width - 10;
}

window.addEventListener("resize", () => {
    const newCenterX = (window.innerWidth - canvas.width) / 2;
    const newCenterY = (window.innerHeight - canvas.height) / 2;
    canvas.style.left = `${newCenterX}px`;
    canvas.style.top = `${newCenterY}px`;
    adjustPaddlePositions();
});

adjustPaddlePositions();

window.addEventListener("keydown", (e) => {
    if (e.key === "c") {
        isPlayerOneAI = !isPlayerOneAI;
        setKeyState("w", false);
        setKeyState("s", false);
    }
});
loop();
