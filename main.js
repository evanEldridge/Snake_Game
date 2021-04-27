$(document).ready(function() {

    let gameLength = 30;

    let speed = 100;

    let snakePos = [0,14,1,14,2,14];

    let oldHeadX = snakePos[snakePos.length - 2];
    let oldHeadY = snakePos[snakePos.length - 1];

    let oldTailX = snakePos[0];
    let oldTailY = snakePos[1];

    let appleX = parseInt(Math.random() * gameLength);
    let appleY = parseInt(Math.random() * gameLength);

    let currentDirection = "";
    let lastDirection = "";

    let appleEaten = false;

    let applesEaten = 0;
    let highScore = 0;

    let timerId = null;

    let gameOver = false;

    function instructions() {
        $( "#instructions" ).dialog({
            autoOpen: false,
            buttons: {
                Ok: function() {
                  $( this ).dialog( "close" );
                }
            }
        });

        $("#instructions").dialog('open');
    }

    function endGame() {
        if (applesEaten > highScore) {
            highScore = applesEaten;
        }

        $( "#game_over p:eq(0)").text("Your score:" + applesEaten);
        $( "#game_over p:eq(1)").text("Your high score:" + highScore);

        $( "#game_over" ).dialog({
            autoOpen: false,
            buttons: {
                Ok: function() {
                  $( this ).dialog( "close" );
                  newGame();
                }
            }
        });

        $("#game_over").dialog('open');
    }

    function eraseGameArea() {
        for (let i = 0; i < gameLength; i++) {
            $("tr").remove();
        }
    }

    function drawGameArea() {
        for (let i = 0; i < gameLength; i++) {
            $("#game_area").append("<tr class='tr" + i + "'></tr>");

            for (let j = 0; j < gameLength; j++) {
                $(".tr" + i).append("<td class='td" + j + "'></td>");
            }
        }
    }

    function drawApple() {
        appleX = parseInt(Math.random() * gameLength);
        appleY = parseInt(Math.random() * gameLength);

        $(".tr" + appleY + " > " + ".td" + appleX).css("background-color", "red"); 
    }

    function drawSnake() {
        for (let i = 0; i < snakePos.length - 1; i = i + 2) {
            $(".tr" + snakePos[i+1] + " > " + ".td" + snakePos[i]).css("background-color", "white");
        }

        eraseSnake();
    }

    function eraseSnake() {
        $(".tr" + oldHeadY + " > " + ".td" + oldHeadX).css("background-color", "rgb(36, 36, 36)");
    }

    function appleTest() {
        for (let i = 0; i < snakePos.length - 1; i = i + 2) {
            if (snakePos[i] == appleX && snakePos[i+1] == appleY) {

                appleEaten = true;
                applesEaten++;

                oldTailX = snakePos[0];
                oldTailY = snakePos[1];

                drawApple();
            }
        }
    }

    function hitWalls() {
        if (snakePos[snakePos.length - 2] == -1 || snakePos[snakePos.length - 2] == 30 || snakePos[snakePos.length - 1] == -1 || snakePos[snakePos.length - 1] == 30) {
            return true;
        }

        else { return false; }
    }

    function hitSelf() {
        for (let i = 0; i < snakePos.length - 3; i = i + 2) {
            if (snakePos[snakePos.length - 2] == snakePos[i] && snakePos[snakePos.length - 1] == snakePos[i+1]) {
                return true;
            }
        }

        return false;
    }

    function aliveTest() {
        let test1 = hitWalls();
        let test2 = hitSelf();

        if (test1 == false && test2 == false) {
            drawSnake();
        }

        else {
            clearInterval(timerId);
            timerId = null;
            gameOver = true;
            endGame();
        }
    }

    function updateSnakePos() {
        oldHeadX = snakePos[snakePos.length - 2];
        oldHeadY = snakePos[snakePos.length - 1];

        let tempX = 0;
        let tempY = 0;

        lastDirection = currentDirection;

        if (lastDirection == "right") {
            snakePos[snakePos.length - 2] = snakePos[snakePos.length - 2] + 1;
        }

        if (lastDirection == "left") {
            snakePos[snakePos.length - 2] = snakePos[snakePos.length - 2] - 1;
        }

        if (lastDirection == "up") {
            snakePos[snakePos.length - 1] = snakePos[snakePos.length - 1] - 1;
        }

        if (lastDirection == "down") {
            snakePos[snakePos.length - 1] = snakePos[snakePos.length - 1] + 1;
        }

        for (let i = 3; i < snakePos.length; i = i + 2) {
            tempX = snakePos[snakePos.length - (i+1)];
            tempY = snakePos[snakePos.length - i];

            snakePos[snakePos.length - (i+1)] = oldHeadX;
            snakePos[snakePos.length - i] = oldHeadY;

            oldHeadX = tempX;
            oldHeadY = tempY;
        }

        if (appleEaten == true) {
            snakePos.unshift(oldTailY);
            snakePos.unshift(oldTailX);

            appleEaten = false;
        }

        appleTest();
        aliveTest();
    }

    function newGame() {

        snakePos = [0,14,1,14,2,14];
        oldHeadX = 0;
        oldHeadY = 0;
        oldTailX = snakePos[0];
        oldTailY = snakePos[1];
        appleX = parseInt(Math.random() * gameLength);
        appleY = parseInt(Math.random() * gameLength);
        currentDirection = "";
        lastDirection = "";
        appleEaten = false;
        applesEaten = 0;
        timerId = null;
        gameOver = false;

        eraseGameArea();
        drawGameArea();

        drawApple();

        drawSnake();

        oldHeadX = snakePos[snakePos.length - 2];
        oldHeadY = snakePos[snakePos.length - 1];

    }

    instructions();

    newGame();

    document.addEventListener("keydown", function(event) {
        if (gameOver == false) {
            if (event.key == "ArrowRight" && lastDirection != "left") {
                currentDirection = "right";
                clearInterval(timerId);
                timerId = setInterval(updateSnakePos, speed);
            }

            if (event.key == "ArrowLeft" && lastDirection != "right") {
                currentDirection = "left";
                clearInterval(timerId);
                timerId = setInterval(updateSnakePos, speed);
            }

            if (event.key == "ArrowUp" && lastDirection != "down") {
                currentDirection = "up";
                clearInterval(timerId);
                timerId = setInterval(updateSnakePos, speed);
            }

            if (event.key == "ArrowDown" && lastDirection != "up") {
                currentDirection = "down";
                clearInterval(timerId);
                timerId = setInterval(updateSnakePos, speed);
            }
        }
    });

});