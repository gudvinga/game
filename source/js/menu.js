const menuState = {
    create: function() {
        let nameLabel,
            startButton,
            startKey;

        game.world.setBounds(0, 0, game.width, game.height);
        background = game.add.sprite(0, 0, 'menu-bg');
        nameLabel = game.add.text(game.world.centerX, game.world.centerY - 90, 'Special for The Rolling Scopes School', { font: '18px Tahoma', fill: '#92a5a9'});
        startButton = game.add.button(game.world.centerX-100, game.world.centerY+60, 'startButton', actionOnClick, this, 0, 1);
                
        function actionOnClick() {
            game.state.start('play');  
        }
    }
}