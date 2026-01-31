const input = document.getElementById("memoInput");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("pendingList");

const mainSelect = document.getElementById("mainSelect");
const subSelect = document.getElementById("subSelect");

function loadCategories() {
  return JSON.parse(localStorage.getItem("ideaCategories")) || [];
}

function loadMemos() {
  return JSON.parse(localStorage.getItem("ideaMemos")) || [];
}

function saveMemos(memos) {
  localStorage.setItem("ideaMemos", JSON.stringify(memos));
}

/* ===== 셀렉트 박스 렌더 ===== */
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
  const categories = loadCategories();
  const cat = categories.find(c => c.id === Number(mainSelect.value));

  subSelect.innerHTML = `<option value="">소분류</option>`;
  if (!cat) return;

  cat.subs.forEach(s => {
    const o = document.createElement("option");
    o.value = s.id;
    o.textContent = s.name;
    subSelect.appendChild(o);
  });
};

/* ===== 메모 추가 ===== */
addBtn.onclick = () => {
  if (!confirm("메모를 추가하시겠습니까?")) return;

  const text = input.value.trim();
  const categoryId = Number(mainSelect.value);
  const subCategoryId = Number(subSelect.value);

  if (!text || !categoryId || !subCategoryId) return;

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

/* ===== 🔥 메인 화면 토글 렌더 ===== */
function render() {
  list.innerHTML = "";

  const categories = loadCategories();
  const memos = loadMemos().filter(m => m.status === "pending");

  categories.forEach(cat => {
    if (!Array.isArray(cat.subs)) return;

    const details = document.createElement("details");
    details.open = true;

    const summary = document.createElement("summary");
    summary.innerHTML = `📁 ${cat.name}`;
    summary.style.cursor = "pointer";
    summary.style.fontWeight = "bold";
    summary.style.marginBottom = "8px";

    details.appendChild(summary);

    cat.subs.forEach(sub => {
      const subDetails = document.createElement("details");
      subDetails.open = true;
      subDetails.style.marginLeft = "16px";

      const subSummary = document.createElement("summary");
      subSummary.textContent = `📂 ${sub.name}`;
      subSummary.style.cursor = "pointer";

      subDetails.appendChild(subSummary);

      memos
        .filter(m => m.categoryId === cat.id && m.subCategoryId === sub.id)
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
          subDetails.appendChild(li);
        });

      details.appendChild(subDetails);
    });

    list.appendChild(details);
  });
}

renderCategorySelect();
render();

renderCategorySelect();
render();
render();
