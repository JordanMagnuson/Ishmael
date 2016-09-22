$(document).ready(function() {
    gameBoard = setUpBoard();
    $('.difficulty_button').click(function(e) {
        if (app.gameOptionsAlreadyclicked === false) { //prevents a rare bug if gameoptions is dblclicked
            difficulty = e.target.id;
            who_starts();
            countdownAnimation();
            app.gameOptionsAlreadyclicked = true;
            console.log("Loading " + difficulty + " computer");
        }
    });

    $(".game_table").click(function(e) {
        var IDOfCellClicked = e.target.id;
        playerMove(IDOfCellClicked);
    });

    $('#next_round').click(function() {
        clearBoard();
    });

    $('#switch_player').click(function() {
        app.round--;
        clearBoard();
    });

    $('#home').click(function() {
        location.reload();
    });
});

var app = app || {};
app.turn = 1;
app.round = 1;
app.player1Score = 0;
app.player2Score = 0;
app.isRoundInProgress = true;
app.gameOptionsAlreadyclicked = false;
app.startingPlayer = null;
app.currentPlayer = null;
//App is designed to allow 'class' type variables to minimise the need for unnecessary parameter passing.


function countdownAnimation() {
    $('.game_in_play').fadeIn();
    $('.game_control').fadeOut(500);
    var countDownFrom = 4;
    setTimeout(function(){
        $('#countdown').delay(500).text("5...").fadeIn(500).fadeOut(500);
        var countDown = setInterval(function() {
            $('#countdown').text(countDownFrom + "...").fadeIn(500).fadeOut(500);
            countDownFrom--;
            if (countDownFrom <= 0) {
                clearTimeout(countDown);
            }
        }, 1000);
        $('#rolling').fadeIn(500).delay(4000).fadeOut(500);
        $('#starting_player_is').delay(5000).fadeIn(500).text("The starting player is " + app.startingPlayer);
        $('#begun, #play_happening, .game_table, #home, #score, #next_round').delay(5000).fadeIn(500);
        setupScoreBoard();
        $('#next_round').attr("disabled", "disabled");
 }, 500);
}

function setupScoreBoard() {
    if (difficulty === "human") {
        $('#title_score1').text("Player 1 Score");
        $('#title_score2').text("Player 2 Score");
    }
    else {
        $('#title_score1').text("Computer Score");
        $('#title_score2').text("Player Score");
    }
}

function setUpBoard() {

    var gameBoard = new Array(9);
    for (var i = 0; i < gameBoard.length; i++) {
        gameBoard[i] = null;
    }
    return gameBoard;
}


function who_starts() { //Could this be written shorter?
    var randomPlayer = Math.floor(Math.random() * 2 + 1);
    if (difficulty !== "human") {
        if (randomPlayer === 1) {
            app.startingPlayer = "The Computer of Doom!";
            app.currentPlayer = 'X';
            AIPlay();
        } else {
            app.startingPlayer = "The Human";
            app.currentPlayer = 'O';
        }
    } else {
        if (randomPlayer === 1) {
            app.startingPlayer = "Player 1";
            app.currentPlayer = 'X';
        } else {
            app.startingPlayer = "Player 2";
            app.currentPlayer = 'O';
        }
    }
}


function changePlayer() {
    if (app.currentPlayer === 'X') {
        app.currentPlayer = 'O';
    } else {
        app.currentPlayer = 'X';
    }
    $('#starting_player_is').text(app.currentPlayer + " It's your turn");
}


function changeStartingPlayer() {
    if (app.startingPlayer == ("The Computer of Doom!")) {
        app.startingPlayer = "The Human";
        app.currentPlayer = 'O';
    } else if (app.startingPlayer === "The Human") {
        app.startingPlayer = "The Computer of Doom!";
        app.currentPlayer = 'X';
    } else if (app.startingPlayer === "Player 1") {
        app.startingPlayer = "Player 2";
        app.currentPlayer = 'O';
    } else if (app.startingPlayer === "Player 2") {
        app.startingPlayer = "Player 1";
        app.currentPlayer = 'X';
    }
}



function playerMove(IDOfCellClicked) {
    if (app.isRoundInProgress === true) {
        if (gameBoard[IDOfCellClicked] === null) { // checks if position on board has already been played
            gameBoard[IDOfCellClicked] = app.currentPlayer; // UPDATING THE ARRAY
            $('#' + IDOfCellClicked).prepend(app.currentPlayer);
            app.turn++;
            if (checkForWin()) {
                if (difficulty === "AICheater") {
                    for (var i = 0; i < 9; i++) {
                        gameBoard[i] = 'X'; // Take all the cells
                        $('#' + i).text('X').css('background-color','red');
                    }
                    changePlayer();
                    roundWon();
                    alert("MUHAHAHAHA... YOU THINK YOU WIN????? WRONG I DO!");
                } else {
                    roundWon();
                }
            } else if (checkForDraw()) {
                roundDrew();
            } else {
                changePlayer();
                app.isRoundInProgress = false; //PLAYER CANNOT PLAY WHILE AI IS "THINKING"
                setTimeout(function() {
                    app.isRoundInProgress = true;
                    AIPlay();
                }, 500);
            }
        }
    }
}


function clearBoard() {
    app.round++;
    app.turn = 0; //should be 1
    app.isRoundInProgress = true;
    changeStartingPlayer();
    for (var i = 0; i < 9; i++) { // Clearing the array
        gameBoard[i] = null;
    }
    $('.game_table td').empty().css("background-color", "transparent"); //Clear the table visuals and cell highlighting
    $('#starting_player_is').text(app.startingPlayer + " will start this round.");
    $('#begun').text("The game continues! Round " + app.round);
    if (app.currentPlayer === "X") {
        AIPlay();
    }
    $('#next_round').attr("disabled", "disabled");
    console.log(app.turn);
}


function checkForWin() {

    // check col win
    for (var i = 0; i < 3; i++) {
        if (gameBoard[i] === app.currentPlayer && gameBoard[i + 3] === app.currentPlayer && gameBoard[i + 6] === app.currentPlayer) {
            winningCells = [i, i + 3, i + 6]; //For CSS coloring
            return true;
        }
    }
    // check row win
    for (var j = 0; j < 9; j += 3) {
        if (gameBoard[j] === app.currentPlayer && gameBoard[j + 1] === app.currentPlayer && gameBoard[j + 2] === app.currentPlayer) {
            winningCells = [j, j + 1, j + 2];
            return true;
        }
    }
    // check diagonal win
    for (var k = 0; k <= 2; k += 2) {
        if (gameBoard[k] === app.currentPlayer && gameBoard[4] === app.currentPlayer && gameBoard[8 - k] === app.currentPlayer) {
            winningCells = [k, 4, 8 - k];
            return true;
        }
    }
    return false;
}


function checkForDraw() {
    //if all elements are not null then unless a win, it must be a draw
    for (var i = 0; i < 9; i++) {
        if (gameBoard[i] === null) {
            return false;
        }
    }
    return true;
}


function roundDrew() {
    $('#starting_player_is').text("It's a draw!").fadeIn(100);
    endRound();
}


function roundWon() {
    $('#starting_player_is').text(app.currentPlayer + " Takes The Round!").fadeIn(100);
    console.log("winning cells where " + winningCells);
    updateScore();
    endRound();
    for (var i = 0; i < 3; i++) { //Look into using .each or similar rather than a for loop
        $("#" + winningCells[i]).css("background-color", "red");
    }
}


function endRound() {
    app.isRoundInProgress = false;
    $('#next_round').attr("disabled", false);
}


function updateScore() {
    if (app.currentPlayer === 'X') {
        app.player1Score++;
        $('#score1').text(app.player1Score);
    } else if (app.currentPlayer === 'O') {
        app.player2Score++;
        $('#score2').text(app.player2Score);
    }
}


//SEPERATE THIS INTO A DIFFERENT FILE CALLED AI.JS


function AIPlay() {
    if (difficulty === "easy" && app.isRoundInProgress === true) {
        AIEasy();
    } else if (difficulty === "intermediate" && app.isRoundInProgress === true) {
        AIIntermediate();
    } else if (difficulty === "AIHardDefending" && app.isRoundInProgress === true) {
        AIHardDefending();
    } else if (difficulty === "AICheater" && app.isRoundInProgress === true) {
        AICheater();
    }
    app.turn++;
}


function isComputerAbleToWin() {
    //The computer plays in any open cell. It then checks if that cell will cause it to win.
    //If the cell will cause a win return the id of that cell otherwise clear the cell.
    for (var x = 0; x < 9; x++) {
        if (gameBoard[x] === null) {
            gameBoard[x] = app.currentPlayer;
            if (checkForWin()) {
                $('#' + x).prepend(app.currentPlayer);
                return true;
            } else {
                gameBoard[x] = null;
            }
        }
    }
    return false;
}

function doesComputerNeedToBlock() {
    //The computer plays as the human in any open cell. It then checks if that cell will cause a human win.
    //If the cell will cause a human win return the id of that cell. Then clear the cell.
    for (var p = 0; p < 9; p++) {
        changePlayer();
        if (gameBoard[p] === null) {
            gameBoard[p] = app.currentPlayer;
            if (checkForWin()) {
                gameBoard[p] = null;
                humanAbleToWinAt = p;
                changePlayer();
                return true;
            } else {
                changePlayer();
                gameBoard[p] = null;
            }
        } else {
            changePlayer();
        }
    }
}


function playRandomly() {
    var findingFreeCell = true;
    while (findingFreeCell) { //while works better than a for loop because the ending is uncertain.
        var randomMove = Math.floor(Math.random() * 9); // COME UP WITH A RANDOM NUMBER 0-8
        if (gameBoard[randomMove] === null) {
            gameBoard[randomMove] = app.currentPlayer; // Updating the array
            $('#' + randomMove).prepend(app.currentPlayer);
            findingFreeCell = false;
            if (checkForWin()) {
                roundWon();
            } else if (checkForDraw()) {
                roundDrew();
            }
            changePlayer();
            console.log("Computer played randomly");
        }
    }
}

function AIEasy() {
    if (isComputerAbleToWin()) {
        roundWon();
        console.log("Computer played to win");
    } else {
        playRandomly();
    }
}


function AIIntermediate() {
    if (isComputerAbleToWin()) {
        roundWon();
        console.log("computer played to win");
    } else if (doesComputerNeedToBlock()) {
        //computer plays in blocking cell
        gameBoard[humanAbleToWinAt] = app.currentPlayer; // Updating the array
        $('#' + humanAbleToWinAt).prepend(app.currentPlayer);
        console.log("computer played to block human win");
        changePlayer();
        if (checkForDraw()) { //In case computer draws whilist blocking human win
            roundDrew();
        }
    } else {
        playRandomly();
    }
}

function getARandomOption(arrayOfOptions) {
    //This function is used to randomise a selection of possible moves for the AI
    for (var i = arrayOfOptions.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = arrayOfOptions[i];
        arrayOfOptions[i] = arrayOfOptions[j];
        arrayOfOptions[j] = temp;
    }
    return arrayOfOptions[0];
}



function AIHardDefending() {
    console.log(app.turn);
    //This is loaded when the computer plays 2nd. The computer is aiming to draw.
    if (isComputerAbleToWin()) {
        //computer plays in winning cell
        roundWon();
        console.log("computer played to win");
    } else if (doesComputerNeedToBlock()) {
        //computer plays in blocking cell
        gameBoard[humanAbleToWinAt] = app.currentPlayer; // Updating the array
        $('#' + humanAbleToWinAt).prepend(app.currentPlayer);
        console.log("computer played to block human win");
        changePlayer();
        if (checkForDraw()) { //Necessary in case computer draws whilist blocking human win
            roundDrew();
        }
    } else if (gameBoard[4] === null) {
        gameBoard[4] = app.currentPlayer;
        $('#' + 4).prepend(app.currentPlayer);
        changePlayer();
        console.log("Computer took the center to be defensive");
    } else if (gameBoard[2] === 'O' && gameBoard[6] === 'O' && app.turn === 3) { //prevents an incorrect corner play
        gameBoard[3] = app.currentPlayer; //could use a randomizer here, could add to next else if
        $('#' + 3).prepend(app.currentPlayer);
        changePlayer();
        console.log("Computer took 3 to prevent alt corn 2 way win");
    } else if (gameBoard[0] === 'O' && gameBoard[8] === 'O' && app.turn === 3) {
        gameBoard[5] = app.currentPlayer;
        $('#' + 5).prepend(app.currentPlayer);
        changePlayer();
        console.log("Computer took 5 to prevent alt corn 2 way win");
    }
    //can still lose if human takes center
    else if (gameBoard[4] === 'O' && app.turn == 1) {
        gameBoard[6] = app.currentPlayer;
        $('#' + 6).prepend(app.currentPlayer);
        changePlayer();
        console.log("Computer took 6 to prevent middle triangle win");
    } else if (gameBoard[4] === 'O' && app.turn == 3) {
        gameBoard[8] = app.currentPlayer;
        $('#' + 8).prepend(app.currentPlayer);
        changePlayer();
        console.log("Computer took 8 to prevent middle triangle win");
    } else {
        playRandomly();
    }

}


function AICheater() {
    //This code is pretty long to make the computer try to cheat without the player noticing. It slowly gets more obvious :)
    if (isComputerAbleToWin()) {
        roundWon();
        console.log("computer played to win");
        return;
    } else if (doesComputerNeedToBlock()) {
        //computer plays in blocking cell
        gameBoard[humanAbleToWinAt] = app.currentPlayer; // Updating the array
        $('#' + humanAbleToWinAt).text(app.currentPlayer);
        console.log("computer played to block human win");
        changePlayer();
    } else {
        playRandomly();
    }
    if (doesComputerNeedToBlock() && app.turn > 5) {
        //computer plays in blocking cell
        changePlayer();
        gameBoard[humanAbleToWinAt] = 'X'; // Updating the array
        $('#' + humanAbleToWinAt).text('X');
        console.log("The human is attempting a 2 way win - Computer cheated to block it");
        changePlayer();
    } else if (app.turn == 6) {
        changePlayer();
        possibilities = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        cheatingMove = getARandomOption(possibilities);
        gameBoard[cheatingMove] = 'X'; // Play a 2nd time. Steal the cell if taken
        $('#' + cheatingMove).text('X');
        console.log("computer cheated at " + cheatingMove);
        changePlayer();
        app.turn++;
    } else if (app.turn == 5 && doesComputerNeedToBlock()) {
        changePlayer();
        possibilities = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        cheatingMove = getARandomOption(possibilities);
        gameBoard[cheatingMove] = 'X'; // Play a 2nd time. Steal the cell if taken
        $('#' + cheatingMove).text('X');
        console.log("computer cheated at " + cheatingMove);
        changePlayer();
        app.turn++;
    } else if ((app.turn == 7 || app.turn == 8) && (gameBoard[4] !== 'X')) {
        changePlayer();
        gameBoard[4] = 'X'; // Steal the center
        $('#' + 4).text('X');
        app.turn++;
        console.log("computer cheated by stealing 4");
        changePlayer();
    } else if ((app.turn == 7 || app.turn == 8) && (gameBoard[8] !== 'X')) {
        changePlayer();
        gameBoard[6] = 'X'; // Steal 6 instead of the center
        $('#' + 6).text('X');
        app.turn++;
        console.log("computer cheated by stealing 6");
        changePlayer();
    } else if ((app.turn == 7 || app.turn == 8) && (gameBoard[2] !== 'X')) {
        changePlayer();
        gameBoard[6] = 'X'; // Steal 4 instead of the center
        $('#' + 6).text('X');
        app.turn++;
        console.log("computer cheated by stealing 6");
        changePlayer();
    }
    if (checkForWin()) {
        roundWon();
    } else if (checkForDraw() && app.round > 10) {
        for (var i = 0; i < 9; i++) {
            gameBoard[i] = 'X'; // Take all the cells
            $('#' + i).text('X');
        }
        roundWon();
        alert("Muhahahaa FOR NO REASON AT ALL - I DECIDE TO WIN!");
    }
    changePlayer();
    if (checkForWin()) { //if human can win then the AI just wins
        roundWon();
    }
    changePlayer();
    console.log(app.turn);
}
