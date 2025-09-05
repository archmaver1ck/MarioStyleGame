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
        arcade: { gravity: { y: 500 } }
    },
    scene: { preload, create, update }
};

const game = new Phaser.Game(config);
let player, cursors, platforms, enemies;

function preload() {
    this.load.image('player', 'photo.jpg');
    this.load.image('ground', 'https://labs.phaser.io/assets/sprites/platform.png');
    this.load.image('mushroom', 'https://labs.phaser.io/assets/sprites/mushroom2.png');
}

function create() {
    platforms = this.physics.add.staticGroup();
    for (let x = 0; x < 2000; x += 64) {
        if ((x > 600 && x < 800) || (x > 1200 && x < 1400)) continue;
        platforms.create(x, 568, 'ground').setScale(2).refreshBody();
    }

    player = this.physics.add.sprite(100, 450, 'player');
    player.setScale(0.01);
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    this.physics.add.collider(player, platforms);

    cursors = this.input.keyboard.createCursorKeys();

    this.physics.world.setBounds(0, 0, 2000, 600);
    this.cameras.main.setBounds(0, 0, 2000, 600);
    this.cameras.main.startFollow(player, true, 0.08, 0.08);

    enemies = this.physics.add.group();
    let mushroom = enemies.create(500, 500, 'mushroom');
    mushroom.setCollideWorldBounds(true);
    mushroom.setVelocityX(50);
    mushroom.setBounce(1, 0);
    mushroom.body.allowGravity = true;
    mushroom.setSize(mushroom.width, mushroom.height);

    this.physics.add.collider(enemies, platforms);
    this.physics.add.collider(player, enemies, hitEnemy, null, this);

    makePlatform(this, 200, 400, 100, 30);
    makePlatform(this, 500, 250, 150, 30);
}

function hitEnemy(player, enemy) {
    respawnPlayer();
}

function respawnPlayer() {
    player.setX(100);
    player.setY(450);
    player.setVelocity(0, 0);
}

function makePlatform(scene, x, y, w, h) {
    let g = scene.add.graphics();
    g.fillStyle(0x00ff00, 1);
    g.fillRect(x, y, w, h);

    let block = scene.physics.add.staticImage(x + w/2, y + h/2, null)
        .setDisplaySize(w, h)
        .refreshBody();

    scene.physics.add.collider(player, block);
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
        player.setVelocityY(-330);
    }

    if (player.y > 600) {
        respawnPlayer();
    }
}



