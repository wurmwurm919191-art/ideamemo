const input = document.getElementById("memoInput");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("pendingList");

const mainSelect = document.getElementById("mainSelect");
const subSelect = document.getElementById("subSelect");

/* =========================
   분류 불러오기
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
   리스트 렌더링
========================= */
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
    catHeader.style.cursor = "pointer";
    catHeader.style.background = "#e2e8f0";

    const catUl = document.createElement("ul");

    let catOpen = true;
    catHeader.onclick = () => {
      catOpen = !catOpen;
      catUl.style.display = catOpen ? "block" : "none";
      catHeader.textContent = (catOpen ? "▾ " : "▸ ") + cat.name;
    };

    cat.subs.forEach(sub => {
      const subMemos = catMemos.filter(m => m.subCategoryId === sub.id);
      if (subMemos.length === 0) return;

      const subLi = document.createElement("li");
      subLi.style.background = "#f8fafc";

      const subHeader = document.createElement("div");
      subHeader.textContent = "▾ " + sub.name;
      subHeader.style.cursor = "pointer";
      subHeader.style.fontWeight = "600";

      const memoUl = document.createElement("ul");
      let subOpen = true;

      subHeader.onclick = () => {
        subOpen = !subOpen;
        memoUl.style.display = subOpen ? "block" : "none";
        subHeader.textContent = (subOpen ? "▾ " : "▸ ") + sub.name;
      };

      subMemos.forEach(m => {
        const memoLi = document.createElement("li");

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
        memoLi.append(text, actions);
        memoUl.appendChild(memoLi);
      });

      subLi.append(subHeader, memoUl);
      catUl.appendChild(subLi);
    });

    list.append(catHeader, catUl);
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
========================= */

renderCategorySelect();
render();
