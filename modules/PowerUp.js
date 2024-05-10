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

    getPosX() { return this.#posX; }
    getPosY() { return this.#posY; }
    getWPosX() { return this.#wPosX; }
    getNPosY() { return this.#nPosY; }
    getRadius() { return this.#radius; }
    getImageData() { return this.#imageData; }
    getPowerUp() { return this.#powerUp; }
}

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

    activate(player)
    {
        console.log(`${this.#name} activated for ${this.#duration} seconds.`);
        this.#callbackId = setTimeout(this.deactivate.bind(this, player), this.#duration)
    }

    deactivate(player)
    {
        if (this.#callbackId == null) return;

        console.log(`${this.#name} deactivated.`);
        clearTimeout(this.#callbackId);
        this.#callbackId = null;
    }

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

    getPowerUpText() { return this.#powerUpText; }
}

export class Speed extends PowerUp
{
    #speedModifier;
    
    constructor(name, powerUpText, duration, speedModifier) 
    {
        super(name, powerUpText, duration);
        this.#speedModifier = speedModifier;
    }

    activate(player)
    {
        super.activate(player);
        player.setPowerUpSpeedCoefficient(player.getPowerUpSpeedCoefficient() * this.#speedModifier);
        console.log(`Applying : ${this.#speedModifier}.`);
    }

    deactivate(player)
    {
        super.deactivate(player);
        player.setPowerUpSpeedCoefficient(player.getPowerUpSpeedCoefficient() / this.#speedModifier);
    }
}

export class Radius extends PowerUp 
{
    #radiusModifier;
    constructor(name, powerUpText, duration, radiusModifier) 
    {
        super(name, powerUpText, duration);
        this.#radiusModifier = radiusModifier;
    }

    activate(player)
    {
        super.activate(player);
        player.setPowerUpRadiusCoefficient(player.getPowerUpRadiusCoefficient() * this.#radiusModifier);
        player.addPowerUp(new Invincibility("Shapeshift Invincibility", "I", 200));
    }
    
    deactivate(player)
    {
        super.deactivate(player);
        player.setPowerUpRadiusCoefficient(player.getPowerUpRadiusCoefficient() / this.#radiusModifier);
        player.addPowerUp(new Invincibility("Shapeshift Invincibility", "I", 200));
    }
}

export class Invincibility extends PowerUp
{
    constructor(name, powerUpText, duration) 
    {
        super(name, powerUpText, duration);
    }

    activate(player)
    {
        super.activate(player);
        player.setPowerUpInvincible(true);
    }
    
    deactivate(player)
    {
        super.deactivate(player);
        player.setPowerUpInvincible(false);
    }
}
