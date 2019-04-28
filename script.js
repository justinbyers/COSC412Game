var canvas = document.getElementById('canvas');
var context = canvas.getContext("2d");
canvas.oncontextmenu = function () { return false; }

var tilew = 0.0;
var tileh = 0.0;
var towers = new Array();
var mobs = new Array();
var flakes = new Array();
var size = 10;
var towerCosts = new Array(40, 200, 1000); //laser, aoe, slow, wall, x
var directions;

var ctower = false;
var ingameXsel = 0;
var ingameYsel = 0;
var towerType = 1;

var DEFAULT_WAVE_DELAY = 400;
var waveSize = 0;
var mobDelay = 0;
var waveDelay = 200; //how fast the wave starts
var level = 1;
var playerHealth = 100;
var gold = 500;
var score = 0;
var groundColorArray;
var arr2;
var monstersLeft = 0;
var totalKilled = 0;

var highestLevel = -1;
var highestScore = -1;

var obst = new Array(size);

var SHOCK_DURATION = 25;

//UPGRADES
var upgrade_shockChance = 0 //100, 75, 50, 25 upgrades levels, 100 = no chance, 75 = 25% chance, 50 = 50% chance, 25 = 75% chance
var upgrade_shockRechargeSpeed = 50; //50, default charge speed, 45, 40, 35, 30, 25
var upgrade_snowParticles = 1;


var CHEAT_MOBHP = 0;
var CHEAT_MOBAMOUNT;


var slowTowerFillColor = "#4CC4C2";


requestAnimFrame = (function () {
    return function (callback, element) {
        window.setTimeout(callback, 1000 / 60);
    };
})();

onLoadUp();
requestAnimFrame(draw);


function onLoadUp() {

    // title menu code here

    if (true) { //cheat commands
        gold = Infinity;
        playerHealth = Infinity;
        waveDelay = 1;
        CHEAT_MOBHP = 9999;
        CHEAT_MOBAMOUNT = 99;
        var num = 0; //for towers, see next 3 lines of code
        towers[num++] = new shockTower(2, 2); //remove these 3 to start game w/ blank map
        towers[num++] = new slowTower(7, 4); //used for quickly testing tower .lineTo() drawings
        towers[num++] = new laserTower(3, 3);

    }

    tilew = Math.floor((canvas.width - size) / size);
    tileh = Math.floor((canvas.width - size) / size);

    document.getElementById('tower1bt').value = "Laser tower (" + numberFormat(towerCosts[0]) + ")";
    document.getElementById('tower2bt').value = "Shock tower (" + numberFormat(towerCosts[1]) + ")";
    document.getElementById('tower3bt').value = "Ice tower (" + numberFormat(towerCosts[2]) + ")";

    groundColorArray = randomizedGroundColor();

    updateUI();
    setupPath();
    genPath();
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

    // path = new Array(new Point(0, 1),
    //     new Point(1, 1), new Point(2, 1),
    //     new Point(2, 2), new Point(2, 3),
    //     new Point(2, 4), new Point(2, 5),
    //     new Point(3, 5), new Point(4, 5),
    //     new Point(5, 5), new Point(5, 6),
    //     new Point(5, 7), new Point(5, 8),
    //     new Point(5, 9)); //used to paint path on 

    path = new Array(new Point(9, 4),
        new Point(8, 4), new Point(8, 3), new Point(7, 3),
        new Point(6, 3), new Point(6, 2), new Point(5, 2),
        new Point(4, 2), new Point(4, 1), new Point(3, 1),
        new Point(2, 1), new Point(1, 1), new Point(1, 2),
        new Point(1, 3), new Point(1, 4), new Point(2, 4),
        new Point(2, 5), new Point(2, 6), new Point(3, 6),
        new Point(3, 7), new Point(3, 8), new Point(4, 8),
        new Point(4, 9)
    );





    //PATH 1 DIRECTIONS:
    // directions[0][1].from = new VisPoint(1, 1);
    // directions[1][1].from = new VisPoint(2, 1);
    // directions[2][1].from = new VisPoint(2, 2);
    // directions[2][2].from = new VisPoint(2, 3);
    // directions[2][3].from = new VisPoint(2, 4);
    // directions[2][4].from = new VisPoint(2, 5);
    // directions[2][5].from = new VisPoint(3, 5);
    // directions[3][5].from = new VisPoint(4, 5);
    // directions[4][5].from = new VisPoint(5, 5);
    // directions[5][5].from = new VisPoint(5, 6);
    // directions[5][6].from = new VisPoint(5, 7);
    // directions[5][7].from = new VisPoint(5, 8);
    // directions[5][8].from = new VisPoint(5, 9);
    // directions[5][9].from = new VisPoint(5, 10);

    //PATH 2 DIRECTIONS:
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
        return towerCosts[0] + Math.floor(Math.pow(1.9, this.lvl) * 60);
    }
    this.getSellValue = function () {
        return towerCosts[0] / 2 + Math.floor((Math.pow(1.9, this.lvl - 1) - 1) * 60);
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
            document.getElementById('laserTowerDamage').innerHTML = this.dmg();
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
        return (Math.pow(1.93, this.lvl) * 40).toFixed(0);

    }

    this.getXCenter = function () {
        return this.x * tilew + this.x + tilew / 2 + 0.5;
    }
    this.getYCenter = function () {
        return this.y * tileh + this.y + tileh / 2 + 0.5;
    }

    this.getUpgradeCost = function () {
        return towerCosts[1] + Math.floor(Math.pow(2.7, this.lvl) * 80);
    }
    this.getSellValue = function () {
        return towerCosts[1] / 2 + Math.floor((Math.pow(2.7, this.lvl - 1) - 1) * 80);
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
            document.getElementById('shockTowerDamage').innerHTML = this.dmg();
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
        return towerCosts[2] + Math.pow(8, this.lvl) * 100;
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

    this.genTexture = function () {

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

function mob(level) {
    this.lvl = level;
    this.hp = Math.pow(1.20, this.lvl - 1) * 5.5 + 50 + 15 * this.lvl + CHEAT_MOBHP;
    this.maxhp = this.hp;

    this.slowDuration = 0;
    this.shockDuration = SHOCK_DURATION;
    this.shocked = 0;

    this.index = 0;
    this.x = path[0].x;
    this.y = path[0].y;

    this.xoffset = Math.floor((2 * Math.random() - 1) * 0.6 * (tilew / 2));
    this.yoffset = Math.floor((2 * Math.random() - 1) * 0.6 * (tileh / 2));

    this.xbase = this.x;
    this.ybase = this.y;


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
        if (this.hp <= 0) {
            gold += Math.floor(Math.pow(2.175, this.lvl)) + 1; //GOLD CONTROL
            score += Math.floor(Math.pow(1.18, this.lvl)) + 0; //SCORE CONTROL
            monstersLeft--;
            totalKilled++;
            updateUI();
            return false;
        }

        var speed = (this.slowDuration-- > 0 ? 0.02 : 0.05);
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

//SHIT LAGGY I THINK
function paintPath() {
    context.globalAlpha = 1;
    var tile = 0;

    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            context.fillStyle = groundColorArray[tile++];
            context.fillRect(i * tilew + i, j * tileh + j, size * size, size * size);
        }
    }
    context.beginPath();
    context.stroke();
}


function randomizedGroundColor() {

    groundColorArray = new Array();

    for (var i = 0; i < 100; i++) { //should be size*size if 1 color per tile, otherwise 1200 if 9 colors per tile

        var num = Math.floor(Math.random() * 5);
        var color = "#FFFFFF"; //if you're seeing white tiles then something's fucked

        switch (num) { //feel free to change these #hex codes to whatever. or add more
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
var counter = 0;

function draw() {
    requestAnimFrame(draw);
    if (playerHealth <= 0) return;
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.globalAlpha = 1;

    if (counter < 1)
        paintPath();

    context.fillStyle = "#83644a"; //PATH COLOR
    for (var i = 1; i < path.length; i++) {
        var a = path[i];
        context.fillRect(a.x * tilew + a.x, a.y * tileh + a.y, tilew, tileh);
    }

    if (ctower) {
        context.fillStyle = "#29FF37"; //color of tile when you press a tower and then hover a tile
        context.fillRect(ingameXsel * tilew + ingameXsel, ingameYsel * tileh + ingameYsel, tilew, tileh);
    }
    context.fillStyle = "#83644a"; //start/end color
    context.fillRect(path[0].x * tilew + path[0].x, path[0].y * tileh + path[0].y, tilew, tileh);

    var startX = path[0].x;
    var startY = path[0].y;

    context.lineWidth = 1;

    context.strokeStyle = "#111111"; //starting point arrow
    context.lineTo(startX * tilew + startX + 20, startY * tileh + startY + 10);
    context.lineTo(startX * tilew + startX + 10, startY * tileh + startY + 20);
    context.lineTo(startX * tilew + startX + 20, startY * tileh + startY + 30);

    context.moveTo(startX * tilew + startX + 10, startY * tileh + startY + 20);
    context.lineTo(startX * tilew + startX + 35, startY * tileh + startY + 20);

    context.stroke();

    context.strokeStyle = "#111111"; //grid lines between tiles
    context.lineWidth = 1;
    //context.beginPath();
    for (var i = 0; i < 21; i++) {
        context.moveTo(i * tilew + i, 0);
        context.lineTo(i * tilew + i, canvas.height);
    }

    for (var i = 0; i < 21; i++) {
        context.moveTo(0, i * tilew + i);
        context.lineTo(canvas.width, i * tilew + i);
    }
    context.stroke();


    for (var i = 0; i < towers.length; i++) {
        towers[i].draw();
    }
    for (var i = 0; i < mobs.length; i++) {
        mobs[i].draw();
        if (!mobs[i].update()) {
            mobs.splice(i, 1); // remove this element
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
            level++;
            updateUI();
            updateHighestLevel(level);
            waveDelay = DEFAULT_WAVE_DELAY;
            waveSize = Math.floor(level / 2) + 2 + CHEAT_MOBAMOUNT;
            document.getElementById('monstersLeft').innerHTML = waveSize;
        }
    }
    if (waveSize > 0 && mobDelay-- <= 0) {
        mobDelay = 6;
        waveSize--;
        mobs[mobs.length] = new mob(level);
    }
}


function mouseDown(e) {
    if (playerHealth <= 0) return;

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
            
            document.getElementById('waveInfo').setAttribute("style", "visibility:hidden");
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
        document.getElementById('waveInfo').setAttribute("style", "visibility:visible");
        document.getElementById('laserTowerInfo').setAttribute("style", "visibility:hidden");
        document.getElementById('shockTowerInfo').setAttribute("style", "visibility:hidden");
        document.getElementById('slowTowerInfo').setAttribute("style", "visibility:hidden");
        updateUI();
    }

    return false;
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

function updateUI() {
    document.getElementById('upgradebutton').disabled = true;
    document.getElementById('sellbutton').disabled = true;
    document.getElementById('upgradebutton').value = "Upgrade";
    document.getElementById('sellbutton').value = "Sell";

    if (playerHealth > 0) {
        for (var i = 0; i < towers.length; i++) {
            if (towers[i].sel) {
                if (towers[i].getUpgradeCost() > 0) {
                    document.getElementById('upgradebutton').value = "Upgrade (" + numberFormat(towers[i].getUpgradeCost()) + ")";
                    if (gold >= towers[i].getUpgradeCost())
                        document.getElementById('upgradebutton').disabled = false;

                }
                document.getElementById('sellbutton').value = "Sell (" + numberFormat(towers[i].getSellValue()) + ")";
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
    document.getElementById('Wave#').innerHTML = level - 1; //wave # value
    document.getElementById('goldAmount').innerHTML = numberFormat(gold); //gold amount value
    document.getElementById('scoreTotal').innerHTML = score; //total score value

    document.getElementById('totalKilled').innerHTML = totalKilled; //total killed value

    if (playerHealth <= 0) {
        document.getElementById("pageTitle").innerHTML = "GAME OVER";
        //document.getElementById("losetext").setAttribute("style", "visibility:visible;opacity:1");
    } else {
        //document.getElementById("losetext").setAttribute("style", "visibility:hidden;opacity:0");
    }
}

function restart() {
    if (!confirm("Are you sure you want to restart?")) return;
    towers = new Array();
    mobs = new Array();
    flakes = new Array();
    ctower = false;

    waveSize = 0;
    mobDelay = 0;
    waveDelay = DEFAULT_WAVE_DELAY;
    level = 1;
    playerHealth = 50;
    gold = 500;
    updateUI();
    genPath();
}

function numberFormat(val) {
    st = '' + val;

    var regx = /^([0-9]+)([0-9]{3})/;
    while (regx.test(st)) {
        st = st.replace(regx, '$1,$2');
    }
    return st;
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


function genPath() {

    for (var i = 0; i < size; i++)
        obst[i] = new Array(size);

    for (var i = 0; i < path.length; i++) {
        obst[path[i].x][path[i].y] = false;
    }

    for (var i = 0; i < towers.length; i++) {


        obst[towers[i].x][towers[i].y] = true;
    }
    return (path != -1);
}

document.onkeydown = function (keyPress) {
    var key = keyPress.which;

    if (key == 85) // 'u' 
        upgrade();

    if (key == 83) // 's'
        sell();

    if (key == 82) // 'r'
        restart();

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

function updateHighestLevel(level) {
    if (level > highestLevel)
        highestLevel = level;
}

//test functions below
function test() { //show tower info
    document.getElementById('a').setAttribute("style", "visibility:hidden");
    document.getElementById('aa').setAttribute("style", "visibility:visible");
    //document.getElementById("losetext").setAttribute("style", "visibility:visible;opacity:1");

}
function testt() { //show mob info

    document.getElementById('a').setAttribute("style", "visibility:visible");
    document.getElementById('aa').setAttribute("style", "visibility:hidden");
}
function testtt() {
    console.log("c");
    var dataURL = localStorage.getItem(canvas);
    var img = new Image;
    img.src = dataURL;
    img.onload = function () {
        context.drawImage(img, 0, 0);
    }
}
function test4() {
    // var arrsize = arr.length;
    // for(var i = 0; i < arrsize; i++){
    //     arr[i] = "#999999";
    // }

    for (var i = 0; i < towerCosts.length; i++) {
        console.log(towerCosts[i]);
    }
    console.log((gold >= towerCosts[0] && playerHealth > 0))
}
