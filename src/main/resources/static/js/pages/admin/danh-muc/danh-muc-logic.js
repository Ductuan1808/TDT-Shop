/**
 * =========================================================================
 * danh-muc-logic.js - Xử lý logic giao diện, sự kiện và API Danh mục Admin
 * Cú pháp JavaScript đơn giản, dễ hiểu cho đồ án tốt nghiệp
 * =========================================================================
 */

(function () {
  'use strict';

  let currentPage = 1;
  const pageSize = 10;
  let searchTimeout = null;
  let cachedParents = [];

  const DanhMucLogic = {
    /**
     * Khởi tạo màn hình Quản lý Danh mục
     */
    init: function () {
      this.bindBackdropClose();
      this.loadParentOptions();
      this.loadCategories(1);
    },

    /**
     * Bắt sự kiện đóng modal khi bấm phím ESC hoặc click ra ngoài backdrop
     */
    bindBackdropClose: function () {
      const modal = document.getElementById('category-modal');
      if (modal) {
        modal.onclick = function (e) {
          if (e.target === modal) {
            DanhMucLogic.closeModal();
          }
        };
      }

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
          DanhMucLogic.closeModal();
        }
      });
    },

    /**
     * Nạp danh sách danh mục vào dropdown danh mục cha
     * @param {number|null} excludeId - ID danh mục cần loại trừ (tránh chọn chính nó làm cha)
     */
    loadParentOptions: async function (excludeId, isParentCategory) {
      const parentSelect = document.getElementById('cat-parent');
      if (!parentSelect) return;

      // Nếu là danh mục cha thì chỉ hiện mỗi select "Là danh mục gốc (Không có cha)"
      if (isParentCategory) {
        parentSelect.innerHTML = '<option value="">-- Là danh mục gốc (Không có cha) --</option>';
        parentSelect.value = '';
        return;
      }

      try {
        if (!cachedParents || cachedParents.length === 0) {
          cachedParents = await window.CategoryApi.getParentCategories();
        }

        let html = '<option value="">-- Là danh mục gốc (Không có cha) --</option>';
        for (let i = 0; i < cachedParents.length; i++) {
          const item = cachedParents[i];
          // Bỏ qua chính nó khi sửa để tránh đệ quy vòng tròn
          if (excludeId && String(item.id) === String(excludeId)) {
            continue;
          }
          html += '<option value="' + item.id + '">[#' + item.id + '] ' + item.name + '</option>';
        }
        parentSelect.innerHTML = html;
      } catch (err) {
        console.error('[DanhMucLogic] Lỗi loadParentOptions:', err);
      }
    },

    /**
     * Tải danh sách danh mục từ server và hiển thị bảng
     * @param {number} page
     */
    loadCategories: async function (page) {
      if (!page || page < 1) page = 1;
      currentPage = page;

      const tbody = document.getElementById('category-table-body');
      if (tbody) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding: 25px;"><i class="fa-solid fa-spinner fa-spin"></i> Đang tải dữ liệu danh mục...</td></tr>';
      }

      const searchInput = document.getElementById('cat-search-input');
      const parentSelect = document.getElementById('cat-filter-parent');
      const statusSelect = document.getElementById('cat-filter-status');

      const keyword = searchInput ? searchInput.value.trim() : '';
      const parentType = parentSelect ? parentSelect.value : '';
      const status = statusSelect ? statusSelect.value : '';

      try {
        const pageData = await window.CategoryApi.getCategories({
          keyword: keyword,
          parentType: parentType,
          status: status,
          page: currentPage,
          size: pageSize
        });

        this.renderTable(pageData.content || []);
        this.renderPagination(pageData);
      } catch (err) {
        console.error('[DanhMucLogic] Lỗi loadCategories:', err);
        if (tbody) {
          tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding: 25px; color:#dc2626;"><i class="fa-solid fa-triangle-exclamation"></i> Lỗi tải dữ liệu danh mục!</td></tr>';
        }
      }
    },

    /**
     * Render các dòng dữ liệu vào bảng danh mục
     * @param {Array} list
     */
    renderTable: function (list) {
      const tbody = document.getElementById('category-table-body');
      if (!tbody) return;

      if (!list || list.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding: 35px; color:#64748b;"><i class="fa-solid fa-folder-open" style="font-size:24px; margin-bottom:8px; display:block;"></i> Không tìm thấy danh mục nào phù hợp</td></tr>';
        return;
      }

      let html = '';
      for (let i = 0; i < list.length; i++) {
        const c = list[i];

        // 1. Danh mục cha
        let parentHtml = '';
        if (c.parentId) {
          const parentName = c.parentName ? c.parentName : ('#' + c.parentId);
          parentHtml = '<span class="parent-badge"><i class="fa-solid fa-folder"></i> ' + parentName + '</span>';
        } else {
          parentHtml = '<span class="badge" style="background:#f1f5f9; color:#475569; font-weight: 500;"><i class="fa-solid fa-folder-tree"></i> Danh mục gốc</span>';
        }

        // 2. Mô tả ngắn
        let descText = '-';
        if (c.description) {
          descText = c.description.length > 45 ? (c.description.substring(0, 45) + '...') : c.description;
        }

        // 3. Nút bật/tắt Hiện trang chủ & 4. Nút bật/tắt Hiện Menu
        let homeBtn = '';
        let menuBtn = '';

        if (c.status === 'INACTIVE') {
          // Danh mục đã bị ẩn => Tự động về false (Ẩn) và khóa không cho thao tác
          homeBtn = '<button type="button" class="badge" style="opacity: 0.6; cursor: not-allowed; border: none; background: #e2e8f0; color: #64748b; padding: 6px 10px;" disabled title="Danh mục đang bị ẩn, tự động tắt hiển thị"><i class="fa-solid fa-xmark"></i> Ẩn</button>';
          menuBtn = '<button type="button" class="badge" style="opacity: 0.6; cursor: not-allowed; border: none; background: #e2e8f0; color: #64748b; padding: 6px 10px;" disabled title="Danh mục đang bị ẩn, tự động tắt hiển thị"><i class="fa-solid fa-xmark"></i> Ẩn</button>';
        } else {
          // Danh mục đang hoạt động (ACTIVE) => Cho phép bật/tắt bình thường
          if (c.showOnHome) {
            homeBtn = '<button type="button" class="badge badge-success" style="cursor: pointer; border: none; padding: 6px 10px;" title="Bấm để tắt hiển thị Trang chủ" onclick="DanhMucLogic.toggleHome(' + c.id + ')"><i class="fa-solid fa-check"></i> Hiển thị</button>';
          } else {
            homeBtn = '<button type="button" class="badge" style="cursor: pointer; border: none; background: #e2e8f0; color: #64748b; padding: 6px 10px;" title="Bấm để bật hiển thị Trang chủ" onclick="DanhMucLogic.toggleHome(' + c.id + ')"><i class="fa-solid fa-xmark"></i> Ẩn</button>';
          }

          if (c.showOnMenu) {
            menuBtn = '<button type="button" class="badge badge-success" style="cursor: pointer; border: none; padding: 6px 10px;" title="Bấm để tắt hiển thị Menu" onclick="DanhMucLogic.toggleMenu(' + c.id + ')"><i class="fa-solid fa-check"></i> Hiển thị</button>';
          } else {
            menuBtn = '<button type="button" class="badge" style="cursor: pointer; border: none; background: #e2e8f0; color: #64748b; padding: 6px 10px;" title="Bấm để bật hiển thị Menu" onclick="DanhMucLogic.toggleMenu(' + c.id + ')"><i class="fa-solid fa-xmark"></i> Ẩn</button>';
          }
        }

        // 5. Trạng thái hoạt động
        let statusHtml = '';
        let lockBtn = '';
        if (c.status === 'ACTIVE') {
          statusHtml = '<span class="badge badge-success"><i class="fa-solid fa-check-circle"></i> Đang hoạt động</span>';
          lockBtn = '<button type="button" class="btn-action lock" title="Ẩn danh mục (Tạm ngưng)" onclick="DanhMucLogic.toggleStatus(' + c.id + ', \'ACTIVE\')"><i class="fa-solid fa-eye-slash"></i></button>';
        } else {
          statusHtml = '<span class="badge badge-danger"><i class="fa-solid fa-ban"></i> Đã ẩn / Tạm ngưng</span>';
          lockBtn = '<button type="button" class="btn-action unlock" title="Hiện danh mục (Kích hoạt)" onclick="DanhMucLogic.toggleStatus(' + c.id + ', \'INACTIVE\')"><i class="fa-solid fa-eye"></i></button>';
        }

        html += '<tr>';
        html += '<td><strong>#' + c.id + '</strong></td>';
        html += '<td><strong>' + (c.name || '-') + '</strong></td>';
        html += '<td>' + parentHtml + '</td>';
        html += '<td><span class="text-muted" style="font-size: 13px;" title="' + (c.description || '') + '">' + descText + '</span></td>';
        html += '<td style="text-align: center;">' + homeBtn + '</td>';
        html += '<td style="text-align: center;">' + menuBtn + '</td>';
        html += '<td>' + statusHtml + '</td>';
        html += '<td style="text-align: right;">';
        html += '<div class="action-btns-wrap">';
        html += '<button type="button" class="btn-action edit" title="Chỉnh sửa danh mục" onclick="DanhMucLogic.openEditModal(' + c.id + ')"><i class="fa-solid fa-pen-to-square"></i></button>';
        html += lockBtn;
        html += '</div>';
        html += '</td>';
        html += '</tr>';
      }

      tbody.innerHTML = html;
    },

    /**
     * Hiển thị phân trang rút gọn với dấu ... khi > 5 trang
     * @param {Object} pageData
     */
    renderPagination: function (pageData) {
      const infoEl = document.getElementById('category-pagination-info');
      const controlsEl = document.getElementById('category-pagination-controls');

      if (!infoEl || !controlsEl) return;

      const totalElements = pageData.totalElements || 0;
      const totalPages = pageData.totalPages || 1;
      const page = pageData.page || 1;

      infoEl.innerText = 'Trang ' + page + ' / ' + totalPages + ' (Tổng số ' + totalElements + ' danh mục)';

      if (totalPages <= 1) {
        controlsEl.innerHTML = '';
        return;
      }

      let html = '';

      // Nút trước (Previous)
      if (page > 1) {
        html += '<button class="page-btn" onclick="DanhMucLogic.loadCategories(' + (page - 1) + ')" title="Trang trước"><i class="fa-solid fa-chevron-left"></i></button> ';
      } else {
        html += '<button class="page-btn" disabled title="Trang trước"><i class="fa-solid fa-chevron-left"></i></button> ';
      }

      // Rút gọn trang với ... khi totalPages > 5
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
          html += '<button class="page-btn active">' + p + '</button> ';
        } else {
          html += '<button class="page-btn" onclick="DanhMucLogic.loadCategories(' + p + ')">' + p + '</button> ';
        }
      }

      // Nút sau (Next)
      if (page < totalPages) {
        html += '<button class="page-btn" onclick="DanhMucLogic.loadCategories(' + (page + 1) + ')" title="Trang sau"><i class="fa-solid fa-chevron-right"></i></button>';
      } else {
        html += '<button class="page-btn" disabled title="Trang sau"><i class="fa-solid fa-chevron-right"></i></button>';
      }

      controlsEl.innerHTML = html;
    },

    /**
     * Mở modal thêm danh mục mới
     */
    openAddModal: function () {
      const modal = document.getElementById('category-modal');
      const title = document.getElementById('category-modal-title');
      const form = document.getElementById('category-form');

      if (!modal) return;
      if (title) title.innerHTML = '<i class="fa-solid fa-folder-plus text-primary"></i> Thêm danh mục mới';
      if (form) form.reset();

      const idInput = document.getElementById('cat-id');
      if (idInput) idInput.value = '';

      const statusSelect = document.getElementById('cat-status');
      if (statusSelect) statusSelect.value = 'ACTIVE';

      const showHomeCheck = document.getElementById('cat-show-home');
      if (showHomeCheck) showHomeCheck.checked = false;

      const showMenuCheck = document.getElementById('cat-show-menu');
      if (showMenuCheck) showMenuCheck.checked = true;

      // Mở khóa các checkbox hiển thị
      this.onModalStatusChange('ACTIVE');

      // Nạp lại danh sách cha (cho phép chọn cha khi thêm mới)
      this.loadParentOptions(null, false);

      modal.classList.add('show');
      modal.style.display = 'flex';
    },

    /**
     * Mở modal chỉnh sửa danh mục theo ID
     * @param {number} id
     */
    openEditModal: async function (id) {
      const modal = document.getElementById('category-modal');
      const title = document.getElementById('category-modal-title');

      if (!modal) return;
      if (title) title.innerHTML = '<i class="fa-solid fa-pen-to-square text-primary"></i> Chỉnh sửa danh mục [#' + id + ']';

      try {
        const cat = await window.CategoryApi.getCategoryById(id);
        if (!cat) {
          this.showToast('Không tìm thấy thông tin danh mục!', 'error');
          return;
        }

        // Nếu danh mục là danh mục cha (không có parentId) => chỉ hiện mỗi select "Là danh mục gốc (Không có cha)"
        const isParent = !cat.parentId;
        await this.loadParentOptions(id, isParent);

        const idInput = document.getElementById('cat-id');
        const nameInput = document.getElementById('cat-name');
        const parentSelect = document.getElementById('cat-parent');
        const descInput = document.getElementById('cat-desc');
        const statusSelect = document.getElementById('cat-status');
        const showHomeCheck = document.getElementById('cat-show-home');
        const showMenuCheck = document.getElementById('cat-show-menu');

        if (idInput) idInput.value = cat.id || '';
        if (nameInput) nameInput.value = cat.name || '';
        if (parentSelect) parentSelect.value = cat.parentId ? cat.parentId : '';
        if (descInput) descInput.value = cat.description || '';
        if (statusSelect) statusSelect.value = cat.status || 'ACTIVE';
        if (showHomeCheck) showHomeCheck.checked = cat.showOnHome === true;
        if (showMenuCheck) showMenuCheck.checked = cat.showOnMenu === true;

        // Nếu danh mục đang bị ẩn thì khóa các checkbox hiển thị
        this.onModalStatusChange(cat.status || 'ACTIVE');

        modal.classList.add('show');
        modal.style.display = 'flex';
      } catch (err) {
        console.error('[DanhMucLogic] Lỗi openEditModal:', err);
        this.showToast('Lỗi khi tải thông tin danh mục!', 'error');
      }
    },

    /**
     * Xử lý khi đổi trạng thái trong modal
     * Nếu chọn INACTIVE (Ẩn) thì khóa các checkbox hiện trang chủ và hiện menu
     * @param {string} status
     */
    onModalStatusChange: function (status) {
      const showHomeCheck = document.getElementById('cat-show-home');
      const showMenuCheck = document.getElementById('cat-show-menu');
      if (status === 'INACTIVE') {
        if (showHomeCheck) {
          showHomeCheck.checked = false;
          showHomeCheck.disabled = true;
        }
        if (showMenuCheck) {
          showMenuCheck.checked = false;
          showMenuCheck.disabled = true;
        }
      } else {
        if (showHomeCheck) {
          showHomeCheck.disabled = false;
        }
        if (showMenuCheck) {
          showMenuCheck.disabled = false;
        }
      }
    },

    /**
     * Đóng modal danh mục
     */
    closeModal: function () {
      const modal = document.getElementById('category-modal');
      if (modal) {
        modal.classList.remove('show');
        modal.style.display = 'none';
      }
    },

    /**
     * Lưu thông tin danh mục (Thêm mới hoặc Chỉnh sửa)
     * @param {Event} event
     */
    handleSave: async function (event) {
      if (event) event.preventDefault();

      const idInput = document.getElementById('cat-id');
      const nameInput = document.getElementById('cat-name');
      const parentSelect = document.getElementById('cat-parent');
      const descInput = document.getElementById('cat-desc');
      const statusSelect = document.getElementById('cat-status');
      const showHomeCheck = document.getElementById('cat-show-home');
      const showMenuCheck = document.getElementById('cat-show-menu');
      const saveBtn = document.getElementById('cat-save-btn');

      const id = idInput ? idInput.value.trim() : '';
      const name = nameInput ? nameInput.value.trim() : '';
      const parentVal = parentSelect ? parentSelect.value : '';
      const desc = descInput ? descInput.value.trim() : '';
      const status = statusSelect ? statusSelect.value : 'ACTIVE';
      const showOnHome = showHomeCheck ? showHomeCheck.checked : false;
      const showOnMenu = showMenuCheck ? showMenuCheck.checked : false;

      // Kiểm tra tên bắt buộc
      if (!name) {
        this.showToast('Tên danh mục không được để trống!', 'error');
        if (nameInput) nameInput.focus();
        return;
      }

      const catData = {
        name: name,
        parentId: parentVal ? parseInt(parentVal, 10) : null,
        description: desc,
        status: status,
        showOnHome: (status === 'INACTIVE') ? false : showOnHome,
        showOnMenu: (status === 'INACTIVE') ? false : showOnMenu
      };

      if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.innerText = 'Đang lưu...';
      }

      try {
        if (id) {
          // Cập nhật
          await window.CategoryApi.updateCategory(id, catData);
          this.showToast('Cập nhật danh mục [' + name + '] thành công!', 'success');
        } else {
          // Thêm mới
          await window.CategoryApi.createCategory(catData);
          this.showToast('Thêm mới danh mục [' + name + '] thành công!', 'success');
        }

        // Làm mới cache và nạp lại danh sách
        cachedParents = [];
        this.closeModal();
        this.loadCategories(currentPage);
      } catch (err) {
        console.error('[DanhMucLogic] Lỗi handleSave:', err);
        let errorMsg = err.message || 'Lỗi khi lưu danh mục!';
        if (errorMsg.includes('Duplicate') || errorMsg.includes('duplicate') || errorMsg.includes('UNIQUE') || errorMsg.includes('unique') || errorMsg.includes('đã tồn tại')) {
          errorMsg = 'Không thể tạo vì đã tồn tại danh mục trên';
        }
        this.showToast(errorMsg, 'error');
      } finally {
        if (saveBtn) {
          saveBtn.disabled = false;
          saveBtn.innerText = 'Lưu danh mục';
        }
      }
    },

    /**
     * Chuyển đổi trạng thái Ẩn / Hiện danh mục
     * @param {number} id
     * @param {string} currentStatus
     */
    toggleStatus: async function (id, currentStatus) {
      const nextStatus = (currentStatus === 'ACTIVE') ? 'INACTIVE' : 'ACTIVE';
      const actionText = (nextStatus === 'ACTIVE') ? 'hiện (kích hoạt)' : 'ẩn (tạm ngưng)';

      try {
        await window.CategoryApi.updateCategoryStatus(id, nextStatus);
        this.showToast('Đã ' + actionText + ' danh mục thành công!', 'success');
        this.loadCategories(currentPage);
      } catch (err) {
        console.error('[DanhMucLogic] Lỗi toggleStatus:', err);
        this.showToast('Lỗi khi đổi trạng thái danh mục!', 'error');
      }
    },

    /**
     * Bật/tắt nhanh hiển thị Trang chủ
     * @param {number} id
     */
    toggleHome: async function (id) {
      try {
        await window.CategoryApi.toggleShowOnHome(id);
        this.showToast('Cập nhật hiển thị Trang chủ thành công!', 'success');
        this.loadCategories(currentPage);
      } catch (err) {
        console.error('[DanhMucLogic] Lỗi toggleHome:', err);
        this.showToast(err.message || 'Danh mục đang bị ẩn, không thể thao tác hiển thị trang chủ!', 'error');
      }
    },

    /**
     * Bật/tắt nhanh hiển thị Menu
     * @param {number} id
     */
    toggleMenu: async function (id) {
      try {
        await window.CategoryApi.toggleShowOnMenu(id);
        this.showToast('Cập nhật hiển thị Menu thành công!', 'success');
        this.loadCategories(currentPage);
      } catch (err) {
        console.error('[DanhMucLogic] Lỗi toggleMenu:', err);
        this.showToast(err.message || 'Danh mục đang bị ẩn, không thể thao tác hiển thị menu!', 'error');
      }
    },

    /**
     * Xử lý tìm kiếm theo tên có debounce
     * @param {string} query
     */
    onSearch: function (query) {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
      searchTimeout = setTimeout(function () {
        DanhMucLogic.loadCategories(1);
      }, 250);
    },

    /**
     * Xử lý lọc cấp danh mục (Tất cả / Gốc / Con)
     * @param {string} val
     */
    onParentFilterChange: function (val) {
      this.loadCategories(1);
    },

    /**
     * Xử lý lọc trạng thái (Tất cả / ACTIVE / INACTIVE)
     * @param {string} val
     */
    onStatusFilterChange: function (val) {
      this.loadCategories(1);
    },

    /**
     * Đặt lại bộ lọc về mặc định
     */
    resetFilter: function () {
      const searchInput = document.getElementById('cat-search-input');
      const parentSelect = document.getElementById('cat-filter-parent');
      const statusSelect = document.getElementById('cat-filter-status');

      if (searchInput) searchInput.value = '';
      if (parentSelect) parentSelect.value = '';
      if (statusSelect) statusSelect.value = '';

      this.showToast('Đã đặt lại bộ lọc danh mục', 'info');
      this.loadCategories(1);
    },

    /**
     * Hiển thị thông báo Toast
     * @param {string} message
     * @param {string} type - 'success' | 'error' | 'info' | 'warning'
     */
    showToast: function (message, type) {
      if (window.AdminApp && typeof window.AdminApp.showToast === 'function') {
        window.AdminApp.showToast(message, type || 'info');
      } else {
        alert(message);
      }
    }
  };

  // Đồng bộ cho cả 2 cách gọi trên HTML (onclick="DanhMucLogic..." hoặc "DanhMucComponent...")
  window.DanhMucLogic = DanhMucLogic;
  window.DanhMucComponent = DanhMucLogic;
})();
