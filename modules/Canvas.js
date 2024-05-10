import { CanvasPowerUp, PowerUp } from "./PowerUp.js"

// Class containing the canvas which is used to draw the entire game on
export class Canvas
{
    #canvas;
    #context;
    #sizeX; #sizeY;
    #clearColor;
    
    #canvasPowerUps;
    #spawnPowerUpId;

    constructor(canvasId, sizeX, sizeY, clearColor = [0, 0, 0])
    {
        this.#canvas = document.getElementById(canvasId);
        this.#context = this.#canvas.getContext("2d", { willReadFrequently: true});
        this.setSize(sizeX, sizeY);
        this.#clearColor = clearColor;
        this.#canvasPowerUps = [];
        this.#spawnPowerUpId = null;
    }

    // Set new size for the canvas
    setSize(sizeX, sizeY)
    {
        this.#sizeX = sizeX;
        this.#sizeY = sizeY;
        this.#canvas.width = sizeX;
        this.#canvas.height = sizeY;
    }

    // Returns the width of the canvas
    getSizeX() { return this.#sizeX; }
    // Returns the height of the canvas
    getSizeY() { return this.#sizeY; }

    // Returns the canvas HTML element
    getCanvasElement() { return this.#canvas; }
    
    // Clears everything on the canvas with the clear color
    clear()
    {
        this.#context.fillStyle = `rgba(${this.#clearColor[0]}, ${this.#clearColor[1]}, ${this.#clearColor[2]}, 1)`
        this.#context.fillRect(0, 0, this.#sizeX, this.#sizeY);
        this.#canvasPowerUps = [];
        if (this.#spawnPowerUpId != null)
        {
            clearTimeout(this.#spawnPowerUpId);
            this.#spawnPowerUpId = null;
        }
    }

    // Spawns a random powerup somewhere inside the playing area
    spawnPowerUp()
    {
        let minTime = 1000; 
        let maxTime = 3000;
        let time = minTime + Math.floor(Math.random() * (maxTime - minTime));
        this.#spawnPowerUpId = setTimeout(this.spawnPowerUp.bind(this), time);
        let powerUp = PowerUp.GetRandom();
        let r = 25;
        let posX = Math.floor(r + Math.random() * (this.#sizeX - 2 * r));
        let posY = Math.floor(r + Math.random() * (this.#sizeY - 2 * r));        
        let d = r * 2;
        let wPosX = Math.floor(posX - r + 1);
        let nPosY = Math.floor(posY - r + 1);

        let canvasPowerUp = new CanvasPowerUp(posX, posY, wPosX, nPosY, r, this.#context.getImageData(wPosX, nPosY, d, d), powerUp);
        this.#canvasPowerUps.push(canvasPowerUp);
        
        let imageData = this.#context.getImageData(wPosX, nPosY, d, d);
        let data = imageData.data;

        this.#runForDisc(posX, posY, r, (px, py, c, i) =>
        {

            data[i    ] = 255 * c;
            data[i + 1] = 255 * c;
            data[i + 2] = 255 * c;
            data[i + 3] = 254;
        });
        this.#context.putImageData(imageData, wPosX, nPosY);

        this.#context.font = "35px Arial";
        this.#context.fillStyle = `rgba(${0}, ${0}, ${0}, 1)`;
        const textWidth = this.#context.measureText(powerUp.getPowerUpText()[0]).width;
        const fontMetrics = this.#context.measureText(powerUp.getPowerUpText()[0]);
        const textHeight = fontMetrics.actualBoundingBoxAscent + fontMetrics.actualBoundingBoxDescent;
        this.#context.fillText(powerUp.getPowerUpText()[0], posX - textWidth / 2, posY + textHeight / 2 + powerUp.getPowerUpText()[1]);
    }

    // Makes the player pickup the closest power up 
    pickUpPowerUp(player)
    {
        for (let i = 0; i < this.#canvasPowerUps.length; i++)
        {
            let cp = this.#canvasPowerUps[i];
            let dist = Math.sqrt(Math.pow(player.getPosX() - cp.getPosX(), 2) + Math.pow(player.getPosY() - cp.getPosY(), 2));
            if (cp.getRadius() + player.getRadius() < dist) continue;

            this.#canvasPowerUps.splice(i, 1);
            let prevData = cp.getImageData().data;
            let imageData = this.#context.getImageData(cp.getWPosX(), cp.getNPosY(), cp.getRadius() * 2, cp.getRadius() * 2);
            let data = imageData.data;
            this.#runForDisc(cp.getPosX(), cp.getPosY(), cp.getRadius(), (px, py, c, i) =>
            {
                data[i    ] = prevData[i    ];
                data[i + 1] = prevData[i + 1];
                data[i + 2] = prevData[i + 2]; 
                data[i + 3] = prevData[i + 3];
            });
            this.#context.putImageData(imageData, cp.getWPosX(), cp.getNPosY());
            player.addPowerUp(cp.getPowerUp());
            return;
        }
        
    }

    // Runs a func for every pixel in a disc shaped area
    #runForDisc(posX, posY, r, func)
    {
        let d = r * 2;
        let wPosX = Math.floor(posX - r + 1);
        let nPosY = Math.floor(posY - r + 1);

        for (let y = 0; y < d; y++)
        {
            for (let x = 0; x < d; x++)
            {
                let pX = wPosX + x + 0.5;
                let pY = nPosY + y + 0.5;
                let l = Math.sqrt((pX - posX) * (pX - posX) + (pY - posY) * (pY - posY));
                
                if (r - 1 < l) continue;

                let c = Math.min((r - 1) - l, 1.0);
                let i = y * d * 4 + x * 4;
                func(pX, pY, c, i);
            }
        }
    }

    // Returns true if the player collides with a wall or a player 
    playerCollides(player)
    {
        let posX = player.getPosX();
        let posY = player.getPosY();
        let lastPosX = player.getLastPosX();    
        let lastPosY = player.getLastPosY();
        let r = player.getRadius();
        
        if (posX - r < 0 || posX + r >= this.#sizeX || posY - r < 0 || posY + r >= this.#sizeY) return true;
        
        let wPosX = Math.floor(posX - r + 1);
        let nPosY = Math.floor(posY - r + 1);
        let d = r * 2;
        let imageData = this.#context.getImageData(wPosX, nPosY, d, d);
        let data = imageData.data;

        
        for (let y = 0; y < d; y++) 
        {
            for (let x = 0; x < d; x++)
            {
                let pX = wPosX + x + 0.5;
                let pY = nPosY + y + 0.5;
                let l = Math.sqrt((pX - posX) * (pX - posX) + (pY - posY) * (pY - posY));
                let lastL = Math.sqrt((pX - lastPosX) * (pX - lastPosX) + (pY - lastPosY) * (pY - lastPosY));
                
                if (lastL <= r - 1 || r - 1 < l) continue;
 
                if (data[y * d * 4 + x * 4 + 3] < 255) 
                {
                    this.pickUpPowerUp(player);
                    continue;
                }
                if (player.getPowerUpInvincible()) continue;

                if (data[y * d * 4 + x * 4    ] != this.#clearColor[0])  return true;
                if (data[y * d * 4 + x * 4 + 1] != this.#clearColor[1])  return true;
                if (data[y * d * 4 + x * 4 + 2] != this.#clearColor[2])  return true;
            }
        }
        return false;
    }

    // Renders a player on the canvas
    renderPlayer(player)
    {
        let posX = player.getPosX();
        let posY = player.getPosY();
        let r = player.getRadius();
        let color = player.getColor();
        let wPosX = Math.floor(posX - r + 1);
        let nPosY = Math.floor(posY - r + 1);
        let d = r * 2;
        let imageData = this.#context.getImageData(wPosX, nPosY, d, d);
        let data = imageData.data;
        for (let y = 0; y < d; y++) 
        { 
            for (let x = 0; x < d; x++)
            {
                let pX = wPosX + x + 0.5;
                let pY = nPosY + y + 0.5;
                let l = Math.sqrt((pX - posX) * (pX - posX) + (pY - posY) * (pY - posY));
                
                if (r - 1 < l) continue;
                
                let c = Math.min((r - 1) - l, 1.0);
      
                let i = y * d * 4 + x * 4;
                data[i    ] = Math.max(color[0] * c, data[i    ]);
                data[i + 1] = Math.max(color[1] * c, data[i + 1]);
                data[i + 2] = Math.max(color[2] * c, data[i + 2]);
            }
        }
        this.#context.putImageData(imageData, wPosX, nPosY);
    }

    // Writes a message on the canvas
    writeMessage(message, color)
    {
        this.#context.font = "40px Arial";
        this.#context.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
        const textWidth = this.#context.measureText(message).width;
        this.#context.fillText(message, this.#sizeX / 2 - textWidth / 2, this.#sizeY / 2);
    }
}