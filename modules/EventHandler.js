// This class is used to bind game callbacks to window events
export class EventHandler
{
    #keys;
    #keyDownEvents;
    #resizeEvents;

    constructor()
    {
        this.#keys = {};
        this.#keyDownEvents = {};
        this.#resizeEvents = [];
        addEventListener("keydown", this.#keydown.bind(this));
        addEventListener("keyup", this.#keyup.bind(this));
        addEventListener("resize", this.#resize.bind(this))
    }

    // Adds a callback which is called on window resize
    addResizeEvent(func)
    {
        this.#resizeEvents.push(func);
    }

    // Adds a callback which is called on a keydown event of a specific key
    addKeyDownEvent(key, func)
    {
        if (this.#keyDownEvents.hasOwnProperty(key))
        {
            this.#keyDownEvents[key].push(func);
            return;
        }
        this.#keyDownEvents[key] = [func];
    }
    
    // Returns true if a key is pressed
    getKeyPressed(key)
    {
        return this.#keys[key] == undefined ? false : this.#keys[key];
    }

    // Runs all the window resize callbacks
    #resize()
    {
        for (let i = 0; i < this.#resizeEvents.length; i++)
        {
            this.#resizeEvents[i]();
        }
    }

    // Runs all the apropriate keydown callbacks
    #keydown(e)
    {
        this.#keys[e.key] = true;

        for (let key in this.#keyDownEvents) {
            if (!this.#keyDownEvents.hasOwnProperty(key)) continue;
            
            if (e.key == key)
            {
                for (let i = 0; i < this.#keyDownEvents[key].length; i++) {
                    this.#keyDownEvents[key][i]();
                }
            }
        }
    }

    // Resets the key's state
    #keyup(e)
    {
        this.#keys[e.key] = false;
    }
}