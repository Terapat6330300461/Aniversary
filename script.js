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

  const startDate = new Date(START_DATE);
  const today = new Date();

  let totalDays = Math.floor(
    (today - startDate) / (1000 * 60 * 60 * 24)
  );

  let years = today.getFullYear() - startDate.getFullYear();
  let months = today.getMonth() - startDate.getMonth();
  let days = today.getDate() - startDate.getDate();

  if (days < 0) {
    months--;
    const previousMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      0
    );
    days += previousMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

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
  
  // ล็อคไม่ให้ scroll หน้าเว็บ
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  document.querySelector(".lightbox").classList.remove("open");
  
  // ปลดล็อคให้ scroll ได้ตามปกติ
  document.body.style.overflow = "";
}
function lbStep(dir) {
  lbIndex = (lbIndex + dir + lbPhotos.length) % lbPhotos.length;
  document.querySelector(".lightbox img").src = lbPhotos[lbIndex];
}

/* ---------- Boot ---------- */
document.addEventListener("DOMContentLoaded", () => {
  createStars();
  updateCounter();
  initPhotoGrid();
  initQuote();
  initMessageWall();

  // year.html renders its own tabbar (it knows which year is active)
  if (!document.querySelector("[data-year-page]")) {
    renderTabbar(null);
  }

  // ส่วนจัดการ Lightbox และเพิ่มระบบปัด (Swipe)
  const lb = document.querySelector(".lightbox");
  const lbClose = document.querySelector(".lb-close");
  if (lbClose) lbClose.addEventListener("click", closeLightbox);
  
  const lbPrev = document.querySelector(".lb-prev");
  const lbNext = document.querySelector(".lb-next");
  if (lbPrev) lbPrev.addEventListener("click", () => lbStep(-1));
  if (lbNext) lbNext.addEventListener("click", () => lbStep(1));

  // --- เพิ่มระบบปัดซ้าย-ขวาตรงนี้ ---
  if (lb) {
    let touchStartX = 0;
    let touchEndX = 0;

    lb.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lb.addEventListener("touchend", (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    function handleSwipe() {
      const swipeDistance = touchEndX - touchStartX;
      const threshold = 50; // ความยาวขั้นต่ำที่นับว่าเป็นการปัด (พิกเซล)

      if (swipeDistance < -threshold) {
        // ปัดซ้าย -> ดูรูปถัดไป
        lbStep(1);
      } else if (swipeDistance > threshold) {
        // ปัดขวา -> ดูรูปก่อนหน้า
        lbStep(-1);
      }
    }
  }
});

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
  "รักนะเจ้าหมาตูบ🐶🥰",
  "งับเอว",
  "กริ๊งๆ",
  "รักนะเจ้าเด็กน้อย👶😍",
  "รักเท่าชีสเล๊ยย🧀",
  "เหอๆ",
];

let quoteIndex = 0;

function initQuote() {
  const emoji = document.querySelector(".quote-emoji");
  const text = document.querySelector(".quote-text");
  if (!emoji || !text) return;

  emoji.addEventListener("click", () => {
    text.textContent = QUOTES[quoteIndex];

    quoteIndex++;

    // ถ้าถึงตัวสุดท้าย ให้กลับไปตัวแรก
    if (quoteIndex >= QUOTES.length) {
      quoteIndex = 0;
    }

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


/* ---------- X (Twitter)-style bottom tab bar ----------
   Always shows at most 4 items so it never overflows as
   more years get added: Home, the previous year (if it has
   content), the current year, and the next year (if it
   already has content). */
const ICON_HOME_OUTLINE =
  '<svg viewBox="0 0 24 24"><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v9a1 1 0 0 0 1 1H10v-6h4v6h3.5a1 1 0 0 0 1-1v-9"/></svg>';
const ICON_HOME_FILLED =
  '<svg viewBox="0 0 24 24"><path d="M3 11.5 12 4l9 7.5v9a1 1 0 0 1-1 1h-4v-6h-4v6H4a1 1 0 0 1-1-1z"/></svg>';

// activeYear: null on the start page, or a year number on year.html
function renderTabbar(activeYear) {
  const bar = document.querySelector("[data-tabbar]");
  if (!bar) return;

  const homeTab = `
    <a class="tab-item${activeYear === null ? " active" : ""}" href="index.html" aria-label="หน้าแรก">
      ${activeYear === null ? ICON_HOME_FILLED : ICON_HOME_OUTLINE}
    </a>`;

  if (activeYear === null) {
    bar.innerHTML = homeTab;
    return;
  }

  const years =
    typeof YEARS !== "undefined" ? Object.keys(YEARS).map(Number) : [];
  const hasPrev = activeYear > 1 && years.includes(activeYear - 1);
  const hasNext = years.includes(activeYear + 1);

  const yearTab = (y, active) => `
    <a class="tab-item${active ? " active" : ""}" href="year.html?year=${y}" aria-label="ปีที่ ${y}">
      <span class="tab-badge">${y}</span>
    </a>`;

  let html = homeTab;
  if (hasPrev) html += yearTab(activeYear - 1, false);
  html += yearTab(activeYear, true);
  if (hasNext) html += yearTab(activeYear + 1, false);

  bar.innerHTML = html;
}


/* ---------- Boot ---------- */
document.addEventListener("DOMContentLoaded", () => {
  createStars();
  updateCounter();
  initPhotoGrid();
  initQuote();
  initMessageWall();

  // year.html renders its own tabbar (it knows which year is active)
  if (!document.querySelector("[data-year-page]")) {
    renderTabbar(null);
  }

  const lbClose = document.querySelector(".lb-close");
  if (lbClose) lbClose.addEventListener("click", closeLightbox);
  const lbPrev = document.querySelector(".lb-prev");
  const lbNext = document.querySelector(".lb-next");
  if (lbPrev) lbPrev.addEventListener("click", () => lbStep(-1));
  if (lbNext) lbNext.addEventListener("click", () => lbStep(1));
});
