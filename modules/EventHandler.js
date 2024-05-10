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

    addResizeEvent(func)
    {
        this.#resizeEvents.push(func);
    }

    addKeyDownEvent(key, func)
    {
        if (this.#keyDownEvents.hasOwnProperty(key))
        {
            this.#keyDownEvents[key].push(func);
            return;
        }
        this.#keyDownEvents[key] = [func];
    }
    
    getKeyPressed(key)
    {
        return this.#keys[key] == undefined ? false : this.#keys[key];
    }

    #resize()
    {
        for (let i = 0; i < this.#resizeEvents.length; i++)
        {
            this.#resizeEvents[i]();
        }
    }

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

    #keyup(e)
    {
        this.#keys[e.key] = false;
    }
}