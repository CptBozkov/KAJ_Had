import { AudioSource } from "./AudioSource.js"

// Class which holds data about a player
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

    // Turn the player's direction by val in radians
    turn(val)
    {
        this.#angle += val * this.#turnSpeed;
        this.#facingDir = [Math.cos(this.#angle), Math.sin(this.#angle)];
    }

    // Move the player in his direction based on his speed
    move()
    {
        this.#lastPosX = this.#posX;
        this.#lastPosY = this.#posY;
        this.#posX += this.#facingDir[0] * this.#speed * this.#powerUpSpeedCoeficient;
        this.#posY += this.#facingDir[1] * this.#speed * this.#powerUpSpeedCoeficient;
    }

    // Places a player on a position
    setPos(x, y)
    {
        this.#lastPosX = x;
        this.#lastPosY = y;
        this.#posX = x;
        this.#posY = y;
    }

    // Sets the players facing direction
    setAngle(angle)
    {
        this.#angle = angle;
        this.#facingDir = [Math.cos(this.#angle), Math.sin(this.#angle)];
    }

    // Adds a power up to the player
    addPowerUp(powerUp)
    {
        this.#powerUps.push(powerUp);
        powerUp.activate(this);
    }

    // Removes all the power ups
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

    // Plays a crash sound based on the player's speed
    playCrashSound()
    {
        if (this.#powerUpSpeedCoeficient < 1) { this.#audioSource.playSmallCrash(); return; }
        if (this.#powerUpSpeedCoeficient == 1) { this.#audioSource.playMediumCrash(); return; }
        if (this.#powerUpSpeedCoeficient > 1) { this.#audioSource.playLargeCrash(); return; }
    }

    // Sets the player's speed coefficient
    setPowerUpSpeedCoefficient(value) { this.#powerUpSpeedCoeficient = value; }
    // Returns the player's speed coefficient
    getPowerUpSpeedCoefficient() { return this.#powerUpSpeedCoeficient; }

    // Sets the player's radius coefficient
    setPowerUpRadiusCoefficient(value) { this.#powerUpRadiusCoeficient = value; }
    // Returns the player's radius coefficient
    getPowerUpRadiusCoefficient() { return this.#powerUpRadiusCoeficient; }

    // Sets the player's invincibility to value
    setPowerUpInvincible(value) { this.#powerUpInvincible = value; }
    // Returns the player's invincibility state
    getPowerUpInvincible() { return this.#powerUpInvincible; }

    // Sets the player's alive value
    setAlive(alive) { this.#alive = alive; }
    // Returns the player's alive value
    getAlive() { return this.#alive; }

    // Sets the player's points value
    setPoints(points) { this.#points = points; }
    // Returns the player's points value
    getPoints() {return this.#points; }

    getPosX() { return this.#posX; }
    getPosY() { return this.#posY; }
    
    // Returns the player's position x
    getLastPosX() { return this.#lastPosX; }
    // Returns the player's position y
    getLastPosY() { return this.#lastPosY; }

    // Returns the player's name
    getName() { return this.#name; }
    // Returns the player's radius
    getRadius() { return Math.max(1.0, Math.ceil(this.#radius * this.#powerUpRadiusCoeficient)); }
    // Returns the player's color
    getColor() { return this.#color; }

    // Returns the player's key for turning left
    getKeyLeft() { return this.#keyLeft; }
    // Returns the player's key for turning right
    getKeyRight() { return this.#keyRight; }
}