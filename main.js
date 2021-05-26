'use strict';

const ITEM_SIZE = 80;
const CARROT_COUNT = 1;
const BUG_COUNT = 10;
const GAME_DURATION_SEC = 5;

const field = document.querySelector('.game__field');
const fieldRect = field.getBoundingClientRect();
const gameBtn = document.querySelector('.game__button');
const gameTimer = document.querySelector('.game__timer');
const gameScore = document.querySelector('.game__score');

const popUp = document.querySelector('.pop-up');
const popUpText = document.querySelector('.pop-up__message');
const popUpBtn = document.querySelector('.pop-up__refresh');

const carrotSound = new Audio('audio/carrot_pull.mp3');
const bugSound = new Audio('audio/bug_pull.mp3');
const bgm = new Audio('audio/bg.mp3');
const winSound = new Audio('audio/game_win.mp3');
const alertSound = new Audio('audio/alert.wav');


let started = false;
let score = 0;
let timer = undefined;

field.addEventListener('click', onFieldGame);

gameBtn.addEventListener('click', () => {
  if(started) {
    stopGame();
  } else {
    startGame();
  }
});

popUpBtn.addEventListener('click', () => {
  startGame();
  hidePopup();
})

function startGame() {
  started = true;
  initGame();
  showStopBtn();
  showTimerAndScore();
  startGameTimer();
  playSound(bgm);
}

function stopGame() {
  started = false;
  stopGameTimer();
  hideGameBtn();
  showPopUpWithText('REPLAY❓');
  pauseSound(bgm);
  playSound(alertSound);
}

function finishGame(win) {
  started = false;
  hideGameBtn();
  showPopUpWithText(win ? 'YOU WON 🌈' : 'YOU LOST 😢');
  if(win) {
    playSound(winSound)
  } else {
    playSound(bugSound)
  }
  pauseSound(bgm);
  stopGameTimer();
}

function showStopBtn() {
  const icon = gameBtn.querySelector('.fas');
  icon.classList.add('fa-stop');
  icon.classList.remove('fa-play');
  gameBtn.style.visibility = 'visible';
}

function hideGameBtn() {
  gameBtn.style.visibility = 'hidden';
}

function showTimerAndScore() {
  gameTimer.style.visibility = 'visible';
  gameScore.style.visibility = 'visible';
}

function startGameTimer() {
  let remainingTimeSec = GAME_DURATION_SEC;
  updateTimerText(remainingTimeSec);
  timer = setInterval(() => {
    if(remainingTimeSec <= 0) {
      clearInterval(timer);
      finishGame(CARROT_COUNT === score);
      return;
    }
    updateTimerText(--remainingTimeSec);
  }, 1000)
}

function stopGameTimer() {
  clearInterval(timer);
}

function updateTimerText(time) {
  const min = Math.floor(time / 60);
  const sec = Math.floor(time % 60);
  gameTimer.innerText = `${min}:${sec}`;
}

function showPopUpWithText(text) {
  popUp.classList.add('show');
  popUpText.innerText = text;
}

function hidePopup() {
  popUp.classList.remove('show');
}

function initGame() {
  score = 0;
  field.innerHTML = '';
  gameScore.innerText = CARROT_COUNT;
  addItem('carrot', CARROT_COUNT, 'image/carrot.png');
  addItem('bug', BUG_COUNT, 'image/bug.png');
}

function onFieldGame(event) {
  if(!started) {
    return;
  }
  const target = event.target;
  if(target.matches('.carrot')) {
    playSound(carrotSound);
    target.remove();
    score++;
    updateScore();
    if(score === CARROT_COUNT) {
      finishGame(true);
    }
  } else if(target.matches('.bug')) {
    finishGame(false);
    playSound(bugSound);
  }
}

function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}

function pauseSound(sound) {
  sound.pause();
}

function updateScore() {
  gameScore.innerText = CARROT_COUNT - score;
}

function addItem(className, count, imgPath) {
  const x1 = 0;
  const y1 = 0;
  const x2 = fieldRect.width - ITEM_SIZE;
  const y2 = fieldRect.height - ITEM_SIZE;
  for (let i = 0; i < count ; i ++) {
    const item = document.createElement('img');
    item.setAttribute('class', className);
    item.setAttribute('src', imgPath);
    item.style.position = 'absolute';
    const x = randomNum(x1, x2);
    const y = randomNum(y1, y2);
    item.style.left = `${x}px`;
    item.style.top = `${y}px`;
    field.appendChild(item);
  }
}

function randomNum(min, max) {
  return Math.random() * (max - min) + min;
}