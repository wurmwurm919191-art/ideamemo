const input = document.getElementById("memoInput");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("pendingList");

const mainSelect = document.getElementById("mainSelect");
const subSelect = document.getElementById("subSelect");

let view = { level: "main", mainId: null, subId: null };

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
  if (!text || !categoryId || !subCategoryId) return;

  const memos = loadMemos();
  memos.push({ id: Date.now(), text, status: "pending", categoryId, subCategoryId });
  saveMemos(memos);
  input.value = "";
  render();
};

function render() {
  list.innerHTML = "";
  const categories = loadCategories();
  categories.forEach(c => { if (!Array.isArray(c.subs)) c.subs = []; });
  const memos = loadMemos().filter(m => m.status === "pending");

  if (view.level === "main") {
    categories.forEach(cat => {
      const li = document.createElement("li");
      li.textContent = "📁 " + cat.name;
      li.onclick = () => { view = { level: "sub", mainId: cat.id }; render(); };
      list.appendChild(li);
    });
    return;
  }

  if (view.level === "sub") {
    back("대분류로");
    const cat = categories.find(c => c.id === view.mainId);
    cat.subs.forEach(sub => {
      const li = document.createElement("li");
      li.textContent = "📂 " + sub.name;
      li.onclick = () => { view = { level: "memo", mainId: cat.id, subId: sub.id }; render(); };
      list.appendChild(li);
    });
    return;
  }

  if (view.level === "memo") {
    back("소분류로");
    memos
      .filter(m => m.categoryId === view.mainId && m.subCategoryId === view.subId)
      .forEach(m => {
        const li = document.createElement("li");

        const text = document.createElement("span");
        text.textContent = m.text;

        const btns = document.createElement("div");

        const edit = document.createElement("button");
        edit.textContent = "수정";
        edit.onclick = () => {
          const newText = prompt("수정할 내용을 입력하세요", m.text);
          if (newText === null) return;
          if (!confirm("수정하시겠습니까?")) return;

          const memos = loadMemos();
          const target = memos.find(x => x.id === m.id);
          if (!target) return;
          target.text = newText;
          saveMemos(memos);
          render();
        };

        const run = document.createElement("button");
        run.textContent = "진행중";
        run.onclick = () => updateStatus(m.id, "running");

        const done = document.createElement("button");
        done.textContent = "완료";
        done.onclick = () => updateStatus(m.id, "completed");

        const del = document.createElement("button");
        del.textContent = "삭제";
        del.onclick = () => {
          if (!confirm("삭제하시겠습니까?")) return;
          saveMemos(loadMemos().filter(x => x.id !== m.id));
          render();
        };

        btns.append(edit, run, done, del);
        li.append(text, btns);
        list.appendChild(li);
      });
  }
}

function updateStatus(id, status) {
  const memos = loadMemos();
  const m = memos.find(x => x.id === id);
  if (!m) return;
  m.status = status;
  saveMemos(memos);
  render();
}

function back(text) {
  const li = document.createElement("li");
  li.textContent = "← " + text;
  li.onclick = () => {
    view = view.level === "memo"
      ? { level: "sub", mainId: view.mainId }
      : { level: "main" };
    render();
  };
  list.appendChild(li);
}

renderCategorySelect();
render();
