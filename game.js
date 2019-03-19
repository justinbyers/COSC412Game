// this is super unfinished

var gameData = {
        money: 0,
        wave: 0,
        time: 0,
        tower1: 0,
        tower2: 0,
        npc1: 0,
        npc2: 0,

    };

window.addEventListener('load', loadup, false);

window.setInterval(function(){
    this.gameData.time += 1;
    updateTime();
}, 1000);

var templateGrid =
[[false, false, false, false, false, false, false, false, false, false],
[true, true, true, true, false, false, true, true, true, false],
[false, false, false, true, false, false, true, false, true, false],
[false, false, false, true, false, true, true, false, true, false],
[false, false, false, true, false, true, false, false, true, false],
[false, true, true, true, false, true, false, false, true, false],
[false, true, false, false, false, true, false, true, true, false],
[false, true, false, false, true, true, false, true, false, false],
[false, true, true, true, true, false, false, true, false, false],
[false, false, false, false, false, false, false, true, false, false]];


function createGrid(){
    var grid = document.getElementById("grid");
    grid.className = "";
    grid.innerHTML = "";
    var counter = 0;
    var letter = 0
    
    for(var i = 0; i < 10; i++){
        var row = document.createElement("ul");
        grid.insertBefore(row, grid.childNodes[0]);
        row.setAttribute("id", "row" + i);
        row.className = "PH_row";
        row.style.paddingBottom = 0 + "px";
        row.style.listStyle = 0; 

        letter += 1; //ph to count cells by row

        for(var j = 0; j < 10; j++){
            var cell = document.createElement("li");
            cell.setAttribute("id", cell + counter)
            row.appendChild(cell);

            cell.style.width = 7 + "%";
            cell.style.backgroundColor = "#228b22";
            cell.style.paddingTop = 1 + "vh";
            cell.style.paddingBottom = 1 + "vh";
            cell.style.fontSize = 2.5 + "vh";
            
            cell.className = "PH_cell";
            cell.innerHTML = letter;

            if(templateGrid[i][j] == false)
                cell.style.backgroundColor = "#CCCCCC";
                
            counter++;

        }
    } 
}

function displayGrid(){    
}

function loadup(){
    document.body.style.backgroundColor = "#666666";

    gameData = {
        money: 0,
        wave: 0,
        time: 0,
        tower1: 0,
        tower2: 0,
        npc1: 0,
        npc2: 0,

    };

    createGrid();

}

function updateTime(){
    document.getElementById("time").innerHTML = this.gameData.time;
}