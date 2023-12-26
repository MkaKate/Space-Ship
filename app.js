const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const ship = {
  x: canvas.width / 2,
  y: canvas.height - 50,
  width: 50,
  height: 50,
  speed: 5,
};

let bullets = [];
let asteroidSpeed = 2;
let cometSpeed = 3;
const maxMisses = 3;
let misses = 0;
let score = 0;
let asteroids = [];
let comets = [];
let gamePaused = false;
let gameStarted = false;
document.getElementById('lives').style.display = 'none'; 

function startGame(difficulty) {
  if (!gameStarted) {
    gameStarted = true;
    document.getElementById('score').style.display = 'block';
    document.getElementById('easyButton').style.display = 'none';
    document.getElementById('hardButton').style.display = 'none';
    document.getElementById('shipButton').style.display = 'none';
    document.getElementById('shipSelection').style.display = 'none';
    document.getElementById('gameCanvas').style.display = 'block';
    document.getElementById('lives').style.display = 'block'; 

    if (difficulty === 'easy') {
      asteroidSpeed = 2;
      cometSpeed = 3;
      setInterval(createAsteroid, 1500);
    setInterval(createComet, 2000);
    } else if (difficulty === 'hard') {
      asteroidSpeed = 3; 
      cometSpeed = 4; 
      setInterval(createAsteroid, 1000);
    setInterval(createComet, 1500);
    }

  document.addEventListener('keydown', moveShip);
  document.addEventListener('keydown', shoot);
  canvas.addEventListener('click', shoot);
  canvas.addEventListener('mousemove', moveShipWithMouse);

  updateGameArea();
  }
}

document.addEventListener('DOMContentLoaded', function() {
});
document.getElementById('easyButton').addEventListener('click', () => startGame('easy'));
document.getElementById('hardButton').addEventListener('click', () => startGame('hard'));
document.getElementById('shipButton').addEventListener('click', goToShipSelection);

function goToShipSelection() {
  document.getElementById('score').style.display = 'none';
  document.getElementById('easyButton').style.display = 'none';
  document.getElementById('hardButton').style.display = 'none';
  document.getElementById('gameCanvas').style.display = 'none';
  document.getElementById('shipButton').style.display = 'none';
  document.getElementById('menuButton').style.display = 'none';
  document.getElementById('shipSelection').style.display = 'block';

  document.getElementById('backToMenu').addEventListener('click', goToMainMenu);

  createShipOptions();
  document.querySelector('.ship-slider').scrollLeft = 0;
}
const shipImages = ['spaceShip1.png', 'spaceShip2.png', 'spaceShip3.png', 'spaceShip4.png', 'spaceShip5.png', 'spaceShip6.png', 'spaceShip7.png','spaceShip8.png','spaceShip9.png','spaceShip10.png'];
const shipShootImages = ['spaceShoot10.png', 'spaceShoot2.png', 'spaceShoot3.png', 'spaceShoot4-6.png', 'spaceShoot4-6.png', 'spaceShoot4-6.png', 'spaceShoot7.png', 'spaceShoot8-9.png', 'spaceShoot8-9.png', 'spaceShoot10.png'];

function setSelectedShipIndex() {
  let selectedShipIndex = localStorage.getItem('selectedShipIndex');
  if (selectedShipIndex === null || selectedShipIndex === undefined) {
    selectedShipIndex = 0;
    localStorage.setItem('selectedShipIndex', selectedShipIndex);
  }
  return selectedShipIndex;
}

let selectedShipIndex = setSelectedShipIndex();

function createShipOptions() {
  const shipOptionsDiv = document.getElementById('shipOptions');

  shipImages.forEach((src, index) => {
    const shipOptionDiv = document.createElement('div');
    shipOptionDiv.classList.add('ship-option');

    const shipImage = document.createElement('img');
    shipImage.src = src;
    shipImage.alt = `Space Ship ${index + 1}`;
    shipImage.classList.add('ship-image');

    const selectButton = document.createElement('button');
    selectButton.textContent = 'Обрати';
    selectButton.classList.add('selectShipButton');

    shipOptionDiv.appendChild(shipImage);
    shipOptionDiv.appendChild(selectButton);
    shipOptionsDiv.appendChild(shipOptionDiv);

    

    selectButton.addEventListener('click', () => {
      document.querySelectorAll('.selectShipButton').forEach(button => {
        button.classList.remove('selected');
      });
      selectButton.classList.add('selected');
      selectedShipIndex = index;

      localStorage.setItem('selectedShipIndex', selectedShipIndex);
      changeShip();
      shipOptionDiv.style.order = '-1';
      shipOptionDiv.parentNode.prepend(shipOptionDiv);
      shipSelectionTitle.style.display = 'none'
    });
  });
}

function goToMainMenu() {
  location.reload();
}

function createAsteroid() {
  asteroids.push({
    x: Math.random() * (canvas.width - 30),
    y: -30,
    width: 40,
    height: 40,
    speedY: asteroidSpeed,
    rotation: 0,
  });
}

function createComet() {
  comets.push({
    x: Math.random() * (canvas.width - 20),
    y: -20,
    width: 30,
    height: 30,
    speedY: cometSpeed,
    rotation: 0,
  });
}

let shipImage = new Image();
let bulletImage = new Image();
shipImage.src = 'spaceShip1.png'; 

if (selectedShipIndex !== null) {
  changeShip();
}


function changeShip() {
  shipImage.src = shipImages[selectedShipIndex]; 
  bulletImage.src = shipShootImages[selectedShipIndex]; 
}

function drawShip() {
  ctx.drawImage(shipImage, ship.x, ship.y, ship.width, ship.height); 
  const scoreElement = document.getElementById('scoreValue');
  scoreElement.innerText = `Score: ${score}`;
}

function moveShip(event) {
  if (!gamePaused) {
    if (event.key === 'ArrowLeft' && ship.x > 0) {
      ship.x -= ship.speed;
    } else if (event.key === 'ArrowRight' && ship.x < canvas.width - ship.width) {
      ship.x += ship.speed;
    }
  }
}

function moveShipWithMouse(event) {
  if (!gamePaused) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    ship.x = mouseX - ship.width / 2;
  }
}

const shootSound = new Audio('piou.wav');

function shoot(event) {
  if (!gamePaused && (event.key === ' ' || event.type === 'click')) {
    if (selectedShipIndex === 0) {
      // First ship shoots red lines
      bullets.push({
        x: ship.x + ship.width / 2 - 2.5,
        y: ship.y,
        width: 5,
        height: 10,
        speed: 6,
      });
    } else {
      
      bullets.push({
        x: ship.x + ship.width / 2 - 5,
        y: ship.y,
        width: 10,
        height: 20,
        speed: 4,
        bulletImage: bulletImage, 
    })
    shootSound.play();
  }
}
}


function moveObjects(objects, imagePath, speed) {
  for (let i = 0; i < objects.length; i++) {

    const img = new Image();
    img.src = imagePath;

    ctx.save();
    ctx.translate(objects[i].x + objects[i].width / 2, objects[i].y + objects[i].height / 2);
    ctx.rotate(objects[i].rotation);
    ctx.drawImage(img, -objects[i].width / 2, -objects[i].height / 2, objects[i].width, objects[i].height);
    ctx.translate(-objects[i].x - objects[i].width / 2, -objects[i].y - objects[i].height / 2);

    objects[i].y += speed;
    objects[i].rotation += (Math.PI / 180) * 1; 

    ctx.restore();

    if (objects[i].y > canvas.height) {
      objects.splice(i, 1);
      i--;
      misses++;

      if (misses >= maxMisses) {
        gameOver();
        break;
      }
      removeHeart();
    }
  }
}

function updateGameArea() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawShip();
  moveObjects(asteroids, 'asteroid.png', asteroidSpeed);
  moveObjects(comets, 'comets.png', cometSpeed);
  moveBullets();
  handleCollisions();

  document.getElementById('scoreValue').innerText = score;

  if (!gamePaused) {
    requestAnimationFrame(updateGameArea);
  }
}


 function moveBullets() {
   for (let i = 0; i < bullets.length; i++) {
     if (bullets[i].bulletImage) {
       ctx.drawImage(bullets[i].bulletImage, bullets[i].x, bullets[i].y, bullets[i].width, bullets[i].height);
     } else {
       ctx.fillStyle = 'red';
       ctx.fillRect(bullets[i].x, bullets[i].y, bullets[i].width, bullets[i].height);
     }
     bullets[i].y -= bullets[i].speed;

     if (bullets[i].y < 0) {
       bullets.splice(i, 1);
       i--;
     }
   }
 }

let lives = 3; 

function removeHeart() {
  const hearts = document.querySelectorAll('.heart-icon');
  if (lives > 0) {
    hearts[lives - 1].style.display = 'none'; 
    lives--; 
  }

  if (lives === 0) {
    gameOver(); 
  }
}

function handleCollisions() {
  for (let i = 0; i < bullets.length; i++) {
    for (let j = 0; j < asteroids.length; j++) {
      if (collision(bullets[i], asteroids[j])) {
        asteroids.splice(j, 1);
        bullets.splice(i, 1);
        score++;
        break;
      }
    }

    for (let j = 0; j < comets.length; j++) {
      if (collision(bullets[i], comets[j])) {
        comets.splice(j, 1);
        bullets.splice(i, 1);
        score++;
        break;
      }
    }
  }

  for (let i = 0; i < asteroids.length; i++) {
    if (collision(ship, asteroids[i])) {
      removeHeart(); 
      gameOver();
      break;
    }
  }

  for (let i = 0; i < comets.length; i++) {
    if (collision(ship, comets[i])) {
      removeHeart(); 
      gameOver();
      break;
    }
  }
}

function collision(obj1, obj2) {
  if (obj1 && obj2 && 'x' in obj1 && 'y' in obj1 && 'width' in obj1 && 'height' in obj1 &&
      'x' in obj2 && 'y' in obj2 && 'width' in obj2 && 'height' in obj2) {
      return (
        obj1.x < obj2.x + obj2.width &&
        obj1.x + obj1.width > obj2.x &&
        obj1.y < obj2.y + obj2.height &&
        obj1.y + obj1.height > obj2.y
      );
    } else {
      
      return false;
    }
  }


  let gameOverDisplayed = false; 
  function gameOver() {
    
    if (!gameOverDisplayed) {
      gamePaused = true;
      canvas.style.display = 'none'; 
      document.getElementById('shipButton').style.display = 'none';
      document.getElementById('shipSelection').style.display = 'none';
      document.getElementById('lives').style.display = 'none';

      lives = 0;
      ctx.font = "40px Arial";
      ctx.fillStyle = "red";
      ctx.textAlign = "center";
      ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 20); 
      ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 20); 
  
      ctx.fillText("Press F5 to restart", canvas.width / 2, canvas.height - 50); 
      gameOverDisplayed = true; 
      document.getElementById('score').style.display = 'block'; 
      document.getElementById('menuButton').style.display = 'block'; 
    
    document.getElementById('menuButton').addEventListener('click', goToMainMenu); 
    }
  }

  function goToMainMenu() {
    location.reload(); 
  }