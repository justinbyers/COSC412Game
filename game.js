// this is super unfinished
//all work as of now is done by Justin Byers
//github repos @ https://github.com/justinbyers/COSC412Game

/* TODO:
    -fix restart() so that the pause/resume correctly resets
    -remove excess console.logs that have no purpose anymore
    -implement some enemy/monster variable to control x and y coords (instances)
    -figure out how to correctly implement some sort of pathing function
        (current pathing will endlessly loop if there is 2+ left or up moves)
    -give up
*/

/*
helpful resources: 
https://github.com/Trimps/Trimps.github.io
http://dhmholley.co.uk/incrementals.html
*/

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
var continueMoving = true;

window.addEventListener('load', loadup, false); //run loadup() when page loads

var c = 0; //obsolete i think

//tick function
window.setInterval(function(){
this.gameData.time += 1;
updateTime();
if(continueMoving)
    move();


}, 250); //250 = 4 ticks every second, 1000 = 1 tick every second. 1000ms in a sec, 4x250=1000

var templateGrid2 = //10x10 -- not used because it has left and up movements which the current code cant comprehend correctly
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

var templateGrid = //10x10 currently used
[[false, false, false, false, false, false, false, false, false, false],
[true, true, true, true, false, false, false, false, false, false],
[false, false, false, true, true, false, false, false, false, false],
[false, false, false, false, true, true, true, false, false, false],
[false, false, false, false, false, false, true, false, false, false],
[false, false, false, false, false, false, true, false, false, false],
[false, false, false, false, false, true, true, false, false, false],
[false, false, false, false, false, true, false, false, false, false],
[false, false, false, false, false, true, false, false, false, false],
[false, false, false, false, false, true, false, false, false, false]];

var templateGrid1 = //50x10 -- not used
[[false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
[true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
[false, false, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
[false, false, false, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
[false, false, false, false, false, false, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
[false, false, false, false, false, false, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
[false, false, false, false, false, false, false, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
[false, false, false, false, false, false, false, false, false, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
[false, false, false, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
[false, false, false, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]];

var templateGrid3 = //100x10 -- not used
[[false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
[true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
[false, false, false, false, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
[false, false, false, false, false, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
[false, false, false, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
[false, false, false, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
[false, false, false, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
[false, false, false, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
[false, false, false, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
[false, false, false, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]];

var cols = 10;
var rows = 10;
var tileSize = 20;

//creates a quick little grid using variables col,rows,tileSize
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
    row.style.width = cols * tileSize + "px";
    row.style.height = tileSize + "px";
    
    for(var j = 0; j < cols; j++){
        var cell = document.createElement("li");
        cell.setAttribute("id", "cell" + counter)
        row.appendChild(cell);

        cell.style.width = tileSize + "px";
        cell.style.height = tileSize + "px";
        cell.style.backgroundColor = "#228b22";

        
        cell.className = "PH_cell";
        //cell.innerHTML = letter;

        if(templateGrid[i][j] == false)
            cell.style.backgroundColor = "#CCCCCC";
            
        counter++;

    }
} 
}

//returns the x or y start depending on input "x" or "row" vs "y" or "col"
function findStart(type){
//tries to begin a move from (x, y) 
//probably (1, 0) row 1, col 0

switch(type){
    case ("x"):
    case ("row"):
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

//doodoo global variables for x and y coords
//really should be attached to monster/enemy instances
var x = this.startX;
var y = this.startY;


//current problem is that the path doesnt acknowledge previous step, 
//so it can get stuck in an infinite loop
//maybe pass some sort of prevMove variable?
//also x and y coords should be resolved to some sort of
// moster/enermy/??? class-ish variable, so that each instance of enemy holds x and y
function move(){
document.getElementById(("cell" + (x) + y)).style.backgroundColor = "#222222";

// if(y < 10)
//     document.getElementById(("cell" + (x*10) + y)).style.backgroundColor = "#222222"; //*5 because there's 50 cols rather than 10
// else
//     document.getElementById(("cell" + (x) + y)).style.backgroundColor = "#222222"; //*5 because there's 50 cols rather than 10

console.log("GRID" + templateGrid[x][y]);
if(x + 1 == 9){
    x += 1;
    console.log("exit reached " + x + " " + y);
    continueMoving = false;
}
else if(templateGrid[x+1][y] == true){        
    x += 1;
    console.log("can move 1 down " + x + " " + y);

}
else if(templateGrid[x][y+1] == true){
    y += 1;
    console.log("can move 1 right " + x + " " + y);
}
else if(templateGrid[x][y-1] == true){
    y -= 1;
    console.log("can move 1 left " + x + " " + y);
}
else if(templateGrid[x-1][y] == true){
    console.log("can move 1 up but do nothing");
    //x -= 1;
}
else{
    console.log("EXIT REACHED");
    continueMoving = false;
}


//update cell[x][y]
console.log("x: " + x + " y: " + y + "   " + "cell" + (x) + y + " ");
// if(y < 10)
// console.log("x: " + x + " y: " + y + "   " + "cell" + (x*10) + y + " ");
// else
// console.log("x: " + x + " y: " + y + "   " + "cell" + (x) + y + " ");

document.getElementById(("cell" + (x) + y)).style.backgroundColor = "#EEEEEE";
// if(y < 10)
//     document.getElementById(("cell" + (x*10) + y)).style.backgroundColor = "#EEEEEE"; //*5 because there's 50 cols rather than 10
// else
//     document.getElementById(("cell" + (x) + y)).style.backgroundColor = "#EEEEEE"; //*5 because there's 50 cols rather than 10

}

//--
function displayGrid(){    
}

//funct ran on loadup
function loadup(){
document.body.style.backgroundColor = "#666666"; //random color, easier to work with in a dark room

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
console.log(gameData.startX + " " + gameData.startY);
// if(y < 10)
//     document.getElementById(("cell" + (x*10) + y)).style.backgroundColor = "#EEEEEE"; //*5 because there's 50 cols rather than 10
// else
//     document.getElementById(("cell" + (x) + y)).style.backgroundColor = "#EEEEEE"; //*5 because there's 50 cols rather than 10
document.getElementById(("cell" + x + y)).style.backgroundColor = "#EEEEEE";
//move();

}

//updates time elapsed
function updateTime(){
document.getElementById("time").innerHTML = this.gameData.time;
}


//stops the grid movement 
//(currently doesnt update button .innerhtml correctly)
function stopMoving(){
continueMoving = !continueMoving;

var flag = document.getElementById("btn2").innerHTML;
console.log(flag);
switch(flag.innerHTML){
case ("Resume"):
    flag.innerHTML = "Pause";
    break;
case ("Pause"):
    flag.innerHTML = "Resume";
    break
default:
    console.log("Error stopmoving() switch case");
}
// console.log(flag);
}

function change()
{
var elem = document.getElementById("myButton1");
if (elem.value == "Resume") elem.value = "Pause";
else elem.value = "Resume";
stopMoving();
}

//restarts the grid animation -- works
function restart(){
console.log("restarted");
createGrid();
this.gameData.startX = findStart("x");
this.gameData.startY = findStart("y");
console.log(gameData.startX + " " + gameData.startY);
document.getElementById(("cell" + x + y)).style.backgroundColor = "#EEEEEE";

}