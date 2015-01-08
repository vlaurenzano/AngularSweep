app.factory('gameRepository', function() {
    return {
        startNewGame: function( difficulty ) {
            return new MineSweeper.Board( difficulty );
        },
        sweep: function( cell ){
            return MineSweeper.sweep( cell );
        },
        quickClear: function( cell ){
            return MineSweeper.quickClear( cell );
        },
        flag: function( cell ){
            return MineSweeper.flag( cell );
        },
        checkWon: function( ){
            return MineSweeper.checkWon();
        }
        
    };
});

 