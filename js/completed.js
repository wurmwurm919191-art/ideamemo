const list = document.getElementById("completedList");

function loadMemos() {
  return JSON.parse(localStorage.getItem("ideaMemos")) || [];
}
function saveMemos(memos) {
  localStorage.setItem("ideaMemos", JSON.stringify(memos));
}

function render() {
  list.innerHTML = "";
  loadMemos().filter(m => m.status === "completed").forEach(m => {
    const li = document.createElement("li");

    const text = document.createElement("span");
    text.textContent = m.text;

    const del = document.createElement("button");
    del.textContent = "삭제";
    del.onclick = () => {
      saveMemos(loadMemos().filter(x => x.id !== m.id));
      render();
    };

    li.append(text, del);
    list.appendChild(li);
  });
}

render();
