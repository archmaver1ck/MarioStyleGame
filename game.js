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
let player;

function preload() {
    this.load.image('player', 'https://labs.phaser.io/assets/sprites/phaser-dude.png');
    this.load.image('ground', 'https://labs.phaser.io/assets/sprites/platform.png');
}
let enemies;
function create() {
    
    const ground = this.physics.add.staticGroup();
    ground.create(400, 580, 'ground').setScale(2).refreshBody();
    player = this.physics.add.sprite(100, 450, 'player');
    player.setBounce(0.2); 
    player.setCollideWorldBounds(true); 
    this.physics.add.collider(player, ground);
    this.cursors = this.input.keyboard.createCursorKeys();
    this.add.text(20, 20, "Use arrow keys to move", { font: "20px Arial", fill: "#000" });
    obstacles = this.physics.add.staticGroup();
    obstacles.create(400, 500, null)
        .setDisplaySize(100, 50)   
        .setOrigin(0, 0)
        .refreshBody()
        .setFillStyle ? null : null; 

    this.physics.add.collider(player, obstacles);

    let graphics = this.add.graphics();
    graphics.fillStyle(0xff0000, 1);  
    graphics.fillRect(300, 300, 120, 30);  
    let floatingBlock = this.physics.add.staticImage(360, 315, null)
        .setDisplaySize(120, 30)
        .refreshBody();
    this.physics.add.collider(player, floatingBlock);

    this.physics.world.setBounds(0, 0, 2000, 600);  
    this.cameras.main.setBounds(0, 0, 2000, 600);
    this.cameras.main.startFollow(player, true, 0.08, 0.08);

    platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    for (let x = 0; x < 2000; x += 64) {
        platforms.create(x, 568, 'ground').setScale(2).refreshBody();
    }
    for (let x = 0; x < 2000; x += 64) {
        if ((x > 600 && x < 800) || (x > 1200 && x < 1400)) {
            continue; 
        }
        platforms.create(x, 568, 'ground').setScale(2).refreshBody();
    }

    enemies = this.physics.add.group();

    
    let mushroom = enemies.create(500, 500, 'mushroom');
    mushroom.setCollideWorldBounds(true);
    mushroom.setVelocityX(50);   
    mushroom.setBounce(1, 0);   
    mushroom.body.allowGravity = true;

    
    this.physics.add.collider(enemies, platforms);

    
    this.physics.add.collider(player, enemies, hitEnemy, null, this);
}

function hitEnemy(player, enemy) {
    respawnPlayer();  
}

function respawnPlayer() {
    player.setX(100);  
    player.setY(450);  
    player.setVelocity(0, 0);
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

    if (player.y > 600) {   
        respawnPlayer();
    }
    
}



