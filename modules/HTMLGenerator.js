// Class used for generating HTML elements on the go
export class HTMLGenerator
{
    // Updates the players' scores
    static updatePlayerScores(ulEl, players)
    {
        ulEl.innerHTML = "";
        players = players.sort(function(a, b) {
            return b.getPoints() - a.getPoints();
        });
        for (let i = 0; i < players.length; i++)
        {
            const p = players[i];
            const li = document.createElement("li");
            li.className = "player-listing";

            const name = document.createElement("label");
            name.textContent = p.getName();
            name.style.color = `rgb(${p.getColor()[0]}, ${p.getColor()[1]}, ${p.getColor()[2]})`;

            const points = document.createElement("label");
            points.textContent = p.getPoints();
            points.style.color = `rgb(${p.getColor()[0]}, ${p.getColor()[1]}, ${p.getColor()[2]})`;

            li.appendChild(name);
            li.appendChild(points);
            ulEl.appendChild(li);
        }
    }
} 