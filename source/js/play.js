let enemies;
let temp = [];
let somegroup;
let healthText;
let player, shoot, background, coins, addZombie;

const playState = {
    create: function() {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        background = game.add.sprite(0,0,'bg');
        background.fixedToCamera = true;

        shoot = game.add.audio('shoot');
        pping = game.add.audio('pping');
        wickedDreams = game.add.audio('wickedDreams');

        wickedDreams.play();
        wickedDreams.loopFull();

        cursors = game.input.keyboard.createCursorKeys();
        fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        bullets = game.add.group();
        bullets.enableBody = true;
        bullets.physicsBodyType = Phaser.Physics.ARCADE;
        bullets.createMultiple(30, 'bullet', 0, false);
        bullets.setAll('anchor.x', 0.5);
        bullets.setAll('anchor.y', 0.5);
        bullets.setAll('outOfBoundsKill', true);
        bullets.setAll('checkWorldBounds', true);

        map = game.add.tilemap('levels-map');
        map.addTilesetImage('tiles-for-map', 'tiles');
        map.setCollisionBetween(1, 34);
        map.setTileIndexCallback(24, playState.win, this);

        layer = map.createLayer('ground-layer');
        layer2 = map.createLayer('image-layer');
        layer.resizeWorld();

        coins = game.add.group();
        coins.enableBody = true;
        map.createFromObjects('object-layer', 39, 'coin', 0, true, false, coins);
        coins.callAll('animations.add', 'animations', 'spin', [0, 1, 2, 3, 4, 5,6,7,8,9], 20, true);
        coins.callAll('animations.play', 'animations', 'spin');

        boxes = game.add.group();
        boxes.enableBody = true;
        boxes.physicsBodyType = Phaser.Physics.ARCADE;
        map.createFromObjects('object-layer', 34, 'box', 0, true, false, boxes);
        boxes.setAll('body.immovable', true);
        boxes.setAll('body.moves', false);

        player = new Player(0, 640, 'player');
        game.world.add(player);
        enemies = game.add.group();
        healthText = game.add.text(32, 50, 'health: 0', { font: "20px Arial", fill: "#ffffff", align: "left" });

        addZombie = setInterval(addEnemie, 3000);

        game.camera.follow(player);

    },

    update: function() {
        game.physics.arcade.collide(player, coins, hitCoin);
        game.physics.arcade.collide(bullets, enemies, killEnemy, null, this);
        game.physics.arcade.collide(bullets, boxes, destroyBox, null, this);
        game.physics.arcade.collide(player, [layer, boxes]);
        game.physics.arcade.collide(player, enemies, playerAttacked, null, this);
        game.physics.arcade.collide(enemies, layer);
        game.physics.arcade.collide(enemies, boxes, reversEnemy, null, this);
        game.physics.arcade.collide(bullets, layer, killBullet, null, this);
    },

    win: function() {
        wickedDreams.stop();
        clearInterval(addZombie);
        game.state.start('win');
    },

    lose: function() {
        wickedDreams.stop();
        clearInterval(addZombie);
        game.state.start('lose');
    }
};

var Enemy = function(x, y, spriteName, velocity, index) {
    Phaser.Sprite.call(this, game, x, y, spriteName);
    game.physics.enable(this, Phaser.Physics.ARCADE);

    this.name = 'enemy_' + index;
    this.firstTouch = true;

    this.health = 3;

    this.body.gravity.y = 600;
    this.body.bounce.y = 0.2;
    this.body.collideWorldBounds = true;

    this.animations.add('right', [12,13,14,15,16,17,18,19,20], 10);
    this.animations.add('left', [0, 1, 2, 3,4,5,6,7,8,9], 10);

    // this.animations.add('right', [6, 7, 8, 9, 10, 11], 5);
    // this.animations.add('left', [0, 1, 2, 3, 4, 5], 5);

    this.animation = 0;
    this.frame = 4;
    this.velocity = velocity;
    this.curentVelocity = 0;
    this.ccount = 0;
};

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function() { 
    this.animations.play(this.animation);

    this.body.velocity.x = this.curentVelocity
    
    if (this.body.blocked.down && this.firstTouch) {
        this.curentVelocity = this.velocity;
        this.firstTouch = false;
    } 

    if (this.body.blocked.right) {
        this.curentVelocity = -this.velocity;
    }

    if (this.body.blocked.left) {
        this.curentVelocity = this.velocity;
    } 
    
    if (this.body.touching.up) {
        this.kill();
    }

    if (this.body.velocity.x > 0) {
        this.animation = 'right';
    }
    else {
        this.animation = 'left'
    }


}

var Player = function (x, y, spriteName) {
    Phaser.Sprite.call(this, game, x, y, spriteName);
    game.physics.enable(this, Phaser.Physics.ARCADE);

    this.health = 100;
    this.lives = 3;

    this.body.gravity.y = 600;
    this.body.bounce.y = 0.2;
    this.body.collideWorldBounds = true;
    this.body.immovable = true;
    this.body.setSize(40,64,24);

    this.animations.add('right', [0,1,2,3,4,5,6,7,8,9,10,11,12,13], 50);
    this.animations.add('fire-right', [14,15,16,17], 30);
    this.animations.add('walk-fire-right', [18, 19,20,21,22,23,24,25,26,27,28,29,30], 50);
    this.animations.add('idle-right', [31,32,33,34,35,36,37,38], 10);
    this.animations.add('left', [39,40,41,42,43,44,45,46,47,48,49,50,51,52], 50);
    this.animations.add('fire-left', [53,54,55,56], 30);
    this.animations.add('walk-fire-left', [57,58,59,60,61,62,63,64,65,66,67,68,69], 50);
    this.animations.add('idle-left', [70,71,72,73,74,75,76,77], 10);
    this.animations.add('attaked-left', [78,79], 5);
    this.animations.add('attaked-right', [80,81], 5);

    this.side = 'left';
};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function() {

    this.body.velocity.x = 0;
    const velocity = 150;

    if (fireButton.isDown && cursors.right.isDown) {
        fireBullet(600, 50);
        this.body.velocity.x = velocity;
        this.animations.play('walk-fire-right');
    }
    else if (fireButton.isDown && cursors.left.isDown) {
        fireBullet(-600, 40);
        this.body.velocity.x = -velocity;
        this.animations.play('walk-fire-left');
    }
    else if (cursors.left.isDown) {
        //  Move to the left
        this.body.velocity.x = -velocity;
        this.animations.play('left');
        this.side = 'left';
    }
    else if (cursors.right.isDown) {
        //  Move to the right
        this.body.velocity.x = velocity;
        this.side = 'right';
        this.animations.play('right');
    }
    else if (fireButton.isDown) {
        this.side == 'right' ? fireBullet(600, 50) : fireBullet(-600, 40);
        this.side == 'right' ? this.animations.play('fire-right') : this.animations.play('fire-left');
    }
    else {
        //  Stand still
        this.side == 'right' ? this.animations.play('idle-right') : this.animations.play('idle-left');
    }

    //  Allow the player to jump if they are touching the ground.

    if ((cursors.up.isDown && this.body.blocked.down) || (cursors.up.isDown && this.body.touching.down)) {
        this.body.velocity.y = -400;
        cursors.up.isDown = false;
        this.secondjump = true;
    }
    else if (cursors.up.isDown && this.secondjump) {
        this.body.velocity.y = -400;
        this.secondjump = false;
    }

    healthText.text = 'health:' + this.health;
    healthText.fixedToCamera = true;
    healthText.cameraOffset.setTo(32, 5);

    if (this.health < 1) {
        this.kill();
        this.reset(0,640);
        this.health = 100;
        this.lives--;
        if (this.lives == 0) {
            clearInterval(addZombie);
            playState.lose();
        }
    }

};

var count = 0;

function addEnemie() {
    temp = new Enemy(player.body.center.x - 200, player.body.center.y - 350, 'enemy', 80, count);
    enemies.add(temp);
    count++;
}

var bulletTime = 0;

function fireBullet(bulletSpead, x) {

    //  To avoid them being allowed to fire too fast we set a time limit
    if (game.time.now > bulletTime) {
        //  Grab the first bullet we can from the pool
        bullet = bullets.getFirstExists(false);

        if (bullet) {
            //  And fire it
            bullet.reset(player.x + x, player.y + 40);
            bullet.body.velocity.x = bulletSpead;
            bulletTime = game.time.now + 200;
            shoot.play();
        }
    }

};

function killEnemy(bullet, enemy) {
    enemy.health--;

    if (enemy.body.touching.left) {
        enemy.curentVelocity = -enemy.velocity;
        enemy.body.velocity.y = -50;
    }
    
    if (enemy.body.touching.right) {
        enemy.curentVelocity = enemy.velocity;
        enemy.body.velocity.y = -50;
    }

    bullet.kill();

    if (enemy.body.touching.down) {
        enemy.kill();
    }

    if (enemy.health < 1) {
        enemy.kill();
    }
};

function hitCoin(player, coin) {
    coin.kill();
    pping.play();
    return false;
}

function destroyBox(bullet, box) {
    box.kill();
    bullet.kill();
    shoot.play();

    var boom = new Enemy(box.body.x, box.body.y, 'enemy', 80, count);
    enemies.add(boom);
    boom.kill();
    boom.reset(box.body.x, box.body.y-30);
}

function killBullet(bullet, tile) {
    bullet.kill();
}

function reversEnemy(enemy, box) {
    if (enemy.body.touching.right) {
        enemy.curentVelocity = -enemy.velocity;
    }
    else if (enemy.body.touching.left) {
        enemy.curentVelocity = enemy.velocity;
    }
    
    if (enemy.body.touching.down) {
        enemy.curentVelocity = enemy.velocity;
    }
}

function playerAttacked(player, enemy) {
    player.health--;
}