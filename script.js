// Configuracion principal en formato json
var config = {
    
    type: Phaser.AUTO,
    // Tamaño
    width: 800,
    height: 600,
    // Tipo de físicas
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    // Funciones a usar
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

// Creamos la versión Phaser
var game = new Phaser.Game(config);
enemyInfo = {
    // Tamaño de los enemigos
    width: 40,
    height: 20,

    // Cantidad de enemigos y su colocación
    count: {
        row: 5,
        col: 9
    },
    // Distancia con paredes y entre si
    offset: {
        top: 100,
        left: 60
    },
    padding: 5
};

// Añadimos los sonidos
var move = new Howl({
    src: ['recursos/move.mp3']
});

var shootSound = new Howl({
    src: ['recursos/shoot.mp3']
});

var explosionSound = new Howl({
    src: ['recursos/explosion.mp3']
});

var saucerSound = new Howl({
    src: ['recursos/saucer.mp3'],
    loop: true
});

// Precargamos las imagenes
function preload() {
    this.load.image("shooter", "recursos/cannon.png")
    this.load.image("alien", "recursos/enemy.svg")
    this.load.image("bullet", "recursos/bullet.svg")
    this.load.image("saucer", "recursos/saucer.svg")
}

// Añadimos las variables principales
var score = 0;
var lives = 3;
var isStarted = false;
// Estas son las barreras
var barriers = [];
var ufoCount = 0;

// Funcion que crea todo
function create() {
    scene = this;

    // Añadimos los input de las letras
    cursors = scene.input.keyboard.createCursorKeys();
    keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    isShooting = false;
    this.input.keyboard.addCapture('SPACE');

    // Añadimos las posiciones de las fisicas de los elementos
    enimies = this.physics.add.staticGroup();
    playerLava = scene.add.rectangle(0, 0, 800, 10, 0x000).setOrigin(0)
    enemyLava = scene.add.rectangle(0, 590, 800, 10, 0x000).setOrigin(0)
    saucerLava = scene.add.rectangle(790, 0, 10, 600, 0x000).setOrigin(0)
    scene.physics.add.existing(playerLava)
    scene.physics.add.existing(enemyLava)
    scene.physics.add.existing(saucerLava)

    // Añadimos el sprite del disparador
    shooter = scene.physics.add.sprite(400, 560, 'shooter');

    // Hacemos que choque con los bordes
    shooter.setCollideWorldBounds(true)

    // Añadimos los textos
    scoreText = scene.add.text(16, 16, "Puntuación: " + score, { fontSize: '18px', fill: '#FFF' })
    livesText = scene.add.text(696, 16, "Vidas: " + lives, { fontSize: '18px', fill: '#FFF' })
    startText = scene.add.text(400, 300, "Haz click con el ratón para jugar", { fontSize: '18px', fill: '#FFF' }).setOrigin(0.5)

    // Hacemos que al darle al espacio ejecute shoot
    this.input.keyboard.on('keydown-SPACE', shoot);

    // Añadimos las barreras a la escena
    barriers.push(new Barrier(scene, 50, 450))
    barriers.push(new Barrier(scene, 370, 450))
    barriers.push(new Barrier(scene, 690, 450))

    // Este código ejecuta el juego y quita el texto inicial
    this.input.on('pointerdown', function () {
        if (isStarted == false) {
            isStarted = true;
            startText.destroy()
            setInterval(makeSaucer, 15000)

        } else {
            shoot()
        }
    });
    // Inicia los enemigos
    initEnemys()
}

// Recarga la página
function update() {
    // Solo lo hace cuando estamos jugando
    if (isStarted == true) {

        // Aquí especificamos la velocidad de nuestro jugador si se está pulsando
        if (cursors.left.isDown || keyA.isDown) {
            shooter.setVelocityX(-160);

        }
        else if (cursors.right.isDown || keyD.isDown) {
            shooter.setVelocityX(160);

        }
        // Sino no lo mueve
        else {
            shooter.setVelocityX(0);

        }
    }
}

// Función disparar
function shoot() {
    // Si seguimos jugando
    if (isStarted == true) {
        // Si no estamos disparando ya en este momento
        if (isShooting === false) {
            // Añade la fisica de la bala y su sonido
            manageBullet(scene.physics.add.sprite(shooter.x, shooter.y, "bullet"))
            isShooting = true;
            shootSound.play()
        }
    }
}

// Iniciamos enemigos
function initEnemys() {
    // Dibujamos la matriz de enemigos
    for (c = 0; c < enemyInfo.count.col; c++) {
        for (r = 0; r < enemyInfo.count.row; r++) {
            // Añadimos los enemigos metiendo sus datos y los creamos
            var enemyX = (c * (enemyInfo.width + enemyInfo.padding)) + enemyInfo.offset.left;
            var enemyY = (r * (enemyInfo.height + enemyInfo.padding)) + enemyInfo.offset.top;
            enimies.create(enemyX, enemyY, 'alien').setOrigin(0.5);
        }
    }
}

// Variables que nos harán falta para mover a los enemigos
setInterval(moveEnimies, 1000)

// distancia x e y que se mueven
var disX = 10;
var disY = 5;

// Aqui añadimos las veces que se han movido a la derecha o izquierda esta vez
var xTimes = 0;
var yTimes = 0;
// Direccion de movimiento en este momento
var dir = "right"

// Función mover a enemigos
function moveEnimies() {
    if (isStarted === true) {
        // Empezamos el movimiento
        move.play()

        // Si ya llegamos al límite a izq o derecha, cambiamos la dirección y lo reseteamos
        if (xTimes === 20) {
            if (dir === "right") {
                dir = "left"
                xTimes = 0
            } else {
                dir = "right"
                xTimes = 0
            }
        }

        // Si vamos a la derecha, movemos los enemigos sumando a la x
        if (dir === "right") {
            enimies.children.each(function (enemy) {

                enemy.x = enemy.x + disX;
                
                // Bajamos el grupo de marcianos
                
                if (xTimes === 0) {
                    enemy.y = enemy.y + disY;
                }
                enemy.body.reset(enemy.x, enemy.y);
            }, this);
            xTimes++;
            
        } else {
            // Lo contrario si vamos a la izquierda
            enimies.children.each(function (enemy) {

                enemy.x = enemy.x - disX;
                
                // Bajamos el grupo de marcianos
                if (xTimes === 0) {
                    enemy.y = enemy.y + disY;
                }
                enemy.body.reset(enemy.x, enemy.y);
            }, this);
            xTimes++;

        }
    }
}

// Funcion que maneja las balas
function manageBullet(bullet) {

    // velocidad de la bala
    bullet.setVelocityY(-380);

    // Añadimos un intervalo en la funciión
    var i = setInterval(function () {

        // Añadimos la función a cada hijo
        enimies.children.each(function (enemy) {

            // Si le damos a un enemigo
            if (checkOverlap(bullet, enemy)) {

                // Destruimos la bala y limpiamos el intervalo
                bullet.destroy();
                clearInterval(i)
                // Ya no estamos disparando
                isShooting = false

                // Destruimos al enemigo y subimos el marcador
                enemy.destroy()
                score++;
                scoreText.setText("Puntuación: " + score);

                // Sonido de explosión
                explosionSound.play()

                // Condición de victoria
                if ((score - ufoCount) === (enemyInfo.count.col * enemyInfo.count.row)) {
                    end("Victoria")
                }
            }

        }, this);

        // Si le damos a una barrera (o el marcianito)
        for (var step = 0; step < barriers.length; step++) {
            if (barriers[step].checkCollision(bullet)) {
                // Lo mismo, destruimos bala y el intervalo
                bullet.destroy();
                clearInterval(i)
                isShooting = false

                scoreText.setText("Puntuación: " + score);

                // Sonido explosión
                explosionSound.play()

                // Condición de victoria
                if ((score - ufoCount) === (enemyInfo.count.col * enemyInfo.count.row)) {
                    end("Victoria")
                }


            }
        }

        // Si damos al alien que sale arriba moviendose
        for (var step = 0; step < saucers.length; step++) {

            // El saucer se mueve
            var saucer = saucers[step];
            // Si le da
            if (checkOverlap(bullet, saucer)) {
                // Destruye la bala
                bullet.destroy();
                clearInterval(i)
                isShooting = false

                scoreText.setText("Puntuación: " + score);


                explosionSound.play()

                if ((score - ufoCount) === (enemyInfo.count.col * enemyInfo.count.row)) {
                    end("Victoria")
                }

                // Subimos la cuenta y destruimos el ufo
                saucer.destroy()
                saucer.isDestroyed = true;
                saucerSound.stop();
                score++;
                ufoCount++;
            }
        }
    }, 10)
    // Añadimos una nueva física para cuando se solapen
    scene.physics.add.overlap(bullet, playerLava, function () {
        bullet.destroy();
        clearInterval(i);
        explosionSound.play();
        isShooting = false
    })

}
// Velocidad de la bala enemiga
var enemyBulletVelo = 200;

// Función que maneja la bala enemiga
function manageEnemyBullet(bullet, enemy) {
    
    // Le pasamos el angulo de disparo, calculado desde el marcianito al jugador
    var angle = Phaser.Math.Angle.BetweenPoints(enemy, shooter);

    // Creamos la bala rotada
    scene.physics.velocityFromRotation(angle, enemyBulletVelo, bullet.body.velocity);
    // Subimos la velocidad
    enemyBulletVelo = enemyBulletVelo + 2
    var i = setInterval(function () {

        // si nos da
        if (checkOverlap(bullet, shooter)) {
            // destruimos la bala y el intervalo
            bullet.destroy();
            clearInterval(i);
            // Bajamos el número de vidas
            lives--;
            livesText.setText("Vidas: " + lives);
            explosionSound.play()

            // Si nos quedamos sin vidas, perdimos
            if (lives == 0) {
                end("Game Over")
            }
        }
        // si da contra una barrera
        for (var step = 0; step < barriers.length; step++) {
            if (barriers[step].checkCollision(bullet)) {
                // borramos la bala
                bullet.destroy();
                clearInterval(i)
                isShooting = false

                // Conseguimos más puntos
                scoreText.setText("Puntuación: " + score);


                explosionSound.play()

                if (score === (enemyInfo.count.col * enemyInfo.count.row)) {
                    end("Victoria")
                }
            }
        }
    }, 10)
    scene.physics.add.overlap(bullet, enemyLava, function () {
        bullet.destroy();
        explosionSound.play();
        clearInterval(i);
    })

}

// Esta función se encarga de comprobar si dos elementos se solapan
function checkOverlap(spriteA, spriteB) {
    var boundsA = spriteA.getBounds();
    var boundsB = spriteB.getBounds();
    return Phaser.Geom.Intersects.RectangleToRectangle(boundsA, boundsB);
}

// Intervalo de disparo de los enemigos
setInterval(enemyFire, 3000)

function enemyFire() {
    if (isStarted === true) {
        // Los enemigos disparan
        var enemy = enimies.children.entries[Phaser.Math.Between(0, enimies.children.entries.length - 1)];
        manageEnemyBullet(scene.physics.add.sprite(enemy.x, enemy.y, "bullet"), enemy)
    }
}


// Los ovnis que aparecen, apareceran al usar esta función
var saucers = [];
function makeSaucer() {
    if (isStarted == true) {
        // Añade el sprite con manageSaucer, que aparece más abajo
        manageSaucer(scene.physics.add.sprite(0, 60, "saucer"));
    }
}

// Crea el intervalo de disparo del ovni, comprobando donde está y qué ovni es
setInterval(function () {
    if (isStarted == true) {
        for (var i = 0; i < saucers.length; i++) {
            var saucer = saucers[i];
            if (saucer.isDestroyed == false) {
                // Disparo
                manageEnemyBullet(scene.physics.add.sprite(saucer.x, saucer.y, "bullet"), saucer)

            } else {
                // Destrucción del ovni
                saucers.splice(i, 1);
            }
        }
    }

}, 2000)

// Añade el Ovni
function manageSaucer(saucer) {

    saucers.push(saucer);
    saucer.isDestroyed = false;

    // Velocidad lateral del Ovni
    saucer.setVelocityX(100);

    // Si hay solapamiento lo mata
    scene.physics.add.overlap(saucer, saucerLava, function () {
        saucer.destroy()
        saucer.isDestroyed = true;
        saucerSound.stop()
    })
    saucerSound.play()
}

// Barreras, aquí creamos una clase con constructor
class Barrier {
    // Constructor de la clase
    constructor(scene, gx, y) {

        // Variables principales
        var x = gx;
        var y = y;

        this.children = [];
        // Escena principal
        this.scene = scene;

        // Añadimos los cuadrados de las barreras necesarias
        for (var r = 0; r < 3; r++) {
            for (var c = 0; c < 3; c++) {

                // Cada rectángulo
                var child = scene.add.rectangle(x, y, 30, 20, 0x1ff56);
                // Lo añadimos con su física
                scene.physics.add.existing(child);
                // La vida del rectángulo
                child.health = 2;
                // Lo dibujamos 
                this.children.push(child)
                
                // Cambiamos la x para que el siguiente se haga al lado
                x = x + child.displayWidth;
            }
            x = gx;
            // Aqui cambiamos la y para cambiar de altura
            y = y + child.displayHeight;
        }

        // Destruimos el penúltimo para darle la forma característica
        this.children[this.children.length-2].destroy();
        this.children.splice(this.children.length-2, 1);        
    }
    // Comprobar colisiones del sprite
    checkCollision(sprite) {
        // Variable booleana
        var isTouching = false;
        // Recorremos los objetos
        for (var i = 0; i < this.children.length; i++) {
            var child = this.children[i];
            // Comprobamos si se tocan
            if (checkOverlap(sprite, child)) {
                isTouching = true;
                // Si lo hacen y le quedaba 1 vida, muere el bloque
                if (this.children[i].health === 1) {
                    child.destroy();
                    this.children.splice(i, 1);

                } else {
                    // Si todavía le queda, solo le baja la vida
                    this.children[i].health--;

                }
                break;
            }
        }
        // Devolvemos el booleano para decir que ha habido colisión
        return isTouching;
    }
}

// Función final
function end(con) {
    // Terminamos sonidos
    explosionSound.stop();
    saucerSound.stop();
    shootSound.stop();

    // Terminamos el movimiento
    move.stop()
    var highScore = localStorage.getItem("HighScore");
    if (highScore === null){
        highScore = 0;
    }
    // Señalamos con la puntuación final
    alert(`¡${con}! Su puntuación final es de: ` + score + `. La puntuación más alta era de ${highScore}`);
    if(score> highScore){
        localStorage.setItem("HighScore", score);
    }
    location.reload()

}