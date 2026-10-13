/**
 * =========================================================================
 * don-hang.js - Chuyên gửi và nhận API cho phần Quản lý Đơn hàng Admin
 * Dùng fetch đơn giản để giao tiếp với Server
 * =========================================================================
 */

// Lấy BASE_URL từ config.js hoặc mặc định localhost:8081/TDTapi
const ORDER_BASE_URL = typeof API_URL !== 'undefined' ? API_URL : 'http://localhost:8081/TDTapi';

/**
 * 1. Lấy danh sách đơn hàng (tìm kiếm theo mã đơn/SĐT/tên, lọc trạng thái và phân trang)
 * @param {Object} params - { keyword, status, page, size }
 * @returns {Promise<Object>} PageResponse<OrderDTO>
 */
async function getOrders(params = {}) {
  try {
    const cleanParams = {};
    for (const key in params) {
      if (params[key] !== '' && params[key] !== null && params[key] !== undefined) {
        cleanParams[key] = params[key];
      }
    }

    const queryString = new URLSearchParams(cleanParams).toString();
    const url = `${ORDER_BASE_URL}/orders${queryString ? '?' + queryString : ''}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Không thể tải danh sách đơn hàng từ máy chủ");
    }

    const result = await response.json();
    return result.data || { content: [], page: 1, size: 10, totalElements: 0, totalPages: 0 };
  } catch (error) {
    console.error("[OrderApi] Lỗi getOrders:", error);
    return { content: [], page: 1, size: 10, totalElements: 0, totalPages: 0 };
  }
}

/**
 * 2. Lấy chi tiết đơn hàng theo ID
 * @param {number|string} id - ID đơn hàng
 * @returns {Promise<Object|null>} OrderDTO
 */
async function getOrderById(id) {
  try {
    const response = await fetch(`${ORDER_BASE_URL}/orders/${id}`);
    if (!response.ok) {
      throw new Error("Không thể lấy chi tiết đơn hàng");
    }

    const result = await response.json();
    return result.data || null;
  } catch (error) {
    console.error("[OrderApi] Lỗi getOrderById:", error);
    return null;
  }
}

/**
 * 3. Lấy chi tiết đơn hàng theo mã đơn
 * @param {string} orderCode
 * @returns {Promise<Object|null>} OrderDTO
 */
async function getOrderByCode(orderCode) {
  try {
    const response = await fetch(`${ORDER_BASE_URL}/orders/code/${encodeURIComponent(orderCode)}`);
    if (!response.ok) {
      throw new Error("Không tìm thấy đơn hàng mã " + orderCode);
    }

    const result = await response.json();
    return result.data || null;
  } catch (error) {
    console.error("[OrderApi] Lỗi getOrderByCode:", error);
    return null;
  }
}

/**
 * 4. Cập nhật trạng thái đơn hàng
 * @param {number|string} id - ID đơn hàng
 * @param {string} status - Trạng thái mới
 * @returns {Promise<Object>} ApiResponse<OrderDTO>
 */
async function updateOrderStatus(id, status) {
  try {
    const response = await fetch(`${ORDER_BASE_URL}/orders/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ status: status })
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Không thể cập nhật trạng thái đơn hàng");
    }
    return result;
  } catch (error) {
    console.error("[OrderApi] Lỗi updateOrderStatus:", error);
    throw error;
  }
}

/**
 * 5. Lấy danh sách các trạng thái đơn hàng từ Server
 * @returns {Promise<Array<string>>}
 */
async function getOrderStatuses() {
  try {
    const response = await fetch(`${ORDER_BASE_URL}/orders/statuses`);
    if (!response.ok) {
      throw new Error("Không thể tải danh sách trạng thái");
    }

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error("[OrderApi] Lỗi getOrderStatuses:", error);
    return ["Chờ xác nhận", "Đang chuẩn bị hàng", "Đang giao hàng", "Đã giao hàng", "Đã hủy"];
  }
}

// Xuất ra biến toàn cục OrderApi để don-hang-logic.js sử dụng
window.OrderApi = {
  getOrders: getOrders,
  getOrderById: getOrderById,
  getOrderByCode: getOrderByCode,
  updateOrderStatus: updateOrderStatus,
  getOrderStatuses: getOrderStatuses
};
