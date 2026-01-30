const list = document.getElementById("runningList");

function render() {
  list.innerHTML = "";

  loadMemos()
    .filter(m => m.status === "running")
    .forEach(m => {
      const li = document.createElement("li");

      const text = document.createElement("span");
      text.textContent = m.text;

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

      li.append(text, doneBtn, delBtn);
      list.appendChild(li);
    });
}

render();
