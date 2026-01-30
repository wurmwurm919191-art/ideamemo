const KEY = "ideaMemo";

function loadMemos() {
  return JSON.parse(localStorage.getItem(KEY)) || [];
}

function saveMemos(memos) {
  localStorage.setItem(KEY, JSON.stringify(memos));
}

function addMemo(text) {
  const memos = loadMemos();
  memos.push({ id: Date.now(), text, status: "pending" });
  saveMemos(memos);
}

function updateStatus(id, status) {
  const memos = loadMemos();
  const m = memos.find(m => m.id === id);
  if (m) m.status = status;
  saveMemos(memos);
}
