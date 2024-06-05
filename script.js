function main() {
  const time = document.querySelector(".timer-time");
  const startBtn = document.querySelector(".start-btn");
  const pauseBtn = document.querySelector(".pause-btn");
  const restBtn = document.querySelector(".rest-btn");
  const progressBar = document.querySelector(".progress-bar-2");
  let Time = {
    studySecond: 0,
    restSecond: 0,
  };
  let id = 0;
  let timeGoalSecond = 30;
  let barIncrementFactor = 1 / timeGoalSecond;
  startBtn.addEventListener("click", () => {
    clearInterval(id);
    id = stopwatch(time, Time, progressBar, barIncrementFactor);
    changeButton();
    function pauseHandler() {
      clearInterval(id);
      changeButton();
      restBtn.removeEventListener("click", restHandler);
    }
    function restHandler() {
      Time.restSecond = Math.floor(Time.studySecond / 5);
      let barFactor = 1 / Time.restSecond;
      Time.studySecond = 0;
      clearInterval(id);
      id = reverseStopwatch(time, Time, progressBar, barFactor);
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
function stopwatch(timer, Time, bar, factor) {
  let barScale = 1;
  timer.innerText = prettify(Time.studySecond);
  let id = setInterval(() => {
    Time.studySecond++;
    timer.innerText = prettify(Time.studySecond);
    barScale -= factor;
    if (barScale <= 0) {
      barScale = 0;
    }
    bar.style.transform = `scaleY(${barScale})`;
  }, 1000);
  return id;
}

function reverseStopwatch(timer, Time, bar, factor) {
  let barScale = 0; // WARN: the user might rest when the bar is not full, so this should be the current barScale, not 0
  timer.innerText = prettify(Time.restSecond);
  let id = setInterval(() => {
    if (Time.restSecond === 0) {
      clearInterval(id);
      return;
    }
    Time.restSecond--;
    timer.innerText = prettify(Time.restSecond);
    barScale += factor;
    if (barScale >= 1) {
      barScale = 1;
    }
    bar.style.transform = `scaleY(${barScale})`;
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
