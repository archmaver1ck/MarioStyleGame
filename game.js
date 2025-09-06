const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: window.innerWidth,
        height: window.innerHeight
    },
    backgroundColor: '#87CEEB',
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 600 }, debug: false }
    },
    scene: { preload, create, update }
};

const game = new Phaser.Game(config);

let player, cursors, platforms, enemies, peach, flag;
let coins, score = 0, scoreText;

function preload() {
    this.load.image('player', 'photo.jpg');
    this.load.image('ground', 'https://labs.phaser.io/assets/sprites/platform.png');
    this.load.image('mushroom', 'https://labs.phaser.io/assets/sprites/mushroom2.png');
    this.load.image('peach', 'https://labs.phaser.io/assets/sprites/peach.png');
    this.load.image('flag', 'https://labs.phaser.io/assets/sprites/flag.png');
    this.load.image('coin', 'waffle.png');

}

function create() {
    //platforms = this.physics.add.staticGroup();
    // for (let x = 0; x < 3000; x += 64) {
    //     if ((x > 400 && x < 600) || (x > 1000 && x < 1200) || (x > 1600 && x < 1800) || (x > 2200 && x < 2400)) {
    //         continue;
    //     }
    //     platforms.create(x, 568, 'ground').setScale(2).refreshBody();
    // }
    platforms = this.physics.add.staticGroup();
    for (let x = 0; x < 3000; x += 64) {
    if (Math.random() < 0.1) continue;
    platforms.create(x, 568, 'ground').setScale(2).refreshBody();
}

    let p1 = platforms.create(800, 400, 'ground').setScale(0.5).refreshBody();
    let p2 = platforms.create(1500, 350, 'ground').setScale(0.5).refreshBody();
    let p3 = platforms.create(2100, 300, 'ground').setScale(0.5).refreshBody();

    
    player = this.physics.add.sprite(100, 450, 'player');
    player.setScale(0.5);
    player.setBounce(0.0001);
    player.setCollideWorldBounds(true);
    this.physics.add.collider(player, platforms);
    

    this.physics.world.setBounds(0, 0, 3000, 600);
    this.cameras.main.setBounds(0, 0, 3000, 600);
    this.cameras.main.startFollow(player, true, 0.08, 0.08);

    cursors = this.input.keyboard.createCursorKeys();

    enemies = this.physics.add.group();
    spawnMushroomOnPlatform(this, p1, 40);
    spawnMushroomOnPlatform(this, p2, -40);
    spawnMushroomOnPlatform(this, p3, 60);

    this.physics.add.collider(player, peach, winGame, null, this);
    this.physics.add.collider(player, enemies, stompEnemy, null, this);

    spawnMushroomOnFloatingPlatform(this, p1, 50);
    spawnMushroomOnFloatingPlatform(this, p2, -50);
    spawnMushroomOnFloatingPlatform(this, p3, 50);

    coins = this.physics.add.group({
    key: 'coin',
    repeat: 10,
    setXY: { x: 200, y: 0, stepX: 250 }
    });

    coins.children.iterate(coin => {
    coin.setBounceY(Phaser.Math.FloatBetween(0.2, 0.5));
    });

    this.physics.add.collider(coins, platforms);

    this.physics.add.overlap(player, coins, collectCoin, null, this);


    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '24px', fill: '#000' });
    scoreText.setScrollFactor(0); 
}



function spawnMushroomOnPlatform(scene, platform, speed) {
    let x = platform.x;
    let y = platform.y - platform.displayHeight / 2 - 16;
    let mushroom = enemies.create(x, y, 'mushroom');
    mushroom.setScale(0.7);
    mushroom.setVelocityX(speed);
    mushroom.setBounce(1, 0);
    mushroom.setCollideWorldBounds(true);
    mushroom.body.allowGravity = true;
    scene.physics.add.collider(mushroom, platforms);
}

function spawnMushroomOnFloatingPlatform(scene, platform, speed) {
    let x = platform.x;
    let y = platform.y - platform.displayHeight / 2 - 16; 

    let mushroom = enemies.create(x, y, 'mushroom');
    mushroom.setCollideWorldBounds(false); 
    mushroom.setScale(0.7);
    mushroom.body.allowGravity = false;     
    mushroom.setVelocityX(speed);
    mushroom.platformLeft = platform.x - platform.displayWidth / 2;
    mushroom.platformRight = platform.x + platform.displayWidth / 2;
}

function collectCoin(player, coin) {
    coin.disableBody(true, true); 
    score += 10;
    scoreText.setText('Score: ' + score);
}


function stompEnemy(player, enemy) {
    let playerBottom = player.y + player.height / 2;
    let enemyTop = enemy.y - enemy.height / 2;
    if (player.body.velocity.y > 0 || playerBottom <= enemyTop + 10) {
        enemy.destroy(); 
        player.setVelocityY(-250); 
    } else {
        respawnPlayer(); 
    }
}


function respawnPlayer() {
    player.setX(100);
    player.setY(450);
    player.setVelocity(0, 0);
}

function winGame() {
    alert("🎉 You reached Peach! You Win! 🎉");
    game.scene.pause('default');
}

function update() {
    if (cursors.left.isDown) {
        player.setVelocityX(-160);
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
    } else {
        player.setVelocityX(0);
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-455);
    }
    if (player.y > 600) {
        respawnPlayer();
    }

    enemies.children.iterate(mushroom => {
        if (mushroom && !mushroom.body.allowGravity) {
            if (mushroom.x <= mushroom.platformLeft + 10) {
                mushroom.setVelocityX(50);
            } else if (mushroom.x >= mushroom.platformRight - 10) {
                mushroom.setVelocityX(-50);
            }
        }
    });
}

