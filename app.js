import { canvas, ctx } from './canvas.js';
import { getCoords , frame } from './function.js';


/**
 * Coords & Inits
 */

// sounds
const breaking = document.getElementById("breaking");
const pass = document.getElementById("pass")

// interval
const intervalID = setInterval(draw, 10)

// score
let points = 0;

// ball start coords

let ballX = canvas.width/2;
let ballY = 500;

// ball speed
let newBallX = 0;
let newBallY = 3;

// board start coords
let boardX = (canvas.width-100)/2;
let boardY = canvas.height-40;
const boardW = 100;
const boardH = 20;

// bricks
let bricksD;
let nRows;
let nCols;
let padding;
let brickW;
let brickH;

function initBricks(){
    nRows = 4;
    nCols = 8;
    padding = 70;
    brickW = (canvas.width - padding) / nCols - padding;
    brickH = 50;

    bricksD = new Array(nRows);
    for (let i = 0; i < nRows; i++) {
        bricksD[i] = new Array(nCols);
        for (let j = 0; j < nCols; j++) {
            bricksD[i][j] = 1;
        }
    }
}

/**
 * bouger la planche avec le clavier
 */

//init touche
const keyboard = {}
keyboard.left = false
keyboard.right = false

document.addEventListener('keydown', (_event) =>
{
    //console.log(_event.code)

    switch(_event.code)
    {
        case 'ArrowRight':
            keyboard.right = true
    }
    switch(_event.code)
    {
        case 'ArrowLeft':
            keyboard.left = true
    }
})

document.addEventListener('keyup', (_event) =>
{
    //console.log(_event.code)

    switch(_event.code)
    {
        case 'ArrowRight':
            keyboard.right = false
    }
    switch(_event.code)
    {
        case 'ArrowLeft':
            keyboard.left = false
    }
})


/**
 * Draw
 */

 // score
function score() {
    ctx.font = "24px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: "+points, 30, 40 );
}

// board
function board() {
    ctx.beginPath();
    ctx.rect(boardX, boardY, boardW, boardH);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}
// ball
function ball() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, 10, 0, Math.PI*2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}
// bricks

function bricks() {
    for (let i = 0; i < nRows; i++) {
        for (let j = 0; j < nCols; j++) {
            if (bricksD[i][j] == 1) { 
                ctx.beginPath();
                ctx.rect((j * (brickW + padding)) + padding, (i * (brickH + padding)) + padding, brickW, brickH);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}


// draw ( loop )

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ball();
    board();
    bricks();
    score();
    
    // Update ball
    ballX += newBallX;
    ballY += newBallY;
    if(ballY + newBallY - 5 < 0) {
        newBallY = -newBallY;
    }
    if(ballX + newBallX + 5 > canvas.width || ballX + newBallX - 5 < 0) {
        newBallX = -newBallX;
    }
    if( ballY + newBallY + 5 > boardY && ballX + newBallX > boardX && ballX + newBallX < boardX + boardW){
        newBallX = 8 * ((ballX-(boardX+boardW/2))/boardW);
        newBallY = -newBallY;
    }
    if(ballY + newBallY + 5 > canvas.height){
        clearInterval(intervalID);
        alert("GAME OVER\nVotre score: " + points);
        document.location.reload();
    }

    // collisions
    let rowheight = brickH + padding;
    let colwidth = brickW + padding;
    let row = Math.floor(ballY/rowheight);
    let col = Math.floor(ballX/colwidth);

    // conditions + demolition
    if (ballY < nRows * rowheight && row >= 0 && col >= 0 && bricksD[row][col] == 1) {
        newBallY = -newBallY;
        bricksD[row][col] = 0;
        points++;
        breaking.addEventListener("ended",function(){
            pass.volume = 0.7;
            pass.play()
        })
        breaking.play();
        if(points == 32){
            clearInterval(intervalID);
            alert("You win bro");
            document.location.reload();
        }
    }
    
    // controle direction avec le clavier
    if(keyboard.left == false && keyboard.right == true){
        boardX += 6;
    }

    if(keyboard.left == true && keyboard.right == false){
        boardX += -6;
    }
    
    /**
     * detection pinch + direction
     */

     if(frame.hands.length > 0){
        console.log(frame.hands)
        //console.log(frame.hands[0].pinchStrength)
        //console.log(frame.hands[0].palmPosition[0])
        if(frame.hands[0].pinchStrength > 0.91){
            boardX = frame.hands[0].palmPosition[0]*3 + (canvas.height + 75) ;
        }
     }
    
}



initBricks()