var config = {
    type: Phaser.AUTO,
     width: 800,
     height: 600,
     parent: 'game',
     physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 0},
            debug: false
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
    enemies = 
}
function update(){

}