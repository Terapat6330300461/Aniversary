/* ============================================
   Anz & Melody — content for each year
   Add a new entry here whenever a year is over
   and you want to lock in the real memories.
   Any year WITHOUT an entry still works — it just
   shows an empty template you can fill in later.
   ============================================ */

const YEARS = {
  1: {
    title: "ครบรอบ 1 ปี",
    heroEmoji: "🖤💜",
    memoryParagraphs: [
      "365 วันที่ผ่านมามีเรื่องราวเกิดขึ้นมากมาย",
      "ทั้งได้ไปเที่ยวกับเจ้าด้วยกันหลายๆ ที่",
      "กินหมูกระทะ ดูหนัง ได้เล่นเกมด้วยกัน",
      "ข้าน่ะมีความสุขมากๆ เลยนะ เหอๆ 💜",
    ],
    loveMessage: `"ดีใจนะที่ได้เจอกับเจ้า 🖤💕"`,
    wishList: [
      "💜 เที่ยวด้วยกันให้มากขึ้น",
      "🌟 กินของอร่อยด้วยกันเยอะๆ",
      "💕 รักกันมากขึ้นทุกวัน",
      "🎉 ฉลองครบรอบ 2 ปี ด้วยกัน",
    ],
  },
  2: {
    title: "ก้าวเข้าสู่ปีที่ 2",
    heroEmoji: "🌙💜",
    memoryParagraphs: [
      "ปีที่ 1 จบไปแล้วพร้อมความทรงจำดีๆ มากมาย",
      "หน้านี้เตรียมไว้สำหรับเรื่องราวของปีที่ 2 ที่กำลังจะเกิดขึ้น",
      "ทุกครั้งที่มีความทรงจำใหม่ กลับมาแก้ข้อความตรงนี้ แล้วใส่รูปเพิ่มได้เลยนะ",
    ],
    loveMessage: `"ปีนี้ก็ขอให้เจ้าอยู่ข้างๆ ข้าอีกนะ 🌙💜"`,
    wishList: [
      "💜 (แก้ไขตรงนี้เป็นเป้าหมายของปีที่ 2)",
      "🌟 (แก้ไขตรงนี้)",
      "💕 (แก้ไขตรงนี้)",
    ],
  },
};

// Fallback content for any year that hasn't been written yet
function defaultYearData(year) {
  return {
    title: `ก้าวเข้าสู่ปีที่ ${year}`,
    heroEmoji: "🌙💜",
    memoryParagraphs: [
      "หน้านี้กำลังรอถูกเขียน...",
      "ทุกครั้งที่มีความทรงจำใหม่ กลับมาแก้ไขใน year-data.js ตรงปีนี้ได้เลย",
    ],
    loveMessage: `"ปีที่ ${year} นี้ก็ขอให้เจ้าอยู่ข้างๆ ข้าอีกนะ 🌙💜"`,
    wishList: [
      "💜 (แก้ไขตรงนี้เป็นเป้าหมายของปีนี้)",
      "🌟 (แก้ไขตรงนี้)",
      "💕 (แก้ไขตรงนี้)",
    ],
  };
}

// Photo folders scale automatically: year 1 -> 1-4, year 2 -> 5-8, year 3 -> 9-12 ...
function foldersForYear(year) {
  const start = (year - 1) * 4 + 1;
  return [start, start + 1, start + 2, start + 3];
}

function getYearFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const y = parseInt(params.get("year"), 10);
  return !y || y < 1 ? 1 : y;
}

function renderYearPage() {
  const root = document.querySelector("[data-year-page]");
  if (!root) return;

  const year = getYearFromUrl();
  const data = YEARS[year] || defaultYearData(year);
  const folders = foldersForYear(year);

  document.title = `${data.title} 💜`;
  document.querySelector(".hero-emoji").textContent = data.heroEmoji;
  document.querySelector(".hero h1").textContent = data.title;

  const crumbYear = document.querySelector("[data-current-year]");
  if (crumbYear) crumbYear.textContent = `ปีที่ ${year}`;

  document.querySelector("[data-memory]").innerHTML = data.memoryParagraphs
    .map((p) => `<p>${escapeHtml(p)}</p>`)
    .join("");

  document.querySelector("[data-love-message]").textContent = data.loveMessage;

  document.querySelector("[data-wishlist]").innerHTML = data.wishList
    .map((w) => `<li>${escapeHtml(w)}</li>`)
    .join("");

  document.querySelector("[data-photo-grid]").innerHTML = folders
    .map(
      (f, i) => `
      <div class="photo-tile" data-folder="${f}">
        <img src="${f}/0.jpg" alt="ความทรงจำ ${i + 1}" loading="lazy">
        <span class="tap-hint">แตะเพื่อดู</span>
      </div>`
    )
    .join("");

  const hint = document.querySelector("[data-folder-hint]");
  if (hint) {
    hint.textContent = `* ใส่รูปไว้ในโฟลเดอร์ ${folders.join(
      ", "
    )} (ไฟล์ 0.jpg–3.jpg ต่อโฟลเดอร์)`;
  }

  // Prev / next
  const prevLink = document.querySelector("[data-prev-link]");
  if (prevLink) {
    if (year <= 1) {
      prevLink.href = "index.html";
      prevLink.textContent = "← เริ่มต้น";
    } else {
      prevLink.href = `year.html?year=${year - 1}`;
      prevLink.textContent = `← ปีที่ ${year - 1}`;
    }
  }
  const nextLink = document.querySelector("[data-next-link]");
  if (nextLink) {
    nextLink.href = `year.html?year=${year + 1}`;
    nextLink.textContent = YEARS[year + 1]
      ? `ปีที่ ${year + 1} →`
      : `เริ่มปีที่ ${year + 1} →`;
  }

  // Quick year chips
  const chipWrap = document.querySelector("[data-year-chips]");
  if (chipWrap) {
    const maxKnown = Math.max(year, ...Object.keys(YEARS).map(Number));
    let html = "";
    for (let y = 1; y <= maxKnown; y++) {
      html += `<a class="year-chip${
        y === year ? " active" : ""
      }" href="year.html?year=${y}">ปี ${y}</a>`;
    }
    html += `<a class="year-chip add" href="year.html?year=${
      maxKnown + 1
    }">+ ใหม่</a>`;
    chipWrap.innerHTML = html;
  }
}

document.addEventListener("DOMContentLoaded", renderYearPage);
