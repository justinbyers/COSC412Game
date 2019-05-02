var canvas = document.getElementById('canvas');
var context = canvas.getContext("2d");
canvas.oncontextmenu = function () { return false; }

var tilew = 0.0;
var tileh = 0.0;
var towers = new Array();
var mobs = new Array();
var flakes = new Array();
var size = 10;
var towerCosts = new Array(40, 200, 250); //laser, aoe, slow, wall, x
var directions;
var counter = 0;

var ctower = false;
var ingameXsel = 0;
var ingameYsel = 0;
var towerType = 1;

var DEFAULT_WAVE_DELAY = 1000;
var waveSize = 0;
var mobDelay = 0;
var waveDelay = 200; //how fast the wave starts
var level = 1;
var playerHealth = 100;
var gold = 500;
var score = 0;
var monstersLeft = 0;
var totalKilled = 0;
var totalWaves;

var groundColorArray;
var oceanColorArray;
var lavaColorArray;
var liquidChangeCounter = 0;

var mapSelection = 3; //map selection, choice
var difficultySelection = 1; //difficult selection, choice

var highestLevel = -1;
var highestScore = -1;

var obst = new Array(size); //obstacles, things like path, ocean, etc where u cannot place towers

var SHOCK_DURATION = 25;

//UPGRADES
var upgrade_shockChance = 0 //100, 75, 50, 25 upgrades levels, 100 = no chance, 75 = 25% chance, 50 = 50% chance, 25 = 75% chance
var upgrade_shockRechargeSpeed = 50; //50, default charge speed, 45, 40, 35, 30, 25
var upgrade_snowParticles = 1;


var CHEAT_MOBHP = 0;
var CHEAT_MOBAMOUNT = 0;


var slowTowerFillColor = "#4CC4C2";
var paused = false;
var victory = false;
var gameStarted = false;


requestAnimFrame = (function () {
    return function (callback, element) {
        window.setTimeout(callback, 1000 / 60);
    };
})();

var aaa = false;
onLoadUp();
function onLoadUp() {
    if (aaa == true) {
        gameStarted = true;
        gameLoadUp();

    }

    console.log("AAAAAAA");

    document.getElementById('enemyInfo').setAttribute("style", "visibility: hidden");
    document.getElementById('waveInfo').setAttribute("style", "visibility: hidden");
    document.getElementById('canvas').setAttribute("style", "visibility: visible");


    // document.getElementById('').setAttribute("style", "visibility: hidden");
    // document.getElementById('').setAttribute("style", "visibility: hidden");
    // document.getElementById('').setAttribute("style", "visibility: hidden");
    // document.getElementById('').setAttribute("style", "visibility: hidden");
    // document.getElementById('').setAttribute("style", "visibility: hidden");
    // document.getElementById('').setAttribute("style", "visibility: hidden");


}

function makeTheGoodStuffVisible() {

    document.getElementById('newGameWrapper').setAttribute("style", "z-index: -1; visibility: hidden");

    document.getElementById('diffTitle').setAttribute("style", "z-index: -1; visibility: hidden");
    document.getElementById('innerWrapper').setAttribute("style", "visibility: visible");
    document.getElementById('enemyInfo').setAttribute("style", "visibility: visible");
    document.getElementById('waveInfo').setAttribute("style", "visibility: visible");
    document.getElementById('canvas').setAttribute("style", "visibility: visible");
}

function gameLoadUp() {

    gameStarted = true;

    // title menu code here

    requestAnimFrame(draw);

    if (false) { //cheat commands
        gold = Infinity;
        playerHealth = Infinity;
        waveDelay = 100;
        CHEAT_MOBHP = 0;
        CHEAT_MOBAMOUNT = 0;
        var num = 0; //for towers, see next 3 lines of code
        towers[num++] = new shockTower(3, 2); //remove these 3 to start game w/ blank map
        towers[num++] = new slowTower(7, 1); //used for quickly testing tower .lineTo() drawings
        towers[num++] = new laserTower(3, 3);

    }

    configureDifficultySettings();

    tilew = Math.floor((canvas.width - size) / size);
    tileh = Math.floor((canvas.width - size) / size);

    document.getElementById('tower1bt').value = numberFormat(towerCosts[0]);
    document.getElementById('tower2bt').value = numberFormat(towerCosts[1]);
    document.getElementById('tower3bt').value = numberFormat(towerCosts[2]);



    groundColorArray = randomizedGroundColor();
    oceanColorArray = randomizedOceanColor();
    lavaColorArray = randomizedLavaColor();

    updateUI();
    setupPath();
    genPath();
}

function configureDifficultySettings() {

    //easy difficulty
    if (difficultySelection == 1) {
        totalWaves = 5;
        waveMultiplier = 1;
        document.getElementById("difficultyLevel").innerHTML = "Easy";
    }

    //medium difficulty
    else if (difficultySelection == 2) {
        totalWaves = 10;
        waveMultiplier = 2;
        document.getElementById("difficultyLevel").innerHTML = "Medium";
    }

    //hard difficulty
    else if (difficultySelection == 3) {
        totalWaves = 15;
        waveMultiplier = 3;
        document.getElementById("difficultyLevel").innerHTML = "Hard";
    }

    switch (mapSelection) {
        case 1: document.getElementById("mapName").innerHTML = "Grassland";
            break;
        case 2: document.getElementById("mapName").innerHTML = "Volcano";
            break
        case 3: document.getElementById("mapName").innerHTML = "Beach";
            break
    }
}

function newGameSetup() {
    console.log("oof");

    setTimeout(function () { document.getElementById('welcomeInnerWrapper').setAttribute("style", "display:none; z-index: -1"); }, 500);
    document.getElementById('welcomeInnerWrapper').setAttribute("style", "-webkit-animation: fadeOut 1s");

    setTimeout(function () {
        document.getElementById('newGameSelection').setAttribute("style", "visibility: visible");
        document.getElementById('newGameWrapper').setAttribute("style", "z-index: 1");
    }, 900);


}

function newGame(diff) {
    switch (diff) {
        case 'easy': difficultySelection = 1;
            break;
        case 'med': difficultySelection = 2;
            break
        case 'hard': difficultySelection = 3;
    }
    console.log("yee");

    setTimeout(function () { document.getElementById('diffButtons').setAttribute("style", "display:none; z-index: -1"); }, 500);
    document.getElementById('diffButtons').setAttribute("style", "-webkit-animation: fadeOut 1s");


    setTimeout(function () {
        document.getElementById('mapButtons').setAttribute("style", "display:none");
        document.getElementById('diffTitle').innerHTML = "Select Map";
    }, 1000);



}

function selectMap(map) {
    document.getElementById('newGameWrapper').setAttribute("style", "z-index: -1; visibility: hidden");
    mapSelection = map
    makeTheGoodStuffVisible();
    gameLoadUp();
}
function setupPath() {

    directions = new Array();
    for (var i = 0; i < 10; i++) {
        directions[i] = new Array();
        for (var j = 0; j < 10; j++) {
            directions[i][j] = new VisPoint(i, j);
            directions[i][j].from = 1;
        }
    }

    //Level 1 - Forest
    if (mapSelection == 1) {
        path = new Array(new Point(9, 4),
            new Point(8, 4), new Point(8, 3), new Point(7, 3),
            new Point(6, 3), new Point(6, 2), new Point(5, 2),
            new Point(4, 2), new Point(4, 1), new Point(3, 1),
            new Point(2, 1), new Point(1, 1), new Point(1, 2),
            new Point(1, 3), new Point(1, 4), new Point(2, 4),
            new Point(2, 5), new Point(2, 6), new Point(3, 6),
            new Point(3, 7), new Point(3, 8), new Point(4, 8),
            new Point(4, 9));

        directions[9][4].from = new VisPoint(8, 4);
        directions[8][4].from = new VisPoint(8, 3);
        directions[8][3].from = new VisPoint(7, 3);
        directions[7][3].from = new VisPoint(6, 3);
        directions[6][3].from = new VisPoint(6, 2);
        directions[6][2].from = new VisPoint(5, 2);
        directions[5][2].from = new VisPoint(4, 2);
        directions[4][2].from = new VisPoint(4, 1);
        directions[4][1].from = new VisPoint(3, 1);
        directions[3][1].from = new VisPoint(2, 1);
        directions[2][1].from = new VisPoint(1, 1);
        directions[1][1].from = new VisPoint(1, 2);
        directions[1][2].from = new VisPoint(1, 3);
        directions[1][3].from = new VisPoint(1, 4);
        directions[1][4].from = new VisPoint(2, 4);
        directions[2][4].from = new VisPoint(2, 5);
        directions[2][5].from = new VisPoint(2, 6);
        directions[2][6].from = new VisPoint(3, 6);
        directions[3][6].from = new VisPoint(3, 7);
        directions[3][7].from = new VisPoint(3, 8);
        directions[3][8].from = new VisPoint(4, 8);
        directions[4][8].from = new VisPoint(4, 9);
        directions[4][9].from = new VisPoint(4, 10);
    }

    //Level 2 - Lava
    else if (mapSelection == 2) {

        path = new Array(new Point(2, 9),
            new Point(2, 8), new Point(2, 7), new Point(2, 6),
            new Point(3, 6), new Point(3, 5), new Point(3, 4),
            new Point(4, 4), new Point(4, 3), new Point(5, 3),
            new Point(6, 3), new Point(6, 2), new Point(7, 2),
            new Point(8, 2), new Point(9, 2), new Point(9, 2));

        directions[2][9].from = new VisPoint(2, 8);
        directions[2][8].from = new VisPoint(2, 7);
        directions[2][7].from = new VisPoint(2, 6);
        directions[2][6].from = new VisPoint(3, 6);
        directions[3][6].from = new VisPoint(3, 5);
        directions[3][5].from = new VisPoint(3, 4);
        directions[3][4].from = new VisPoint(4, 4);
        directions[4][4].from = new VisPoint(4, 3);
        directions[4][3].from = new VisPoint(5, 3);
        directions[5][3].from = new VisPoint(6, 3);
        directions[6][3].from = new VisPoint(6, 2);
        directions[6][2].from = new VisPoint(7, 2);
        directions[7][2].from = new VisPoint(8, 2);
        directions[8][2].from = new VisPoint(9, 2);
        directions[9][2].from = new VisPoint(10, 2);

    }

    //Level 3 - Water
    else if (mapSelection == 3) {
        path = new Array(
            new Point(0, 0), new Point(1, 0),
            new Point(1, 1), new Point(2, 1),
            new Point(2, 2), new Point(2, 3),
            new Point(2, 4), new Point(2, 5),
            new Point(3, 5), new Point(3, 6),
            new Point(3, 7), new Point(4, 7),
            new Point(4, 8), new Point(5, 8),
            new Point(6, 8), new Point(7, 8),
            new Point(7, 7), new Point(8, 7),
            new Point(8, 6), new Point(8, 5),
            new Point(9, 4), new Point(8, 4),
            new Point(9, 3));

        directions[0][0].from = new VisPoint(1, 0);
        directions[1][0].from = new VisPoint(1, 1);
        directions[1][1].from = new VisPoint(2, 1);
        directions[2][1].from = new VisPoint(2, 2);
        directions[2][2].from = new VisPoint(2, 3);
        directions[2][3].from = new VisPoint(2, 4);
        directions[2][4].from = new VisPoint(2, 5);
        directions[2][5].from = new VisPoint(3, 5);
        directions[3][5].from = new VisPoint(3, 6);
        directions[3][6].from = new VisPoint(3, 7);
        directions[3][7].from = new VisPoint(4, 7);
        directions[4][7].from = new VisPoint(4, 8);
        directions[4][8].from = new VisPoint(5, 8);
        directions[5][8].from = new VisPoint(6, 8);
        directions[6][8].from = new VisPoint(7, 8);
        directions[7][8].from = new VisPoint(7, 7);
        directions[7][7].from = new VisPoint(8, 7);
        directions[8][7].from = new VisPoint(8, 6);
        directions[8][6].from = new VisPoint(8, 5);
        directions[8][5].from = new VisPoint(8, 4);
        directions[8][4].from = new VisPoint(9, 4);
        directions[9][4].from = new VisPoint(9, 3);
        directions[9][3].from = new VisPoint(10, 3);
    }

}

function paintPath() {
    context.globalAlpha = 1;
    context.strokeStyle = "#111";
    var tile = 0;

    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            liquidChangeCounter++;

            if ((mapSelection == 2 || mapSelection == 3) && liquidChangeCounter == 9000) { //every 9000 tick itll change liquid colors
                oceanColorArray = randomizedOceanColor();
                lavaColorArray = randomizedLavaColor();
                liquidChangeCounter = 0;
            }

            if (obst[i][j] == false && mapSelection == 2) {
                context.fillStyle = lavaColorArray[tile++];
                context.fillRect(i * tilew + i, j * tileh + j, size * 4 - 1, size * 4 - 1);
            }
            else if (obst[i][j] == false && mapSelection == 3) {

                context.fillStyle = oceanColorArray[tile++];
                context.fillRect(i * tilew + i, j * tileh + j, size * size, size * size);
            }
            else {
                context.fillStyle = groundColorArray[tile++];
                context.fillRect(i * tilew + i, j * tileh + j, size * 4, size * 4);

            }
        }
    }
    context.beginPath();
    context.stroke();
}

function genPath() {

    for (var i = 0; i < size; i++)
        obst[i] = new Array(size);

    //lava
    if (mapSelection == 2) {
        obst[3][7] = false; obst[3][8] = false; obst[3][9] = false;
        obst[4][5] = false; obst[4][6] = false; obst[4][7] = false;
        obst[4][8] = false; obst[4][9] = false; obst[5][4] = false;
        obst[5][5] = false; obst[5][6] = false; obst[5][7] = false;
        obst[5][8] = false; obst[5][9] = false; obst[6][4] = false;
        obst[6][5] = false; obst[6][6] = false; obst[6][7] = false;
        obst[6][8] = false; obst[6][9] = false; obst[7][3] = false;
        obst[7][4] = false; obst[7][5] = false; obst[7][6] = false;
        obst[7][7] = false; obst[7][8] = false; obst[7][9] = false;
        obst[8][3] = false; obst[8][4] = false; obst[8][5] = false;
        obst[8][6] = false; obst[8][7] = false; obst[8][8] = false;
        obst[8][9] = false; obst[9][3] = false; obst[9][4] = false;
        obst[9][5] = false; obst[9][6] = false; obst[9][7] = false;
        obst[9][8] = false; obst[9][9] = false;
    }

    //ocean
    if (mapSelection == 3) {
        obst[0][1] = false; obst[0][2] = false; obst[0][3] = false;
        obst[0][4] = false; obst[0][5] = false; obst[0][6] = false;
        obst[0][7] = false; obst[0][8] = false; obst[0][9] = false;
        obst[1][2] = false; obst[1][3] = false; obst[1][4] = false;
        obst[1][5] = false; obst[1][6] = false; obst[1][7] = false;
        obst[1][8] = false; obst[1][9] = false; obst[2][6] = false;
        obst[2][7] = false; obst[2][8] = false; obst[2][9] = false;
        obst[3][8] = false; obst[3][9] = false; obst[4][9] = false;
        obst[5][9] = false; obst[6][9] = false; obst[7][9] = false;
        obst[8][8] = false; obst[8][9] = false; obst[9][5] = false;
        obst[9][6] = false; obst[9][7] = false; obst[9][8] = false;
        obst[9][9] = false;
    }

    for (var i = 0; i < path.length; i++)
        obst[path[i].x][path[i].y] = false;

    for (var i = 0; i < towers.length; i++)
        obst[towers[i].x][towers[i].y] = true;


    return (path != -1);
}

function randomizedGroundColor() {

    groundColorArray = new Array();

    for (var i = 0; i < 100; i++) { //should be size*size if 1 color per tile, otherwise 1200 if 9 colors per tile

        var num = Math.floor(Math.random() * 5);
        var color = "#FFFFFF"; //if you're seeing white tiles then something's fucked

        if (mapSelection == 2)
            switch (num) { //rock
                case 0: color = "#8e967e";
                    break;
                case 1: color = "#a7af95";
                    break;
                case 2: color = "#758259";
                    break;
                case 3: color = "#7e966f";
                    break;
                case 4: color = "#52704c";
                    break;
            }

        else
            switch (num) { //grass
                case 0: color = "#71aa3d";
                    break;
                case 1: color = "#5b8e39";
                    break;
                case 2: color = "#6fb231";
                    break;
                case 3: color = "#7caf52";
                    break;
                case 4: color = "#4b9b29";
                    break;
            }



        groundColorArray[i] = color;
    }

    return groundColorArray;
}

function randomizedOceanColor() {
    oceanColorArray = new Array();

    for (var i = 0; i < 100; i++) { //should be size*size if 1 color per tile, otherwise 1200 if 9 colors per tile

        var num = Math.floor(Math.random() * 5);
        var color = "#FFFFFF"; //if you're seeing white tiles then something's fucked

        switch (num) { //water
            case 0: color = "#4493e2";
                break;
            case 1: color = "#4689ea";
                break;
            case 2: color = "#2673e2";
                break;
            case 3: color = "#377fe8";
                break;
            case 4: color = "#3b8bdb";
        }
        oceanColorArray[i] = color;
    }

    return oceanColorArray;
}

function randomizedLavaColor() {

    lavaColorArray = new Array();

    for (var i = 0; i < 100; i++) { //should be size*size if 1 color per tile, otherwise 1200 if 9 colors per tile

        var num = Math.floor(Math.random() * 5);
        var color = "#FFFFFF"; //if you're seeing white tiles then something's fucked

        // Level 2 - Lava Level
        switch (num) { //feel free to change these #hex codes to whatever. or add more
            case 0: color = "#d67026";
                break;
            case 1: color = "#de8f33";
                break;
            case 2: color = "#c84f1a";
                break;
            case 3: color = "#cd5b1f";
                break;
            case 4: color = "#d97e2b";
                break;
        }
        lavaColorArray[i] = color;
    }

    return lavaColorArray;
}


function laserTower(x, y) {
    this.id = 1;
    this.name = "Laser Tower";
    this.killed = 0;
    this.lvl = 1;
    this.range = 2.3;
    this.sel = false;
    //this.cost = 4; obsolete??

    this.x = x;
    this.y = y;

    this.dmg = function () {
        return (Math.pow(1.7, this.lvl) * 3).toFixed(0);
    }

    this.getXCenter = function () {
        return this.x * tilew + this.x + tilew / 2 + 0.5;
    }
    this.getYCenter = function () {
        return this.y * tileh + this.y + tileh / 2 + 0.5;
    }
    this.getUpgradeCost = function () {
        return (towerCosts[0] + Math.floor(Math.pow(1.9, this.lvl) * 60));
    }
    this.getSellValue = function () {
        return (towerCosts[0] / 2 + Math.floor((Math.pow(1.9, this.lvl - 1) - 1) * 60));
    }

    this.draw = function () {
        context.save();
        context.translate(Math.floor(this.getXCenter()), Math.floor(this.getYCenter()));


        context.fillStyle = "#777777"; //body color
        context.lineWidth = 2;
        context.strokeStyle = "#353535"; //outline color
        context.beginPath();

        context.lineTo(0 * tilew, .4 * tileh);
        context.lineTo(.35 * tilew, -8);
        context.lineTo(-.35 * tilew, -8);
        context.lineTo(0, .4 * tileh);
        context.lineTo(0, .4 * tileh);

        context.fill();
        context.stroke();

        if (this.atk) {
            context.fillStyle = "#ff6363";
            context.strokeStyle = "#FF1C1C";
        }

        context.beginPath();
        context.arc(0, -0.2 * tileh, Math.floor(Math.min(tilew, tileh) * 0.2), 0, 2 * Math.PI, false);
        context.fill();
        context.stroke();

        if (this.sel) {
            context.strokeStyle = "#FF0";
            context.beginPath();
            context.moveTo(-tilew / 2, -tileh / 2);
            context.lineTo(-tilew / 2, tileh / 2);
            context.lineTo(tilew / 2, tileh / 2);
            context.lineTo(tilew / 2, -tileh / 2);
            context.lineTo(-tilew / 2, -tileh / 2);
            context.stroke();

            document.getElementById('laserTowerName').innerHTML = this.name; //realtime update of name, lvl, mobs killed
            document.getElementById('laserTowerLevel').innerHTML = this.lvl;
            document.getElementById('laserTowerDamage').innerHTML = toExponentialFixaroo(this.dmg());
            document.getElementById('laserTowerTotalKilled').innerHTML = this.killed;
        }

        context.restore();
    }

    this.attack = function () {
        this.atk = false;
        for (var i = 0; i < mobs.length; i++) {
            var xdist = mobs[i].x - this.x;
            var ydist = mobs[i].y - this.y;
            var dist = Math.sqrt(xdist * xdist + ydist * ydist);
            if (dist <= this.range) {
                mobs[i].hp -= this.dmg();
                this.atk = true;
                if (mobs[i].hp <= 0) {
                    this.killed++;
                }

                context.beginPath();
                context.lineWidth = 2;
                context.moveTo(this.x * tilew + this.x + tilew / 2, this.y * tileh + this.y + tileh / 2 - 0.2 * tileh);
                context.lineTo(mobs[i].getXCenter(), mobs[i].getYCenter());
                context.strokeStyle = "#ff1c1c"; //beam color
                context.stroke();
                break;
            }
        }
    }

}

function shockTower(x, y) {
    this.id = 2;
    this.name = "Shock Tower";
    this.cost = 10;
    this.lvl = 1;
    this.range = 2.3;
    this.killed = 0;

    this.recharge = upgrade_shockRechargeSpeed;
    this.charge = 20;
    this.shockChance = upgrade_shockChance;

    this.sel = false;
    this.anim = 0;

    this.x = x;
    this.y = y;

    this.dmg = function () {
        return ((Math.pow(1.93, this.lvl) * 40)).toFixed(0);
    }


    this.getXCenter = function () {
        return this.x * tilew + this.x + tilew / 2 + 0.5;
    }
    this.getYCenter = function () {
        return this.y * tileh + this.y + tileh / 2 + 0.5;
    }


    this.getUpgradeCost = function () {
        return (towerCosts[1] + Math.floor(Math.pow(2.7, this.lvl) * 80));
    }
    this.getSellValue = function () {
        return (towerCosts[1] / 2 + Math.floor((Math.pow(2.7, this.lvl - 1) - 1) * 80));
    }

    this.draw = function () {
        context.save();
        context.translate(Math.floor(this.getXCenter()), Math.floor(this.getYCenter()));

        // var a = rgb(223, 201, 143);
        // : radial-gradient(circle, rgba(223, 201, 143, 1) 0%, rgba(217, 185, 100, 1) 100%);

        context.fillStyle = "#FF0"; // body fill color

        context.beginPath();
        context.arc(0, 0, Math.floor(Math.min(tilew, tileh) * 0.45), 0, Math.PI * 2, false);
        context.fill();
        context.lineWidth = 2;
        context.strokeStyle = "#111111"; // outer circle
        context.stroke();
        // context.fillStyle = "#FF1c1c"; //obsolete?? 

        if (this.charge >= 0) { //waiting to pulse
            context.globalAlpha = 0.4;
            context.fillStyle = "#Faff00";
            context.beginPath();
            //context.arc(0, 0, Math.floor(Math.min(tilew, tileh) * 0.45 * (this.charge / this.recharge)), 0, Math.PI * 2, false);
            context.fill();
            context.globalAlpha = 1;
        } else { //pulses
            context.globalAlpha = .8 * (1 - (Math.abs(this.charge) / 20));
            context.fillStyle = "#faff00";
            context.beginPath();
            context.arc(0, 0, Math.floor(Math.min(tilew, tileh) * this.range), 0, Math.PI * 2, false);
            context.fill();
            context.globalAlpha = 1;
        }

        context.fillStyle = "#FFF";
        context.save();
        context.beginPath();
        if (this.charge == 0) {
            this.anim = (this.anim + 1) % 360;
        }

        context.lineTo(3, -12); //top of lightning bolt
        context.lineTo(-7, 1.5); //down left
        context.lineTo(1, 1.5); //right horizontally
        context.lineTo(-2, 10); //down left/straight

        context.lineTo(8, -1.5); //up right
        context.lineTo(0, -1.5); //left horizontally
        context.lineTo(3, -12); //up right/straight
        context.fillStyle = "#333333";
        context.fill();

        context.lineWidth = 1.5;
        context.stroke();

        context.restore();

        if (this.sel) {
            context.strokeStyle = "#FF0";
            context.beginPath();
            context.moveTo(-tilew / 2, -tileh / 2);
            context.lineTo(-tilew / 2, tileh / 2);
            context.lineTo(tilew / 2, tileh / 2);
            context.lineTo(tilew / 2, -tileh / 2);
            context.lineTo(-tilew / 2, -tileh / 2);
            context.stroke();

            document.getElementById('shockTowerName').innerHTML = this.name; //realtime update of name, lvl, mobs killed
            document.getElementById('shockTowerLevel').innerHTML = this.lvl;
            document.getElementById('shockTowerDamage').innerHTML = toExponentialFixaroo(this.dmg());
            document.getElementById('shockTowerTotalKilled').innerHTML = this.killed;
            document.getElementById('shockChance').innerHTML = 100 - this.shockChance;
        }

        context.restore();

        if (this.charge != 0) this.charge--;
        if (this.charge < -20) {
            this.charge = this.recharge;
        }
    }
    this.attack = function () {
        if (this.charge == 0) {
            var foundOne = false;
            for (var i = 0; i < mobs.length; i++) {
                var xdist = mobs[i].x - this.x;
                var ydist = mobs[i].y - this.y;
                var dist = Math.sqrt(xdist * xdist + ydist * ydist);
                if (dist <= this.range) {
                    mobs[i].hp -= this.dmg();
                    mobs[i].shocked = Math.random() * 100;
                    mobs[i].shockDuration = SHOCK_DURATION;

                    if (mobs[i].hp <= 0) {
                        this.killed++;
                    }
                    foundOne = true;
                }
            }
            if (foundOne) {
                this.charge--;
            }
        }
    }

}

function slowTower(x, y) {
    this.id = 3;
    this.name = "Slow Tower";
    this.lvl = 1;
    this.range = 2.3;
    this.killed = 0;

    this.recharge = 13; //snow particle recharge rare, upgrade_snowParticleRecharge idea here
    this.charge = this.recharge;

    this.sel = false;
    this.anim = 0;

    this.x = x;
    this.y = y;

    this.getXCenter = function () {
        return this.x * tilew + this.x + tilew / 2 + 0.5;
    }
    this.getYCenter = function () {
        return this.y * tileh + this.y + tileh / 2 + 0.5;
    }

    this.getUpgradeCost = function () {
        return towerCosts[2] + Math.pow(2.5, this.lvl) * 50 + 0;

    }
    this.getSellValue = function () {
        return towerCosts[2] / 2 + (Math.pow(8, this.lvl - 1) - 1) * 100;

    }

    this.draw = function () {
        context.save();
        context.beginPath();
        context.translate(Math.floor(this.getXCenter()), Math.floor(this.getYCenter()));

        this.anim = (this.anim + 1.8) % 360;
        context.save();

        context.fillStyle = "#FFFFFF";
        context.arc(0, 0, Math.floor(Math.min(tilew, tileh) * 0.45), 0, Math.PI * 2, false);
        context.fill();


        context.strokeStyle = slowTowerFillColor;
        context.lineWidth = 1.5;

        context.moveTo(0, 0);
        context.lineTo(0, -8);
        context.lineTo(-4, -11);
        context.moveTo(4, -11);
        context.lineTo(0, -8);
        context.lineTo(0, -13);

        context.moveTo(-3, -5);
        context.lineTo(3, -5);

        for (var i = 0; i < 5; i++) {
            context.rotate(Math.PI / 3);
            context.moveTo(0, 0);
            context.lineTo(0, -8);
            context.lineTo(-4, -11);
            context.moveTo(0, -8);
            context.lineTo(4, -11);
            context.lineTo(0, -8);
            context.lineTo(0, -13);

            context.moveTo(-3, -5);
            context.lineTo(3, -5);

        }
        context.stroke();


        context.restore();

        if (this.sel) {
            context.strokeStyle = "#FF0";
            context.lineWidth = 2;
            context.beginPath();
            context.moveTo(-tilew / 2, -tileh / 2);
            context.lineTo(-tilew / 2, tileh / 2);
            context.lineTo(tilew / 2, tileh / 2);
            context.lineTo(tilew / 2, -tileh / 2);
            context.lineTo(-tilew / 2, -tileh / 2);
            context.stroke();

            document.getElementById('slowTowerName').innerHTML = this.name; //realtime update of name, lvl, mobs killed
            document.getElementById('slowTowerLevel').innerHTML = this.lvl;

        }

        context.restore();
    }
    this.attack = function () {
        this.charge--;
        if (this.charge <= 0) {
            this.charge = this.recharge;
            for (var i = 0; i < this.lvl; i++) {
                var rot = i * Math.PI * 2 / this.lvl + Math.PI * this.anim / 180 + Math.PI / 6;
                flakes[flakes.length] = new snowParticle(rot, this.x + Math.cos(rot) * 0.3, this.y + Math.sin(rot) * 0.3);
            }
        }
    }
}

function snowParticle(dir, x, y) {
    this.xspeed = Math.cos(dir);
    this.yspeed = Math.sin(dir);
    this.x = x;
    this.y = y;
    this.life = 1;


    this.update = function () {
        this.x += 0.035 * this.xspeed * this.life;
        this.y += 0.035 * this.yspeed * this.life;
        this.life -= 0.012;
        if (this.life <= 0) {
            return false;
        } else {
            for (var i = 0; i < mobs.length; i++) {
                var xdist = (mobs[i].getXCenter() - (this.x * tilew + this.x)) / tilew;
                var ydist = (mobs[i].getYCenter() - (this.y * tilew + this.y)) / tileh;
                var dist = Math.sqrt(xdist * xdist + ydist * ydist);

                if (dist < 0.2) {
                    mobs[i].slowDuration = 60;
                }
            }
        }

        return true;
    }


    this.draw = function () {
        context.save();
        context.globalAlpha = this.life;
        context.translate(this.x * tilew + this.x + tileh / 2, this.y * tileh + this.y + tileh / 2);

        context.rotate(Math.PI * 1.5 * this.life);

        context.beginPath();
        context.moveTo(0, -1);
        context.lineTo(0, 5);
        context.moveTo(0, -1);
        context.lineTo(4, 2);
        context.moveTo(0, -1);
        context.lineTo(3.5, -5);
        context.moveTo(0, -1);
        context.lineTo(-3.5, -5);
        context.moveTo(0, -1);
        context.lineTo(-4, 2);
        context.lineWidth = 3;
        context.strokeStyle = "#4CC5C3";
        context.stroke();
        context.lineWidth = 1;
        context.strokeStyle = "#FFF";
        context.stroke();
        context.globalAlpha = 1;

        context.restore();

    }

}

function mob(level) { // Basic mob, Green Pea
    this.lvl = level;
    this.hp = Math.pow(1.20, this.lvl - 1) * 5.5 + 50 + 15 * this.lvl + CHEAT_MOBHP; //mob hp
    this.maxhp = this.hp;

    this.slowDuration = 0;
    this.shockDuration = SHOCK_DURATION;
    this.shocked = 0;

    this.index = 0;

    this.x = path[0].x;
    this.y = path[0].y;
    this.xbase = this.x;
    this.ybase = this.y;
    this.xoffset = Math.floor((2 * Math.random() - 1) * 0.5 * (tilew / 2));
    this.yoffset = Math.floor((2 * Math.random() - 1) * 0.5 * (tileh / 2));

    this.getXCenter = function () {
        return this.x * tilew + this.x + tilew / 2 + this.xoffset + 0.5;
    }
    this.getYCenter = function () {
        return this.y * tileh + this.y + tileh / 2 + this.yoffset + 0.5;
    }

    this.draw = function () {
        context.save();
        context.translate(Math.floor(this.getXCenter()), Math.floor(this.getYCenter()));

        if (this.slowDuration > 0)
            context.fillStyle = "rgb(0, 65, 150)";
        else
            context.fillStyle = "#00b670"; //monster color


        context.strokeStyle = "#111111";
        context.beginPath();
        context.arc(0, 0, Math.floor(Math.min(tilew, tileh) * 0.2), 0, Math.PI * 2, false);
        context.fill();
        context.stroke();
        if (this.hp < this.maxhp) { //missing hp
            context.fillStyle = "#000"; //missing hp color
            context.beginPath();
            context.moveTo(0, 0);
            context.arc(0, 0, Math.floor(Math.min(tilew, tileh) * 0.2), Math.PI * 2 * (this.hp / this.maxhp), Math.PI * 2, false);
            context.fill();
        }
        if (this.shocked > upgrade_shockChance && this.shockDuration > 0) { //currently shocked
            context.beginPath();
            context.moveTo(0, 0);

            context.lineTo(3, -14); //top of lightning bolt
            context.lineTo(-7, 1.5); //down left
            context.lineTo(1, 1.5); //right horizontally
            context.lineTo(-2, 14); //down left/straight

            context.lineTo(8, -1.5); //up right
            context.lineTo(0, -1.5); //left horizontally
            context.lineTo(3, -14); //up right/straight   

            context.fillStyle = "#ffff00";

            context.fill();
            context.stroke();
        }



        context.restore();
    }
    this.update = function () {

        document.getElementById('monstersHealth').innerHTML = toExponentialFixaroo((this.maxhp).toFixed(0)); //mob hp indicator

        if (this.hp <= 0) {

            gold += Math.floor(Math.pow(2.175, this.lvl));
            score += Math.floor(Math.pow(1.18, this.lvl));

            monstersLeft--;
            totalKilled++;
            updateUI();
            return false;
        }

        var speed = (this.slowDuration-- > 0 ? 0.02 : 0.05);//mob speed
        if (this.slowDuration < 0) this.slowDuration = 0;

        var prevSpeed = speed;
        if (this.shocked > upgrade_shockChance && this.shockDuration > 0) {
            this.shockDuration--;
            speed = 0;
        }
        else
            speed = prevSpeed;

        var pre = Math.floor(this.index);
        this.index += speed;
        if (this.index >= 1) {
            if (directions[this.xbase][this.ybase].from != 1) {
                var xi = this.xbase;
                var yi = this.ybase;
                this.xbase = directions[xi][yi].from.loc.x;
                this.ybase = directions[xi][yi].from.loc.y;
            }
            this.index = 0;
        }
        if (this.xbase >= size || this.ybase >= size) {
            playerHealth--;
            updateUI();
            return false;
        }
        var a = directions[this.xbase][this.ybase].loc;
        var b = directions[this.xbase][this.ybase].from.loc;
        if (b == null || a == null) return true;

        this.x = a.x * (1 - this.index) + b.x * this.index;
        this.y = a.y * (1 - this.index) + b.y * this.index;

        return true;
    }
}

function mob2(level) { // Big Slow one, Red Pea
    this.lvl = level;
    this.hp = Math.pow(1.20, this.lvl - 1) * 5.5 + 500 + 15 * this.lvl + CHEAT_MOBHP; //mob hp
    this.maxhp = this.hp;

    this.slowDuration = 0;
    this.shockDuration = SHOCK_DURATION;
    this.shocked = 0;

    this.index = 0;

    this.x = path[0].x;
    this.y = path[0].y;
    this.xbase = this.x;
    this.ybase = this.y;
    this.xoffset = Math.floor((2 * Math.random() - 1) * 0.5 * (tilew / 2));
    this.yoffset = Math.floor((2 * Math.random() - 1) * 0.5 * (tileh / 2));

    this.getXCenter = function () {
        return this.x * tilew + this.x + tilew / 2 + this.xoffset + 0.5;
    }
    this.getYCenter = function () {
        return this.y * tileh + this.y + tileh / 2 + this.yoffset + 0.5;
    }

    this.draw = function () {
        context.save();
        context.translate(Math.floor(this.getXCenter()), Math.floor(this.getYCenter()));

        if (this.slowDuration > 0)
            context.fillStyle = "rgb(0, 65, 150)";
        else
            context.fillStyle = "#c90c1b"; //monster color


        context.strokeStyle = "#111111";
        context.beginPath();
        context.arc(0, 0, Math.floor(Math.min(tilew, tileh) * 0.25), 0, Math.PI * 2, false); //mob size
        context.fill();
        context.stroke();
        if (this.hp < this.maxhp) { //missing hp
            context.fillStyle = "#000"; //missing hp color
            context.beginPath();
            context.moveTo(0, 0);
            context.arc(0, 0, Math.floor(Math.min(tilew, tileh) * 0.25), Math.PI * 2 * (this.hp / this.maxhp), Math.PI * 2, false);
            context.fill();
        }
        if (this.shocked > upgrade_shockChance && this.shockDuration > 0) { //currently shocked
            context.beginPath();
            context.moveTo(0, 0);

            context.lineTo(3, -14); //top of lightning bolt
            context.lineTo(-7, 1.5); //down left
            context.lineTo(1, 1.5); //right horizontally
            context.lineTo(-2, 14); //down left/straight

            context.lineTo(8, -1.5); //up right
            context.lineTo(0, -1.5); //left horizontally
            context.lineTo(3, -14); //up right/straight   

            context.fillStyle = "#ffff00";

            context.fill();
            context.stroke();
        }



        context.restore();
    }
    this.update = function () {

        document.getElementById('monstersHealth').innerHTML = toExponentialFixaroo((this.maxhp).toFixed(0)); //mob hp indicator

        if (this.hp <= 0) {

            gold += Math.floor(Math.pow(2.5, this.lvl));
            score += Math.floor(Math.pow(1.25, this.lvl));

            monstersLeft--;
            totalKilled++;
            updateUI();
            return false;
        }

        var speed = (this.slowDuration-- > 0 ? 0.01 : 0.02);//mob speed
        if (this.slowDuration < 0) this.slowDuration = 0;

        var prevSpeed = speed;
        if (this.shocked > upgrade_shockChance && this.shockDuration > 0) {
            this.shockDuration--;
            speed = 0;
        }
        else
            speed = prevSpeed;

        var pre = Math.floor(this.index);
        this.index += speed;
        if (this.index >= 1) {
            if (directions[this.xbase][this.ybase].from != 1) {
                var xi = this.xbase;
                var yi = this.ybase;
                this.xbase = directions[xi][yi].from.loc.x;
                this.ybase = directions[xi][yi].from.loc.y;
            }
            this.index = 0;
        }
        if (this.xbase >= size || this.ybase >= size) {
            playerHealth--;
            updateUI();
            return false;
        }
        var a = directions[this.xbase][this.ybase].loc;
        var b = directions[this.xbase][this.ybase].from.loc;
        if (b == null || a == null) return true;

        this.x = a.x * (1 - this.index) + b.x * this.index;
        this.y = a.y * (1 - this.index) + b.y * this.index;

        return true;
    }
}

function mob3(level) { //Little fast one, Yellow Pea
    this.lvl = level;
    this.hp = Math.pow(1.20, this.lvl - 1) * 5.5 + 10 + 15 * this.lvl + CHEAT_MOBHP; //mob hp
    this.maxhp = this.hp;

    this.slowDuration = 0;
    this.shockDuration = SHOCK_DURATION;
    this.shocked = 0;

    this.index = 0;

    this.x = path[0].x;
    this.y = path[0].y;
    this.xbase = this.x;
    this.ybase = this.y;
    this.xoffset = Math.floor((2 * Math.random() - 1) * 0.5 * (tilew / 2));
    this.yoffset = Math.floor((2 * Math.random() - 1) * 0.5 * (tileh / 2));

    this.getXCenter = function () {
        return this.x * tilew + this.x + tilew / 2 + this.xoffset + 0.5;
    }
    this.getYCenter = function () {
        return this.y * tileh + this.y + tileh / 2 + this.yoffset + 0.5;
    }

    this.draw = function () {
        context.save();
        context.translate(Math.floor(this.getXCenter()), Math.floor(this.getYCenter()));

        if (this.slowDuration > 0)
            context.fillStyle = "rgb(0, 65, 150)";
        else
            context.fillStyle = "#e9ed04"; //monster color


        context.strokeStyle = "#111111";
        context.beginPath();
        context.arc(0, 0, Math.floor(Math.min(tilew, tileh) * 0.16), 0, Math.PI * 2, false); //mob size
        context.fill();
        context.stroke();
        if (this.hp < this.maxhp) { //missing hp
            context.fillStyle = "#000"; //missing hp color
            context.beginPath();
            context.moveTo(0, 0);
            context.arc(0, 0, Math.floor(Math.min(tilew, tileh) * 0.16), Math.PI * 2 * (this.hp / this.maxhp), Math.PI * 2, false);
            context.fill();
        }
        if (this.shocked > upgrade_shockChance && this.shockDuration > 0) { //currently shocked
            context.beginPath();
            context.moveTo(0, 0);

            context.lineTo(3, -14); //top of lightning bolt
            context.lineTo(-7, 1.5); //down left
            context.lineTo(1, 1.5); //right horizontally
            context.lineTo(-2, 14); //down left/straight

            context.lineTo(8, -1.5); //up right
            context.lineTo(0, -1.5); //left horizontally
            context.lineTo(3, -14); //up right/straight   

            context.fillStyle = "#ffff00";

            context.fill();
            context.stroke();
        }



        context.restore();
    }
    this.update = function () {

        document.getElementById('monstersHealth').innerHTML = toExponentialFixaroo((this.maxhp).toFixed(0)); //mob hp indicator

        if (this.hp <= 0) {

            gold += Math.floor(Math.pow(1.755, this.lvl));
            score += Math.floor(Math.pow(1.00, this.lvl));

            monstersLeft--;
            totalKilled++;
            updateUI();
            return false;
        }

        var speed = (this.slowDuration-- > 0 ? 0.05 : 0.1); //mob speed
        if (this.slowDuration < 0) this.slowDuration = 0;

        var prevSpeed = speed;
        if (this.shocked > upgrade_shockChance && this.shockDuration > 0) {
            this.shockDuration--;
            speed = 0;
        }
        else
            speed = prevSpeed;

        var pre = Math.floor(this.index);
        this.index += speed;
        if (this.index >= 1) {
            if (directions[this.xbase][this.ybase].from != 1) {
                var xi = this.xbase;
                var yi = this.ybase;
                this.xbase = directions[xi][yi].from.loc.x;
                this.ybase = directions[xi][yi].from.loc.y;
            }
            this.index = 0;
        }
        if (this.xbase >= size || this.ybase >= size) {
            playerHealth--;
            updateUI();
            return false;
        }
        var a = directions[this.xbase][this.ybase].loc;
        var b = directions[this.xbase][this.ybase].from.loc;
        if (b == null || a == null) return true;

        this.x = a.x * (1 - this.index) + b.x * this.index;
        this.y = a.y * (1 - this.index) + b.y * this.index;

        return true;
    }
}

function draw() {

    if (!gameStarted)
        return;


    if (playerHealth <= 0) {
        document.getElementById('popupScreen').setAttribute("style", "visibility: visible");
        document.getElementById('popupScreen').setAttribute("style", "-webkit-animation: fadein 1s");

        document.getElementById('popup').innerHTML = ("DEFEAT!");
        return;
    }

    if (victory) {
        document.getElementById('popupScreen').setAttribute("style", "visibility: visible");
        document.getElementById('popupScreen').setAttribute("style", "-webkit-animation: fadein 1s");

        document.getElementById("popup").innerHTML = ("VICTORY!");
        return;
    }
    if (level >= difficultySelection * 5 + 1) {
        victory = true;
    }

    if (paused)  //this pauses the program until the resume button is pressed
        return;

    requestAnimFrame(draw);

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.globalAlpha = 1;

    if (counter < 1)
        paintPath();




    switch (mapSelection) { //path color
        case 1: context.fillStyle = "#e0c786"; //grass map -> brown/dirt path
            break;
        case 2: context.fillStyle = "#3a3734"; //lava map -> blackish/brown path
            break;
        case 3: context.fillStyle = "#e4dfac"; //beach map -> beige/sand path

    }

    for (var i = 1; i < path.length; i++) {
        var a = path[i];
        context.fillRect(a.x * tilew + a.x, a.y * tileh + a.y, tilew, tileh);
    }

    if (ctower) {
        context.fillStyle = "#29FF37"; //color of tile when you press a tower and then hover a tile
        context.fillRect(ingameXsel * tilew + ingameXsel, ingameYsel * tileh + ingameYsel, tilew, tileh);
    }


    switch (mapSelection) { //start / end color
        case 1: context.fillStyle = "#e0c786"; //dirt brown 
            break;
        case 2: context.fillStyle = "#3a3734"; //volcano rock black/brown
            break;
        case 3: context.fillStyle = "#e4dfac"; //sand yellow biege
            break;
    }


    context.fillRect(path[0].x * tilew + path[0].x, path[0].y * tileh + path[0].y, tilew, tileh);

    var startX = path[0].x;
    var startY = path[0].y;

    context.lineWidth = 2;
    context.strokeStyle = "#111";

    if (mapSelection == 1) {
        context.lineTo(startX * tilew + startX + 20, startY * tileh + startY + 10);
        context.lineTo(startX * tilew + startX + 10, startY * tileh + startY + 20);
        context.lineTo(startX * tilew + startX + 20, startY * tileh + startY + 30);
        context.moveTo(startX * tilew + startX + 10, startY * tileh + startY + 20);
        context.lineTo(startX * tilew + startX + 35, startY * tileh + startY + 20);
    }

    else if (mapSelection == 2) {
        context.strokeStyle = "#FFF";
        context.lineTo(startX * tilew + startX + 10, startY * tileh + startY + 20);
        context.lineTo(startX * tilew + startX + 20, startY * tileh + startY + 10);
        context.lineTo(startX * tilew + startX + 30, startY * tileh + startY + 20);
        context.moveTo(startX * tilew + startX + 20, startY * tileh + startY + 10);
        context.lineTo(startX * tilew + startX + 20, startY * tileh + startY + 33);
    }
    else {
        context.lineTo(startX * tilew + startX + 20, startY * tileh + startY + 10);
        context.lineTo(startX * tilew + startX + 30, startY * tileh + startY + 20);
        context.lineTo(startX * tilew + startX + 20, startY * tileh + startY + 30);
        context.moveTo(startX * tilew + startX + 8, startY * tileh + startY + 20);
        context.lineTo(startX * tilew + startX + 30, startY * tileh + startY + 20);
    }

    context.stroke();
    context.restore();

    //---
    context.beginPath();
    context.strokeStyle = "#555"; //grid lines between tiles
    context.lineWidth = 2;

    for (var i = 0; i < 21; i++) {
        context.moveTo(i * tilew + i, 0);
        context.lineTo(i * tilew + i, canvas.height);
    }

    for (var i = 0; i < 21; i++) {
        context.moveTo(0, i * tilew + i);
        context.lineTo(canvas.width, i * tilew + i);
    }
    context.stroke();
    context.beginPath();

    context.lineWidth = 1;

    for (var i = 0; i < towers.length; i++) {
        towers[i].draw();
    }
    for (var i = 0; i < mobs.length; i++) {
        mobs[i].draw();
        if (!mobs[i].update()) {
            mobs.splice(i, 1); // remove this element
        }
        if (mobs.length == 0) {
            waveDelay = 150;
            level++;
            updateHighestLevel(level);
            updateUI();
        }

    }
    for (var i = 0; i < towers.length; i++) {
        towers[i].attack();
    }

    for (var i = 0; i < flakes.length; i++) {
        if (!flakes[i].update()) {
            flakes.splice(i, 1);
        } else flakes[i].draw();
    }

    if (waveSize == 0) {
        if (waveDelay-- <= 0) {
            updateUI();
            waveDelay = DEFAULT_WAVE_DELAY;
            waveSize = Math.floor(level / 2) + 10 + CHEAT_MOBAMOUNT;
            waveSize = (Math.floor(Math.pow((level + 7), 2.3) / 100) + 5 + Math.floor(level / 3));
            //console.log(level + ": " + waveSize);
            document.getElementById('monstersLeft').innerHTML = waveSize;
        }
    }
    if (waveSize > 0 && mobDelay-- <= 0) {
        mobDelay = 6;
        waveSize--;
        var randnum = Math.floor(Math.random() * 3);
        switch (randnum) {
            case 0: mobs[mobs.length] = new mob(level);
                break;
            case 1: mobs[mobs.length] = new mob2(level);
                break;
            case 2: mobs[mobs.length] = new mob3(level);
        }
    }
}

function mouseDown(e) {
    if (playerHealth <= 0) return;
    if (!gameStarted) return;
    var mouseX, mouseY;

    if (e.offsetX) {
        mouseX = e.offsetX;
        mouseY = e.offsetY;
    }
    else if (e.layerX) {
        mouseX = e.layerX;
        mouseY = e.layerY;
    }


    var foundOne = false;
    for (var i = 0; i < towers.length; i++) {
        if (towers[i].x == ingameXsel && towers[i].y == ingameYsel) { //tower selected
            towers[i].sel = true;
            updateUI();
            foundOne = true;
            ctower = false;

            document.getElementById('enemyInfo').setAttribute("style", "visibility:hidden");
            document.getElementById('laserTowerInfo').setAttribute("style", "visibility:hidden");
            document.getElementById('shockTowerInfo').setAttribute("style", "visibility:hidden");
            document.getElementById('slowTowerInfo').setAttribute("style", "visibility:hidden");

            switch (towers[i].id) {
                case 1: document.getElementById('laserTowerInfo').setAttribute("style", "visibility:visible");
                    break;
                case 2: document.getElementById('shockTowerInfo').setAttribute("style", "visibility:visible");
                    break;
                case 3: document.getElementById('slowTowerInfo').setAttribute("style", "visibility:visible");
                    break;
            }


        } else {
            towers[i].sel = false;
        }
    }
    if (!foundOne && ctower) { //tower placed
        if ((e.button == 2) || (obst[ingameXsel][ingameYsel] == false)) { // "nevermind, cancel tower selection" feature OR tower placement on top of path
            ctower = false;
            return false;
        }

        else {
            switch (towerType) {
                case 1: if (towerCosts[0] <= gold) {
                    towers[towers.length] = new laserTower(ingameXsel, ingameYsel);
                    gold -= towerCosts[0];
                    ctower = false;
                }
                    break;
                case 2: if (towerCosts[1] <= gold) {
                    towers[towers.length] = new shockTower(ingameXsel, ingameYsel);
                    gold -= towerCosts[1];
                    ctower = false;
                }
                    break;
                case 3: if (towerCosts[2] <= gold) {
                    towers[towers.length] = new slowTower(ingameXsel, ingameYsel);
                    gold -= towerCosts[2];
                    ctower = false;
                }

            }
        }

        if (e.button == 1)
            ctower = true;

        if (!genPath()) {
            towers.splice(towers.length - 1, 1);
            gold += towerCosts[towerType - 1];
            ctower = true;
            genPath();
        }

        updateUI();
    }
    else if (!foundOne) {
        document.getElementById('enemyInfo').setAttribute("style", "visibility:visible");
        document.getElementById('laserTowerInfo').setAttribute("style", "visibility:hidden");
        document.getElementById('shockTowerInfo').setAttribute("style", "visibility:hidden");
        document.getElementById('slowTowerInfo').setAttribute("style", "visibility:hidden");
        updateUI();
    }

    return false;
}

function mouseMove(e) {
    var mouseX, mouseY;

    if (e.offsetX) {
        mouseX = e.offsetX;
        mouseY = e.offsetY;
    }
    else if (e.layerX) {
        mouseX = e.layerX;
        mouseY = e.layerY;
    }

    ingameXsel = Math.floor((mouseX - Math.floor(mouseX / tilew)) / tilew);
    ingameYsel = Math.floor((mouseY - Math.floor(mouseY / tileh)) / tileh);
}

document.onkeydown = function (keyPress) {

    if (!gameStarted) return;

    var key = keyPress.which;

    if (key == 85) // 'u' 
        upgrade();

    if (key == 83) // 's'
        sell();

    if (key == 82) // 'r'
        restart();

    if (key == 32) // space bar
        togglePause();

    else if (key == 49 && gold >= towerCosts[0]) {  // 1
        ctower = true;
        towerType = 1;
    }

    else if (key == 50 && gold >= towerCosts[1]) { // 2
        ctower = true;
        towerType = 2;
    }

    else if (key == 51 && gold >= towerCosts[2]) { // 3
        ctower = true;
        towerType = 3;
    }

}

function Point(x, y) {
    this.x = x;
    this.y = y;
    this.equals = function (point) {
        if (point == null) return false;
        else return point.x == this.x && point.y == this.y;
    }
}

function VisPoint(x, y) {
    this.from = null;
    this.loc = new Point(x, y);
}

function sell() {
    for (var i = 0; i < towers.length; i++) {
        if (towers[i].sel) {

            gold += towers[i].getSellValue();

            towers.splice(i, 1);
            genPath();
            updateUI();
            break;
        }
    }
}

function upgrade() {
    for (var i = 0; i < towers.length; i++) {
        if (!towers[i].sel)
            continue;

        if (gold >= towers[i].getUpgradeCost()) {
            gold -= towers[i].getUpgradeCost();
            towers[i].lvl++;
            updateUI();
        }
    }
}

function restart() {


    if (!confirm("Are you sure you want to restart?")) return;

    document.getElementById('popupScreen').setAttribute("style", "visibility: hidden");

    towers = new Array();
    mobs = new Array();
    flakes = new Array();
    ctower = false;

    waveSize = 0;
    mobDelay = 0;
    waveDelay = 300;
    level = 1;
    playerHealth = 50;
    gold = 500;
    victory = false;


    document.getElementById('tower1bt').value = numberFormat(towerCosts[0]);
    document.getElementById('tower2bt').value = numberFormat(towerCosts[1]);
    document.getElementById('tower3bt').value = numberFormat(towerCosts[2]);



    //groundColorArray = randomizedGroundColor();
    oceanColorArray = randomizedOceanColor();
    lavaColorArray = randomizedLavaColor();

    configureDifficultySettings();
    updateUI();
    setupPath();
    genPath();
    forceUnpause();
}

function updateUI() {
    document.getElementById('upgradebutton').disabled = true;
    document.getElementById('sellbutton').disabled = true;
    document.getElementById('upgradebutton').value = "Upgrade";
    document.getElementById('sellbutton').value = "Sell";

    if (playerHealth > 0) {
        for (var i = 0; i < towers.length; i++) {
            if (towers[i].sel) {
                if (towers[i].getUpgradeCost() > 0) {
                    document.getElementById('upgradebutton').value = "Upgrade (" + toExponentialFixaroo(towers[i].getUpgradeCost()) + ")";
                    if (gold >= towers[i].getUpgradeCost())
                        document.getElementById('upgradebutton').disabled = false;

                }
                document.getElementById('sellbutton').value = "Sell (" + toExponentialFixaroo(towers[i].getSellValue()) + ")";
                document.getElementById('sellbutton').disabled = false;
                break;
            }
        }
    }
    if (gold >= towerCosts[0] && playerHealth > 0)
        document.getElementById('tower1bt').disabled = false;
    else
        document.getElementById('tower1bt').disabled = true;


    if (gold >= towerCosts[1] && playerHealth > 0)
        document.getElementById('tower2bt').disabled = false;
    else
        document.getElementById('tower2bt').disabled = true;


    if (gold >= towerCosts[2] && playerHealth > 0)
        document.getElementById('tower3bt').disabled = false;
    else
        document.getElementById('tower3bt').disabled = true;

    document.getElementById('hp').innerHTML = playerHealth; //hp value 
    document.getElementById('goldAmount').innerHTML = toExponentialFixaroo(gold); //gold amount value

    document.getElementById('totalKilled').innerHTML = totalKilled; //total killed value

    document.getElementById('scoreTotal').innerHTML = toExponentialFixaroo(score); //total score value
    document.getElementById('Wave#').innerHTML = level - 1 + " of " + totalWaves; //wave # value

    if (playerHealth <= 0) {
        document.getElementById("pageTitle").innerHTML = "GAME OVER";
        //document.getElementById("losetext").setAttribute("style", "visibility:visible;opacity:1");
    } else {
        //document.getElementById("losetext").setAttribute("style", "visibility:hidden;opacity:0");
    }
}

function updateHighestLevel(level) {
    if (level > highestLevel)
        highestLevel = level;
}

function toExponentialFixaroo(val) {

    if (val < 99999)
        return val;
    else
        return Number.parseFloat(val).toExponential(2);

}

function numberFormat(val) {
    st = '' + val;

    var regx = /^([0-9]+)([0-9]{3})/;
    while (regx.test(st)) {
        st = st.replace(regx, '$1,$2');
    }
    return st;
}

function togglePause() {

    if (!paused) {
        paused = true;
        document.getElementById('pausedNotif').setAttribute("style", "visibility: visible");
        document.getElementById('enemyInfo').setAttribute("style", "visibility:hidden");
        document.getElementById('laserTowerInfo').setAttribute("style", "visibility:hidden");
        document.getElementById('shockTowerInfo').setAttribute("style", "visibility:hidden");
        document.getElementById('slowTowerInfo').setAttribute("style", "visibility:hidden");
        document.getElementById('pausebutton').value = "Resume";
    }

    else if (paused) {
        document.getElementById('pausedNotif').setAttribute("style", "visibility: hidden");
        document.getElementById('enemyInfo').setAttribute("style", "visibility:visible");
        document.getElementById('pausebutton').value = "Pause";

        requestAnimFrame(draw);
        paused = false;
    }

}

function forceUnpause() {
    document.getElementById('pausedNotif').setAttribute("style", "visibility: hidden");
    document.getElementById('enemyInfo').setAttribute("style", "visibility:visible");
    document.getElementById('pausebutton').value = "Pause";

    requestAnimFrame(draw);
    paused = false;
}

