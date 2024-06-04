function main() {
  const time = document.querySelector(".timer-time");
  const startBtn = document.querySelector(".start-btn");
  const pauseBtn = document.querySelector(".pause-btn");
  const restBtn = document.querySelector(".rest-btn");
  let Time = {
    second: 0,
  };
  startBtn.addEventListener("click", () => {
    let id = stopwatch(time, Time);
    changeButton();
    function pauseHandler() {
      clearInterval(id);
      changeButton();
      restBtn.removeEventListener("click", restHandler);
    }
    function restHandler() {
      Time.second = 0;
      clearInterval(id);
      changeButton();
      pauseBtn.removeEventListener("click", pauseHandler);
    }
    pauseBtn.addEventListener("click", pauseHandler, { once: true });
    restBtn.addEventListener("click", restHandler, { once: true });
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
function stopwatch(timer, Time) {
  let id = setInterval(() => {
    Time.second++;
    timer.innerText = prettify(Time.second);
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
