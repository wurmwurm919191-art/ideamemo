const input = document.getElementById("memoInput");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("pendingList");
const mainSelect = document.getElementById("mainSelect");
const subSelect = document.getElementById("subSelect");

const opened = {
  mains: new Set(),
  subs: new Set()  // 키 형식: "mainId-subId"
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
  if (cat) {
    cat.subs.forEach(s => {
      const o = document.createElement("option");
      o.value = s.id;
      o.textContent = s.name;
      subSelect.appendChild(o);
    });
  }
};

addBtn.onclick = () => {
  const text = input.value.trim();
  const cid = Number(mainSelect.value);
  const sid = Number(subSelect.value);

  if (!text || !cid || !sid) {
    alert("아이디어와 대/소분류를 모두 선택해주세요.");
    return;
  }

  const memos = loadMemos();
  memos.push({
    id: Date.now(),
    text,
    status: "pending",
    categoryId: cid,
    subCategoryId: sid
  });
  saveMemos(memos);
  input.value = "";
  render();
};

function isMainOpen(id) {
  return opened.mains.has(Number(id));
}

function isSubOpen(mainId, subId) {
  return opened.subs.has(`${Number(mainId)}-${Number(subId)}`);
}

function toggleMain(id) {
  id = Number(id);
  if (opened.mains.has(id)) {
    opened.mains.delete(id);
  } else {
    opened.mains.add(id);
  }
  render();
}

function toggleSub(mainId, subId) {
  const key = `${Number(mainId)}-${Number(subId)}`;
  if (opened.subs.has(key)) {
    opened.subs.delete(key);
  } else {
    opened.subs.add(key);
  }
  render();
}

function updateStatus(id, status) {
  const memos = loadMemos();
  const item = memos.find(m => m.id === id);
  if (item) {
    item.status = status;
    saveMemos(memos);
    render();
  }
}

function render() {
  list.innerHTML = "";
  const categories = loadCategories();
  const pending = loadMemos().filter(m => m.status === "pending");

  categories.forEach(cat => {
    const mainLi = document.createElement("li");
    mainLi.className = "category-main";
    mainLi.innerHTML = `<span class="toggle-arrow">${isMainOpen(cat.id) ? "▼" : "▶"}</span> 📁 ${cat.name}`;
    mainLi.onclick = e => {
      e.stopPropagation();
      toggleMain(cat.id);
    };
    list.appendChild(mainLi);

    if (!isMainOpen(cat.id)) return;

    cat.subs.forEach(sub => {
      const subLi = document.createElement("li");
      subLi.className = "category-sub";
      subLi.innerHTML = `<span class="toggle-arrow">${isSubOpen(cat.id, sub.id) ? "▼" : "▶"}</span> 📂 ${sub.name}`;
      subLi.onclick = e => {
        e.stopPropagation();
        toggleSub(cat.id, sub.id);
      };
      list.appendChild(subLi);

      if (!isSubOpen(cat.id, sub.id)) return;

      const memosHere = pending.filter(m => m.categoryId === cat.id && m.subCategoryId === sub.id);

      memosHere.forEach(m => {
        const li = document.createElement("li");
        li.className = "memo-item";

        const textDiv = document.createElement("div");
        textDiv.className = "memo-text";
        textDiv.textContent = m.text;

        const btnDiv = document.createElement("div");
        btnDiv.className = "memo-buttons";

        const edit = document.createElement("button");
        edit.textContent = "수정";
        edit.onclick = e => {
          e.stopPropagation();
          const nt = prompt("수정할 내용", m.text)?.trim();
          if (!nt || nt === m.text) return;
          if (!confirm("수정하시겠습니까?")) return;
          const all = loadMemos();
          const target = all.find(x => x.id === m.id);
          if (target) {
            target.text = nt;
            saveMemos(all);
            render();
          }
        };

        const run = document.createElement("button");
        run.textContent = "진행중";
        run.onclick = e => {
          e.stopPropagation();
          updateStatus(m.id, "running");
        };

        const done = document.createElement("button");
        done.textContent = "완료";
        done.onclick = e => {
          e.stopPropagation();
          updateStatus(m.id, "completed");
        };

        btnDiv.append(edit, run, done);
        li.append(textDiv, btnDiv);
        list.appendChild(li);
      });

      if (memosHere.length === 0) {
        const emptyLi = document.createElement("li");
        emptyLi.className = "empty";
        emptyLi.textContent = "이 분류에 메모가 없습니다";
        list.appendChild(emptyLi);
      }
    });
  });
}

renderCategorySelect();
render();
