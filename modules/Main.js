import { Player } from "./Player.js";
import { Game } from "./Game.js"; 
import { HTMLGenerator } from "./HTMLGenerator.js"; 

let game = new Game(1000, 1000);

let players = [];
let playerData = JSON.parse(localStorage.getItem("hadPlayerData"));

for (let i = 0; i < playerData.length; i++)
{
    let data = playerData[i];
    players.push(new Player(data.name, data.color, data.left, data.right));
}

for (let i = 0; i < players.length; i++)
{
    let p = players[i];
    game.addPlayer(p);
}

HTMLGenerator.updatePlayerScores(document.getElementById("playersList"), players);
game.addOnRoundEndCallback(HTMLGenerator.updatePlayerScores.bind(null, document.getElementById("playersList"), players));

game.start();
