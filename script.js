/* ============================================
   Anz & Melody — shared behaviour
   ============================================ */

// 🔧 EDIT THIS: the date you two started counting from (YYYY-MM-DD)
const START_DATE = "2024-07-19";

/* ---------- Starfield ---------- */
function createStars() {
  const container = document.querySelector(".stars");
  if (!container) return;
  const count = window.innerWidth < 480 ? 60 : 100;
  for (let i = 0; i < count; i++) {
    const star = document.createElement("div");
    star.className = "star";
    star.style.left = Math.random() * 100 + "%";
    star.style.top = Math.random() * 100 + "%";
    star.style.animationDelay = Math.random() * 3 + "s";
    container.appendChild(star);
  }
}

/* ---------- Day counter + moon phase ---------- */
function updateCounter() {
  const bigNumberEl = document.querySelector("[data-days]");
  if (!bigNumberEl) return;

  const start = new Date(START_DATE + "T00:00:00");
  const now = new Date();
  const diffMs = now - start;
  const totalDays = Math.max(0, Math.floor(diffMs / 86400000));
  const years = Math.floor(totalDays / 365);
  const months = Math.floor((totalDays % 365) / 30);
  const days = (totalDays % 365) % 30;

  bigNumberEl.textContent = totalDays.toLocaleString("th-TH");

  const sub = document.querySelector("[data-sub]");
  if (sub) {
    sub.innerHTML = `
      <div><b>${years}</b>ปี</div>
      <div><b>${months}</b>เดือน</div>
      <div><b>${days}</b>วัน</div>
    `;
  }

  // Moon phase shadow follows day-of-cycle (purely decorative, ~29.5 day cycle)
  const phaseShadow = document.querySelector(".moon-phase .shadow");
  if (phaseShadow) {
    const cyclePos = (totalDays % 29.5) / 29.5; // 0..1
    const offset = Math.cos(cyclePos * Math.PI * 2) * 64;
    phaseShadow.style.transform = `translateX(${offset}px)`;
  }
}

/* ---------- Lightbox ---------- */
let lbPhotos = [];
let lbIndex = 0;

function openLightbox(photos, index) {
  lbPhotos = photos;
  lbIndex = index;
  const lb = document.querySelector(".lightbox");
  const img = lb.querySelector("img");
  img.src = lbPhotos[lbIndex];
  lb.classList.add("open");
}
function closeLightbox() {
  document.querySelector(".lightbox").classList.remove("open");
}
function lbStep(dir) {
  lbIndex = (lbIndex + dir + lbPhotos.length) % lbPhotos.length;
  document.querySelector(".lightbox img").src = lbPhotos[lbIndex];
}

function initPhotoGrid() {
  // Each tile can either be a single image (data-src) or a whole
  // folder of 4 photos (data-folder="1" -> 1/0.jpg .. 1/3.jpg)
  const tiles = document.querySelectorAll(".photo-tile");
  tiles.forEach((tile) => {
    tile.addEventListener("click", () => {
      if (tile.dataset.folder) {
        const folder = tile.dataset.folder;
        const photos = [0, 1, 2, 3].map((n) => `${folder}/${n}.jpg`);
        openLightbox(photos, 0);
      } else if (tile.dataset.src) {
        openLightbox([tile.dataset.src], 0);
      }
    });
  });
}

/* ---------- Quote / tap feature ---------- */
const QUOTES = [
  "ทุกวันที่มีเจ้าอยู่ด้วย มันคือวันดีๆ 💜",
  "ข้าไม่รู้จะพูดยังไงให้เจ้าเข้าใจ แต่ข้ารักเจ้ามากจริงๆ 🖤",
  "ขอบคุณที่เลือกอยู่ข้างๆ กันตลอดมานะ",
  "เจ้าทำให้วันธรรมดาๆ กลายเป็นวันพิเศษเสมอ",
  "ไม่ว่าจะกี่ปี ข้าก็ยังอยากเดินไปกับเจ้าอยู่ดี",
  "รักเจ้าที่สุดในจักรวาลเลยนะ 💫",
];

function initQuote() {
  const emoji = document.querySelector(".quote-emoji");
  const text = document.querySelector(".quote-text");
  if (!emoji || !text) return;
  emoji.addEventListener("click", () => {
    const q = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    text.textContent = q;
    emoji.style.animation = "none";
    void emoji.offsetWidth;
    emoji.style.animation = "dance 0.4s ease-in-out 3";
  });
}

/* ---------- Message wall (stored in this browser) ---------- */
const MSG_KEY = "anz_melody_messages";

function loadMessages() {
  try {
    return JSON.parse(localStorage.getItem(MSG_KEY) || "[]");
  } catch {
    return [];
  }
}
function saveMessages(list) {
  localStorage.setItem(MSG_KEY, JSON.stringify(list));
}
function renderMessages() {
  const wall = document.querySelector(".msg-wall");
  if (!wall) return;
  const list = loadMessages();
  if (list.length === 0) {
    wall.innerHTML = `<div class="msg-empty">ยังไม่มีข้อความเลย ลองพิมพ์อะไรถึงกันดูสิ 💌</div>`;
    return;
  }
  wall.innerHTML = list
    .slice()
    .reverse()
    .map(
      (m) => `<div class="msg-item">${escapeHtml(m.text)}<time>${new Date(
        m.at
      ).toLocaleString("th-TH")}</time></div>`
    )
    .join("");
}
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
function initMessageWall() {
  const input = document.querySelector(".msg-input");
  const sendBtn = document.querySelector(".msg-send-btn");
  if (!input || !sendBtn) return;

  const send = () => {
    const text = input.value.trim();
    if (!text) return;
    const list = loadMessages();
    list.push({ text, at: Date.now() });
    saveMessages(list);
    input.value = "";
    renderMessages();
  };

  sendBtn.addEventListener("click", send);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") send();
  });
  renderMessages();
}

/* ---------- Boot ---------- */
document.addEventListener("DOMContentLoaded", () => {
  createStars();
  updateCounter();
  initPhotoGrid();
  initQuote();
  initMessageWall();

  const lbClose = document.querySelector(".lb-close");
  if (lbClose) lbClose.addEventListener("click", closeLightbox);
  const lbPrev = document.querySelector(".lb-prev");
  const lbNext = document.querySelector(".lb-next");
  if (lbPrev) lbPrev.addEventListener("click", () => lbStep(-1));
  if (lbNext) lbNext.addEventListener("click", () => lbStep(1));
});
