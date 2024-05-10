// Class which represents an audio source on a canvas
export class AudioSource {
    #audio;
    #path;
    constructor() {
        this.#audio = new Audio();
        let ref = window.location.href;
        this.#path = ref.substring(0, ref.lastIndexOf("/"));
    }

    // Method to play a small crash audio clip
    playSmallCrash() {
        this.#audio.src = this.#path + "/sounds/smallCrash.mp3";
        this.#audio.play();
    }

    // Method to play a medium crash audio clip
    playMediumCrash() {
        this.#audio.src = this.#path + "/sounds/mediumCrash.mp3";
        this.#audio.play();
    }

    // Method to play a large crash audio clip
    playLargeCrash() {
        console.log(window.location.href);
        this.#audio.src = this.#path + "/sounds/largeCrash.mp3";
        this.#audio.play();
    }
}