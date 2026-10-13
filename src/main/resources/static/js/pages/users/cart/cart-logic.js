let discount = 0;

/* ================= FORMAT MONEY ================= */

function formatMoney(number) {
  return number.toLocaleString("vi-VN") + " VNĐ";
}

/* ================= UPDATE CART ================= */

function updateCart() {
  let total = 0;

  document.querySelectorAll(".product-item").forEach((item) => {
    const price = Number(item.dataset.price);

    const quantityElement = item.querySelector(".quantity-number");

    const quantity = Number(quantityElement.textContent);

    const itemTotal = price * quantity;

    item.querySelector(".total-price").textContent = formatMoney(itemTotal);

    total += itemTotal;
  });

  document.getElementById("cartTotal").textContent = formatMoney(total);

  document.getElementById("summaryTotal").textContent = formatMoney(total);

  document.getElementById("discountAmount").textContent = formatMoney(discount);

  const finalPrice = Math.max(total - discount, 0);

  document.getElementById("finalTotal").textContent = formatMoney(finalPrice);
}

/* ================= EVENT DELEGATION FOR CART ITEMS ================= */

const cartItemsContainer = document.querySelector(".cart-items");
if (cartItemsContainer) {
  cartItemsContainer.addEventListener("click", function (e) {
    const plusBtn = e.target.closest(".plus");
    if (plusBtn) {
      const qtyEl = plusBtn.parentElement.querySelector(".quantity-number");
      if (qtyEl) {
        qtyEl.textContent = Number(qtyEl.textContent) + 1;
        saveCartToStorage();
        updateCart();
      }
      return;
    }

    const minusBtn = e.target.closest(".minus");
    if (minusBtn) {
      const qtyEl = minusBtn.parentElement.querySelector(".quantity-number");
      if (qtyEl) {
        let currentQuantity = Number(qtyEl.textContent);
        if (currentQuantity > 1) {
          qtyEl.textContent = currentQuantity - 1;
          saveCartToStorage();
          updateCart();
        }
      }
      return;
    }

    const removeBtn = e.target.closest(".remove-product");
    if (removeBtn) {
      const item = removeBtn.closest(".product-item");
      if (item) {
        item.remove();
        saveCartToStorage();
        updateCart();
      }
      return;
    }
  });
}

function saveCartToStorage() {
  try {
    const items = [];
    document.querySelectorAll(".product-item").forEach((el) => {
      const price = Number(el.dataset.price) || 0;
      const id = el.dataset.productId || Math.random().toString();
      const name = el.querySelector(".product-name")?.textContent?.trim() || "";
      const image = el.querySelector(".product-image img")?.src || "";
      const quantity = Number(el.querySelector(".quantity-number")?.textContent) || 1;
      items.push({ id, name, price, image, quantity });
    });
    localStorage.setItem("cartItems", JSON.stringify(items));
  } catch (err) {
    console.warn("Lỗi lưu cart vào storage:", err);
  }
}

/* ================= LOAD CART FROM STORAGE ================= */

function loadCartFromStorage() {
  try {
    const raw = localStorage.getItem("cartItems");
    if (!raw) return;
    const items = JSON.parse(raw);
    if (!Array.isArray(items) || items.length === 0) return;

    if (!cartItemsContainer) return;

    let html = "";
    items.forEach((p) => {
      html += `
        <div class="cart-item product-item" data-price="${p.price}" data-product-id="${p.id}">
          <div class="product-info">
            <div class="product-image">
              <img
                src="${p.image || '/assets/images/pc1.jpg'}"
                alt="${p.name}"
              />
            </div>
            <div class="product-details">
              <a href="/product-detail?id=${p.id || 1}" class="product-name">
                ${p.name}
              </a>
              <div class="config-row">
                <strong>Loại:</strong>
                <span class="config-value">${p.isMain ? "Sản phẩm chính" : "Mua kèm ưu đãi"}</span>
              </div>
              <div class="config-row">
                <strong>Bảo hành:</strong>
                <span class="config-value">36 Tháng</span>
              </div>
            </div>
          </div>
          <div class="price">${formatMoney(p.price)}</div>
          <div class="quantity-control">
            <button class="quantity-btn minus">-</button>
            <div class="quantity-number">${p.quantity || 1}</div>
            <button class="quantity-btn plus">+</button>
          </div>
          <div class="total-price">${formatMoney(p.price * (p.quantity || 1))}</div>
          <button class="remove-product">🗑</button>
        </div>
      `;
    });

    cartItemsContainer.innerHTML = html;
  } catch (err) {
    console.warn("Lỗi tải cart từ storage:", err);
  }
}

/* ================= CLEAR CART ================= */

function clearCart() {
  const confirmDelete = confirm("Bạn có chắc muốn xóa toàn bộ giỏ hàng?");

  if (confirmDelete) {
    if (cartItemsContainer) cartItemsContainer.innerHTML = "";
    localStorage.removeItem("cartItems");
    discount = 0;
    updateCart();
  }
}

/* ================= VOUCHER MODAL ================= */

function openVoucherModal() {
  document.getElementById("voucherModal").classList.add("active");
}

function closeVoucherModal() {
  document.getElementById("voucherModal").classList.remove("active");
}

/* ================= SELECT VOUCHER ================= */

function selectVoucher(code, amount) {
  document.getElementById("voucherInput").value = code;

  discount = amount;

  closeVoucherModal();

  updateCart();
}

/* ================= APPLY VOUCHER ================= */

function applyVoucherInput() {
  const code = document
    .getElementById("modalVoucherInput")
    .value.trim()
    .toUpperCase();

  if (code === "GIAM500K") {
    selectVoucher("GIAM500K", 500000);
  } else if (code === "GIAM1TR") {
    selectVoucher("GIAM1TR", 1000000);
  } else if (code === "GIAM2TR") {
    selectVoucher("GIAM2TR", 2000000);
  } else {
    alert("Voucher không hợp lệ!");
  }
}

/* ================= CLOSE MODAL WHEN CLICK OUTSIDE ================= */

document
  .getElementById("voucherModal")
  .addEventListener("click", function (event) {
    if (event.target === this) {
      closeVoucherModal();
    }
  });

/* INITIAL UPDATE */

loadCartFromStorage();
updateCart();

