const KEY = "ideaCategories";

function loadCategories() {
  return JSON.parse(localStorage.getItem(KEY)) || [];
}

function saveCategories(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

const mainInput = document.getElementById("mainInput");
const addMainBtn = document.getElementById("addMainBtn");
const area = document.getElementById("categoryArea");

function render() {
  area.innerHTML = "";
  const categories = loadCategories();

  categories.forEach(cat => {
    if (!Array.isArray(cat.subs)) cat.subs = [];
    if (typeof cat.open !== "boolean") cat.open = true;

    const box = document.createElement("div");
    box.className = "category-box";
    box.style.marginBottom = "12px";

    /* ===== 대분류 헤더 ===== */
    const header = document.createElement("div");
    header.style.display = "flex";
    header.style.alignItems = "center";
    header.style.gap = "8px";

    const toggleBtn = document.createElement("button");
    toggleBtn.textContent = cat.open ? "▼" : "▶";
    toggleBtn.onclick = () => {
      cat.open = !cat.open;
      saveCategories(categories);
      render();
    };

    const title = document.createElement("strong");
    title.textContent = cat.name;
    title.style.flex = "1";

    const delMain = document.createElement("button");
    delMain.textContent = "삭제";
    delMain.onclick = () => {
      if (!confirm("대분류를 삭제하시겠습니까?")) return;
      saveCategories(categories.filter(c => c.id !== cat.id));
      render();
    };

    header.append(toggleBtn, title, delMain);
    box.appendChild(header);

    /* ===== 소분류 영역 ===== */
    if (cat.open) {
      const subArea = document.createElement("div");
      subArea.style.marginTop = "8px";

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

      subArea.appendChild(subList);

      if (cat.subs.length < 10) {
        const subInput = document.createElement("input");
        subInput.placeholder = "소분류 입력 (최대 10개)";

        const addSubBtn = document.createElement("button");
        addSubBtn.textContent = "소분류 추가";
        addSubBtn.onclick = () => {
          if (!confirm("소분류를 추가하시겠습니까?")) return;
          const name = subInput.value.trim();
          if (!name) return;

          cat.subs.push({ id: Date.now(), name });
          saveCategories(categories);
          render();
        };

        subArea.append(subInput, addSubBtn);
      }

      box.appendChild(subArea);
    }

    area.appendChild(box);
  });

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
    subs: [],
    open: true
  });

  saveCategories(categories);
  mainInput.value = "";
  render();
};

render();
