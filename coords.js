const color = require('@nuff-said/color');

// Define the Cartesian Plane globally
const cartesianPlane = [];
const snake = [{ x: 2, y: 3 }];

// Define initial coordinates for "@"
let dir = undefined;
let score = 0;
const h = 40;//process.stdout.rows - 4;     //heihgt
const w = 40;//process.stdout.columns / 3;       //width

// Define initial coordinates for "#"
let food_x = getRandomInt(1, w);
let food_y = getRandomInt(1, h);

// Function to place a character at given coordinates
function placeCharacter(snake, char) {

    for (const block of snake) {
        const index = block.y * h + block.x;
        cartesianPlane[index] = char;
    }


}

// Function to erase the character from the previous position
function eraseCharacter(snake) {

    for (const block of snake) {
        const index = block.y * h + block.x;
        cartesianPlane[index] = undefined;
    }


}

// Function to get a random integer between min (inclusive) and max (exclusive)
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// Function to draw the Cartesian Plane with characters
function drawPlane() {
    for (let y = h - 1; y >= 0; y--) {
        let row = '';
        for (let x = 1; x < w + 1; x++) {
            const index = y * h + x;
            const point = cartesianPlane[index];
            if (point === undefined) {
                row += color.dim(". ");
            } else{
                row += point + "";
            }
        }
        console.log(row);
    }
}

// Place character "@" at initial coordinates
placeCharacter(snake, color.green("@ "));

// Place character "#" at initial coordinates
placeCharacter([{ x: food_x, y: food_y }], color.redBr('# '));

// Draw the Cartesian Plane with characters
drawPlane();

// Directional control for "@"
var stdin = process.stdin;
stdin.setRawMode(true);
stdin.resume();
stdin.setEncoding('utf8');



function move() {

    console.log(snake)

    const head = { x: snake[0].x, y: snake[0].y }

    eraseCharacter([snake.pop()]);
    if (dir == "up") head.y = head.y + 1;
    if (dir == "right") head.x = head.x + 1;
    if (dir == "down") head.y = head.y - 1;
    if (dir == "left") head.x = head.x - 1;
    if (head.x > w) head.x = 1;
    if (head.x < 1) head.x = w;
    if (head.y > h) head.y = 0;
    if (head.y < 0) head.y = h;


    const bodHasCollided = snake.slice(1).find(function(body){
    
        if (head.x === body.x && head.y === body.y) {return true}
        else return false
    })

    if (bodHasCollided) console.clear(), console.log(color.red(color.blink("Game Over Lol!"))), process.exit()


    if (head.x === food_x && head.y === food_y) {

        snake.push({ x: food_x, y: food_y });

        // If they do, re-randomize the coordinates of "#"
        food_x = getRandomInt(1, w);
        food_y = getRandomInt(1, h);

        while (cartesianPlane[food_y * h + food_x]) food_x = getRandomInt(1, w), food_y = getRandomInt(1, h);

        // Place "#" at the new coordinates
        placeCharacter([{ x: food_x, y: food_y }], color.redBr('# '));
        score = score + 1;

    }

    snake.unshift(head)

    // Place "@" at its new coordinates
    placeCharacter(snake, color.green("@ "));

    // Clear the console and draw the updated Cartesian Plane
    console.clear();
    drawPlane();

    // console.log(dir);
    // console.log(head);
    // console.log(food_x, food_y);
    console.log("score:", score)

}



stdin.on('data', function (key) {

    // Move "@" according to the key pressed
    if (key === '\u001B\u005B\u0041') {

        if (dir != "down") dir = "up"
    }
    if (key === '\u001B\u005B\u0043') {

        if (dir != "left") dir = "right"

    }
    if (key === '\u001B\u005B\u0042') {

        if (dir != "up") dir = "down"

    }
    if (key === '\u001B\u005B\u0044') {

        if (dir != "right") dir = "left"

    }


    if (key === '\u0003') {
        process.exit(); // ctrl-c to exit
    }
});

setInterval(move, 100)