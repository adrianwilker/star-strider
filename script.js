var gameScreen = 0;

var rocketPosition_x = 255 - 37/2;
var rocketPosition_y = window.innerHeight - 70;
var rocketSpeed = 3;

var asteroid = 0;
var asteroids = []

var bg_x = 0
var bg_y = 0

var ufo_x = 500
var ufo_y = 0

var score = 0;

function preload() {
  rocket = loadImage('./resources/images/rocket.png');
  ufo = loadImage('./resources/images/ufo.gif');
  starsbg = loadImage('./resources/images/starsbg.png');
  asteroid = loadImage('./resources/images/asteroid.png');
  themeSong = createAudio('./resources/sounds/SkyFire (Title Screen).ogg');
  font = loadFont('./resources/fonts/VT323-Regular.ttf');
  gameover = createAudio('./resources/sounds/150205__pumodi__explosion-2.mp3')
}

function setup() {
  createCanvas(500, window.innerHeight);
  textFont(font);
  for(let i=0; i<=5; i++) {
    asteroids.push({
      image: asteroid,
      x: random(0, 450),
      y: -50,
      speed: 3
    })
  }
  ufo_y = window.innerHeight/4
}

function scoreboard() {
  textAlign(LEFT, TOP);
  fill(255);
  text('Score: ' + score.toFixed(3), 30, 30, 200, 100)
}

function restart() {
  score = 0
  rocketPosition_x = 255 - 37/2
  rocketPosition_y = window.innerHeight - 70
  rocketSpeed = 3
  for(let i=0; i<=5; i++) {
    asteroids[i].x = random(0, 450)
    asteroids[i].y = -50
    asteroids[i].speed = 3
  }
  ufo_x = -100
  ufo_y = window.innerHeight/4 + 1
}

function gameOver() {
  textAlign(LEFT, LEFT)
    fill(255);
    rect(125, ((window.innerHeight-150)/2), 250, 150, 10);
    strokeWeight(0);
    textSize(35);
    fill(0);
    text("Game Over!", 180, ((window.innerHeight-10)/2), 200, 30);

    textSize(20);
    fill(0);
    text("Restart", 220, ((window.innerHeight+60)/2), 60, 20);

    if(mouseX >= 215 &&
       mouseX <= 278 &&
       mouseY >= (window.innerHeight+30)/2 &&
       mouseY <= (window.innerHeight+74)/2) {
      fill(255, 0, 0);
      text("Restart", 220, ((window.innerHeight+60)/2), 60, 20);
      if(mouseIsPressed) {
        gameScreen = 1
        restart()
      }
    }

    fill(0);
    text("Menu", 246 - textWidth("Menu")/2, (window.innerHeight - 150) / 2 + 130);
    
    if(mouseX >= (250 - textWidth("Menu")/2) &&
        mouseX <= (260 + textWidth("Menu")/2) &&
        mouseY >= (window.innerHeight+76)/2 &&
        mouseY <= (window.innerHeight+110)/2) {
      fill(255, 0, 0)
      text("Menu", 246 - textWidth("Menu")/2, (window.innerHeight - 150) / 2 + 130);
      if (mouseIsPressed){
        gameScreen = 0;
        restart()
      }
    }
}

function gameControl() {
  if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
    if (rocketPosition_x > 0)
      rocketPosition_x = rocketPosition_x - rocketSpeed;
  }
  if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
    if (rocketPosition_x < 463)
      rocketPosition_x = rocketPosition_x + rocketSpeed;
  }
  if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
    if (rocketPosition_y > 0)
      rocketPosition_y -= rocketSpeed;
  }
  if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
    if (rocketPosition_y < window.innerHeight - 70)
      rocketPosition_y += rocketSpeed;
  }
}

function backgroundImage() {
  image(starsbg, 0, bg_y, 500, window.innerHeight);
  image(starsbg, 0, bg_y-window.innerHeight, 500, window.innerHeight);
  if(bg_y > window.innerHeight) {
    bg_y = 0
  }
  if(score<5)
    bg_y = bg_y + 1
  if(score>=5 && score<15)
    bg_y = bg_y + 2
  if(score>=15 && score<25)
    bg_y = bg_y + 3
  if(score>25)
    bg_y = bg_y + 4
}

function activateUfo() {
  image(ufo, ufo_x, ufo_y, 100, 65);
  ufo_x += 2
  if(ufo_y <= window.innerHeight/4)
    direction = 2
  if(ufo_y >= window.innerHeight/2)
    direction = -2
  ufo_y += direction
  if(ufo_x >= 2500)
    ufo_x = -65
}

function game() {
  document.addEventListener('click', function() {
    themeSong.loop();
  })
  background(0);
  noStroke();
  backgroundImage()
  
  image(rocket, rocketPosition_x, rocketPosition_y, 37, 70);
    
  for(let i=0; i<=5; i++)
    image(asteroids[i].image, asteroids[i].x, asteroids[i].y, 50, 50);
    
  if(score >= 30)
    activateUfo()

  scoreboard()
  gameControl()

  score += 0.01;

  if(asteroids[0].y <= window.innerHeight) {
    asteroids[0].y += asteroids[0].speed;
  } else {
    asteroids[0].y = -50;
    asteroids[0].x = random(0, 450)
  }
  if(score >= 5) {
    rocketSpeed = 4
    if(asteroids[1].y <= window.innerHeight) {
      asteroids[1].y += asteroids[1].speed + 1;
    } else {
      asteroids[1].y = -50;
      asteroids[1].x = random(0, 450)
    }
  }
  if(score >= 15) {
    rocketSpeed = 5
    if(asteroids[2].y <= window.innerHeight || asteroids[2].x <= 500) {
      asteroids[2].x += asteroids[2].speed + 0.5;
      asteroids[2].y += asteroids[2].speed + 0.5;
    } else {
      asteroids[2].y = -50;
      asteroids[2].x = random(-450, 450)
    }
  }
  if(score >= 25) {
    if(asteroids[3].y <= -50) {
      asteroids[3].y = window.innerHeight + 50;
      asteroids[3].x = random(-450, 450);
    } else {
      asteroids[3].x += asteroids[3].speed + 1;
      asteroids[3].y -= asteroids[3].speed + 1;
    }
  }
    
  //Game Over
  if ((dist(rocketPosition_x, rocketPosition_y, asteroids[0].x, asteroids[0].y) <= 40) || 
     (dist(rocketPosition_x, rocketPosition_y, asteroids[1].x, asteroids[1].y) <= 40) ||
     (dist(rocketPosition_x, rocketPosition_y, asteroids[2].x, asteroids[2].y) <= 40) ||
     (dist(rocketPosition_x, rocketPosition_y, asteroids[3].x, asteroids[3].y) <= 40) ||
     (dist(rocketPosition_x, rocketPosition_y, asteroids[4].x, asteroids[4].y) <= 40) ||
     (dist(rocketPosition_x, rocketPosition_y, asteroids[5].x, asteroids[5].y) <= 40) ||
     (dist(rocketPosition_x, rocketPosition_y, ufo_x, ufo_y) <= 60)) {
    themeSong.stop()
    gameover.play()
    gameScreen = 3
  }
}

function about() {
  fill(255);
    textAlign(LEFT);
        
    rect(250/2-25, (window.innerHeight - 150) / 2 - 25, 300, 200, 10);
    fill(0);
    textSize(24);
  
    text("How to play?", 108, (window.innerHeight - 150) / 2);
  
    textSize(16);
    text("Use the ⬆️ ⬇️ ⬅️ ➡️     or W S A D keys to avoid obstacles and go as far as you can into the depths of the universe.", 108, (window.innerHeight - 150) / 2 + 5, 300, 100);
    textFont(NORMAL);
    text("⬆️ ⬇️ ⬅️ ➡️", 158, (window.innerHeight - 150) / 2 + 37)
    textFont(font);
  
    textSize(15);
    text("Developed by github.com/AdrianWilker", 145, (window.innerHeight - 150) / 2 + 100);

    textSize(24);
    text("Back", 250 - textWidth("Back")/2, (window.innerHeight - 150) / 2 + 140);
    
    if(mouseX >= (250 - textWidth("Back")/2) &&
        mouseX <= (260 + textWidth("Back")/2) &&
        mouseY >= window.innerHeight / 2 - textAscent("Back") + 60 &&
        mouseY <= window.innerHeight / 2 - textDescent("Back") + 80) {
      fill(255, 0, 0)
      text("Back", 250 - textWidth("Back")/2, (window.innerHeight - 150) / 2 + 140);
      if (mouseIsPressed)
        gameScreen = 0;
    }
}

function menu() {
  background(0);
    image(starsbg, 0, 0, 500, window.innerHeight);
    textSize(30);
    fill(255);
    textAlign(CENTER, CENTER);
        
    rect(250/2, (window.innerHeight - 150) / 2, 250, 150, 10);
    
    fill(0)
    text("Start", 250, window.innerHeight / 2 - 20);
    
    text("About", 250, window.innerHeight / 2 + 20);
    
    if(mouseX >= (250-textWidth("Start")/2) &&
        mouseX <= (250+textWidth("Start")/2) &&
        mouseY >= window.innerHeight / 2 - textAscent() - 5 &&
        mouseY <= window.innerHeight / 2 - textDescent() + 5) {
      fill(255, 0, 0)
      text("Start", 250, window.innerHeight / 2 - 20);
      if (mouseIsPressed)
        gameScreen = 1;
    }
    if(mouseX >= (250-textWidth("About")/2) &&
        mouseX <= (250+textWidth("About")/2) &&
        mouseY >= window.innerHeight / 2 - textAscent() + 35 &&
        mouseY <= window.innerHeight / 2 - textDescent() + 45) {
      fill(255, 0, 0)
      text("About", 250, window.innerHeight / 2 + 20);
      if (mouseIsPressed)
        gameScreen = 2;
    }
}

function draw() {
  textStyle(NORMAL);
  textSize(20);

  switch(gameScreen) {
    case 0:
      menu()
      break
    case 1:
      game()
      break
    case 2:
      about()
      break
    case 3:
      gameOver()
      break
    default:
      break
  }  
}