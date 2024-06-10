// FIX: progress bar stutter
class ProgressBar {
  constructor(barElement) {
    this.element = barElement;
    this.scale = 1;
    this.studyRate = 0;
    this.restRate = 0;
  }
  updateBar(second) {
    this.scale = Math.max(1 - this.studyRate * second, 0);
    this.element.style.transform = `scaleY(${this.scale})`;
  }
  updateStudyBarRate(timeGoalSecond) {
    this.studyRate = 1 / timeGoalSecond;
  }
  updateRestBarRate(restSecond) {
    this.restRate = (1 - this.scale) / restSecond;
  }
}

class Settings {
  constructor(timeGoal, restPercent) {
    this.timeGoal = timeGoal;
    this.restPercent = restPercent;
  }
}

class Time {
  constructor(settings) {
    this.settings = settings;
    this.currentSecond = 0;
    this.studySecond = 0;
  }

  get restSecond() {
    return Math.floor(this.currentSecond / (100 / this.settings.restPercent));
  }

  set restSecond(val) {
    return;
  }
}

let setsi = new Settings(20, 20);
let foo = new Time(setsi);
foo.currentSecond = 20;
console.log(foo.restSecond);

function main() {
  const timer = document.querySelector(".timer-time");
  const startBtn = document.querySelector(".start-btn");
  const pauseBtn = document.querySelector(".pause-btn");
  const restBtn = document.querySelector(".rest-btn");
  const progressBar = document.querySelector(".progress-bar-2");
  const inputRest = document.querySelector("#rest-percent");
  const inputGoals = document.querySelector("#time-goal");
  const bar = new ProgressBar(progressBar);
  const settings = new Settings(+inputGoals.value * 60, +inputRest.value);
  const time = new Time(settings);
  let id = 0;
  startBtn.addEventListener("click", () => {
    bar.updateStudyBarRate(settings.timeGoal);
    time.currentSecond = time.studySecond;
    bar.updateBar(time.currentSecond);
    clearInterval(id);
    id = stopwatch(timer, time, bar, settings.rest);
    changeButton();
    function pauseHandler() {
      time.studySecond = time.currentSecond;
      clearInterval(id);
      changeButton();
      restBtn.removeEventListener("click", restHandler);
    }
    function restHandler() {
      bar.updateRestBarRate(time.restSecond);
      time.currentSecond = time.restSecond;
      time.studySecond = 0;
      clearInterval(id);
      id = reverseStopwatch(timer, time, bar, settings.rest);
      changeButton();
      pauseBtn.removeEventListener("click", pauseHandler);
    }
    pauseBtn.addEventListener("click", pauseHandler, { once: true });
    restBtn.addEventListener("click", restHandler, { once: true });
  });

  inputRest.addEventListener("input", (e) => {
    settings.restPercent = +e.data;
  });

  inputGoals.addEventListener("input", (e) => {
    settings.timeGoal = +e.data * 60;
  });
}

function changeButton() {
  const startBtn = document.querySelector(".start-btn");
  const pauseBtn = document.querySelector(".pause-btn");
  const restBtn = document.querySelector(".rest-btn");
  startBtn.classList.toggle("invisible");
  pauseBtn.classList.toggle("invisible");
  restBtn.classList.toggle("invisible");
}

function stopwatch(timer, time, bar) {
  timer.innerText = format(time.currentSecond);
  let id = setInterval(() => {
    time.currentSecond++;
    timer.innerText = format(time.currentSecond);
    bar.scale -= bar.studyRate;
    if (bar.scale <= 0) {
      bar.scale = 0;
    }
    bar.element.style.transform = `scaleY(${bar.scale})`;
  }, 1000);
  return id;
}

function reverseStopwatch(timer, time, bar) {
  timer.innerText = format(time.currentSecond);
  let id = setInterval(() => {
    if (time.currentSecond === 0) {
      clearInterval(id);
      return;
    }
    time.currentSecond--;
    timer.innerText = format(time.currentSecond);
    bar.scale += bar.restRate;
    if (bar.scale >= 1) {
      bar.scale = 1;
    }
    bar.element.style.transform = `scaleY(${bar.scale})`;
  }, 1000);
  return id;
}

function format(second) {
  let minute = Math.floor(second / 60);
  let hour = Math.floor(minute / 60);
  let newSecond = second % 60;
  if (minute < 10) {
    minute = `0${minute}`;
  }
  if (hour < 10) {
    hour = `0${hour}`;
  }
  if (newSecond < 10) {
    newSecond = `0${newSecond}`;
  }
  if (hour === "00") {
    return `${minute}:${newSecond}`;
  }
  return `${hour}:${minute}:${newSecond}`;
}

main();
