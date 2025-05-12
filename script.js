const targets = [
  { label: '114/5/14', time: new Date('2025-05-14T00:00:00+08:00') },
  { label: '上午11:45:14', time: new Date('2025-05-14T11:45:14+08:00') },
  { label: '下午11:45:14', time: new Date('2025-05-14T23:45:14+08:00') }
];

let currentIndex = 0;
let showingFront = true;
let autoSwitch = true;
let switchIntervalId = null;
const alarmPlayed = [false, false, false];

function pad(n) {
  return n.toString().padStart(2, '0');
}

function updateTimer() {
  const now = new Date();
  const { label, time } = targets[currentIndex];
  const diff = time - now;

  let text;
  if (diff > 0) {
    const hours = pad(Math.floor(diff / (1000 * 60 * 60)));
    const minutes = pad(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)));
    const seconds = pad(Math.floor((diff % (1000 * 60)) / 1000));
    text = `還有 ${hours}：${minutes}：${seconds}`;
  } else {
    text = `哼哼哼～啊啊啊啊啊啊啊啊啊啊啊啊啊～`;
    if (!alarmPlayed[currentIndex]) {
      document.getElementById("alarmSound").play().catch(err => {
        console.log("音訊播放失敗：", err);
      });
      alarmPlayed[currentIndex] = true;
    }
  }

  const nextFace = showingFront ? "Back" : "Front";
  document.getElementById("label" + nextFace).textContent = targets[currentIndex].label;
  document.getElementById("countdown" + nextFace).textContent = text;
}

function rotateCard(direction) {
  currentIndex = (currentIndex + targets.length + direction) % targets.length;
  showingFront = !showingFront;
  const flipCard = document.getElementById("flipCard");
  flipCard.classList.toggle("show-back");
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
    switchIntervalId = setInterval(() => rotateCard(1), 10000);
  }
}

function stopAutoSwitch() {
  if (switchIntervalId) {
    clearInterval(switchIntervalId);
    switchIntervalId = null;
  }
}

// 啟用音訊播放權限
document.addEventListener("click", () => {
  const audio = document.getElementById("alarmSound");
  audio.play().then(() => audio.pause());
}, { once: true });

// 初始化
setInterval(updateTimer, 1000);
startAutoSwitch();
updateTimer();
