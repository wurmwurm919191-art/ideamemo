const list = document.getElementById("runningList");

function loadMemos() {
  return JSON.parse(localStorage.getItem("ideaMemos")) || [];
}
function saveMemos(memos) {
  localStorage.setItem("ideaMemos", JSON.stringify(memos));
}

function render() {
  list.innerHTML = "";
  loadMemos().filter(m => m.status === "running").forEach(m => {
    const li = document.createElement("li");

    const text = document.createElement("span");
    text.textContent = m.text;

    const btns = document.createElement("div");

    const done = document.createElement("button");
    done.textContent = "완료";
    done.onclick = () => {
      m.status = "completed";
      saveMemos(loadMemos());
      render();
    };

    const del = document.createElement("button");
    del.textContent = "삭제";
    del.onclick = () => {
      saveMemos(loadMemos().filter(x => x.id !== m.id));
      render();
    };

    btns.append(done, del);
    li.append(text, btns);
    list.appendChild(li);
  });
}

render();
