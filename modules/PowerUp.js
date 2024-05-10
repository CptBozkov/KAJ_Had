// Class which wraps the power up and allows it to be placed on the canvas
export class CanvasPowerUp {
    #posX; #posY;
    #wPosX; #nPosY;
    #radius;
    #imageData;
    #powerUp;

    constructor(posX, posY, wPosX, nPosY, radius, imageData, powerUp)
    {
        this.#posX = posX;
        this.#posY = posY;
        this.#wPosX = wPosX;
        this.#nPosY = nPosY;
        this.#radius = radius;
        this.#imageData = imageData;
        this.#powerUp = powerUp;
    }

    // Returns the the power up's position x
    getPosX() { return this.#posX; }    
    // Returns the the power up's position y
    getPosY() { return this.#posY; }
    // Returns the the power up's west boundry
    getWPosX() { return this.#wPosX; }
    // Returns the the power up's North boundry
    getNPosY() { return this.#nPosY; }
    // Returns the the power up's radius
    getRadius() { return this.#radius; }
    // Returns the the power up's iamge data
    getImageData() { return this.#imageData; }
    // Returns the the held power up itself
    getPowerUp() { return this.#powerUp; }
}

// Base class for all the power ups
export class PowerUp {
    #name;
    #duration;
    #powerUpText;

    #callbackId

    constructor(name, powerUpText, duration)
    {
        this.#name = name;
        this.#duration = duration;
        this.#powerUpText = powerUpText;
    }

    // Activates the power up's effect
    activate(player)
    {
        console.log(`${this.#name} activated for ${this.#duration} seconds.`);
        this.#callbackId = setTimeout(this.deactivate.bind(this, player), this.#duration)
    }

    // Deactivates the power up's effect
    deactivate(player)
    {
        if (this.#callbackId == null) return;

        console.log(`${this.#name} deactivated.`);
        clearTimeout(this.#callbackId);
        this.#callbackId = null;
    }

    // Returns a random predefined power up
    static GetRandom()
    {
        let powerUps = [// Name | [Text, px Offset] | ms Duration | Multiplier
            new Speed(        "Swiftness",     ["+",  3],   4000,  2),
            new Speed(        "Slowness",      ["-",  7],   10000, 0.5),
            new Radius(       "Fatness",       ["<>", 3], 10000, 2),
            new Radius(       "Thinness",      ["><", 3],  10000, 0.5),
            new Invincibility("Invincibility", ["I", -1],  5000),
        ]
        let rand = Math.floor(Math.random() * powerUps.length);
        return powerUps[rand];
    }

    // Returns a power up's text
    getPowerUpText() { return this.#powerUpText; }
}

// Power up which modifies the player's speed coefficient
export class Speed extends PowerUp
{
    #speedModifier;
    
    constructor(name, powerUpText, duration, speedModifier) 
    {
        super(name, powerUpText, duration);
        this.#speedModifier = speedModifier;
    }

    // Changes the player's speed modifier to the value
    activate(player)
    {
        super.activate(player);
        player.setPowerUpSpeedCoefficient(player.getPowerUpSpeedCoefficient() * this.#speedModifier);
        console.log(`Applying : ${this.#speedModifier}.`);
    }

    // Changes the player's speed modifier back to original value
    deactivate(player)
    {
        super.deactivate(player);
        player.setPowerUpSpeedCoefficient(player.getPowerUpSpeedCoefficient() / this.#speedModifier);
    }
}

// Power up which modifies the player's radius coefficient
export class Radius extends PowerUp 
{
    #radiusModifier;
    constructor(name, powerUpText, duration, radiusModifier) 
    {
        super(name, powerUpText, duration);
        this.#radiusModifier = radiusModifier;
    }

    // Changes the player's radius modifier to the value
    activate(player)
    {
        super.activate(player);
        player.setPowerUpRadiusCoefficient(player.getPowerUpRadiusCoefficient() * this.#radiusModifier);
        player.addPowerUp(new Invincibility("Shapeshift Invincibility", "I", 200));
    }
    
    // Changes the player's radius modifier back to original value
    deactivate(player)
    {
        super.deactivate(player);
        player.setPowerUpRadiusCoefficient(player.getPowerUpRadiusCoefficient() / this.#radiusModifier);
        player.addPowerUp(new Invincibility("Shapeshift Invincibility", "I", 200));
    }
}

// Power up which modifies the player's invincibility state
export class Invincibility extends PowerUp
{
    constructor(name, powerUpText, duration) 
    {
        super(name, powerUpText, duration);
    }

    // Changes the player's invincibility state to true
    activate(player)
    {
        super.activate(player);
        player.setPowerUpInvincible(true);
    }
    
    // Changes the player's invincibility state back to the original state
    deactivate(player)
    {
        super.deactivate(player);
        player.setPowerUpInvincible(false);
    }
}
