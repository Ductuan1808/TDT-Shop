/**
 * =========================================================================
 * danh-muc.js - Chuyên gửi và nhận API cho phần Quản lý Danh mục Admin
 * Dùng fetch đơn giản để giao tiếp với Server
 * =========================================================================
 */

// Lấy BASE_URL từ config.js hoặc mặc định localhost:8081/TDTapi
const CATEGORY_BASE_URL = typeof API_URL !== 'undefined' ? API_URL : 'http://localhost:8081/TDTapi';

/**
 * 1. Lấy danh sách danh mục có phân trang, tìm kiếm và lọc
 * @param {Object} params - { keyword, parentType, parentId, status, page, size }
 * @returns {Promise<Object>} PageResponse<CategoryDTO>
 */
async function getCategories(params = {}) {
  try {
    const cleanParams = {};
    for (const key in params) {
      if (params[key] !== '' && params[key] !== null && params[key] !== undefined) {
        cleanParams[key] = params[key];
      }
    }

    const queryString = new URLSearchParams(cleanParams).toString();
    const url = `${CATEGORY_BASE_URL}/categories${queryString ? '?' + queryString : ''}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Không thể tải danh sách danh mục từ máy chủ");
    }

    const result = await response.json();
    return result.data || { content: [], page: 1, size: 10, totalElements: 0, totalPages: 0 };
  } catch (error) {
    console.error("[CategoryApi] Lỗi getCategories:", error);
    return { content: [], page: 1, size: 10, totalElements: 0, totalPages: 0 };
  }
}


/**
 * 3. Lấy các danh mục cha (danh mục gốc)
 * @returns {Promise<Array>} List<CategoryDTO>
 */
async function getParentCategories() {
  try {
    const response = await fetch(`${CATEGORY_BASE_URL}/categories/parents`);
    if (!response.ok) {
      throw new Error("Không thể tải danh mục cha");
    }

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error("[CategoryApi] Lỗi getParentCategories:", error);
    return [];
  }
}

/**
 * 4. Lấy chi tiết danh mục theo ID
 * @param {number|string} id
 * @returns {Promise<Object|null>} CategoryDTO
 */
async function getCategoryById(id) {
  try {
    const response = await fetch(`${CATEGORY_BASE_URL}/categories/${id}`);
    if (!response.ok) {
      throw new Error("Không thể lấy chi tiết danh mục");
    }

    const result = await response.json();
    return result.data || null;
  } catch (error) {
    console.error("[CategoryApi] Lỗi getCategoryById:", error);
    return null;
  }
}

/**
 * 5. Thêm mới danh mục
 * @param {Object} catData - { name, parentId, description, status, showOnHome, showOnMenu }
 * @returns {Promise<Object>} ApiResponse<CategoryDTO>
 */
async function createCategory(catData) {
  try {
    const response = await fetch(`${CATEGORY_BASE_URL}/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(catData)
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Không thể tạo danh mục");
    }
    return result;
  } catch (error) {
    console.error("[CategoryApi] Lỗi createCategory:", error);
    throw error;
  }
}

/**
 * 6. Cập nhật thông tin danh mục
 * @param {number|string} id
 * @param {Object} catData
 * @returns {Promise<Object>} ApiResponse<CategoryDTO>
 */
async function updateCategory(id, catData) {
  try {
    const response = await fetch(`${CATEGORY_BASE_URL}/categories/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(catData)
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Không thể cập nhật danh mục");
    }
    return result;
  } catch (error) {
    console.error("[CategoryApi] Lỗi updateCategory:", error);
    throw error;
  }
}

/**
 * 7. Cập nhật trạng thái ẩn/hiện danh mục (ACTIVE / INACTIVE)
 * @param {number|string} id
 * @param {string} status - 'ACTIVE' hoặc 'INACTIVE'
 * @returns {Promise<Object>} ApiResponse<CategoryDTO>
 */
async function updateCategoryStatus(id, status) {
  try {
    const response = await fetch(`${CATEGORY_BASE_URL}/categories/${id}/status?status=${status}`, {
      method: "PUT"
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Không thể đổi trạng thái danh mục");
    }
    return result;
  } catch (error) {
    console.error("[CategoryApi] Lỗi updateCategoryStatus:", error);
    throw error;
  }
}

/**
 * 8. Bật/tắt nhanh hiển thị Trang chủ
 * @param {number|string} id
 * @returns {Promise<Object>}
 */
async function toggleShowOnHome(id) {
  try {
    const response = await fetch(`${CATEGORY_BASE_URL}/categories/${id}/toggle-home`, {
      method: "PUT"
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Không thể cập nhật hiển thị trang chủ");
    }
    return result;
  } catch (error) {
    console.error("[CategoryApi] Lỗi toggleShowOnHome:", error);
    throw error;
  }
}

/**
 * 9. Bật/tắt nhanh hiển thị Menu
 * @param {number|string} id
 * @returns {Promise<Object>}
 */
async function toggleShowOnMenu(id) {
  try {
    const response = await fetch(`${CATEGORY_BASE_URL}/categories/${id}/toggle-menu`, {
      method: "PUT"
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Không thể cập nhật hiển thị menu");
    }
    return result;
  } catch (error) {
    console.error("[CategoryApi] Lỗi toggleShowOnMenu:", error);
    throw error;
  }
}

// Gắn vào window để gọi từ danh-muc-logic.js
window.CategoryApi = {
  getCategories,
  getParentCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  updateCategoryStatus,
  toggleShowOnHome,
  toggleShowOnMenu
};
