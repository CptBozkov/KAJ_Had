import { AudioSource } from "./AudioSource.js"

export class Player
{
    #audioSource;

    // set by game
    #alive;
    #points;
    #posX; #posY;
    #lastPosX; #lastPosY;
    #angle;
    #facingDir;
    
    // power ups
    #powerUps;
    #powerUpSpeedCoeficient;
    #powerUpRadiusCoeficient;
    #powerUpInvincible;

    // const data
    #name;
    #color;
    #keyLeft; #keyRight;
    
    #speed;
    #turnSpeed;
    #radius;


    constructor(name, color, keyLeft, keyRight, speed = 0.8)
    {
        this.#audioSource = new AudioSource();

        this.#alive = true;
        this.#points = 0;
        this.#name = name;
        this.#color = color;
        this.#angle = 0.0;
        this.#facingDir = [1.0, 0.0];
        
        this.#powerUps = [];
        this.resetAllPowerUps();

        this.#lastPosX = 0.0;
        this.#lastPosY = 0.0;
        this.#posX = 0.0;
        this.#posY = 0.0;
        this.#speed = speed;
        this.#turnSpeed = 0.03 * speed;
        this.#radius = 6;
        this.#keyLeft = keyLeft;
        this.#keyRight = keyRight;
    }

    turn(val)
    {
        this.#angle += val * this.#turnSpeed;
        this.#facingDir = [Math.cos(this.#angle), Math.sin(this.#angle)];
    }

    move()
    {
        this.#lastPosX = this.#posX;
        this.#lastPosY = this.#posY;
        this.#posX += this.#facingDir[0] * this.#speed * this.#powerUpSpeedCoeficient;
        this.#posY += this.#facingDir[1] * this.#speed * this.#powerUpSpeedCoeficient;
    }

    setPos(x, y)
    {
        this.#lastPosX = x;
        this.#lastPosY = y;
        this.#posX = x;
        this.#posY = y;
    }

    setAngle(angle)
    {
        this.#angle = angle;
        this.#facingDir = [Math.cos(this.#angle), Math.sin(this.#angle)];
    }

    addPowerUp(powerUp)
    {
        this.#powerUps.push(powerUp);
        powerUp.activate(this);
    }

    resetAllPowerUps()
    {
        for (let i = 0; i < this.#powerUps.length; i++)
        {
            let powerUp = this.#powerUps[i];
            powerUp.deactivate(this);
        }
        this.#powerUps = [];
        this.#powerUpSpeedCoeficient = 1.0;
        this.#powerUpRadiusCoeficient = 1.0;
    }

    playCrashSound()
    {
        if (this.#powerUpSpeedCoeficient < 1) { this.#audioSource.playSmallCrash(); return; }
        if (this.#powerUpSpeedCoeficient == 1) { this.#audioSource.playMediumCrash(); return; }
        if (this.#powerUpSpeedCoeficient > 1) { this.#audioSource.playLargeCrash(); return; }
    }

    setPowerUpSpeedCoefficient(value) { this.#powerUpSpeedCoeficient = value; }
    getPowerUpSpeedCoefficient() { return this.#powerUpSpeedCoeficient; }

    setPowerUpRadiusCoefficient(value) { this.#powerUpRadiusCoeficient = value; }
    getPowerUpRadiusCoefficient() { return this.#powerUpRadiusCoeficient; }

    setPowerUpInvincible(value) { this.#powerUpInvincible = value; }
    getPowerUpInvincible() { return this.#powerUpInvincible; }

    setAlive(alive) { this.#alive = alive; }
    getAlive() { return this.#alive; }

    setPoints(points) { this.#points = points; }
    getPoints() {return this.#points; }

    getPosX() { return this.#posX; }
    getPosY() { return this.#posY; }
    
    getLastPosX() { return this.#lastPosX; }
    getLastPosY() { return this.#lastPosY; }

    getName() { return this.#name; }
    getRadius() { return Math.max(1.0, Math.ceil(this.#radius * this.#powerUpRadiusCoeficient)); }
    getColor() { return this.#color; }

    getKeyLeft() { return this.#keyLeft; }
    getKeyRight() { return this.#keyRight; }
}