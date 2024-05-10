export class AudioSource
{
    #audio;
    #path;
    constructor()
    {
        this.#audio = new Audio();
        let ref = window.location.href;
        this.#path = ref.substring(0, ref.lastIndexOf("/"));
    }

    playSmallCrash()
    {
        this.#audio.src = this.#path + "/sounds/smallCrash.mp3";
        this.#audio.play();
    }

    playMediumCrash()
    {
        this.#audio.src = this.#path + "/sounds/mediumCrash.mp3";
        this.#audio.play();
    }

    playLargeCrash()
    {
        console.log(window.location.href);
        this.#audio.src = this.#path + "/sounds/largeCrash.mp3";
        this.#audio.play();
    }
}