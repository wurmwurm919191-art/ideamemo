const input = document.getElementById("memoInput");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("pendingList");

const mainSelect = document.getElementById("mainSelect");
const subSelect = document.getElementById("subSelect");

/* =========================
   분류 로드
========================= */

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
  const selected = categories.find(c => c.id == mainSelect.value);

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
   리스트 렌더 (미실행)
========================= */

function render() {
  list.innerHTML = "";

  loadMemos()
    .filter(m => m.status === "pending")
    .forEach(m => {
      const li = document.createElement("li");

      const text = document.createElement("span");
      text.textContent = m.text;

      const actions = document.createElement("div");
      actions.className = "actions";

      const runBtn = document.createElement("button");
      runBtn.textContent = "진행중";
      runBtn.onclick = () => {
        updateStatus(m.id, "running");
        render();
      };

      const doneBtn = document.createElement("button");
      doneBtn.textContent = "완료";
      doneBtn.onclick = () => {
        updateStatus(m.id, "completed");
        render();
      };

      const delBtn = document.createElement("button");
      delBtn.textContent = "삭제";
      delBtn.onclick = () => {
        deleteMemo(m.id);
        render();
      };

      actions.append(runBtn, doneBtn, delBtn);
      li.append(text, actions);
      list.appendChild(li);
    });
}

/* =========================
   추가 버튼
========================= */

addBtn.onclick = () => {
  const text = input.value.trim();
  const categoryId = mainSelect.value;
  const subCategoryId = subSelect.value;

  if (!text || !categoryId || !subCategoryId) {
    alert("아이디어 / 대분류 / 소분류를 모두 선택하세요");
    return;
  }

  addMemo(text, Number(categoryId), Number(subCategoryId));

  input.value = "";
  mainSelect.value = "";
  subSelect.innerHTML = `<option value="">소분류</option>`;

  render();
};

/* =========================
   초기 실행
========================= */

renderCategorySelect();
render();
