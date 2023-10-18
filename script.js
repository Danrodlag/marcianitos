var config = {
    type: Phaser.AUTO,
     width: 800,
     height: 600,
     parent: 'game',
     physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 0},
            debug: true
        }
     },
     scene: {
        preload: preload,
        create: create,
        update: update,
     }
}

var game = new Phaser.Game(config);
enemyInfo = {
    width: 40,
    height: 20,
    count: {
        row: 4,
        col: 9,
    },
    offset: {
        top: 100,
        left: 60
    },
    padding: 5
}

var move = new Howl({
    src: ['recursos/move.mp3']
})

var shootSound = new Howl({
    src: ['recursos/shoot.mp3']
})

var explosionSound = new Howl({
    src: ['recursos/explosion.mp3']
})

var saucerSound = new Howl({
    src: ['recursos/saucer.mp3'],
    loop: true
})

function preload(){
    this.load.image("shooter", "recursos/cannon.png");
    this.load.image("alien", "recursos/enemy.svg");
    this.load.image("bullet", "recursos/bullet.svg");
    this.load.image("saucer", "recursos/saucer.svg");
}


var score = 0;
var liver = 3;
var isStarted = false;
var barriers = [];
var ufoCount = 0;

function create(){
    scene= this;
    cursor = scene.input.keyboard.createCursorKeys();
    keyA = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
    keyD = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    isShooting = false;
    this.input.keyboard.addCapture('SPACE');
    enemies = scene.physics.add.staticGroup();
    playerLava = scene.add.rectangle(0, 0, 800, 10, 0x000).setOrigin(0);
    enemyLava = scene.add.rectangle(0, 590, 800, 10, 0x000).setOrigin(0);
    saucerLava = scene.add.rectangle(790, 0, 10, 600, 0x000).setOrigin(0);
    scene.physics.add.existing(playerLava);
    scene.physics.add.existing(enemyLava);
    scene.physics.add.existing(saucerLava);

    shooter = scene.physics.add.sprite(400, 560, "shooter").setCollideWorldBounds(true);

    scoreText = scene.add.text(16, 16, "Score: " + score, {fontSize: '18px', fill: '#FFF'});
    livesText = scene.add.text(696, 16, "Lives: " + lives, {fontSize: '18px', fill: '#FFF'});
    startText = scene.add.text(400, 300, "Click to Play", {fontSize: '18px', fill: '#FFF'}).setOrigin(0.5)

    scene.input.keyboard.on('keydown-SPACE', shoot);

    

}
function update(){

}

function checkOverlap (spriteA, spriteB){

}

class Barrier {
    constructor(scene, gx, y){
        var x = gx;
        var y = y;
        this.children = [];
        this.scene = scene;
        
        for (var r = 0; r < 3; r++){
            for (var c = 0; c < 3; c++){
                var child = scene.add.rectangle(x, y, 30, 20, 0x1f56);
                scene.physics.add.existing(child);
                child.health = 2;
                this.children.push(child);
                x = x + child.displayWidth;
            
            }
            x = gx;
            y = y + child.displayHeight;

        }

        this.children[this.children.length - 2].destroy();
        this.children.splice(this.children.length - 2, 1)

    }

    checkCollision(sprite){
        var isTouching = false;
        for (var i = 0; i < this.children.length; i++){
            var child = this.children[i];

            if (checkOverlap)
        }
    }
}
