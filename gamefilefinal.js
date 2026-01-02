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

let player, cursors, platforms, enemies, peach;
let coins, score = 0, scoreText;

function preload() {
    this.load.image('player', 'mario.png');
    this.load.image('ground', 'https://labs.phaser.io/assets/sprites/platform.png');
    this.load.image('mushroom', 'mushroom.png');
    this.load.image('peach', 'peach.jpg');
    this.load.image('flag', 'https://labs.phaser.io/assets/sprites/flag.png');
    this.load.image('coin', 'waffle.png');
}

function create() {
    platforms = this.physics.add.staticGroup();
    for (let x = 0; x < 4500; x += 64) {
        if (Math.random() < 0.15) continue;
        platforms.create(x, 568, 'ground').setScale(2).refreshBody();
    }

    let floating = [];
    floating.push(platforms.create(800, 350, 'ground').setScale(0.5).refreshBody());
    floating.push(platforms.create(1500, 390, 'ground').setScale(0.5).refreshBody());
    floating.push(platforms.create(2100, 380, 'ground').setScale(0.5).refreshBody());
    floating.push(platforms.create(2800, 450, 'ground').setScale(0.5).refreshBody());
    floating.push(platforms.create(3500, 410, 'ground').setScale(0.5).refreshBody());

    player = this.physics.add.sprite(100, 450, 'player');
    player.setScale(0.08);
    player.setBounce(0.0001);
    player.setCollideWorldBounds(true);
    this.physics.add.collider(player, platforms);

    peach = this.physics.add.staticImage(4450, 500, 'peach')
        .setScale(0.05)
        .setOrigin(0.5, 1)
        .refreshBody();

    this.physics.add.overlap(player, peach, winGame, null, this);

    this.physics.world.setBounds(0, 0, 4500, 600);
    this.cameras.main.setBounds(0, 0, 4500, 600);
    this.cameras.main.startFollow(player, true, 0.08, 0.08);

    cursors = this.input.keyboard.createCursorKeys();

    enemies = this.physics.add.group();
    floating.forEach((p, i) => {
        spawnMushroomOnPlatform(this, p, i % 2 === 0 ? 50 : -50);
        spawnMushroomOnFloatingPlatform(this, p, i % 2 === 0 ? -60 : 60);
    });

    this.physics.add.overlap(player, enemies, stompEnemy, null, this);

    coins = this.physics.add.group({
        key: 'coin',
        repeat: 25,
        setXY: { x: 200, y: 0, stepX: 160 },
        setScale: { x: 0.1, y: 0.1 }
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
    mushroom.setScale(0.07);
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
    let playerBottom = player.body.bottom;
    let enemyTop = enemy.body.top;

    if (playerBottom <= enemyTop + 5 && player.body.velocity.y > 0) {
        enemy.destroy();
        player.setVelocityY(-300);
        score += 10;
        scoreText.setText('Score: ' + score);
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
    alert("🎉 HAPPPYYY BIRTHHHDAYYY MANONIIII! 🎉");
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



