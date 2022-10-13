//board

var screen_width = window.innerWidth;
var screen_height = window.innerHeight;
// console.log(screen_width);
// console.log(screen_height);

// default (width, height) = (1536, 722)
var blockSize = Math.floor(45 / 1536 * screen_width);
var blockSize = 45;
var rows = 10;
var cols = 15;
var board;
var context; 

//snake head
var snakeX = blockSize * 5;
var snakeY = blockSize * 5;

var velocityX = 1;
var velocityY = 0;
var speed = 1;//1 is unit

var snakeBody = [];

//food
var foodX;
var foodY;

var gameOver = false;
// Image.prototype.rotate = function(angle) {
//     var c = document.createElement("canvas");
//     c.width = this.width;
//     c.height = this.height;    
//     var ctx = c.getContext("2d");    
//     ctx.rotate(angle);
//     var imgData = ctx.createImageData(this.width, this.height);
//     ctx.putImageData(imgData);
//     return new Image(imgData);
// }
var food = new Image();
food.src = "./elements/food.png";
food.width = blockSize;
food.height = blockSize * 2;
food.style = "transform: rotate(90deg)";
var arrow_key = new Image();
arrow_key.src = "./elements/arrow key.png";
arrow_key.width = blockSize * rows / 2;
arrow_key.height = blockSize * rows / 2;
var rule_board = new Image();
rule_board.src = "./elements/guide_to_play.png";
// rule_board.width = 1366 / 2;
// rule_board.height = 768 / 2;
// console.log(rule_board.width);
var snake_img = [
    new Image(), new Image(), new Image()
]
snake_img[0].src = "./elements/snake_head_1.png";
snake_img[1].src = "./elements/snake_body_1.png";
snake_img[2].src = "./elements/snake_tail_1.png";
for (let i = 0; i < 3; i++){
    snake_img[i].height = blockSize;
    snake_img[i].width = blockSize;
}

var sector_gift = [
    new Image(), new Image(), new Image(), new Image(),
    new Image(), new Image(), new Image()
]

for(let i = 0; i < 7; i++){
    sector_gift[i].src = "./elements/"+ String((i % 5) + 5)  +".png";
    // sector_gift[i].width = blockSize;
    // sector_gift[i].height = sector_gift[i].width * 2;
}

// document.getElementById("winner").width = 0.7 * screen_width;
var winner_noti = new Image();
winner_noti.src = "./elements/chuc_ban_trung_1_san_pham.png";
winner_noti.className = "animate_zoom";
var loser_noti = new Image();
loser_noti.src = "./elements/chuc_ban_may_man_lan_sau.png";
loser_noti.className = "animate_zoom";

var already_updated = false;
// snake_img[0].rotate(90);

// var theme_song = document.getElementById("theme_song");
// theme_song.id = "theme_song";
// theme_song.src = "./elements/Theme_song.mp3";
// theme_song.autoplay = true;
// theme_song.loop = true;

arrow_key.id = "arrow_key";

const timeTotal = 30;
var start_time;
var gameStop = false;

var thresh = 10;

// Bảng chỉnh màu, giá trị màu nằm bên trong cặp dấu ""
var snake_color = "#A9D17F";
var board_color = "#df7272";
var rule_board_color = "gray";

var rule = `
Hướng dẫn chơi
`;
function drawImage(img, x, y, width, height, deg, flip, flop, center) {

    context.save();
    if (deg == 180) {
        flip = true;
        deg = 0;
    }
    
    if(typeof width === "undefined") width = img.width;
    if(typeof height === "undefined") height = img.height;
    if(typeof center === "undefined") center = false;
    
    // Set rotation point to center of image, instead of top/left
    if(center) {
        x -= width/2;
        y -= height/2;
    }
    
    // Set the origin to the center of the image
    context.translate(x + width/2, y + height/2);
    
    // Rotate the canvas around the origin
    var rad = 2 * Math.PI - deg * Math.PI / 180;    
    context.rotate(rad);
    
    // Flip/flop the canvas
    if(flip) flipScale = -1; else flipScale = 1;
    if(flop) flopScale = -1; else flopScale = 1;
    context.scale(flipScale, flopScale);
    
    // Draw the image    
    context.drawImage(img, -width/2, -height/2, width, height);
    
    context.restore();
}

window.onload = function() {
    board = document.getElementById("board");
    board.height = rows * blockSize;
    board.width = cols * blockSize;
    context = board.getContext("2d"); //used for drawing on the board

    
    // Hàm hiện luật chơi
    // function rule_and_key(){
    //     context.fillStyle= rule_board_color;
    //     context.fillRect(0, 0, board.width, board.height);
    //     context.font = "30px Comic Sans MS";
    //     context.fillStyle = "white";
    //     context.textAlign = "left";
    //     context.fillText(rule, 0, board.height/2);
    // }
    // rule_and_key();
    context.drawImage(rule_board, Math.max(0, board.width / 2 - rule_board.width / 2), Math.max(0, board.height / 2 - rule_board.height / 2), Math.min(rule_board.width, board.width), Math.min(rule_board.height, board.height));
    // console.log(rule_board.style.transform);
    // context.drawImage(arrow_key, board.width / 2 - arrow_key.width / 2, board.height / 2 - arrow_key.height / 2, arrow_key.width, arrow_key.height)
    
}

// Hàm hướng dẫn dùng arrow key để chơi
function guide_to_play(){
    
    // document.getElementById('theme_song').autoplay = true;
    // document.getElementById('theme_song').play();
    document.getElementById("rule_intro_button").style.display = "none";

    document.getElementById('board_border').style.backgroundColor = 'white';
    document.getElementById('board_border').style.width = String(blockSize * (cols + 1)) + 'px';

    // document.getElementById('score').style.height = String(100 / 722 * screen_height) + 'px';
    start_time = 0;
    // context.drawImage(food, foodX, foodY, food.width, food.height);
    snakeBody.push({'x': snakeX - blockSize,'y': snakeY, 'degree': cur_direct});
    snakeBody.push({'x': snakeX - blockSize,'y': snakeY, 'degree': cur_direct});
    // drawImage(snake_img[0], snakeX, snakeY, blockSize, blockSize, cur_direct);
    placeFood();
    update();
    // context.drawImage(arrow_key, board.width / 2 - arrow_key.width / 2, board.height / 2 - arrow_key.height / 2, arrow_key.width, arrow_key.height);
    document.addEventListener("keyup", start_game_funct);
}

// Hàm khởi tạo trò chơi và bắt đầu
function start_game_funct(e){ 
    // changeDirection();
    document.removeEventListener("keyup", start_game_funct);
    changeDirection(e);
    // placeFood();
    document.addEventListener("keyup", changeDirection);
    const d = new Date();
    start_time = d.getTime();
    update();
    //test lucky_wheel() first
    // lucky_wheel();
    setInterval(update, 200); //100 milliseconds
}

// Hàm tạo vòng quay may mắn
function lucky_wheel(){
    document.getElementById("board").remove();
    document.getElementById("board_border").style.backgroundColor = "unset";
    let wheel = document.getElementById("wheelOfFortune");
    wheel.style.display = "flex";
    const sectors = [
        {color:"#549dff", label:"Việt quất", src: food},
        {color:"#97c887", label:"Đá me", src: food},
        {color:"#ade1ef", label:"Soda kem", src: food},
        {color:"#f47292", label:"Xá xị", src: food},
        {color:"#f2e288", label:"Cam", src: food},
        {color:"#ff9e4e", label:"Việt quất", src: food},
        {color:"#eba7ff", label:"Đá me", src: food},
    ];
    for (let i = 0; i < sectors.length; i++){
        sectors[i].src = sector_gift[i];
    }
    // Generate random float in range min-max:
    const rand = (m, M) => Math.random() * (M - m) + m;
    
    const tot = sectors.length;
    const elSpin = document.querySelector("#spin");
    const ctx = document.querySelector("#wheel").getContext`2d`;
    const dia = ctx.canvas.width;
    const rad = dia / 2;
    const PI = Math.PI;
    const TAU = 2 * PI;
    const arc = TAU / sectors.length;
    const friction = 0.991;  // 0.995=soft, 0.99=mid, 0.98=hard
    const angVelMin = 0.002; // Below that number will be treated as a stop
    let angVelMax = 0; // Random ang.vel. to acceletare to 
    let angVel = 0;    // Current angular velocity
    let ang = 0;       // Angle rotation in radians
    let isSpinning = false;
    let isAccelerating = false;
    
    //* Get index of current sector */
    const getIndex = () => Math.floor(tot - ang / TAU * tot) % tot;
    
    //* Draw sectors and prizes texts to canvas */
    const drawSector = (sector, i) => {
        const ang = arc * i;
        ctx.save();
        // COLOR
        ctx.beginPath();
        ctx.fillStyle = sector.color;
        ctx.moveTo(rad, rad);
        ctx.arc(rad, rad, rad, ang, ang + arc);
        ctx.lineTo(rad, rad);
        ctx.fill();
        // TEXT
        ctx.translate(rad, rad);
        ctx.rotate(ang + arc / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "#fff";
        ctx.font = "bold 30px sans-serif";
        ctx.drawImage(sector.src, rad - 100, -50, food.width, food.height);
        // ctx.fillText(sector.label, rad - 10, 10);
        //
        ctx.restore();
    };
    
    //* CSS rotate CANVAS Element */
    const rotate = () => {
        const sector = sectors[getIndex()];
        ctx.canvas.style.transform = `rotate(${ang - PI / 2}rad)`;
        elSpin.style.color = 'black';
        elSpin.textContent = !angVel ? "Quay" : sector.label;
        elSpin.style.background = sector.color;
    };
    
    const frame = () => {
        
        if (!isSpinning) return;
        
        if (angVel >= angVelMax) isAccelerating = false;
        
        // Accelerate
        if (isAccelerating) {
            angVel ||= angVelMin; // Initial velocity kick
            angVel *= 1.06; // Accelerate
        }
        
        // Decelerate
        else {
            isAccelerating = false;
            angVel *= friction; // Decelerate by friction  
            
            // SPIN END:
            if (angVel < angVelMin) {
                isSpinning = false;
                angVel = 0; 
                setTimeout(function(){ 
                    document.getElementById('board_border').appendChild(winner_noti); 
                }, 1000);         
                document.getElementById('wheelOfFortune').style.display = 'none';
                let tmp = document.getElementById("rule_intro_button");
                tmp.style.display ='flex';
                tmp.innerHTML = "Quay về trang chủ";
                tmp.style.zIndex = 100;
                tmp.style.background = "#B70006";
                tmp.addEventListener("click", function(){window.open('http://tdtudigital.com/tc01/group04/')});       
            }
        }
        
        ang += angVel; // Update angle
        ang %= TAU;    // Normalize angle
        rotate();      // CSS rotate!
    };

    const engine = () => {
        frame();
        requestAnimationFrame(engine)
    };

    elSpin.addEventListener("click", () => {
        if (isSpinning) return;
        isSpinning = true;
        isAccelerating = true;
        angVelMax = rand(0.25, 0.40);
        
    });

    // INIT!
    sectors.forEach(drawSector);
    rotate(); // Initial rotation
    engine(); // Start engine!
}

// Hàm xử lý game
var cur_direct = 0;




var isPlaying = false;

function togglePlay() {
    if (isPlaying) {
        myAudio.pause();
        document.getElementById('theme_song_icon').src = "./elements/muted_sound.png";
    }
    else{
        myAudio.play();
        document.getElementById('theme_song_icon').src = "./elements/sound.png";
    }
    isPlaying = !isPlaying;
};


function get_score(){
    return snakeBody.length - 2;
}
function update() {  
    if (gameStop){
        if (gameOver) return;
        if (get_score() >= thresh){
            lucky_wheel();
        }
        else{
            document.getElementById('board_border').appendChild(loser_noti);
            document.getElementById('board').style.display = 'none';
            document.getElementById('board_border').style.backgroundColor = 'unset';
            let tmp = document.getElementById("rule_intro_button");
            tmp.style.display ='flex';
            tmp.innerHTML = "Quay về trang chủ";
            tmp.style.zIndex = 100;
            tmp.style.background = "#B70006";
            tmp.addEventListener("click", function(){window.open('http://tdtudigital.com/tc01/group04/')});
        }
        gameOver = true;
        return;
    }
    const dd = new Date();
    let current_time = dd.getTime();
    
    let remain_time = start_time != 0 ? timeTotal - Math.round((current_time - start_time) / 1000) : 30;
    
    if (remain_time <= 0) {
        gameStop = true;
        document.getElementById('score_food').innerHTML = get_score();
        return;
    }
    else if (remain_time <= 5){
        document.getElementById('remain_time').style.color = 'red';
    }
    
    document.getElementById('remain_time').innerHTML = remain_time;
    if (get_score() >= thresh){
        document.getElementById('score_food').style.color = 'green';
    }
    document.getElementById('score_food').innerHTML = get_score();
    context.fillStyle=board_color;
    context.fillRect(0, 0, board.width, board.height);    
    context.drawImage(food, foodX, foodY, food.width, food.height);

    // Condition satisfied to eat food
    let cond1 = (snakeX == foodX && snakeY == foodY);
    let cond2 = (snakeX == foodX && snakeY == foodY + blockSize);
    if (cond1 || cond2) {
        if (snakeBody.length){
            snakeBody.push({'x': foodX,'y': foodY, 'degree': snakeBody[snakeBody.length - 1].degree});
        }
        else{
            snakeBody.push({'x': foodX,'y': foodY, 'degree': cur_direct});
        }
        placeFood();
    }


    // Draw body snake
    for (let i = snakeBody.length-1; i > 0; i--) {
        snakeBody[i] = snakeBody[i-1];
    }
    if (snakeBody.length) {
        snakeBody[0] = {'x': snakeX,'y': snakeY, 'degree': cur_direct};
        //snakeBody[0] = [snakeX, snakeY];
    }
    // console.log(cur_direct);

    // context.fillStyle= snake_color;
    snakeX += velocityX * blockSize;
    snakeY += velocityY * blockSize;
    already_updated = true;
    
    // context.fillRect(snakeX, snakeY, blockSize, blockSize);
    // snake_img[0] = document.getElementById('snake_head');
    // let tmp = snake_img[0];
    // switch(cur_direct){
    //     case 0:
            
    //         break;
    //     case 90:
    //         drawImage(snake_img[0], snakeX, snakeY, blockSize, blockSize, 90);
    //         break;
    //     case 180:
    //         drawImage(snake_img[0], snakeX, snakeY, blockSize, blockSize, 0, true);
    //         break;
    //     case -90:
    //         drawImage(snake_img[0], snakeX, snakeY, blockSize, blockSize, -90);
    //         break;
    //     default:
    //         break;
    // }
    drawImage(snake_img[0], snakeX, snakeY, blockSize, blockSize, cur_direct);
    // drawImage(snake_img[0], snakeX, snakeY, blockSize, blockSize, cur_direct);
    // drawRotatedImage(snake_img[0], Math.PI / 2, snakeX, snakeY, blockSize, blockSize);
    // drawRotatedImage(snake_img[0], cur_direct, snakeX, snakeY, blockSize, blockSize);
    // context.rotate(0);
    for (let i = 0; i < snakeBody.length; i++) {
        if (0 <= snakeBody[i].x && snakeBody[i].x < cols*blockSize){
            if (0 <= snakeBody[i].y && snakeBody[i].y < rows*blockSize){
                // context.fillStyle= snake_color;
                // context.fillRect(snakeBody[i].x, snakeBody[i].y, blockSize, blockSize);
                // context.drawImage(snake_img[1], snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
                if (i == snakeBody.length - 1){
                    drawImage(snake_img[2], snakeBody[i].x, snakeBody[i].y, blockSize, blockSize, snakeBody[i].degree);
                }
                else{
                    drawImage(snake_img[1], snakeBody[i].x, snakeBody[i].y, blockSize, blockSize, snakeBody[i].degree);
                }
            }
        }
    }

    // jump to another side
    if (snakeX < 0){
        snakeX = (cols - 1)*blockSize;
    }
    if (snakeX >= cols*blockSize){
        snakeX = 0;
    }
    if (snakeY < 0){
        snakeY = (rows-1)*blockSize;
    }
    if (snakeY >= rows*blockSize){
        snakeY = 0;
    }

    // console.log(snakeX);
    // console.log(snakeY);
    for (let i = 0; i < snakeBody.length; i++) {
        if (snakeX == snakeBody[i].x && snakeY == snakeBody[i].y) {
            // gameOver = true;
            gameStop = true;
            // alert("Game Over");
        }
    }
    // drawImage(snake_img[0], snakeX, snakeY, blockSize, blockSize, 0, true);
}

// Hàm xử lý tín hiệu bàn phím, các arrow key
function changeDirection(e) {
    // setTimeout(function(){
        if (!already_updated) return;
        if (e.code == "ArrowUp" && velocityY != speed) {
            velocityX = 0;
            velocityY = -speed;
            cur_direct = 90;
        }
        else if (e.code == "ArrowDown" && velocityY != -speed) {
            velocityX = 0;
            velocityY = speed;
            cur_direct = -90;
        }
        else if (e.code == "ArrowLeft" && velocityX != speed) {
            velocityX = -speed;
            velocityY = 0;
            cur_direct = 180;
        }
        else if (e.code == "ArrowRight" && velocityX != -speed) {
            velocityX = speed;
            velocityY = 0;
            cur_direct = 0;
        }
        already_updated = false;
        //     update();
        // }}, 200);
}

// Hàm tự động tìm chỗ trống và vẽ food
function placeFood() {
    //(0-1) * cols -> (0-19.9999) -> (0-19) * 25
    foodX = Math.floor(Math.random() * cols) * blockSize;
    foodY = Math.floor(Math.random() * (rows - 1)) * blockSize;

    let food_on_body = false;
    for (let i = 0; i < snakeBody.length; i++){
        if (snakeBody[i][0] == foodX && snakeBody[i][1] == foodY){
            food_on_body = true; break;
        }
        if (snakeBody[i][0] == foodX && snakeBody[i][1] == foodY + blockSize){
            food_on_body = true; break;
        }
    }
    if (foodX == snakeX && foodY == snakeY){
        food_on_body = true;
    }
    if (foodX == snakeX && foodY + blockSize == snakeY){
        food_on_body = true;
    }

    while (food_on_body){
        food_on_body = false;

        foodX = Math.floor(Math.random() * cols) * blockSize;
        foodY = Math.floor(Math.random() * (rows - 1)) * blockSize;
        for (let i = 0; i < snakeBody.length; i++){
            if (snakeBody[i][0] == foodX && snakeBody[i][1] == foodY){
                food_on_body = true; break;
            }
            if (snakeBody[i][0] == foodX && snakeBody[i][1] == foodY + blockSize){
                food_on_body = true; break;
            }
        }
        if (foodX == snakeX && foodY == snakeY){
            food_on_body = true;
        }
        if (foodX == snakeX && foodY + blockSize == snakeY){
            food_on_body = true;
        }
    }
}