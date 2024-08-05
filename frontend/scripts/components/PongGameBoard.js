import { Component, createRef } from '../../modules/onion/index.js';

export default class PongGameBoard extends Component 
{
    constructor(props, context) 
    {
        super(props, context);
        this.running = true;
        this.canvasRef = createRef();
        this.keysPressed = {
            "w": false,
            "s": false,
            "ArrowUp": false,
            "ArrowDown": false,
        };

        this.loop = this.loop.bind(this);
        this.adjustPaddlePositions = this.adjustPaddlePositions.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);

        this.trail = [];
        this.explosions = [];
        this.shakeDuration = 0;
        this.freezeBall = true;
        this.startDelayTime = 800;
    }

    onMount() 
    {
        this.running = !this.props.pause;
        this.canvas = this.canvasRef.current;
        this.canvasContext = this.canvas.getContext("2d");

        this.initializeGame();

        window.addEventListener("resize", this.adjustPaddlePositions);
        window.addEventListener("keydown", this.handleKeyDown);
        window.addEventListener("keyup", this.handleKeyUp);
    }

    onUnmount() 
    {
        this.running = false;

        window.removeEventListener("resize", this.adjustPaddlePositions);
        window.removeEventListener("keydown", this.handleKeyDown);
        window.removeEventListener("keyup", this.handleKeyUp);
    }

    initializeGame() 
    {
        this.scoreOne = this.props.scoreOne;
        this.scoreTwo = this.props.scoreTwo;

        this.playerOne = {
            x: 10,
            y: (this.canvas.height - 100) / 2,
            width: 15,
            height: 100,
            color: '#ffd335',
            speed: 10,
            difficulty: this.props.difficulty || 1
        };

        this.playerTwo = {
            x: this.canvas.width - 25,
            y: (this.canvas.height - 100) / 2,
            width: 15,
            height: 100,
            color: '#ffd335',
            speed: 10,
            difficulty: this.props.difficulty || 1
        };

        this.INITIAL_SPEED = 8;
        this.BALL_SPEED_INCREMENT = 0.5;
        this.ballSpeed = this.INITIAL_SPEED;

        this.ball = {
            x: this.canvas.width / 2,
            y: this.canvas.height / 2,
            radius: 8,
            color: '#fff',
            speedX: this.getRandomDirection() * this.ballSpeed,
            speedY: this.getRandomDirection() * (Math.random() * 2 - 1) * this.ballSpeed,
        };

        this.lastUpdateTime = Date.now();
        this.updateInterval = 1000;
        this.lastBall = this.getCurrentBall();

        this.adjustPaddlePositions();
        this.startDelay();
        this.loop();
    }

    startDelay() 
    {
        setTimeout(() => {
            this.freezeBall = false;
        }, this.startDelayTime);
    }

    getRandomDirection() 
    {
        return Math.random() < 0.5 ? -1 : 1;
    }

    handleKeyDown(event) 
    {
        this.keysPressed[event.key] = true;
    }

    handleKeyUp(event) 
    {
        this.keysPressed[event.key] = false;
    }

    adjustPaddlePositions() 
    {
        this.playerTwo.x = this.canvas.width - this.playerTwo.width - 10;
    }

    updatePlayer(upKey, downKey, player)
    {
        if (this.keysPressed[upKey] && player.y - player.speed > 0) 
        {
            player.y -= player.speed;
        }
        if (this.keysPressed[downKey] && player.y + player.height + player.speed < this.canvas.height) 
        {
            player.y += player.speed;
        }
    }

    updatePlayerPositions() 
    {
        this.updatePlayer("w", "s", this.playerOne);

        if (this.props.isAIEnabled)
        {
            if (!this.freezeBall)
                this.updateAIPlayer(this.playerTwo);
        }
        else
        {
            this.updatePlayer("ArrowUp", "ArrowDown", this.playerTwo);
        }
    }

    getCurrentBall()
    {
        return {
            x: this.ball.x,
            y: this.ball.y,
            speedX: this.ball.speedX,
            speedY: this.ball.speedY
        };
    }

    calculateInterceptY(ballPosition, ballSpeedX, ballSpeedY)
    {
        const timeToIntercept = (this.playerTwo.x - ballPosition.x) / ballSpeedX;

        if (timeToIntercept <= 0) return ballPosition.y; // If the ball is moving away from the paddle, return current ball Y

        // Predict the ball’s future Y position
        const predictedBallY = ballPosition.y + ballSpeedY * timeToIntercept;

        // Calculate intercept Y within canvas boundaries
        const predictedY = Math.max(this.ball.radius, Math.min(predictedBallY, this.canvas.height - this.ball.radius));

        return predictedY;
    }

    updateAIPlayer(player)
    {
        const currentTime = Date.now();
    
        // Update the ball position every second
        if (currentTime - this.lastUpdateTime >= this.updateInterval)
        {
            this.lastUpdateTime = currentTime;
            this.lastBall = this.getCurrentBall(); // Update the last known ball position
        }
    
        // Ball speed
        const ballSpeedX = this.lastBall.speedX;
        const ballSpeedY = this.lastBall.speedY;
    
        // Use the last known ball position to calculate the intercept
        const ballPosition = { x: this.lastBall.x, y: this.lastBall.y };
    
        // Calculate predicted ball’s intercept Y position
        const targetY = this.calculateInterceptY(ballPosition, ballSpeedX, ballSpeedY) - (player.height / 2);
    
        // Ensure the AI paddle moves at the same speed as Player One's paddle
        const paddleSpeed = player.speed;
    
        // Move the AI paddle towards the target position
        if (player.y > targetY + 5 && player.y - paddleSpeed > 0)
            player.y -= paddleSpeed;
        else if (player.y < targetY - 5 && player.y + player.height + paddleSpeed < this.canvas.height)
            player.y += paddleSpeed;
    
        // Ensure the AI paddle stays within canvas boundaries
        if (player.y < 0)
        {
            player.y = 0;
        }
        if (player.y + player.height > this.canvas.height)
        {
            player.y = this.canvas.height - player.height;
        }
    }
    

    drawElement(element) 
    {
        this.canvasContext.fillStyle = element.color;
        if (element === this.ball) 
        {
            this.canvasContext.beginPath();
            this.canvasContext.arc(element.x, element.y, element.radius, 0, Math.PI * 2);
            this.canvasContext.fill();
        } 
        else 
        {
            this.canvasContext.fillRect(element.x, element.y, element.width, element.height);
        }
    }

    normalizeSpeed() 
    {
        const angle = Math.atan2(this.ball.speedY, this.ball.speedX);
        this.ball.speedX = this.ballSpeed * Math.cos(angle);
        this.ball.speedY = this.ballSpeed * Math.sin(angle);
    }

    ballWallCollision() 
    {
        if (this.ball.y + this.ball.speedY > this.canvas.height - this.ball.radius || this.ball.y + this.ball.speedY < this.ball.radius) 
        {
            this.ball.speedY = -this.ball.speedY;
            this.normalizeSpeed();
        }
        if (this.ball.x + this.ball.speedX > this.canvas.width - this.ball.radius) 
        {
            this.scoreOne += 1;
            this.createExplosion(this.ball.x, this.ball.y);
            this.freezeBall = true;
        } 
        else if (this.ball.x - this.ball.speedX < this.ball.radius) 
        {
            this.scoreTwo += 1;
            this.createExplosion(this.ball.x, this.ball.y);
            this.freezeBall = true;
        }
    }

    ballPaddleCollision(player) 
    {
        const nextBallX = this.ball.x + this.ball.speedX;
        const nextBallY = this.ball.y + this.ball.speedY;

        if (nextBallX < player.x + player.width + this.ball.radius &&
            nextBallX > player.x - this.ball.radius &&
            nextBallY < player.y + player.height + this.ball.radius &&
            nextBallY > player.y - this.ball.radius) 
        {
            let paddleCenter = player.y + player.height / 2;
            let hitPos = (this.ball.y - paddleCenter) / (player.height / 2);
            this.ball.speedY = hitPos * this.ballSpeed;
            if (this.ball.speedX > 0) 
            {
                this.ball.x = player.x - this.ball.radius;
            } 
            else 
            {
                this.ball.x = player.x + player.width + this.ball.radius;
            }
            this.ball.speedX = -this.ball.speedX;

            this.ballSpeed += this.BALL_SPEED_INCREMENT;
            this.normalizeSpeed();
        }
    }

    updateBallPosition() 
    {
        const maxTrailLength = 10;
        this.trail.push({ x: this.ball.x, y: this.ball.y });
        if (this.trail.length > maxTrailLength) 
        {
            this.trail.shift();
        }

        this.ball.x += this.ball.speedX;
        this.ball.y += this.ball.speedY;

        this.ballWallCollision();
        this.ballPaddleCollision(this.playerOne);
        this.ballPaddleCollision(this.playerTwo);
    }

    createExplosion(x, y) 
    {
        const particles = [];
        for (let i = 0; i < 30; i++) 
        {
            particles.push({
                x,
                y,
                radius: Math.random() * 4 + 2,
                speedX: (Math.random() - 0.5) * 10,
                speedY: (Math.random() - 0.5) * 10,
                life: 30
            });
        }
        this.explosions.push(particles);
        this.shakeDuration = 20;
    }

    drawExplosions() 
    {
        this.explosions.forEach((particles, explosionIndex) => 
        {
            particles.forEach((particle, particleIndex) => 
            {
                if (particle.life > 0) 
                {
                    const opacity = particle.life / 30;
                    this.canvasContext.fillStyle = `rgba(255, 69, 0, ${opacity})`;
                    this.canvasContext.beginPath();
                    this.canvasContext.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                    this.canvasContext.fill();
                    particle.x += particle.speedX;
                    particle.y += particle.speedY;
                    particle.life--;
                } 
                else 
                {
                    particles.splice(particleIndex, 1);
                }
            });
            if (particles.length === 0) 
            {
                this.explosions.splice(explosionIndex, 1);
                if (this.explosions.length === 0) 
                {
                    this.freezeBall = false;
                    this.resetBall();
                    this.displayScores();
                }
            }
        });
    }

    applyShake() 
    {
        if (this.shakeDuration > 0) 
        {
            const shakeIntensity = this.shakeDuration / 2;
            const offsetX = (Math.random() - 0.5) * shakeIntensity;
            const offsetY = (Math.random() - 0.5) * shakeIntensity;
            this.canvas.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
            this.shakeDuration--;
        } 
        else 
        {
            this.canvas.style.transform = '';
        }
    }

    resetBall() 
    {
        this.ballSpeed = this.INITIAL_SPEED;
        this.ball.speedX = this.getRandomDirection() * this.ballSpeed;
        this.ball.speedY = this.getRandomDirection() * (Math.random() * 2 - 1) * this.ballSpeed;

        this.ball.x = this.canvas.width / 2;
        this.ball.y = this.canvas.height / 2;

        this.resetPaddles();
    }

    resetPaddles() 
    {
        this.playerOne.y = (this.canvas.height - this.playerOne.height) / 2;
        this.playerTwo.y = (this.canvas.height - this.playerTwo.height) / 2;
    }

    drawElements() 
    {
        this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawElement(this.playerOne);
        this.drawElement(this.playerTwo);
        if (!this.freezeBall) 
        {
            this.drawElement(this.ball);
        }
        this.drawExplosions();
        this.applyShake();
    }

    displayScores() 
    {
        this.props.onClickUpdateScore(this.scoreOne, this.scoreTwo);
    }

    drawBallTrail() 
    {
        const speedFactor = Math.min(this.ballSpeed / this.INITIAL_SPEED, 2);

        for (let i = 0; i < this.trail.length - 1; i++) 
        {
            const position = this.trail[i];
            const nextPosition = this.trail[i + 1];
            const opacity = (i + 1) / this.trail.length;

            const gradient = this.canvasContext.createLinearGradient(position.x, position.y, nextPosition.x, nextPosition.y);
            gradient.addColorStop(0, `rgba(255, 165, 0, ${opacity * speedFactor})`);
            gradient.addColorStop(0.5, `rgba(255, 69, 0, ${opacity * speedFactor})`);
            gradient.addColorStop(1, `rgba(255, 0, 0, ${opacity * 0.5 * speedFactor})`);

            this.canvasContext.strokeStyle = gradient;
            this.canvasContext.lineWidth = this.ball.radius * (opacity * 0.5 + 0.5) * speedFactor;

            this.canvasContext.beginPath();
            this.canvasContext.moveTo(position.x, position.y);
            this.canvasContext.lineTo(nextPosition.x, nextPosition.y);
            this.canvasContext.stroke();
        }
    }

    loop() 
    {
        if (!this.running) return;

        this.updatePlayerPositions();
        if (!this.freezeBall) 
        {
            this.updateBallPosition();
        }

        this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawElements();
        if (!this.freezeBall) 
        {
            this.drawBallTrail();
        }

        requestAnimationFrame(this.loop);
    }

    render() 
    {
        return String.raw`
            <link rel="stylesheet" href="/styles/PongGameBoard.css">
            <canvas id="pongGame" ref="canvasRef" width="900" height="600"></canvas>
        `;
    }
}
