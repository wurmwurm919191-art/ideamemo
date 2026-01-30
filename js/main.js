const input = document.getElementById("memoInput");
const select = document.getElementById("statusSelect");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("memoList");

function render() {
  list.innerHTML = "";
  loadMemos().forEach(m => {
    const li = document.createElement("li");
    li.className = m.status;
    li.textContent = m.text;
    list.appendChild(li);
  });
}

addBtn.onclick = () => {
  const text = input.value.trim();
  if (!text) return;
  addMemo(text, select.value);
  input.value = "";
  render();
};

render();
