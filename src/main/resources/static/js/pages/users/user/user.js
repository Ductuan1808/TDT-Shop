/**
 * USER PAGE LOGIC (TÀI KHOẢN NGƯỜI DÙNG)
 * Quản lý các màn hình:
 * 1. Thông tin cá nhân (?view=change-info)
 * 2. Quản lý đơn hàng dạng card với 4 trạng thái (?view=order) & Phân trang (Pagination)
 * 3. Thay đổi mật khẩu (?view=change-pass)
 * 4. Popup xác nhận đăng xuất với Có / Không
 */

// ==========================================
// DỮ LIỆU ĐƠN HÀNG MẪU (8 ĐƠN HÀNG / 4 TRẠNG THÁI)
// ==========================================
const DEFAULT_ORDERS = [
  {
    id: "TDT-2026-9812",
    date: "05/10/2026",
    status: "pending",
    statusText: "Chờ xác nhận",
    badgeClass: "status-pending",
    badgeIcon: "fa-regular fa-clock",
    paymentMethod: "Thanh toán khi nhận hàng (COD)",
    recipient: {
      name: "Tuấn Đức",
      phone: "0986180804",
      address: "Chung cư new house xala, Phường Phúc La, Quận Hà Đông, Hà Nội"
    },
    items: [
      {
        name: "PC GAMING TDT Core i5 13400F / RTX 3060 12GB / RAM 16GB / SSD 512GB",
        spec: "Phân loại: Intel Core i5 13400F / RTX 3060 / Màu Đen",
        price: 18490000,
        quantity: 1,
        image: "/assets/images/logo.png"
      }
    ],
    shippingFee: 0,
    total: 18490000
  },
  {
    id: "TDT-2026-9205",
    date: "04/10/2026",
    status: "pending",
    statusText: "Chờ xác nhận",
    badgeClass: "status-pending",
    badgeIcon: "fa-regular fa-clock",
    paymentMethod: "Thanh toán khi nhận hàng (COD)",
    recipient: {
      name: "Tuấn Đức",
      phone: "0986180804",
      address: "Chung cư new house xala, Phường Phúc La, Quận Hà Đông, Hà Nội"
    },
    items: [
      {
        name: "Tai nghe Gaming HyperX Cloud III Wireless Red/Black",
        spec: "Phân loại: Không dây 2.4GHz / Pin 120h / Đệm mút hoạt tính",
        price: 3490000,
        quantity: 1,
        image: "/assets/images/logo.png"
      }
    ],
    shippingFee: 0,
    total: 3490000
  },
  {
    id: "TDT-2026-8741",
    date: "03/10/2026",
    status: "preparing",
    statusText: "Đang chuẩn bị hàng",
    badgeClass: "status-preparing",
    badgeIcon: "fa-solid fa-boxes-packing",
    paymentMethod: "Chuyển khoản ngân hàng (Đã thanh toán)",
    recipient: {
      name: "Tuấn Đức",
      phone: "0986180804",
      address: "Chung cư new house xala, Phường Phúc La, Quận Hà Đông, Hà Nội"
    },
    items: [
      {
        name: "Màn hình Gaming ASUS TUF VG279Q3A 27 inch Fast IPS 180Hz 1ms sRGB 99%",
        spec: "Phân loại: 27 inch / 180Hz / Full HD Fast IPS",
        price: 4850000,
        quantity: 1,
        image: "/assets/images/logo.png"
      }
    ],
    shippingFee: 0,
    total: 4850000
  },
  {
    id: "TDT-2026-8319",
    date: "02/10/2026",
    status: "preparing",
    statusText: "Đang chuẩn bị hàng",
    badgeClass: "status-preparing",
    badgeIcon: "fa-solid fa-boxes-packing",
    paymentMethod: "Chuyển khoản ngân hàng (Đã thanh toán)",
    recipient: {
      name: "Tuấn Đức",
      phone: "0986180804",
      address: "Chung cư new house xala, Phường Phúc La, Quận Hà Đông, Hà Nội"
    },
    items: [
      {
        name: "Ổ cứng SSD Samsung 990 PRO 1TB PCIe NVMe Gen 4.0 x4",
        spec: "Phân loại: 1TB / Đọc 7450MB/s / Ghi 6900MB/s",
        price: 2890000,
        quantity: 1,
        image: "/assets/images/logo.png"
      }
    ],
    shippingFee: 0,
    total: 2890000
  },
  {
    id: "TDT-2026-7650",
    date: "01/10/2026",
    status: "shipping",
    statusText: "Đang giao hàng",
    badgeClass: "status-shipping",
    badgeIcon: "fa-solid fa-truck-fast",
    paymentMethod: "Thanh toán khi nhận hàng (COD)",
    recipient: {
      name: "Tuấn Đức",
      phone: "0986180804",
      address: "Chung cư new house xala, Phường Phúc La, Quận Hà Đông, Hà Nội"
    },
    items: [
      {
        name: "Bàn phím cơ FL-Esports OG87 Retro White (Gateron G Pro Brown / 3 Mode)",
        spec: "Phân loại: Màu Retro White / Brown Switch",
        price: 1490000,
        quantity: 1,
        image: "/assets/images/logo.png"
      },
      {
        name: "Chuột không dây Gaming Logitech G304 Lightspeed Wireless Black",
        spec: "Phân loại: Màu Đen / Cảm biến HERO 12.000 DPI",
        price: 790000,
        quantity: 1,
        image: "/assets/images/logo.png"
      }
    ],
    shippingFee: 0,
    total: 2280000
  },
  {
    id: "TDT-2026-7102",
    date: "28/09/2026",
    status: "shipping",
    statusText: "Đang giao hàng",
    badgeClass: "status-shipping",
    badgeIcon: "fa-solid fa-truck-fast",
    paymentMethod: "Thanh toán khi nhận hàng (COD)",
    recipient: {
      name: "Tuấn Đức",
      phone: "0986180804",
      address: "Chung cư new house xala, Phường Phúc La, Quận Hà Đông, Hà Nội"
    },
    items: [
      {
        name: "Ghế công thái học Ergonomic Sihoo M57 Grey Version",
        spec: "Phân loại: Xám / Lưới thoáng khí / Kê tay 3D",
        price: 3690000,
        quantity: 1,
        image: "/assets/images/logo.png"
      }
    ],
    shippingFee: 0,
    total: 3690000
  },
  {
    id: "TDT-2026-6523",
    date: "20/09/2026",
    status: "completed",
    statusText: "Đã giao hàng",
    badgeClass: "status-completed",
    badgeIcon: "fa-solid fa-circle-check",
    paymentMethod: "Chuyển khoản trực tuyến (Đã thanh toán)",
    recipient: {
      name: "Tuấn Đức",
      phone: "0986180804",
      address: "Chung cư new house xala, Phường Phúc La, Quận Hà Đông, Hà Nội"
    },
    items: [
      {
        name: "PC WORKSTATION RENDER TDT Ryzen 9 7900X / RTX 4070 Ti SUPER 16GB",
        spec: "Phân loại: AMD Ryzen 9 7900X / 32GB DDR5 / 1TB NVMe Gen4",
        price: 35900000,
        quantity: 1,
        image: "/assets/images/logo.png"
      }
    ],
    shippingFee: 0,
    total: 35900000
  },
  {
    id: "TDT-2026-5410",
    date: "10/08/2026",
    status: "completed",
    statusText: "Đã giao hàng",
    badgeClass: "status-completed",
    badgeIcon: "fa-solid fa-circle-check",
    paymentMethod: "Thanh toán khi nhận hàng (COD)",
    recipient: {
      name: "Tuấn Đức",
      phone: "0986180804",
      address: "Chung cư new house xala, Phường Phúc La, Quận Hà Đông, Hà Nội"
    },
    items: [
      {
        name: "VGA MSI GeForce RTX 4060 VENTUS 2X BLACK 8G OC",
        spec: "Phân loại: 8GB GDDR6 / 128-bit / 2 quạt tản nhiệt",
        price: 8190000,
        quantity: 1,
        image: "/assets/images/logo.png"
      }
    ],
    shippingFee: 0,
    total: 8190000
  }
];

// Khởi tạo state đơn hàng từ localStorage hoặc mặc định
let userOrders = [];
function loadOrdersFromStorage() {
  const saved = localStorage.getItem("tdt_user_orders");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      // Nếu số lượng đơn hàng lưu trước đó nhỏ hơn mẫu mới, cập nhật lại
      if (Array.isArray(parsed) && parsed.length >= 4) {
        userOrders = parsed;
      } else {
        userOrders = [...DEFAULT_ORDERS];
        saveOrdersToStorage();
      }
    } catch (e) {
      userOrders = [...DEFAULT_ORDERS];
    }
  } else {
    userOrders = [...DEFAULT_ORDERS];
    saveOrdersToStorage();
  }
}

function saveOrdersToStorage() {
  localStorage.setItem("tdt_user_orders", JSON.stringify(userOrders));
}

// Format giá tiền Việt Nam
function formatCurrency(amount) {
  return (
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND"
    })
      .format(amount)
      .replace("₫", "") + "₫"
  );
}

// ==========================================
// ĐIỀU HƯỚNG TABS THEO URL VÀ CLICK
// ==========================================
function switchTab(tabKey, updateUrl = true) {
  let panelId = "tab-profile";
  let paramValue = "change-info";

  if (tabKey === "orders" || tabKey === "order") {
    panelId = "tab-orders";
    paramValue = "order";
  } else if (tabKey === "password" || tabKey === "change-pass") {
    panelId = "tab-password";
    paramValue = "change-pass";
  } else {
    panelId = "tab-profile";
    paramValue = "change-info";
  }

  // 1. Cập nhật menu sidebar
  document.querySelectorAll(".account-menu-item[data-tab]").forEach((item) => {
    const isCurrent =
      (item.dataset.tab === "profile" && panelId === "tab-profile") ||
      (item.dataset.tab === "orders" && panelId === "tab-orders") ||
      (item.dataset.tab === "password" && panelId === "tab-password");
    item.classList.toggle("active", isCurrent);
  });

  // 2. Ẩn/hiện panel
  document.querySelectorAll(".tab-panel").forEach((panel) => {
    panel.classList.remove("active");
  });
  const targetPanel = document.getElementById(panelId);
  if (targetPanel) {
    targetPanel.classList.add("active");
  }

  // 3. Nếu là tab đơn hàng, re-render danh sách và phân trang
  if (panelId === "tab-orders") {
    currentPage = 1;
    renderOrders();
  }

  // 4. Cập nhật URL sạch không tải lại trang
  if (updateUrl) {
    const newUrl = `${window.location.pathname}?view=${paramValue}`;
    window.history.pushState({ tab: paramValue }, "", newUrl);
  }
}

// Đọc URL ban đầu
function initTabFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const view = params.get("view");
  if (view === "order") {
    switchTab("orders", false);
  } else if (view === "change-pass") {
    switchTab("password", false);
  } else {
    switchTab("profile", false);
  }
}

// Lắng nghe nút quay lại/tiếp tới của trình duyệt
window.addEventListener("popstate", () => {
  initTabFromUrl();
});

// ==========================================
// RENDER QUẢN LÝ ĐƠN HÀNG DẠNG CARDS & PHÂN TRANG
// ==========================================
let currentFilterStatus = "all";
let currentPage = 1;
const pageSize = 3; // 3 đơn hàng mỗi trang

function updateOrderCounts() {
  const countAll = userOrders.length;
  const countPending = userOrders.filter((o) => o.status === "pending").length;
  const countPreparing = userOrders.filter((o) => o.status === "preparing").length;
  const countShipping = userOrders.filter((o) => o.status === "shipping").length;
  const countCompleted = userOrders.filter((o) => o.status === "completed").length;

  const countAllEl = document.getElementById("count-all");
  const countPendingEl = document.getElementById("count-pending");
  const countPreparingEl = document.getElementById("count-preparing");
  const countShippingEl = document.getElementById("count-shipping");
  const countCompletedEl = document.getElementById("count-completed");

  if (countAllEl) countAllEl.textContent = `(${countAll})`;
  if (countPendingEl) countPendingEl.textContent = `(${countPending})`;
  if (countPreparingEl) countPreparingEl.textContent = `(${countPreparing})`;
  if (countShippingEl) countShippingEl.textContent = `(${countShipping})`;
  if (countCompletedEl) countCompletedEl.textContent = `(${countCompleted})`;
}

function renderOrders(filterStatus = currentFilterStatus) {
  currentFilterStatus = filterStatus;
  updateOrderCounts();

  const container = document.getElementById("orderCardsList");
  const paginationContainer = document.getElementById("orderPagination");
  const emptyState = document.getElementById("orderEmpty");
  if (!container) return;

  const filtered =
    filterStatus === "all"
      ? userOrders
      : userOrders.filter((o) => o.status === filterStatus);

  if (filtered.length === 0) {
    container.innerHTML = "";
    if (paginationContainer) paginationContainer.innerHTML = "";
    if (emptyState) emptyState.style.display = "block";
    return;
  }

  if (emptyState) emptyState.style.display = "none";

  // Tính toán phân trang
  const totalPages = Math.ceil(filtered.length / pageSize);
  if (currentPage > totalPages) {
    currentPage = totalPages;
  }
  if (currentPage < 1) {
    currentPage = 1;
  }

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const pagedOrders = filtered.slice(startIndex, endIndex);

  // Render các card trong trang hiện tại
  let html = "";
  pagedOrders.forEach((order) => {
    const itemsHtml = order.items
      .map(
        (item) => `
        <div class="order-item-row">
          <div class="order-item-img">
            <img src="${item.image}" alt="${item.name}" onerror="this.src='/assets/images/logo.png'">
          </div>
          <div class="order-item-info">
            <div class="order-item-name">${item.name}</div>
            <div class="order-item-spec">${item.spec}</div>
            <div class="order-item-qty">Số lượng: <strong>x${item.quantity}</strong></div>
          </div>
          <div class="order-item-price">
            <div class="order-item-unit-price">${formatCurrency(item.price)}</div>
          </div>
        </div>
      `
      )
      .join("");

    let actionButtons = `
      <button type="button" class="btn-order-action btn-outline" onclick="openOrderDetail('${order.id}')">
        Xem chi tiết
      </button>
    `;

    if (order.status === "pending") {
      actionButtons += `
        <button type="button" class="btn-order-action btn-cancel-order" onclick="cancelOrder('${order.id}')">
          Hủy đơn hàng
        </button>
      `;
    } else if (order.status === "completed") {
      actionButtons += `
        <button type="button" class="btn-order-action btn-primary" onclick="reorder('${order.id}')">
          Mua lại
        </button>
      `;
    } else if (order.status === "shipping") {
      actionButtons += `
        <button type="button" class="btn-order-action btn-primary" onclick="openOrderDetail('${order.id}')">
          Theo dõi đơn
        </button>
      `;
    }

    html += `
      <div class="order-card" id="card-${order.id}">
        <div class="order-card-header">
          <div class="order-card-code">
            <span>Mã đơn: #${order.id}</span>
            <span class="order-card-date"><i class="fa-regular fa-calendar"></i> ${order.date}</span>
          </div>
          <div>
            <span class="status-badge ${order.badgeClass}">
              <i class="${order.badgeIcon}"></i>
              ${order.statusText}
            </span>
          </div>
        </div>

        <div class="order-card-body">
          ${itemsHtml}
        </div>

        <div class="order-card-footer">
          <div class="order-total-group">
            Tổng số tiền: <span class="order-total-price">${formatCurrency(order.total)}</span>
          </div>
          <div class="order-card-actions">
            ${actionButtons}
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;

  // Render thanh phân trang
  renderPagination(totalPages);
}

// Hàm render nút phân trang
function renderPagination(totalPages) {
  const paginationContainer = document.getElementById("orderPagination");
  if (!paginationContainer) return;

  if (totalPages <= 1) {
    paginationContainer.innerHTML = "";
    return;
  }

  let pagHtml = "";

  // Nút Prev
  pagHtml += `
    <button type="button" class="page-btn" ${currentPage === 1 ? "disabled" : ""} onclick="goToOrderPage(${currentPage - 1})" title="Trang trước">
      <i class="fa-solid fa-angle-left"></i>
    </button>
  `;

  // Các trang số
  const pages = [];
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    if (currentPage <= 3) {
      pages.push(1, 2, 3, "...", totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, "...", currentPage, "...", totalPages);
    }
  }

  pages.forEach(p => {
    if (p === "...") {
      pagHtml += `<span class="page-dots">...</span>`;
    } else {
      pagHtml += `
        <button type="button" class="page-btn ${p === currentPage ? "active" : ""}" onclick="goToOrderPage(${p})">
          ${p}
        </button>
      `;
    }
  });

  // Nút Next
  pagHtml += `
    <button type="button" class="page-btn" ${currentPage === totalPages ? "disabled" : ""} onclick="goToOrderPage(${currentPage + 1})" title="Trang sau">
      <i class="fa-solid fa-angle-right"></i>
    </button>
  `;

  paginationContainer.innerHTML = pagHtml;
}

// Chuyển trang đơn hàng
window.goToOrderPage = function (page) {
  currentPage = page;
  renderOrders(currentFilterStatus);

  // Cuộn nhẹ lên đầu danh sách đơn hàng
  const tabOrders = document.getElementById("tab-orders");
  if (tabOrders) {
    tabOrders.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

// Hủy đơn hàng (dành cho đơn "Chờ xác nhận")
window.cancelOrder = function (orderId) {
  if (confirm(`Bạn có chắc chắn muốn hủy đơn hàng #${orderId} không?`)) {
    userOrders = userOrders.filter((o) => o.id !== orderId);
    saveOrdersToStorage();
    renderOrders();
    showUserToast(`Đã hủy thành công đơn hàng #${orderId}!`, "info");
  }
};

// Mua lại đơn hàng
window.reorder = function (orderId) {
  showUserToast("Đã thêm các sản phẩm vào giỏ hàng!", "success");
  setTimeout(() => {
    window.location.href = "/cart";
  }, 700);
};

// ==========================================
// MODAL CHI TIẾT ĐƠN HÀNG
// ==========================================
window.openOrderDetail = function (orderId) {
  const order = userOrders.find((o) => o.id === orderId);
  if (!order) return;

  const modal = document.getElementById("orderDetailModal");
  const title = document.getElementById("modalOrderTitle");
  const body = document.getElementById("modalOrderBody");

  if (!modal || !title || !body) return;

  title.textContent = `Chi tiết đơn hàng #${order.id}`;

  // Stepper timeline
  const stepPending = "completed";
  const stepPreparing =
    order.status === "preparing" || order.status === "shipping" || order.status === "completed"
      ? "completed"
      : "";
  const stepShipping =
    order.status === "shipping" || order.status === "completed" ? "completed" : "";
  const stepCompleted = order.status === "completed" ? "completed active" : "";

  // Items list table
  const itemsRows = order.items
    .map(
      (item) => `
      <div class="order-item-row">
        <div class="order-item-img">
          <img src="${item.image}" alt="${item.name}" onerror="this.src='/assets/images/logo.png'">
        </div>
        <div class="order-item-info">
          <div class="order-item-name">${item.name}</div>
          <div class="order-item-spec">${item.spec}</div>
          <div class="order-item-qty">Số lượng: x${item.quantity}</div>
        </div>
        <div class="order-item-price">
          <div class="order-item-unit-price">${formatCurrency(item.price * item.quantity)}</div>
        </div>
      </div>
    `
    )
    .join("");

  body.innerHTML = `
    <!-- Stepper tiến trình -->
    <div class="order-stepper">
      <div class="stepper-step ${stepPending}">
        <div class="stepper-dot"><i class="fa-solid fa-check"></i></div>
        <div class="stepper-text">Chờ xác nhận</div>
      </div>
      <div class="stepper-step ${stepPreparing}">
        <div class="stepper-dot"><i class="fa-solid fa-boxes-packing"></i></div>
        <div class="stepper-text">Chuẩn bị hàng</div>
      </div>
      <div class="stepper-step ${stepShipping}">
        <div class="stepper-dot"><i class="fa-solid fa-truck"></i></div>
        <div class="stepper-text">Đang giao</div>
      </div>
      <div class="stepper-step ${stepCompleted}">
        <div class="stepper-dot"><i class="fa-solid fa-house-chimney"></i></div>
        <div class="stepper-text">Đã giao hàng</div>
      </div>
    </div>

    <!-- Thông tin người nhận -->
    <div class="detail-section-title">Thông tin giao hàng</div>
    <div class="detail-info-grid">
      <div class="detail-info-item"><span class="label">Người nhận:</span> <span class="value">${order.recipient.name}</span></div>
      <div class="detail-info-item"><span class="label">Điện thoại:</span> <span class="value">${order.recipient.phone}</span></div>
      <div class="detail-info-item" style="grid-column: 1 / -1;"><span class="label">Địa chỉ:</span> <span class="value">${order.recipient.address}</span></div>
      <div class="detail-info-item"><span class="label">Ngày đặt:</span> <span class="value">${order.date}</span></div>
      <div class="detail-info-item"><span class="label">Thanh toán:</span> <span class="value">${order.paymentMethod}</span></div>
    </div>

    <!-- Sản phẩm -->
    <div class="detail-section-title" style="margin-top: 20px;">Sản phẩm trong đơn</div>
    <div class="order-card-body" style="padding: 0;">
      ${itemsRows}
    </div>

    <!-- Chi phí -->
    <div class="detail-summary-table">
      <div class="detail-summary-row">
        <span>Tạm tính</span>
        <span>${formatCurrency(order.total)}</span>
      </div>
      <div class="detail-summary-row">
        <span>Phí vận chuyển</span>
        <span style="color: #10b981; font-weight: 600;">Miễn phí</span>
      </div>
      <div class="detail-summary-row grand-total">
        <span>Tổng thanh toán</span>
        <span class="total-val">${formatCurrency(order.total)}</span>
      </div>
    </div>
  `;

  modal.style.display = "flex";
};

// ==========================================
// TOGGLE PASSWORD VISIBILITY
// ==========================================
window.toggleUserPassword = function (inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const icon = btn.querySelector("i");
  if (input.type === "password") {
    input.type = "text";
    if (icon) {
      icon.classList.remove("fa-eye");
      icon.classList.add("fa-eye-slash");
    }
  } else {
    input.type = "password";
    if (icon) {
      icon.classList.remove("fa-eye-slash");
      icon.classList.add("fa-eye");
    }
  }
};

// ==========================================
// TOAST THÔNG BÁO
// ==========================================
function showUserToast(message, type = "success") {
  const toast = document.getElementById("userToast");
  if (!toast) return;

  toast.textContent = message;
  toast.className = `user-toast ${type} show`;

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// ==========================================
// KHỞI TẠO EVENT LISTENERS KHI DOM READY
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  loadOrdersFromStorage();
  initTabFromUrl();

  // 1. Menu tab sidebar clicks
  document.querySelectorAll(".account-menu-item[data-tab]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const tab = btn.dataset.tab;
      switchTab(tab, true);
    });
  });

  // 2. Filter tabs trong màn quản lý đơn hàng
  document.querySelectorAll(".order-tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".order-tab-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const status = btn.dataset.status;
      currentPage = 1; // Reset về trang 1 khi đổi bộ lọc
      renderOrders(status);
    });
  });

  // 3. Popup Đăng xuất (Có / Không)
  const logoutBtn = document.getElementById("sidebarLogoutBtn");
  const logoutModal = document.getElementById("logoutModal");
  const cancelLogoutBtn = document.getElementById("cancelLogoutBtn");
  const confirmLogoutBtn = document.getElementById("confirmLogoutBtn");

  if (logoutBtn && logoutModal) {
    logoutBtn.addEventListener("click", () => {
      logoutModal.style.display = "flex";
    });
  }

  if (cancelLogoutBtn && logoutModal) {
    // Nút "Không" -> Đóng popup
    cancelLogoutBtn.addEventListener("click", () => {
      logoutModal.style.display = "none";
    });
  }

  if (confirmLogoutBtn && logoutModal) {
    // Nút "Có" -> Tiến hành đăng xuất
    confirmLogoutBtn.addEventListener("click", () => {
      logoutModal.style.display = "none";
      showUserToast("Đăng xuất thành công! Đang chuyển hướng...", "success");

      // Xóa thông tin đăng nhập trong session/local
      localStorage.removeItem("currentUser");
      sessionStorage.clear();

      setTimeout(() => {
        window.location.href = "/login";
      }, 700);
    });
  }

  // Đóng modal khi click ra ngoài overlay
  if (logoutModal) {
    logoutModal.addEventListener("click", (e) => {
      if (e.target === logoutModal) {
        logoutModal.style.display = "none";
      }
    });
  }

  // 4. Modal Chi tiết đơn hàng
  const orderDetailModal = document.getElementById("orderDetailModal");
  const closeOrderDetailBtn = document.getElementById("closeOrderDetailModal");

  if (closeOrderDetailBtn && orderDetailModal) {
    closeOrderDetailBtn.addEventListener("click", () => {
      orderDetailModal.style.display = "none";
    });
  }

  if (orderDetailModal) {
    orderDetailModal.addEventListener("click", (e) => {
      if (e.target === orderDetailModal) {
        orderDetailModal.style.display = "none";
      }
    });
  }

  // 5. Submit Form Cập nhật thông tin cá nhân
  const profileForm = document.getElementById("profileForm");
  if (profileForm) {
    // Tải dữ liệu lưu trước đó nếu có
    const savedProfile = localStorage.getItem("tdt_user_profile");
    if (savedProfile) {
      try {
        const data = JSON.parse(savedProfile);
        if (data.fullName) {
          document.getElementById("fullName").value = data.fullName;
          document.getElementById("sidebarUserName").textContent = data.fullName;
        }
        if (data.email) document.getElementById("email").value = data.email;
        if (data.address) document.getElementById("address").value = data.address;
        if (data.province) document.getElementById("province").value = data.province;
        if (data.landline) document.getElementById("landline").value = data.landline;
        if (data.mobile) document.getElementById("mobile").value = data.mobile;
      } catch (e) {}
    }

    profileForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const fullName = document.getElementById("fullName").value.trim();
      const email = document.getElementById("email").value.trim();
      const address = document.getElementById("address").value.trim();
      const province = document.getElementById("province").value;
      const landline = document.getElementById("landline").value.trim();
      const mobile = document.getElementById("mobile").value.trim();

      const profileData = { fullName, email, address, province, landline, mobile };
      localStorage.setItem("tdt_user_profile", JSON.stringify(profileData));

      // Cập nhật tên trên sidebar
      if (fullName) {
        document.getElementById("sidebarUserName").textContent = fullName;
      }

      showUserToast("Cập nhật thông tin cá nhân thành công!", "success");
    });
  }

  // 6. Submit Form Đổi mật khẩu
  const changePasswordForm = document.getElementById("changePasswordForm");
  if (changePasswordForm) {
    changePasswordForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const oldPassword = document.getElementById("oldPassword").value;
      const newPassword = document.getElementById("newPassword").value;
      const confirmPassword = document.getElementById("confirmPassword").value;

      if (!oldPassword) {
        showUserToast("Vui lòng nhập mật khẩu cũ!", "error");
        return;
      }

      if (newPassword.length < 6) {
        showUserToast("Mật khẩu mới phải có ít nhất 6 ký tự!", "error");
        return;
      }

      if (newPassword !== confirmPassword) {
        showUserToast("Mật khẩu nhập lại không khớp!", "error");
        return;
      }

      // Mô phỏng thành công
      showUserToast("Thay đổi mật khẩu thành công!", "success");
      changePasswordForm.reset();
    });
  }
});
