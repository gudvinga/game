const winState = {

    create : function() {
        game.world.setBounds(0, 0, game.width, game.height);
        nameLabel = game.add.text(game.world.centerX, game.world.centerY - 80, 'You WIN', { font: '30px Tahoma', fill: '#ffffff' });
        background = game.add.sprite(0, 0, 'bg');
    }

}