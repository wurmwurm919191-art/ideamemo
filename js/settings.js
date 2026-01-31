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

  if (categories.length === 0) {
    area.innerHTML = '<p style="color:#9ca3af; text-align:center; padding:24px 0;">아직 대분류가 없습니다.<br>위 입력란에서 추가해주세요.</p>';
  }

  categories.forEach(cat => {
    if (!Array.isArray(cat.subs)) cat.subs = [];

    const box = document.createElement("div");
    box.className = "category-box";

    // 대분류 제목 + 삭제 버튼
    const header = document.createElement("div");
    header.className = "category-header";

    const h3 = document.createElement("h3");
    h3.textContent = cat.name;

    const delMain = document.createElement("button");
    delMain.className = "btn-delete-main";
    delMain.textContent = "대분류 삭제";
    delMain.onclick = () => {
      if (!confirm(`"${cat.name}" 대분류와 하위 모든 소분류를 삭제하시겠습니까?`)) return;
      saveCategories(categories.filter(c => c.id !== cat.id));
      render();
    };

    header.append(h3, delMain);
    box.appendChild(header);

    // 소분류 목록
    const subUl = document.createElement("ul");
    subUl.className = "sub-list";

    if (cat.subs.length === 0) {
      const emptyP = document.createElement("p");
      emptyP.className = "empty-sub";
      emptyP.textContent = "소분류가 없습니다";
      box.appendChild(emptyP);
    } else {
      cat.subs.forEach(sub => {
        const li = document.createElement("li");
        li.className = "sub-item";

        const span = document.createElement("span");
        span.textContent = sub.name;

        const delSub = document.createElement("button");
        delSub.className = "btn-delete-sub";
        delSub.textContent = "삭제";
        delSub.onclick = () => {
          if (!confirm(`"${sub.name}" 소분류를 삭제하시겠습니까?`)) return;
          cat.subs = cat.subs.filter(s => s.id !== sub.id);
          saveCategories(categories);
          render();
        };

        li.append(span, delSub);
        subUl.appendChild(li);
      });
      box.appendChild(subUl);
    }

    // 소분류 추가 영역
    if (cat.subs.length < 10) {
      const addBox = document.createElement("div");
      addBox.className = "add-sub-box";

      const inp = document.createElement("input");
      inp.placeholder = "소분류 이름 입력";
      inp.maxLength = 30;

      const btn = document.createElement("button");
      btn.textContent = "소분류 추가";
      btn.onclick = () => {
        const name = inp.value.trim();
        if (!name) return;
        cat.subs.push({ id: Date.now(), name });
        saveCategories(categories);
        inp.value = "";
        render();
      };

      addBox.append(inp, btn);
      box.appendChild(addBox);
    }

    area.appendChild(box);
  });

  saveCategories(categories); // 구조 보정 저장
}

addMainBtn.onclick = () => {
  const name = mainInput.value.trim();
  if (!name) return alert("대분류 이름을 입력하세요.");

  const categories = loadCategories();
  if (categories.length >= 5) {
    alert("대분류는 최대 5개까지만 만들 수 있습니다.");
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

render();
