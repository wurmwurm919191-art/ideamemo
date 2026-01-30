const input = document.getElementById("memoInput");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("pendingList");

const mainSelect = document.getElementById("mainSelect");
const subSelect = document.getElementById("subSelect");

function loadCategories() {
  return JSON.parse(localStorage.getItem("ideaCategories")) || [];
}

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
  const selectedId = Number(mainSelect.value);
  const selected = categories.find(c => c.id === selectedId);

  subSelect.innerHTML = `<option value="">소분류</option>`;
  if (!selected) return;

  selected.subs.forEach(s => {
    const opt = document.createElement("option");
    opt.value = s.id;
    opt.textContent = s.name;
    subSelect.appendChild(opt);
  });
};

function loadMemos() {
  return JSON.parse(localStorage.getItem("ideaMemos")) || [];
}

function saveMemos(memos) {
  localStorage.setItem("ideaMemos", JSON.stringify(memos));
}

function addMemo(text, categoryId, subCategoryId) {
  const memos = loadMemos();
  memos.push({
    id: Date.now(),
    text,
    status: "pending",
    categoryId,
    subCategoryId
  });
  saveMemos(memos);
}

function updateStatus(id, status) {
  const memos = loadMemos();
  const m = memos.find(m => m.id === id);
  if (m) {
    m.status = status;
    saveMemos(memos);
  }
}

function deleteMemo(id) {
  const memos = loadMemos().filter(m => m.id !== id);
  saveMemos(memos);
}

function render() {
  list.innerHTML = "";

  const memos = loadMemos().filter(m => m.status === "pending");
  const categories = loadCategories();

  categories.forEach(cat => {
    const catMemos = memos.filter(m => m.categoryId === cat.id);
    if (catMemos.length === 0) return;

    const catHeader = document.createElement("li");
    catHeader.textContent = "▾ " + cat.name;
    catHeader.style.fontWeight = "bold";
    catHeader.style.background = "#e2e8f0";

    const catUl = document.createElement("ul");

    cat.subs.forEach(sub => {
      const subMemos = catMemos.filter(m => m.subCategoryId === sub.id);
      if (subMemos.length === 0) return;

      const subLi = document.createElement("li");
      const subTitle = document.createElement("div");
      subTitle.textContent = sub.name;
      subTitle.style.fontWeight = "600";

      const memoUl = document.createElement("ul");

      subMemos.forEach(m => {
        const memoLi = document.createElement("li");
        memoLi.textContent = m.text;
        memoUl.appendChild(memoLi);
      });

      subLi.append(subTitle, memoUl);
      catUl.appendChild(subLi);
    });

    list.append(catHeader, catUl);
  });
}

addBtn.onclick = () => {
  const text = input.value.trim();
  const categoryId = Number(mainSelect.value);
  const subCategoryId = Number(subSelect.value);

  if (!text || !categoryId || !subCategoryId) {
    alert("아이디어 / 대분류 / 소분류를 모두 선택하세요");
    return;
  }

  addMemo(text, categoryId, subCategoryId);

  input.value = "";
  mainSelect.value = "";
  subSelect.innerHTML = `<option value="">소분류</option>`;

  render();
};

renderCategorySelect();
render();
