/**
 * =========================================================================
 * voucher.js - Chuyên gửi và nhận API cho phần Quản lý Voucher Admin
 * Dùng fetch đơn giản để giao tiếp với Server
 * =========================================================================
 */

// Lấy BASE_URL từ config.js hoặc mặc định localhost:8081/TDTapi
const VOUCHER_BASE_URL = typeof API_URL !== 'undefined' ? API_URL : 'http://localhost:8081/TDTapi';

/**
 * 1. Lấy danh sách voucher (tìm kiếm theo mã/tên, lọc trạng thái và phân trang)
 * @param {Object} params - { keyword, status, page, size }
 * @returns {Promise<Object>} PageResponse<VoucherDTO>
 */
async function getVouchers(params = {}) {
  try {
    const cleanParams = {};
    for (const key in params) {
      if (params[key] !== '' && params[key] !== null && params[key] !== undefined) {
        cleanParams[key] = params[key];
      }
    }

    const queryString = new URLSearchParams(cleanParams).toString();
    const url = `${VOUCHER_BASE_URL}/vouchers${queryString ? '?' + queryString : ''}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Không thể tải danh sách voucher từ máy chủ");
    }

    const result = await response.json();
    return result.data || { content: [], page: 1, size: 10, totalElements: 0, totalPages: 0 };
  } catch (error) {
    console.error("[VoucherApi] Lỗi getVouchers:", error);
    return { content: [], page: 1, size: 10, totalElements: 0, totalPages: 0 };
  }
}

/**
 * 2. Lấy chi tiết voucher theo ID
 * @param {number|string} id - ID voucher
 * @returns {Promise<Object|null>} VoucherDTO
 */
async function getVoucherById(id) {
  try {
    const response = await fetch(`${VOUCHER_BASE_URL}/vouchers/${id}`);
    if (!response.ok) {
      throw new Error("Không thể lấy chi tiết voucher");
    }

    const result = await response.json();
    return result.data || null;
  } catch (error) {
    console.error("[VoucherApi] Lỗi getVoucherById:", error);
    return null;
  }
}

/**
 * 3. Thêm mới một voucher
 * @param {Object} voucherData - { code, name, discountAmount, minOrderAmount, startDate, endDate, quantity, status }
 * @returns {Promise<Object>} ApiResponse<VoucherDTO>
 */
async function createVoucher(voucherData) {
  try {
    const response = await fetch(`${VOUCHER_BASE_URL}/vouchers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(voucherData)
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Không thể tạo voucher");
    }
    return result;
  } catch (error) {
    console.error("[VoucherApi] Lỗi createVoucher:", error);
    throw error;
  }
}

/**
 * 4. Cập nhật thông tin voucher
 * @param {number|string} id - ID voucher
 * @param {Object} voucherData
 * @returns {Promise<Object>} ApiResponse<VoucherDTO>
 */
async function updateVoucher(id, voucherData) {
  try {
    const response = await fetch(`${VOUCHER_BASE_URL}/vouchers/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(voucherData)
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Không thể cập nhật voucher");
    }
    return result;
  } catch (error) {
    console.error("[VoucherApi] Lỗi updateVoucher:", error);
    throw error;
  }
}

/**
 * 5. Chuyển đổi trạng thái voucher (Ẩn <-> Hiện)
 * @param {number|string} id - ID voucher
 * @returns {Promise<Object>} ApiResponse<VoucherDTO>
 */
async function toggleVoucherStatus(id) {
  try {
    const response = await fetch(`${VOUCHER_BASE_URL}/vouchers/${id}/toggle-status`, {
      method: "PUT"
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Không thể đổi trạng thái voucher");
    }
    return result;
  } catch (error) {
    console.error("[VoucherApi] Lỗi toggleVoucherStatus:", error);
    throw error;
  }
}

// Xuất ra biến toàn cục VoucherApi để voucher-logic.js sử dụng
window.VoucherApi = {
  getVouchers: getVouchers,
  getVoucherById: getVoucherById,
  createVoucher: createVoucher,
  updateVoucher: updateVoucher,
  toggleVoucherStatus: toggleVoucherStatus
};
