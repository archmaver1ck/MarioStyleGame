const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,       // Scale to fit screen
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: window.innerWidth,     // Full browser width
        height: window.innerHeight    // Full browser height
    },
    backgroundColor: '#87CEEB',
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 500 } }
    },
    scene: { preload, create, update }
};

const game = new Phaser.Game(config);
let player;

function preload() {
    // Load placeholder sprites from Phaser’s asset CDN
    this.load.image('player', 'https://labs.phaser.io/assets/sprites/phaser-dude.png');
    this.load.image('ground', 'https://labs.phaser.io/assets/sprites/platform.png');
}

function create() {
    // Add ground
    const ground = this.physics.add.staticGroup();
    ground.create(400, 580, 'ground').setScale(2).refreshBody();

    // Add player
    player = this.physics.add.sprite(100, 450, 'player');
    player.setBounce(0.2); // little bounce when landing
    player.setCollideWorldBounds(true); // prevent going off-screen

    // Collisions
    this.physics.add.collider(player, ground);

    // Controls
    this.cursors = this.input.keyboard.createCursorKeys();
}

function update() {
    if (this.cursors.left.isDown) {
        player.setVelocityX(-160);
    } else if (this.cursors.right.isDown) {
        player.setVelocityX(160);
    } else {
        player.setVelocityX(0);
    }

    if (this.cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-330);
    }
}


