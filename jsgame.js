var style = 
    "<style>\
        #board {\
            display: flex;\
            flex-flow: row nowrap;\
            margin: auto auto;\
            width: 700px;\
        }\
        \
        .grid_view {\
            border: 1px solid black;\
            width: 100px;\
            display: grid;\
            grid-gap: 2px;\
            grid-template-rows: repeat(5, 100px);\
        }\
        \
        .item {\
            border-color: 1px solid black;\
            border-radius: 50%;\
            background-color: white;\
            cursor: pointer;\
            height: 100%;\
            width: 100%;\
        }\
    </style>"


// $('head').append(style)

// Global game variables

var grid

// Generates a new clean grid
function initGrid() {
    grid = []
    for (var list = 0; list < 7; list++) {
        grid.push([])
        for (var item = 0; item < 5; item++) {
            grid[list].push(0)
        }
    }
    return grid
}

var moves = 0

var person1 = prompt("Please enter your name", "Player 1")
var person2 = prompt("Please enter your name", "Player 2")

var PopOut = confirm("Do you want to play mode PopOut ?")

var players = {
    p1: {name: person1, color:'red'},
    p2: {name: person2, color: 'blue'},
    '0': {name: null, color: 'white'}
}

function changePNames() {
    var person1 = prompt("Please enter your name", "Player 1");
    var person2 = prompt("Please enter your name", "Player 2");
    
    players.p1.name = person1
    players.p2.name = person2
    $('#player').html(players[player].name).css('color', players[player].color)
}

var player = 'p1'

// Functions

// ===================================================================================================
// Checks
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

// ===================================================================================================
// Turn and Move
function changeTurn() {
    if (player == 'p1') {
        player = 'p2'
    } else {
        player = 'p1'
    }
    $('#player').html(players[player].name).css('color', players[player].color)
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
        // Add a move to the total
        moves++
        
        // Updates grid and color of the button
        var color = players[player].color
        grid[list][index] = player
        $('[pos="'+ list + ':' + index +'"]').css('background-color', color)

        // Checks for draw, winner and change turn
        if (moves == 35) {
            alert('It is a draw !')
            endGame()
            return
        }

        if (chkWinner(list, index)) {
            alert(players[player].name + ' venceu !');
            endGame()
        } 

        changeTurn()
        
    }
}

// ===================================================================================================
// Start Game
function startGame(grid) {
    initGrid();
    for (var list = 0; list < 7; list++) {
        $('#board').append('<div class="grid_view" list="'+ list +'"></div>')
        for (var item = 4; item >= 0; item--) {
            if (PopOut) {
                $('[list='+ list +']').append('<div onClick="makeMovePop(this)" class="item" pos="'+ list + ':' + item +'"></div>')
            } else {
                $('[list='+ list +']').append('<div onClick="makeMove(this)" class="item" pos="'+ list + ':' + item +'"></div>')
            }
        }
    }
    $('#player').text(players[player].name).css('color', players[player].color)
}

// End Game
function endGame() {
    $('#board').empty();
    moves = 0  ;
    startGame();

    return true
}

// ===================================================================================================
// Pop Out
function colorCascade(x) {
    for (var y = 0; y < 5; y++) {
        var color = players[grid[x][y].toString()].color
        if (color == 'red' || color == 'blue') {
            $('[pos="'+ x + ':' + y +'"]').css('background-color', players[grid[x][y]].color)
        } else {
            $('[pos="'+ x + ':' + y +'"]').css('background-color', 'white')
        }
    }
}

function makeMovePop(button) {
    // Get the positions of the button
    var positions = $(button).attr('pos').split(':')
    var x = positions[0]
    var y = positions[1]
    var index = 0

    // Checks if the button was at the bottom
    // and if its the same as the player
    var popped = false
    var invalid = false
    if (y == 0 && grid[x][y] == player) {
        grid[x].splice(0, 1);   // Removes first element of the column
        grid[x].push(0);        // inserts a clean one at the end
        colorCascade(x);        // Updates the colors
        popped = true
    } else {                    // Same logic as a normal play
        while (grid[x][index] != 0) {
            index++
            if (index > grid[x].length) { invalid = true; break }
        }
    }

    if (invalid) { alert('Movimento Inválido') } 
    else {
                    // If popped removes a move
        if (popped) { 
            moves-- 
        } else {    // Else updates the color of the pressed button 
            moves++ 

            var color = players[player].color
            grid[x][index] = player
            $('[pos="'+ x + ':' + index +'"]').css('background-color', color)
        }

        // Checks for draw then winner then change turn
        // Draw disabled for pop out
        // if (moves == 35) {
        //     alert('It is a draw !')
        //     finished = endGame()
        //     return
        // }

        for (var x = 0; x < 7; x++) {
            for (var y = 0; y < 5; y++) {
                if (chkWinner(x, y)) {
                    alert(players[grid[x][y]].name + ' venceu !');
                    endGame()
                    return
                }
            }
        }
        
        changeTurn()
    }
}
// ===================================================================================================

// Starts the grid and checks the button click
startGame(grid);
