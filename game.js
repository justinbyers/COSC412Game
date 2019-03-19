// this is super unfinished
//all work as of now is done by Justin Byers

var gameData = {
        money: 0,
        wave: 0,
        time: 0,
        startX: -1,
        startY: -1,
        tower1: 0,
        tower2: 0,
        npc1: 0,
        npc2: 0,

    };

window.addEventListener('load', loadup, false);

var c = 0;

window.setInterval(function(){
    this.gameData.time += 1;
    updateTime();
    move();
    
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

var cols = 10;
var rows = 10;

function createGrid(){
    var grid = document.getElementById("grid");
    grid.className = "";
    grid.innerHTML = "";
    var counter = 0;
    
    for(var i = 0; i < rows; i++){
        var row = document.createElement("ul");
        //grid.insertBefore(row, grid.childNodes[0]);
        grid.appendChild(row);
        row.setAttribute("id", "row" + i);
        row.className = "PH_row";
        row.style.paddingBottom = 0 + "px";
        row.style.margin = "0px 0px 0px 0px";
        row.style.listStyle = 0; 
        row.style.width = cols * 10 + "px";
        row.style.height = cols + "px";
        
        for(var j = 0; j < cols; j++){
            var cell = document.createElement("li");
            cell.setAttribute("id", cell + counter)
            row.appendChild(cell);

            cell.style.width = 10 + "px";
            cell.style.height = 10 + "px";
            cell.style.backgroundColor = "#228b22";

            
            cell.className = "PH_cell";
            //cell.innerHTML = letter;

            if(templateGrid[i][j] == false)
                cell.style.backgroundColor = "#CCCCCC";
                
            counter++;

        }
    } 
}


function findStart(type){
    //tries to begin a move from (x, y) 
    //probably (1, 0) row 1, col 0

    switch(type){
        case ("x"):
        case ("row"):
        console.log("X OR ROW");
        for(var i = 0; i < rows; i++){
            //console.log(templateGrid[i][0] + " ");
            if(templateGrid[i][0] == true){
                //console.log("yes");
                // x = i; //row
                // y = 0; //col
                return i;
            }
        
        }
        return -1;
        break;

        case ("y"):
        case ("col"):
        console.log("Y OR COL");
        for(var i = 0; i < rows; i++){
            //console.log(templateGrid[i][0] + " ");
            if(templateGrid[i][0] == true){
                //console.log("yes");
                x = i; //row
                y = 0; //col
                return 0;
            }
        }
        return -1;
        break;

        default:
        console.log("findStart(type) cannot find correct parameter");

    }

}

var x = this.startX;
var y = this.startY;


//current problem is that the path doesnt acknowledge previous step, 
//so it can get stuck in an infinite loop
//maybe pass some sort of prevMove variable?
//also x and y coords should be resolved to some sort of
// moster/enermy/??? class-ish variable, so that each instance of enemy holds x and y
function move(){

    console.log(templateGrid[x][y]);
    if(templateGrid[x+1][y] == true){
        console.log("can move 1 down");
        x += 1;
    }
    else if(templateGrid[x][y+1] == true){
        console.log("can move 1 right");
        y += 1;
    }
    else if(templateGrid[x-1][y] == true){
        console.log("can move 1 up");
        x -= 1;
    }
    else if(templateGrid[x][y-1] == true){
        console.log("can move 1 left");
        y -= 1;
    }

       // c++;
    
}

function displayGrid(){    
}

function loadup(){
    document.body.style.backgroundColor = "#666666";

    // gameData = {
    //     money: 0,
    //     wave: 0,
    //     time: 0,
    //     tower1: 0,
    //     tower2: 0,
    //     npc1: 0,
    //     npc2: 0,

    // };

    createGrid();
    this.gameData.startX = findStart("x");
    this.gameData.startY = findStart("y");

    //move();

}

function updateTime(){
    document.getElementById("time").innerHTML = this.gameData.time;
}