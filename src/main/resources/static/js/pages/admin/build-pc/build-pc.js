/**
 * =========================================================================
 * build-pc.js - Chuyên gửi và nhận API cho phần Quản lý Build PC Admin
 * Dùng fetch đơn giản để giao tiếp với Server
 * =========================================================================
 */

// Lấy BASE_URL từ config.js hoặc mặc định localhost:8081/TDTapi
const BUILD_PC_BASE_URL = typeof API_URL !== 'undefined' ? API_URL : 'http://localhost:8081/TDTapi';

/**
 * 1. Lấy danh sách PC cấu hình sẵn (tìm kiếm, lọc trạng thái và phân trang)
 * @param {Object} params - { keyword, status, page, size }
 * @returns {Promise<Object>} PageResponse<PcBuildDTO>
 */
async function getPcBuilds(params = {}) {
  try {
    const cleanParams = {};
    for (const key in params) {
      if (params[key] !== '' && params[key] !== null && params[key] !== undefined) {
        cleanParams[key] = params[key];
      }
    }

    const queryString = new URLSearchParams(cleanParams).toString();
    const url = `${BUILD_PC_BASE_URL}/pc-builds${queryString ? '?' + queryString : ''}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Không thể tải danh sách cấu hình PC");
    }

    const result = await response.json();
    return result.data || { content: [], page: 1, size: 10, totalElements: 0, totalPages: 0 };
  } catch (error) {
    console.error("[BuildPcApi] Lỗi getPcBuilds:", error);
    return { content: [], page: 1, size: 10, totalElements: 0, totalPages: 0 };
  }
}

/**
 * 2. Lấy chi tiết cấu hình PC theo ID
 * @param {number|string} id - ID pc build
 * @returns {Promise<Object|null>} PcBuildDTO
 */
async function getPcBuildById(id) {
  try {
    const response = await fetch(`${BUILD_PC_BASE_URL}/pc-builds/${id}`);
    if (!response.ok) {
      throw new Error("Không thể lấy chi tiết cấu hình PC");
    }

    const result = await response.json();
    return result.data || null;
  } catch (error) {
    console.error("[BuildPcApi] Lỗi getPcBuildById:", error);
    return null;
  }
}

/**
 * 3. Module kiểm tra tính hợp lệ và độ tương thích giữa 8 linh kiện chính và 1 phụ kiện màn hình
 * @param {Object} buildDTO - PcBuildDTO chứa mảng components: [{ componentType, componentProductId, quantity }]
 * @returns {Promise<Object>} { success, message, data: errorsList }
 */
async function checkPcCompatibility(buildDTO) {
  try {
    const response = await fetch(`${BUILD_PC_BASE_URL}/pc-builds/check-compatibility`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(buildDTO)
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("[BuildPcApi] Lỗi checkPcCompatibility:", error);
    return {
      success: false,
      message: "Không thể kết nối đến máy chủ để kiểm tra tương thích!",
      data: ["Lỗi mạng hoặc máy chủ không phản hồi khi kiểm tra tương thích!"]
    };
  }
}

/**
 * 4. Tạo mới cấu hình PC (sử dụng PcBuildDTO và pc_build_components)
 * @param {Object} buildDTO - PcBuildDTO
 * @returns {Promise<Object>} { success, message, data }
 */
async function createPcBuild(buildDTO) {
  try {
    const response = await fetch(`${BUILD_PC_BASE_URL}/pc-builds`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(buildDTO)
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("[BuildPcApi] Lỗi createPcBuild:", error);
    return { success: false, message: "Lỗi kết nối máy chủ khi tạo cấu hình PC" };
  }
}

/**
 * 5. Cập nhật cấu hình PC
 * @param {number|string} id
 * @param {Object} buildDTO - PcBuildDTO
 * @returns {Promise<Object>} { success, message, data }
 */
async function updatePcBuild(id, buildDTO) {
  try {
    const response = await fetch(`${BUILD_PC_BASE_URL}/pc-builds/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(buildDTO)
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("[BuildPcApi] Lỗi updatePcBuild:", error);
    return { success: false, message: "Lỗi kết nối máy chủ khi cập nhật cấu hình PC" };
  }
}

/**
 * 6. Bật/Tắt trạng thái hoạt động của dàn PC (ACTIVE / INACTIVE)
 * @param {number|string} id
 * @returns {Promise<Object>} { success, message }
 */
async function togglePcBuildStatus(id) {
  try {
    const response = await fetch(`${BUILD_PC_BASE_URL}/pc-builds/${id}/toggle-status`, {
      method: 'PUT'
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("[BuildPcApi] Lỗi togglePcBuildStatus:", error);
    return { success: false, message: "Lỗi kết nối máy chủ khi đổi trạng thái" };
  }
}

/**
 * 7. Lấy danh sách linh kiện theo loại (CPU, MAINBOARD, RAM, GPU, SSD, PSU, CASE, COOLER, MONITOR)
 * @param {string} type
 * @returns {Promise<Array>} List<ComponentProductDTO>
 */
async function getComponentsByType(type) {
  try {
    const response = await fetch(`${BUILD_PC_BASE_URL}/pc-builds/components/${type}`);
    if (!response.ok) {
      throw new Error(`Không thể lấy danh sách linh kiện ${type}`);
    }

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error(`[BuildPcApi] Lỗi getComponentsByType(${type}):`, error);
    return [];
  }
}

/**
 * 8. Lấy danh sách sản phẩm PC đại diện (product_type = 'PC')
 * @returns {Promise<Array>} List<ComponentProductDTO>
 */
async function getPcProducts() {
  try {
    const response = await fetch(`${BUILD_PC_BASE_URL}/pc-builds/pc-products`);
    if (!response.ok) {
      throw new Error("Không thể lấy danh sách sản phẩm PC");
    }

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error("[BuildPcApi] Lỗi getPcProducts:", error);
    return [];
  }
}

// Xuất các hàm ra phạm vi toàn cục
window.BuildPcApi = {
  getPcBuilds,
  getPcBuildById,
  checkPcCompatibility,
  createPcBuild,
  updatePcBuild,
  togglePcBuildStatus,
  getComponentsByType,
  getPcProducts
};
