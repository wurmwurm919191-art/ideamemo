const input = document.getElementById("memoInput");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("pendingList");
const mainSelect = document.getElementById("mainSelect");
const subSelect = document.getElementById("subSelect");

// 열린 상태 관리 (새로고침 시 초기화)
const opened = {
  mains: new Set(),
  subs: new Set()  // "mainId-subId" 형식
};

function loadCategories() {
  return JSON.parse(localStorage.getItem("ideaCategories")) || [];
}

function loadMemos() {
  return JSON.parse(localStorage.getItem("ideaMemos")) || [];
}

function saveMemos(memos) {
  localStorage.setItem("ideaMemos", JSON.stringify(memos));
}

function renderCategorySelect() {
  const categories = loadCategories();
  mainSelect.innerHTML = `<option value="">대분류</option>`;
  subSelect.innerHTML = `<option value="">소분류</option>`;
  categories.forEach(c => {
    const o = document.createElement("option");
    o.value = c.id;
    o.textContent = c.name;
    mainSelect.appendChild(o);
  });
}

mainSelect.onchange = () => {
  const cat = loadCategories().find(c => c.id === Number(mainSelect.value));
  subSelect.innerHTML = `<option value="">소분류</option>`;
  if (!cat) return;
  cat.subs.forEach(s => {
    const o = document.createElement("option");
    o.value = s.id;
    o.textContent = s.name;
    subSelect.appendChild(o);
  });
};

addBtn.onclick = () => {
  const text = input.value.trim();
  const categoryId = Number(mainSelect.value);
  const subCategoryId = Number(subSelect.value);
  if (!text || !categoryId || !subCategoryId) {
    alert("아이디어와 분류를 모두 선택해주세요.");
    return;
  }
  const memos = loadMemos();
  memos.push({ id: Date.now(), text, status: "pending", categoryId, subCategoryId });
  saveMemos(memos);
  input.value = "";
  render();
};

function isMainOpen(id) { return opened.mains.has(id); }
function isSubOpen(mainId, subId) { return opened.subs.has(`${mainId}-${subId}`); }

function toggleMain(id) {
  if (opened.mains.has(id)) opened.mains.delete(id);
  else opened.mains.add(id);
  render();
}

function toggleSub(mainId, subId) {
  const key = `${mainId}-${subId}`;
  if (opened.subs.has(key)) opened.subs.delete(key);
  else opened.subs.add(key);
  render();
}

function updateStatus(id, status) {
  const memos = loadMemos();
  const m = memos.find(x => x.id === id);
  if (m) {
    m.status = status;
    saveMemos(memos);
    render();
  }
}

function render() {
  list.innerHTML = "";
  const categories = loadCategories();
  categories.forEach(c => { if (!Array.isArray(c.subs)) c.subs = []; });

  const pendingMemos = loadMemos().filter(m => m.status === "pending");

  categories.forEach(cat => {
    // 대분류
    const mainLi = document.createElement("li");
    mainLi.className = "category-main";
    mainLi.innerHTML = `
      <span class="toggle-arrow">${isMainOpen(cat.id) ? "▼" : "▶"}</span>
      📁 ${cat.name}
    `;
    mainLi.onclick = (e) => { e.stopPropagation(); toggleMain(cat.id); };
    list.appendChild(mainLi);

    if (!isMainOpen(cat.id)) return;

    // 소분류들
    cat.subs.forEach(sub => {
      const subLi = document.createElement("li");
      subLi.className = "category-sub";
      subLi.innerHTML = `
        <span class="toggle-arrow">${isSubOpen(cat.id, sub.id) ? "▼" : "▶"}</span>
        📂 ${sub.name}
      `;
      subLi.onclick = (e) => { e.stopPropagation(); toggleSub(cat.id, sub.id); };
      list.appendChild(subLi);

      if (!isSubOpen(cat.id, sub.id)) return;

      // 메모들
      const memosInSub = pendingMemos.filter(m => m.categoryId === cat.id && m.subCategoryId === sub.id);
      memosInSub.forEach(m => {
        const memoLi = document.createElement("li");
        memoLi.className = "memo-item";

        const textSpan = document.createElement("span");
        textSpan.textContent = m.text;

        const controls = document.createElement("div");
        controls.className = "memo-controls";

        const editBtn = document.createElement("button");
        editBtn.textContent = "수정";
        editBtn.onclick = (e) => {
          e.stopPropagation();
          const newText = prompt("수정할 내용", m.text);
          if (newText === null || newText.trim() === m.text) return;
          if (!confirm("수정하시겠습니까?")) return;
          const all = loadMemos();
          const target = all.find(x => x.id === m.id);
          if (target) {
            target.text = newText.trim();
            saveMemos(all);
            render();
          }
        };

        const runBtn = document.createElement("button");
        runBtn.textContent = "진행중";
        runBtn.onclick = (e) => { e.stopPropagation(); updateStatus(m.id, "running"); };

        const doneBtn = document.createElement("button");
        doneBtn.textContent = "완료";
        doneBtn.onclick = (e) => { e.stopPropagation(); updateStatus(m.id, "completed"); };

        const delBtn = document.createElement("button");
        delBtn.textContent = "삭제";
        delBtn.onclick = (e) => {
          e.stopPropagation();
          if (!confirm("삭제하시겠습니까?")) return;
          saveMemos(loadMemos().filter(x => x.id !== m.id));
          render();
        };

        controls.append(editBtn, runBtn, doneBtn, delBtn);

        memoLi.append(textSpan, controls);
        list.appendChild(memoLi);
      });

      if (memosInSub.length === 0) {
        const empty = document.createElement("li");
        empty.className = "empty";
        empty.textContent = "메모 없음";
        list.appendChild(empty);
      }
    });
  });
}

// 초기 실행
renderCategorySelect();
render();

// 초기화
renderCategorySelect();
render();
