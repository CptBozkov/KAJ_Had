import { EventHandler } from "./EventHandler.js";
import { Canvas } from "./Canvas.js";
import { HTMLGenerator } from "./HTMLGenerator.js";

export class Game
{
    #players;
    #maxPoints;
    #eventHandler;
    #canvas;

    #countdownSecs;
    #countDownId;
    
    #pause;
    #mainLoopId;

    #onRoundEndCallacks;

    #powerUpSpawnerId;

    constructor(mapSizeX, mapSizeY, maxPoints=5, countdownSecs=2 )
    {
        this.#players = [];
        this.#maxPoints = maxPoints;
        this.#eventHandler = new EventHandler()
        this.#canvas = new Canvas("myCanvas", mapSizeX, mapSizeY, [0, 0, 0]);
        this.#pause = false;
        this.#countdownSecs = countdownSecs;

        this.#eventHandler.addKeyDownEvent(" ", () => 
        { 
            this.#pause = !this.#pause; 
            console.log(`Pause: ${this.#pause}`);
        });
        this.#eventHandler.addResizeEvent(() => 
        {
            const size = Math.min(window.innerWidth, window.innerHeight)  * 3/4;
            this.#canvas.setSize(size, size);
            this.#stopCountdown()
            this.#stopMainLoop();
            this.#startNextRound();
        });

        this.#onRoundEndCallacks = [];
    }
    
    addOnRoundEndCallback(callback)
    {
        this.#onRoundEndCallacks.push(callback);
    }
    
    start()
    {
        this.#reset();
        this.#startNextRound();
    }
    
    #processCalbacks(callbacks, ...args)
    {
        for (let i = 0; i < callbacks.length; i++)
        {
            callbacks[i](...args);
        }
    }

    #reset()
    {
        for (let i = 0; i < this.#players.length; i++)
        {
            let p = this.#players[i];
            
            p.setPoints(0);
        }
    }

    #startNextRound()
    {
        this.#canvas.clear();
        
        for (let i = 0; i < this.#players.length; i++)
        {
            let p = this.#players[i];
            
            let r1 = Math.random() * 3.0 / 4.0 + 0.125;
            let r2 = Math.random() * 3.0 / 4.0 + 0.125;
            let r3 = Math.random() * Math.PI * 2;
            
            p.setAlive(true);
            p.setPos(r1 * this.#canvas.getSizeX(), r2 * this.#canvas.getSizeY());
            p.setAngle(r3);
            p.resetAllPowerUps();

            // draw start 
            this.#canvas.renderPlayer(p);
            for (let j = 0; j < 20; j++)
            {
                p.move();
                this.#canvas.renderPlayer(p);
            }
        }
        this.#startCountDown(this.#countdownSecs);
    }

    addPlayer(player)
    {
        this.#players.push(player);
    }

    #startCountDown(secondsLeft)
    {
        if (this.#mainLoopId != null) return;
        if (this.#pause)
        {
            this.#countDownId = setTimeout(this.#startCountDown.bind(this, secondsLeft), 100);
            return;
        }
        console.log(`Game starts in: ${secondsLeft}`);
        if (secondsLeft == 0)
        {
            this.#canvas.spawnPowerUp();
            this.#mainLoop();
            this.#countDownId = null;
            return;
        } 
        this.#countDownId = setTimeout(this.#startCountDown.bind(this, secondsLeft - 1), 1000);
    }

    #stopCountdown()
    {
        if (this.#countDownId == null) return;

        clearTimeout(this.#countDownId);
        this.#countDownId = null;
    }

    #update()
    {
        // movement
        for (let i = 0; i < this.#players.length; i++)
        {
            let p = this.#players[i];
            
            if (!p.getAlive()) continue;

            if (this.#eventHandler.getKeyPressed(p.getKeyLeft())) p.turn(-1);
            if (this.#eventHandler.getKeyPressed(p.getKeyRight())) p.turn(1);
            this.#players[i].move();
        }

        // collisions 
        let collisionHappened = false;
        for (let i = 0; i < this.#players.length; i++)
        {
            let p = this.#players[i];

            if (!p.getAlive()) continue;

            if (!this.#canvas.playerCollides(p)) continue;

            console.log(`${p.getName()} crashed!`)
            p.setAlive(false);
            p.playCrashSound();
            collisionHappened = true;
        }

        // spawn power up
        //if (this.#powerUpSpawnerId == null)

        if (!collisionHappened) return;
        
        //check game state
        let playerWon = false;
        let survivors = [];
        for (let i = 0; i < this.#players.length; i++)
        {
            let p = this.#players[i];

            if (p.getAlive()) survivors.push(p);
        }

        if (survivors.length == 1)
        {          
            let survivor = survivors[0];
            survivor.setPoints(survivor.getPoints() + 1);
            
            // print scores
            console.log("Scores:")
            for (let i = 0; i < this.#players.length; i++)
            {
                let p = this.#players[i];
                
                console.log(`${p.getName()} : ${p.getPoints()}`)
            }
            
            if (survivor.getPoints() >= this.#maxPoints)
            { 
                setTimeout(this.#canvas.writeMessage.bind(this.#canvas, `${survivor.getName()} wins the match!`, survivor.getColor()), 500);
                playerWon = true;
            }
        }
        if (survivors.length <= 1)
        {
            this.#stopMainLoop();
            this.#stopCountdown();
            this.#processCalbacks(this.#onRoundEndCallacks);
            
            if (!playerWon)
            {
                setTimeout( () => 
                { 
                    this.#startNextRound();
                } , 2500);
            }
            else 
            {
                setTimeout( () => 
                { 
                    this.#reset();
                    this.#processCalbacks(this.#onRoundEndCallacks);
                    this.#startNextRound();
                } , 5000);
            }
        }
    }    

    #render()
    {
        for (let i = 0; i < this.#players.length; i++)
        {
            let p = this.#players[i];
            this.#canvas.renderPlayer(p);
        }
    }

    #mainLoop()
    {
        this.#mainLoopId = requestAnimationFrame(this.#mainLoop.bind(this));
        if (!this.#pause)
        {
            this.#update();
            this.#render();  
        }
    }

    #stopMainLoop()
    {
        if (this.#mainLoopId == null) return;

        cancelAnimationFrame(this.#mainLoopId);
        this.#mainLoopId = null;
    }
}