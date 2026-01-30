const KEY = "memos";

function loadMemos() {
  return JSON.parse(localStorage.getItem(KEY)) || [];
}

function saveMemos(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

function addMemo(text, status) {
  const data = loadMemos();
  data.push({ id: Date.now(), text, status });
  saveMemos(data);
}
