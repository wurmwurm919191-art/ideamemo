const KEY = "ideaCategories";

function loadCategories() {
  return JSON.parse(localStorage.getItem(KEY)) || [];
}

function saveCategories(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

const mainInput = document.getElementById("mainInput");
const addMainBtn = document.getElementById("addMainBtn");
const deleteAllBtn = document.getElementById("deleteAllBtn");
const area = document.getElementById("categoryArea");

function render() {
  area.innerHTML = "";

  const categories = loadCategories();

  categories.forEach(cat => {
    /* 🔥 subs 보정 (기존 로직 유지) */
    if (!Array.isArray(cat.subs)) {
      cat.subs = [];
    }

    const box = document.createElement("div");
    box.className = "category-box";

    /* ===== 대분류 ===== */
    const title = document.createElement("h3");
    title.textContent = cat.name;

    const delMain = document.createElement("button");
    delMain.textContent = "삭제";
    delMain.onclick = () => {
      if (!confirm("대분류를 삭제하시겠습니까?")) return;
      saveCategories(categories.filter(c => c.id !== cat.id));
      render();
    };

    box.append(title, delMain);

    /* ===== 소분류 목록 ===== */
    const subList = document.createElement("ul");

    cat.subs.forEach(sub => {
      const li = document.createElement("li");
      li.textContent = sub.name;

      const delSub = document.createElement("button");
      delSub.textContent = "삭제";
      delSub.onclick = () => {
        if (!confirm("소분류를 삭제하시겠습니까?")) return;
        cat.subs = cat.subs.filter(s => s.id !== sub.id);
        saveCategories(categories);
        render();
      };

      li.appendChild(delSub);
      subList.appendChild(li);
    });

    box.appendChild(subList);

    /* ===== 소분류 입력 ===== */
    if (cat.subs.length < 10) {
      const subInput = document.createElement("input");
      subInput.placeholder = "소분류 입력 (최대 10개)";

      const addSubBtn = document.createElement("button");
      addSubBtn.textContent = "추가";
      addSubBtn.onclick = () => {
        if (!confirm("소분류를 추가하시겠습니까?")) return;

        const name = subInput.value.trim();
        if (!name) return;

        cat.subs.push({
          id: Date.now(),
          name
        });

        saveCategories(categories);
        render();
      };

      box.append(subInput, addSubBtn);
    }

    area.appendChild(box);
  });

  /* 🔥 기존 구조 유지용 재저장 */
  saveCategories(categories);
}

/* ===== 대분류 추가 ===== */
addMainBtn.onclick = () => {
  if (!confirm("대분류를 추가하시겠습니까?")) return;

  const name = mainInput.value.trim();
  if (!name) return;

  const categories = loadCategories();

  if (categories.length >= 5) {
    alert("대분류는 최대 5개까지 가능합니다.");
    return;
  }

  categories.push({
    id: Date.now(),
    name,
    subs: []
  });

  saveCategories(categories);
  mainInput.value = "";
  render();
};

/* ===== 🔥 분류 전체 삭제 (추가된 부분) ===== */
deleteAllBtn.onclick = () => {
  if (
    !confirm(
      "⚠ 모든 대분류와 소분류를 전부 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다."
    )
  ) return;

  localStorage.removeItem(KEY);
  render();
};

render();
  render();
};

render();
