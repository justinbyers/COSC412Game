// this is super unfinished
//all work as of now is done by Justin Byers and Matt Chen
//github repos @ https://github.com/justinbyers/COSC412Game

/* TODO:
    -fix restart() so that the pause/resume correctly resets -- done
    -remove excess console.logs that have no purpose anymore -- somewhat finished but prob best to keep some in case shit breaks again
    
    **-implement some enemy/monster variable to control x and y coords (instances) -- going to be difficult  
    -figure out how to fix the current pathing function (or make a new&better one) 
        -by this i (justin) mean that it'll check like "can it move left, no? ok how about right, no? ok down, no? up? 
        -so there's instances where if the path goes left or up then it's stuck in an infinite loop (see "var grid" in gridtemplate.txt)
        -(current pathing will endlessly loop if there is 2+ left or up moves)
    -give up
    -create some kind of tower class thing (ive heard classes dont exist in JS..) so we can start making tower entities
        -attach some form of enemy detection for each tower (ie, if enemy is within 2 cells -> attack)
*/

/*
helpful resources: 
https://github.com/Trimps/Trimps.github.io
http://dhmholley.co.uk/incrementals.html
*/

/* shift + alt + f = auto indent code (on VSCode)*/

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

//tick function
window.setInterval(function () {
    this.gameData.time += 1;
    updateTime();
    if (continueMoving)
        move();


}, 250); //250 = 4 ticks every second, 1000 = 1 tick every second. 1000ms in a sec, 4x250=1000


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

var cols = 10;
var rows = 10;
var tileSize = 20;
var pathColor = "#CCCCCC"; //path color
var groundColor = "#228b22"; //rest of map color
var monsterOnTileColor = "#f46542";

//creates a quick little grid using variables col,rows,tileSize
function createGrid() {
    var grid = document.getElementById("grid");
    grid.className = "";
    grid.innerHTML = "";
    var counter = 0;

    for (var i = 0; i < rows; i++) {

        var row = document.createElement("ul");

        grid.appendChild(row);

        row.setAttribute("id", "row" + i);
        row.className = "PH_row";
        row.style.paddingBottom = 0 + "px";
        row.style.margin = "0px 0px 0px 0px";
        row.style.listStyle = 0;
        row.style.width = "220px";//cols * tileSize + "px"; //cols*tilesize+px is correct when cells have NO border
        row.style.height = tileSize + "px";

        for (var j = 0; j < cols; j++) {
            var cell = document.createElement("li");
            cell.setAttribute("id", "cell" + counter)
            row.appendChild(cell);

            cell.style.width = tileSize + "px";
            cell.style.height = tileSize + "px";
            cell.style.backgroundColor = groundColor;

            cell.style.border = "solid"; // may or may not be removed, added borders to see cells easier
            cell.style.borderWidth = "1px"; //^

            cell.className = "PH_cell";

            if (templateGrid[i][j] == false) //just to differeniate the path cells
                cell.style.backgroundColor = pathColor;

            counter++;

        }
    }
}

//returns the x or y start depending on input "x" or "row" vs "y" or "col"
function findStart(type) {
    //tries to begin a move from (x, y) 
    //probably (1, 0) row 1, col 0

    switch (type) {
        case ("x"):
        case ("row"):
            for (var i = 0; i < rows; i++) {
                if (templateGrid[i][0] == true) {
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
            for (var i = 0; i < rows; i++) {
                if (templateGrid[i][0] == true) {
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
var endMet = false;


//current problem is that the path doesnt acknowledge previous step, 
//so it can get stuck in an infinite loop
//maybe pass some sort of prevMove variable?
//also x and y coords should be resolved to some sort of
// moster/enermy/??? class-ish variable, so that each instance of enemy holds x and y
function move() {
    document.getElementById(("cell" + (x) + y)).style.backgroundColor = "#222222";

    //console.log("GRID" + templateGrid[x][y]);
    if (x + 1 == 9) {
        x += 1;
        console.log("exit reached " + x + " " + y);
        continueMoving = false;
        endMet = true;
    }
    else if (templateGrid[x + 1][y] == true) {
        x += 1;
        console.log("can move 1 down " + x + " " + y);

    }
    else if (templateGrid[x][y + 1] == true) {
        y += 1;
        console.log("can move 1 right " + x + " " + y);
    }
    else if (templateGrid[x][y - 1] == true) {
        y -= 1;
        console.log("can move 1 left " + x + " " + y);
    }
    else if (templateGrid[x - 1][y] == true) {
        console.log("can move 1 up but do nothing");
        //x -= 1; //commented out because we'll get stuck in an infinite loop if this executes (up, down, up, down, up.. etc)
    }
    else {
        console.log("EXIT REACHED");
        continueMoving = false;
        endMet = true;
    }


    //paints the current block "#EEEEEE" just for visibility
    setCellBackgroundColor(x, y, monsterOnTileColor); 
    console.log("x " + x + "  y " + y)
}

//--
function displayGrid() {
}

//funct ran on loadup
function loadup() {
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


    setCellBackgroundColor(x, y, monsterOnTileColor);
    //move();

}

//updates time elapsed
function updateTime() {
    document.getElementById("time").innerHTML = this.gameData.time;
}

//changes cell backgroundcolor using x, y coords and a string hex-color
function setCellBackgroundColor(cellX, cellY, color){
    document.getElementById(("cell" + cellX + cellY)).style.backgroundColor = color;
    //console.log("set cell " + cellX + cellY + " to color " + color);
    //return;
}

//stops the grid movement 
function stopMoving() {
    if(!endMet)
    continueMoving = !continueMoving;

    var flag = document.getElementById("myButton2").innerHTML;
    console.log(flag);
    switch (flag.innerHTML) {
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

//button swapper - made by matt
function change() {
    var elem = document.getElementById("myButton1");
    if (elem.value == '\u25B6') elem.value = '\u275A\u275A';
    else elem.value = '\u25B6';
    stopMoving();
}

//restarts the grid animation -- works
function restart() {
    console.log("restarted");
    createGrid();
    this.gameData.startX = findStart("x");
    this.gameData.startY = findStart("y");
    console.log(gameData.startX + " " + gameData.startY);
    continueMoving = true;

    setCellBackgroundColor(x, y, monsterOnTileColor);

}