/**
 * san-pham-logic.js - Xử lý logic giao diện, mở/đóng modal, specs động, nạp dữ liệu từ DB, check nhập liệu
 */

(function () {
  'use strict';

  // Module từ điển Việt hóa đa dụng dùng an toàn ngay cả khi config.js bị trình duyệt lưu cache cũ
  const TDT_DICT = window.TDT_DICTIONARY || {
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
      PSU: "Nguồn",
      CASE: "Vỏ Case",
      COOLER: "Tản nhiệt"
    },
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
    STATUS: {
      ACTIVE: "Đang bán",
      OUT_OF_STOCK: "Hết hàng",
      INACTIVE: "Tạm ẩn"
    },
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
    detectDetailType: function (p) {
      if (!p) return null;
      if (p.componentType) return String(p.componentType).trim().toUpperCase();
      if (p.accessoryType) return String(p.accessoryType).trim().toUpperCase();
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
    getTextComponentType: function (compType, short = false) {
      if (!compType) return "";
      const u = String(compType).trim().toUpperCase();
      const dict = short ? this.COMPONENT_TYPES_SHORT : this.COMPONENT_TYPES;
      return dict[u] || compType;
    },
    getTextAccessoryType: function (accType, short = false) {
      if (!accType) return "";
      const u = String(accType).trim().toUpperCase();
      const dict = short ? this.ACCESSORY_TYPES_SHORT : this.ACCESSORY_TYPES;
      return dict[u] || accType;
    },
    getTextDetailType: function (p, short = false) {
      if (!p) return "-";
      const sub = this.detectDetailType(p);
      if (!sub) {
        const parentU = String(p.productType || '').trim().toUpperCase();
        if (parentU === "PC") return short ? "Máy tính PC" : "Máy tính để bàn (PC)";
        return "-";
      }
      if (this.COMPONENT_TYPES[sub]) return this.getTextComponentType(sub, short);
      if (this.ACCESSORY_TYPES[sub]) return this.getTextAccessoryType(sub, short);
      return sub;
    },
    getTextStatus: function (status) {
      if (!status) return "Đang bán";
      const u = String(status).trim().toUpperCase();
      return this.STATUS[u] || "Đang bán";
    },
    getSpecsTitle: function (subType) {
      if (!subType) return "Thông số kỹ thuật chi tiết";
      const u = String(subType).trim().toUpperCase();
      return this.SPECS_TITLES[u] || "Thông số kỹ thuật chi tiết";
    },
    getStatusBadgeHtml: function (status) {
      const s = String(status || "ACTIVE").trim().toUpperCase();
      if (s === "ACTIVE") return '<span class="badge badge-success">Đang bán</span>';
      if (s === "OUT_OF_STOCK") return '<span class="badge badge-warning">Hết hàng</span>';
      if (s === "INACTIVE") return '<span class="badge badge-danger">Tạm ẩn</span>';
      return '<span class="badge badge-success">Đang bán</span>';
    },
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
  window.TDT_DICTIONARY = TDT_DICT;

  const SanPhamLogic = {
    products: [],      // Danh sách sản phẩm trang hiện tại
    brands: [],        // Danh sách thương hiệu từ DB
    categories: [],    // Danh sách thể loại cha từ DB (PC, Linh kiện, Phụ kiện)
    images: [],        // Danh sách ảnh đang chọn trong modal (tối đa 6)
    currentPage: 1,    // Trang hiện tại (bắt đầu từ 1)
    pageSize: 15,      // Tối đa 15 sản phẩm mỗi trang theo yêu cầu
    totalPages: 1,     // Tổng số trang
    totalElements: 0,  // Tổng số lượng sản phẩm
    searchTimeout: null,

    /**
     * Khởi tạo giao diện khi màn Sản phẩm được nạp
     */
    init: function () {
      this.bindBackdropClose();
      this.calculateSalePrice();
      this.renderDynamicSpecsForm();

      // Nạp dữ liệu ban đầu từ DB qua API
      this.loadBrands();
      this.loadCategories();
      this.loadProducts();
    },

    /**
     * Bắt sự kiện đóng modal khi click ra ngoài backdrop hoặc ấn Esc
     */
    bindBackdropClose: function () {
      ['product-modal', 'product-detail-modal'].forEach((id) => {
        const modal = document.getElementById(id);
        if (modal) {
          modal.onclick = (e) => {
            if (e.target === modal) {
              this.closeModal();
              this.closeDetailModal();
            }
          };
        }
      });

      if (!this._hasEscBound) {
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') {
            this.closeModal();
            this.closeDetailModal();
          }
        });
        this._hasEscBound = true;
      }
    },

    /**
     * Ánh xạ tên thể loại cha sang mã loại sản phẩm (PC, COMPONENT, ACCESSORY)
     */
    mapCategoryToProductType: function (name) {
      if (!name) return 'COMPONENT';
      const n = name.toLowerCase();
      if (n.includes('pc') || n.includes('máy tính')) return 'PC';
      if (n.includes('linh kiện')) return 'COMPONENT';
      if (n.includes('phụ kiện')) return 'ACCESSORY';
      return name.toUpperCase();
    },

    /**
     * 1. Nạp danh sách thương hiệu từ DB lên bộ lọc và form
     */
    loadBrands: async function () {
      if (!window.ProductApi?.getProductBrands) return;
      try {
        const brands = await window.ProductApi.getProductBrands();
        this.brands = brands || [];

        // Đổ vào bộ lọc thương hiệu
        const filterBrand = document.getElementById('prod-filter-brand');
        if (filterBrand) {
          let optionsHtml = '<option value="">Tất cả thương hiệu</option>';
          this.brands.forEach((b) => {
            optionsHtml += `<option value="${b.id}">${b.name}</option>`;
          });
          filterBrand.innerHTML = optionsHtml;
        }

        // Đổ vào select thương hiệu trong modal form
        const formBrand = document.getElementById('prod-brand');
        if (formBrand) {
          let optionsHtml = '<option value="">-- Chọn thương hiệu --</option>';
          this.brands.forEach((b) => {
            optionsHtml += `<option value="${b.id}">${b.name}</option>`;
          });
          formBrand.innerHTML = optionsHtml;
        }
      } catch (err) {
        console.error('[SanPhamLogic] Lỗi tải thương hiệu:', err);
      }
    },

    /**
     * 2. Nạp danh sách thể loại cha (PC, Linh kiện, Phụ kiện) từ DB lên select Loại sản phẩm
     */
    loadCategories: async function () {
      if (!window.ProductApi?.getProductCategories) return;
      try {
        const parentCategories = await window.ProductApi.getProductCategories();
        this.categories = parentCategories || [];

        // Đổ vào bộ lọc Loại sản phẩm (#prod-filter-type)
        const filterType = document.getElementById('prod-filter-type');
        if (filterType) {
          let optionsHtml = '<option value="">Tất cả loại sản phẩm</option>';
          if (this.categories.length > 0) {
            this.categories.forEach((c) => {
              const val = this.mapCategoryToProductType(c.name);
              const label = window.TDT_DICTIONARY ? window.TDT_DICTIONARY.getTextProductType(val) : c.name;
              optionsHtml += `<option value="${val}">${label}</option>`;
            });
          } else {
            optionsHtml += `
              <option value="PC">Máy tính để bàn (PC)</option>
              <option value="COMPONENT">Linh kiện máy tính</option>
              <option value="ACCESSORY">Phụ kiện máy tính</option>
            `;
          }
          filterType.innerHTML = optionsHtml;
        }

        // Đổ vào select Loại sản phẩm trong modal form (#prod-type)
        const formType = document.getElementById('prod-type');
        if (formType) {
          let optionsHtml = '<option value="">-- Chọn loại sản phẩm --</option>';
          if (this.categories.length > 0) {
            this.categories.forEach((c) => {
              const val = this.mapCategoryToProductType(c.name);
              const label = window.TDT_DICTIONARY ? window.TDT_DICTIONARY.getTextProductType(val) : c.name;
              optionsHtml += `<option value="${val}">${label}</option>`;
            });
          } else {
            optionsHtml += `
              <option value="PC">Máy tính để bàn (PC)</option>
              <option value="COMPONENT">Linh kiện máy tính</option>
              <option value="ACCESSORY">Phụ kiện máy tính</option>
            `;
          }
          formType.innerHTML = optionsHtml;
        }
      } catch (err) {
        console.error('[SanPhamLogic] Lỗi tải thể loại cha:', err);
      }
    },

    /**
     * 3. Lấy tham số lọc hiện tại và nạp danh sách sản phẩm từ DB có phân trang
     */
    loadProducts: async function (page = 1) {
      if (!window.ProductApi?.getProducts) return;

      this.currentPage = page;
      const keyword = document.getElementById('prod-search-input')?.value?.trim() || '';
      const productType = document.getElementById('prod-filter-type')?.value || '';
      const brandId = document.getElementById('prod-filter-brand')?.value || '';
      const status = document.getElementById('prod-filter-status')?.value || '';

      const params = {
        keyword,
        productType,
        brandId,
        status,
        page: this.currentPage,
        size: this.pageSize
      };

      try {
        const tbody = document.getElementById('product-table-body');
        if (tbody) {
          tbody.innerHTML = `
            <tr>
              <td colspan="11" style="text-align: center; padding: 28px; color: #64748b;">
                <i class="fa-solid fa-spinner fa-spin" style="margin-right: 8px;"></i> Đang tải dữ liệu sản phẩm từ hệ thống...
              </td>
            </tr>
          `;
        }

        const data = await window.ProductApi.getProducts(params);
        this.products = data.content || [];
        this.totalElements = data.totalElements || 0;
        this.totalPages = data.totalPages || 1;
        this.currentPage = data.page || page;

        this.renderProductTable(this.products);
        this.renderPagination();
      } catch (err) {
        console.error('[SanPhamLogic] Lỗi tải sản phẩm:', err);
        const tbody = document.getElementById('product-table-body');
        if (tbody) {
          tbody.innerHTML = `
            <tr>
              <td colspan="11" style="text-align: center; padding: 24px; color: #ef4444;">
                <i class="fa-solid fa-triangle-exclamation"></i> Có lỗi khi tải sản phẩm: ${err.message}
              </td>
            </tr>
          `;
        }
      }
    },

    /**
     * 4. Render danh sách sản phẩm lên bảng dữ liệu (Có đầy đủ nút Xem, Sửa, Xóa)
     */
    renderProductTable: function (products) {
      const tbody = document.getElementById('product-table-body');
      if (!tbody) return;

      if (!products || products.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="11" style="text-align: center; padding: 36px; color: #94a3b8;">
              <i class="fa-solid fa-box-open" style="font-size: 32px; display: block; margin-bottom: 10px; color: #cbd5e1;"></i>
              Không tìm thấy sản phẩm nào phù hợp với bộ lọc
            </td>
          </tr>
        `;
        return;
      }

      const defaultPlaceholder = 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=120&q=80';

      tbody.innerHTML = products.map((p) => {
        const imgUrl = (p.images && p.images.length > 0 ? p.images[0] : p.image) || defaultPlaceholder;
        const brandName = p.brandName || '<span style="color:#94a3b8;">Chưa chọn</span>';

        // Badge loại sản phẩm & phân loại chi tiết (Việt hóa hoàn toàn 100%)
        const typeBadge = TDT_DICT.getTypeBadgeHtml(p);

        // Định dạng giá tiền
        const priceFmt = typeof formatVND === 'function' ? formatVND(p.price || 0) : (p.price || 0).toLocaleString() + ' đ';
        const salePriceFmt = typeof formatVND === 'function' ? formatVND(p.salePrice || p.price || 0) : (p.salePrice || p.price || 0).toLocaleString() + ' đ';

        // Badge trạng thái (Việt hóa hoàn toàn 100%)
        const statusBadge = TDT_DICT.getStatusBadgeHtml(p.status);

        // Tồn kho màu sắc
        const stockStyle = p.stock > 10 ? 'color: #10b981; font-weight:700;' : (p.stock > 0 ? 'color: #f59e0b; font-weight:700;' : 'color: #ef4444; font-weight:700;');

        return `
          <tr>
            <td>
              <img src="${imgUrl}" alt="${p.name}" style="width: 44px; height: 44px; object-fit: contain; border-radius: 6px; border: 1px solid #e2e8f0; background: #fff;">
            </td>
            <td><strong>#${p.id}</strong></td>
            <td><code>${p.sku || '-'}</code></td>
            <td style="max-width: 220px; font-weight: 600;">${p.name}</td>
            <td>${typeBadge}</td>
            <td>${brandName}</td>
            <td style="color: #64748b; text-decoration: ${p.discountPercent > 0 ? 'line-through' : 'none'}; font-size: 12px;">
              ${priceFmt}
            </td>
            <td style="font-weight: 700; color: #008d94;">
              ${salePriceFmt}
              ${p.discountPercent > 0 ? `<span style="font-size: 10px; background: #fee2e2; color: #dc2626; padding: 1px 4px; border-radius: 4px; margin-left: 2px;">-${p.discountPercent}%</span>` : ''}
            </td>
            <td>
              <span style="${stockStyle}">${p.stock != null ? p.stock : 0}</span>
            </td>
            <td>${statusBadge}</td>
            <td style="text-align: right;">
              <div class="action-btns-wrap">
                <button type="button" class="btn-action view" title="Xem chi tiết" onclick="window.SanPhamComponent.openDetailModal(${p.id})">
                  <i class="fa-solid fa-eye"></i>
                </button>
                <button type="button" class="btn-action edit" title="Chỉnh sửa sản phẩm" onclick="window.SanPhamComponent.openEditModal(${p.id})">
                  <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button type="button" class="btn-action delete" title="Xóa sản phẩm" onclick="window.SanPhamComponent.handleDeleteProduct(${p.id})">
                  <i class="fa-solid fa-trash-can"></i>
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    },

    /**
     * 5. Render thanh phân trang số (1, 2, 3... 40) kèm rút gọn ellipsis khi số trang nhiều
     */
    renderPagination: function () {
      const info = document.getElementById('product-pagination-info');
      const controls = document.getElementById('product-pagination-controls');

      if (!controls) return;

      // 1. Text hiển thị thông tin phân trang
      if (info) {
        if (this.totalElements === 0) {
          info.textContent = 'Hiển thị 0 - 0 trên 0 sản phẩm';
        } else {
          const from = (this.currentPage - 1) * this.pageSize + 1;
          const to = Math.min(this.currentPage * this.pageSize, this.totalElements);
          info.textContent = `Hiển thị ${from} - ${to} trên tổng số ${this.totalElements} sản phẩm`;
        }
      }

      if (this.totalPages <= 1) {
        controls.innerHTML = '';
        return;
      }

      let html = '';

      // Nút Trước (Previous)
      const prevDisabled = this.currentPage <= 1 ? 'disabled' : '';
      html += `
        <button class="page-btn" ${prevDisabled} onclick="window.SanPhamLogic.changePage(${this.currentPage - 1})" title="Trang trước">
          <i class="fa-solid fa-chevron-left"></i>
        </button>
      `;

      // Thuật toán hiển thị số trang có dấu rút gọn (...)
      const total = this.totalPages;
      const current = this.currentPage;
      const pageNumbers = [];

      if (total <= 7) {
        for (let i = 1; i <= total; i++) {
          pageNumbers.push(i);
        }
      } else {
        if (current <= 4) {
          // Gần đầu: 1, 2, 3, 4, 5, ..., total
          for (let i = 1; i <= 5; i++) {
            pageNumbers.push(i);
          }
          pageNumbers.push('...');
          pageNumbers.push(total);
        } else if (current >= total - 3) {
          // Gần cuối: 1, ..., total-4, total-3, total-2, total-1, total
          pageNumbers.push(1);
          pageNumbers.push('...');
          for (let i = total - 4; i <= total; i++) {
            pageNumbers.push(i);
          }
        } else {
          // Ở giữa: 1, ..., current-1, current, current+1, ..., total
          pageNumbers.push(1);
          pageNumbers.push('...');
          pageNumbers.push(current - 1);
          pageNumbers.push(current);
          pageNumbers.push(current + 1);
          pageNumbers.push('...');
          pageNumbers.push(total);
        }
      }

      pageNumbers.forEach((p) => {
        if (p === '...') {
          html += `<span class="page-ellipsis">...</span>`;
        } else {
          const activeClass = p === current ? 'active' : '';
          html += `
            <button class="page-btn ${activeClass}" onclick="window.SanPhamLogic.changePage(${p})">
              ${p}
            </button>
          `;
        }
      });

      // Nút Sau (Next)
      const nextDisabled = this.currentPage >= total ? 'disabled' : '';
      html += `
        <button class="page-btn" ${nextDisabled} onclick="window.SanPhamLogic.changePage(${this.currentPage + 1})" title="Trang sau">
          <i class="fa-solid fa-chevron-right"></i>
        </button>
      `;

      controls.innerHTML = html;
    },

    /**
     * 6. Chuyển đến trang chỉ định
     * @param {number} page
     */
    changePage: function (page) {
      if (page < 1 || page > this.totalPages || page === this.currentPage) return;
      this.loadProducts(page);

      // Cuộn mượt khung bọc bảng lên đầu
      const scrollBox = document.querySelector('.product-table-scroll-container');
      if (scrollBox) {
        scrollBox.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },

    /**
     * Sự kiện tìm kiếm theo từ khóa (có debounce 300ms)
     */
    onSearch: function (query) {
      if (this.searchTimeout) clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.loadProducts(1);
      }, 300);
    },

    /**
     * Sự kiện thay đổi bộ lọc
     */
    onFilterChange: function () {
      this.loadProducts(1);
    },

    /**
     * Đặt lại toàn bộ bộ lọc về mặc định
     */
    resetFilter: function () {
      const searchInput = document.getElementById('prod-search-input');
      const typeSelect = document.getElementById('prod-filter-type');
      const brandSelect = document.getElementById('prod-filter-brand');
      const statusSelect = document.getElementById('prod-filter-status');

      if (searchInput) searchInput.value = '';
      if (typeSelect) typeSelect.value = '';
      if (brandSelect) brandSelect.value = '';
      if (statusSelect) statusSelect.value = '';

      this.loadProducts(1);
    },

    /**
     * Mở modal thêm sản phẩm mới
     */
    openAddModal: function () {
      const modal = document.getElementById('product-modal');
      const title = document.getElementById('product-modal-title');
      const form = document.getElementById('product-form');

      if (!modal) return;
      modal.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
      if (title) title.innerHTML = '<i class="fa-solid fa-plus-circle text-primary"></i> Thêm sản phẩm mới';
      if (form) form.reset();

      const formId = document.getElementById('prod-form-id');
      if (formId) formId.value = '';

      this.images = [];
      this.renderImagesGallery();
      this.onTypeChange();
      this.calculateSalePrice();

      modal.classList.add('show');
      modal.style.display = 'flex';
    },

    /**
     * Mở modal chỉnh sửa sản phẩm
     */
    openEditModal: async function (productId) {
      const modal = document.getElementById('product-modal');
      const title = document.getElementById('product-modal-title');
      const form = document.getElementById('product-form');

      if (!modal) return;
      modal.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));

      // Gọi API lấy dữ liệu chi tiết sản phẩm kèm Specs từ server
      let p = null;
      if (window.ProductApi?.getProductById) {
        p = await window.ProductApi.getProductById(productId);
      }
      if (!p) {
        p = this.products.find((item) => item.id === productId);
      }

      if (!p) {
        this.showToast('Không tìm thấy thông tin sản phẩm!', 'error');
        return;
      }

      if (title) title.innerHTML = `<i class="fa-solid fa-pen-to-square text-primary"></i> Chỉnh sửa sản phẩm #${p.id}`;
      if (form) form.reset();

      // Điền dữ liệu cơ bản vào form
      const formId = document.getElementById('prod-form-id');
      const nameInput = document.getElementById('prod-name');
      const skuInput = document.getElementById('prod-sku');
      const typeSelect = document.getElementById('prod-type');
      const compTypeSelect = document.getElementById('prod-component-type');
      const accTypeSelect = document.getElementById('prod-accessory-type');
      const brandSelect = document.getElementById('prod-brand');
      const priceInput = document.getElementById('prod-price');
      const discountInput = document.getElementById('prod-discount');
      const stockInput = document.getElementById('prod-stock');
      const statusSelect = document.getElementById('prod-status');
      const descInput = document.getElementById('prod-description');

      if (formId) formId.value = p.id;
      if (nameInput) nameInput.value = p.name || '';
      if (skuInput) skuInput.value = p.sku || '';
      if (typeSelect) typeSelect.value = p.productType || 'COMPONENT';
      if (compTypeSelect && p.componentType) compTypeSelect.value = p.componentType;
      if (accTypeSelect && p.accessoryType) accTypeSelect.value = p.accessoryType;
      if (brandSelect && p.brandId) brandSelect.value = p.brandId;
      if (priceInput) priceInput.value = p.price || 0;
      if (discountInput) discountInput.value = p.discountPercent || 0;
      if (stockInput) stockInput.value = p.stock || 0;
      if (statusSelect) statusSelect.value = p.status || 'ACTIVE';
      if (descInput) descInput.value = p.description || '';

      this.images = p.images && p.images.length > 0 ? [...p.images] : (p.image ? [p.image] : []);
      this.renderImagesGallery();
      this.onTypeChange();
      this.calculateSalePrice();

      // Nạp thông số kỹ thuật (Specs) tương ứng vào form
      this.fillSpecsFormData(p);

      modal.classList.add('show');
      modal.style.display = 'flex';
    },

    /**
     * Đóng modal thêm/sửa sản phẩm
     */
    closeModal: function () {
      const modal = document.getElementById('product-modal');
      if (modal) {
        modal.classList.remove('show');
        modal.style.display = 'none';
        modal.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
      }
    },

    /**
     * Mở modal xem chi tiết sản phẩm (Bao gồm thông tin chung + Bảng thông số kỹ thuật)
     */
    openDetailModal: async function (productId) {
      const modal = document.getElementById('product-detail-modal');
      const content = document.getElementById('product-detail-content');
      if (!modal) return;

      let p = null;
      if (window.ProductApi?.getProductById) {
        p = await window.ProductApi.getProductById(productId);
      }
      if (!p) {
        p = this.products.find((item) => item.id === productId);
      }

      if (!p) {
        this.showToast('Không tìm thấy thông tin sản phẩm!', 'error');
        return;
      }

      const imgUrl = (p.images && p.images.length > 0 ? p.images[0] : p.image) || 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=400&q=80';
      const priceFmt = typeof formatVND === 'function' ? formatVND(p.price || 0) : (p.price || 0).toLocaleString() + ' đ';
      const salePriceFmt = typeof formatVND === 'function' ? formatVND(p.salePrice || p.price || 0) : (p.salePrice || p.price || 0).toLocaleString() + ' đ';

      const specsTableHtml = this.renderSpecsDetailHtml(p);

      if (content) {
        content.innerHTML = `
          <div class="product-detail-view" style="display: flex; gap: 24px; flex-wrap: wrap;">
            <div style="flex: 1; min-width: 250px; max-width: 300px;">
              <div style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; background: #fff; padding: 12px; text-align: center;">
                <img src="${imgUrl}" alt="${p.name}" style="width: 100%; max-height: 240px; object-fit: contain;">
              </div>
              <div style="margin-top: 10px; display: flex; gap: 8px; overflow-x: auto;">
                ${(p.images || []).map((img) => `<img src="${img}" style="width: 46px; height: 46px; object-fit: cover; border-radius: 4px; border: 1px solid #cbd5e1;">`).join('')}
              </div>
            </div>
            <div style="flex: 2; min-width: 320px;">
              <h3 style="font-size: 19px; font-weight: 700; color: #0f172a; margin-bottom: 6px;">${p.name}</h3>
              <div style="font-size: 12.5px; color: #64748b; margin-bottom: 12px;">
                Mã SKU: <code style="background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-weight: 600;">${p.sku || 'N/A'}</code> | 
                Thương hiệu: <strong>${p.brandName || 'Chưa chọn'}</strong> | 
                Trạng thái: <strong>${TDT_DICT.getTextStatus(p.status)}</strong>
              </div>
              <div style="display: flex; align-items: baseline; gap: 12px; margin-bottom: 14px; padding: 10px 14px; background: #f8fafc; border-radius: 8px;">
                <span style="font-size: 20px; font-weight: 800; color: #008d94;">${salePriceFmt}</span>
                ${p.discountPercent > 0 ? `<span style="font-size: 13px; text-decoration: line-through; color: #94a3b8;">${priceFmt}</span>` : ''}
                ${p.discountPercent > 0 ? `<span style="font-size: 11px; background: #fee2e2; color: #dc2626; font-weight: 700; padding: 2px 8px; border-radius: 12px;">Giảm ${p.discountPercent}%</span>` : ''}
              </div>
              <table style="width: 100%; font-size: 13px; border-collapse: collapse; margin-bottom: 12px;">
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 6px 0; color: #64748b; width: 130px;">Loại sản phẩm:</td>
                  <td style="font-weight: 600;">${TDT_DICT.getTextProductType(p.productType)}</td>
                </tr>
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 6px 0; color: #64748b;">Phân loại chi tiết:</td>
                  <td style="font-weight: 600;">${TDT_DICT.getTextDetailType(p)}</td>
                </tr>
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 6px 0; color: #64748b;">Số lượng tồn kho:</td>
                  <td style="font-weight: 700; color: #10b981;">${p.stock || 0} sản phẩm</td>
                </tr>
              </table>
              ${p.description ? `
                <div style="margin-bottom: 14px;">
                  <h5 style="font-weight: 700; margin-bottom: 4px; font-size: 13px;">Mô tả sản phẩm:</h5>
                  <p style="font-size: 12.5px; color: #475569; line-height: 1.5; white-space: pre-line; margin: 0;">${p.description}</p>
                </div>
              ` : ''}
            </div>
          </div>
          ${specsTableHtml}
        `;
      }

      modal.classList.add('show');
      modal.style.display = 'flex';
    },

    /**
     * Đóng modal chi tiết sản phẩm
     */
    closeDetailModal: function () {
      const modal = document.getElementById('product-detail-modal');
      if (modal) {
        modal.classList.remove('show');
        modal.style.display = 'none';
      }
    },

    /**
     * Xóa sản phẩm theo ID (Có hộp thoại xác nhận)
     */
    handleDeleteProduct: async function (productId) {
      if (!confirm(`Bạn có chắc chắn muốn xóa sản phẩm #${productId} không? Thao tác này không thể hoàn tác.`)) {
        return;
      }

      try {
        if (window.ProductApi?.deleteProduct) {
          await window.ProductApi.deleteProduct(productId);
          this.showToast(`Đã xóa sản phẩm #${productId} thành công!`, 'success');
          if (this.products.length <= 1 && this.currentPage > 1) {
            this.currentPage--;
          }
          this.loadProducts(this.currentPage);
        }
      } catch (err) {
        console.error('[SanPhamLogic] Lỗi xóa sản phẩm:', err);
        this.showToast('Lỗi khi xóa sản phẩm: ' + err.message, 'error');
      }
    },

    /**
     * Hiển thị thông báo Toast chuẩn chung toàn hệ thống Admin
     */
    showToast: function (message, type = 'error', title = null) {
      if (window.AdminApp?.showToast) {
        window.AdminApp.showToast(message, type, title);
      }
    },

    /**
     * Đánh dấu ô nhập lỗi: Báo toast, cuộn tới ô, focus và rung viền đỏ
     */
    highlightError: function (id, msg) {
      this.showToast(msg, 'error');
      if (id) {
        const el = document.getElementById(id);
        if (el) {
          el.focus();
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.classList.add('is-invalid');
          const clearInvalid = () => el.classList.remove('is-invalid');
          el.addEventListener('input', clearInvalid, { once: true });
          el.addEventListener('change', clearInvalid, { once: true });
          setTimeout(clearInvalid, 4000);
        }
      }
    },

    /**
     * Xử lý lưu form thêm / chỉnh sửa sản phẩm (Lưu Product + Spec tương ứng đồng thời)
     */
    handleSaveProduct: async function (event) {
      if (event) event.preventDefault();

      const formId = document.getElementById('prod-form-id')?.value;
      const name = document.getElementById('prod-name')?.value?.trim();
      const sku = document.getElementById('prod-sku')?.value?.trim();
      const productType = document.getElementById('prod-type')?.value;
      const componentType = document.getElementById('prod-component-type')?.value;
      const accessoryType = document.getElementById('prod-accessory-type')?.value;
      const brandIdVal = document.getElementById('prod-brand')?.value;
      const priceVal = document.getElementById('prod-price')?.value?.trim();
      const discountVal = document.getElementById('prod-discount')?.value?.trim();
      const stockVal = document.getElementById('prod-stock')?.value?.trim();
      const status = document.getElementById('prod-status')?.value;
      const description = document.getElementById('prod-description')?.value?.trim();

      const fail = (id, msg) => {
        this.highlightError(id, msg);
        return false;
      };

      // 1. Validate thông tin chung của Product
      if (!name) return fail('prod-name', 'Vui lòng nhập Tên sản phẩm!');
      if (name.length > 255) return fail('prod-name', 'Tên sản phẩm không được vượt quá 255 ký tự!');
      if (!sku) return fail('prod-sku', 'Vui lòng nhập Mã SKU sản phẩm!');
      if (sku.length > 100) return fail('prod-sku', 'Mã SKU không được vượt quá 100 ký tự!');
      if (!productType) return fail('prod-type', 'Vui lòng chọn Loại sản phẩm (Máy tính PC, Linh kiện hoặc Phụ kiện)!');
      if (productType === 'COMPONENT' && !componentType) return fail('prod-component-type', 'Vui lòng chọn Phân loại linh kiện chi tiết!');
      if (productType === 'ACCESSORY' && !accessoryType) return fail('prod-accessory-type', 'Vui lòng chọn Phân loại phụ kiện chi tiết!');

      // Yêu cầu: Nếu là linh kiện hoặc phụ kiện thì buộc phải chọn thương hiệu, PC thì có thể không cần thêm
      if (productType !== 'PC' && (!brandIdVal || brandIdVal.trim() === '')) {
        return fail('prod-brand', 'Vui lòng chọn Thương hiệu cho sản phẩm linh kiện hoặc phụ kiện!');
      }

      if (priceVal === '' || !/^\d+(\.\d+)?$/.test(priceVal) || parseFloat(priceVal) < 0) {
        return fail('prod-price', 'Giá gốc sản phẩm phải là số hợp lệ lớn hơn hoặc bằng 0!');
      }
      if (discountVal !== '' && (!/^\d+(\.\d+)?$/.test(discountVal) || parseFloat(discountVal) < 0 || parseFloat(discountVal) > 100)) {
        return fail('prod-discount', 'Phần trăm giảm giá phải là số từ 0% đến 100%!');
      }

      // Yêu cầu: Số lượng tồn kho không được là 0 hoặc âm
      if (stockVal === '' || !/^\d+$/.test(stockVal) || parseInt(stockVal, 10) <= 0) {
        return fail('prod-stock', 'Số lượng tồn kho phải là số nguyên lớn hơn 0 (không được là 0 hoặc âm)!');
      }

      // 2. Validate thông số chi tiết Specs (chỉ áp dụng khi không phải PC)
      if (productType !== 'PC') {
        const specValidation = this.validateSpecs(productType, componentType, accessoryType);
        if (!specValidation.ok) {
          return fail(specValidation.id, specValidation.msg);
        }
      }

      // 3. Đóng gói DTO cơ bản
      const payload = {
        name,
        sku,
        productType,
        componentType: productType === 'COMPONENT' ? componentType : null,
        accessoryType: productType === 'ACCESSORY' ? accessoryType : null,
        brandId: brandIdVal ? parseInt(brandIdVal, 10) : null,
        price: parseFloat(priceVal),
        discountPercent: discountVal ? parseFloat(discountVal) : 0,
        stock: parseInt(stockVal, 10),
        status: status || 'ACTIVE',
        description: description || '',
        images: this.images
      };

      // 4. Đóng gói thông số kỹ thuật (Spec tương ứng) nếu không phải PC
      if (productType !== 'PC') {
        this.collectSpecsFormData(payload, productType, componentType, accessoryType);
      }

      try {
        if (formId) {
          // Cập nhật sản phẩm
          await window.ProductApi.updateProduct(formId, payload);
          this.showToast(`Cập nhật sản phẩm [${name}] thành công!`, 'success');
        } else {
          // Tạo mới sản phẩm
          await window.ProductApi.createProduct(payload);
          this.showToast(`Thêm mới sản phẩm [${name}] thành công!`, 'success');
        }

        this.closeModal();
        this.loadProducts(formId ? this.currentPage : 1);
      } catch (err) {
        console.error('[SanPhamLogic] Lỗi lưu sản phẩm:', err);
        // Hiển thị chi tiết lỗi từ DTO server trả về
        this.showToast(err.message || 'Không thể lưu sản phẩm!', 'error');
      }
    },

    /**
     * Kiểm tra tính hợp lệ nghiêm ngặt (Validate gắt) của thông số kỹ thuật (Specs)
     * Đối chiếu chính xác theo database schema:
     * - Trường NOT NULL: bắt buộc phải nhập và phải đúng định dạng
     * - Trường cho phép NULL: được phép để trống, nhưng nếu đã nhập thì phải nhập đúng định dạng
     * @returns {{ ok: boolean, msg?: string, id?: string }}
     */
    validateSpecs: function (productType, componentType, accessoryType) {
      const getVal = (id) => document.getElementById(id)?.value?.trim() || '';

      // Helper kiểm tra số nguyên (chỉ chấp nhận các chữ số, không đơn vị, không chữ, không âm)
      const assertInt = (id, label, { min = 1, max = 2147483647, required = false } = {}) => {
        const val = getVal(id);
        const el = document.getElementById(id);
        if (el?.validity?.badInput) {
          return { ok: false, msg: `Trường [${label}] chứa ký tự không hợp lệ! Vui lòng chỉ nhập số nguyên.`, id };
        }
        if (!val) {
          if (required) return { ok: false, msg: `Trường [${label}] bắt buộc phải nhập (không được để trống)!`, id };
          return { ok: true };
        }
        if (!/^\d+$/.test(val)) {
          return {
            ok: false,
            msg: `Trường [${label}] chỉ được nhập số nguyên (ví dụ: ${min || 100}), không được nhập chữ cái hoặc đơn vị tính (như mm, GB, W, RPM)!`,
            id
          };
        }
        const num = parseInt(val, 10);
        if (num < min) {
          return { ok: false, msg: `Trường [${label}] phải lớn hơn hoặc bằng ${min}!`, id };
        }
        if (num > max) {
          return { ok: false, msg: `Trường [${label}] không được vượt quá ${max}!`, id };
        }
        return { ok: true };
      };

      // Helper kiểm tra số thực / số thập phân (chỉ chấp nhận số, ví dụ: 3.4 hoặc 24)
      const assertFloat = (id, label, { min = 0.01, max = 999999, required = false } = {}) => {
        const val = getVal(id);
        const el = document.getElementById(id);
        if (el?.validity?.badInput) {
          return { ok: false, msg: `Trường [${label}] chứa ký tự không hợp lệ! Vui lòng chỉ nhập số.`, id };
        }
        if (!val) {
          if (required) return { ok: false, msg: `Trường [${label}] bắt buộc phải nhập (không được để trống)!`, id };
          return { ok: true };
        }
        if (!/^\d+(\.\d+)?$/.test(val)) {
          return {
            ok: false,
            msg: `Trường [${label}] chỉ được nhập số (ví dụ: 3.4 hoặc 1.2), không được nhập chữ cái hoặc đơn vị tính!`,
            id
          };
        }
        const num = parseFloat(val);
        if (num < min) {
          return { ok: false, msg: `Trường [${label}] phải lớn hơn hoặc bằng ${min}!`, id };
        }
        if (num > max) {
          return { ok: false, msg: `Trường [${label}] không được vượt quá ${max}!`, id };
        }
        return { ok: true };
      };

      // Helper kiểm tra chuỗi chữ thuần túy (TUYỆT ĐỐI KHÔNG CHỨA CHỮ SỐ)
      const assertNoDigits = (id, label, { maxLen = 50, required = false } = {}) => {
        const val = getVal(id);
        if (!val) {
          if (required) return { ok: false, msg: `Trường [${label}] bắt buộc phải nhập (không được để trống)!`, id };
          return { ok: true };
        }
        if (/\d/.test(val)) {
          return {
            ok: false,
            msg: `Trường [${label}] chỉ được nhập chữ, tuyệt đối không được chứa chữ số!`,
            id
          };
        }
        if (val.length > maxLen) {
          return { ok: false, msg: `Trường [${label}] không được vượt quá ${maxLen} ký tự!`, id };
        }
        return { ok: true };
      };

      // Helper kiểm tra chuỗi text thông thường (kiểm tra độ dài max, required)
      const assertText = (id, label, { maxLen = 100, required = false } = {}) => {
        const val = getVal(id);
        if (!val) {
          if (required) return { ok: false, msg: `Trường [${label}] bắt buộc phải nhập (không được để trống)!`, id };
          return { ok: true };
        }
        if (val.length > maxLen) {
          return { ok: false, msg: `Trường [${label}] không được vượt quá ${maxLen} ký tự!`, id };
        }
        return { ok: true };
      };

      let checks = [];

      if (productType === 'COMPONENT') {
        switch (componentType) {
          case 'CPU':
            checks = [
              assertText('spec-cpu-socket', 'Socket CPU', { maxLen: 50, required: true }),
              assertInt('spec-cpu-cores', 'Số nhân CPU', { min: 1, max: 256, required: true }),
              assertInt('spec-cpu-threads', 'Số luồng CPU', { min: 1, max: 512, required: true }),
              assertFloat('spec-cpu-base-clock', 'Xung nhịp cơ bản (GHz)', { min: 0.1, max: 20, required: true }),
              assertFloat('spec-cpu-boost-clock', 'Xung nhịp tối đa (GHz)', { min: 0.1, max: 20, required: true }),
              assertFloat('spec-cpu-cache-mb', 'Bộ nhớ đệm Cache (MB)', { min: 0, max: 2048, required: true }),
              assertText('spec-cpu-igpu', 'Đồ họa tích hợp', { maxLen: 100 })
            ];
            break;

          case 'GPU':
            checks = [
              assertText('spec-gpu-chipset', 'Chipset GPU', { maxLen: 100, required: true }),
              assertInt('spec-gpu-vram', 'Dung lượng VRAM (GB)', { min: 1, max: 128, required: true }),
              assertText('spec-gpu-memory-type', 'Chuẩn bộ nhớ VRAM', { maxLen: 20, required: true }),
              assertInt('spec-gpu-length', 'Chiều dài card (mm)', { min: 1, max: 800, required: true }),
              assertFloat('spec-gpu-width-slots', 'Độ dày chiếm khe (Slots)', { min: 0.1, max: 8 }),
              assertInt('spec-gpu-psu-watt', 'Nguồn đề xuất (W)', { min: 1, max: 3000 }),
              assertText('spec-gpu-power-connector', 'Cổng cấp nguồn', { maxLen: 100 })
            ];
            break;

          case 'MAINBOARD':
            checks = [
              assertText('spec-mb-socket', 'Socket Bo mạch chủ', { maxLen: 50, required: true }),
              assertText('spec-mb-chipset', 'Chipset Bo mạch chủ', { maxLen: 100, required: true }),
              assertText('spec-mb-memory-type', 'Chuẩn RAM hỗ trợ', { maxLen: 20, required: true }),
              assertInt('spec-mb-max-ram', 'Dung lượng RAM tối đa (GB)', { min: 1, max: 2048, required: true }),
              assertInt('spec-mb-ram-slots', 'Số khe RAM', { min: 1, max: 16, required: true }),
              assertText('spec-mb-form-factor', 'Kích thước Bo mạch chủ', { maxLen: 30, required: true }),
              assertInt('spec-mb-m2-slots', 'Số khe M.2', { min: 0, max: 16, required: true }),
              assertInt('spec-mb-sata-ports', 'Số cổng SATA', { min: 0, max: 32, required: true })
            ];
            break;

          case 'RAM':
            checks = [
              assertInt('spec-ram-capacity', 'Dung lượng RAM (GB)', { min: 1, max: 512, required: true }),
              assertText('spec-ram-memory-type', 'Chuẩn RAM', { maxLen: 20, required: true }),
              assertInt('spec-ram-speed', 'Tốc độ bus (MHz)', { min: 1, max: 15000, required: true }),
              assertInt('spec-ram-module-count', 'Số thanh trong bộ', { min: 1, max: 8, required: true }),
              assertFloat('spec-ram-voltage', 'Điện áp RAM (V)', { min: 0.1, max: 5.0 })
            ];
            break;

          case 'SSD':
            checks = [
              assertInt('spec-ssd-capacity', 'Dung lượng SSD (GB)', { min: 1, max: 64000, required: true }),
              assertText('spec-ssd-interface', 'Chuẩn giao tiếp SSD', { maxLen: 50, required: true }),
              assertText('spec-ssd-form-factor', 'Kích thước SSD', { maxLen: 50, required: true }),
              assertInt('spec-ssd-read-speed', 'Tốc độ đọc (MB/s)', { min: 0, max: 50000, required: true }),
              assertInt('spec-ssd-write-speed', 'Tốc độ ghi (MB/s)', { min: 0, max: 50000, required: true }),
              assertNoDigits('spec-ssd-nand-type', 'Loại NAND Flash', { maxLen: 50 })
            ];
            break;

          case 'HDD':
            checks = [
              assertInt('spec-hdd-capacity', 'Dung lượng HDD (GB)', { min: 1, max: 64000, required: true }),
              assertInt('spec-hdd-rpm', 'Tốc độ vòng quay (RPM)', { min: 1, max: 20000, required: true }),
              assertInt('spec-hdd-cache', 'Bộ nhớ đệm Cache (MB)', { min: 0, max: 2048 }),
              assertText('spec-hdd-interface', 'Chuẩn giao tiếp HDD', { maxLen: 50, required: true })
            ];
            break;

          case 'PSU':
            checks = [
              assertInt('spec-psu-wattage', 'Công suất nguồn (W)', { min: 1, max: 3000, required: true }),
              assertText('spec-psu-efficiency', 'Chuẩn hiệu suất', { maxLen: 30, required: true }),
              assertNoDigits('spec-psu-modular', 'Kiểu dây Modular', { maxLen: 30, required: true }),
              assertText('spec-psu-form-factor', 'Kích thước nguồn', { maxLen: 30, required: true })
            ];
            break;

          case 'CASE':
            checks = [
              assertText('spec-case-form-factor', 'Chuẩn Mainboard hỗ trợ', { maxLen: 255, required: true }),
              assertInt('spec-case-max-gpu', 'Chiều dài GPU tối đa (mm)', { min: 1, max: 800, required: true }),
              assertInt('spec-case-max-cpu-cooler', 'Chiều cao tản CPU tối đa (mm)', { min: 1, max: 300 }),
              assertInt('spec-case-max-radiator', 'Kích thước Rad nước tối đa (mm)', { min: 1, max: 600 }),
              assertInt('spec-case-drive-bays', 'Số khay ổ cứng', { min: 0, max: 30, required: true })
            ];
            break;

          case 'COOLER':
            checks = [
              assertNoDigits('spec-cooler-type', 'Loại tản nhiệt', { maxLen: 30, required: true }),
              assertText('spec-cooler-sockets', 'Socket hỗ trợ', { maxLen: 500, required: true }),
              assertInt('spec-cooler-radiator', 'Kích thước két làm mát (mm)', { min: 1, max: 600 }),
              assertInt('spec-cooler-fan-size', 'Kích thước quạt (mm)', { min: 1, max: 300 }),
              assertInt('spec-cooler-height', 'Chiều cao tản nhiệt (mm)', { min: 1, max: 300 }),
              assertInt('spec-cooler-tdp', 'TDP hỗ trợ tối đa (W)', { min: 1, max: 1000 })
            ];
            break;
        }
      } else if (productType === 'ACCESSORY') {
        switch (accessoryType) {
          case 'MONITOR':
            checks = [
              assertFloat('spec-monitor-screen-size', 'Kích thước màn hình (Inch)', { min: 1.0, max: 120, required: true }),
              assertText('spec-monitor-resolution', 'Độ phân giải màn hình', { maxLen: 50, required: true }),
              assertInt('spec-monitor-refresh-rate', 'Tần số quét (Hz)', { min: 1, max: 1000, required: true }),
              assertNoDigits('spec-monitor-panel-type', 'Tấm nền màn hình', { maxLen: 30, required: true }),
              assertFloat('spec-monitor-response-time', 'Thời gian phản hồi (ms)', { min: 0.01, max: 50 }),
              assertInt('spec-monitor-brightness', 'Độ sáng màn hình (Nits)', { min: 1, max: 3000 }),
              assertText('spec-monitor-aspect-ratio', 'Tỷ lệ khung hình', { maxLen: 20, required: true }),
              assertText('spec-monitor-adaptive-sync', 'Công nghệ đồng bộ', { maxLen: 50 }),
              assertText('spec-monitor-ports', 'Cổng kết nối màn hình', { maxLen: 255, required: true })
            ];
            break;

          case 'KEYBOARD':
            checks = [
              assertNoDigits('spec-kb-type', 'Loại bàn phím', { maxLen: 30, required: true }),
              assertText('spec-kb-switch', 'Loại Switch', { maxLen: 50 }),
              assertText('spec-kb-layout', 'Layout bàn phím', { maxLen: 30, required: true }),
              assertText('spec-kb-connection', 'Kết nối bàn phím', { maxLen: 100, required: true }),
              assertNoDigits('spec-kb-keycap', 'Chất liệu Keycap', { maxLen: 50 }),
              assertText('spec-kb-backlight', 'Đèn nền bàn phím', { maxLen: 50 }),
              assertInt('spec-kb-polling-rate', 'Tần số phản hồi (Hz)', { min: 1, max: 16000 }),
              assertInt('spec-kb-battery', 'Dung lượng pin bàn phím (mAh)', { min: 1, max: 20000 }),
              assertText('spec-kb-dimensions', 'Kích thước bàn phím', { maxLen: 100 })
            ];
            break;

          case 'MOUSE':
            checks = [
              assertText('spec-mouse-sensor', 'Cảm biến chuột', { maxLen: 100, required: true }),
              assertInt('spec-mouse-dpi', 'DPI tối đa', { min: 1, max: 50000, required: true }),
              assertInt('spec-mouse-polling-rate', 'Tần số phản hồi chuột (Hz)', { min: 1, max: 16000 }),
              assertInt('spec-mouse-buttons', 'Số nút bấm', { min: 1, max: 30, required: true }),
              assertText('spec-mouse-connection', 'Kết nối chuột', { maxLen: 100, required: true }),
              assertFloat('spec-mouse-weight', 'Trọng lượng chuột (g)', { min: 0.1, max: 1000 }),
              assertInt('spec-mouse-battery', 'Dung lượng pin chuột (mAh)', { min: 1, max: 10000 })
            ];
            break;

          case 'HEADSET':
            checks = [
              assertNoDigits('spec-headset-type', 'Kiểu tai nghe', { maxLen: 50, required: true }),
              assertFloat('spec-headset-driver', 'Đường kính củ loa (mm)', { min: 0.1, max: 100 }),
              assertText('spec-headset-connection', 'Kết nối tai nghe', { maxLen: 100, required: true }),
              assertFloat('spec-headset-impedance', 'Trở kháng tai nghe (Ohm)', { min: 0.1, max: 1000 }),
              assertText('spec-headset-freq', 'Dải tần tai nghe', { maxLen: 50 }),
              assertText('spec-headset-noise-cancelling', 'Khử tiếng ồn', { maxLen: 50 }),
              assertText('spec-headset-surround', 'Âm thanh vòm', { maxLen: 50 }),
              assertInt('spec-headset-battery', 'Dung lượng pin tai nghe (mAh)', { min: 1, max: 10000 })
            ];
            break;

          case 'SPEAKER':
            checks = [
              assertNoDigits('spec-speaker-type', 'Loại loa', { maxLen: 50, required: true }),
              assertText('spec-speaker-channels', 'Số kênh loa', { maxLen: 20, required: true }),
              assertFloat('spec-speaker-power', 'Công suất loa (W)', { min: 0.1, max: 5000, required: true }),
              assertText('spec-speaker-freq', 'Dải tần loa', { maxLen: 50 }),
              assertFloat('spec-speaker-impedance', 'Trở kháng loa (Ohm)', { min: 0.1, max: 1000 }),
              assertText('spec-speaker-connection', 'Kết nối loa', { maxLen: 100, required: true }),
              assertText('spec-speaker-bluetooth', 'Phiên bản Bluetooth', { maxLen: 20 })
            ];
            break;
        }
      }

      for (const check of checks) {
        if (!check.ok) {
          return check;
        }
      }

      return { ok: true };
    },

    /**
     * Xử lý thay đổi loại sản phẩm (PC / Linh kiện / Phụ kiện)
     */
    onTypeChange: function () {
      const typeSelect = document.getElementById('prod-type');
      const componentWrapper = document.getElementById('form-group-component-type');
      const accessoryWrapper = document.getElementById('form-group-accessory-type');
      const brandLabel = document.getElementById('prod-brand-label');
      const brandSelect = document.getElementById('prod-brand');

      if (!typeSelect) return;
      const val = typeSelect.value;

      if (val === 'COMPONENT') {
        if (componentWrapper) componentWrapper.style.display = 'block';
        if (accessoryWrapper) accessoryWrapper.style.display = 'none';
        if (brandLabel) {
          brandLabel.classList.add('required');
          brandLabel.textContent = 'Thương hiệu';
        }
        if (brandSelect) brandSelect.required = true;
      } else if (val === 'ACCESSORY') {
        if (componentWrapper) componentWrapper.style.display = 'none';
        if (accessoryWrapper) accessoryWrapper.style.display = 'block';
        if (brandLabel) {
          brandLabel.classList.add('required');
          brandLabel.textContent = 'Thương hiệu';
        }
        if (brandSelect) brandSelect.required = true;
      } else {
        if (componentWrapper) componentWrapper.style.display = 'none';
        if (accessoryWrapper) accessoryWrapper.style.display = 'none';
        if (brandLabel) {
          brandLabel.classList.remove('required');
          brandLabel.textContent = 'Thương hiệu (không bắt buộc)';
        }
        if (brandSelect) brandSelect.required = false;
      }

      this.renderDynamicSpecsForm();
    },

    /**
     * Tính toán giá bán sau giảm theo thời gian thực
     */
    calculateSalePrice: function () {
      const priceInput = document.getElementById('prod-price');
      const discountInput = document.getElementById('prod-discount');
      const salePriceInput = document.getElementById('prod-sale-price');

      if (!priceInput || !salePriceInput) return;

      const price = parseFloat(priceInput.value) || 0;
      const discount = parseFloat(discountInput?.value) || 0;
      const sale = price * (1 - Math.min(100, Math.max(0, discount)) / 100);

      if (typeof formatVND === 'function') {
        salePriceInput.value = formatVND(sale);
      } else {
        salePriceInput.value = sale.toLocaleString() + ' VNĐ';
      }
    },

    /**
     * Thêm ảnh bằng URL tự nhập
     */
    addCustomImageUrl: function () {
      const input = document.getElementById('prod-image-url-input');
      if (!input) return;
      const url = input.value.trim();
      if (!url) return;

      if (this.images.length >= 6) {
        this.showToast('Tối đa chỉ được tải 6 ảnh cho mỗi sản phẩm!', 'warning');
        return;
      }

      this.images.push(url);
      input.value = '';
      this.renderImagesGallery();
    },

    /**
     * Chọn ảnh từ máy tính (DataURL)
     */
    onImageFilesSelected: function (event) {
      const files = event.target.files;
      if (!files || !files.length) return;

      const remainingSlots = 6 - this.images.length;
      if (remainingSlots <= 0) {
        this.showToast('Bạn đã đạt giới hạn tối đa 6 ảnh!', 'warning');
        return;
      }

      const filesToProcess = Array.from(files).slice(0, remainingSlots);
      let loadedCount = 0;

      filesToProcess.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.images.push(e.target.result);
          loadedCount++;
          if (loadedCount === filesToProcess.length) {
            this.renderImagesGallery();
          }
        };
        reader.readAsDataURL(file);
      });
      event.target.value = '';
    },

    /**
     * Xóa ảnh trong bộ sưu tập
     */
    removeImage: function (index) {
      if (index >= 0 && index < this.images.length) {
        this.images.splice(index, 1);
        this.renderImagesGallery();
      }
    },

    /**
     * Render lưới xem trước ảnh sản phẩm
     */
    renderImagesGallery: function () {
      const grid = document.getElementById('prod-gallery-grid');
      const badge = document.getElementById('prod-images-count');
      if (badge) badge.textContent = `${this.images.length} / 6 ảnh`;
      if (!grid) return;

      if (!this.images.length) {
        grid.innerHTML = '<div style="grid-column: 1/-1; font-size: 12px; color: #94a3b8; text-align: center; padding: 14px;">Chưa có ảnh nào được thêm. Hãy dán link ảnh hoặc chọn ảnh từ máy.</div>';
        return;
      }

      grid.innerHTML = this.images
        .map(
          (img, idx) => `
            <div style="position: relative; width: 100%; height: 90px; border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden; background: #fff;">
              <img src="${img}" style="width: 100%; height: 100%; object-fit: contain;">
              ${idx === 0 ? '<span style="position: absolute; bottom: 4px; left: 4px; background: rgba(0,141,148,0.85); color: #fff; font-size: 10px; padding: 1px 6px; border-radius: 4px; font-weight: 600;">Ảnh đại diện</span>' : ''}
              <button type="button" onclick="window.SanPhamComponent.removeImage(${idx})" style="position: absolute; top: 4px; right: 4px; width: 22px; height: 22px; border-radius: 50%; background: rgba(239,68,68,0.9); color: #fff; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 11px;">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
          `
        )
        .join('');
    },

    /**
     * Render các trường nhập liệu thông số kỹ thuật động dựa trên 14 bảng Specs từ DB
     */
    renderDynamicSpecsForm: function () {
      const container = document.getElementById('dynamic-specs-container');
      if (!container) return;

      const type = document.getElementById('prod-type')?.value || 'COMPONENT';
      let html = '';

      if (type === 'COMPONENT') {
        const compType = document.getElementById('prod-component-type')?.value || 'CPU';
        html = this.getComponentSpecsFormHtml(compType);
      } else if (type === 'ACCESSORY') {
        const accType = document.getElementById('prod-accessory-type')?.value || 'MONITOR';
        html = this.getAccessorySpecsFormHtml(accType);
      } else {
        // Cấu hình PC: Sản phẩm PC chỉ nhập thông tin chung bảng Product, không có specs trong modal này
        html = '';
      }

      container.innerHTML = html;
      container.style.display = (type === 'PC' || !html) ? 'none' : 'block';
    },

    /**
     * Sinh HTML form nhập specs cho 9 bảng Linh kiện
     */
    getComponentSpecsFormHtml: function (compType) {
      switch (compType) {
        case 'CPU':
          return `
            <h4 class="form-section-title"><i class="fa-solid fa-microchip"></i> Thông số Bộ vi xử lý (CPU)</h4>
            <div class="form-grid-3">
              <div class="form-group">
                <label class="form-label required">Socket</label>
                <select id="spec-cpu-socket" class="form-control" required>
                  <option value="">-- Chọn Socket CPU --</option>
                  <option value="LGA1700">Intel LGA1700 (Gen 12, 13, 14)</option>
                  <option value="LGA1851">Intel LGA1851 (Core Ultra)</option>
                  <option value="LGA1200">Intel LGA1200 (Gen 10, 11)</option>
                  <option value="LGA1151-v2">Intel LGA1151-v2 (Gen 8, 9)</option>
                  <option value="AM5">AMD AM5 (Ryzen 7000, 8000, 9000)</option>
                  <option value="AM4">AMD AM4 (Ryzen 1000 - 5000)</option>
                  <option value="sTR5">AMD sTR5 (Threadripper)</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label required">Số nhân (Cores)</label>
                <select id="spec-cpu-cores" class="form-control" required>
                  <option value="">-- Chọn số nhân --</option>
                  <option value="2">2 nhân</option>
                  <option value="4">4 nhân</option>
                  <option value="6">6 nhân</option>
                  <option value="8">8 nhân</option>
                  <option value="10">10 nhân</option>
                  <option value="12">12 nhân</option>
                  <option value="14">14 nhân</option>
                  <option value="16">16 nhân</option>
                  <option value="20">20 nhân</option>
                  <option value="24">24 nhân</option>
                  <option value="32">32 nhân</option>
                  <option value="64">64 nhân</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label required">Số luồng (Threads)</label>
                <select id="spec-cpu-threads" class="form-control" required>
                  <option value="">-- Chọn số luồng --</option>
                  <option value="2">2 luồng</option>
                  <option value="4">4 luồng</option>
                  <option value="8">8 luồng</option>
                  <option value="12">12 luồng</option>
                  <option value="16">16 luồng</option>
                  <option value="20">20 luồng</option>
                  <option value="24">24 luồng</option>
                  <option value="28">28 luồng</option>
                  <option value="32">32 luồng</option>
                  <option value="48">48 luồng</option>
                  <option value="64">64 luồng</option>
                  <option value="128">128 luồng</option>
                </select>
              </div>
            </div>
            <div class="form-grid-4" style="margin-top: 10px;">
              <div class="form-group">
                <label class="form-label required">Xung nhịp cơ bản (GHz)</label>
                <select id="spec-cpu-base-clock" class="form-control" required>
                  <option value="">-- Chọn xung cơ bản --</option>
                  <option value="2.0">2.0 GHz</option>
                  <option value="2.4">2.4 GHz</option>
                  <option value="2.5">2.5 GHz</option>
                  <option value="2.6">2.6 GHz</option>
                  <option value="2.8">2.8 GHz</option>
                  <option value="3.0">3.0 GHz</option>
                  <option value="3.2">3.2 GHz</option>
                  <option value="3.4">3.4 GHz</option>
                  <option value="3.5">3.5 GHz</option>
                  <option value="3.6">3.6 GHz</option>
                  <option value="3.7">3.7 GHz</option>
                  <option value="3.8">3.8 GHz</option>
                  <option value="4.0">4.0 GHz</option>
                  <option value="4.2">4.2 GHz</option>
                  <option value="4.5">4.5 GHz</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label required">Xung nhịp tối đa (GHz)</label>
                <select id="spec-cpu-boost-clock" class="form-control" required>
                  <option value="">-- Chọn xung Turbo tối đa --</option>
                  <option value="3.6">3.6 GHz</option>
                  <option value="3.8">3.8 GHz</option>
                  <option value="4.0">4.0 GHz</option>
                  <option value="4.2">4.2 GHz</option>
                  <option value="4.4">4.4 GHz</option>
                  <option value="4.6">4.6 GHz</option>
                  <option value="4.8">4.8 GHz</option>
                  <option value="5.0">5.0 GHz</option>
                  <option value="5.1">5.1 GHz</option>
                  <option value="5.2">5.2 GHz</option>
                  <option value="5.3">5.3 GHz</option>
                  <option value="5.4">5.4 GHz</option>
                  <option value="5.5">5.5 GHz</option>
                  <option value="5.6">5.6 GHz</option>
                  <option value="5.7">5.7 GHz</option>
                  <option value="5.8">5.8 GHz</option>
                  <option value="6.0">6.0 GHz</option>
                  <option value="6.2">6.2 GHz</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label required">Bộ nhớ đệm Cache (MB)</label>
                <select id="spec-cpu-cache-mb" class="form-control" required>
                  <option value="">-- Chọn Cache --</option>
                  <option value="6.0">6 MB</option>
                  <option value="8.0">8 MB</option>
                  <option value="12.0">12 MB</option>
                  <option value="16.0">16 MB</option>
                  <option value="18.0">18 MB</option>
                  <option value="20.0">20 MB</option>
                  <option value="24.0">24 MB</option>
                  <option value="25.0">25 MB</option>
                  <option value="30.0">30 MB</option>
                  <option value="32.0">32 MB</option>
                  <option value="33.0">33 MB</option>
                  <option value="36.0">36 MB</option>
                  <option value="64.0">64 MB</option>
                  <option value="96.0">96 MB (AMD 3D V-Cache)</option>
                  <option value="128.0">128 MB</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Đồ họa tích hợp (iGPU)</label>
                <select id="spec-cpu-igpu" class="form-control">
                  <option value="">-- Không có (Dòng F / KF) --</option>
                  <option value="Intel UHD Graphics 770">Intel UHD Graphics 770</option>
                  <option value="Intel UHD Graphics 730">Intel UHD Graphics 730</option>
                  <option value="AMD Radeon Graphics (RDNA 2)">AMD Radeon Graphics (RDNA 2)</option>
                  <option value="AMD Radeon 780M">AMD Radeon 780M</option>
                  <option value="Intel Iris Xe Graphics">Intel Iris Xe Graphics</option>
                </select>
              </div>
            </div>
          `;

        case 'GPU':
          return `
            <h4 class="form-section-title"><i class="fa-solid fa-vr-cardboard"></i> Thông số Card màn hình (VGA / GPU)</h4>
            <div class="form-grid-3">
              <div class="form-group">
                <label class="form-label required">Chipset GPU</label>
                <select id="spec-gpu-chipset" class="form-control" required>
                  <option value="">-- Chọn Chipset GPU --</option>
                  <optgroup label="NVIDIA RTX 40 Series">
                    <option value="GeForce RTX 4090">GeForce RTX 4090</option>
                    <option value="GeForce RTX 4080 SUPER">GeForce RTX 4080 SUPER</option>
                    <option value="GeForce RTX 4080">GeForce RTX 4080</option>
                    <option value="GeForce RTX 4070 Ti SUPER">GeForce RTX 4070 Ti SUPER</option>
                    <option value="GeForce RTX 4070 Ti">GeForce RTX 4070 Ti</option>
                    <option value="GeForce RTX 4070 SUPER">GeForce RTX 4070 SUPER</option>
                    <option value="GeForce RTX 4070">GeForce RTX 4070</option>
                    <option value="GeForce RTX 4060 Ti">GeForce RTX 4060 Ti</option>
                    <option value="GeForce RTX 4060">GeForce RTX 4060</option>
                  </optgroup>
                  <optgroup label="NVIDIA RTX 30 Series & GTX">
                    <option value="GeForce RTX 3060">GeForce RTX 3060</option>
                    <option value="GeForce RTX 3050">GeForce RTX 3050</option>
                    <option value="GeForce GTX 1650">GeForce GTX 1650</option>
                  </optgroup>
                  <optgroup label="AMD Radeon RX 7000 Series">
                    <option value="Radeon RX 7900 XTX">Radeon RX 7900 XTX</option>
                    <option value="Radeon RX 7900 XT">Radeon RX 7900 XT</option>
                    <option value="Radeon RX 7800 XT">Radeon RX 7800 XT</option>
                    <option value="Radeon RX 7700 XT">Radeon RX 7700 XT</option>
                    <option value="Radeon RX 7600 XT">Radeon RX 7600 XT</option>
                    <option value="Radeon RX 7600">Radeon RX 7600</option>
                  </optgroup>
                  <optgroup label="AMD Radeon RX 6000 Series">
                    <option value="Radeon RX 6700 XT">Radeon RX 6700 XT</option>
                    <option value="Radeon RX 6600">Radeon RX 6600</option>
                  </optgroup>
                  <optgroup label="Intel Arc">
                    <option value="Intel Arc A770">Intel Arc A770</option>
                    <option value="Intel Arc A750">Intel Arc A750</option>
                    <option value="Intel Arc A580">Intel Arc A580</option>
                  </optgroup>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label required">Dung lượng VRAM (GB)</label>
                <select id="spec-gpu-vram" class="form-control" required>
                  <option value="">-- Chọn VRAM --</option>
                  <option value="4">4 GB</option>
                  <option value="6">6 GB</option>
                  <option value="8">8 GB</option>
                  <option value="10">10 GB</option>
                  <option value="12">12 GB</option>
                  <option value="16">16 GB</option>
                  <option value="20">20 GB</option>
                  <option value="24">24 GB</option>
                  <option value="48">48 GB</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label required">Chuẩn bộ nhớ VRAM</label>
                <select id="spec-gpu-memory-type" class="form-control" required>
                  <option value="">-- Chọn chuẩn bộ nhớ --</option>
                  <option value="GDDR6X">GDDR6X</option>
                  <option value="GDDR6">GDDR6</option>
                  <option value="GDDR5">GDDR5</option>
                  <option value="HBM2">HBM2</option>
                </select>
              </div>
            </div>
            <div class="form-grid-4" style="margin-top: 10px;">
              <div class="form-group">
                <label class="form-label required">Chiều dài card (mm)</label>
                <select id="spec-gpu-length" class="form-control" required>
                  <option value="">-- Chọn chiều dài --</option>
                  <option value="170">170 mm (Mini ITX)</option>
                  <option value="200">200 mm</option>
                  <option value="220">220 mm</option>
                  <option value="242">242 mm (2 quạt nhỏ)</option>
                  <option value="260">260 mm</option>
                  <option value="280">280 mm</option>
                  <option value="300">300 mm (3 quạt tiêu chuẩn)</option>
                  <option value="304">304 mm</option>
                  <option value="310">310 mm</option>
                  <option value="320">320 mm</option>
                  <option value="336">336 mm (3 quạt lớn)</option>
                  <option value="350">350 mm</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Độ dày chiếm khe (Slots)</label>
                <select id="spec-gpu-width-slots" class="form-control">
                  <option value="">-- Tùy chọn (Để trống) --</option>
                  <option value="2.0">2.0 Slots (Tiêu chuẩn 2 khe)</option>
                  <option value="2.2">2.2 Slots</option>
                  <option value="2.5">2.5 Slots</option>
                  <option value="2.7">2.7 Slots</option>
                  <option value="3.0">3.0 Slots (Dày 3 khe)</option>
                  <option value="3.5">3.5 Slots</option>
                  <option value="4.0">4.0 Slots (Siêu dày 4 khe)</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Nguồn đề xuất (W)</label>
                <select id="spec-gpu-psu-watt" class="form-control">
                  <option value="">-- Tùy chọn (Để trống) --</option>
                  <option value="450">450 W</option>
                  <option value="500">500 W</option>
                  <option value="550">550 W</option>
                  <option value="600">600 W</option>
                  <option value="650">650 W</option>
                  <option value="700">700 W</option>
                  <option value="750">750 W</option>
                  <option value="850">850 W</option>
                  <option value="1000">1000 W</option>
                  <option value="1200">1200 W</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Cổng cấp nguồn phụ</label>
                <select id="spec-gpu-power-connector" class="form-control">
                  <option value="">-- Tùy chọn (Để trống) --</option>
                  <option value="1x 16-pin (12VHPWR)">1x 16-pin (12VHPWR chuẩn PCIe 5.0)</option>
                  <option value="1x 8-pin">1x 8-pin PCIe</option>
                  <option value="2x 8-pin">2x 8-pin PCIe</option>
                  <option value="3x 8-pin">3x 8-pin PCIe</option>
                  <option value="1x 6-pin">1x 6-pin PCIe</option>
                  <option value="Không cần nguồn phụ (Dưới 75W)">Không cần nguồn phụ (Dưới 75W)</option>
                </select>
              </div>
            </div>
          `;

        case 'MAINBOARD':
          return `
            <h4 class="form-section-title"><i class="fa-solid fa-chess-board"></i> Thông số Bo mạch chủ (Mainboard)</h4>
            <div class="form-grid-3">
              <div class="form-group">
                <label class="form-label required">Socket</label>
                <select id="spec-mb-socket" class="form-control" required>
                  <option value="">-- Chọn Socket --</option>
                  <option value="LGA1700">Intel LGA1700</option>
                  <option value="LGA1851">Intel LGA1851</option>
                  <option value="AM5">AMD AM5</option>
                  <option value="AM4">AMD AM4</option>
                  <option value="LGA1200">Intel LGA1200</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label required">Chipset</label>
                <select id="spec-mb-chipset" class="form-control" required>
                  <option value="">-- Chọn Chipset --</option>
                  <optgroup label="Intel Chipset">
                    <option value="Intel Z790">Intel Z790 (Ép xung cao cấp)</option>
                    <option value="Intel B760">Intel B760 (Phổ thông bán chạy)</option>
                    <option value="Intel H610">Intel H610 (Tiết kiệm chi phí)</option>
                    <option value="Intel Z690">Intel Z690</option>
                    <option value="Intel B660">Intel B660</option>
                    <option value="Intel Z890">Intel Z890 (Thế hệ mới)</option>
                  </optgroup>
                  <optgroup label="AMD Chipset">
                    <option value="AMD X670E">AMD X670E (Đỉnh cao AM5)</option>
                    <option value="AMD B650">AMD B650 (Phổ thông AM5)</option>
                    <option value="AMD A620">AMD A620 (Cơ bản AM5)</option>
                    <option value="AMD X570">AMD X570 (Cao cấp AM4)</option>
                    <option value="AMD B550">AMD B550 (Quốc dân AM4)</option>
                    <option value="AMD A520">AMD A520 (Giá rẻ AM4)</option>
                    <option value="AMD X870">AMD X870 (Mới nhất)</option>
                  </optgroup>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label required">Chuẩn RAM hỗ trợ</label>
                <select id="spec-mb-memory-type" class="form-control" required>
                  <option value="">-- Chọn chuẩn RAM --</option>
                  <option value="DDR5">DDR5</option>
                  <option value="DDR4">DDR4</option>
                </select>
              </div>
            </div>
            <div class="form-grid-4" style="margin-top: 10px;">
              <div class="form-group">
                <label class="form-label required">Dung lượng RAM tối đa (GB)</label>
                <select id="spec-mb-max-ram" class="form-control" required>
                  <option value="">-- Chọn RAM tối đa --</option>
                  <option value="64">64 GB</option>
                  <option value="96">96 GB</option>
                  <option value="128">128 GB (4 khe thông thường)</option>
                  <option value="192">192 GB (DDR5 dung lượng cao)</option>
                  <option value="256">256 GB (Workstation)</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label required">Số khe RAM</label>
                <select id="spec-mb-ram-slots" class="form-control" required>
                  <option value="">-- Chọn số khe RAM --</option>
                  <option value="2">2 khe cắm RAM</option>
                  <option value="4">4 khe cắm RAM</option>
                  <option value="8">8 khe cắm RAM</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label required">Kích thước (Form Factor)</label>
                <select id="spec-mb-form-factor" class="form-control" required>
                  <option value="">-- Chọn kích thước --</option>
                  <option value="ATX">ATX (Tiêu chuẩn)</option>
                  <option value="Micro-ATX">Micro-ATX (M-ATX Nhỏ gọn)</option>
                  <option value="Mini-ITX">Mini-ITX (Siêu nhỏ gọn)</option>
                  <option value="E-ATX">E-ATX (Cỡ lớn)</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label required">Số khe cắm M.2</label>
                <select id="spec-mb-m2-slots" class="form-control" required>
                  <option value="">-- Chọn số khe M.2 --</option>
                  <option value="1">1 khe M.2</option>
                  <option value="2">2 khe M.2</option>
                  <option value="3">3 khe M.2</option>
                  <option value="4">4 khe M.2</option>
                  <option value="5">5 khe M.2</option>
                </select>
              </div>
            </div>
            <div class="form-grid-3" style="margin-top: 10px;">
              <div class="form-group">
                <label class="form-label required">Số cổng SATA</label>
                <select id="spec-mb-sata-ports" class="form-control" required>
                  <option value="">-- Chọn số cổng SATA --</option>
                  <option value="2">2 cổng SATA</option>
                  <option value="4">4 cổng SATA (Tiêu chuẩn)</option>
                  <option value="6">6 cổng SATA</option>
                  <option value="8">8 cổng SATA</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label required">Tích hợp Wi-Fi</label>
                <select id="spec-mb-wifi" class="form-control" required>
                  <option value="false">Không tích hợp</option>
                  <option value="true">Có Wi-Fi tích hợp (Wi-Fi 6 / 6E / 7)</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label required">Tích hợp Bluetooth</label>
                <select id="spec-mb-bluetooth" class="form-control" required>
                  <option value="false">Không tích hợp</option>
                  <option value="true">Có Bluetooth tích hợp</option>
                </select>
              </div>
            </div>
          `;

        case 'RAM':
          return `
            <h4 class="form-section-title"><i class="fa-solid fa-memory"></i> Thông số Bộ nhớ trong (RAM)</h4>
            <div class="form-grid-3">
              <div class="form-group">
                <label class="form-label required">Dung lượng RAM (GB)</label>
                <select id="spec-ram-capacity" class="form-control" required>
                  <option value="">-- Chọn dung lượng --</option>
                  <option value="8">8 GB</option>
                  <option value="16">16 GB</option>
                  <option value="32">32 GB</option>
                  <option value="64">64 GB</option>
                  <option value="96">96 GB</option>
                  <option value="128">128 GB</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label required">Chuẩn RAM</label>
                <select id="spec-ram-memory-type" class="form-control" required>
                  <option value="">-- Chọn chuẩn RAM --</option>
                  <option value="DDR5">DDR5 (Thế hệ mới)</option>
                  <option value="DDR4">DDR4 (Phổ biến)</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label required">Tốc độ bus (MHz)</label>
                <select id="spec-ram-speed" class="form-control" required>
                  <option value="">-- Chọn tốc độ Bus --</option>
                  <option value="2666">2666 MHz</option>
                  <option value="3200">3200 MHz (Tiêu chuẩn DDR4)</option>
                  <option value="3600">3600 MHz (DDR4 cao cấp)</option>
                  <option value="4800">4800 MHz (DDR5 cơ bản)</option>
                  <option value="5200">5200 MHz</option>
                  <option value="5600">5600 MHz (DDR5 phổ biến)</option>
                  <option value="6000">6000 MHz (DDR5 tối ưu)</option>
                  <option value="6400">6400 MHz</option>
                  <option value="7200">7200 MHz (DDR5 cao cấp)</option>
                </select>
              </div>
            </div>
            <div class="form-grid-2" style="margin-top: 10px;">
              <div class="form-group">
                <label class="form-label required">Số thanh trong bộ (Module Count)</label>
                <select id="spec-ram-module-count" class="form-control" required>
                  <option value="1">1 thanh (Đơn - Single Channel)</option>
                  <option value="2">2 thanh (Kit đôi - Dual Channel)</option>
                  <option value="4">4 thanh (Kit 4 - Quad Channel)</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Điện áp hoạt động (V)</label>
                <select id="spec-ram-voltage" class="form-control">
                  <option value="">-- Tùy chọn (Để trống) --</option>
                  <option value="1.10">1.10 V (DDR5 Mặc định)</option>
                  <option value="1.20">1.20 V (DDR4 Mặc định)</option>
                  <option value="1.25">1.25 V</option>
                  <option value="1.35">1.35 V (XMP Tiêu chuẩn)</option>
                  <option value="1.40">1.40 V (Ép xung)</option>
                  <option value="1.45">1.45 V</option>
                </select>
              </div>
            </div>
          `;

        case 'SSD':
          return `
            <h4 class="form-section-title"><i class="fa-solid fa-hard-drive"></i> Thông số Ổ cứng thể rắn (SSD)</h4>
            <div class="form-grid-3">
              <div class="form-group">
                <label class="form-label required">Dung lượng SSD (GB)</label>
                <select id="spec-ssd-capacity" class="form-control" required>
                  <option value="">-- Chọn dung lượng --</option>
                  <option value="128">128 GB</option>
                  <option value="256">256 GB</option>
                  <option value="500">500 GB</option>
                  <option value="512">512 GB</option>
                  <option value="1000">1 TB (1000 GB)</option>
                  <option value="2000">2 TB (2000 GB)</option>
                  <option value="4000">4 TB (4000 GB)</option>
                  <option value="8000">8 TB (8000 GB)</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label required">Chuẩn giao tiếp (Interface)</label>
                <select id="spec-ssd-interface" class="form-control" required>
                  <option value="">-- Chọn chuẩn giao tiếp --</option>
                  <option value="PCIe NVMe 4.0 x4">PCIe NVMe 4.0 x4 (Gen 4 Tốc độ cao)</option>
                  <option value="PCIe NVMe 3.0 x4">PCIe NVMe 3.0 x4 (Gen 3 Phổ thông)</option>
                  <option value="PCIe NVMe 5.0 x4">PCIe NVMe 5.0 x4 (Gen 5 Siêu tốc)</option>
                  <option value="SATA III 6Gb/s">SATA III 6Gb/s (2.5 inch)</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label required">Kích thước (Form Factor)</label>
                <select id="spec-ssd-form-factor" class="form-control" required>
                  <option value="">-- Chọn kích thước --</option>
                  <option value="M.2 2280">M.2 2280 (Tiêu chuẩn máy tính & Laptop)</option>
                  <option value="2.5 inch">2.5 inch SATA</option>
                  <option value="M.2 2230">M.2 2230 (Ngắn / Máy Handheld)</option>
                  <option value="M.2 2242">M.2 2242</option>
                </select>
              </div>
            </div>
            <div class="form-grid-3" style="margin-top: 10px;">
              <div class="form-group">
                <label class="form-label required">Tốc độ đọc tối đa (MB/s)</label>
                <select id="spec-ssd-read-speed" class="form-control" required>
                  <option value="">-- Chọn tốc độ đọc --</option>
                  <option value="550">550 MB/s (SATA III)</option>
                  <option value="1800">1800 MB/s</option>
                  <option value="2400">2400 MB/s</option>
                  <option value="3500">3500 MB/s (Gen 3 Max)</option>
                  <option value="5000">5000 MB/s (Gen 4 Tầm trung)</option>
                  <option value="6000">6000 MB/s</option>
                  <option value="7000">7000 MB/s (Gen 4 Cao cấp)</option>
                  <option value="7300">7300 MB/s</option>
                  <option value="7450">7450 MB/s</option>
                  <option value="10000">10000 MB/s (Gen 5)</option>
                  <option value="12400">12400 MB/s (Gen 5 Max)</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label required">Tốc độ ghi tối đa (MB/s)</label>
                <select id="spec-ssd-write-speed" class="form-control" required>
                  <option value="">-- Chọn tốc độ ghi --</option>
                  <option value="500">500 MB/s (SATA III)</option>
                  <option value="1500">1500 MB/s</option>
                  <option value="2000">2000 MB/s</option>
                  <option value="3000">3000 MB/s (Gen 3 Max)</option>
                  <option value="4200">4200 MB/s (Gen 4 Tầm trung)</option>
                  <option value="5000">5000 MB/s</option>
                  <option value="6000">6000 MB/s</option>
                  <option value="6800">6800 MB/s</option>
                  <option value="7000">7000 MB/s (Gen 4 Cao cấp)</option>
                  <option value="9500">9500 MB/s (Gen 5)</option>
                  <option value="11800">11800 MB/s (Gen 5 Max)</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Loại NAND Flash</label>
                <select id="spec-ssd-nand-type" class="form-control">
                  <option value="">-- Tùy chọn (Để trống) --</option>
                  <option value="TLC NAND">TLC NAND (Bền bỉ, phổ biến nhất)</option>
                  <option value="QLC NAND">QLC NAND (Dung lượng lớn)</option>
                  <option value="V-NAND TLC">Samsung V-NAND TLC</option>
                  <option value="BiCS NAND">Kioxia BiCS NAND</option>
                </select>
              </div>
            </div>
          `;

        case 'HDD':
          return `
            <h4 class="form-section-title"><i class="fa-solid fa-compact-disc"></i> Thông số Ổ cứng cơ (HDD)</h4>
            <div class="form-grid-4">
              <div class="form-group">
                <label class="form-label required">Dung lượng HDD (GB)</label>
                <select id="spec-hdd-capacity" class="form-control" required>
                  <option value="">-- Chọn dung lượng --</option>
                  <option value="500">500 GB</option>
                  <option value="1000">1 TB (1000 GB)</option>
                  <option value="2000">2 TB (2000 GB)</option>
                  <option value="3000">3 TB (3000 GB)</option>
                  <option value="4000">4 TB (4000 GB)</option>
                  <option value="6000">6 TB (6000 GB)</option>
                  <option value="8000">8 TB (8000 GB)</option>
                  <option value="10000">10 TB (10000 GB)</option>
                  <option value="12000">12 TB (12000 GB)</option>
                  <option value="16000">16 TB (16000 GB)</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label required">Tốc độ quay (RPM)</label>
                <select id="spec-hdd-rpm" class="form-control" required>
                  <option value="">-- Chọn tốc độ quay --</option>
                  <option value="7200">7200 RPM (Tốc độ cao)</option>
                  <option value="5400">5400 RPM (Tiết kiệm điện, êm)</option>
                  <option value="5900">5900 RPM (Chuyên NAS / Camera)</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Bộ nhớ đệm Cache (MB)</label>
                <select id="spec-hdd-cache" class="form-control">
                  <option value="">-- Tùy chọn (Để trống) --</option>
                  <option value="64">64 MB</option>
                  <option value="128">128 MB</option>
                  <option value="256">256 MB</option>
                  <option value="512">512 MB</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label required">Chuẩn giao tiếp</label>
                <select id="spec-hdd-interface" class="form-control" required>
                  <option value="">-- Chọn chuẩn giao tiếp --</option>
                  <option value="SATA III 6Gb/s">SATA III 6Gb/s</option>
                  <option value="SATA II 3Gb/s">SATA II 3Gb/s</option>
                  <option value="SAS 12Gb/s">SAS 12Gb/s (Máy chủ Server)</option>
                </select>
              </div>
            </div>
          `;

        case 'PSU':
          return `
            <h4 class="form-section-title"><i class="fa-solid fa-plug"></i> Thông số Nguồn máy tính (PSU)</h4>
            <div class="form-grid-4">
              <div class="form-group">
                <label class="form-label required">Công suất nguồn (W)</label>
                <select id="spec-psu-wattage" class="form-control" required>
                  <option value="">-- Chọn công suất --</option>
                  <option value="450">450 W</option>
                  <option value="500">500 W</option>
                  <option value="550">550 W</option>
                  <option value="600">600 W</option>
                  <option value="650">650 W</option>
                  <option value="700">700 W</option>
                  <option value="750">750 W</option>
                  <option value="850">850 W</option>
                  <option value="1000">1000 W</option>
                  <option value="1200">1200 W</option>
                  <option value="1300">1300 W</option>
                  <option value="1600">1600 W</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label required">Chuẩn hiệu suất</label>
                <select id="spec-psu-efficiency" class="form-control" required>
                  <option value="">-- Chọn chuẩn hiệu suất --</option>
                  <option value="80 Plus Gold">80 Plus Gold (Hiệu suất 90%)</option>
                  <option value="80 Plus Bronze">80 Plus Bronze (Hiệu suất 85%)</option>
                  <option value="80 Plus Platinum">80 Plus Platinum (Hiệu suất 92%)</option>
                  <option value="80 Plus Titanium">80 Plus Titanium (Hiệu suất 94%)</option>
                  <option value="80 Plus White">80 Plus White (Tiêu chuẩn)</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label required">Kiểu dây (Modular Type)</label>
                <select id="spec-psu-modular" class="form-control" required>
                  <option value="">-- Chọn kiểu dây --</option>
                  <option value="Full Modular">Full Modular (Dây rời hoàn toàn)</option>
                  <option value="Semi Modular">Semi Modular (Rời 1 phần)</option>
                  <option value="Non Modular">Non Modular (Dây liền)</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label required">Kích thước (Form Factor)</label>
                <select id="spec-psu-form-factor" class="form-control" required>
                  <option value="">-- Chọn kích thước --</option>
                  <option value="ATX">ATX (Tiêu chuẩn)</option>
                  <option value="SFX">SFX (Nguồn nhỏ Mini PC)</option>
                  <option value="SFX-L">SFX-L</option>
                  <option value="TFX">TFX</option>
                </select>
              </div>
            </div>
          `;

        case 'CASE':
          return `
            <h4 class="form-section-title"><i class="fa-solid fa-server"></i> Thông số Vỏ máy tính (Case)</h4>
            <div class="form-grid-3">
              <div class="form-group">
                <label class="form-label required">Chuẩn Mainboard hỗ trợ</label>
                <select id="spec-case-form-factor" class="form-control" required>
                  <option value="">-- Chọn kích thước Mainboard --</option>
                  <option value="E-ATX, ATX, Micro-ATX, Mini-ITX">E-ATX, ATX, Micro-ATX, Mini-ITX (Full Tower / Mid Tower)</option>
                  <option value="ATX, Micro-ATX, Mini-ITX">ATX, Micro-ATX, Mini-ITX (Mid Tower Tiêu chuẩn)</option>
                  <option value="Micro-ATX, Mini-ITX">Micro-ATX, Mini-ITX (Mini Tower Nhỏ gọn)</option>
                  <option value="Mini-ITX">Mini-ITX (SFF Siêu nhỏ)</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label required">Chiều dài GPU tối đa (mm)</label>
                <select id="spec-case-max-gpu" class="form-control" required>
                  <option value="">-- Chọn chiều dài GPU tối đa --</option>
                  <option value="300">300 mm</option>
                  <option value="320">320 mm</option>
                  <option value="340">340 mm</option>
                  <option value="360">360 mm</option>
                  <option value="380">380 mm (Lắp vừa hầu hết card)</option>
                  <option value="400">400 mm</option>
                  <option value="420">420 mm (Lắp vừa RTX 4090)</option>
                  <option value="440">440 mm</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Chiều cao tản CPU tối đa (mm)</label>
                <select id="spec-case-max-cpu-cooler" class="form-control">
                  <option value="">-- Tùy chọn (Để trống) --</option>
                  <option value="150">150 mm</option>
                  <option value="155">155 mm</option>
                  <option value="160">160 mm</option>
                  <option value="165">165 mm (Vừa tản khí lớn)</option>
                  <option value="170">170 mm</option>
                  <option value="175">175 mm</option>
                  <option value="180">180 mm</option>
                </select>
              </div>
            </div>
            <div class="form-grid-2" style="margin-top: 10px;">
              <div class="form-group">
                <label class="form-label">Kích thước Rad nước tối đa (mm)</label>
                <select id="spec-case-max-radiator" class="form-control">
                  <option value="">-- Tùy chọn (Để trống) --</option>
                  <option value="120">120 mm</option>
                  <option value="240">240 mm</option>
                  <option value="280">280 mm</option>
                  <option value="360">360 mm (Lắp vừa két nước 360)</option>
                  <option value="420">420 mm (Cỡ đại 420)</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label required">Số khay ổ cứng (Drive Bays)</label>
                <select id="spec-case-drive-bays" class="form-control" required>
                  <option value="">-- Chọn số khay ổ cứng --</option>
                  <option value="2">2 khay (1x 3.5 inch + 1x 2.5 inch)</option>
                  <option value="3">3 khay</option>
                  <option value="4">4 khay (Tiêu chuẩn)</option>
                  <option value="5">5 khay</option>
                  <option value="6">6 khay</option>
                  <option value="8">8 khay</option>
                </select>
              </div>
            </div>
          `;

        case 'COOLER':
          return `
            <h4 class="form-section-title"><i class="fa-solid fa-fan"></i> Thông số Tản nhiệt máy tính (Cooler)</h4>
            <div class="form-grid-3">
              <div class="form-group">
                <label class="form-label required">Loại tản nhiệt</label>
                <select id="spec-cooler-type" class="form-control" required>
                  <option value="">-- Chọn loại tản nhiệt --</option>
                  <option value="Tản nhiệt nước AIO">Tản nhiệt nước AIO (All-in-One)</option>
                  <option value="Tản nhiệt khí tháp đôi">Tản nhiệt khí tháp đôi (Dual Tower)</option>
                  <option value="Tản nhiệt khí tháp đơn">Tản nhiệt khí tháp đơn (Single Tower)</option>
                  <option value="Tản nhiệt khí Low Profile">Tản nhiệt khí Low Profile</option>
                  <option value="Tản nhiệt nước Custom">Tản nhiệt nước Custom</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label required">Socket hỗ trợ</label>
                <select id="spec-cooler-sockets" class="form-control" required>
                  <option value="">-- Chọn Socket hỗ trợ --</option>
                  <option value="Intel LGA1700/1200/115x, AMD AM5/AM4">Intel LGA1700/1200/115x, AMD AM5/AM4 (Đầy đủ)</option>
                  <option value="Intel LGA1851/1700, AMD AM5">Intel LGA1851/1700, AMD AM5 (Thế hệ mới)</option>
                  <option value="Intel LGA1700, AMD AM5/AM4">Intel LGA1700, AMD AM5/AM4</option>
                  <option value="Intel LGA1200/115x, AMD AM4">Intel LGA1200/115x, AMD AM4</option>
                  <option value="Universal All Sockets">Đa năng (Universal All Sockets)</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Kích thước két làm mát (mm)</label>
                <select id="spec-cooler-radiator" class="form-control">
                  <option value="">-- Tùy chọn (Để trống) --</option>
                  <option value="120">120 mm</option>
                  <option value="240">240 mm</option>
                  <option value="280">280 mm</option>
                  <option value="360">360 mm</option>
                  <option value="420">420 mm</option>
                </select>
              </div>
            </div>
            <div class="form-grid-3" style="margin-top: 10px;">
              <div class="form-group">
                <label class="form-label">Kích thước quạt (mm)</label>
                <select id="spec-cooler-fan-size" class="form-control">
                  <option value="">-- Tùy chọn (Để trống) --</option>
                  <option value="92">92 mm</option>
                  <option value="120">120 mm (Tiêu chuẩn)</option>
                  <option value="140">140 mm</option>
                  <option value="200">200 mm</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Chiều cao tản (mm)</label>
                <select id="spec-cooler-height" class="form-control">
                  <option value="">-- Tùy chọn (Để trống) --</option>
                  <option value="47">47 mm (Low Profile)</option>
                  <option value="65">65 mm</option>
                  <option value="125">125 mm</option>
                  <option value="145">145 mm</option>
                  <option value="155">155 mm</option>
                  <option value="157">157 mm</option>
                  <option value="158">158 mm</option>
                  <option value="160">160 mm</option>
                  <option value="165">165 mm</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">TDP hỗ trợ tối đa (W)</label>
                <select id="spec-cooler-tdp" class="form-control">
                  <option value="">-- Tùy chọn (Để trống) --</option>
                  <option value="130">130 W</option>
                  <option value="150">150 W</option>
                  <option value="180">180 W</option>
                  <option value="200">200 W</option>
                  <option value="220">220 W</option>
                  <option value="250">250 W</option>
                  <option value="280">280 W</option>
                  <option value="300">300 W</option>
                  <option value="350">350 W</option>
                </select>
              </div>
            </div>
          `;

        default:
          return '';
      }
    },

    /**
     * Sinh HTML form nhập specs cho 5 bảng Phụ kiện
     */
    getAccessorySpecsFormHtml: function (accType) {
      switch (accType) {
        case 'MONITOR':
          return `
            <h4 class="form-section-title"><i class="fa-solid fa-display"></i> Thông số Màn hình máy tính</h4>
            <div class="form-grid-3">
              <div class="form-group">
                <label class="form-label required">Kích thước màn hình (Inch)</label>
                <select id="spec-monitor-screen-size" class="form-control" required>
                  <option value="">-- Chọn kích thước màn hình --</option>
                  <option value="21.5">21.5 inch</option>
                  <option value="23.8">23.8 inch</option>
                  <option value="24.0">24.0 inch</option>
                  <option value="24.5">24.5 inch</option>
                  <option value="27.0">27.0 inch (Phổ biến nhất)</option>
                  <option value="28.0">28.0 inch</option>
                  <option value="29.0">29.0 inch (Ultrawide)</option>
                  <option value="31.5">31.5 inch</option>
                  <option value="32.0">32.0 inch</option>
                  <option value="34.0">34.0 inch (Ultrawide cong)</option>
                  <option value="38.0">38.0 inch</option>
                  <option value="49.0">49.0 inch (Super Ultrawide)</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label required">Độ phân giải</label>
                <select id="spec-monitor-resolution" class="form-control" required>
                  <option value="">-- Chọn độ phân giải --</option>
                  <option value="1920 x 1080 (FHD 1080p)">1920 x 1080 (FHD 1080p)</option>
                  <option value="2560 x 1440 (2K QHD)">2560 x 1440 (2K QHD 1440p)</option>
                  <option value="3840 x 2160 (4K UHD)">3840 x 2160 (4K UHD 2160p)</option>
                  <option value="2560 x 1080 (WFHD Ultrawide)">2560 x 1080 (WFHD 21:9 Ultrawide)</option>
                  <option value="3440 x 1440 (WQHD Ultrawide)">3440 x 1440 (WQHD 21:9 Ultrawide)</option>
                  <option value="5120 x 1440 (Dual QHD 32:9)">5120 x 1440 (Dual QHD 32:9 Super Ultrawide)</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label required">Tần số quét (Hz)</label>
                <select id="spec-monitor-refresh-rate" class="form-control" required>
                  <option value="">-- Chọn tần số quét --</option>
                  <option value="60">60 Hz (Văn phòng)</option>
                  <option value="75">75 Hz</option>
                  <option value="100">100 Hz</option>
                  <option value="144">144 Hz (Gaming phổ thông)</option>
                  <option value="165">165 Hz (Gaming phổ biến)</option>
                  <option value="180">180 Hz</option>
                  <option value="200">200 Hz</option>
                  <option value="240">240 Hz (Esports)</option>
                  <option value="280">280 Hz</option>
                  <option value="360">360 Hz (Thi đấu chuyên nghiệp)</option>
                  <option value="540">540 Hz (Đỉnh cao)</option>
                </select>
              </div>
            </div>
            <div class="form-grid-3" style="margin-top: 10px;">
              <div class="form-group">
                <label class="form-label required">Tấm nền (Panel Type)</label>
                <select id="spec-monitor-panel-type" class="form-control" required>
                  <option value="">-- Chọn loại tấm nền --</option>
                  <option value="Fast IPS">Fast IPS (Màu chuẩn & Tốc độ cao)</option>
                  <option value="IPS">IPS (Góc nhìn rộng, màu chuẩn)</option>
                  <option value="OLED">OLED (Màu đen tuyệt đối, siêu nhanh)</option>
                  <option value="QD-OLED">QD-OLED (Quantum Dot OLED)</option>
                  <option value="VA">VA (Độ tương phản cao, màn cong)</option>
                  <option value="TN">TN (Tốc độ phản hồi cực nhanh)</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Thời gian phản hồi (ms)</label>
                <select id="spec-monitor-response-time" class="form-control">
                  <option value="">-- Tùy chọn (Để trống) --</option>
                  <option value="0.03">0.03 ms (OLED siêu tốc)</option>
                  <option value="0.5">0.5 ms</option>
                  <option value="1.0">1.0 ms (Tiêu chuẩn Gaming)</option>
                  <option value="2.0">2.0 ms</option>
                  <option value="4.0">4.0 ms</option>
                  <option value="5.0">5.0 ms</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Độ sáng (Nits)</label>
                <select id="spec-monitor-brightness" class="form-control">
                  <option value="">-- Tùy chọn (Để trống) --</option>
                  <option value="250">250 nits (Văn phòng tiêu chuẩn)</option>
                  <option value="300">300 nits</option>
                  <option value="350">350 nits</option>
                  <option value="400">400 nits (DisplayHDR 400)</option>
                  <option value="450">450 nits</option>
                  <option value="500">500 nits</option>
                  <option value="600">600 nits (DisplayHDR 600)</option>
                  <option value="1000">1000 nits (DisplayHDR 1000)</option>
                </select>
              </div>
            </div>
            <div class="form-grid-3" style="margin-top: 10px;">
              <div class="form-group">
                <label class="form-label required">Tỷ lệ khung hình</label>
                <select id="spec-monitor-aspect-ratio" class="form-control" required>
                  <option value="">-- Chọn tỷ lệ khung hình --</option>
                  <option value="16:9">16:9 (Tiêu chuẩn)</option>
                  <option value="16:10">16:10 (Đồ họa & Lập trình)</option>
                  <option value="21:9">21:9 (Ultrawide góc rộng)</option>
                  <option value="32:9">32:9 (Super Ultrawide)</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Công nghệ đồng bộ</label>
                <select id="spec-monitor-adaptive-sync" class="form-control">
                  <option value="">-- Tùy chọn (Để trống) --</option>
                  <option value="FreeSync & G-Sync Compatible">FreeSync & G-Sync Compatible</option>
                  <option value="NVIDIA G-Sync Compatible">NVIDIA G-Sync Compatible</option>
                  <option value="AMD FreeSync Premium">AMD FreeSync Premium</option>
                  <option value="Adaptive-Sync">Adaptive-Sync</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label required">Cổng xuất hình</label>
                <select id="spec-monitor-ports" class="form-control" required>
                  <option value="">-- Chọn cổng xuất hình --</option>
                  <option value="1x DisplayPort 1.4, 2x HDMI 2.0, Audio Out">1x DisplayPort 1.4, 2x HDMI 2.0, Audio Out (Phổ biến)</option>
                  <option value="2x DisplayPort 1.4, 1x HDMI 2.1, USB Type-C 65W">2x DisplayPort 1.4, 1x HDMI 2.1, USB Type-C 65W (Cao cấp)</option>
                  <option value="1x DisplayPort 1.2, 1x HDMI 1.4, Audio Out">1x DisplayPort 1.2, 1x HDMI 1.4, Audio Out</option>
                  <option value="2x HDMI 2.1, 1x DisplayPort 1.4, USB Hub">2x HDMI 2.1, 1x DisplayPort 1.4, USB Hub</option>
                  <option value="1x HDMI 2.0, 1x VGA">1x HDMI 2.0, 1x VGA (Văn phòng)</option>
                </select>
              </div>
            </div>
          `;

        case 'KEYBOARD':
          return `
            <h4 class="form-section-title"><i class="fa-solid fa-keyboard"></i> Thông số Bàn phím máy tính</h4>
            <div class="form-grid-3">
              <div class="form-group">
                <label class="form-label required">Loại bàn phím</label>
                <select id="spec-kb-type" class="form-control" required>
                  <option value="">-- Chọn loại bàn phím --</option>
                  <option value="Bàn phím cơ">Bàn phím cơ (Mechanical)</option>
                  <option value="Bàn phím từ tính">Bàn phím từ tính (Magnetic Hall Effect)</option>
                  <option value="Bàn phím giả cơ">Bàn phím giả cơ (Semi-Mechanical)</option>
                  <option value="Bàn phím cao su">Bàn phím cao su (Membrane)</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Loại Switch</label>
                <select id="spec-kb-switch" class="form-control">
                  <option value="">-- Tùy chọn (Để trống) --</option>
                  <option value="Linear Red Switch">Linear Red Switch (Êm ái, mượt)</option>
                  <option value="Clicky Blue Switch">Clicky Blue Switch (Có tiếng clicky giòn)</option>
                  <option value="Tactile Brown Switch">Tactile Brown Switch (Có khấc nhẹ)</option>
                  <option value="Magnetic Hall Effect Switch">Magnetic Hall Effect Switch (Rapid Trigger)</option>
                  <option value="Optical Switch">Optical Switch (Quang học siêu bền)</option>
                  <option value="Custom Pre-lubed Switch">Custom Pre-lubed Switch (Lube sẵn)</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label required">Bố cục Layout</label>
                <select id="spec-kb-layout" class="form-control" required>
                  <option value="">-- Chọn Layout bàn phím --</option>
                  <option value="Fullsize 104 phím">Fullsize 104 phím (100% đầy đủ cụm số)</option>
                  <option value="Tenkeyless 87 phím">Tenkeyless 87 phím (TKL 80% bỏ cụm số)</option>
                  <option value="Compact 75%">Compact 75% (84 phím nhỏ gọn hot trend)</option>
                  <option value="Compact 68%">Compact 68% (65% siêu nhỏ gọn)</option>
                  <option value="Compact 60 phím">Compact 60 phím (60% mini)</option>
                  <option value="98 phím">98 phím (96% thu gọn có cụm số)</option>
                </select>
              </div>
            </div>
            <div class="form-grid-4" style="margin-top: 10px;">
              <div class="form-group">
                <label class="form-label required">Chuẩn kết nối</label>
                <select id="spec-kb-connection" class="form-control" required>
                  <option value="">-- Chọn chuẩn kết nối --</option>
                  <option value="3 Chế độ (Type-C, Wireless 2.4G, Bluetooth 5.0)">3 Chế độ (Type-C, Wireless 2.4G, Bluetooth 5.0)</option>
                  <option value="Cáp Type-C tháo rời">Cáp Type-C tháo rời (Có dây)</option>
                  <option value="Không dây 2.4GHz + Bluetooth">Không dây 2.4GHz + Bluetooth</option>
                  <option value="Dây USB liền">Dây USB liền</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Chất liệu Keycap</label>
                <select id="spec-kb-keycap" class="form-control">
                  <option value="">-- Tùy chọn (Để trống) --</option>
                  <option value="PBT Double-Shot">PBT Double-Shot (Bền, chống mòn bóng)</option>
                  <option value="PBT Dye-Sub">PBT Dye-Sub (In nhiệt sắc nét)</option>
                  <option value="ABS Double-Shot">ABS Double-Shot (Xuyên LED đẹp)</option>
                  <option value="ABS Laser">ABS Laser</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Đèn nền (Backlight)</label>
                <select id="spec-kb-backlight" class="form-control">
                  <option value="">-- Tùy chọn (Để trống) --</option>
                  <option value="LED RGB 16.8 triệu màu">LED RGB 16.8 triệu màu (Tùy biến)</option>
                  <option value="LED Đơn sắc Trắng">LED Đơn sắc Trắng</option>
                  <option value="LED Rainbow">LED Rainbow (Cố định màu từng hàng)</option>
                  <option value="Không có LED">Không có LED</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label required">Hỗ trợ LED RGB</label>
                <select id="spec-kb-rgb" class="form-control" required>
                  <option value="true">Có LED RGB</option>
                  <option value="false">Không có RGB</option>
                </select>
              </div>
            </div>
            <div class="form-grid-3" style="margin-top: 10px;">
              <div class="form-group">
                <label class="form-label">Tần số phản hồi (Polling Rate - Hz)</label>
                <select id="spec-kb-polling-rate" class="form-control">
                  <option value="">-- Tùy chọn (Để trống) --</option>
                  <option value="1000">1000 Hz (Tiêu chuẩn 1ms)</option>
                  <option value="2000">2000 Hz</option>
                  <option value="4000">4000 Hz</option>
                  <option value="8000">8000 Hz (0.125ms Siêu tốc)</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Dung lượng pin (mAh)</label>
                <select id="spec-kb-battery" class="form-control">
                  <option value="">-- Tùy chọn (Để trống) --</option>
                  <option value="2000">2000 mAh</option>
                  <option value="3000">3000 mAh</option>
                  <option value="4000">4000 mAh (Dùng lâu)</option>
                  <option value="5000">5000 mAh</option>
                  <option value="8000">8000 mAh (Dung lượng khủng)</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Kích thước</label>
                <input type="text" id="spec-kb-dimensions" class="form-control" placeholder="Ví dụ: 356 x 136 x 41 mm">
              </div>
            </div>
          `;

        case 'MOUSE':
          return `
            <h4 class="form-section-title"><i class="fa-solid fa-computer-mouse"></i> Thông số Chuột máy tính</h4>
            <div class="form-grid-3">
              <div class="form-group">
                <label class="form-label required">Cảm biến (Sensor)</label>
                <select id="spec-mouse-sensor" class="form-control" required>
                  <option value="">-- Chọn cảm biến --</option>
                  <option value="PixArt PAW3395">PixArt PAW3395 (Flagship cao cấp)</option>
                  <option value="Razer Focus Pro 30K">Razer Focus Pro 30K (Cực chính xác)</option>
                  <option value="Logitech HERO 25K">Logitech HERO 25K</option>
                  <option value="PixArt PMW3389">PixArt PMW3389</option>
                  <option value="PixArt PAW3335">PixArt PAW3335 (Tiết kiệm pin)</option>
                  <option value="PixArt 3311">PixArt 3311 (Tầm trung)</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label required">DPI tối đa</label>
                <select id="spec-mouse-dpi" class="form-control" required>
                  <option value="">-- Chọn DPI tối đa --</option>
                  <option value="6400">6400 DPI</option>
                  <option value="12000">12000 DPI</option>
                  <option value="16000">16000 DPI</option>
                  <option value="20000">20000 DPI</option>
                  <option value="25600">25600 DPI</option>
                  <option value="26000">26000 DPI</option>
                  <option value="30000">30000 DPI</option>
                  <option value="32000">32000 DPI</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Tần số phản hồi (Polling Rate - Hz)</label>
                <select id="spec-mouse-polling-rate" class="form-control">
                  <option value="">-- Tùy chọn (Để trống) --</option>
                  <option value="1000">1000 Hz (Tiêu chuẩn 1ms)</option>
                  <option value="2000">2000 Hz</option>
                  <option value="4000">4000 Hz (0.25ms Esports)</option>
                  <option value="8000">8000 Hz (0.125ms Đỉnh cao)</option>
                </select>
              </div>
            </div>
            <div class="form-grid-4" style="margin-top: 10px;">
              <div class="form-group">
                <label class="form-label required">Số nút bấm</label>
                <select id="spec-mouse-buttons" class="form-control" required>
                  <option value="">-- Chọn số nút --</option>
                  <option value="5">5 nút (Tiêu chuẩn gọn nhẹ)</option>
                  <option value="6">6 nút (Thêm nút chỉnh DPI)</option>
                  <option value="7">7 nút</option>
                  <option value="8">8 nút</option>
                  <option value="11">11 nút (Đa năng / Gaming MMO)</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label required">Kết nối</label>
                <select id="spec-mouse-connection" class="form-control" required>
                  <option value="">-- Chọn kết nối --</option>
                  <option value="3 Chế độ (Type-C, Wireless 2.4G, Bluetooth 5.0)">3 Chế độ (Type-C, Wireless 2.4G, Bluetooth 5.0)</option>
                  <option value="Không dây 2.4GHz siêu tốc (Đầu thu USB)">Không dây 2.4GHz siêu tốc (Đầu thu USB)</option>
                  <option value="Dây cáp bọc dù Type-C">Dây cáp bọc dù Type-C</option>
                  <option value="Dây USB liền">Dây USB liền</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Trọng lượng (g)</label>
                <select id="spec-mouse-weight" class="form-control">
                  <option value="">-- Tùy chọn (Để trống) --</option>
                  <option value="49.0">49.0 g (Siêu nhẹ Superlight)</option>
                  <option value="54.0">54.0 g</option>
                  <option value="58.0">58.0 g</option>
                  <option value="63.0">63.0 g (Tiêu chuẩn thi đấu)</option>
                  <option value="68.0">68.0 g</option>
                  <option value="75.0">75.0 g</option>
                  <option value="85.0">85.0 g</option>
                  <option value="95.0">95.0 g</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Dung lượng pin (mAh)</label>
                <select id="spec-mouse-battery" class="form-control">
                  <option value="">-- Tùy chọn (Để trống) --</option>
                  <option value="300">300 mAh (Tối ưu trọng lượng nhẹ)</option>
                  <option value="400">400 mAh</option>
                  <option value="500">500 mAh (Pin trâu 70-100h)</option>
                  <option value="800">800 mAh</option>
                </select>
              </div>
            </div>
            <div class="form-grid-2" style="margin-top: 10px;">
              <div class="form-group">
                <label class="form-label required">Đèn LED RGB</label>
                <select id="spec-mouse-rgb" class="form-control" required>
                  <option value="true">Có LED RGB</option>
                  <option value="false">Không có RGB</option>
                </select>
              </div>
            </div>
          `;

        case 'HEADSET':
          return `
            <h4 class="form-section-title"><i class="fa-solid fa-headphones"></i> Thông số Tai nghe máy tính</h4>
            <div class="form-grid-3">
              <div class="form-group">
                <label class="form-label required">Loại tai nghe</label>
                <select id="spec-headset-type" class="form-control" required>
                  <option value="">-- Chọn kiểu tai nghe --</option>
                  <option value="Chụp tai Over-ear">Chụp tai Over-ear (Trùm kín vành tai)</option>
                  <option value="Chụp tai On-ear">Chụp tai On-ear (Đặt trên vành tai)</option>
                  <option value="Nhét tai In-ear">Nhét tai In-ear (Gaming Earbuds)</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Đường kính củ loa (mm)</label>
                <select id="spec-headset-driver" class="form-control">
                  <option value="">-- Tùy chọn (Để trống) --</option>
                  <option value="10.0">10.0 mm (Dành cho In-ear)</option>
                  <option value="40.0">40.0 mm</option>
                  <option value="45.0">45.0 mm</option>
                  <option value="50.0">50.0 mm (Tiêu chuẩn Gaming)</option>
                  <option value="53.0">53.0 mm (Âm trường rộng)</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label required">Kết nối</label>
                <select id="spec-headset-connection" class="form-control" required>
                  <option value="">-- Chọn kết nối --</option>
                  <option value="Đa kết nối (Wireless 2.4G, Bluetooth, Jack 3.5mm)">Đa kết nối (Wireless 2.4G, Bluetooth, Jack 3.5mm)</option>
                  <option value="Jack 3.5mm tiêu chuẩn">Jack 3.5mm tiêu chuẩn</option>
                  <option value="USB Type-A (Tích hợp Soundcard DAC)">USB Type-A (Tích hợp Soundcard DAC)</option>
                  <option value="Không dây Wireless 2.4GHz độ trễ thấp">Không dây Wireless 2.4GHz độ trễ thấp</option>
                  <option value="Bluetooth 5.3">Bluetooth 5.3</option>
                </select>
              </div>
            </div>
            <div class="form-grid-3" style="margin-top: 10px;">
              <div class="form-group">
                <label class="form-label">Trở kháng (Ohm)</label>
                <select id="spec-headset-impedance" class="form-control">
                  <option value="">-- Tùy chọn (Để trống) --</option>
                  <option value="16.0">16.0 Ohm (Dễ kéo trên PC & Điện thoại)</option>
                  <option value="32.0">32.0 Ohm (Tiêu chuẩn Gaming)</option>
                  <option value="60.0">60.0 Ohm</option>
                  <option value="64.0">64.0 Ohm</option>
                  <option value="80.0">80.0 Ohm</option>
                  <option value="250.0">250.0 Ohm (Chuyên nghiệp)</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Dải tần đáp ứng</label>
                <select id="spec-headset-freq" class="form-control">
                  <option value="">-- Tùy chọn (Để trống) --</option>
                  <option value="20Hz - 20kHz">20Hz - 20kHz (Tiêu chuẩn)</option>
                  <option value="15Hz - 25kHz">15Hz - 25kHz</option>
                  <option value="10Hz - 40kHz (Hi-Res Audio)">10Hz - 40kHz (Chuẩn Hi-Res Audio)</option>
                  <option value="20Hz - 40kHz">20Hz - 40kHz</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label required">Tích hợp Microphone</label>
                <select id="spec-headset-mic" class="form-control" required>
                  <option value="true">Có Microphone</option>
                  <option value="false">Không có Mic</option>
                </select>
              </div>
            </div>
            <div class="form-grid-3" style="margin-top: 10px;">
              <div class="form-group">
                <label class="form-label">Khử tiếng ồn</label>
                <select id="spec-headset-noise-cancelling" class="form-control">
                  <option value="">-- Tùy chọn (Để trống) --</option>
                  <option value="Khử ồn chủ động ANC">Khử ồn chủ động ANC</option>
                  <option value="Microphone lọc ồn ENC">Microphone lọc ồn ENC</option>
                  <option value="Cách âm thụ động">Cách âm thụ động (Đệm da dày)</option>
                  <option value="Không có">Không có</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Âm thanh vòm</label>
                <select id="spec-headset-surround" class="form-control">
                  <option value="">-- Tùy chọn (Để trống) --</option>
                  <option value="7.1 Virtual Surround Sound">7.1 Virtual Surround Sound (Âm vòm 7.1)</option>
                  <option value="DTS Headphone:X 2.0">DTS Headphone:X 2.0</option>
                  <option value="THX Spatial Audio">THX Spatial Audio</option>
                  <option value="Stereo 2.0">Stereo 2.0</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Dung lượng pin (mAh)</label>
                <select id="spec-headset-battery" class="form-control">
                  <option value="">-- Tùy chọn (Để trống) --</option>
                  <option value="1000">1000 mAh</option>
                  <option value="1200">1200 mAh</option>
                  <option value="1500">1500 mAh (Dùng trên 50 giờ)</option>
                  <option value="2000">2000 mAh (Dùng đến 100 giờ)</option>
                </select>
              </div>
            </div>
          `;

        case 'SPEAKER':
          return `
            <h4 class="form-section-title"><i class="fa-solid fa-volume-high"></i> Thông số Loa máy tính</h4>
            <div class="form-grid-3">
              <div class="form-group">
                <label class="form-label required">Loại loa</label>
                <select id="spec-speaker-type" class="form-control" required>
                  <option value="">-- Chọn loại loa --</option>
                  <option value="Loa để bàn">Loa để bàn (Cặp loa 2 bên)</option>
                  <option value="Loa kèm Subwoofer">Loa kèm Subwoofer (Trầm ấm)</option>
                  <option value="Loa thanh Soundbar">Loa thanh Soundbar (Dưới màn hình)</option>
                  <option value="Loa di động">Loa di động</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label required">Kênh âm thanh (Channels)</label>
                <select id="spec-speaker-channels" class="form-control" required>
                  <option value="">-- Chọn kênh âm thanh --</option>
                  <option value="2.0">2.0 Kênh (Stereo Trái - Phải)</option>
                  <option value="2.1">2.1 Kênh (2 vệ tinh + 1 Loa Sub)</option>
                  <option value="5.1">5.1 Kênh (Âm thanh vòm đa kênh)</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label required">Công suất (Watt)</label>
                <select id="spec-speaker-power" class="form-control" required>
                  <option value="">-- Chọn công suất --</option>
                  <option value="10.0">10.0 W (Nhỏ gọn USB)</option>
                  <option value="16.0">16.0 W</option>
                  <option value="24.0">24.0 W (Phổ thông phòng nhỏ)</option>
                  <option value="36.0">36.0 W</option>
                  <option value="42.0">42.0 W</option>
                  <option value="60.0">60.0 W (Mạnh mẽ)</option>
                  <option value="80.0">80.0 W</option>
                  <option value="120.0">120.0 W (Công suất khủng)</option>
                </select>
              </div>
            </div>
            <div class="form-grid-4" style="margin-top: 10px;">
              <div class="form-group">
                <label class="form-label">Dải tần đáp ứng</label>
                <select id="spec-speaker-freq" class="form-control">
                  <option value="">-- Tùy chọn (Để trống) --</option>
                  <option value="50Hz - 20kHz">50Hz - 20kHz</option>
                  <option value="40Hz - 20kHz">40Hz - 20kHz (Bass sâu 40Hz)</option>
                  <option value="60Hz - 18kHz">60Hz - 18kHz</option>
                  <option value="30Hz - 20kHz">30Hz - 20kHz (Subwoofer chuyên dụng)</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Trở kháng (Ohm)</label>
                <select id="spec-speaker-impedance" class="form-control">
                  <option value="">-- Tùy chọn (Để trống) --</option>
                  <option value="4.0">4.0 Ohm</option>
                  <option value="6.0">6.0 Ohm</option>
                  <option value="8.0">8.0 Ohm</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label required">Cổng kết nối</label>
                <select id="spec-speaker-connection" class="form-control" required>
                  <option value="">-- Chọn cổng kết nối --</option>
                  <option value="AUX 3.5mm, Bluetooth, USB">AUX 3.5mm, Bluetooth, USB (Đa năng)</option>
                  <option value="AUX 3.5mm & Cấp nguồn USB">AUX 3.5mm & Cấp nguồn USB (Đơn giản)</option>
                  <option value="Bluetooth 5.3 & Jack 3.5mm">Bluetooth 5.3 & Jack 3.5mm</option>
                  <option value="Optical Quang học, Coaxial, 3.5mm">Optical Quang học, Coaxial, 3.5mm</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Phiên bản Bluetooth</label>
                <select id="spec-speaker-bluetooth" class="form-control">
                  <option value="">-- Không có Bluetooth --</option>
                  <option value="Bluetooth 5.3">Bluetooth 5.3 (Mới nhất, tiết kiệm pin)</option>
                  <option value="Bluetooth 5.2">Bluetooth 5.2</option>
                  <option value="Bluetooth 5.0">Bluetooth 5.0</option>
                </select>
              </div>
            </div>
            <div class="form-grid-2" style="margin-top: 10px;">
              <div class="form-group">
                <label class="form-label required">Đèn LED RGB</label>
                <select id="spec-speaker-rgb" class="form-control" required>
                  <option value="false">Không có RGB</option>
                  <option value="true">Có LED RGB đổi màu</option>
                </select>
              </div>
            </div>
          `;

        default:
          return '';
      }
    },

    /**
     * Nạp dữ liệu Spec vào form khi mở Edit Modal
     */
    fillSpecsFormData: function (p) {
      if (!p) return;
      const type = p.productType;
      const spec = p.specData || p.cpuSpecs || p.gpuSpecs || p.motherboardSpecs || p.ramSpecs ||
        p.ssdSpecs || p.hddSpecs || p.psuSpecs || p.caseSpecs || p.coolerSpecs ||
        p.monitorSpecs || p.keyboardSpecs || p.mouseSpecs || p.headsetSpecs || p.speakerSpecs;

      if (!spec) return;

      const setVal = (id, val) => {
        const el = document.getElementById(id);
        if (!el || val === undefined || val === null) return;
        if (el.tagName === 'SELECT') {
          const valStr = String(val).trim();
          const exists = Array.from(el.options).some(opt => String(opt.value).trim() === valStr);
          if (!exists && valStr !== '') {
            const opt = document.createElement('option');
            opt.value = val;
            opt.textContent = `${val} (Hiện tại)`;
            el.appendChild(opt);
          }
        }
        el.value = val;
      };

      if (type === 'COMPONENT') {
        const comp = p.componentType;
        if (comp === 'CPU') {
          setVal('spec-cpu-socket', spec.socket);
          setVal('spec-cpu-cores', spec.cores);
          setVal('spec-cpu-threads', spec.threads);
          setVal('spec-cpu-base-clock', spec.baseClock);
          setVal('spec-cpu-boost-clock', spec.boostClock);
          setVal('spec-cpu-cache-mb', spec.cacheMb);
          setVal('spec-cpu-igpu', spec.integratedGraphics);
        } else if (comp === 'GPU') {
          setVal('spec-gpu-chipset', spec.chipSet);
          setVal('spec-gpu-vram', spec.vramGb);
          setVal('spec-gpu-memory-type', spec.memoryType);
          setVal('spec-gpu-length', spec.lengthMm);
          setVal('spec-gpu-width-slots', spec.widthSlots);
          setVal('spec-gpu-psu-watt', spec.recommendedPsuWatt);
          setVal('spec-gpu-power-connector', spec.powerConnector);
        } else if (comp === 'MAINBOARD') {
          setVal('spec-mb-socket', spec.socket);
          setVal('spec-mb-chipset', spec.chipset);
          setVal('spec-mb-memory-type', spec.memoryType);
          setVal('spec-mb-max-ram', spec.maxRamGb);
          setVal('spec-mb-ram-slots', spec.ramSlots);
          setVal('spec-mb-form-factor', spec.formFactor);
          setVal('spec-mb-m2-slots', spec.m2Slots);
          setVal('spec-mb-sata-ports', spec.sataPorts);
          setVal('spec-mb-wifi', spec.wifi ? 'true' : 'false');
          setVal('spec-mb-bluetooth', spec.bluetooth ? 'true' : 'false');
        } else if (comp === 'RAM') {
          setVal('spec-ram-capacity', spec.capacityGb);
          setVal('spec-ram-memory-type', spec.memoryType);
          setVal('spec-ram-speed', spec.speedMhz);
          setVal('spec-ram-module-count', spec.moduleCount);
          setVal('spec-ram-voltage', spec.voltage);
        } else if (comp === 'SSD') {
          setVal('spec-ssd-capacity', spec.capacityGb);
          setVal('spec-ssd-interface', spec.interfaceType);
          setVal('spec-ssd-form-factor', spec.formFactor);
          setVal('spec-ssd-read-speed', spec.readSpeedMb);
          setVal('spec-ssd-write-speed', spec.writeSpeedMb);
          setVal('spec-ssd-nand-type', spec.nandType);
        } else if (comp === 'HDD') {
          setVal('spec-hdd-capacity', spec.capacityGb);
          setVal('spec-hdd-rpm', spec.rpm);
          setVal('spec-hdd-cache', spec.cacheMb);
          setVal('spec-hdd-interface', spec.interfaceType);
        } else if (comp === 'PSU') {
          setVal('spec-psu-wattage', spec.wattage);
          setVal('spec-psu-efficiency', spec.efficiencyRating);
          setVal('spec-psu-modular', spec.modularType);
          setVal('spec-psu-form-factor', spec.formFactor);
        } else if (comp === 'CASE') {
          setVal('spec-case-form-factor', spec.formFactorSupport);
          setVal('spec-case-max-gpu', spec.maxGpuLengthMm);
          setVal('spec-case-max-cpu-cooler', spec.maxCpuCoolerHeightMm);
          setVal('spec-case-max-radiator', spec.maxRadiatorSizeMm);
          setVal('spec-case-drive-bays', spec.driveBays);
        } else if (comp === 'COOLER') {
          setVal('spec-cooler-type', spec.coolerType);
          setVal('spec-cooler-sockets', spec.supportedSockets);
          setVal('spec-cooler-radiator', spec.radiatorSizeMm);
          setVal('spec-cooler-fan-size', spec.fanSizeMm);
          setVal('spec-cooler-height', spec.heightMm);
          setVal('spec-cooler-tdp', spec.tdpSupport);
        }
      } else if (type === 'ACCESSORY') {
        const acc = p.accessoryType || 'MONITOR';
        if (acc === 'MONITOR' || spec.screenSizeInch !== undefined) {
          setVal('spec-monitor-screen-size', spec.screenSizeInch);
          setVal('spec-monitor-resolution', spec.resolution);
          setVal('spec-monitor-refresh-rate', spec.refreshRateHz);
          setVal('spec-monitor-panel-type', spec.panelType);
          setVal('spec-monitor-response-time', spec.responseTimeMs);
          setVal('spec-monitor-brightness', spec.brightnessNits);
          setVal('spec-monitor-aspect-ratio', spec.aspectRatio);
          setVal('spec-monitor-adaptive-sync', spec.adaptiveSync);
          setVal('spec-monitor-ports', spec.ports);
        } else if (acc === 'KEYBOARD' || spec.keyboardType !== undefined) {
          setVal('spec-kb-type', spec.keyboardType);
          setVal('spec-kb-switch', spec.switchType);
          setVal('spec-kb-layout', spec.layout);
          setVal('spec-kb-connection', spec.connection);
          setVal('spec-kb-keycap', spec.keycapMaterial);
          setVal('spec-kb-backlight', spec.backlight);
          setVal('spec-kb-rgb', spec.rgb ? 'true' : 'false');
          setVal('spec-kb-polling-rate', spec.pollingRateHz);
          setVal('spec-kb-battery', spec.batteryMah);
          setVal('spec-kb-dimensions', spec.dimensions);
        } else if (acc === 'MOUSE' || spec.sensor !== undefined) {
          setVal('spec-mouse-sensor', spec.sensor);
          setVal('spec-mouse-dpi', spec.dpiMax);
          setVal('spec-mouse-polling-rate', spec.pollingRateHz);
          setVal('spec-mouse-buttons', spec.buttons);
          setVal('spec-mouse-connection', spec.connection);
          setVal('spec-mouse-weight', spec.weightG);
          setVal('spec-mouse-battery', spec.batteryMah);
          setVal('spec-mouse-rgb', spec.rgb ? 'true' : 'false');
        } else if (acc === 'HEADSET' || spec.headsetType !== undefined) {
          setVal('spec-headset-type', spec.headsetType);
          setVal('spec-headset-driver', spec.driverSizeMm);
          setVal('spec-headset-connection', spec.connection);
          setVal('spec-headset-impedance', spec.impedanceOhm);
          setVal('spec-headset-freq', spec.frequencyResponse);
          setVal('spec-headset-mic', spec.microphone ? 'true' : 'false');
          setVal('spec-headset-noise-cancelling', spec.noiseCancellation);
          setVal('spec-headset-surround', spec.surroundSound);
          setVal('spec-headset-battery', spec.batteryMah);
        } else if (acc === 'SPEAKER' || spec.speakerType !== undefined) {
          setVal('spec-speaker-type', spec.speakerType);
          setVal('spec-speaker-channels', spec.channels);
          setVal('spec-speaker-power', spec.powerWatt);
          setVal('spec-speaker-freq', spec.frequencyResponse);
          setVal('spec-speaker-impedance', spec.impedanceOhm);
          setVal('spec-speaker-connection', spec.connection);
          setVal('spec-speaker-bluetooth', spec.bluetoothVersion);
          setVal('spec-speaker-rgb', spec.rgb ? 'true' : 'false');
        }
      }
    },

    /**
     * Thu thập dữ liệu các trường Specs và nạp vào payload trước khi gửi API
     */
    collectSpecsFormData: function (payload, productType, componentType, accessoryType) {
      const getVal = (id) => document.getElementById(id)?.value?.trim() || null;
      const getNum = (id) => {
        const v = document.getElementById(id)?.value?.trim();
        return (v !== '' && v !== null && v !== undefined && !isNaN(v)) ? Number(v) : null;
      };
      const getBool = (id) => {
        const v = document.getElementById(id)?.value;
        return v === 'true';
      };

      if (productType === 'COMPONENT') {
        if (componentType === 'CPU') {
          payload.cpuSpecs = {
            socket: getVal('spec-cpu-socket'),
            cores: getNum('spec-cpu-cores'),
            threads: getNum('spec-cpu-threads'),
            baseClock: getNum('spec-cpu-base-clock'),
            boostClock: getNum('spec-cpu-boost-clock'),
            cacheMb: getNum('spec-cpu-cache-mb'),
            integratedGraphics: getVal('spec-cpu-igpu')
          };
        } else if (componentType === 'GPU') {
          payload.gpuSpecs = {
            chipSet: getVal('spec-gpu-chipset'),
            vramGb: getNum('spec-gpu-vram'),
            memoryType: getVal('spec-gpu-memory-type'),
            lengthMm: getNum('spec-gpu-length'),
            widthSlots: getNum('spec-gpu-width-slots'),
            recommendedPsuWatt: getNum('spec-gpu-psu-watt'),
            powerConnector: getVal('spec-gpu-power-connector')
          };
        } else if (componentType === 'MAINBOARD') {
          payload.motherboardSpecs = {
            socket: getVal('spec-mb-socket'),
            chipset: getVal('spec-mb-chipset'),
            memoryType: getVal('spec-mb-memory-type'),
            maxRamGb: getNum('spec-mb-max-ram'),
            ramSlots: getNum('spec-mb-ram-slots'),
            formFactor: getVal('spec-mb-form-factor'),
            m2Slots: getNum('spec-mb-m2-slots'),
            sataPorts: getNum('spec-mb-sata-ports'),
            wifi: getBool('spec-mb-wifi'),
            bluetooth: getBool('spec-mb-bluetooth')
          };
        } else if (componentType === 'RAM') {
          payload.ramSpecs = {
            capacityGb: getNum('spec-ram-capacity'),
            memoryType: getVal('spec-ram-memory-type'),
            speedMhz: getNum('spec-ram-speed'),
            moduleCount: getNum('spec-ram-module-count') || 1,
            voltage: getNum('spec-ram-voltage')
          };
        } else if (componentType === 'SSD') {
          payload.ssdSpecs = {
            capacityGb: getNum('spec-ssd-capacity'),
            interfaceType: getVal('spec-ssd-interface'),
            formFactor: getVal('spec-ssd-form-factor'),
            readSpeedMb: getNum('spec-ssd-read-speed'),
            writeSpeedMb: getNum('spec-ssd-write-speed'),
            nandType: getVal('spec-ssd-nand-type')
          };
        } else if (componentType === 'HDD') {
          payload.hddSpecs = {
            capacityGb: getNum('spec-hdd-capacity'),
            rpm: getNum('spec-hdd-rpm'),
            cacheMb: getNum('spec-hdd-cache'),
            interfaceType: getVal('spec-hdd-interface')
          };
        } else if (componentType === 'PSU') {
          payload.psuSpecs = {
            wattage: getNum('spec-psu-wattage'),
            efficiencyRating: getVal('spec-psu-efficiency'),
            modularType: getVal('spec-psu-modular'),
            formFactor: getVal('spec-psu-form-factor')
          };
        } else if (componentType === 'CASE') {
          payload.caseSpecs = {
            formFactorSupport: getVal('spec-case-form-factor'),
            maxGpuLengthMm: getNum('spec-case-max-gpu'),
            maxCpuCoolerHeightMm: getNum('spec-case-max-cpu-cooler'),
            maxRadiatorSizeMm: getNum('spec-case-max-radiator'),
            driveBays: getNum('spec-case-drive-bays')
          };
        } else if (componentType === 'COOLER') {
          payload.coolerSpecs = {
            coolerType: getVal('spec-cooler-type'),
            supportedSockets: getVal('spec-cooler-sockets'),
            radiatorSizeMm: getNum('spec-cooler-radiator'),
            fanSizeMm: getNum('spec-cooler-fan-size'),
            heightMm: getNum('spec-cooler-height'),
            tdpSupport: getNum('spec-cooler-tdp')
          };
        }
      } else if (productType === 'ACCESSORY') {
        if (accessoryType === 'MONITOR') {
          payload.monitorSpecs = {
            screenSizeInch: getNum('spec-monitor-screen-size'),
            resolution: getVal('spec-monitor-resolution'),
            refreshRateHz: getNum('spec-monitor-refresh-rate'),
            panelType: getVal('spec-monitor-panel-type'),
            responseTimeMs: getNum('spec-monitor-response-time'),
            brightnessNits: getNum('spec-monitor-brightness'),
            aspectRatio: getVal('spec-monitor-aspect-ratio'),
            adaptiveSync: getVal('spec-monitor-adaptive-sync'),
            ports: getVal('spec-monitor-ports')
          };
        } else if (accessoryType === 'KEYBOARD') {
          payload.keyboardSpecs = {
            keyboardType: getVal('spec-kb-type'),
            switchType: getVal('spec-kb-switch'),
            layout: getVal('spec-kb-layout'),
            connection: getVal('spec-kb-connection'),
            keycapMaterial: getVal('spec-kb-keycap'),
            backlight: getVal('spec-kb-backlight'),
            rgb: getBool('spec-kb-rgb'),
            pollingRateHz: getNum('spec-kb-polling-rate'),
            batteryMah: getNum('spec-kb-battery'),
            dimensions: getVal('spec-kb-dimensions')
          };
        } else if (accessoryType === 'MOUSE') {
          payload.mouseSpecs = {
            sensor: getVal('spec-mouse-sensor'),
            dpiMax: getNum('spec-mouse-dpi'),
            pollingRateHz: getNum('spec-mouse-polling-rate'),
            buttons: getNum('spec-mouse-buttons'),
            connection: getVal('spec-mouse-connection'),
            weightG: getNum('spec-mouse-weight'),
            batteryMah: getNum('spec-mouse-battery'),
            rgb: getBool('spec-mouse-rgb')
          };
        } else if (accessoryType === 'HEADSET') {
          payload.headsetSpecs = {
            headsetType: getVal('spec-headset-type'),
            driverSizeMm: getNum('spec-headset-driver'),
            connection: getVal('spec-headset-connection'),
            impedanceOhm: getNum('spec-headset-impedance'),
            frequencyResponse: getVal('spec-headset-freq'),
            microphone: getBool('spec-headset-mic'),
            noiseCancellation: getVal('spec-headset-noise-cancelling'),
            surroundSound: getVal('spec-headset-surround'),
            batteryMah: getNum('spec-headset-battery')
          };
        } else if (accessoryType === 'SPEAKER') {
          payload.speakerSpecs = {
            speakerType: getVal('spec-speaker-type'),
            channels: getVal('spec-speaker-channels'),
            powerWatt: getNum('spec-speaker-power'),
            frequencyResponse: getVal('spec-speaker-freq'),
            impedanceOhm: getNum('spec-speaker-impedance'),
            connection: getVal('spec-speaker-connection'),
            bluetoothVersion: getVal('spec-speaker-bluetooth'),
            rgb: getBool('spec-speaker-rgb')
          };
        }
      }
    },

    /**
     * Sinh HTML bảng hiển thị Thông số kỹ thuật chi tiết khi xem sản phẩm
     */
    renderSpecsDetailHtml: function (p) {
      if (!p || p.productType === 'PC') return '';
      const type = p.productType;
      const spec = p.specData || p.cpuSpecs || p.gpuSpecs || p.motherboardSpecs || p.ramSpecs ||
        p.ssdSpecs || p.hddSpecs || p.psuSpecs || p.caseSpecs || p.coolerSpecs ||
        p.monitorSpecs || p.keyboardSpecs || p.mouseSpecs || p.headsetSpecs || p.speakerSpecs;

      if (!spec) {
        return `
          <div class="spec-detail-box" style="margin-top: 16px;">
            <div class="spec-detail-header">
              <i class="fa-solid fa-list-check text-primary"></i> Thông số kỹ thuật
            </div>
            <div style="padding: 16px; font-size: 13px; color: #64748b; text-align: center;">
              Chưa có thông số kỹ thuật chi tiết nào được lưu cho sản phẩm này.
            </div>
          </div>
        `;
      }

      let rows = [];
      let title = 'Thông số kỹ thuật chi tiết';

      const row = (name, val, unit = '') => {
        if (val !== undefined && val !== null && val !== '') {
          rows.push(`<tr><td class="spec-name">${name}</td><td class="spec-val">${val}${unit ? ' ' + unit : ''}</td></tr>`);
        }
      };

      if (type === 'COMPONENT') {
        const comp = p.componentType;
        title = window.TDT_DICTIONARY ? window.TDT_DICTIONARY.getSpecsTitle(comp) : 'Thông số linh kiện';
        if (comp === 'CPU') {
          row('Socket', spec.socket);
          row('Số nhân (Cores)', spec.cores);
          row('Số luồng (Threads)', spec.threads);
          row('Xung nhịp cơ bản', spec.baseClock, 'GHz');
          row('Xung nhịp tối đa', spec.boostClock, 'GHz');
          row('Bộ nhớ đệm Cache', spec.cacheMb, 'MB');
          row('Đồ họa tích hợp', spec.integratedGraphics);
        } else if (comp === 'GPU') {
          row('Chipset', spec.chipSet);
          row('Dung lượng VRAM', spec.vramGb, 'GB');
          row('Chuẩn bộ nhớ', spec.memoryType);
          row('Chiều dài card', spec.lengthMm, 'mm');
          row('Độ dày', spec.widthSlots, 'Slots');
          row('Nguồn đề xuất', spec.recommendedPsuWatt, 'W');
          row('Cổng cấp nguồn', spec.powerConnector);
        } else if (comp === 'MAINBOARD') {
          row('Socket', spec.socket);
          row('Chipset', spec.chipset);
          row('Chuẩn RAM', spec.memoryType);
          row('Dung lượng RAM tối đa', spec.maxRamGb, 'GB');
          row('Số khe cắm RAM', spec.ramSlots);
          row('Kích thước (Form Factor)', spec.formFactor);
          row('Số khe cắm M.2', spec.m2Slots);
          row('Số cổng SATA', spec.sataPorts);
          row('Tích hợp Wi-Fi', spec.wifi ? 'Có Wi-Fi tích hợp' : 'Không');
          row('Tích hợp Bluetooth', spec.bluetooth ? 'Có Bluetooth tích hợp' : 'Không');
        } else if (comp === 'RAM') {
          row('Dung lượng', spec.capacityGb, 'GB');
          row('Chuẩn RAM', spec.memoryType);
          row('Tốc độ bus', spec.speedMhz, 'MHz');
          row('Số thanh trong bộ', spec.moduleCount);
          row('Điện áp hoạt động', spec.voltage, 'V');
        } else if (comp === 'SSD') {
          row('Dung lượng', spec.capacityGb, 'GB');
          row('Chuẩn giao tiếp', spec.interfaceType);
          row('Kích thước', spec.formFactor);
          row('Tốc độ đọc tối đa', spec.readSpeedMb, 'MB/s');
          row('Tốc độ ghi tối đa', spec.writeSpeedMb, 'MB/s');
          row('Loại NAND Flash', spec.nandType);
        } else if (comp === 'HDD') {
          row('Dung lượng', spec.capacityGb, 'GB');
          row('Tốc độ vòng quay', spec.rpm, 'RPM');
          row('Bộ nhớ đệm', spec.cacheMb, 'MB');
          row('Chuẩn giao tiếp', spec.interfaceType);
        } else if (comp === 'PSU') {
          row('Công suất thực', spec.wattage, 'W');
          row('Chuẩn hiệu suất', spec.efficiencyRating);
          row('Kiểu dây', spec.modularType);
          row('Kích thước', spec.formFactor);
        } else if (comp === 'CASE') {
          row('Bo mạch hỗ trợ', spec.formFactorSupport);
          row('Chiều dài GPU tối đa', spec.maxGpuLengthMm, 'mm');
          row('Chiều cao tản CPU tối đa', spec.maxCpuCoolerHeightMm, 'mm');
          row('Kích thước Rad tối đa', spec.maxRadiatorSizeMm, 'mm');
          row('Số khay ổ cứng', spec.driveBays);
        } else if (comp === 'COOLER') {
          row('Loại tản nhiệt', spec.coolerType);
          row('Socket hỗ trợ', spec.supportedSockets);
          row('Kích thước két tản', spec.radiatorSizeMm, 'mm');
          row('Kích thước quạt', spec.fanSizeMm, 'mm');
          row('Chiều cao tản', spec.heightMm, 'mm');
          row('TDP tối đa', spec.tdpSupport, 'W');
        }
      } else if (type === 'ACCESSORY') {
        let accKey = p.accessoryType;
        if (!accKey) {
          if (spec.screenSizeInch !== undefined) accKey = 'MONITOR';
          else if (spec.keyboardType !== undefined) accKey = 'KEYBOARD';
          else if (spec.sensor !== undefined) accKey = 'MOUSE';
          else if (spec.headsetType !== undefined) accKey = 'HEADSET';
          else if (spec.speakerType !== undefined) accKey = 'SPEAKER';
        }
        title = window.TDT_DICTIONARY ? window.TDT_DICTIONARY.getSpecsTitle(accKey) : 'Thông số phụ kiện máy tính';

        if (accKey === 'MONITOR' || spec.screenSizeInch !== undefined) {
          row('Kích thước', spec.screenSizeInch, 'inch');
          row('Độ phân giải', spec.resolution);
          row('Tần số quét', spec.refreshRateHz, 'Hz');
          row('Tấm nền', spec.panelType);
          row('Thời gian phản hồi', spec.responseTimeMs, 'ms');
          row('Độ sáng', spec.brightnessNits, 'nits');
          row('Tỷ lệ khung hình', spec.aspectRatio);
          row('Công nghệ đồng bộ', spec.adaptiveSync);
          row('Cổng kết nối', spec.ports);
        } else if (accKey === 'KEYBOARD' || spec.keyboardType !== undefined) {
          row('Loại bàn phím', spec.keyboardType);
          row('Loại Switch', spec.switchType);
          row('Layout', spec.layout);
          row('Kết nối', spec.connection);
          row('Chất liệu Keycap', spec.keycapMaterial);
          row('Đèn nền', spec.backlight);
          row('Đèn RGB', spec.rgb ? 'Có RGB' : 'Không');
          row('Tần số phản hồi', spec.pollingRateHz, 'Hz');
          row('Dung lượng pin', spec.batteryMah, 'mAh');
          row('Kích thước', spec.dimensions);
        } else if (accKey === 'MOUSE' || spec.sensor !== undefined) {
          row('Cảm biến', spec.sensor);
          row('DPI tối đa', spec.dpiMax);
          row('Tần số phản hồi', spec.pollingRateHz, 'Hz');
          row('Số nút bấm', spec.buttons);
          row('Kết nối', spec.connection);
          row('Trọng lượng', spec.weightG, 'g');
          row('Dung lượng pin', spec.batteryMah, 'mAh');
          row('Đèn LED RGB', spec.rgb ? 'Có RGB' : 'Không');
        } else if (accKey === 'HEADSET' || spec.headsetType !== undefined) {
          row('Kiểu tai nghe', spec.headsetType);
          row('Đường kính màng loa', spec.driverSizeMm, 'mm');
          row('Kết nối', spec.connection);
          row('Trở kháng', spec.impedanceOhm, 'Ohm');
          row('Dải tần', spec.frequencyResponse);
          row('Microphone', spec.microphone ? 'Có Microphone' : 'Không');
          row('Khử tiếng ồn', spec.noiseCancellation);
          row('Âm thanh vòm', spec.surroundSound);
          row('Dung lượng pin', spec.batteryMah, 'mAh');
        } else if (accKey === 'SPEAKER' || spec.speakerType !== undefined) {
          row('Loại loa', spec.speakerType);
          row('Số kênh', spec.channels);
          row('Công suất', spec.powerWatt, 'W');
          row('Dải tần', spec.frequencyResponse);
          row('Trở kháng', spec.impedanceOhm, 'Ohm');
          row('Kết nối', spec.connection);
          row('Phiên bản Bluetooth', spec.bluetoothVersion);
          row('Đèn LED RGB', spec.rgb ? 'Có RGB' : 'Không');
        }
      }

      if (rows.length === 0) {
        return `
          <div class="spec-detail-box" style="margin-top: 16px;">
            <div class="spec-detail-header"><i class="fa-solid fa-list-check text-primary"></i> ${title}</div>
            <div style="padding: 16px; font-size: 13px; color: #64748b; text-align: center;">Chưa có thông số chi tiết nào được ghi nhận.</div>
          </div>
        `;
      }

      return `
        <div class="spec-detail-box" style="margin-top: 16px;">
          <div class="spec-detail-header">
            <i class="fa-solid fa-sliders text-primary"></i> ${title}
          </div>
          <table class="spec-detail-table">
            <tbody>
              ${rows.join('')}
            </tbody>
          </table>
        </div>
      `;
    }
  };

  // Đồng bộ cho các nút gọi onclick inline trên HTML
  window.SanPhamLogic = SanPhamLogic;
  window.SanPhamComponent = SanPhamLogic;
})();
