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

    // existing code...
    this.add.text(20, 20, "Use arrow keys to move", { font: "20px Arial", fill: "#000" });

    // Create a group of obstacles
    obstacles = this.physics.add.staticGroup();

    // Example: add one obstacle (a block)
    obstacles.create(400, 500, null)
        .setDisplaySize(100, 50)   // width=100, height=50
        .setOrigin(0, 0)
        .refreshBody()
        .setFillStyle ? null : null; // ignore (Phaser quirk, we’ll color it differently)

    // Add collision between player and obstacles
    this.physics.add.collider(player, obstacles);

    let graphics = this.add.graphics();
    graphics.fillStyle(0xff0000, 1);  // red color
    graphics.fillRect(300, 300, 120, 30);  // x, y, width, height

// Add physics body (so player can stand on it)
    let floatingBlock = this.physics.add.staticImage(360, 315, null)
        .setDisplaySize(120, 30)
        .refreshBody();

// Add collision with player
    this.physics.add.collider(player, floatingBlock);
}

function respawnPlayer() {
    player.setX(100);  // starting X
    player.setY(450);  // starting Y
    player.setVelocity(0, 0); // stop falling momentum
}

makePlatform(this, 200, 400, 100, 30);
makePlatform(this, 500, 250, 150, 30);

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

    if (player.y > 600) {   // adjust 600 if your game height is different
        respawnPlayer();
    }
    
}


