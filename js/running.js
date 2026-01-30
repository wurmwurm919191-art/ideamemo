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

      const doneBtn = document.createElement("button");
      doneBtn.textContent = "완료";
      doneBtn.onclick = () => {
        const memos = loadMemos();
        const target = memos.find(x => x.id === m.id);
        if (!target) return;

        // ✅ 상태만 변경
        target.status = "completed";
        saveMemos(memos);

        // ✅ 바로 완료 페이지로 이동
        // ❌ running 화면은 건드리지 않음
        location.href = "completed.html";
      };

      const delBtn = document.createElement("button");
      delBtn.textContent = "삭제";
      delBtn.onclick = () => {
        saveMemos(loadMemos().filter(x => x.id !== m.id));
        location.reload();
      };

      li.append(text, doneBtn, delBtn);
      list.appendChild(li);
    });
}

render();
