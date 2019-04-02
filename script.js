var canvas = document.getElementById('canvas');
var context = canvas.getContext("2d");
canvas.oncontextmenu = function () { return false; }

var tilew = 0.0;
var tileh = 0.0;
var towers = new Array();
var mobs = new Array();
var flakes = new Array();
var size = 10;
var towerCosts = new Array(40, 200, 1000, 10, 10); //laser, aoe, slow, wall, x
var directions;

var ctower = false;
var ingameXsel = 0;
var ingameYsel = 0;
var towerType = 1;

var waveSize = 0;
var mobDelay = 0;
var waveDelay = 100;
var level = 1;
var playerHealth = 100000;
var gold = Infinity;
var arr;
var arr2;


requestAnimFrame = (function () {
    return function (callback, element) {
        window.setTimeout(callback, 1000 / 60);
    };
})();

onLoadUp();
requestAnimFrame(draw);


function onLoadUp() {
    tilew = Math.floor((canvas.width - size) / size);
    tileh = Math.floor((canvas.width - size) / size);

    updateUI();

    document.getElementById('cTower1Bt').value = "Place laser tower (" + numberFormat(towerCosts[0]) + ")";
    document.getElementById('cTower2Bt').value = "Place AOE tower (" + numberFormat(towerCosts[1]) + ")";
    document.getElementById('cTower3Bt').value = "Place slow tower (" + numberFormat(towerCosts[2]) + ")";
    document.getElementById('cTower4Bt').value = "Place wall (" + numberFormat(towerCosts[3]) + ")";

    arr = randomizedGroundColor();

    setupPath();
    genPath();

    // path = new Array(new Point(0, 1),
    //     new Point(1, 1), new Point(2, 1),
    //     new Point(2, 2), new Point(2, 3),
    //     new Point(2, 4), new Point(2, 5),
    //     new Point(3, 5), new Point(4, 5),
    //     new Point(5, 5), new Point(5, 6),
    //     new Point(5, 7), new Point(5, 8),
    //     new Point(5, 9));

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
        context.rotate(Math.PI * 2 * this.life);
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

function wallTower(x, y) {
    this.sel = false;

    this.x = x;
    this.y = y;
    this.getXCenter = function () {
        return this.x * tilew + this.x + tilew / 2 + 0.5;
    }
    this.getYCenter = function () {
        return this.y * tileh + this.y + tileh / 2 + 0.5;
    }
    this.attack = function () { }

    this.getUpgradeCost = function () {
        return 0;
    }
    this.getSellValue = function () {
        return 0;
    }

    this.draw = function () {
        context.save();
        context.translate(Math.floor(this.getXCenter()), Math.floor(this.getYCenter()));
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
        }
        context.fillStyle = "#D04532";
        context.strokeStyle = "#A62727";

        context.lineWidth = 2;
        context.fillRect(-0.4 * tilew, -0.4 * tileh, 0.8 * tilew, 0.8 * tileh);
        context.strokeRect(-0.4 * tilew, -0.4 * tileh, 0.8 * tilew, 0.8 * tileh);

        context.strokeStyle = "#A6807A";
        context.beginPath();
        for (var i = 1; i < 5; i++) {
            context.moveTo(-0.4 * tilew, -0.4 * tileh + i * (0.8 * tileh) / 5);
            context.lineTo(0.4 * tilew, -0.4 * tileh + i * (0.8 * tileh) / 5);
        }
        for (var i = 0; i < 5; i++) {
            for (var j = 1 - i % 2; j < 3; j++) {
                context.moveTo(-0.4 * tilew + (j + (i % 2) * 0.5) * (0.8 * tilew) / 3, -0.4 * tileh + i * (0.8 * tileh) / 5);
                context.lineTo(-0.4 * tilew + (j + (i % 2) * 0.5) * (0.8 * tilew) / 3, -0.4 * tileh + (i + 1) * (0.8 * tileh) / 5);
            }
        }
        context.stroke();

        context.restore();
    }
}

function slowTower(x, y) {
    this.lvl = 1;
    this.range = 2.3;
    this.sel = false;
    this.anim = 0;
    this.recharge = 13;
    this.charge = this.recharge;

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
        context.translate(Math.floor(this.getXCenter()), Math.floor(this.getYCenter()));

        this.anim = (this.anim + 1.8) % 360;
        context.save();
        context.rotate(Math.PI * this.anim / 180);

        context.beginPath();
        context.moveTo(-0.1 * tilew / 2, -0.1 * tileh / 2);
        context.lineTo(-0.1 * tilew / 2, -0.5 * tileh / 2);
        context.lineTo(-0.2 * tilew / 2, -0.6 * tileh / 2);
        context.lineTo(-0.2 * tilew / 2, -0.7 * tileh / 2);
        context.lineTo(0, -0.8 * tileh / 2);
        context.lineTo(0.2 * tilew / 2, -0.7 * tileh / 2);
        context.lineTo(0.2 * tilew / 2, -0.6 * tileh / 2);
        context.lineTo(0.1 * tilew / 2, -0.5 * tileh / 2);
        context.lineTo(0.1 * tilew / 2, -0.1 * tileh / 2);
        for (var i = 0; i < 5; i++) {
            context.rotate(Math.PI / 3);
            context.lineTo(-0.1 * tilew / 2, -0.1 * tileh / 2);
            context.lineTo(-0.1 * tilew / 2, -0.5 * tileh / 2);
            context.lineTo(-0.2 * tilew / 2, -0.6 * tileh / 2);
            context.lineTo(-0.2 * tilew / 2, -0.7 * tileh / 2);
            context.lineTo(0, -0.8 * tileh / 2);
            context.lineTo(0.2 * tilew / 2, -0.7 * tileh / 2);
            context.lineTo(0.2 * tilew / 2, -0.6 * tileh / 2);
            context.lineTo(0.1 * tilew / 2, -0.5 * tileh / 2);
            context.lineTo(0.1 * tilew / 2, -0.1 * tileh / 2);
        }
        context.closePath();
        context.fillStyle = "#86F5FF";
        context.lineWidth = 2;
        context.strokeStyle = "#4CC4C2";
        context.fill();
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
        }
        context.strokeStyle = '#FFF';
        context.strokeText(this.lvl, 1 - tilew / 2, -1 + tileh / 2);
        context.fillStyle = '#000';
        context.fillText(this.lvl, 1 - tilew / 2, -1 + tileh / 2);

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

function aoeTower(x, y) {
    this.lvl = 1;
    this.cost = 10;
    this.range = 2.3;
    this.sel = false;
    this.charge = 20;
    this.anim = 0;
    this.recharge = 50;

    this.x = x;
    this.y = y;

    this.dmg = function () {
        return Math.pow(1.93, this.lvl) * 80;
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


        context.fillStyle = "#B0F";
        context.beginPath();
        context.arc(0, 0, Math.floor(Math.min(tilew, tileh) * 0.45), 0, Math.PI * 2, false);
        context.fill();
        context.lineWidth = 2;
        context.strokeStyle = "#8800B9";
        context.stroke();
        context.fillStyle = "#000";

        if (this.charge >= 0) {
            context.globalAlpha = 0.4;
            context.fillStyle = "#FFF";
            context.beginPath();
            context.arc(0, 0, Math.floor(Math.min(tilew, tileh) * 0.45 * (this.charge / this.recharge)), 0, Math.PI * 2, false);
            context.fill();
            context.globalAlpha = 1;
        } else {
            context.globalAlpha = 0.2 * (1 - (Math.abs(this.charge) / 20));
            context.fillStyle = "#000";
            context.beginPath();
            context.arc(0, 0, Math.floor(Math.min(tilew, tileh) * this.range), 0, Math.PI * 2, false);
            context.fill();
            context.globalAlpha = 1;
        }

        context.fillStyle = "#FFF";
        context.save();
        if (this.charge == 0) {
            this.anim = (this.anim + 1) % 360;
        }
        context.rotate(Math.PI * this.anim / 180);
        context.beginPath();
        context.moveTo(0, 0);
        context.arc(0, 0, Math.floor(Math.min(tilew, tileh) * 0.33), 0, Math.PI * 2 / 6, false);
        context.lineTo(0, 0);
        context.arc(0, 0, Math.floor(Math.min(tilew, tileh) * 0.33), Math.PI * 4 / 6, Math.PI * 6 / 6, false);
        context.lineTo(0, 0);
        context.arc(0, 0, Math.floor(Math.min(tilew, tileh) * 0.33), Math.PI * 8 / 6, Math.PI * 10 / 6, false);
        context.lineTo(0, 0);
        context.fill();
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
        }

        context.strokeStyle = '#FFF';
        context.strokeText(this.lvl, 1 - tilew / 2, -1 + tileh / 2);
        context.fillStyle = '#000';
        context.fillText(this.lvl, 1 - tilew / 2, -1 + tileh / 2);

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
                    foundOne = true;
                }
            }
            if (foundOne) {
                this.charge--;
            }
        }
    }

}

function laserTower(x, y) {
    this.lvl = 1;
    this.range = 2.3;
    this.sel = false;
    this.cost = 4;

    this.x = x;
    this.y = y;
    this.dmg = function () {
        return Math.pow(1.7, this.lvl) * 3;
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


        context.fillStyle = "#FF0000";
        context.lineWidth = 2;
        context.strokeStyle = "#880000";
        context.beginPath();
        context.moveTo(-0.40 * tilew, 0.42 * tileh);
        context.lineTo(-0.15 * tilew, 0.2 * tileh);
        context.lineTo(0, -0.2 * tileh);
        context.lineTo(0.15 * tilew, 0.2 * tileh);
        context.lineTo(0.4 * tilew, 0.42 * tileh);
        context.lineTo(-0.4 * tilew, 0.42 * tileh);
        context.fill();
        context.stroke();

        if (this.atk) {
            context.fillStyle = "#FF0";
            context.strokeStyle = "#D3D300";
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
        }

        context.strokeStyle = '#FFF';
        context.strokeText(this.lvl, 1 - tilew / 2, -1 + tileh / 2);
        context.fillStyle = '#000';
        context.fillText(this.lvl, 1 - tilew / 2, -1 + tileh / 2);
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

                context.beginPath();
                context.lineWidth = 2;
                context.moveTo(this.x * tilew + this.x + tilew / 2, this.y * tileh + this.y + tileh / 2 - 0.2 * tileh);
                context.lineTo(mobs[i].getXCenter(), mobs[i].getYCenter());
                context.strokeStyle = "#FF0";
                context.stroke();
                break;
            }
        }
    }
}


function mob(level) {
    this.lvl = level;
    this.index = 0;
    this.a = path[0];
    this.slowDuration = 0;
    this.x = this.a.x;
    this.y = this.a.y;
    this.xoffset = Math.floor((2 * Math.random() - 1) * 0.6 * (tilew / 2));
    this.yoffset = Math.floor((2 * Math.random() - 1) * 0.6 * (tileh / 2));
    this.xbase = this.x;
    this.ybase = this.y;
    this.hp = Math.pow(1.20, this.lvl - 1) * 5.5 + 50 + 15 * this.lvl;
    this.maxhp = this.hp;

    this.getXCenter = function () {
        return this.x * tilew + this.x + tilew / 2 + this.xoffset + 0.5;
    }
    this.getYCenter = function () {
        return this.y * tileh + this.y + tileh / 2 + this.yoffset + 0.5;
    }

    this.draw = function () {
        context.save();
        context.translate(Math.floor(this.getXCenter()), Math.floor(this.getYCenter()));

        context.fillStyle = "#00B615"; //monster color
        context.beginPath();
        context.arc(0, 0, Math.floor(Math.min(tilew, tileh) * 0.2), 0, Math.PI * 2, false);
        context.fill();
        if (this.hp < this.maxhp) {
            context.fillStyle = "#000"; //missing hp color
            context.beginPath();
            context.moveTo(0, 0);
            context.arc(0, 0, Math.floor(Math.min(tilew, tileh) * 0.2), Math.PI * 2 * (this.hp / this.maxhp), Math.PI * 2, false);
            context.fill();
        }

        context.restore();
    }
    this.update = function () {
        if (this.hp <= 0) {
            gold += Math.floor(Math.pow(1.175, this.lvl)) + 5;
            updateUI();
            return false;
        }

        var speed = (this.slowDuration-- > 0 ? 0.02 : 0.05);
        if (this.slowDuration < 0) this.slowDuration = 0;
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
    /* unblock this for complex 3x3 grid within each tile (uses more data)
    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {

             context.fillStyle = arr[tile++];
            // context.fillRect((i * tilew) + i, (j * tileh) + j, tilew, tileh); // bottom right of tile

            // context.fillStyle = arr[tile++];
            // context.fillRect((i * tilew) + i , (j * tileh) + j , tilew/2, tileh/2); //top left of tile

            // context.fillStyle = arr[tile++];
            //context.fillRect(tilew/2 + (i * tilew) + i , (j * tileh) + j , tilew/2, tileh/2); //top right of tile

            // context.fillStyle = arr[tile++];
            // context.fillRect((i * tilew) + i , tileh/2 + (j * tileh) + j , tilew/2, tileh/2); //bottom left of tile



            context.fillStyle = arr[tile++];
           //context.fillRect((i * tilew) + i, (j * tileh) + j, tilew, tileh); 
            context.fillStyle = arr[tile++];
            //context.fillRect((i * tilew) + i, (j * tileh) + j, tilew, tileh); 
            context.fillStyle = arr[tile++];
            context.fillRect(26 + (i * tilew + i),  (j * tileh) + j, tilew /3, tileh/3); 
            context.fillStyle = arr[tile++];
            context.fillRect(13 + (i * tilew + i),  (j * tileh) + j, tilew /3, tileh/3); 
            context.fillStyle = arr[tile++];
            context.fillRect(0 + (i * tilew + i),  (j * tileh) + j, tilew /3, tileh/3); 

            context.fillStyle = arr[tile++];
            context.fillRect(26 + (i * tilew + i),  13 + (j * tileh) + j, tilew /3, tileh/3); 
            context.fillStyle = arr[tile++];
            context.fillRect(13 + (i * tilew + i), 13 +  (j * tileh) + j, tilew /3, tileh/3); 
            context.fillStyle = arr[tile++];
            context.fillRect(0 + (i * tilew + i), 13 + (j * tileh) + j, tilew /3, tileh/3); 

            context.fillStyle = arr[tile++];
            context.fillRect(26 + (i * tilew + i),  26 + (j * tileh) + j, tilew /3, tileh/3); 
            context.fillStyle = arr[tile++];
            context.fillRect(13 + (i * tilew + i), 26 +  (j * tileh) + j, tilew /3, tileh/3); 
            context.fillStyle = arr[tile++];
            context.fillRect(0 + (i * tilew + i), 26 + (j * tileh) + j, tilew /3, tileh/3); 






        }
    }
    */
    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            context.fillStyle = arr[tile++];
            context.fillRect(i * tilew + i, j * tileh + j, size * size, size * size);
        }

    }
    context.beginPath();
    context.stroke();
}


function randomizedGroundColor() {

    arr = new Array();

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
        arr[i] = color;
    }

    return arr;
}
var counter = 0;
function draw() {
    requestAnimFrame(draw);
    if (playerHealth <= 0) return;
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.globalAlpha = 1;

    //context.
    if (counter < 1)
        paintPath();

    context.fillStyle = "#ad8461"; //PATH COLOR
    for (var i = 1; i < path.length; i++) {
        var a = path[i];
        context.fillRect(a.x * tilew + a.x, a.y * tileh + a.y, tilew, tileh);
    }

    if (ctower) {
        context.fillStyle = "#29FF37"; //color of tile when you press a tower and then hover a tile
        context.fillRect(ingameXsel * tilew + ingameXsel, ingameYsel * tileh + ingameYsel, tilew, tileh);
    }
    context.fillStyle = "#ad8461"; //start/end color
    context.fillRect(path[0].x * tilew + path[0].x, path[0].y * tileh + path[0].y, tilew, tileh);
    //context.fillRect(path[path.length - 1].x * tilew + path[path.length - 1].x, path[path.length - 1].y * tileh + path[path.length - 1].y, tilew, tileh);

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
            waveDelay = 200;
            waveSize = Math.floor(level / 2) + 2;
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
        if (towers[i].x == ingameXsel && towers[i].y == ingameYsel) {
            towers[i].sel = true;
            updateUI();
            foundOne = true;
            ctower = false;
        } else {
            towers[i].sel = false;
        }
    }
    if (!foundOne && ctower) {
        if (e.button == 2) {
            ctower = false;
            return false;
        }
        switch (towerType) {
            case 1: if (towerCosts[0] <= gold) {
                towers[towers.length] = new laserTower(ingameXsel, ingameYsel);
                gold -= towerCosts[0];
                ctower = false;
            }
                break;
            case 2: if (towerCosts[1] <= gold) {
                towers[towers.length] = new aoeTower(ingameXsel, ingameYsel);
                gold -= towerCosts[1];
                ctower = false;
            }
                break;
            case 3: if (towerCosts[2] <= gold) {
                towers[towers.length] = new slowTower(ingameXsel, ingameYsel);
                gold -= towerCosts[2];
                ctower = false;
            }
                break;
            case 4: if (towerCosts[3] <= gold) {
                towers[towers.length] = new wallTower(ingameXsel, ingameYsel);
                gold -= towerCosts[3];
                ctower = false;
            }
                break;
        }
        if (e.button == 1) ctower = true;
        if (!genPath()) {
            towers.splice(towers.length - 1, 1);
            gold += towerCosts[towerType - 1];
            ctower = true;
            genPath();
        }
        updateUI();
    }
    else if (!foundOne)
        updateUI();

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
        if (!towers[i].sel) {
            continue;
        }
        if (gold >= towers[i].getUpgradeCost()) {
            gold -= towers[i].getUpgradeCost();
            towers[i].lvl++;
            updateUI();
        } else {
            //console.log("insufficient gold");
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
                    if (gold >= towers[i].getUpgradeCost()) {
                        document.getElementById('upgradebutton').disabled = false;
                    }
                }
                document.getElementById('sellbutton').value = "Sell (" + numberFormat(towers[i].getSellValue()) + ")";
                document.getElementById('sellbutton').disabled = false;
                break;
            }
        }
    }
    if (gold >= towerCosts[0] && playerHealth > 0)
        document.getElementById('cTower1Bt').disabled = false;
    else
        document.getElementById('cTower1Bt').disabled = true;


    if (gold >= towerCosts[1] && playerHealth > 0)
        document.getElementById('cTower2Bt').disabled = false;
    else
        document.getElementById('cTower2Bt').disabled = true;


    if (gold >= towerCosts[2] && playerHealth > 0)
        document.getElementById('cTower3Bt').disabled = false;
    else
        document.getElementById('cTower3Bt').disabled = true;


    if (gold >= towerCosts[3] && playerHealth > 0)
        document.getElementById('cTower4Bt').disabled = false;
    else
        document.getElementById('cTower4Bt').disabled = true;

    if (gold >= towerCosts[4] && playerHealth > 0)
        document.getElementById('cTower5Bt').disabled = false;
    else
        document.getElementById('cTower5Bt').disabled = true;

    document.getElementById('hpindic').style.width = Math.floor(212 * Math.max(playerHealth, 0) / 10) + "px";
    document.getElementById('levelindic').innerHTML = level;
    document.getElementById('goldindic').innerHTML = numberFormat(gold);
    if (playerHealth <= 0) {
        //document.getElementById("losetext").setAttribute("style", "visibility:visible;opacity:1");
    } else {
        //document.getElementById("losetext").setAttribute("style", "visibility:hidden;opacity:0");
    }
}

function restart() {
    // if (!confirm("Are you sure you want to restart?")) return;
    towers = new Array();
    mobs = new Array();
    flakes = new Array();
    ctower = false;

    waveSize = 0;
    mobDelay = 0;
    waveDelay = 400;
    level = 1;
    playerHealth = 1000000000000000;
    gold = 100000000000000000000000000000;
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
    var obst = new Array(size);

    for (var i = 0; i < size; i++)
        obst[i] = new Array(size);

    for (var i = 0; i < towers.length; i++)
        obst[towers[i].x][towers[i].y] = true;

    return (path != -1);
}

document.onkeydown = function (keyPress) {
    var key = keyPress.which;

    if (key == 85)  // 'u' 
        upgrade();

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

    else if (key == 52 && gold >= towerCosts[3]) { // 4
        ctower = true;
        towerType = 4;
    }


}







function poisonTower(x, y) {
    this.lvl = 1;
    this.range = 2.3;
    this.sel = false;
    this.cost = 4;

    this.x = x;
    this.y = y;
    this.dmg = function () {
        return Math.pow(1.7, this.lvl) * 3;
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


        context.fillStyle = "#FF0000";
        context.lineWidth = 2;
        context.strokeStyle = "#880000";
        context.beginPath();
        context.moveTo(-0.40 * tilew, 0.42 * tileh);
        context.lineTo(-0.15 * tilew, 0.2 * tileh);
        context.lineTo(0, -0.2 * tileh);
        context.lineTo(0.15 * tilew, 0.2 * tileh);
        context.lineTo(0.4 * tilew, 0.42 * tileh);
        context.lineTo(-0.4 * tilew, 0.42 * tileh);
        context.fill();
        context.stroke();

        if (this.atk) {
            context.fillStyle = "#FF0";
            context.strokeStyle = "#D3D300";
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
        }

        context.strokeStyle = '#FFF';
        context.strokeText(this.lvl, 1 - tilew / 2, -1 + tileh / 2);
        context.fillStyle = '#000';
        context.fillText(this.lvl, 1 - tilew / 2, -1 + tileh / 2);
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

                context.beginPath();
                context.lineWidth = 2;
                context.moveTo(this.x * tilew + this.x + tilew / 2, this.y * tileh + this.y + tileh / 2 - 0.2 * tileh);
                context.lineTo(mobs[i].getXCenter(), mobs[i].getYCenter());
                context.strokeStyle = "#FF0";
                context.stroke();
                break;
            }
        }
    }
}

//test functions below
function test() {
    console.log("a");
    console.log(localStorage.length);
    console.log(localStorage.key);
}
function testt() {
    console.log("b");
    localStorage.setItem(context, canvas.toDataURL());
    context.clearRect(0, 0, 1000, 1000);
    for (var i = 0; i < 400; i++)
        arr[i] = 1;
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
function test4(){
    var arrsize = arr.length;
    for(var i = 0; i < arrsize; i++){
        arr[i] = "#999999";
    }
}
