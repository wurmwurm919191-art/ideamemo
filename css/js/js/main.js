const input = document.getElementById("memoInput");
const buttons = document.querySelectorAll("button");

buttons.forEach(b => {
  b.onclick = () => {
    if (!input.value.trim()) return;
    addMemo(input.value.trim(), b.dataset.status);
    input.value = "";

    if (b.dataset.status === "completed") location.href = "completed.html";
    if (b.dataset.status === "running") location.href = "running.html";
  };
});
