const list = document.getElementById("completedList");
getByStatus("completed").forEach(m => {
  const li = document.createElement("li");
  li.textContent = m.text;
  list.appendChild(li);
});
