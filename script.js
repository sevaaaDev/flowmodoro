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
  updateBarRate(timeGoalSecond, rest, mode) {
    if (mode === undefined) {
      this.studyRate = 1 / timeGoalSecond;
      this.restRate = 1 / (timeGoalSecond / rest);
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

class Settings {
  constructor(timeGoal, restPercent) {
    this.timeGoal = timeGoal;
    this.rest = 100 / restPercent;
  }
}

function main() {
  const time = document.querySelector(".timer-time");
  const startBtn = document.querySelector(".start-btn");
  const pauseBtn = document.querySelector(".pause-btn");
  const restBtn = document.querySelector(".rest-btn");
  const progressBar = document.querySelector(".progress-bar-2");
  const bar = new ProgressBar(progressBar);
  const inputRest = document.querySelector("#rest-percent");
  const inputGoals = document.querySelector("#time-goal");
  const settings = new Settings(20, 20);
  let Time = {
    studySecond: 0,
    restSecond: 0,
  };
  let id = 0;
  startBtn.addEventListener("click", () => {
    bar.updateBarRate(settings.timeGoal, settings.rest);
    bar.updateBar(Time.studySecond);
    clearInterval(id);
    id = stopwatch(time, Time, bar, settings.rest);
    changeButton();
    function pauseHandler() {
      clearInterval(id);
      changeButton();
      restBtn.removeEventListener("click", restHandler);
    }
    function restHandler() {
      Time.restSecond = Math.floor(Time.studySecond / settings.rest);
      Time.studySecond = 0;
      clearInterval(id);
      id = reverseStopwatch(time, Time, bar, settings.rest);
      changeButton();
      pauseBtn.removeEventListener("click", pauseHandler);
    }
    pauseBtn.addEventListener("click", pauseHandler, { once: true });
    restBtn.addEventListener("click", restHandler, { once: true });
  });

  inputRest.addEventListener("input", (e) => {
    settings.rest = +e.data;
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

function stopwatch(timer, Time, bar, rest) {
  timer.innerText = format(Time.studySecond);
  let id = setInterval(() => {
    Time.studySecond++;
    timer.innerText = format(Time.studySecond);
    bar.scale -= bar.studyRate;
    if (bar.scale <= 0) {
      bar.scale = 0;
      Time.restSecond = Math.floor(Time.studySecond / rest); // TODO: make a function to update this
      bar.updateBarRate(Time.restSecond, "rest");
    }
    bar.element.style.transform = `scaleY(${bar.scale})`;
  }, 1000);
  return id;
}

function reverseStopwatch(timer, Time, bar) {
  timer.innerText = format(Time.restSecond);
  let id = setInterval(() => {
    if (Time.restSecond === 0) {
      clearInterval(id);
      return;
    }
    Time.restSecond--;
    timer.innerText = format(Time.restSecond);
    bar.scale += bar.restRate;
    if (bar.scale >= 1 || Time.restSecond === 0) {
      // TODO: might calc the millisecond
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
