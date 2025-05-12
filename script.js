const targets = [
  { label: '114/5/14', time: new Date('2025-05-14T00:00:00+08:00') },
  { label: '上午11:45:14', time: new Date('2025-05-14T11:45:14+08:00') },
  { label: '下午11:45:14', time: new Date('2025-05-14T23:45:14+08:00') }
];

let currentIndex = 0;
let autoSwitch = true;
let switchIntervalId = null;
const alarmPlayed = [false, false, false];
let isFront = true;

function formatTime(hours, minutes, seconds) {
  return `${hours.toString().padStart(2, '0')}：${minutes.toString().padStart(2, '0')}：${seconds.toString().padStart(2, '0')}`;
}

function updateTimerContent(target, index) {
  const now = new Date();
  const diff = target.time - now;

  if (diff > 0) {
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${target.label}<br>還有 ${formatTime(hours, minutes, seconds)}`;
  } else {
    if (!alarmPlayed[index]) {
      document.getElementById("alarmSound").play().catch(err => {
        console.log("音訊播放失敗：", err);
      });
      alarmPlayed[index] = true;
    }
    return `${target.label}<br>哼哼哼～啊啊啊啊啊啊啊啊啊啊啊啊啊～`;
  }
}

function updateTimer() {
  const card = document.getElementById("card");
  const front = document.getElementById("timer-front");
  const back = document.getElementById("timer-back");

  const content = updateTimerContent(targets[currentIndex], currentIndex);

  if (isFront) {
    back.innerHTML = content;
    card.classList.add('flip');
  } else {
    front.innerHTML = content;
    card.classList.remove('flip');
  }

  isFront = !isFront;
}

function prev() {
  currentIndex = (currentIndex + targets.length - 1) % targets.length;
  updateTimer();
}

function next() {
  currentIndex = (currentIndex + 1) % targets.length;
  updateTimer();
}

function toggleAuto() {
  autoSwitch = !autoSwitch;
  const btn = document.getElementById("toggleBtn");
  if (autoSwitch) {
    btn.textContent = "暫停自動切換";
    startAutoSwitch();
  } else {
    btn.textContent = "繼續自動切換";
    stopAutoSwitch();
  }
}

function startAutoSwitch() {
  if (!switchIntervalId) {
    switchIntervalId = setInterval(() => {
      next();
    }, 10000);
  }
}

function stopAutoSwitch() {
  if (switchIntervalId) {
    clearInterval(switchIntervalId);
    switchIntervalId = null;
  }
}

document.addEventListener("click", () => {
  const audio = document.getElementById("alarmSound");
  audio.play().then(() => audio.pause());
}, { once: true });

setInterval(updateTimer, 1000); // 每秒更新時間
startAutoSwitch();
updateTimer();
