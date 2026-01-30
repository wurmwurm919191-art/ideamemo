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

    const title = document.createElement("h3");
    title.textContent = cat.name;

    const delMain = document.createElement("button");
    delMain.textContent = "삭제";
    delMain.onclick = () => {
      saveCategories(categories.filter(c => c.id !== cat.id));
      render();
    };

    box.append(title, delMain);

    cat.subs.forEach(sub => {
      const div = document.createElement("div");
      div.textContent = sub.name;
      box.appendChild(div);
    });

    area.appendChild(box);
  });
}

addMainBtn.onclick = () => {
  const name = mainInput.value.trim();
  if (!name) return;

  const categories = loadCategories();
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
