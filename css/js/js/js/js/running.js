const list = document.getElementById("runningList");
getByStatus("running").forEach(m => {
  const li = document.createElement("li");
  li.textContent = m.text;
  list.appendChild(li);
});
