const list = document.getElementById("runningList");

loadMemos()
  .filter(m => m.status === "running")
  .forEach(m => {
    const li = document.createElement("li");
    li.textContent = m.text;
    list.appendChild(li);
  });
