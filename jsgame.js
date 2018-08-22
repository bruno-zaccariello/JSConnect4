// Global game variables

var grid = [
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    ]

function resetGrid() {
    for (var list = 0; list < grid.length; list++) {
        for (var el = 0; el < grid[list].length; el++) {
            grid[list][el] = 0
        }
    }
    return grid
}

var person1 = prompt("Please enter your name", "Player 1");
var person2 = prompt("Please enter your name", "Player 2");

var players = {
    p1: {name: person1, color:'red'},
    p2: {name: person2, color: 'blue'}
}

var turn = 'p1'

function chkSequence(a, b, c, d) {
    return ( (a != 0) && (a == b) && (a == c) && (a == d) )
}

function chkRightDiagonals() {
    for (var x = 0; x <= 3; x++) {
        for (var y of [3, 4]) {
            if (chkSequence(grid[x][y], grid[x+1][y-1], grid[x+2][y-2], grid[x+3][y-3])) {
                return true
            }
        }
    }
    return false
}

function chkLeftDiagonals() {
    for (var x = 6; x >= 3; x--) {
        for (var y of [3, 4]) {
            if (chkSequence(grid[x][y], grid[x-1][y-1], grid[x-2][y-2], grid[x-3][y-3])) {
                return true
            }
        }
    }
    return false
}

function chkWinner(x, y) {
    var x = parseInt(x)
    var y = parseInt(y)
    // Check Down
    if (y >= 3) {
        if (chkSequence(grid[x][y], grid[x][y-1], grid[x][y-2], grid[x][y-3])) {
            return true
        }
    } // Check Sides
    else {
        // Check Left
        if (x <= 3) {
            if (chkSequence(grid[x][y], grid[x+1][y], grid[x+2][y], grid[x+3][y])) {
                return true
            }
        }
        //Check Right
        if (x >= 3) {
            if (chkSequence(grid[x][y], grid[x-1][y], grid[x-2][y], grid[x-3][y])) {
                return true
            }
        }
    }
    if (chkRightDiagonals() || chkLeftDiagonals()) {
        return true
    }
    return false
}

function changeTurn() {
    if (turn == 'p1') {
        turn = 'p2'
    } else {
        turn = 'p1'
    }
    $('#player').html(players[turn].name).css('color', players[turn].color)
}

function makeMove(button) {
    // Get the list clicked
    // set the index to the start (from bottom to up)
    var positions = $(button).attr('pos').split(':')
    var list = positions[0]
    var index = 0

    // Make the index travel upwards
    // Searching for the first empty spot
    var invalid = false
    while (grid[list][index] != 0) {
        index++
        if (index > grid[list].length) { invalid = true; break }
    }

    // Warning of invalid move if the list is full
    if (invalid) { alert('Movimento Inválido') } 
    else {
        // Updates grid and color of the buttonturn
        var color = players[turn].color
        grid[list][index] = color
        $('[pos="'+ list + ':' + index +'"]').css('background-color', color)

        // Check if it was a winning play and end the game or
        // updates the turn
        if (chkWinner(list, index)) {
            alert(players[turn].name + ' venceu !');
            endGame()
        } else {
            changeTurn()
        }
    }
}

function endGame() {
    $('#board').empty();
    resetGrid();
    startGame();
}

// Make the game grid
function startGame(grid) {
    for (var list = 0; list < 7; list++) {
        $('#board').append('<div class="grid_view" list="'+ list +'"></div>')
        for (var item = 4; item >= 0; item--) {
            $('[list='+ list +']').append('<div onClick="makeMove(this)" class="item" pos="'+ list + ':' + item +'"></div>')
        }
    }
    $('#player').text(players[turn].name).css('color', players[turn].color)
}

// Starts the grid and checks the button click
startGame(grid);
