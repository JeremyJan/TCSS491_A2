
// GameBoard code below
function TheCircles(theCircles) {
    this.circles = [];
    let theCirclesLength = theCircles.length;
    console.log(theCircles);
    console.log("entering cirles for loop");
    for (let i = 0; i < theCirclesLength; i++) {
        //create a json for circle
        /*
        x, y, visualRadius, it, doctor, veg, velocity, color
         */
        let round = {
            x: theCircles[i].x,
            y: theCircles[i].y,
            visualRadius: theCircles[i].visualRadius,
            color: theCircles[i].color,
            it: theCircles[i].it,
            doctor: theCircles[i].doctor,
            veg: theCircles[i].veg,
            velocity: theCircles[i].velocity
        };
        console.log("json stringify");
        console.log(JSON.stringify(round));
        this.circles.push(round);
    }
    console.log(this.circles);
}

TheCircles.prototype = new Entity();
TheCircles.prototype.constructor = TheCircles;

function distance(a, b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function Circle(game) {
    this.player = 1;
    this.radius = 20;
    this.visualRadius = 500;
    this.colors = ["Red", "Green", "Blue", "White"];
    this.setHealthy();
    this.it = true;
    this.doctor = false;
    this.veg = false;
    Entity.call(this, game, this.radius + Math.random() * (1200 - this.radius * 2), this.radius + Math.random() * (1200 - this.radius * 2));
    this.velocity = { x: Math.random() * 1000, y: Math.random() * 1000 };
    var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    if (speed > maxSpeed) {
        var ratio = maxSpeed / speed;
        this.velocity.x *= ratio;
        this.velocity.y *= ratio;
    }
};

Circle.prototype = new Entity();
Circle.prototype.constructor = Circle;



Circle.prototype.setInfected = function () {
    this.it = true;
    this.doctor = false;
    this.veg = false;
    this.color = 0;
    this.visualRadius = 700;
};

Circle.prototype.setHealthy = function () {
    this.it = false;
    this.veg = false;
    this.doctor = false;
    this.color = 3;
    this.visualRadius = 200;
};

Circle.prototype.setDoctor = function() {
    this.doctor = true;
    this.it = false;
    this.veg = false;
    this.color = 2;
    this.visualRadius = 700;
}

Circle.prototype.setGreen = function() {
    this.veg = true;
    this.it = false;
    this.doctor = false;
    this.color = 1;
    this.visualRadius = 700;
}

Circle.prototype.collide = function (other) {
    return distance(this, other) < this.radius + other.radius;
};

Circle.prototype.collideLeft = function () {
    return (this.x - this.radius) < 0;
};

Circle.prototype.collideRight = function () {
    return (this.x + this.radius) > 800;
};

Circle.prototype.collideTop = function () {
    return (this.y - this.radius) < 0;
};

Circle.prototype.collideBottom = function () {
    return (this.y + this.radius) > 800;
};

Circle.prototype.update = function () {
    Entity.prototype.update.call(this);
 //  console.log(this.velocity);

    this.x += this.velocity.x * this.game.clockTick;
    this.y += this.velocity.y * this.game.clockTick;

    if (this.collideLeft() || this.collideRight()) {
        this.velocity.x = -this.velocity.x * friction;
        if (this.collideLeft()) this.x = this.radius;
        if (this.collideRight()) this.x = 800 - this.radius;
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;
    }

    if (this.collideTop() || this.collideBottom()) {
        this.velocity.y = -this.velocity.y * friction;
        if (this.collideTop()) this.y = this.radius;
        if (this.collideBottom()) this.y = 800 - this.radius;
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;
    }

    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (ent !== this && this.collide(ent)) {
            var temp = { x: this.velocity.x, y: this.velocity.y };

            var dist = distance(this, ent);
            var delta = this.radius + ent.radius - dist;
            var difX = (this.x - ent.x)/dist;
            var difY = (this.y - ent.y)/dist;

            this.x += difX * delta / 2;
            this.y += difY * delta / 2;
            ent.x -= difX * delta / 2;
            ent.y -= difY * delta / 2;

            this.velocity.x = ent.velocity.x * friction;
            this.velocity.y = ent.velocity.y * friction;
            ent.velocity.x = temp.x * friction;
            ent.velocity.y = temp.y * friction;
            this.x += this.velocity.x * this.game.clockTick;
            this.y += this.velocity.y * this.game.clockTick;
            ent.x += ent.velocity.x * this.game.clockTick;
            ent.y += ent.velocity.y * this.game.clockTick;
            if (this.it) {
                if(!ent.it) ent.setInfected();
                else ent.removeFromWorld = true;
            } 
            if(this.doctor) {
                if(!ent.it) ent.setDoctor();
                else ent.removeFromWorld = true;
            } 
            if(this.veg) {
                if(!ent.it) ent.setGreen();
                else ent.removeFromWorld = true;
            } 

            
        }
        if (ent != this && this.collide({ x: ent.x, y: ent.y, radius: this.visualRadius })) {
            var dist = distance(this, ent);
            if (this.it && dist > this.radius + ent.radius + 10) {
                var difX = (ent.x - this.x)/dist;
                var difY = (ent.y - this.y)/dist;
                this.velocity.x += difX * acceleration * 2 / (dist*dist);
                this.velocity.y += difY * acceleration * 2 / (dist * dist);
                var speed = Math.sqrt(this.velocity.x*this.velocity.x + this.velocity.y*this.velocity.y);
                if (speed > maxSpeed) {
                    var ratio = maxSpeed / speed;
                    this.velocity.x *= ratio;
                    this.velocity.y *= ratio;
                }
            }
            if (ent.it && dist > this.radius + ent.radius) {
                var difX = (ent.x - this.x) / dist;
                var difY = (ent.y - this.y) / dist;
                this.velocity.x -= difX * acceleration / (dist * dist);
                this.velocity.y -= difY * acceleration / (dist * dist);
                var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
                if (speed > maxSpeed) {
                    var ratio = maxSpeed / speed;
                    this.velocity.x *= ratio;
                    this.velocity.y *= ratio;
                }
            }
            
            if (this.doctor && dist > this.radius + ent.radius + 10) {
                var difX = (ent.x - this.x)/dist;
                var difY = (ent.y - this.y)/dist;
                this.velocity.x -= difX * acceleration * 4/ (dist*dist);
                this.velocity.y += difY * acceleration * 4/ (dist * dist);
                var speed = Math.sqrt(this.velocity.x*this.velocity.x + this.velocity.y*this.velocity.y);
                if (speed > maxSpeed) {
                    var ratio = maxSpeed / speed;
                    this.velocity.x *= ratio;
                    this.velocity.y *= ratio;
                }
            }

            if (ent.doctor && dist > this.radius + ent.radius) {
                var difX = (ent.x - this.x)/dist;
                var difY = (ent.y - this.y)/dist;
                this.velocity.x -= difX * acceleration / (dist*dist);
                this.velocity.y -= difY * acceleration / (dist * dist);
                var speed = Math.sqrt(this.velocity.x*this.velocity.x + this.velocity.y*this.velocity.y);
                if (speed > maxSpeed) {
                    var ratio = maxSpeed / speed;
                    this.velocity.x *= ratio;
                    this.velocity.y *= ratio;
                }
            }

            if (this.veg && dist > this.radius + ent.radius + 10) {
                var difX = (ent.x - this.x)/dist;
                var difY = (ent.y - this.y)/dist;
                this.velocity.x -= (difX * acceleration * 8 / (dist*dist));
                this.velocity.y -= (difY * acceleration * 8/ (dist * dist));
                var speed = Math.sqrt(this.velocity.x*this.velocity.x + this.velocity.y*this.velocity.y);
                if (speed > maxSpeed) {
                    var ratio = maxSpeed / speed;
                    this.velocity.x *= ratio;
                    this.velocity.y *= ratio;
                }
            }

            if (ent.veg && dist > this.radius + ent.radius) {
                var difX = (ent.x - this.x)/dist;
                var difY = (ent.y - this.y)/dist;
                this.velocity.x += difX * acceleration / (dist*dist);
                this.velocity.y += difY * acceleration / (dist * dist);
                var speed = Math.sqrt(this.velocity.x*this.velocity.x + this.velocity.y*this.velocity.y);
                if (speed > maxSpeed) {
                    var ratio = maxSpeed / speed;
                    this.velocity.x *= ratio;
                    this.velocity.y *= ratio;
                }
            }
        }
    }


    this.velocity.x -= (1 - friction) * this.game.clockTick * this.velocity.x;
    this.velocity.y -= (1 - friction) * this.game.clockTick * this.velocity.y;
};

Circle.prototype.draw = function (ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.colors[this.color];
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();

};



// the "main" code begins here
var friction = 2;
var acceleration = 1000000;
var maxSpeed = 900;

var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./img/960px-Blank_Go_board.png");
ASSET_MANAGER.queueDownload("./img/black.png");
ASSET_MANAGER.queueDownload("./img/white.png");

ASSET_MANAGER.downloadAll(function () {
    console.log("starting up da sheild");
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');


    var gameEngine = new GameEngine();
    var circle = new Circle(gameEngine);
    for(var i = 0; i < 3; i++) {
        circle = new Circle(gameEngine);
        circle.setInfected();
        gameEngine.addEntity(circle);
    }
    
    for(var i = 0; i < 3; i++) {
        circle = new Circle(gameEngine);
        circle.setDoctor();
        gameEngine.addEntity(circle);
    }
    for (var i = 0; i < 3; i++) {
        circle = new Circle(gameEngine);
        circle.setGreen();
        gameEngine.addEntity(circle);
    }
    for (var i = 0; i < 12; i++) {
        circle = new Circle(gameEngine);
        circle.setHealthy();
        gameEngine.addEntity(circle);
    }
    gameEngine.init(ctx);
    gameEngine.start();
});
