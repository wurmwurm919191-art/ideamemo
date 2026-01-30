const list = document.getElementById("runningList");

function loadMemos() {
  return JSON.parse(localStorage.getItem("ideaMemos")) || [];
}

function saveMemos(memos) {
  localStorage.setItem("ideaMemos", JSON.stringify(memos));
}

function render() {
  list.innerHTML = "";

  loadMemos()
    .filter(m => m.status === "running")
    .forEach(m => {
      const li = document.createElement("li");

      const text = document.createElement("span");
      text.textContent = m.text;

      const btns = document.createElement("div");

      const doneBtn = document.createElement("button");
      doneBtn.textContent = "완료";
      doneBtn.onclick = () => {
        const memos = loadMemos();
        const target = memos.find(x => x.id === m.id);
        if (!target) return;

        target.status = "completed";
        saveMemos(memos);

        location.href = "completed.html"; // 🔥 완료방으로 이동
      };

      const delBtn = document.createElement("button");
      delBtn.textContent = "삭제";
      delBtn.onclick = () => {
        saveMemos(loadMemos().filter(x => x.id !== m.id));
        render();
      };

      btns.append(doneBtn, delBtn);
      li.append(text, btns);
      list.appendChild(li);
    });
}

render();
