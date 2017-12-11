const menuState = {
    create: function() {
        let nameLabel,
            startLabel,
            startKey;

        game.world.setBounds(0, 0, game.width, game.height);
        nameLabel = game.add.text(game.world.centerX, game.world.centerY - 80,'Rolling Scope School Game', {font: '30px Tahoma', fill: '#ffffff'});
        startLabel = game.add.text(game.world.centerX, game.world.centerY, 'Start', { font: '30px Tahoma', fill: '#ffffff' });
                
        startLabel.inputEnabled = true;
        startLabel.events.onInputDown.add(() => game.state.start('play'), this);  

    }
}