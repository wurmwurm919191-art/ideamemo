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
  mainSelect.innerHTML = `<option value="">대분류</option>`;
  subSelect.innerHTML = `<option value="">소분류</option>`;
  loadCategories().forEach(c => {
    const o = document.createElement("option");
    o.value = c.id;
    o.textContent = c.name;
    mainSelect.appendChild(o);
  });
}

mainSelect.onchange = () => {
  subSelect.innerHTML = `<option value="">소분류</option>`;
  const cat = loadCategories().find(c => c.id === Number(mainSelect.value));
  if (!cat) return;
  cat.subs.forEach(s => {
    const o = document.createElement("option");
    o.value = s.id;
    o.textContent = s.name;
    subSelect.appendChild(o);
  });
};

addBtn.onclick = () => {
  if (!confirm("메모를 추가하시겠습니까?")) return;
  const text = input.value.trim();
  if (!text) return;

  loadMemos().push({
    id: Date.now(),
    text,
    status: "pending",
    categoryId: Number(mainSelect.value),
    subCategoryId: Number(subSelect.value)
  });

  saveMemos(loadMemos());
  input.value = "";
  render();
};

function render() {
  list.innerHTML = "";
  const categories = loadCategories();
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
    memos.filter(m => m.categoryId === view.mainId && m.subCategoryId === view.subId)
      .forEach(m => {
        const li = document.createElement("li");

        const text = document.createElement("span");
        text.textContent = m.text;

        const edit = document.createElement("button");
        edit.textContent = "수정";
        edit.onclick = () => {
          const newText = prompt("수정할 내용을 입력하세요", m.text);
          if (newText === null) return;
          if (!confirm("수정하시겠습니까?")) return;
          m.text = newText;
          saveMemos(loadMemos());
          render();
        };

        const run = document.createElement("button");
        run.textContent = "진행중";
        run.onclick = () => {
          if (!confirm("진행중으로 이동하시겠습니까?")) return;
          m.status = "running";
          saveMemos(loadMemos());
          render();
        };

        const done = document.createElement("button");
        done.textContent = "완료";
        done.onclick = () => {
          if (!confirm("완료 처리하시겠습니까?")) return;
          m.status = "completed";
          saveMemos(loadMemos());
          render();
        };

        const del = document.createElement("button");
        del.textContent = "삭제";
        del.onclick = () => {
          if (!confirm("삭제하시겠습니까?")) return;
          saveMemos(loadMemos().filter(x => x.id !== m.id));
          render();
        };

        li.append(text, edit, run, done, del);
        list.appendChild(li);
      });
  }
}

function back(text) {
  const li = document.createElement("li");
  li.textContent = "← " + text;
  li.onclick = () => {
    view = view.level === "memo" ? { level: "sub", mainId: view.mainId } : { level: "main" };
    render();
  };
  list.appendChild(li);
}

renderCategorySelect();
render();

renderCategorySelect();
render();
render();
