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
    const box = document.createElement("div");
    box.className = "category-box";

    const title = document.createElement("h3");
    title.textContent = cat.name;

    const delMain = document.createElement("button");
    delMain.textContent = "삭제";
    delMain.onclick = () => {
      saveCategories(categories.filter(c => c.id !== cat.id));
      render();
    };

    box.append(title, delMain);

    const subList = document.createElement("ul");

    cat.subs.forEach(sub => {
      const li = document.createElement("li");
      li.textContent = sub.name;

      const delSub = document.createElement("button");
      delSub.textContent = "삭제";
      delSub.onclick = () => {
        cat.subs = cat.subs.filter(s => s.id !== sub.id);
        saveCategories(categories);
        render();
      };

      li.append(delSub);
      subList.appendChild(li);
    });

    box.appendChild(subList);

    if (cat.subs.length < 10) {
      const subInput = document.createElement("input");
      subInput.placeholder = "소분류 입력 (최대 10개)";

      const addSubBtn = document.createElement("button");
      addSubBtn.textContent = "추가";
      addSubBtn.onclick = () => {
        if (!subInput.value.trim()) return;
        cat.subs.push({
          id: Date.now(),
          name: subInput.value.trim()
        });
        saveCategories(categories);
        render();
      };

      box.append(subInput, addSubBtn);
    }

    area.appendChild(box);
  });
}

addMainBtn.onclick = () => {
  const name = mainInput.value.trim();
  if (!name) return;

  const categories = loadCategories();
  if (categories.length >= 5) {
    alert("대분류는 최대 5개까지입니다");
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
