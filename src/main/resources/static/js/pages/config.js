/**
 * =========================================================================
 * config.js - Cấu hình hệ thống & Từ điển Việt hóa dùng chung (TDT_DICTIONARY)
 * TDT Shop - Đồ án tốt nghiệp
 * =========================================================================
 */
const API_URL = "http://localhost:8081/TDTapi";

/**
 * Định dạng tiền tệ VNĐ chuẩn Việt Nam
 * @param {number|string} amount
 * @returns {string}
 */
function formatVND(amount) {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat("vi-VN").format(num) + " VNĐ";
}

/**
 * MODULE VIỆT HÓA ĐA DỤNG (TDT_DICTIONARY)
 * Dùng chung cho toàn bộ dự án (Admin & Client: Danh sách sản phẩm, Giỏ hàng, Đơn hàng, Thống kê, PC Builder...)
 */
const TDT_DICTIONARY = {
  // 1. Phân loại sản phẩm cha (Product Types)
  PRODUCT_TYPES: {
    PC: "Máy tính để bàn (PC)",
    COMPONENT: "Linh kiện máy tính",
    ACCESSORY: "Phụ kiện máy tính"
  },

  PRODUCT_TYPES_SHORT: {
    PC: "Máy tính PC",
    COMPONENT: "Linh kiện",
    ACCESSORY: "Phụ kiện"
  },

  // 2. Phân loại linh kiện chi tiết (Component Types)
  COMPONENT_TYPES: {
    CPU: "Bộ vi xử lý (CPU)",
    GPU: "Card màn hình (VGA / GPU)",
    MAINBOARD: "Bo mạch chủ (Mainboard)",
    RAM: "Bộ nhớ trong (RAM)",
    SSD: "Ổ cứng thể rắn (SSD)",
    HDD: "Ổ cứng cơ (HDD)",
    PSU: "Nguồn máy tính (PSU)",
    CASE: "Vỏ máy tính (Case)",
    COOLER: "Tản nhiệt máy tính (Cooler)"
  },

  COMPONENT_TYPES_SHORT: {
    CPU: "CPU",
    GPU: "VGA / GPU",
    MAINBOARD: "Mainboard",
    RAM: "RAM",
    SSD: "SSD",
    HDD: "HDD",
    PSU: "Nguồn (PSU)",
    CASE: "Vỏ Case",
    COOLER: "Tản nhiệt"
  },

  // 3. Phân loại phụ kiện chi tiết (Accessory Types)
  ACCESSORY_TYPES: {
    MONITOR: "Màn hình máy tính",
    KEYBOARD: "Bàn phím máy tính",
    MOUSE: "Chuột máy tính",
    HEADSET: "Tai nghe máy tính",
    SPEAKER: "Loa máy tính"
  },

  ACCESSORY_TYPES_SHORT: {
    MONITOR: "Màn hình",
    KEYBOARD: "Bàn phím",
    MOUSE: "Chuột",
    HEADSET: "Tai nghe",
    SPEAKER: "Loa"
  },

  // 4. Trạng thái bán sản phẩm (Product Status)
  STATUS: {
    ACTIVE: "Đang bán",
    OUT_OF_STOCK: "Hết hàng",
    INACTIVE: "Tạm ẩn"
  },

  // 5. Tiêu đề khối thông số kỹ thuật (Specs Titles)
  SPECS_TITLES: {
    CPU: "Thông số Bộ vi xử lý (CPU)",
    GPU: "Thông số Card màn hình (VGA / GPU)",
    MAINBOARD: "Thông số Bo mạch chủ (Mainboard)",
    RAM: "Thông số Bộ nhớ trong (RAM)",
    SSD: "Thông số Ổ cứng thể rắn (SSD)",
    HDD: "Thông số Ổ cứng cơ (HDD)",
    PSU: "Thông số Nguồn máy tính (PSU)",
    CASE: "Thông số Vỏ máy tính (Case)",
    COOLER: "Thông số Tản nhiệt máy tính (Cooler)",
    MONITOR: "Thông số Màn hình máy tính",
    KEYBOARD: "Thông số Bàn phím máy tính",
    MOUSE: "Thông số Chuột máy tính",
    HEADSET: "Thông số Tai nghe máy tính",
    SPEAKER: "Thông số Loa máy tính"
  },

  // ==================== CÁC HÀM TIỆN ÍCH DÙNG CHUNG ====================

  /**
   * Tự động nhận diện phân loại chi tiết (CPU, GPU, MONITOR, v.v.) dựa trên specs nếu DB chưa lưu type chi tiết
   * @param {object} p
   * @returns {string|null}
   */
  detectDetailType: function (p) {
    if (!p) return null;
    if (p.componentType) return String(p.componentType).trim().toUpperCase();
    if (p.accessoryType) return String(p.accessoryType).trim().toUpperCase();

    // Tự động nhận diện qua specs nếu accessoryType hoặc componentType bị rỗng
    if (p.cpuSpecs) return 'CPU';
    if (p.gpuSpecs) return 'GPU';
    if (p.motherboardSpecs) return 'MAINBOARD';
    if (p.ramSpecs) return 'RAM';
    if (p.ssdSpecs) return 'SSD';
    if (p.hddSpecs) return 'HDD';
    if (p.psuSpecs) return 'PSU';
    if (p.caseSpecs) return 'CASE';
    if (p.coolerSpecs) return 'COOLER';

    const spec = p.specData || {};
    if (p.monitorSpecs || spec.screenSizeInch !== undefined || spec.resolution !== undefined) return 'MONITOR';
    if (p.keyboardSpecs || spec.keyboardType !== undefined || spec.switchType !== undefined) return 'KEYBOARD';
    if (p.mouseSpecs || spec.dpiMax !== undefined || spec.sensor !== undefined) return 'MOUSE';
    if (p.headsetSpecs || spec.headsetType !== undefined || spec.driverSizeMm !== undefined) return 'HEADSET';
    if (p.speakerSpecs || spec.speakerType !== undefined || spec.powerWatt !== undefined) return 'SPEAKER';

    return null;
  },

  /**
   * Lấy tên tiếng Việt của loại sản phẩm cha (Tuyệt đối không trả về tiếng Anh)
   * @param {string} type - 'PC', 'COMPONENT', 'ACCESSORY'
   * @param {boolean} short - true: lấy tên rút gọn
   */
  getTextProductType: function (type, short = false) {
    if (!type) return "Khác";
    const u = String(type).trim().toUpperCase();
    const dict = short ? this.PRODUCT_TYPES_SHORT : this.PRODUCT_TYPES;
    if (dict[u]) return dict[u];
    if (u === "ACCESSORY" || u.includes("PHỤ KIỆN")) return short ? "Phụ kiện" : "Phụ kiện máy tính";
    if (u === "COMPONENT" || u.includes("LINH KIỆN")) return short ? "Linh kiện" : "Linh kiện máy tính";
    if (u === "PC" || u.includes("MÁY TÍNH")) return short ? "Máy tính PC" : "Máy tính để bàn (PC)";
    return short ? "Phụ kiện" : "Phụ kiện máy tính";
  },

  /**
   * Lấy tên tiếng Việt của loại linh kiện
   * @param {string} compType - 'CPU', 'GPU', 'MAINBOARD', ...
   * @param {boolean} short
   */
  getTextComponentType: function (compType, short = false) {
    if (!compType) return "";
    const u = String(compType).trim().toUpperCase();
    const dict = short ? this.COMPONENT_TYPES_SHORT : this.COMPONENT_TYPES;
    return dict[u] || compType;
  },

  /**
   * Lấy tên tiếng Việt của loại phụ kiện
   * @param {string} accType - 'MONITOR', 'KEYBOARD', 'MOUSE', ...
   * @param {boolean} short
   */
  getTextAccessoryType: function (accType, short = false) {
    if (!accType) return "";
    const u = String(accType).trim().toUpperCase();
    const dict = short ? this.ACCESSORY_TYPES_SHORT : this.ACCESSORY_TYPES;
    return dict[u] || accType;
  },

  /**
   * Lấy tên tiếng Việt phân loại chi tiết của một sản phẩm bất kỳ
   * @param {object} p - Đối tượng sản phẩm
   * @param {boolean} short
   */
  getTextDetailType: function (p, short = false) {
    if (!p) return "-";
    const sub = this.detectDetailType(p);
    if (!sub) {
      const parentU = String(p.productType || '').trim().toUpperCase();
      if (parentU === "PC") {
        return short ? "Máy tính PC" : "Máy tính để bàn (PC)";
      }
      return "-";
    }
    if (this.COMPONENT_TYPES[sub]) {
      return this.getTextComponentType(sub, short);
    }
    if (this.ACCESSORY_TYPES[sub]) {
      return this.getTextAccessoryType(sub, short);
    }
    return sub;
  },

  /**
   * Lấy tên tiếng Việt của trạng thái
   * @param {string} status - 'ACTIVE', 'OUT_OF_STOCK', 'INACTIVE'
   */
  getTextStatus: function (status) {
    if (!status) return "Đang bán";
    const u = String(status).trim().toUpperCase();
    return this.STATUS[u] || status;
  },

  /**
   * Lấy tiêu đề khối thông số chi tiết
   * @param {string} subType - 'CPU', 'MONITOR', ...
   */
  getSpecsTitle: function (subType) {
    if (!subType) return "Thông số kỹ thuật chi tiết";
    const u = String(subType).trim().toUpperCase();
    return this.SPECS_TITLES[u] || "Thông số kỹ thuật chi tiết";
  },

  /**
   * Sinh HTML nhãn trạng thái (Badge) chuẩn giao diện
   * @param {string} status
   */
  getStatusBadgeHtml: function (status) {
    const s = String(status || "ACTIVE").trim().toUpperCase();
    if (s === "ACTIVE") {
      return '<span class="badge badge-success">Đang bán</span>';
    } else if (s === "OUT_OF_STOCK") {
      return '<span class="badge badge-warning">Hết hàng</span>';
    } else if (s === "INACTIVE") {
      return '<span class="badge badge-danger">Tạm ẩn</span>';
    }
    return `<span class="badge badge-success">Đang bán</span>`;
  },

  /**
   * Sinh HTML nhãn loại sản phẩm + phân loại chi tiết (Badge) hoàn toàn bằng tiếng Việt 100%
   * @param {object} p
   */
  getTypeBadgeHtml: function (p) {
    if (!p) return '<span class="badge" style="background:#e0f2fe; color:#0369a1; font-weight:600;">Khác</span>';

    const parentText = this.getTextProductType(p.productType, true);
    let html = `<span class="badge" style="background:#e0f2fe; color:#0369a1; font-weight:600;">${parentText}</span>`;

    const detailText = this.getTextDetailType(p, true);
    const parentU = String(p.productType || '').trim().toUpperCase();
    if (detailText && detailText !== "-" && parentU !== "PC") {
      html += `<span class="badge" style="background:#f1f5f9; color:#334155; margin-left:4px; font-weight:600;">${detailText}</span>`;
    }
    return html;
  }
};

// Đăng ký toàn cục vào window
if (typeof window !== "undefined") {
  window.TDT_DICTIONARY = TDT_DICTIONARY;
}