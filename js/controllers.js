app.controller("board", function($scope, gameRepository, $routeParams) {
    //game board
    $scope.board = gameRepository.startNewGame($routeParams.difficulty);
    //sweep this mine
    $scope.sweep = function(cell) {
        if (cell.flagged || cell.swept) {
            return false;
        }
        if (!gameRepository.sweep(cell)) {
            $scope.gameOver();
        } else if( gameRepository.checkWon() ) {
           $scope.gameWon();
       }
        $scope.$apply();
    };
    //flag this mine
    $scope.flag = function(cell) {
        if (cell.swept) {
            return false;
        }
        gameRepository.flag(cell);
        $scope.$apply();
    };
    //perform a deep sweep
    $scope.quickClear = function(cell) {
        gameRepository.quickClear(cell);
        if (gameRepository.checkWon()) {
            $scope.gameWon();
        }
        $scope.$apply();
    };
    $scope.gameWon = function() {
        alert('You Win');
    };
    $scope.gameOver = function() {
        alert('You Lose');
    };
});

