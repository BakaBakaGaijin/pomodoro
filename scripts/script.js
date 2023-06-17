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

const details = document.querySelector("details");

// settings
const longBreakIntervalInput = document.querySelector(
  "#longBreakIntervalInput"
);
const breakInput = document.querySelector("#breakInput");
const longBreakInput = document.querySelector("#longBreakInput");
const saveBtn = document.querySelector("#save");

const soundOnIcon = document.querySelector("#soundOn").content.cloneNode(true);
const soundOffIcon = document
  .querySelector("#soundOff")
  .content.cloneNode(true);
const soundBtn = document.querySelector("#soundBtn");

const defaultTime = {
  work: {
    minutes: 25, // 25
    seconds: 0,
  },

  break: {
    minutes: 5, // 5
    seconds: 0,
  },

  longBreak: {
    minutes: 15, // 15
    seconds: 0,
  },
};

const time = {
  work: { ...defaultTime.work },
  break: { ...defaultTime.break },
  longBreak: { ...defaultTime.longBreak },
};

let longBreakInterval = 4;
let pomodoroAmount = 0;
let currentMode;
let timerId;
let currentMinutes;
let currentSeconds;
let isPause = false;

const alarm = new Audio("../audio/alarm.mp3");

const handleSound = () => {
  soundBtn.classList.toggle("sound-off");
  const soundBtnIcon = soundBtn.classList.contains("sound-off")
    ? soundOffIcon.cloneNode(true)
    : soundOnIcon.cloneNode(true);
  soundBtn.replaceChildren(soundBtnIcon);
  alarm.volume = alarm.volume ? 0 : 1;
};

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

  minutesEl.textContent = formatTime(minutes);
  secondsEl.textContent = formatTime(seconds);
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
      minutesEl.textContent = formatTime(currentMinutes);
      secondsEl.textContent = formatTime(currentSeconds);

      currentSeconds -= 1;

      if (currentSeconds === -1) {
        currentMinutes -= 1;

        if (currentMinutes === -1) {
          alarm.play();

          if (currentMode === "work") {
            pomodoroAmount += 1;

            !(pomodoroAmount % longBreakInterval)
              ? handleLongBreak()
              : handleBreak();
          } else {
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

const updateTime = (newMinutes, mode) => {
  if (currentMode === mode) {
    if (newMinutes < 1) {
      time[mode].minutes = 1;
      currentMinutes = 1;
    } else {
      time[mode].minutes = newMinutes;
    }

    currentSeconds = 0;
  } else {
    time[mode].minutes = newMinutes < 1 ? 1 : newMinutes;
  }
};

const handleSave = () => {
  const { value: longBreakMinutes } = longBreakInput;
  const { value: breakMinutes } = breakInput;
  const { value: newLongBreakInterval } = longBreakIntervalInput;

  longBreakInterval = newLongBreakInterval;
  pomodoroAmount = 0;

  updateTime(breakMinutes, "break");
  updateTime(longBreakMinutes, "longBreak");

  handleReset();

  details.removeAttribute("open");
};

workBtn.addEventListener("click", handleWork);
breakBtn.addEventListener("click", handleBreak);
longBreakBtn.addEventListener("click", handleLongBreak);

startBtn.addEventListener("click", handleStart);
pauseBtn.addEventListener("click", handlePause);
resetBtn.addEventListener("click", handleReset);
continueBtn.addEventListener("click", handleContinue);

saveBtn.addEventListener("click", handleSave);

soundBtn.addEventListener("click", handleSound);
