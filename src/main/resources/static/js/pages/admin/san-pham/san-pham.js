/**
 * san-pham.js - Chuyên gửi và nhận API cho màn hình Quản lý Sản phẩm Admin
 * Dùng fetch đơn giản để gọi các API từ Server
 */

// Đảm bảo có API_URL từ config.js
const BASE_URL = typeof API_URL !== 'undefined' ? API_URL : 'http://localhost:8081/TDTapi';

/**
 * 1. Lấy danh sách sản phẩm (có kèm tìm kiếm, lọc theo loại, thương hiệu, danh mục, trạng thái)
 */
async function getProducts(params = {}) {
  try {
    // Lọc bỏ các param rỗng
    const cleanParams = {};
    Object.keys(params).forEach((key) => {
      if (params[key] !== '' && params[key] !== null && params[key] !== undefined) {
        cleanParams[key] = params[key];
      }
    });

    const queryString = new URLSearchParams(cleanParams).toString();
    const url = `${BASE_URL}/products${queryString ? '?' + queryString : ''}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Không thể lấy sản phẩm");
    }
    const result = await response.json();
    console.log("Dữ liệu phân trang sản phẩm từ DB:", result);
    return result.data || { content: [], page: 1, size: 15, totalElements: 0, totalPages: 0 };
  } catch (error) {
    console.log("Lỗi getProducts:", error);
    return { content: [], page: 1, size: 15, totalElements: 0, totalPages: 0 };
  }
}

/**
 * 2. Lấy danh sách thương hiệu phục vụ bộ lọc và form sản phẩm
 */
async function getProductBrands() {
  try {
    const response = await fetch(`${BASE_URL}/products/brands`);
    if (!response.ok) {
      throw new Error("Không thể lấy danh sách thương hiệu");
    }
    const result = await response.json();
    console.log("Danh sách thương hiệu từ DB:", result);
    return result.data || [];
  } catch (error) {
    console.log("Lỗi getProductBrands:", error);
    return [];
  }
}

/**
 * 3. Lấy danh sách danh mục phục vụ bộ lọc và form sản phẩm
 */
async function getProductCategories() {
  try {
    const response = await fetch(`${BASE_URL}/products/categories`);
    if (!response.ok) {
      throw new Error("Không thể lấy danh sách danh mục");
    }
    const result = await response.json();
    console.log("Danh sách danh mục từ DB:", result);
    return result.data || [];
  } catch (error) {
    console.log("Lỗi getProductCategories:", error);
    return [];
  }
}

/**
 * 4. Lấy chi tiết một sản phẩm theo ID
 */
async function getProductById(id) {
  try {
    const response = await fetch(`${BASE_URL}/products/${id}`);
    if (!response.ok) {
      throw new Error("Không thể lấy chi tiết sản phẩm");
    }
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.log("Lỗi getProductById:", error);
    return null;
  }
}

/**
 * 5. Thêm mới một sản phẩm
 */
async function createProduct(productData) {
  try {
    const response = await fetch(`${BASE_URL}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(productData)
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Không thể tạo sản phẩm");
    }
    return result;
  } catch (error) {
    console.log("Lỗi createProduct:", error);
    throw error;
  }
}

/**
 * 6. Cập nhật sản phẩm
 */
async function updateProduct(id, productData) {
  try {
    const response = await fetch(`${BASE_URL}/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(productData)
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Không thể cập nhật sản phẩm");
    }
    return result;
  } catch (error) {
    console.log("Lỗi updateProduct:", error);
    throw error;
  }
}

/**
 * 7. Xóa sản phẩm theo ID
 */
async function deleteProduct(id) {
  try {
    const response = await fetch(`${BASE_URL}/products/${id}`, {
      method: "DELETE"
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Không thể xóa sản phẩm");
    }
    return result;
  } catch (error) {
    console.log("Lỗi deleteProduct:", error);
    throw error;
  }
}

// Gắn vào window để san-pham-logic.js và các file khác sử dụng
window.ProductApi = {
  getProducts,
  getProductBrands,
  getProductCategories,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
