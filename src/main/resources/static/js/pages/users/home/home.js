
async function getCategories() {
  try {
    const response = await fetch(`${API_URL}/categories/home`);

    if (!response.ok) {
      throw new Error("Không thể lấy danh sách danh mục");
    }

    const categories = await response.json();

    const containerSection = document.querySelector(".container-section");

    containerSection.innerHTML = "";

    for (const category of categories.data) {
      renderCategory(category, containerSection);
    }
  } catch (error) {
    console.log(error);
  }
}

async function renderCategory(category, containerSection) {
  const sectionCategory = document.createElement("section");
  sectionCategory.className = "category-section";

  const categoryContainer = `
    <div class="category-container">

      <div class="category-header">
        <h2>${category.name}</h2>

        <a href="/products?categoryId=${category.id}" class="category-more">
          Xem tất cả »
        </a>
      </div>

      <div class="category-slider">

        <button class="category-arrow category-prev">‹</button>

        <div class="category-products">
        </div>

        <button class="category-arrow category-next">›</button>

      </div>

    </div>
  `;
  sectionCategory.innerHTML = categoryContainer;
  containerSection.append(sectionCategory);
  const productList = sectionCategory.querySelector(".category-products");
  await loadProducts(category.id, productList);
}

async function loadProducts(categoryId, productList) {
  try {
    const response = await fetch(
      `${API_URL}/products/home/${categoryId}`,
    );

    if (!response.ok) {
      throw new Error("Không thể lấy danh sách sản phẩm");
    }
    const products = await response.json();
    let productsHtml = "";
    for (let i = 0; i < products.data.length; i++) {
      productsHtml += `
        <a href="/product-detail?id=${products.data[i].id}" class="product-card">
          <div class="product-image">
            <img src="/assets/images/pc1.jpg" alt="PC Gaming" />
          </div>
          <div class="product-info">
            <h3>${products.data[i].name}</h3>
            <div class="product-price">
             ${formatVND(products.data[i].salePrice)}
            </div>
            <div class="old-price">
               ${formatVND(products.data[i].price)}
            </div>
            <div class="product-bottom">
              <button
                class="add-cart"
                onclick="event.preventDefault()"
              >
                <span class="cart-icon">
                  <i class="fa-solid fa-cart-shopping"></i>
                </span>

                <span class="cart-text">
                  THÊM VÀO GIỎ
                </span>
              </button>

              <span class="stock">
                Còn hàng
              </span>

            </div>

          </div>

        </a>
      `;
    }

    productList.innerHTML = productsHtml;
  } catch (error) {
    console.log(error);
  }
}


getCategories();