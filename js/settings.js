document.addEventListener("DOMContentLoaded", () => {

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
  const resetAllBtn = document.getElementById("resetAllBtn");
  const area = document.getElementById("categoryArea");

  function render() {
    area.innerHTML = "";
    const categories = loadCategories();

    categories.forEach(cat => {
      if (!Array.isArray(cat.subs)) cat.subs = [];

      const details = document.createElement("details");
      details.open = true;

      const summary = document.createElement("summary");
      summary.style.display = "flex";
      summary.style.alignItems = "center";
      summary.style.gap = "8px";
      summary.style.cursor = "pointer";

      const title = document.createElement("strong");
      title.textContent = cat.name;
      title.style.flex = "1";

      const delMain = document.createElement("button");
      delMain.textContent = "삭제";
      delMain.onclick = (e) => {
        e.stopPropagation();
        if (!confirm("대분류를 삭제하시겠습니까?")) return;
        saveCategories(categories.filter(c => c.id !== cat.id));
        render();
      };

      summary.append(title, delMain);
      details.appendChild(summary);

      const subArea = document.createElement("div");
      subArea.style.marginTop = "8px";

      const subList = document.createElement("ul");

      cat.subs.forEach(sub => {
        const li = document.createElement("li");

        const name = document.createElement("span");
        name.textContent = sub.name;

        const delSub = document.createElement("button");
        delSub.textContent = "삭제";
        delSub.onclick = () => {
          if (!confirm("소분류를 삭제하시겠습니까?")) return;
          cat.subs = cat.subs.filter(s => s.id !== sub.id);
          saveCategories(categories);
          render();
        };

        li.append(name, delSub);
        subList.appendChild(li);
      });

      subArea.appendChild(subList);

      if (cat.subs.length < 10) {
        const subInput = document.createElement("input");
        subInput.placeholder = "소분류 입력 (최대 10개)";

        const addSubBtn = document.createElement("button");
        addSubBtn.textContent = "추가";
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

      details.appendChild(subArea);
      area.appendChild(details);
    });
  }

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

  deleteAllBtn.onclick = () => {
    if (!confirm("⚠ 모든 분류를 삭제하시겠습니까?\n되돌릴 수 없습니다.")) return;
    localStorage.removeItem(KEY);
    render();
  };

  if (resetAllBtn) {
    resetAllBtn.onclick = () => {
      if (!confirm("⚠ 모든 분류와 메모가 삭제됩니다.\n되돌릴 수 없습니다.")) return;
      localStorage.clear();
      alert("전체 데이터가 초기화되었습니다.");
      location.reload();
    };
  }

  render();
});

  render();
});

