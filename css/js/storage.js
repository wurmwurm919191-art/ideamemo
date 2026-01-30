const KEY = "idea_memos";

function loadMemos() {
  return JSON.parse(localStorage.getItem(KEY)) || [];
}

function saveMemos(memos) {
  localStorage.setItem(KEY, JSON.stringify(memos));
}

function addMemo(text, status) {
  const memos = loadMemos();
  memos.push({ id: Date.now(), text, status });
  saveMemos(memos);
}

function getByStatus(status) {
  return loadMemos().filter(m => m.status === status);
}
