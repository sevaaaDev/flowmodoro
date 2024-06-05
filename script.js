function main() {
  const time = document.querySelector(".timer-time");
  const startBtn = document.querySelector(".start-btn");
  const pauseBtn = document.querySelector(".pause-btn");
  const restBtn = document.querySelector(".rest-btn");
  let Time = {
    studySecond: 0,
    restSecond: 0,
  };
  let id = 0;
  startBtn.addEventListener("click", () => {
    clearInterval(id);
    id = stopwatch(time, Time);
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
      id = reverseStopwatch(time, Time);
      changeButton();
      pauseBtn.removeEventListener("click", pauseHandler);
    }
    pauseBtn.addEventListener("click", pauseHandler, { once: true });
    restBtn.addEventListener("click", restHandler, { once: true });
  });
  // TODO: add rest timer
  // TODO: progress bar
}

function changeButton() {
  const startBtn = document.querySelector(".start-btn");
  const pauseBtn = document.querySelector(".pause-btn");
  const restBtn = document.querySelector(".rest-btn");
  startBtn.classList.toggle("invisible");
  pauseBtn.classList.toggle("invisible");
  restBtn.classList.toggle("invisible");
}
function stopwatch(timer, Time) {
  timer.innerText = prettify(Time.studySecond);
  let id = setInterval(() => {
    Time.studySecond++;
    timer.innerText = prettify(Time.studySecond);
  }, 1000);
  return id;
}

function reverseStopwatch(timer, Time) {
  timer.innerText = prettify(Time.restSecond);
  let id = setInterval(() => {
    if (Time.restSecond === 0) {
      clearInterval(id);
      return;
    }
    Time.restSecond--;
    timer.innerText = prettify(Time.restSecond);
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
