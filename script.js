const targets = [
  { label: '114/5/14', time: new Date('2025-05-14T00:00:00+08:00') },
  { label: '上午11:45:14', time: new Date('2025-05-14T11:45:14+08:00') },
  { label: '下午11:45:14', time: new Date('2025-05-14T23:45:14+08:00') }
];

let currentIndex = 0;
let autoSwitch = true;
let switchIntervalId = null;
let alarmPlayed = [false, false, false];
let isFront = true;

function formatTime(t) {
  return t.toString().padStart(2, '0');
}

function getCountdownText(targetTime, label, index) {
  const now = new Date();
  const diff = targetTime - now;
  if (diff > 0) {
    const h = Math.floor(diff / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);
    return `${label}<br>還有 ${formatTime(h)}：${formatTime(m)}：${formatTime(s)}`;
  } else {
    if (!alarmPlayed[index]) {
      document.getElementById("alarmSound").play().catch(console.error);
      alarmPlayed[index] = true;
    }
    return `${label}<br>哼哼哼～啊啊啊啊啊啊啊啊啊啊啊啊啊～`;
  }
}

function updateTimer() {
  const front = document.getElementById("timer-front");
  const back = document.getElementById("timer-back");
  const card = document.getElementById("card");
  const { time, label } = targets[currentIndex];

  const html = getCountdownText(time, label, currentIndex);

  if (isFront) {
    back.innerHTML = html;
    card.classList.add("flip");
  } else {
    front.innerHTML = html;
    card.classList.remove("flip");
  }
  isFront = !isFront;
}

function next() {
  currentIndex = (currentIndex + 1) % targets.length;
  updateTimer();
}

function prev() {
  currentIndex = (currentIndex - 1 + targets.length) % targets.length;
  updateTimer();
}

function toggleAuto() {
  autoSwitch = !autoSwitch;
  document.getElementById("toggleBtn").textContent = autoSwitch
    ? "暫停自動切換"
    : "繼續自動切換";
  if (autoSwitch) {
    startAutoSwitch();
  } else {
    stopAutoSwitch();
  }
}

function startAutoSwitch() {
  if (!switchIntervalId) {
    switchIntervalId = setInterval(next, 10000);
  }
}

function stopAutoSwitch() {
  clearInterval(switchIntervalId);
  switchIntervalId = null;
}

document.addEventListener("click", () => {
  const audio = document.getElementById("alarmSound");
  audio.play().then(() => audio.pause());
}, { once: true });

setInterval(updateTimer, 1000);
startAutoSwitch();
updateTimer();
