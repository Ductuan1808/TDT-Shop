/**
 * =========================================================================
 * khach-hang.js - Chuyên gửi và nhận API cho phần Khách hàng Admin
 * Dùng fetch đơn giản để giao tiếp với Server
 * =========================================================================
 */

// Lấy BASE_URL từ config.js hoặc mặc định localhost:8081/TDTapi
const CUSTOMER_BASE_URL = typeof API_URL !== 'undefined' ? API_URL : 'http://localhost:8081/TDTapi';

/**
 * 1. Lấy danh sách khách hàng (có tìm kiếm, lọc theo trạng thái hoạt động và phân trang)
 * @param {Object} params - { keyword, enabled, page, size }
 * @returns {Promise<Object>} PageResponse<CustomerDTO>
 */
async function getCustomers(params = {}) {
  try {
    const cleanParams = {};
    for (const key in params) {
      if (params[key] !== '' && params[key] !== null && params[key] !== undefined) {
        cleanParams[key] = params[key];
      }
    }

    const queryString = new URLSearchParams(cleanParams).toString();
    const url = `${CUSTOMER_BASE_URL}/customers${queryString ? '?' + queryString : ''}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Không thể tải danh sách khách hàng từ máy chủ");
    }

    const result = await response.json();
    console.log("[CustomerApi] Dữ liệu khách hàng từ DB:", result);
    return result.data || { content: [], page: 1, size: 15, totalElements: 0, totalPages: 0 };
  } catch (error) {
    console.error("[CustomerApi] Lỗi getCustomers:", error);
    return { content: [], page: 1, size: 15, totalElements: 0, totalPages: 0 };
  }
}

/**
 * 2. Lấy thông tin chi tiết tài khoản khách hàng theo ID
 * @param {number|string} id - ID khách hàng
 * @returns {Promise<Object|null>} CustomerDTO
 */
async function getCustomerById(id) {
  try {
    const response = await fetch(`${CUSTOMER_BASE_URL}/customers/${id}`);
    if (!response.ok) {
      throw new Error("Không thể lấy chi tiết khách hàng");
    }

    const result = await response.json();
    console.log("[CustomerApi] Chi tiết tài khoản:", result);
    return result.data || null;
  } catch (error) {
    console.error("[CustomerApi] Lỗi getCustomerById:", error);
    return null;
  }
}

/**
 * 3. Khóa hoặc Mở khóa tài khoản khách hàng
 * @param {number|string} id - ID khách hàng
 * @param {boolean} enabled - true (mở khóa) hoặc false (khóa tài khoản)
 * @returns {Promise<Object>} ApiResponse<CustomerDTO>
 */
async function updateCustomerStatus(id, enabled) {
  try {
    const response = await fetch(`${CUSTOMER_BASE_URL}/customers/${id}/status?enabled=${enabled}`, {
      method: "PUT"
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Không thể cập nhật trạng thái tài khoản");
    }

    return result;
  } catch (error) {
    console.error("[CustomerApi] Lỗi updateCustomerStatus:", error);
    throw error;
  }
}

// Gắn vào window để gọi từ các component khác
window.CustomerApi = {
  getCustomers,
  getCustomerById,
  updateCustomerStatus
};
