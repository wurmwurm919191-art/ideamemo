const list = document.getElementById("completedList");

function render() {
  list.innerHTML = "";

  loadMemos()
    .filter(m => m.status === "completed")
    .forEach(m => {
      const li = document.createElement("li");

      const text = document.createElement("span");
      text.textContent = m.text;

      const delBtn = document.createElement("button");
      delBtn.textContent = "삭제";
      delBtn.onclick = () => {
        deleteMemo(m.id);
        render();
      };

      li.append(text, delBtn);
      list.appendChild(li);
    });
}

render();
