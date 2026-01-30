const KEY = "ideaMemo";

function loadMemos() {
  return JSON.parse(localStorage.getItem(KEY)) || [];
}

function saveMemos(memos) {
  localStorage.setItem(KEY, JSON.stringify(memos));
}

function addMemo(text, categoryId, subCategoryId) {
  const memos = loadMemos();
  memos.push({
    id: Date.now(),
    text,
    status: "pending",
    categoryId,
    subCategoryId
  });
  saveMemos(memos);
}

function updateStatus(id, status) {
  const memos = loadMemos();
  const m = memos.find(m => m.id === id);
  if (m) m.status = status;
  saveMemos(memos);
}
function deleteMemo(id) {
  const memos = loadMemos().filter(m => m.id !== id);
  saveMemos(memos);
}
