async function loadMenuCategory() {
  try {
    const response = await fetch(`${API_URL}/categories/menu`);
    if (!response.ok) {
      throw new Error("Không thể lấy danh sách danh mục");
    }
    const categories = await response.json();
    const categoryDropdown = document.querySelector(".category-dropdown");
    categoryDropdown.innerHTML = "";
    let menuOptions = "";
    for (const category of categories.data) {
      menuOptions += `<a href="/products?categoryId=${category.id}"> ${category.name} </a>`;
    }
    categoryDropdown.innerHTML = menuOptions;
  } catch (error) {
    console.log(error);
  }
}

async function loadSearchBox() {
  try {
    const response = await fetch(`${API_URL}/categories/menu`);
    if (!response.ok) {
      throw new Error("Không thể lấy danh sách danh mục");
    }
    const categories = await response.json();
    const searchBox = document.querySelector(".select-search");
    searchBox.innerHTML = "";
    let options = `<option value="">Tất cả danh mục</option>`;

    for (const category of categories.data) {
      options += `<option value="${category.id}">${category.name}</option>`;
    }
    searchBox.innerHTML = options;
  } catch (error) {
    console.log(error);
  }
}


loadSearchBox();
loadMenuCategory();
