const workBtn = document.querySelector("#work");
const breakBtn = document.querySelector("#break");
const longBreakBtn = document.querySelector("#long-break");

const modes = document.querySelectorAll(".menu__button");

const startBtn = document.querySelector("#start");
const pauseBtn = document.querySelector("#pause");
const resetBtn = document.querySelector("#reset");
const continueBtn = document.querySelector("#continue");

const minutesEl = document.querySelector("#minutes");
const secondsEl = document.querySelector("#seconds");

const time = {
  work: {
    minutes: 0,
    seconds: 10,
  },

  break: {
    minutes: 0,
    seconds: 20,
  },

  longBreak: {
    minutes: 0,
    seconds: 30,
  },
};

let currentMode;
let timerId;
let currentMinutes;
let currentSeconds;
let isPause = false;

const setClasses = (selectedMode) => {
  modes.forEach((mode) => mode.classList.remove("menu__button_active"));

  switch (selectedMode) {
    case "work":
      workBtn.classList.add("menu__button_active");
      break;
    case "break":
      breakBtn.classList.add("menu__button_active");
      break;
    default:
      longBreakBtn.classList.add("menu__button_active");
  }
};

const handleWork = () => {
  changeMode("work");
};

const handleBreak = () => {
  changeMode("break");
};

const handleLongBreak = () => {
  changeMode("longBreak");
};

const changeMode = (mode) => {
  clearInterval(timerId);
  timerId = null;
  startBtn.classList.remove("control_hidden");
  pauseBtn.classList.add("control_hidden");
  continueBtn.classList.add("control_hidden");
  resetBtn.classList.add("control_hidden");
  setClasses(mode);
  currentMode = mode;
  isPause = false;
  const { minutes, seconds } = time[mode];

  minutesEl.innerHTML = minutes;
  secondsEl.innerHTML = seconds;
};

handleWork(); // Задаём начальное значение

const handleStart = () => {
  if (!timerId) {
    if (!isPause) {
      let { minutes, seconds } = time[currentMode];
      currentMinutes = minutes;
      currentSeconds = seconds;
    }

    if (!currentSeconds) {
      currentMinutes -= 1;
      currentSeconds = 59;
    } else {
      if (!isPause) {
        currentSeconds -= 1;
      }
    }

    const timer = () => {
      minutesEl.innerHTML = currentMinutes;
      secondsEl.innerHTML = currentSeconds;

      currentSeconds -= 1;

      if (currentSeconds === -1) {
        currentMinutes -= 1;

        if (currentMinutes === -1) {
          switch (currentMode) {
            case "work":
              handleBreak();
              break;
            case "break":
              handleLongBreak();
              break;
            default:
              handleWork();
          }
        }

        currentSeconds = 59;
      }
    };

    startBtn.classList.add("control_hidden");
    pauseBtn.classList.remove("control_hidden");
    resetBtn.classList.remove("control_hidden");
    timerId = setInterval(timer, 1000);
  }
};

const handlePause = () => {
  isPause = true;
  clearInterval(timerId);
  timerId = null;

  pauseBtn.classList.add("control_hidden");
  continueBtn.classList.remove("control_hidden");
};

const handleReset = () => {
  switch (currentMode) {
    case "work":
      handleWork();
      break;
    case "break":
      handleBreak();
      break;
    default:
      handleLongBreak();
  }
};

const handleContinue = () => {
  pauseBtn.classList.remove("control_hidden");
  continueBtn.classList.add("control_hidden");

  handleStart();
};

workBtn.addEventListener("click", handleWork);
breakBtn.addEventListener("click", handleBreak);
longBreakBtn.addEventListener("click", handleLongBreak);

startBtn.addEventListener("click", handleStart);
pauseBtn.addEventListener("click", handlePause);
resetBtn.addEventListener("click", handleReset);
continueBtn.addEventListener("click", handleContinue);
