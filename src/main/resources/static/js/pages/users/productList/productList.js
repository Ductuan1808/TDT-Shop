let productConfig = {
  CPU: {
    productCode: "CPU",
    id: "",
    socket: "",
    cores: "",
    threads: "",
    baseClock: "",
    boostClock: "",
    cacheMb: "",
  },

  RAM: {
    productCode: "RAM",
    capacityGb: "",
    memoryType: "",
    speedMhz: "",
    moduleCount: "",
    voltage: "",
  },

  GPU: {
    productCode: "GPU",
    chipSet: "",
    vramGb: "",
    memoryType: "",
    lengthMm: "",
    widthSlots: "",
    recommendedPsuWatt: "",
    powerConnector: "",
  },

  HDD: {
    productCode: "HDD",
    capacityGb: "",
    rpm: "",
    cacheMb: "",
    interfaceType: "",
  },

  SSD: {
    productCode: "SSD",
    capacityGb: "",
    interfaceType: "",
    formFactor: "",
    readSpeedMb: "",
    writeSpeedMb: "",
    nandType: "",
  },

  PSU: {
    productCode: "SSD",
    wattage: "",
    efficiencyRating: "",
    modularType: "",
    formFactor: "",
  },

  CASE: {
    productCode: "CASE",
    formFactorSupport: "",
    maxGpuLengthMm: "",
    maxCpuCoolerHeightMm: "",
    maxRadiatorSizeMm: "",
    driveBays: "",
  },
  COOLER: {
    productCode: "COOLER",
    coolerType: "",
    radiatorSizeMm: "",
    fanSizeMm: "",
    heightMm: "",
    tdpSupport: "",
  },

  MONITOR: {
    productCode: "MONITOR",
    screenSizeInch: "",
    resolution: "",
    refreshRateHz: "",
    panelType: "",
    responseTimeMs: "",
    brightnessNits: "",
    aspectRatio: "",
    adaptiveSync: "",
    ports: "",
  },

  KEYBOARD: {
    productCode: "KEYBOARD",
    keyboardType: "",
    switchType: "",
    layout: "",
    connection: "",
    keycapMaterial: "",
    backlight: "",
    rgb: "",
    pollingRateHz: "",
    batteryMah: "",
    dimensions: "",
  },

  MOUSE: {
    productCode: "MOUSE",
    sensor: "",
    dpiMax: "",
    pollingRateHz: "",
    buttons: "",
    connection: "",
    weightG: "",
    batteryMah: "",
    rgb: "",
  },

  HEADSET: {
    productCode: "HEADSET",
    headsetType: "",
    driverSizeMm: "",
    connection: "",
    impedanceOhm: "",
    frequencyResponse: "",
    microphone: "",
    noiseCancellation: "",
    surroundSound: "",
    batteryMah: "",
  },

  SPEAKER: {
    productCode: "SPEAKER",
    speakerType: "",
    channels: "",
    powerWatt: "",
    frequencyResponse: "",
    impedanceOhm: "",
    connection: "",
    bluetoothVersion: "",
    rgb: "",
  },
};
const PRODUCT_API = {
  CPU: `${API_URL}/cpu`,
  RAM: `${API_URL}/ram`,
  GPU: `${API_URL}/gpu`,
  HDD: `${API_URL}/hdd`,
  SSD: `${API_URL}/ssd`,
  PSU: `${API_URL}/psu`,
  CASE: `${API_URL}/case`,
  COOLER: `${API_URL}/cooler`,
  MONITOR: `${API_URL}/monitor`,
  KEYBOARD: `${API_URL}/keyboard`,
  MOUSE: `${API_URL}/mouse`,
  HEADSET: `${API_URL}/headset`,
  SPEAKER: `${API_URL}/speaker`,
};
/* =========================================================
   PAGINATION & PRODUCT LIST CONTROLLER
========================================================= */

const paginationState = {
  currentPage: 1,
  pageSize: 16, // 16 sản phẩm mỗi trang (4 hàng x 4 cột trên Desktop)
  totalElements: 419,
  totalPages: Math.ceil(419 / 16), // 27 trang
  categoryId: null,
  currentSort: "default",
};

/**
 * Danh sách sản phẩm mẫu phong phú phục vụ phân trang khi chưa có dữ liệu backend
 */
const BASE_MOCK_PCS = [
  {
    name: "PC TTG GAMING i5 12400F - RX 7600 8GB OC DUAL",
    price: 20990000,
    salePrice: 18680000,
    image: "/assets/images/pc1.jpg",
  },
  {
    name: "PC TTG ULTRA GAMING i5 14400F - RTX 5070 Ti 16GB OC",
    price: 52990000,
    salePrice: 48980000,
    image: "/assets/images/pc1.jpg",
  },
  {
    name: "PC TTG ESPORTS Ryzen 5 7500F - RTX 4060 8GB OC",
    price: 24500000,
    salePrice: 22490000,
    image: "/assets/images/pc1.jpg",
  },
  {
    name: "PC TTG WORKSTATION i7 14700K - RTX 5080 16GB White",
    price: 74900000,
    salePrice: 69900000,
    image: "/assets/images/pc1.jpg",
  },
  {
    name: "PC TTG GAMING ENTRY i3 12100F - GTX 1660 Super 6GB",
    price: 13500000,
    salePrice: 11890000,
    image: "/assets/images/pc1.jpg",
  },
  {
    name: "PC TTG PRO Ryzen 7 7700 - RTX 5060 Ti 16GB Black",
    price: 36000000,
    salePrice: 32990000,
    image: "/assets/images/pc1.jpg",
  },
  {
    name: "PC TTG WARSHIP Ryzen 7 7800X3D - RTX 5070 12GB OC",
    price: 48900000,
    salePrice: 44590000,
    image: "/assets/images/pc1.jpg",
  },
  {
    name: "PC TTG SUPREME i9 14900KS - RTX 5090 32GB King",
    price: 139000000,
    salePrice: 129900000,
    image: "/assets/images/pc1.jpg",
  },
  {
    name: "PC TTG CREATOR Ryzen 9 9900X - RTX 5070 Ti 16GB Studio",
    price: 63000000,
    salePrice: 58490000,
    image: "/assets/images/pc1.jpg",
  },
  {
    name: "PC TTG GAMING i5 13400F - RTX 3050 6GB Storm",
    price: 16500000,
    salePrice: 14790000,
    image: "/assets/images/pc1.jpg",
  },
  {
    name: "PC TTG STREAMER i5 14600K - RTX 4060 Ti 8GB Live",
    price: 29900000,
    salePrice: 27890000,
    image: "/assets/images/pc1.jpg",
  },
  {
    name: "PC TTG AQUA WHITE i5 14400F - RTX 5060 8GB ARGB",
    price: 27500000,
    salePrice: 24990000,
    image: "/assets/images/pc1.jpg",
  },
  {
    name: "PC TTG TITAN Ryzen 9 7950X - RTX 4080 Super 16GB",
    price: 88000000,
    salePrice: 82900000,
    image: "/assets/images/pc1.jpg",
  },
  {
    name: "PC TTG GAMING i5 12400F - RTX 4060 8GB Black",
    price: 21900000,
    salePrice: 19990000,
    image: "/assets/images/pc1.jpg",
  },
  {
    name: "PC TTG MASTER Ryzen 5 7600X - RTX 5060 Ti 8GB",
    price: 28500000,
    salePrice: 26490000,
    image: "/assets/images/pc1.jpg",
  },
  {
    name: "PC TTG GODLIKE i9 13900K - RTX 4090 24GB WaterCooling",
    price: 115000000,
    salePrice: 108900000,
    image: "/assets/images/pc1.jpg",
  },
];

/**
 * Sinh danh sách sản phẩm hiển thị riêng biệt theo từng trang
 */
function getMockProductsForPage(page, pageSize, sortType) {
  const items = [];
  const startId = (page - 1) * pageSize + 1;
  const editions = ["V2", "Pro", "Ultra", "Elite", "Plus", "ARGB", "OC Edition", "Special"];

  for (let i = 0; i < pageSize; i++) {
    const itemIndex = (startId + i - 1) % BASE_MOCK_PCS.length;
    const base = BASE_MOCK_PCS[itemIndex];

    // Thay đổi nhẹ giá và hậu tố theo từng trang để người dùng thấy rõ trang thay đổi
    const pageMultiplier = 1 + (((page * 3 + i * 5) % 18) - 9) / 100;
    const salePrice = Math.round((base.salePrice * pageMultiplier) / 10000) * 10000;
    const price = Math.round((base.price * pageMultiplier) / 10000) * 10000;

    const suffix = page > 1 ? ` [${editions[(startId + i) % editions.length]} - #${startId + i}]` : "";

    items.push({
      id: startId + i,
      name: `${base.name}${suffix}`,
      price: price,
      salePrice: salePrice,
      image: base.image,
    });
  }

  // Áp dụng sắp xếp nếu có
  if (sortType === "Giá tăng dần") {
    items.sort((a, b) => a.salePrice - b.salePrice);
  } else if (sortType === "Giá giảm dần") {
    items.sort((a, b) => b.salePrice - a.salePrice);
  }

  return items;
}

/**
 * Render danh sách card sản phẩm vào .product-grid
 */
function renderProductCards(products) {
  const productGrid = document.querySelector(".product-grid");
  if (!productGrid) return;

  let productCards = "";
  for (const product of products) {
    const salePriceText =
      typeof formatVND === "function"
        ? formatVND(product.salePrice)
        : `${Number(product.salePrice).toLocaleString("vi-VN")} VNĐ`;

    const oldPriceText =
      typeof formatVND === "function"
        ? formatVND(product.price)
        : `${Number(product.price).toLocaleString("vi-VN")} VNĐ`;

    const imageSrc = product.image || "/assets/images/pc1.jpg";

    productCards += `
      <a href="/product-detail?id=${product.id || 1}" class="product-card" data-product-id="${product.id}" data-name="${encodeURIComponent(product.name)}" data-price="${product.salePrice}" data-image="${imageSrc}">
        <div class="product-image">
          <img src="${imageSrc}" alt="${product.name}" loading="lazy" />
        </div>
        <div class="product-info">
          <h3 title="${product.name}">${product.name}</h3>
          <div class="product-price">${salePriceText}</div>
          <div class="old-price">${oldPriceText}</div>
          <div class="product-bottom">
            <button class="add-cart" type="button" title="Thêm vào giỏ hàng">
              <span class="cart-icon">
                <i class="fa-solid fa-cart-shopping"></i>
              </span>
              <span class="cart-text">THÊM VÀO GIỎ</span>
            </button>
            <span class="stock">Còn hàng</span>
          </div>
        </div>
      </a>
    `;
  }

  productGrid.innerHTML = productCards;
}

/**
 * Cập nhật dòng số lượng hiển thị trên Toolbar
 */
function updateProductCount(total, currentPage, totalPages) {
  const productCount = document.querySelector(".product-count");
  if (productCount) {
    productCount.innerHTML = `Tìm thấy <strong>${total}</strong> sản phẩm <span>(Trang ${currentPage}/${totalPages})</span>`;
  }
}

/**
 * Thuật toán tính danh sách số trang thông minh (Smart Pagination with Ellipsis)
 */
function getPaginationPageNumbers(current, total) {
  if (total <= 7) {
    const pages = [];
    for (let i = 1; i <= total; i++) pages.push(i);
    return pages;
  }

  if (current <= 4) {
    return [1, 2, 3, 4, 5, "...", total];
  }

  if (current >= total - 3) {
    return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
  }

  return [1, "...", current - 1, current, current + 1, "...", total];
}

/**
 * Render thanh phân trang 1, 2, 3, 4, ...
 */
function renderPaginationControls() {
  const paginationContainer = document.getElementById("pagination");
  if (!paginationContainer) return;

  const { currentPage, totalPages } = paginationState;

  if (totalPages <= 1) {
    paginationContainer.innerHTML = "";
    return;
  }

  const pages = getPaginationPageNumbers(currentPage, totalPages);
  let html = "";

  // Nút TRƯỚC
  const prevDisabled = currentPage <= 1 ? "disabled" : "";
  html += `
    <button type="button" class="page-btn page-prev ${prevDisabled}" data-page="${currentPage - 1}" ${prevDisabled ? "disabled" : ""} title="Trang trước">
      <i class="fa-solid fa-chevron-left"></i>
      <span>Trước</span>
    </button>
  `;

  // Các nút số trang
  pages.forEach((p) => {
    if (p === "...") {
      html += `<span class="page-dots">...</span>`;
    } else {
      const isActive = p === currentPage ? "active" : "";
      html += `
        <button type="button" class="page-btn ${isActive}" data-page="${p}" ${isActive ? 'aria-current="page"' : ""} title="Trang ${p}">
          ${p}
        </button>
      `;
    }
  });

  // Nút SAU
  const nextDisabled = currentPage >= totalPages ? "disabled" : "";
  html += `
    <button type="button" class="page-btn page-next ${nextDisabled}" data-page="${currentPage + 1}" ${nextDisabled ? "disabled" : ""} title="Trang sau">
      <span>Sau</span>
      <i class="fa-solid fa-chevron-right"></i>
    </button>
  `;

  paginationContainer.innerHTML = html;
}

/**
 * Chuyển tới trang chỉ định và tải lại sản phẩm
 */
async function goToPage(pageNumber) {
  if (pageNumber < 1 || pageNumber > paginationState.totalPages) return;
  paginationState.currentPage = pageNumber;

  // Cập nhật URLSearchParams không reload trang
  const url = new URL(window.location.href);
  url.searchParams.set("page", pageNumber);
  window.history.pushState({ page: pageNumber }, "", url.toString());

  // Tải hoặc sinh sản phẩm cho trang đó
  await fetchOrRenderProducts();

  // Cuộn mượt lên đầu danh sách sản phẩm
  const toolbar = document.querySelector(".product-toolbar");
  if (toolbar) {
    toolbar.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

/**
 * Tải sản phẩm từ Backend API (nếu có) hoặc dùng Mock Data đầy đủ
 */
async function fetchOrRenderProducts() {
  const { categoryId, currentPage, pageSize, currentSort } = paginationState;
  let fetchedFromApi = false;

  if (categoryId) {
    try {
      const pageIndex = currentPage - 1; // Backend Spring Boot phân trang 0-indexed
      const response = await fetch(`${API_URL}/products/${categoryId}?page=${pageIndex}&size=${pageSize}`);
      if (response.ok) {
        const resData = await response.json();
        if (
          resData &&
          resData.data &&
          Array.isArray(resData.data.content) &&
          resData.data.content.length > 0
        ) {
          paginationState.totalElements = resData.data.totalElements || resData.data.content.length;
          paginationState.totalPages =
            resData.data.totalPages || Math.ceil(paginationState.totalElements / pageSize) || 1;

          renderProductCards(resData.data.content);
          updateProductCount(paginationState.totalElements, currentPage, paginationState.totalPages);
          fetchedFromApi = true;
        }
      }
    } catch (err) {
      console.warn("Chưa kết nối được API sản phẩm, chuyển sang dữ liệu mặc định:", err);
    }
  }

  if (!fetchedFromApi) {
    // Dữ liệu mô phỏng hoàn chỉnh cho phân trang 1, 2, 3, 4, ...
    paginationState.totalElements = 419;
    paginationState.totalPages = Math.ceil(paginationState.totalElements / pageSize); // 27 trang
    const mockItems = getMockProductsForPage(currentPage, pageSize, currentSort);
    renderProductCards(mockItems);
    updateProductCount(paginationState.totalElements, currentPage, paginationState.totalPages);
  }

  // Vẽ thanh phân trang
  renderPaginationControls();
}

/**
 * Lấy thông tin danh mục theo categoryId
 */
async function getCategoryById(categoryId) {
  try {
    const response = await fetch(`${API_URL}/categories/${categoryId}`);
    if (response.ok) {
      const categoryData = await response.json();
      if (categoryData && categoryData.data && categoryData.data.name) {
        document.title = `${categoryData.data.name} - TTGShop`;
      }
    }
  } catch (error) {
    console.warn("Không thể lấy chi tiết danh mục:", error);
  }

  await fetchOrRenderProducts();
}

/**
 * Gán sự kiện click vào các nút phân trang
 */
function initPaginationEvents() {
  const paginationContainer = document.getElementById("pagination");
  if (!paginationContainer) return;

  paginationContainer.addEventListener("click", function (e) {
    const btn = e.target.closest(".page-btn");
    if (!btn || btn.disabled || btn.classList.contains("disabled") || btn.classList.contains("active")) {
      return;
    }

    const targetPage = parseInt(btn.dataset.page, 10);
    if (targetPage && targetPage >= 1 && targetPage <= paginationState.totalPages) {
      goToPage(targetPage);
    }
  });

  // Xử lý nút Back/Forward của trình duyệt
  window.addEventListener("popstate", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const page = parseInt(urlParams.get("page"), 10) || 1;
    if (page !== paginationState.currentPage) {
      paginationState.currentPage = page;
      fetchOrRenderProducts();
    }
  });
}

/**
 * Gán sự kiện cho dropdown sắp xếp
 */
function initSortEvents() {
  const sortSelect = document.querySelector(".sort-select");
  if (!sortSelect) return;

  sortSelect.addEventListener("change", function () {
    paginationState.currentSort = this.value;
    goToPage(1);
  });
}

/**
 * Gán sự kiện Thêm vào giỏ hàng nhanh cho các thẻ sản phẩm
 */
function initCartButtonEvents() {
  const productGrid = document.querySelector(".product-grid");
  if (!productGrid) return;

  productGrid.addEventListener("click", function (e) {
    const addCartBtn = e.target.closest(".add-cart");
    if (!addCartBtn) return;

    e.preventDefault();
    e.stopPropagation();

    const card = addCartBtn.closest(".product-card");
    if (!card) return;

    const id = card.dataset.productId || `pc-${Date.now()}`;
    const name = decodeURIComponent(card.dataset.name || card.querySelector("h3")?.textContent || "PC Gaming");
    const price = Number(card.dataset.price) || 18680000;
    const image = card.dataset.image || "/assets/images/pc1.jpg";

    try {
      const cart = JSON.parse(localStorage.getItem("cartItems") || "[]");
      const existing = cart.find((item) => String(item.id) === String(id));
      if (existing) {
        existing.quantity = (existing.quantity || 1) + 1;
      } else {
        cart.push({
          id: id,
          name: name,
          price: price,
          image: image,
          quantity: 1,
        });
      }
      localStorage.setItem("cartItems", JSON.stringify(cart));
      showToastNotification(`Đã thêm "${name}" vào giỏ hàng!`);
    } catch (err) {
      console.warn("Lỗi lưu giỏ hàng:", err);
    }
  });
}

/**
 * Hiển thị thông báo Toast nhanh
 */
function showToastNotification(message) {
  let toast = document.getElementById("productListToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "productListToast";
    toast.className = "product-list-toast";
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>${message}</span>`;
  toast.classList.add("show");

  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 3200);
}

/**
 * Gán sự kiện khi click bộ lọc sidebar
 */
function initFilterEvents() {
  const checkboxes = document.querySelectorAll(".filter-sidebar input[type='checkbox']");
  checkboxes.forEach((cb) => {
    cb.addEventListener("change", function () {
      goToPage(1);
    });
  });
}

/**
 * Hàm khởi chạy trang danh sách sản phẩm
 */
async function loadProductOnProductListPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("categoryId");
  const page = parseInt(urlParams.get("page"), 10) || 1;
  const error = urlParams.get("error");

  if (error === "missing_id") {
    alert("Vui lòng chọn một sản phẩm từ danh sách để xem chi tiết!");
  } else if (error === "product_not_found") {
    alert("Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã ngừng kinh doanh!");
  }

  paginationState.categoryId = id;
  paginationState.currentPage = Math.max(1, page);

  initPaginationEvents();
  initSortEvents();
  initCartButtonEvents();
  initFilterEvents();

  if (id) {
    await getCategoryById(id);
  } else {
    await fetchOrRenderProducts();
  }
}

// Khởi chạy
loadProductOnProductListPage();
// SPEAKER
// private String speakerType;
//     private String channels;
//     private BigDecimal powerWatt;
//     private String frequencyResponse;
//     private BigDecimal impedanceOhm;
//     private String connection;
//     private String bluetoothVersion;
//     private Boolean rgb;
// HEADSET
// private String headsetType;
//     private BigDecimal driverSizeMm;
//     private String connection;
//     private BigDecimal impedanceOhm;
//     private String frequencyResponse;
//     private Boolean microphone;
//     private String noiseCancellation;
//     private String surroundSound;
//     private Integer batteryMah;
// MOUSE
//  private String sensor;
//     private Integer dpiMax;
//     private Integer pollingRateHz;
//     private Integer buttons;
//     private String connection;
//     private BigDecimal weightG;
//     private Integer batteryMah;
//     private Boolean rgb;
// KEYBOARD
//  private String keyboardType;
//     private String switchType;
//     private String layout;
//     private String connection;
//     private String keycapMaterial;
//     private String backlight;
//     private Boolean rgb;
//     private Integer pollingRateHz;
//     private Integer batteryMah;
//     private String dimensions;
// MONITOR
//  private BigDecimal screenSizeInch;
//     private String resolution;
//     private Integer refreshRateHz;
//     private String panelType;
//     private BigDecimal responseTimeMs;
//     private Integer brightnessNits;
//     private String aspectRatio;
//     private String adaptiveSync;
//     private String ports;

// Cooler
//  private String coolerType;
//     private String supportedSockets;
//     private Integer radiatorSizeMm;
//     private Integer fanSizeMm;
//     private Integer heightMm;
//     private String tdpSupport;

// case
// private String formFactorSupport;
//     private Integer maxGpuLengthMm;
//     private Integer maxCpuCoolerHeightMm;
//     private Integer maxRadiatorSizeMm;
//     private Integer driveBays;
// psu
// private Integer wattage;
// private String efficiencyRating;
// private String modularType;
// private String formFactor;

// ssd
//  private String capacityGb;
//     private String interfaceType;
//     private String formFactor;
//     private Integer readSpeedMb;
//     private Integer writeSpeedMb;
//     private String nandType;
// HDD
//  private Long id;
//     private String capacityGb;
//     private Integer rpm;
//     private Integer cacheMb;
//     private String interfaceType;

//gpu
//    private Long id;
//     private String chipSet;
//     private Integer vramGb;
//     private String  memoryType;
//     private Integer lengthMm;
//     private BigDecimal widthSlots;
//     private Integer recommendedPsuWatt;
//     private String powerConnector;
//ram
// private Long id;
//     private Integer capacityGb;
//     private String memoryType;
//     private Integer speedMhz;
//     private Integer moduleCount;
//     private BigDecimal voltage;
