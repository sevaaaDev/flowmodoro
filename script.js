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
  updateBarRate(timeGoalSecond, mode) {
    if (mode === undefined) {
      this.studyRate = 1 / timeGoalSecond;
      this.restRate = 1 / (timeGoalSecond / 5);
    }
    switch (mode) {
      case "rest":
        this.restRate = 1 / timeGoalSecond;
        break;
      case "study":
        console.log("hell");
        this.studyRate = 1 / timeGoalSecond;
    }
  }
}
function main() {
  const time = document.querySelector(".timer-time");
  const startBtn = document.querySelector(".start-btn");
  const pauseBtn = document.querySelector(".pause-btn");
  const restBtn = document.querySelector(".rest-btn");
  const progressBar = document.querySelector(".progress-bar-2");
  const bar = new ProgressBar(progressBar);
  let Time = {
    studySecond: 0,
    restSecond: 0,
  };
  let id = 0;
  let timeGoalSecond = 20;
  startBtn.addEventListener("click", () => {
    bar.updateBarRate(timeGoalSecond);
    bar.updateBar(Time.studySecond);
    clearInterval(id);
    id = stopwatch(time, Time, bar);
    changeButton();
    function pauseHandler() {
      clearInterval(id);
      changeButton();
      restBtn.removeEventListener("click", restHandler);
    }
    function restHandler() {
      Time.restSecond = Math.floor(Time.studySecond / 5);
      Time.studySecond = 0;
      clearInterval(id);
      id = reverseStopwatch(time, Time, bar);
      changeButton();
      pauseBtn.removeEventListener("click", pauseHandler);
    }
    pauseBtn.addEventListener("click", pauseHandler, { once: true });
    restBtn.addEventListener("click", restHandler, { once: true });
  });

  // TODO: progress bar
  // calc the bar total, and then increment
  // fix the rest mode
}

function changeButton() {
  const startBtn = document.querySelector(".start-btn");
  const pauseBtn = document.querySelector(".pause-btn");
  const restBtn = document.querySelector(".rest-btn");
  startBtn.classList.toggle("invisible");
  pauseBtn.classList.toggle("invisible");
  restBtn.classList.toggle("invisible");
}

function stopwatch(timer, Time, bar) {
  timer.innerText = prettify(Time.studySecond);
  let id = setInterval(() => {
    Time.studySecond++;
    timer.innerText = prettify(Time.studySecond);
    barScale -= factor;
    if (barScale <= 0) {
      barScale = 0;
    bar.scale -= bar.studyRate;
    if (bar.scale <= 0) {
      bar.scale = 0;
    }
    bar.element.style.transform = `scaleY(${bar.scale})`;
  }, 1000);
  return id;
}

function reverseStopwatch(timer, Time, bar) {
  timer.innerText = prettify(Time.restSecond);
  let id = setInterval(() => {
    if (Time.restSecond === 0) {
      clearInterval(id);
      return;
    }
    Time.restSecond--;
    timer.innerText = prettify(Time.restSecond);
    bar.scale += bar.restRate;
    }
    bar.element.style.transform = `scaleY(${bar.scale})`;
  }, 1000);
  return id;
}

function prettify(second) {
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
