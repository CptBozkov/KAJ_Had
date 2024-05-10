const minPlayers = 1;
const maxNameLength = 10;
const darkestVal = 20;
const bindingButtonDefault = "#fff";
const bindingButtonSelected = "#999";
let playerData = [
    { name: "Fred", color: [255, 0, 0], left: "a", right: "d" },
    { name: "Greenlee", color: [0, 255, 0], left: "4", right: "6"},
];
let item = localStorage.getItem("hadPlayerData");
if (item != null)
{
    playerData = JSON.parse(item);
}


function removePlayer(name)
{
    for (let i = 0; i < playerData.length; i++)
    {
        let p = playerData[i];
        if (p.name != name) continue;

        playerData.splice(i, 1);
        updatePlayerList();
        return;
    }
}

function updatePlayerList()
{
    let ulEl = document.getElementById("playersList");
    ulEl.innerHTML = "";
    for (let i = 0; i < playerData.length; i++) {
        let p = playerData[i];
        const li = document.createElement("li");
        li.className = "player-listing";
        const label = document.createElement("label");
        label.textContent = p.name;
        label.style.color = `rgb(${p.color[0]}, ${p.color[1]}, ${p.color[2]})`;
        const div = document.createElement("div");

        const buttonRemove = document.createElement("button");
        buttonRemove.textContent = "Remove";
        buttonRemove.className = "player-listing-remove"
        buttonRemove.addEventListener("click", removePlayer.bind(null, p.name));
        
        const buttonLeft = document.createElement("button");
        buttonLeft.textContent = p.left;
        buttonLeft.className = "player-listing-binding"
        buttonLeft.style.backgroundColor = bindingButtonDefault;
        buttonLeft.addEventListener("click", selectButton.bind(this, buttonLeft, p, true));
        
        const buttonRight = document.createElement("button");
        buttonRight.textContent = p.right;
        buttonRight.className = "player-listing-binding"
        buttonRight.style.backgroundColor = bindingButtonDefault;
        buttonRight.addEventListener("click", selectButton.bind(this, buttonRight, p, false));

        li.appendChild(label);
        li.appendChild(div);
        div.appendChild(buttonLeft)
        div.appendChild(buttonRight);
        div.appendChild(buttonRemove);
        ulEl.appendChild(li);
    }
}

let selectedButton = null;
let selectedButtonPrevText = "";
let selectedPlayer = null;
let leftButton = true;
function selectButton(button, playerData, left)
{
    if (selectedButton != null)
    {
        selectedButton.style.backgroundColor = bindingButtonDefault;
        selectedButton.innerText = selectedButtonPrevText;
    }
    selectedButton = button;
    selectedButtonPrevText = button.innerText;
    selectedPlayer = playerData;
    leftButton = left;

    button.style.backgroundColor = bindingButtonSelected;
    button.innerText = "?";
}


document.addEventListener("keydown", (e) =>
{
    if (selectedButton == null) return;

    selectedButton.innerText = e.key;
    selectedButton.style.backgroundColor = bindingButtonDefault;
    if (leftButton) {
        selectedPlayer.left = e.key;
    } else 
    {
        selectedPlayer.right = e.key;
    }
    selectedButton = null;
    e.preventDefault();
});

function addPlayer() 
{
    let playerNameEl = document.getElementById("playerName");
    let playerColorEl = document.getElementById("playerColor");
    let n = playerNameEl.value;
    let c = playerColorEl.value;
    if (n.length <= 0)
    {
        alert("Name is too short!");
        return;
    }
    for (let i = 0; i < playerData.length; i++)
    {
        let p = playerData[i];
        if (p.name != n) continue;

        alert("Player with this name already exists!");
        return;
    }
    let r = parseInt(c.substring(1, 3), 16);
    let g = parseInt(c.substring(3, 5), 16);
    let b = parseInt(c.substring(5, 7), 16);
    if (Math.max(r, g, b) <= darkestVal)
    {
        alert("Color is too dark!");
        return;
    }

    playerData.push({ name: n, color: [r, g, b], left: "<", right: ">" });
    playerNameEl.value = "";
    randomizeSelectedColor();
    console.log(playerColorEl.value)
    updatePlayerList();
}
document.getElementById("addPlayer").addEventListener("click", addPlayer);

document.getElementById("playerName").addEventListener("input", function() 
{
    if (this.value.length > maxNameLength)
    {
        this.value = this.value.slice(0, maxNameLength);
    }
});
document.getElementById("playerName").addEventListener("keypress", function(event)
{
    if (event.key === "Enter") {
        addPlayer();
        event.preventDefault();
    }
});


const startGameButtonEl = document.getElementById("startGame");
startGameButtonEl.addEventListener("click", () => 
{   
    if (playerData.length < minPlayers)
    {
        alert("Not enough players!")
        return;
    }
    let usedLetters = new Set();
    for (let i = 0; i < playerData.length; i++)
    {
        let p = playerData[i];
        if (usedLetters.has(p.left))
        {
            alert(`Multiple players use the same key: "${p.left}"`);
            return;
        }
        usedLetters.add(p.left);
        if (usedLetters.has(p.right))
        {
            alert(`Multiple players use the same key: "${p.right}"`);
            return;
        }
        usedLetters.add(p.right);
    }
    localStorage.setItem("hadPlayerData", JSON.stringify(playerData));
    window.location.href = "game.html";
});

const helpButton = document.getElementById("help");
const closeHelpButton = document.getElementById("closeHelp");
helpButton.addEventListener("click", changeHelpVisible);
closeHelpButton.addEventListener("click", changeHelpVisible);

let helpVisible = false;
function changeHelpVisible()
{
    helpVisible = !helpVisible;
    if (helpVisible)
    {
        document.body.classList.add("helpPopUp-visible")
    }
    else 
    {
        document.body.classList.remove("helpPopUp-visible")
    }
}

const randomColorEl = document.getElementById("randomizeColor");
randomColorEl.addEventListener("click", () =>
{
    randomizeSelectedColor();
});

function randomizeSelectedColor()
{
    let playerColorEl = document.getElementById("playerColor");
    let getRandColor = () => { return (darkestVal + Math.ceil(Math.random() * (255 - darkestVal))).toString(16); };
    playerColorEl.value = `#${getRandColor()}${getRandColor()}${getRandColor()}`;
}

updatePlayerList();
randomizeSelectedColor();
