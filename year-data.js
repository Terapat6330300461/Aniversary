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
    heroEmoji: "🎀💜",
    memoryParagraphs: [
      "365 วันที่ผ่านมามีเรื่องราวเกิดขึ้นมากมาย",
      "ทั้งได้ไปเที่ยวกับเจ้าด้วยกันหลายๆ ที่",
      "กินหมูกระทะ ดูหนัง ได้เล่นเกมด้วยกัน",
      "ข้าน่ะมีความสุขมากๆ เลยนะ เหอๆ 💜",
    ],
    loveMessage: `"ดีใจนะที่ได้เจอกับเจ้า 💞💕"`,
    wishList: [
      "💜 เที่ยวด้วยกันให้มากขึ้น",
      "🌟 กินของอร่อยด้วยกันเยอะๆ",
      "💕 รักกันมากขึ้นทุกวัน",
      "🎉 ฉลองครบรอบ 2 ปี ด้วยกัน",
    ],
  },
  2: {
    title: "ก้าวเข้าสู่ปีที่ 2",
    heroEmoji: "🐶💜",
    memoryParagraphs: [
      "2 ปีผ่านไปไวเหมือนโกเจ็ดวัน",
      "ข้าน่ะรักเจ้าหมาตูบเท่าชีสเล๊ยย",
      "และเจ้าก็รักข้าเท่าชีสเหมือนกัน",
      "ไว้มาสร้างความทรงจำกันต่อเยอะๆนะ 💜",
    ],
    loveMessage: `"รักนะเจ้าหมาตัวโปรด 🐶💕"`,
    wishList: [
      "💜 หายปวดหลังไปด้วยกัน",
      "🌟 กินให้เต็มอิ่ม เล่นให้เต็มที่ พักผ่อนให้เพียงพอ",
      "💕 รักกันหวานชื้นจนมดขึ้นห้อง",
      "🎉 ก้าวไปสู่ปีที่ 3 ด้วยกัน วู้วๆเย้ๆ",
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

  const definedYears = Object.keys(YEARS).map(Number);
  const maxYear = definedYears.length ? Math.max(...definedYears) : 1;

  let year = getYearFromUrl();
  if (year > maxYear) {
    // don't reveal a year that hasn't been written yet — snap back
    // to the latest real year instead
    window.location.replace(`year.html?year=${maxYear}`);
    return;
  }

  const data = YEARS[year] || defaultYearData(year);
  const folders = foldersForYear(year);

  document.title = `${data.title} 💜`;
  document.querySelector(".hero-emoji").textContent = data.heroEmoji;
  document.querySelector(".hero h1").textContent = data.title;


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



  renderTabbar(year);
}

document.addEventListener("DOMContentLoaded", renderYearPage);
