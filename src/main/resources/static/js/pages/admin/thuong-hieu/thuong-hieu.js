/**
 * =========================================================================
 * thuong-hieu.js - Chuyên gửi và nhận API cho phần Quản lý Thương hiệu Admin
 * Dùng fetch đơn giản để giao tiếp với Server
 * =========================================================================
 */

// Lấy BASE_URL từ config.js hoặc mặc định localhost:8081/TDTapi
const BRAND_BASE_URL = typeof API_URL !== 'undefined' ? API_URL : 'http://localhost:8081/TDTapi';

/**
 * 1. Lấy danh sách thương hiệu (tìm kiếm theo tên, lọc trạng thái và phân trang)
 * @param {Object} params - { keyword, status, page, size }
 * @returns {Promise<Object>} PageResponse<BrandDTO>
 */
async function getBrands(params = {}) {
  try {
    const cleanParams = {};
    for (const key in params) {
      if (params[key] !== '' && params[key] !== null && params[key] !== undefined) {
        cleanParams[key] = params[key];
      }
    }

    const queryString = new URLSearchParams(cleanParams).toString();
    const url = `${BRAND_BASE_URL}/brands${queryString ? '?' + queryString : ''}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Không thể tải danh sách thương hiệu từ máy chủ");
    }

    const result = await response.json();
    console.log("[BrandApi] Dữ liệu thương hiệu từ DB:", result);
    return result.data || { content: [], page: 1, size: 10, totalElements: 0, totalPages: 0 };
  } catch (error) {
    console.error("[BrandApi] Lỗi getBrands:", error);
    return { content: [], page: 1, size: 10, totalElements: 0, totalPages: 0 };
  }
}

/**
 * 2. Lấy chi tiết thương hiệu theo ID
 * @param {number|string} id - ID thương hiệu
 * @returns {Promise<Object|null>} BrandDTO
 */
async function getBrandById(id) {
  try {
    const response = await fetch(`${BRAND_BASE_URL}/brands/${id}`);
    if (!response.ok) {
      throw new Error("Không thể lấy chi tiết thương hiệu");
    }

    const result = await response.json();
    return result.data || null;
  } catch (error) {
    console.error("[BrandApi] Lỗi getBrandById:", error);
    return null;
  }
}

/**
 * 3. Thêm mới một thương hiệu
 * @param {Object} brandData - { name, logo, status }
 * @returns {Promise<Object>} ApiResponse<BrandDTO>
 */
async function createBrand(brandData) {
  try {
    const response = await fetch(`${BRAND_BASE_URL}/brands`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(brandData)
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Không thể tạo thương hiệu");
    }
    return result;
  } catch (error) {
    console.error("[BrandApi] Lỗi createBrand:", error);
    throw error;
  }
}

/**
 * 4. Cập nhật thông tin thương hiệu
 * @param {number|string} id - ID thương hiệu
 * @param {Object} brandData - { name, logo, status }
 * @returns {Promise<Object>} ApiResponse<BrandDTO>
 */
async function updateBrand(id, brandData) {
  try {
    const response = await fetch(`${BRAND_BASE_URL}/brands/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(brandData)
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Không thể cập nhật thương hiệu");
    }
    return result;
  } catch (error) {
    console.error("[BrandApi] Lỗi updateBrand:", error);
    throw error;
  }
}

/**
 * 5. Cập nhật trạng thái thương hiệu (ACTIVE / INACTIVE)
 * @param {number|string} id - ID thương hiệu
 * @param {string} status - 'ACTIVE' hoặc 'INACTIVE'
 * @returns {Promise<Object>} ApiResponse<BrandDTO>
 */
async function updateBrandStatus(id, status) {
  try {
    const response = await fetch(`${BRAND_BASE_URL}/brands/${id}/status?status=${status}`, {
      method: "PUT"
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Không thể đổi trạng thái thương hiệu");
    }
    return result;
  } catch (error) {
    console.error("[BrandApi] Lỗi updateBrandStatus:", error);
    throw error;
  }
}

/**
 * 6. Xóa thương hiệu theo ID
 * @param {number|string} id - ID thương hiệu
 * @returns {Promise<Object>} ApiResponse<Void>
 */
async function deleteBrand(id) {
  try {
    const response = await fetch(`${BRAND_BASE_URL}/brands/${id}`, {
      method: "DELETE"
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Không thể xóa thương hiệu");
    }
    return result;
  } catch (error) {
    console.error("[BrandApi] Lỗi deleteBrand:", error);
    throw error;
  }
}

// Gắn vào window để gọi từ thuong-hieu-logic.js
window.BrandApi = {
  getBrands,
  getBrandById,
  createBrand,
  updateBrand,
  updateBrandStatus,
  deleteBrand
};
