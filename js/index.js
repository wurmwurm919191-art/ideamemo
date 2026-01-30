const input = document.getElementById("memoInput");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("pendingList");

const mainSelect = document.getElementById("mainSelect");
const subSelect = document.getElementById("subSelect");

let view = {
  level: "main", // main | sub | memo
  mainId: null,
  subId: null
};

/* =========================
   STORAGE
========================= */
function loadCategories() {
  return JSON.parse(localStorage.getItem("ideaCategories")) || [];
}

function loadMemos() {
  return JSON.parse(localStorage.getItem("ideaMemos")) || [];
}

function saveMemos(memos) {
  localStorage.setItem("ideaMemos", JSON.stringify(memos));
}

/* =========================
   SELECT RENDER
========================= */
function renderCategorySelect() {
  const categories = loadCategories();

  mainSelect.innerHTML = `<option value="">대분류</option>`;
  subSelect.innerHTML = `<option value="">소분류</option>`;

  categories.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c.id;
    opt.textContent = c.name;
    mainSelect.appendChild(opt);
  });
}

mainSelect.onchange = () => {
  const categories = loadCategories();
  const selected = categories.find(c => c.id === Number(mainSelect.value));

  subSelect.innerHTML = `<option value="">소분류</option>`;
  if (!selected) return;

  selected.subs.forEach(s => {
    const opt = document.createElement("option");
    opt.value = s.id;
    opt.textContent = s.name;
    subSelect.appendChild(opt);
  });
};

/* =========================
   ADD MEMO
========================= */
addBtn.onclick = () => {
  const text = input.value.trim();
  const categoryId = Number(mainSelect.value);
  const subCategoryId = Number(subSelect.value);

  if (!text || !categoryId || !subCategoryId) {
    alert("아이디어 / 대분류 / 소분류 선택");
    return;
  }

  const memos = loadMemos();
  memos.push({
    id: Date.now(),
    text,
    status: "pending",
    categoryId,
    subCategoryId
  });
  saveMemos(memos);

  input.value = "";
  render();
};

/* =========================
   RENDER
========================= */
function render() {
  list.innerHTML = "";

  const categories = loadCategories();
  const memos = loadMemos().filter(m => m.status === "pending");

  /* ===== 대분류 폴더 ===== */
  if (view.level === "main") {
    categories.forEach(cat => {
      const li = document.createElement("li");
      li.textContent = "▸ " + cat.name;
      li.onclick = () => {
        view = { level: "sub", mainId: cat.id };
        render();
      };
      list.appendChild(li);
    });
    return;
  }

  /* ===== 소분류 폴더 ===== */
  if (view.level === "sub") {
    const cat = categories.find(c => c.id === view.mainId);
    if (!cat) return;

    cat.subs.forEach(sub => {
      const li = document.createElement("li");
      li.textContent = "▸ " + sub.name;
      li.onclick = () => {
        view = { level: "memo", mainId: cat.id, subId: sub.id };
        render();
      };
      list.appendChild(li);
    });

    backButton("대분류로");
    return;
  }

  /* ===== 메모 목록 ===== */
  if (view.level === "memo") {
    const filtered = memos.filter(
      m => m.categoryId === view.mainId && m.subCategoryId === view.subId
    );

    filtered.forEach(m => {
      const li = document.createElement("li");
      li.textContent = m.text;

      const runBtn = document.createElement("button");
      runBtn.textContent = "진행중";
      runBtn.onclick = () => changeStatus(m.id, "running");

      const doneBtn = document.createElement("button");
      doneBtn.textContent = "완료";
      doneBtn.onclick = () => changeStatus(m.id, "completed");

      li.append(runBtn, doneBtn);
      list.appendChild(li);
    });

    backButton("소분류로");
  }
}

/* =========================
   STATUS CHANGE
========================= */
function changeStatus(id, status) {
  const memos = loadMemos();
  const m = memos.find(m => m.id === id);
  if (!m) return;

  m.status = status;
  saveMemos(memos);

  if (status === "running") location.href = "running.html";
  if (status === "completed") location.href = "completed.html";
}

/* =========================
   BACK BUTTON
========================= */
function backButton(text) {
  const li = document.createElement("li");
  li.textContent = "← " + text;
  li.style.fontWeight = "bold";
  li.onclick = () => {
    if (view.level === "memo") view = { level: "sub", mainId: view.mainId };
    else view = { level: "main" };
    render();
  };
  list.prepend(li);
}

/* =========================
   INIT
========================= */
renderCategorySelect();
render();
