const loseState = {

    create : function() {
        let restartButton;
        game.world.setBounds(0, 0, game.width, game.height);
        background = game.add.sprite(0, 0, 'bg-lose');

        restartButton = game.add.button(game.world.centerX - 100, game.world.centerY + 170, 'restartButton', actionOnClick, this, 0, 1);

        function actionOnClick() {
            game.state.start('play');
        }
    }

}