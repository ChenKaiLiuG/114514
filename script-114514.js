const targets = [
  { label: '114/5/14', time: new Date('2025-05-14T00:00:00+08:00') },
  { label: '114/5/14 上午11:45:14', time: new Date('2025-05-14T11:45:14+08:00') },
  { label: '114/5/14 下午11:45:14', time: new Date('2025-05-14T23:45:14+08:00') }
];

let currentIndex = 0;
let autoFlip = true;
let flipTimer = null;
let alarmPlayed = [false, false, false];
let flipState = false;

const cardFront = document.getElementById('cardContent');
const cardBack = document.getElementById('cardBackContent');
const flipCard = document.getElementById('flipCard');

function formatCountdown(targetTime) {
  const now = new Date();
  const diff = targetTime - now;
  if (diff > 0) {
    const hours = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, '0');
    const minutes = String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
    const seconds = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, '0');
    return `倒數 ${hours} ： ${minutes} ： ${seconds}`;
  } else {
    return '哼哼哼～啊啊啊啊啊啊啊啊啊啊啊啊啊～';
  }
}

function updateCardContent() {
  const { label, time } = targets[currentIndex];
  const content = `${label}\n${formatCountdown(time)}`;
  if (flipState) {
    cardBack.textContent = content;
  } else {
    cardFront.textContent = content;
  }

  const now = new Date();
  if (now >= time && !alarmPlayed[currentIndex]) {
    document.getElementById("alarmSound").play().catch(() => {});
    alarmPlayed[currentIndex] = true;
  }
}

function next() {
  currentIndex = (currentIndex + 1) % targets.length;
  manualFlip();
}

function prev() {
  currentIndex = (currentIndex - 1 + targets.length) % targets.length;
  manualFlip();
}

function manualFlip() {
  flipState = !flipState;
  flipCard.classList.toggle('flipped');
  updateCardContent();
}

function toggleAuto() {
  autoFlip = !autoFlip;
  const btn = document.getElementById("toggleBtn");
  btn.textContent = autoFlip ? '暫停自動翻轉' : '繼續自動翻轉';
  if (autoFlip) {
    startAutoFlip();
  } else {
    stopAutoFlip();
  }
}

function startAutoFlip() {
  stopAutoFlip();
  flipTimer = setInterval(() => {
    currentIndex = (currentIndex + 1) % targets.length;
    flipState = !flipState;
    flipCard.classList.toggle('flipped');
    updateCardContent();
  }, 15000);
}

function stopAutoFlip() {
  clearInterval(flipTimer);
  flipTimer = null;
}

setInterval(updateCardContent, 1000);
updateCardContent();
startAutoFlip();

document.addEventListener("click", () => {
  const audio = document.getElementById("alarmSound");
  audio.play().then(() => audio.pause());
}, { once: true });
