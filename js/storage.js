/* =========================
   CATEGORY STORAGE
========================= */
const CATEGORY_KEY = "ideaCategories";

function loadCategories() {
  return JSON.parse(localStorage.getItem(CATEGORY_KEY)) || [];
}

function saveCategories(categories) {
  localStorage.setItem(CATEGORY_KEY, JSON.stringify(categories));
}

/* =========================
   MEMO STORAGE
========================= */
const MEMO_KEY = "ideaMemos";

function loadMemos() {
  return JSON.parse(localStorage.getItem(MEMO_KEY)) || [];
}

function saveMemos(memos) {
  localStorage.setItem(MEMO_KEY, JSON.stringify(memos));
}
