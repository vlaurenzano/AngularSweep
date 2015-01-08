var MineSweeper = MineSweeper || {};
(function() {

    /**
     * current board instance
     */
    var currentCells;

    /**
     * Current amount of unswept empty cells
     * @type type
     */
    var emptyCellCount;
   
    /**
     * 
     * Instantiates new board
     * 
     * @param {type} numberOfMines
     * @returns {Array}
     */
    this.Board = function(difficulty) {
        //build the settings
        Settings.call(this, difficulty);
        var numberOfCells = this.width * this.height;
        var mineCells = getRandomMines(numberOfCells, this.mines);
        this.cells = buildBoard.call(this, mineCells);
        gameStarted = false;
        currentCells = this.cells;
        emptyCellCount = this.width * this.height - this.mines; 
    };

    /**
     * Builds board
     * @returns {undefined}
     */
    function buildBoard(mineCells) {
        var cells = new Array;
        for (var i = 0; i < this.width; i++) {
            cells[i] = new Array;
            for (var j = 0; j < this.height; j++) {
                if (mineCells.indexOf((i * this.width) + (j)) >= 0) {
                    cells[i][j] = new Mine(i, j);
                } else {
                    cells[i][j] = new EmptyCell(i, j);
                }
            }
        }
        calculateNeighbours(cells);
        return cells;
    }

    /**
     * calculates neighbours
     * @returns {undefined}
     */
    function calculateNeighbours(cells) {
        for (var x in cells) {
            for (var y in cells[x]) {
                if (cells[x][y] instanceof Mine)
                    incrementNeigbours(cells, x, y);
            }
        }
    }

    //this will increment all the neighbors mine count
    //will also increment this mine's count but we don't care
    function incrementNeigbours(cells, x, y) {
        x = parseInt(x);
        y = parseInt(y);
        for (var j = (x - 1); j <= (x + 1); j++) {
            if (typeof cells[j] !== 'undefined') {
                for (var k = (y - 1); k <= (y + 1); k++) {
                    if (typeof cells[j][k] !== 'undefined'
                            && cells[j][k] instanceof Cell) {
                        cells[j][k].neighbourMines++;

                    }
                }
            }
        }
    }
    /**
     * Get Random Mines 
     * @param {type} numberOfCells
     * @param {type} numberOfMines
     * @returns {Array}
     */
    function getRandomMines(numberOfCells, numberOfMines) {
        var mineCells = new Array;
        for (var i = 0; i < numberOfCells; i++) {
            mineCells.push(i);
        }
        mineCells.sort(function() {
            return .5 - Math.random();
        });
        return mineCells.slice(0, numberOfMines);
    }

    /**
     * make new settings based on difficulty
     * @param {type} difficulty
     * @returns {undefined}
     */
    function Settings(difficulty) {
        switch (difficulty) {
            default:
            case 'easy':
                this.height = 8;
                this.width = 8;
                this.mines = 10;
                break;
            case 'medium':
                this.height = 16;
                this.width = 16;
                this.mines = 40;
                break;
                break;
            case 'difficult':
                this.height = 30;
                this.width = 16;
                this.mines = 99;
                break;
        }
    }


    /**
     * Cell object 
     * @param {type} x
     * @param {type} y
     * @returns {Cell}
     */
    function Cell(x, y) {
        //x coord
        this.x = x;
        //y coord
        this.y = y;
        //state: 0 not clicked
        this.swept = false;
        this.flagged = false;
        this.neighbourMines = 0;
    }

    /**
     * Empty cell
     * @param {type} x
     * @param {type} y
     * @returns {EmptyCell}
     */
    function EmptyCell(x, y) {
        this.mine = false;
        Cell.call(this, x, y);
    }
    /**
     * For instance of
     * @type @exp;Object@call;create
     */
    EmptyCell.prototype = Object.create(Cell.prototype);

    /**
     * Mine
     * @param {type} x
     * @param {type} y
     * @returns {Mine}
     */
    function Mine(x, y) {
        this.mine = true;
        Cell.call(this, x, y);
    }

    /**
     * For instance of
     * @type @exp;Object@call;create
     */
    Mine.prototype = Object.create(Cell.prototype);
    
    /**
     * Sweep cell, if it has a mine game over and return false
     * @param {type} cell
     * @returns {unresolved}
     */
    this.sweep = function(cell) {
        if( cell.swept ){
            return true;
        }
        if ( cell instanceof EmptyCell ) {
            cell.swept = true;
            emptyCellCount--;
            if (cell.neighbourMines === 0) {
                return this.sweepNeighbourEmptyCells(cell);
            }
            return true;
        }
        this.sweepAll();
        return false;
    };

    /**
     * Sweep all mines, used for gameover event
     * @returns {undefined}
     */
    this.sweepAll = function() {
        for (var x in currentCells) {
            for (var y in currentCells[x]) {
                currentCells[x][y].swept = true;
            }
        }
    };
    
    /**
     * Flag a cell
     * @param {type} cell
     * @returns {undefined}
     */
    this.flag = function(cell) {
        cell.flagged = !cell.flagged;
    };
    
    /**
     * If all neighbour mines are flagged properly, clear adjacent cells
     * @param {type} cell
     * @returns {Boolean}
     */
    this.quickClear = function(cell) {
        if (cell.swept) {
            var flaggedNeighbours = 0;
            for (var j = (cell.x - 1); j <= (cell.x + 1); j++) {
                if (typeof currentCells[j] !== 'undefined') {
                    for (var k = (cell.y - 1); k <= (cell.y + 1); k++) {
                        if (typeof currentCells[j][k] !== 'undefined') {
                            if (currentCells[j][k] instanceof Mine) {
                                if (currentCells[j][k].flagged) {
                                    flaggedNeighbours++;
                                }
                            } else {
                                if (currentCells[j][k].flagged) {
                                    this.sweepAll();
                                    return false;
                                }
                            }
                        }
                    }
                }
            }
            if (flaggedNeighbours === cell.neighbourMines) {
                this.sweepNeighbourEmptyCells(cell);
            }
        }
        return true;
    };

    /**
     * Sweeps neighbour cells, if any of the neighbours have no neighbours, sweep them as well
     * @param {type} cell
     * @returns {undefined}
     */
    this.sweepNeighbourEmptyCells = function(cell) {
        for (var j = (cell.x - 1); j <= (cell.x + 1); j++) {
            if (typeof currentCells[j] !== 'undefined') {
                for (var k = (cell.y - 1); k <= (cell.y + 1); k++) {
                    if (typeof currentCells[j][k] !== 'undefined'
                            && currentCells[j][k] instanceof EmptyCell) {
                        if (!(cell.x === j && cell.y === k) && !currentCells[j][k].swept) {
                            this.sweep(currentCells[j][k]);
                        }
                    }
                }
            }
        }
        return true;
    };
    
    /**
     * Check to see if the game has been won
     * @returns bool
     */
    this.checkWon = function(){
        return !emptyCellCount;
    };

}).call(MineSweeper);