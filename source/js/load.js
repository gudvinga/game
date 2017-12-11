const loadState = {
    preload: function() {
        var loadingLabel = game.add.text(80,150, 'loading...', {font: '30px Tahoma', fill: '#ffffff'});

        game.load.image('tiles', 'source/img/tiles-for-map.png');
        game.load.image('bg', 'source/img/bg.jpg');
        game.load.image('bg-lose', 'source/img/bg-lose.jpg');
        game.load.image('bullet', 'source/img/bullet.png');

        game.load.audio('shoot', 'source/audio/explosion.mp3');
        game.load.audio('pping', 'source/audio/p-ping.mp3');
        game.load.audio('wickedDreams', 'source/audio/wicked-dreams.mp3');

        game.load.spritesheet('player', 'source/img/player-rembo.png', 84, 64);
        game.load.spritesheet('enemy', 'source/img/enemy-zm.png', 32, 48);
        game.load.spritesheet('coin', 'source/img/coin.png', 32, 32);
        game.load.spritesheet('box', 'source/img/box.png', 32, 32);

        game.load.tilemap('levels-map', 'source/maps/levels-map.json', null, Phaser.Tilemap.TILED_JSON);
        

    },

    create: function() {
        game.state.start('menu');
    }
}