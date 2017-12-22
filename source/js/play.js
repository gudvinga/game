let enemies;
let temp = [];
let somegroup;
let player, background, coins, addZombie, fonts;
let enemyDead, ahh, shoot, pping, useaid;
let coinsCount, 
    enemiesCount,
    score;
let healthText,
    scoreText,
    livesText,
    coinsText,
    enemiesText;

function gameInit() {
    coinsCount = 0;
    enemiesCount = 0;
    score = 0;
}

const enemyCharacter = {
    '0' : {
        sprite: 'enemy',
        velocity: 60,
        velocityY: 0,
        health: 3,
        score: 20
    },
    '1': {
        sprite: 'enemyJumper',
        velocity: 80,
        velocityY: 250,
        health: 2,
        score: 50
    },
    '2': {
        sprite: 'enemySlow',
        velocity: 40,
        velocityY: 0,
        health: 10,
        score: 100
    },
    '3': {
        sprite: 'enemyFast',
        velocity: 200,
        velocityY: 0,
        health: 1,
        score: 20
    },
}

const playState = {
    create: function() {
        gameInit();

        game.physics.startSystem(Phaser.Physics.ARCADE);
        background = game.add.sprite(0,0,'bg');
        background.fixedToCamera = true;

        shoot = game.add.audio('shoot');
        pping = game.add.audio('pping');
        useaid = game.add.audio('useaid');
        enemyDead = game.add.audio('enemyDead');
        ahh = game.add.audio('ahh');
        wickedDreams = game.add.audio('wickedDreams');

        wickedDreams.play();
        wickedDreams.loopFull();

        cursors = game.input.keyboard.createCursorKeys();
        fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        map = game.add.tilemap('levels-map');
        map.addTilesetImage('tiles-for-map', 'tiles');
        map.setCollisionBetween(1, 34);

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
        map.createFromObjects('object-layer', 34, 'box', 0, true, false, boxes);
        boxes.setAll('body.immovable', true);
        boxes.setAll('body.moves', false);

        bullets = game.add.group();
        bullets.enableBody = true;
        bullets.physicsBodyType = Phaser.Physics.ARCADE;
        bullets.createMultiple(30, 'bullet', 0, false);
        bullets.setAll('anchor.x', 0.5);
        bullets.setAll('anchor.y', 0.5);
        bullets.setAll('outOfBoundsKill', true);
        bullets.setAll('checkWorldBounds', true);

        aids = game.add.group();

        player = new Player(0, 640, 'player');
        game.world.add(player);
        enemies = game.add.group();
        blood = game.add.group();

        const fontStyle = { font: "20px Arial", fill: "#ffffff", align: "left" };

        healthImg = game.add.sprite(32, 530, 'health-bg');
        // scoreImg = game.add.sprite(320, 535, 'score-bg');
        livesImg = game.add.sprite(32, 585, 'lives-bg');
        coinsImg = game.add.sprite(780, 530, 'coins-bg' );
        enemiesImg = game.add.sprite(780, 585, 'zombie-bg');

        healthText = game.add.text(100, 543, '0', fontStyle);
        scoreText = game.add.text(32, 32, '0', { font: "26px Arial", fill: "#ffffff", align: "center" });
        livesText = game.add.text(100, 598, '0', fontStyle);
        coinsText = game.add.text(810, 543, '0', fontStyle);
        enemiesText = game.add.text(810, 598, '0', fontStyle);

        scoreText.fixedToCamera = true;
        livesText.fixedToCamera = true;
        healthText.fixedToCamera = true;
        coinsText.fixedToCamera = true;
        enemiesText.fixedToCamera = true;

        healthImg.fixedToCamera = true;
        //scoreImg.fixedToCamera = true;
        livesImg.fixedToCamera = true;
        coinsImg.fixedToCamera = true;
        enemiesImg.fixedToCamera = true;

        addZombie = 0; //temporary
        game.time.events.repeat(Phaser.Timer.SECOND * 3, Infinity, addEnemie, this);

        game.camera.follow(player);

    },

    update: function() {
        game.physics.arcade.collide(player, coins, hitCoin, null, this);
        game.physics.arcade.collide(bullets, enemies, killEnemy, null, this);
        game.physics.arcade.collide(bullets, boxes, destroyBox, null, this);
        game.physics.arcade.collide(player, [layer, boxes]);
        game.physics.arcade.collide(player, enemies, playerAttacked, null, this);
        game.physics.arcade.collide(player, aids, useAid, null, this);
        game.physics.arcade.collide([aids, enemies], layer);
        game.physics.arcade.collide(enemies, boxes, reversEnemy, null, this);
        game.physics.arcade.collide(bullets, layer, killBullet, null, this);

        healthText.text = player.health;
        scoreText.text = 'SCORE: ' + score;
        livesText.text = player.lives;
        coinsText.text = coinsCount;
        enemiesText.text = enemiesCount;

        addAid();
        win();
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

class Enemy extends Phaser.Sprite {
    constructor(x, y, spriteName, velocity, velocityY, health, score) {
        super(game, x, y, spriteName);
        game.physics.enable(this, Phaser.Physics.ARCADE);

        this.body.gravity.y = 600;
        this.body.bounce.y = 0.2;
        this.body.collideWorldBounds = true;

        this.animations.add('right', [12, 13, 14, 15, 16, 17, 18, 19, 20], 10);
        this.animations.add('left', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 10);
        this.animation = 0;
        this.frame = 4;

        this.velocity = velocity;
        this.velocityY = velocityY;
        this.curentVelocity = 0;
        this.firstTouch = true;
        this.health = health;
        this.score = score; 
    }

    update() {
        this.animations.play(this.animation);

        this.body.velocity.x = this.curentVelocity;

        if(this.body.blocked.down) {
            this.body.velocity.y = -this.velocityY;
        }

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

        if (this.body.velocity.x > 0) {
            this.animation = 'right';
        }
        else {
            this.animation = 'left'
        }

    }
}

class Player extends Phaser.Sprite {
    constructor(x, y, spriteName) {
        super(game, x, y, spriteName);
        game.physics.enable(this, Phaser.Physics.ARCADE);

        this.health = 100;
        this.lives = 3;

        this.body.gravity.y = 600;
        this.body.bounce.y = 0.2;
        this.body.collideWorldBounds = true;
        this.body.setSize(40, 64, 24);

        this.animations.add('right', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], 50);
        this.animations.add('fire-right', [14, 15, 16, 17], 30);
        this.animations.add('walk-fire-right', [18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30], 50);
        this.animations.add('idle-right', [31, 32, 33, 34, 35, 36, 37, 38], 10);
        this.animations.add('left', [39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52], 50);
        this.animations.add('fire-left', [53, 54, 55, 56], 30);
        this.animations.add('walk-fire-left', [57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69], 50);
        this.animations.add('idle-left', [70, 71, 72, 73, 74, 75, 76, 77], 10);
        this.animations.add('attaked-left', [78, 79], 5);
        this.animations.add('attaked-right', [80, 81], 5);

        this.side = 'left';
        this.bulletInterval = 150;
    }

    update() {
        this.body.velocity.x = 0;
        const velocity = 150;

        if (fireButton.isDown && cursors.right.isDown) {
            fireBullet(600, 50, this.bulletInterval);
            this.body.velocity.x = velocity;
            this.animations.play('walk-fire-right');
        }
        else if (fireButton.isDown && cursors.left.isDown) {
            fireBullet(-600, 40, this.bulletInterval);
            this.body.velocity.x = -velocity;
            this.animations.play('walk-fire-left');
        }
        else if (cursors.left.isDown) {
            this.body.velocity.x = -velocity;
            this.animations.play('left');
            this.side = 'left';
        }
        else if (cursors.right.isDown) {
            this.body.velocity.x = velocity;
            this.side = 'right';
            this.animations.play('right');
        }
        else if (fireButton.isDown) {
            this.side == 'right' ? fireBullet(600, 50, this.bulletInterval) : fireBullet(-600, 40, this.bulletInterval);
            this.side == 'right' ? this.animations.play('fire-right') : this.animations.play('fire-left');
        }
        else {
            this.side == 'right' ? this.animations.play('idle-right') : this.animations.play('idle-left');
        }

        if ((cursors.up.isDown && this.body.blocked.down) || (cursors.up.isDown && this.body.touching.down)) {
            this.body.velocity.y = -400;
            cursors.up.isDown = false;
            this.secondjump = true;
        }
        else if (cursors.up.isDown && this.secondjump) {
            this.body.velocity.y = -400;
            this.secondjump = false;
        }

        if (this.health < 1) {
            this.kill();
            this.reset(0, 640);
            this.health = 100;
            this.lives--;
            if (this.lives == 0) {
                playState.lose();
            }
        }
    }
}

class Blood extends Phaser.Sprite {
    constructor(x, y, sprite) {
        super(game, x, y, sprite);
        this.animations.add('blood', [0, 1, 2, 3, 4, 5], 10);
        this.animations.play('blood');
    }
}

class Aid extends Phaser.Sprite {
    constructor(x, y, sprite, hp) {
        super(game, x, y, sprite);
        game.physics.enable(this, Phaser.Physics.ARCADE);
        this.animations.add('aid', [0, 1, 2, 3, 4, 5], 10);
        this.animations.play('aid');

        this.body.gravity.y = 300;
        this.body.bounce.y = 0.5;
        this.body.collideWorldBounds = true;

        this.hp = hp;
    }
}

function createBlood(x, y, sprite) {
    var temp = new Blood(x, y, sprite);
    blood.add(temp);
    setTimeout(() => {
        temp.kill();
    }, 500);
}

var count = 0;

function addEnemie(x, y) {
    x = x || player.body.center.x - 200;
    y = y || player.body.center.y - 350;
    let level = 0,
        scoreLimit = 1000;

    level = Math.floor(score/scoreLimit);
    if (level > 3) {
        level = 3;
    }

    player.bulletInterval = 200/(0.25*level+1);

    let character = enemyCharacter[Math.round(level*(1 - Math.random()))];

    let enemy = new Enemy(x, y, character.sprite, character.velocity, character.velocityY, character.health, character.score);
    enemies.add(enemy);
}

var bulletTime = 0;

function fireBullet(bulletSpead, x, bulletInterval) {
    if (game.time.now > bulletTime) {
        bullet = bullets.getFirstExists(false);
        if (bullet) {
            bullet.reset(player.x + x, player.y + 40);
            bullet.body.velocity.x = bulletSpead;
            bulletTime = game.time.now + bulletInterval;
            shoot.play();
        }
    }

};

function killEnemy(bullet, enemy) {
    enemy.health--;
    createBlood(enemy.x + 0, enemy.y + 18, 'blood');

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
        enemyDead.play();
        enemiesCount++;
        score += enemy.score;
    }
};

function hitCoin(player, coin) {
    coin.kill();
    pping.play();
    coinsCount++;
    score += 20;
}

function destroyBox(bullet, box) {
    box.kill();
    bullet.kill();
    shoot.play();
    
    let temp = Math.random();

    if (temp > 0.2) {
        addEnemie(box.x, box.y - 15);
    }
    else if(temp > 0.1 ) {
        let aid = new Aid(box.x, box.y, 'aid', 5);
        aid.scale.setTo(0.5, 0.5);
        aids.add(aid);
        createAid = false;
    }
    else {
        createBlood(box.x, box.y, 'bloodBox');
    }
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
        if (enemy.velocity.x == 0) {
            enemy.x += 32;
        }
    }
}

function playerAttacked(player, enemy) {

    if (enemy.body.touching.up) {
        enemy.kill();
        enemyDead.play();
        createBlood(enemy.x + 0, enemy.y + 18, 'blood');
        enemiesCount++;
        score += 10;     
    }
    else if (enemy.body.touching.down) {
        player.health -= 10;
        player.body.velocity.y = -100;
        enemy.kill();
        enemyDead.play();
        playSoundFull(ahh, 500);
        createBlood(enemy.x + 0, enemy.y + 18, 'blood');
        enemiesCount++;
    }
    else {
        player.health--;
        playSoundFull(ahh, 500);
    }
}

function playSoundFull(sound, duration) {
    if (!sound.isPlaying) {
        sound.play();
        setTimeout(() => {
            sound.stop()
        }, duration);
    }
}

var createAid = false;
function addAid(x, y) {
    x = x || player.x + 100 - 200 * Math.random();
    y = y || player.y - 200 * Math.random();
    let hp = 50;

    if (score % 500 < 15 && score != 0 && createAid) {
        var aid = new Aid(x, y, 'aid', hp);
            aids.add(aid);
            createAid = false;
    }

    if (score % 500 > 100) {
        createAid = true;
    }
}

function useAid(player, aid) {
    player.health += aid.hp;
    if (player.health > 100) {
        player.health = 100;
    }

    aid.kill();
    playSoundFull(useaid, 500);
}

function win() {
    if (player.x > 3130 & player.y > 860) {
        playState.win();
    }
}