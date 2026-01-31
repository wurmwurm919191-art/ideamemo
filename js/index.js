문제 잘 봤어요. 지금 상황 정리하면:

문제 1 : settings.html (분류 설정 화면)에서 대분류/소분류 목록이 안 보임 → 아마 카테고리 렌더링 코드가 빠졌거나 localStorage 데이터가 초기화됐을 가능성
문제 2 : index.html의 토글(아코디언)에서 화살표(▶/▼)가 안 보임
추가 요청 : 메모 아이템의 “진행중 / 완료” 버튼을 오른쪽 아래로 배치

settings.html이 아직 공유되지 않았지만, 일반적인 패턴으로 추정해서 대분류·소분류 목록을 제대로 보여주고 삭제 버튼 붙이는 코드 + index.js 화살표 + 버튼 위치 수정을 함께 드릴게요.
1. index.js (화살표 보이게 + 버튼 오른쪽 아래 배치)
JavaScript// index.js 전체 (토글 화살표 확실히 보이게 + 버튼 위치 조정)

const input = document.getElementById("memoInput");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("pendingList");
const mainSelect = document.getElementById("mainSelect");
const subSelect = document.getElementById("subSelect");

const opened = {
  mains: new Set(),
  subs: new Set()   // "mainId-subId" 문자열 키
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

function saveCategories(cats) {
  localStorage.setItem("ideaCategories", JSON.stringify(cats));
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
  const selected = categories.find(c => c.id === Number(mainSelect.value));
  subSelect.innerHTML = `<option value="">소분류</option>`;
  if (selected) {
    selected.subs.forEach(s => {
      const opt = document.createElement("option");
      opt.value = s.id;
      opt.textContent = s.name;
      subSelect.appendChild(opt);
    });
  }
};

addBtn.onclick = () => {
  const text = input.value.trim();
  const cid = Number(mainSelect.value);
  const sid = Number(subSelect.value);
  if (!text || isNaN(cid) || isNaN(sid)) return alert("모두 입력해주세요.");
  
  const memos = loadMemos();
  memos.push({ id: Date.now(), text, status: "pending", categoryId: cid, subCategoryId: sid });
  saveMemos(memos);
  input.value = "";
  render();
};

function isMainOpen(id) { return opened.mains.has(Number(id)); }
function isSubOpen(mid, sid) { return opened.subs.has(`${mid}-${sid}`); }

function toggleMain(id) {
  id = Number(id);
  if (opened.mains.has(id)) opened.mains.delete(id);
  else opened.mains.add(id);
  render();
}

function toggleSub(mid, sid) {
  const key = `${Number(mid)}-${Number(sid)}`;
  if (opened.subs.has(key)) opened.subs.delete(key);
  else opened.subs.add(key);
  render();
}

function render() {
  list.innerHTML = "";
  const cats = loadCategories();
  const memos = loadMemos().filter(m => m.status === "pending");

  cats.forEach(cat => {
    const mainLi = document.createElement("li");
    mainLi.className = "category-main";
    mainLi.innerHTML = `<span class="toggle-arrow">${isMainOpen(cat.id) ? "▼" : "▶"}</span> 📁 ${cat.name}`;
    mainLi.onclick = e => { e.stopPropagation(); toggleMain(cat.id); };
    list.appendChild(mainLi);

    if (!isMainOpen(cat.id)) return;

    cat.subs.forEach(sub => {
      const subLi = document.createElement("li");
      subLi.className = "category-sub";
      subLi.innerHTML = `<span class="toggle-arrow">${isSubOpen(cat.id, sub.id) ? "▼" : "▶"}</span> 📂 ${sub.name}`;
      subLi.onclick = e => { e.stopPropagation(); toggleSub(cat.id, sub.id); };
      list.appendChild(subLi);

      if (!isSubOpen(cat.id, sub.id)) return;

      const filtered = memos.filter(m => m.categoryId === cat.id && m.subCategoryId === sub.id);

      filtered.forEach(m => {
        const li = document.createElement("li");
        li.className = "memo-item";

        const text = document.createElement("div");
        text.className = "memo-text";
        text.textContent = m.text;

        const btnBox = document.createElement("div");
        btnBox.className = "memo-buttons";

        const edit = document.createElement("button");
        edit.textContent = "수정";
        edit.onclick = e => {
          e.stopPropagation();
          const nt = prompt("수정", m.text)?.trim();
          if (!nt || nt === m.text) return;
          if (!confirm("저장?")) return;
          const all = loadMemos();
          const target = all.find(x => x.id === m.id);
          if (target) {
            target.text = nt;
            saveMemos(all);
            render();
          }
        };

        const running = document.createElement("button");
        running.textContent = "진행중";
        running.onclick = e => { e.stopPropagation(); updateStatus(m.id, "running"); };

        const done = document.createElement("button");
        done.textContent = "완료";
        done.onclick = e => { e.stopPropagation(); updateStatus(m.id, "completed"); };

        btnBox.append(edit, running, done);
        li.append(text, btnBox);
        list.appendChild(li);
      });
    });
  });
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

// 시작
renderCategorySelect();
render();
