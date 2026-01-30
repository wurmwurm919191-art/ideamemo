const list = document.getElementById("completedList");

loadMemos()
  .filter(m => m.status === "completed")
  .forEach(m => {
    const li = document.createElement("li");
    li.textContent = m.text;
    list.appendChild(li);
  });
