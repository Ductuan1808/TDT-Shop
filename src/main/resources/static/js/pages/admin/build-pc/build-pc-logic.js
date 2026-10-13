/**
 * =========================================================================
 * build-pc-logic.js - Xử lý logic giao diện, modal cấu hình,
 * kiểm tra tương thích giữa 8 loại linh kiện và 1 phụ kiện màn hình
 * =========================================================================
 */

(function () {
  'use strict';

  // Trạng thái cục bộ của màn hình Build PC
  let currentPage = 1;
  const pageSize = 10;
  let currentKeyword = '';
  let currentStatus = '';

  // Bộ đệm danh sách linh kiện đã tải
  const componentsCache = {
    PC: [],
    CPU: [],
    MAINBOARD: [],
    RAM: [],
    GPU: [],
    SSD: [],
    PSU: [],
    CASE: [],
    COOLER: [],
    MONITOR: []
  };

  const BuildPcLogic = {
    /**
     * Khởi tạo giao diện khi nạp màn Build PC
     */
    init: async function () {
      this.bindBackdropClose();
      await this.loadAllComponentOptions();
      await this.loadBuilds();
    },

    /**
     * Bắt sự kiện đóng modal khi click ra ngoài backdrop hoặc ấn Esc
     */
    bindBackdropClose: function () {
      const modalIds = ['build-pc-modal', 'build-detail-modal', 'build-compat-modal'];
      for (let i = 0; i < modalIds.length; i++) {
        const id = modalIds[i];
        const modal = document.getElementById(id);
        if (modal) {
          modal.onclick = (e) => {
            if (e.target === modal) {
              this.closeModal();
              this.closeDetailModal();
              this.closeCompatModal();
            }
          };
        }
      }

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.closeModal();
          this.closeDetailModal();
          this.closeCompatModal();
        }
      });
    },

    /**
     * Nạp dữ liệu các dropdown cho 8 linh kiện, màn hình và máy PC đại diện
     */
    loadAllComponentOptions: async function () {
      if (!window.BuildPcApi) return;

      // 1. Nạp danh sách máy PC đại diện
      try {
        const pcList = await window.BuildPcApi.getPcProducts();
        componentsCache.PC = pcList || [];
        this.fillSelectOptions('build-product-id', componentsCache.PC, '-- Chọn sản phẩm PC đại diện --');
      } catch (err) {
        console.error('[BuildPcLogic] Lỗi tải danh sách PC:', err);
      }

      // 2. Nạp 8 loại linh kiện chính và 1 phụ kiện màn hình
      const types = ['CPU', 'MAINBOARD', 'RAM', 'GPU', 'SSD', 'PSU', 'CASE', 'COOLER', 'MONITOR'];
      for (let i = 0; i < types.length; i++) {
        const type = types[i];
        try {
          const list = await window.BuildPcApi.getComponentsByType(type);
          componentsCache[type] = list || [];
          const selectId = this.getSelectIdByType(type);
          if (selectId) {
            const placeholder = type === 'MONITOR' ? '-- Không kèm màn hình (Mua riêng) --' : `-- Chọn ${type} --`;
            this.fillSelectOptions(selectId, componentsCache[type], placeholder);
          }
        } catch (err) {
          console.error(`[BuildPcLogic] Lỗi tải linh kiện ${type}:`, err);
        }
      }
    },

    getSelectIdByType: function (type) {
      const map = {
        CPU: 'pick-cpu',
        MAINBOARD: 'pick-mainboard',
        RAM: 'pick-ram',
        GPU: 'pick-gpu',
        SSD: 'pick-ssd',
        PSU: 'pick-psu',
        CASE: 'pick-case',
        COOLER: 'pick-cooler',
        MONITOR: 'pick-monitor'
      };
      return map[type] || null;
    },

    /**
     * Đổ dữ liệu vào phần tử select
     */
    fillSelectOptions: function (selectId, items, placeholder) {
      const select = document.getElementById(selectId);
      if (!select) return;

      let html = `<option value="">${placeholder}</option>`;
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        let label = item.name;
        if (item.price) {
          label += ` - ${this.formatCurrency(item.price)}`;
        }
        html += `<option value="${item.id}" data-price="${item.price || 0}">${label}</option>`;
      }
      select.innerHTML = html;
    },

    /**
     * Tải danh sách dàn PC cấu hình sẵn từ API
     */
    loadBuilds: async function (page = 1) {
      if (!window.BuildPcApi) return;
      currentPage = page;

      const tbody = document.getElementById('build-pc-table-body');
      if (tbody) {
        tbody.innerHTML = `
          <tr>
            <td colspan="7" style="text-align: center; padding: 32px; color: #64748b;">
              <i class="fa-solid fa-spinner fa-spin" style="font-size: 20px; margin-bottom: 8px;"></i>
              <p>Đang tải danh sách dàn PC...</p>
            </td>
          </tr>
        `;
      }

      try {
        const res = await window.BuildPcApi.getPcBuilds({
          keyword: currentKeyword,
          status: currentStatus,
          page: currentPage,
          size: pageSize
        });

        this.renderTable(res.content || []);
        this.renderPagination(res);
      } catch (err) {
        console.error('[BuildPcLogic] Lỗi tải danh sách build PC:', err);
        if (tbody) {
          tbody.innerHTML = `
            <tr>
              <td colspan="7" style="text-align: center; padding: 24px; color: #ef4444;">
                <i class="fa-solid fa-circle-exclamation"></i> Không thể tải danh sách cấu hình PC!
              </td>
            </tr>
          `;
        }
      }
    },

    /**
     * Hiển thị danh sách PC lên bảng dữ liệu
     */
    renderTable: function (builds) {
      const tbody = document.getElementById('build-pc-table-body');
      if (!tbody) return;

      if (!builds || builds.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="7" style="text-align: center; padding: 32px; color: #94a3b8;">
              <i class="fa-solid fa-desktop" style="font-size: 32px; margin-bottom: 8px; opacity: 0.5;"></i>
              <p>Chưa có cấu hình PC nào phù hợp với bộ lọc</p>
            </td>
          </tr>
        `;
        return;
      }

      let html = '';
      for (let i = 0; i < builds.length; i++) {
        const b = builds[i];
        const isActive = (b.status === 'ACTIVE');
        const statusBadge = isActive
          ? '<span class="badge badge-success"><i class="fa-solid fa-check-circle"></i> Đang hoạt động</span>'
          : '<span class="badge badge-danger"><i class="fa-solid fa-ban"></i> Tạm ẩn</span>';

        // Tạo danh sách tag linh kiện cấu thành
        let compTagsHtml = '';
        if (b.components && b.components.length > 0) {
          compTagsHtml = '<div class="pc-components-tag-list">';
          for (let j = 0; j < b.components.length; j++) {
            const c = b.components[j];
            const typeLabel = c.componentType || 'LK';
            const name = c.componentProductName || 'Linh kiện';
            const qtyText = c.quantity && c.quantity > 1 ? ` (x${c.quantity})` : '';
            compTagsHtml += `
              <span class="pc-comp-tag" title="${typeLabel}: ${name}${qtyText}">
                <strong>${typeLabel}:</strong> ${name}${qtyText}
              </span>
            `;
          }
          compTagsHtml += '</div>';
        } else {
          compTagsHtml = '<span style="color: #94a3b8; font-size: 12px;">Chưa gán linh kiện</span>';
        }

        const lockBtn = isActive
          ? `<button type="button" class="btn-action lock" title="Tạm ẩn cấu hình PC" onclick="window.BuildPcComponent.toggleStatus(${b.id})"><i class="fa-solid fa-eye-slash"></i></button>`
          : `<button type="button" class="btn-action unlock" title="Kích hoạt cấu hình PC" onclick="window.BuildPcComponent.toggleStatus(${b.id})"><i class="fa-solid fa-eye"></i></button>`;

        html += `
          <tr>
            <td><strong>#${b.id}</strong></td>
            <td>
              <div style="font-weight: 600; color: #0f172a;">${b.name || 'Dàn PC Build'}</div>
              <div style="font-size: 11px; color: #64748b;">Tạo lúc: ${this.formatDateTime(b.createdAt)}</div>
            </td>
            <td><code style="font-size: 12px; color: var(--primary);">${b.sku || '---'}</code></td>
            <td>
              <span style="font-weight: 700; color: #059669; font-size: 13.5px;">
                ${this.formatCurrency(b.price)}
              </span>
            </td>
            <td>${compTagsHtml}</td>
            <td>${statusBadge}</td>
            <td style="text-align: right;">
              <div class="action-btns-wrap">
                <button type="button" class="btn-action view" title="Xem chi tiết linh kiện cấu hình" onclick="window.BuildPcComponent.openDetailModal(${b.id})">
                  <i class="fa-solid fa-eye"></i>
                </button>
                <button type="button" class="btn-action edit" title="Chỉnh sửa cấu hình PC" onclick="window.BuildPcComponent.openEditModal(${b.id})">
                  <i class="fa-solid fa-pen-to-square"></i>
                </button>
                ${lockBtn}
              </div>
            </td>
          </tr>
        `;
      }

      tbody.innerHTML = html;
    },

    /**
     * Render phân trang đồng bộ với các màn hình khác
     */
    renderPagination: function (pageData) {
      const infoEl = document.getElementById('build-pc-pagination-info');
      const controlsEl = document.getElementById('build-pc-pagination-controls');
      if (!infoEl || !controlsEl) return;

      const total = pageData.totalElements || 0;
      const page = pageData.page || 1;
      const size = pageData.size || 10;
      const totalPages = pageData.totalPages || Math.ceil(total / size) || 1;

      if (total === 0) {
        infoEl.textContent = 'Không có bản ghi nào';
        controlsEl.innerHTML = '';
        return;
      }

      infoEl.textContent = 'Trang ' + page + ' / ' + totalPages + ' (Tổng số ' + total + ' cấu hình PC)';

      if (totalPages <= 1) {
        controlsEl.innerHTML = '';
        return;
      }

      let html = '';

      // Nút Trước (Previous)
      if (page > 1) {
        html += '<button type="button" class="page-btn" onclick="window.BuildPcComponent.loadBuilds(' + (page - 1) + ')" title="Trang trước"><i class="fa-solid fa-chevron-left"></i></button> ';
      } else {
        html += '<button type="button" class="page-btn" disabled title="Trang trước"><i class="fa-solid fa-chevron-left"></i></button> ';
      }

      // Danh sách số trang rút gọn với ... khi totalPages > 5
      let pageNumbers = [];
      if (totalPages <= 5) {
        for (let i = 1; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        if (page <= 3) {
          pageNumbers = [1, 2, 3, '...', totalPages];
        } else if (page >= totalPages - 2) {
          pageNumbers = [1, '...', totalPages - 2, totalPages - 1, totalPages];
        } else {
          pageNumbers = [1, '...', page, '...', totalPages];
        }
      }

      for (let i = 0; i < pageNumbers.length; i++) {
        const p = pageNumbers[i];
        if (p === '...') {
          html += '<span class="page-ellipsis">...</span> ';
        } else if (p === page) {
          html += '<button type="button" class="page-btn active">' + p + '</button> ';
        } else {
          html += '<button type="button" class="page-btn" onclick="window.BuildPcComponent.loadBuilds(' + p + ')">' + p + '</button> ';
        }
      }

      // Nút Sau (Next)
      if (page < totalPages) {
        html += '<button type="button" class="page-btn" onclick="window.BuildPcComponent.loadBuilds(' + (page + 1) + ')" title="Trang sau"><i class="fa-solid fa-chevron-right"></i></button>';
      } else {
        html += '<button type="button" class="page-btn" disabled title="Trang sau"><i class="fa-solid fa-chevron-right"></i></button>';
      }

      controlsEl.innerHTML = html;
    },

    /**
     * Mở modal thêm cấu hình PC mới
     */
    openAddModal: function () {
      const modal = document.getElementById('build-pc-modal');
      const title = document.getElementById('build-pc-modal-title');
      const form = document.getElementById('build-pc-form');

      if (!modal) return;
      if (title) title.innerHTML = '<i class="fa-solid fa-wrench text-primary"></i> Cấu hình dàn PC mới';
      if (form) form.reset();

      const idInput = document.getElementById('build-id');
      if (idInput) idInput.value = '';

      const submitBtn = document.getElementById('build-btn-submit');
      if (submitBtn) submitBtn.textContent = 'Lưu cấu hình PC';

      const ramQtyInput = document.getElementById('pick-ram-qty');
      if (ramQtyInput) ramQtyInput.value = '2';

      modal.classList.add('show');
      modal.style.display = 'flex';
    },

    /**
     * Mở modal chỉnh sửa cấu hình PC
     */
    openEditModal: async function (buildId) {
      if (!window.BuildPcApi) return;

      const modal = document.getElementById('build-pc-modal');
      const title = document.getElementById('build-pc-modal-title');
      const submitBtn = document.getElementById('build-btn-submit');

      if (title) title.innerHTML = `<i class="fa-solid fa-pen-to-square text-primary"></i> Chỉnh sửa cấu hình PC #${buildId}`;
      if (submitBtn) submitBtn.textContent = 'Cập nhật cấu hình PC';

      try {
        const build = await window.BuildPcApi.getPcBuildById(buildId);
        if (!build) {
          if (window.AdminApp && window.AdminApp.showToast) {
            window.AdminApp.showToast('Không tìm thấy cấu hình PC cần chỉnh sửa!', 'error');
          }
          return;
        }

        document.getElementById('build-id').value = build.id || '';
        document.getElementById('build-product-id').value = build.productId || '';
        document.getElementById('build-price').value = build.price || 0;
        document.getElementById('build-status').value = build.status || 'ACTIVE';

        // Đặt lại các select linh kiện
        const selectIds = [
          'pick-cpu', 'pick-mainboard', 'pick-ram', 'pick-gpu', 
          'pick-ssd', 'pick-psu', 'pick-case', 'pick-cooler', 'pick-monitor'
        ];
        for (let i = 0; i < selectIds.length; i++) {
          const el = document.getElementById(selectIds[i]);
          if (el) el.value = '';
        }

        // Điền ID linh kiện tương ứng vào các select
        if (build.components && build.components.length > 0) {
          for (let i = 0; i < build.components.length; i++) {
            const comp = build.components[i];
            const selectId = this.getSelectIdByType(comp.componentType);
            if (selectId) {
              const el = document.getElementById(selectId);
              if (el) el.value = comp.componentProductId || '';
            }
            if (comp.componentType === 'RAM' && comp.quantity) {
              const qtyEl = document.getElementById('pick-ram-qty');
              if (qtyEl) qtyEl.value = comp.quantity;
            }
          }
        }

        modal.classList.add('show');
        modal.style.display = 'flex';
      } catch (err) {
        console.error('[BuildPcLogic] Lỗi khi mở modal sửa:', err);
      }
    },

    /**
     * Đóng modal cấu hình dàn PC
     */
    closeModal: function () {
      const modal = document.getElementById('build-pc-modal');
      if (modal) {
        modal.classList.remove('show');
        modal.style.display = 'none';
      }
    },

    /**
     * Mở modal xem chi tiết dàn PC
     */
    openDetailModal: async function (buildId) {
      if (!window.BuildPcApi) return;
      const modal = document.getElementById('build-detail-modal');
      const content = document.getElementById('build-detail-content');

      if (!modal || !content) return;
      content.innerHTML = '<div style="padding: 24px; text-align: center;"><i class="fa-solid fa-spinner fa-spin"></i> Đang tải...</div>';

      modal.classList.add('show');
      modal.style.display = 'flex';

      try {
        const b = await window.BuildPcApi.getPcBuildById(buildId);
        if (!b) {
          content.innerHTML = '<div style="color: #ef4444; padding: 20px;">Không tìm thấy chi tiết dàn PC!</div>';
          return;
        }

        let compsListHtml = '';
        if (b.components && b.components.length > 0) {
          for (let i = 0; i < b.components.length; i++) {
            const c = b.components[i];
            const type = c.componentType || 'LK';
            const name = c.componentProductName || 'Linh kiện';
            const sku = c.componentSku ? ` (${c.componentSku})` : '';
            const qty = c.quantity > 1 ? ` x${c.quantity}` : '';
            const price = c.componentPrice ? this.formatCurrency(c.componentPrice) : '---';

            compsListHtml += `
              <li style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px dashed #e2e8f0;">
                <div>
                  <span class="badge badge-primary" style="margin-right: 8px; font-size: 11px;">${type}</span>
                  <strong>${name}</strong>${sku}${qty}
                </div>
                <div style="font-weight: 600; color: #0f172a;">${price}</div>
              </li>
            `;
          }
        } else {
          compsListHtml = '<li style="color: #94a3b8;">Chưa cấu hình linh kiện nào.</li>';
        }

        content.innerHTML = `
          <div style="padding: 16px; background: #f8fafc; border-radius: 8px; margin-bottom: 16px; border: 1px solid #e2e8f0; font-size: 13px;">
            <h4 style="color: var(--primary); margin-bottom: 8px; font-size: 16px;">${b.name || 'Bộ PC Cấu hình sẵn'}</h4>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
              <p><strong>Mã dàn PC:</strong> #${b.id}</p>
              <p><strong>Mã SKU:</strong> <code>${b.sku || '---'}</code></p>
              <p><strong>Giá niêm yết:</strong> <span style="font-weight: 700; color: #059669; font-size: 15px;">${this.formatCurrency(b.price)}</span></p>
              <p><strong>Trạng thái:</strong> <span class="badge ${b.status === 'ACTIVE' ? 'badge-success' : 'badge-danger'}"><i class="fa-solid ${b.status === 'ACTIVE' ? 'fa-check-circle' : 'fa-ban'}"></i> ${b.status === 'ACTIVE' ? 'Đang hoạt động' : 'Tạm ẩn'}</span></p>
            </div>
          </div>
          <h5 style="font-size: 13.5px; font-weight: 700; margin-bottom: 10px; color: #1e293b;">
            <i class="fa-solid fa-microchip text-primary"></i> Danh sách 8 loại linh kiện chính & Phụ kiện màn hình:
          </h5>
          <ul style="list-style: none; padding: 0; margin: 0; font-size: 13px;">
            ${compsListHtml}
          </ul>
        `;
      } catch (err) {
        console.error('[BuildPcLogic] Lỗi tải chi tiết PC:', err);
      }
    },

    /**
     * Đóng modal chi tiết
     */
    closeDetailModal: function () {
      const modal = document.getElementById('build-detail-modal');
      if (modal) {
        modal.classList.remove('show');
        modal.style.display = 'none';
      }
    },

    /**
     * Lấy mảng linh kiện pc_build_components từ form
     */
    collectFormData: function () {
      const getVal = (id) => {
        const el = document.getElementById(id);
        if (!el || !el.value) return null;
        const n = parseInt(el.value, 10);
        return isNaN(n) ? null : n;
      };

      const ramQtyEl = document.getElementById('pick-ram-qty');
      const ramQty = ramQtyEl ? (parseInt(ramQtyEl.value, 10) || 2) : 2;

      const components = [];
      const addComp = (type, prodId, qty) => {
        if (prodId) {
          components.push({
            componentType: type,
            componentProductId: prodId,
            quantity: qty || 1
          });
        }
      };

      addComp('CPU', getVal('pick-cpu'), 1);
      addComp('MAINBOARD', getVal('pick-mainboard'), 1);
      addComp('RAM', getVal('pick-ram'), ramQty);
      addComp('GPU', getVal('pick-gpu'), 1);
      addComp('SSD', getVal('pick-ssd'), 1);
      addComp('PSU', getVal('pick-psu'), 1);
      addComp('CASE', getVal('pick-case'), 1);
      addComp('COOLER', getVal('pick-cooler'), 1);
      addComp('MONITOR', getVal('pick-monitor'), 1);

      return components;
    },

    /**
     * Bấm nút "Kiểm tra tương thích" trên giao diện
     */
    checkCompatibility: async function () {
      if (!window.BuildPcApi) return;
      const components = this.collectFormData();
      const buildDTO = { components: components };

      const res = await window.BuildPcApi.checkPcCompatibility(buildDTO);
      this.showCompatibilityModal(res);
    },

    /**
     * Hiển thị popup modal TO Ở GIỮA MÀN HÌNH kèm chi tiết lỗi và nút OK để thoát
     * @param {Object} res - Kết quả trả về từ API kiểm tra tương thích { success, message, data: errorsList }
     */
    showCompatibilityModal: function (res) {
      const modal = document.getElementById('build-compat-modal');
      const body = document.getElementById('build-compat-modal-body');
      const headerTitle = document.getElementById('build-compat-modal-header-title');

      if (!modal || !body) return;

      const isCompat = res.success === true;
      const errors = Array.isArray(res.data) ? res.data : (res.errors || []);

      let contentHtml = '';

      if (!isCompat) {
        // TRƯỜNG HỢP CÓ LỖI KHÔNG TƯƠNG THÍCH:
        // Popup to ở giữa màn hình, tông màu chuẩn Admin kèm nút OK để thoát
        if (headerTitle) {
          headerTitle.innerHTML = '<span style="color: #dc2626;"><i class="fa-solid fa-triangle-exclamation"></i> Phát hiện lỗi tương thích phần cứng</span>';
        }

        contentHtml += `
          <div class="compat-hero-banner is-error">
            <div class="compat-hero-icon-circle">
              <i class="fa-solid fa-circle-xmark"></i>
            </div>
            <h3 class="compat-hero-title">Cấu hình linh kiện không hợp lệ!</h3>
            <p class="compat-hero-desc">
              Hệ thống đã phát hiện các xung đột phần cứng giữa các linh kiện bạn đã chọn. 
              Vui lòng xem chi tiết danh sách lỗi bên dưới để điều chỉnh linh kiện phù hợp trước khi lắp ráp thành PC.
            </p>
          </div>
        `;

        if (errors.length > 0) {
          contentHtml += `
            <div class="compat-section-title" style="color: #dc2626;">
              <i class="fa-solid fa-circle-exclamation"></i> Chi tiết các lỗi không tương thích (${errors.length}):
            </div>
            <ul class="compat-error-list">
          `;
          for (let i = 0; i < errors.length; i++) {
            contentHtml += `
              <li class="compat-item-card is-error">
                <i class="fa-solid fa-circle-xmark"></i>
                <div>${errors[i]}</div>
              </li>
            `;
          }
          contentHtml += `</ul>`;
        }

      } else {
        // TRƯỜNG HỢP HỢP LỆ HOÀN TOÀN
        if (headerTitle) {
          headerTitle.innerHTML = '<span style="color: #16a34a;"><i class="fa-solid fa-circle-check"></i> Đánh giá độ tương thích thành công</span>';
        }

        contentHtml += `
          <div class="compat-hero-banner is-success">
            <div class="compat-hero-icon-circle">
              <i class="fa-solid fa-circle-check"></i>
            </div>
            <h3 class="compat-hero-title">Tất cả linh kiện hợp lệ và tương thích 100%!</h3>
            <p class="compat-hero-desc">
              8 loại linh kiện chính và phụ kiện màn hình hoàn toàn tương thích về mặt vật lý, chân cắm và điện năng. 
              Dàn PC hoàn toàn đủ điều kiện để lắp ráp và hoạt động ổn định.
            </p>
          </div>
        `;
      }

      body.innerHTML = contentHtml;
      modal.classList.add('show');
      modal.style.display = 'flex';
    },

    /**
     * Đóng modal kiểm tra tương thích
     */
    closeCompatModal: function () {
      const modal = document.getElementById('build-compat-modal');
      if (modal) {
        modal.classList.remove('show');
        modal.style.display = 'none';
      }
    },

    /**
     * Xử lý Lưu cấu hình PC (gọi kiểm tra tương thích trước, nếu lỗi hiện popup to ở giữa,
     * nếu hợp lệ thì lưu và hiện Toast nhỏ ở góc màn hình giống các màn trước)
     */
    handleSave: async function (event) {
      if (event) event.preventDefault();
      if (!window.BuildPcApi) return;

      const buildId = document.getElementById('build-id')?.value;
      const productId = parseInt(document.getElementById('build-product-id')?.value, 10);
      const price = parseFloat(document.getElementById('build-price')?.value);
      const status = document.getElementById('build-status')?.value || 'ACTIVE';

      // 1. Kiểm tra cơ bản
      if (!productId || isNaN(productId)) {
        if (window.AdminApp && window.AdminApp.showToast) {
          window.AdminApp.showToast('Vui lòng chọn sản phẩm PC đại diện!', 'error');
        }
        document.getElementById('build-product-id')?.focus();
        return;
      }

      if (isNaN(price) || price < 0) {
        if (window.AdminApp && window.AdminApp.showToast) {
          window.AdminApp.showToast('Giá bán trọn bộ PC phải là số dương lớn hơn hoặc bằng 0!', 'error');
        }
        document.getElementById('build-price')?.focus();
        return;
      }

      // 2. Thu thập danh sách linh kiện pc_build_components
      const components = this.collectFormData();
      const buildDTO = {
        id: buildId ? parseInt(buildId, 10) : null,
        productId: productId,
        price: price,
        status: status,
        components: components
      };

      // 3. GỌI MODULE KIỂM TRA TƯƠNG THÍCH TRƯỚC KHI LƯU
      const checkRes = await window.BuildPcApi.checkPcCompatibility(buildDTO);

      // NẾU KHÔNG HỢP LỆ: Hiện popup to ở giữa màn hình kèm chi tiết lỗi và nút OK để thoát
      if (!checkRes.success) {
        this.showCompatibilityModal(checkRes);
        return;
      }

      // NẾU HỢP LỆ: Tiến hành lưu cấu hình vào CSDL
      let saveRes;
      if (buildId) {
        saveRes = await window.BuildPcApi.updatePcBuild(buildId, buildDTO);
      } else {
        saveRes = await window.BuildPcApi.createPcBuild(buildDTO);
      }

      if (saveRes.success) {
        // Đóng form cấu hình
        this.closeModal();

        // Nạp lại danh sách dàn PC
        await this.loadBuilds(currentPage);

        // HIỆN POPUP NHỎ Ở GÓC MÀN HÌNH (TOAST) GIỐNG CÁC MÀN TRƯỚC
        if (window.AdminApp && window.AdminApp.showToast) {
          const msg = buildId ? 'Cập nhật cấu hình PC thành công!' : 'Lưu cấu hình PC mới thành công!';
          window.AdminApp.showToast(msg, 'success');
        }
      } else {
        if (window.AdminApp && window.AdminApp.showToast) {
          window.AdminApp.showToast(saveRes.message || 'Lỗi lưu cấu hình PC!', 'error');
        }
      }
    },

    /**
     * Bật/Tắt trạng thái dàn PC (ACTIVE / INACTIVE)
     */
    toggleStatus: async function (buildId) {
      if (!window.BuildPcApi) return;
      try {
        const res = await window.BuildPcApi.togglePcBuildStatus(buildId);
        if (res.success) {
          if (window.AdminApp && window.AdminApp.showToast) {
            window.AdminApp.showToast('Cập nhật trạng thái dàn PC thành công!', 'success');
          }
          await this.loadBuilds(currentPage);
        } else {
          if (window.AdminApp && window.AdminApp.showToast) {
            window.AdminApp.showToast(res.message || 'Lỗi khi đổi trạng thái!', 'error');
          }
        }
      } catch (err) {
        console.error('[BuildPcLogic] Lỗi toggleStatus:', err);
      }
    },

    /**
     * Tự động cập nhật giá bán khi đổi sản phẩm PC đại diện
     */
    onProductSelectChange: function (productId) {
      if (!productId) return;
      const pid = parseInt(productId, 10);
      for (let i = 0; i < componentsCache.PC.length; i++) {
        const pc = componentsCache.PC[i];
        if (pc.id === pid) {
          const priceInput = document.getElementById('build-price');
          if (priceInput && pc.price) {
            priceInput.value = pc.price;
          }
          break;
        }
      }
    },

    /**
     * Tìm kiếm theo từ khóa
     */
    onSearch: function (query) {
      currentKeyword = query || '';
      clearTimeout(this._searchTimer);
      this._searchTimer = setTimeout(() => {
        this.loadBuilds(1);
      }, 300);
    },

    /**
     * Lọc theo trạng thái
     */
    onStatusFilterChange: function (val) {
      currentStatus = val || '';
      this.loadBuilds(1);
    },

    /**
     * Đặt lại bộ lọc
     */
    resetFilter: function () {
      const searchInput = document.getElementById('build-search-input');
      const statusSelect = document.getElementById('build-filter-status');

      if (searchInput) searchInput.value = '';
      if (statusSelect) statusSelect.value = '';

      currentKeyword = '';
      currentStatus = '';

      this.loadBuilds(1);

      if (window.AdminApp && window.AdminApp.showToast) {
        window.AdminApp.showToast('Đã đặt lại bộ lọc Build PC', 'info');
      }
    },

    /**
     * Tiện ích định dạng tiền tệ VNĐ
     */
    formatCurrency: function (num) {
      if (num === null || num === undefined || isNaN(num)) return '0 ₫';
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
    },

    /**
     * Tiện ích định dạng thời gian
     */
    formatDateTime: function (dtStr) {
      if (!dtStr) return '---';
      try {
        const d = new Date(dtStr);
        return d.toLocaleDateString('vi-VN') + ' ' + d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
      } catch (e) {
        return dtStr;
      }
    }
  };

  // Đồng bộ toàn cục cho cả BuildPcLogic và BuildPcComponent
  window.BuildPcLogic = BuildPcLogic;
  window.BuildPcComponent = BuildPcLogic;
})();
