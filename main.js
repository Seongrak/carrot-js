"use strict";

const CARROT_SIZE = 20;
const BUG_SIZE = 20;
const GAME_TIME = 15;

const gameField = document.querySelector(".game-field");
const fieldRect = gameField.getBoundingClientRect();

const startBtn = document.querySelector(".start_btn");
const gameScore = document.querySelector(".numsOfCarrots");
const gameTimer = document.querySelector(".timer");

let started = false;
let timer = undefined;
let score = 0;

const popup = document.querySelector(".pop-up");
const popupRedo = document.querySelector(".redo");
const popupText = document.querySelector(".pop-up_msg");

const soundAlert = new Audio("./sound/alert.wav");
const soundBg = new Audio("./sound/bg.mp3");
const soundBug = new Audio("./sound/bug_pull.mp3");
const soundCarrot = new Audio("./sound/carrot_pull.mp3");
const soundWin = new Audio("./sound/game_win.mp3");

startBtn.addEventListener("click", () => {
  if (started) {
    stopGame();
  } else {
    startGame();
  }
});

gameField.addEventListener("click", onField);

popupRedo.addEventListener("click", () => {
  startGame();
  hidePopup();
  showStartBtn();
});

function startGame() {
  initGame();

  showStopBtn();
  showTimeScore();
  startTimer();

  started = true;
  playSound(soundBg);
}

function stopGame() {
  stopGameTimer();
  hideStartBtn();
  showPopup("Replay?");

  started - false;
  stopSound(soundBg);
}

function finishGame(win) {
  started = false;
  hideStartBtn();
  stopSound(soundBg);
  showPopup(win ? "Won! :)" : "Lost ! :(");
  playSound(win ? soundWin : soundAlert);
  score = 0;
}

function showStopBtn() {
  const icon = startBtn.querySelector(".fas");
  icon.classList.add("fa-stop");
  icon.classList.remove("fa-play");
}

function showTimeScore() {
  gameTimer.style.visibility = "visible";
  gameScore.style.visibility = "visible";
}
function startTimer() {
  let remainTimeSec = GAME_TIME;
  updateTimerText(remainTimeSec);

  timer = setInterval(() => {
    if (remainTimeSec <= 0) {
      clearInterval(timer);
      finishGame(score === CARROT_SIZE);
      return;
    }
    updateTimerText(--remainTimeSec);
  }, 1000);
}

function stopGameTimer() {
  clearInterval(timer);
}

function showStartBtn() {
  startBtn.style.visibility = "visible";
}
function hideStartBtn() {
  startBtn.style.visibility = "hidden";
}
function showPopup(text) {
  popup.classList.remove("pop-up-hide");
  popupText.innerHTML = text;
}

function hidePopup() {
  popup.classList.add("pop-up-hide");
}
function updateTimerText(time) {
  const minute = Math.floor(time / 60);
  const second = time % 60;
  gameTimer.innerHTML = `${minute} : ${second}`;
}

function initGame() {
  gameField.innerHTML = "";
  gameScore.innerHTML = CARROT_SIZE;
  addItem("carrot", CARROT_SIZE, "img/carrot.png");
  addItem("bug", BUG_SIZE, "img/bug.png");
}

function addItem(className, itemNumber, imgPath) {
  const x1 = 0;
  const y1 = 0;
  const x2 = fieldRect.width - 80; // 80 = img size
  const y2 = fieldRect.height - 80;

  for (let i = 0; i < itemNumber; i++) {
    const item = document.createElement("img");
    item.setAttribute("class", className);
    item.setAttribute("src", imgPath);
    item.style.position = "absolute";

    const x_position = randomNumber(x1, x2);
    const y_position = randomNumber(y1, y2);

    item.style.left = `${x_position}px`;
    item.style.top = `${y_position}px`;

    gameField.appendChild(item);
  }
}

function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

function onField(event) {
  if (started == false) {
    return;
  }

  if (event.target.matches(".carrot")) {
    event.target.remove();
    score++;
    updateScore();
    if (score === CARROT_SIZE) {
      stopGameTimer();
      finishGame(true);
    }
    playSound(soundCarrot);
  } else if (event.target.matches(".bug")) {
    playSound(soundBug);
    stopGameTimer();
    finishGame(false);
  }
}

function updateScore() {
  gameScore.innerHTML = CARROT_SIZE - score;
}

function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}

function stopSound(sound) {
  sound.pause();
}
