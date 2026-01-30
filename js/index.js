const input = document.getElementById("memoInput");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("pendingList");

function render() {
  list.innerHTML = "";

  loadMemos()
    .filter(m => m.status === "pending")
    .forEach(m => {
      const li = document.createElement("li");

      const text = document.createElement("span");
      text.textContent = m.text;

      const actions = document.createElement("div");
      actions.className = "actions";

      const runBtn = document.createElement("button");
      runBtn.textContent = "진행중";
      runBtn.onclick = () => {
        updateStatus(m.id, "running");
        render();
      };

      const doneBtn = document.createElement("button");
      doneBtn.textContent = "완료";
      doneBtn.onclick = () => {
        updateStatus(m.id, "completed");
        render();
      };

      const delBtn = document.createElement("button");
      delBtn.textContent = "삭제";
      delBtn.onclick = () => {
        deleteMemo(m.id);
        render();
      };

      actions.append(runBtn, doneBtn, delBtn);
      li.append(text, actions);
      list.appendChild(li);
    });
}

addBtn.onclick = () => {
  const text = input.value.trim();
  if (!text) return;
  addMemo(text);
  input.value = "";
  render();
};

render();
