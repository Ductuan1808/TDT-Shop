/**
 * thuong-hieu-logic.js - Xử lý hiển thị danh sách thương hiệu, thêm/sửa, khóa và xóa thương hiệu
 * Viết theo cú pháp Javascript đơn giản, dễ hiểu cho đồ án tốt nghiệp
 */

// Biến lưu trang hiện tại
let currentBrandPage = 1;

const DEFAULT_LOGO_IMAGE = 'https://upload.wikimedia.org/wikipedia/commons/2/2e/ASUS_Logo.svg';

const ThuongHieuLogic = {
  /**
   * Khởi tạo giao diện khi mở trang Thương hiệu
   */
  init: function () {
    currentBrandPage = 1;
    this.bindBackdropClose();
    this.renderStatusFilterOptions();
    this.loadBrands(1);
  },

  /**
   * Đảm bảo dropdown chọn trạng thái luôn hiển thị đầy đủ các lựa chọn
   */
  renderStatusFilterOptions: function () {
    const statusSelect = document.getElementById('brand-filter-status');
    if (statusSelect && statusSelect.options.length <= 1) {
      const currentVal = statusSelect.value;
      statusSelect.innerHTML =
        '<option value="">Tất cả trạng thái</option>' +
        '<option value="ACTIVE">Đang hoạt động (Hiện)</option>' +
        '<option value="INACTIVE">Tạm ngưng (Ẩn)</option>';
      if (currentVal) {
        statusSelect.value = currentVal;
      }
    }
  },

  /**
   * Đóng modal khi bấm ra ngoài hoặc ấn nút Esc
   */
  bindBackdropClose: function () {
    const modal = document.getElementById('brand-modal');
    if (modal) {
      modal.onclick = function (e) {
        if (e.target === modal) {
          ThuongHieuLogic.closeModal();
        }
      };
    }

    document.onkeydown = function (e) {
      if (e.key === 'Escape') {
        ThuongHieuLogic.closeModal();
      }
    };
  },

  /**
   * Tải danh sách thương hiệu từ server và hiển thị lên bảng
   */
  loadBrands: async function (page) {
    if (!page || page < 1) page = 1;
    currentBrandPage = page;

    this.renderStatusFilterOptions();

    const tbody = document.getElementById('brand-table-body');
    if (tbody) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 24px; color: #64748b;"><i class="fa-solid fa-spinner fa-spin"></i> Đang tải danh sách thương hiệu...</td></tr>';
    }

    // Lấy từ khóa tìm kiếm và trạng thái lọc
    const searchInput = document.getElementById('brand-search-input');
    const statusSelect = document.getElementById('brand-filter-status');

    const keyword = searchInput ? searchInput.value.trim() : '';
    const status = statusSelect ? statusSelect.value : '';

    try {
      const data = await window.BrandApi.getBrands({
        keyword: keyword,
        status: status,
        page: currentBrandPage,
        size: 10
      });

      const list = data.content || [];
      this.renderTable(list);
      this.renderPagination(data);
    } catch (err) {
      console.error('[ThuongHieuLogic] Lỗi loadBrands:', err);
      if (tbody) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 24px; color: #dc2626;"><i class="fa-solid fa-triangle-exclamation"></i> Lỗi tải danh sách thương hiệu!</td></tr>';
      }
    }
  },

  /**
   * Vẽ các dòng dữ liệu vào bảng thương hiệu
   */
  renderTable: function (list) {
    const tbody = document.getElementById('brand-table-body');
    if (!tbody) return;

    if (!list || list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 30px; color: #64748b;"><i class="fa-solid fa-folder-open" style="font-size: 20px; margin-bottom: 6px;"></i><div>Không tìm thấy thương hiệu nào</div></td></tr>';
      return;
    }

    let html = '';
    for (let i = 0; i < list.length; i++) {
      const b = list[i];

      // Logo
      const logoUrl = b.logo ? b.logo : DEFAULT_LOGO_IMAGE;

      // Nhãn trạng thái và nút ẩn/hiện
      let statusHtml = '';
      let lockBtn = '';

      if (b.status === 'ACTIVE') {
        statusHtml = '<span class="badge badge-success"><i class="fa-solid fa-check-circle"></i> Đang hoạt động</span>';
        lockBtn = '<button type="button" class="btn-action lock" title="Ẩn thương hiệu (Tạm ngưng)" onclick="ThuongHieuLogic.toggleStatus(' + b.id + ', \'ACTIVE\')"><i class="fa-solid fa-eye-slash"></i></button>';
      } else {
        statusHtml = '<span class="badge badge-danger"><i class="fa-solid fa-ban"></i> Đã ẩn / Tạm ngưng</span>';
        lockBtn = '<button type="button" class="btn-action unlock" title="Hiện thương hiệu (Kích hoạt)" onclick="ThuongHieuLogic.toggleStatus(' + b.id + ', \'INACTIVE\')"><i class="fa-solid fa-eye"></i></button>';
      }

      // Định dạng ngày tạo
      let dateText = '-';
      if (b.createdAt) {
        const d = new Date(b.createdAt);
        dateText = d.toLocaleDateString('vi-VN');
      }

      html += '<tr>';
      html += '<td><strong>#' + b.id + '</strong></td>';
      html += '<td><div class="brand-logo-cell"><img src="' + logoUrl + '" alt="' + (b.name || '') + '" onerror="this.src=\'' + DEFAULT_LOGO_IMAGE + '\'"></div></td>';
      html += '<td><strong>' + (b.name || '-') + '</strong></td>';
      html += '<td>' + statusHtml + '</td>';
      html += '<td>' + dateText + '</td>';
      html += '<td style="text-align: right;">';
      html += '<div class="action-btns-wrap">';
      html += '<button type="button" class="btn-action edit" title="Chỉnh sửa thương hiệu" onclick="ThuongHieuLogic.openEditModal(' + b.id + ')"><i class="fa-solid fa-pen-to-square"></i></button>';
      html += lockBtn;
      html += '</div>';
      html += '</td>';
      html += '</tr>';
    }

    tbody.innerHTML = html;
  },

  /**
   * Hiển thị phân trang rút gọn với dấu ... khi > 5 trang
   */
  renderPagination: function (pageData) {
    const infoEl = document.getElementById('brand-pagination-info');
    const controlsEl = document.getElementById('brand-pagination-controls');

    if (!infoEl || !controlsEl) return;

    const totalElements = pageData.totalElements || 0;
    const totalPages = pageData.totalPages || 1;
    const page = pageData.page || 1;

    infoEl.innerText = 'Trang ' + page + ' / ' + totalPages + ' (Tổng số ' + totalElements + ' thương hiệu)';

    if (totalPages <= 1) {
      controlsEl.innerHTML = '';
      return;
    }

    let html = '';

    // Nút trước (Previous)
    if (page > 1) {
      html += '<button class="page-btn" onclick="ThuongHieuLogic.loadBrands(' + (page - 1) + ')" title="Trang trước"><i class="fa-solid fa-chevron-left"></i></button> ';
    } else {
      html += '<button class="page-btn" disabled title="Trang trước"><i class="fa-solid fa-chevron-left"></i></button> ';
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
        html += '<button class="page-btn active">' + p + '</button> ';
      } else {
        html += '<button class="page-btn" onclick="ThuongHieuLogic.loadBrands(' + p + ')">' + p + '</button> ';
      }
    }

    // Nút sau (Next)
    if (page < totalPages) {
      html += '<button class="page-btn" onclick="ThuongHieuLogic.loadBrands(' + (page + 1) + ')" title="Trang sau"><i class="fa-solid fa-chevron-right"></i></button>';
    } else {
      html += '<button class="page-btn" disabled title="Trang sau"><i class="fa-solid fa-chevron-right"></i></button>';
    }

    controlsEl.innerHTML = html;
  },

  /**
   * Mở modal thêm thương hiệu mới
   */
  openAddModal: function () {
    const modal = document.getElementById('brand-modal');
    const title = document.getElementById('brand-modal-title');
    const form = document.getElementById('brand-form');

    if (!modal) return;
    if (title) title.innerHTML = '<i class="fa-solid fa-tag text-primary"></i> Thêm thương hiệu mới';
    if (form) form.reset();

    const idInput = document.getElementById('brand-id');
    if (idInput) idInput.value = '';

    this.clearLogo();
    modal.classList.add('show');
    modal.style.display = 'flex';
  },

  /**
   * Mở modal chỉnh sửa thương hiệu
   */
  openEditModal: async function (id) {
    const modal = document.getElementById('brand-modal');
    const title = document.getElementById('brand-modal-title');
    const form = document.getElementById('brand-form');

    if (!modal) return;
    if (form) form.reset();

    try {
      const b = await window.BrandApi.getBrandById(id);
      if (!b) {
        this.showToast('Không tìm thấy thông tin thương hiệu!', 'error');
        return;
      }

      if (title) title.innerHTML = '<i class="fa-solid fa-pen-to-square text-primary"></i> Chỉnh sửa thương hiệu #' + b.id;

      const idInput = document.getElementById('brand-id');
      const nameInput = document.getElementById('brand-name');
      const logoInput = document.getElementById('brand-logo-url');
      const statusSelect = document.getElementById('brand-status');
      const preview = document.getElementById('brand-logo-preview');

      if (idInput) idInput.value = b.id;
      if (nameInput) nameInput.value = b.name || '';
      if (logoInput) logoInput.value = b.logo || '';
      if (statusSelect) statusSelect.value = b.status || 'ACTIVE';
      if (preview) preview.src = b.logo ? b.logo : DEFAULT_LOGO_IMAGE;

      modal.classList.add('show');
      modal.style.display = 'flex';
    } catch (err) {
      console.error('[ThuongHieuLogic] Lỗi openEditModal:', err);
      this.showToast('Lỗi khi tải thông tin thương hiệu!', 'error');
    }
  },

  /**
   * Đóng modal thương hiệu
   */
  closeModal: function () {
    const modal = document.getElementById('brand-modal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  },

  /**
   * Thay đổi link ảnh logo
   */
  onLogoUrlChange: function (url) {
    const preview = document.getElementById('brand-logo-preview');
    if (preview) {
      preview.src = url ? url.trim() : DEFAULT_LOGO_IMAGE;
    }
  },

  /**
   * Đọc file ảnh từ máy tính để xem trước
   */
  onLogoFileSelect: function (event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      const preview = document.getElementById('brand-logo-preview');
      const urlInput = document.getElementById('brand-logo-url');
      if (preview) preview.src = e.target.result;
      if (urlInput) urlInput.value = e.target.result;
    };
    reader.readAsDataURL(file);
  },

  /**
   * Xóa ảnh logo đã chọn
   */
  clearLogo: function () {
    const urlInput = document.getElementById('brand-logo-url');
    const fileInput = document.getElementById('brand-logo-file');
    const preview = document.getElementById('brand-logo-preview');

    if (urlInput) urlInput.value = '';
    if (fileInput) fileInput.value = '';
    if (preview) preview.src = DEFAULT_LOGO_IMAGE;
  },

  /**
   * Lưu thương hiệu (Thêm mới hoặc Cập nhật)
   */
  handleSave: async function (event) {
    if (event) event.preventDefault();

    const idInput = document.getElementById('brand-id');
    const nameInput = document.getElementById('brand-name');
    const logoInput = document.getElementById('brand-logo-url');
    const statusSelect = document.getElementById('brand-status');
    const saveBtn = document.getElementById('brand-save-btn');

    const id = idInput ? idInput.value.trim() : '';
    const name = nameInput ? nameInput.value.trim() : '';
    const logo = logoInput ? logoInput.value.trim() : '';
    const status = statusSelect ? statusSelect.value : 'ACTIVE';

    if (!name) {
      this.showToast('Vui lòng nhập tên thương hiệu!', 'error');
      if (nameInput) nameInput.focus();
      return;
    }

    const brandData = {
      name: name,
      logo: logo,
      status: status
    };

    if (saveBtn) {
      saveBtn.disabled = true;
      saveBtn.innerText = 'Đang lưu...';
    }

    try {
      if (id) {
        // Cập nhật
        await window.BrandApi.updateBrand(id, brandData);
        this.showToast('Cập nhật thương hiệu [' + name + '] thành công!', 'success');
      } else {
        // Thêm mới
        await window.BrandApi.createBrand(brandData);
        this.showToast('Thêm mới thương hiệu [' + name + '] thành công!', 'success');
      }

      this.closeModal();
      this.loadBrands(currentBrandPage);
    } catch (e) {
      console.error('[ThuongHieuLogic] Lỗi handleSave:', e);
      let errorMsg = e.message || 'Lỗi khi lưu thương hiệu!';
      if (errorMsg.includes('Duplicate') || errorMsg.includes('duplicate') || errorMsg.includes('UNIQUE') || errorMsg.includes('unique') || errorMsg.includes('đã tồn tại')) {
        errorMsg = 'Không thể tạo vì đã tồn tại thương hiệu trên';
      }
      this.showToast(errorMsg, 'error');
    } finally {
      if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.innerText = 'Lưu thương hiệu';
      }
    }
  },

  /**
   * Chuyển đổi trạng thái Ẩn / Hiện thương hiệu (không cần hỏi confirm)
   */
  toggleStatus: async function (id, currentStatus) {
    const nextStatus = (currentStatus === 'ACTIVE') ? 'INACTIVE' : 'ACTIVE';
    const actionText = (nextStatus === 'ACTIVE') ? 'hiện (kích hoạt)' : 'ẩn (tạm ngưng)';

    try {
      await window.BrandApi.updateBrandStatus(id, nextStatus);
      this.showToast('Đã ' + actionText + ' thương hiệu thành công!', 'success');
      this.loadBrands(currentBrandPage);
    } catch (err) {
      console.error('[ThuongHieuLogic] Lỗi toggleStatus:', err);
      this.showToast('Lỗi khi đổi trạng thái thương hiệu!', 'error');
    }
  },

  /**
   * Tìm kiếm theo từ khóa
   */
  onSearch: function (val) {
    const searchInput = document.getElementById('brand-search-input');
    if (val !== undefined && searchInput && searchInput.value !== val) {
      searchInput.value = val;
    }
    this.loadBrands(1);
  },

  /**
   * Lọc khi đổi trạng thái (ACTIVE / INACTIVE / Tất cả)
   */
  onStatusFilterChange: function (val) {
    const statusSelect = document.getElementById('brand-filter-status');
    if (val !== undefined && statusSelect && statusSelect.value !== val) {
      statusSelect.value = val;
    }
    this.loadBrands(1);
  },

  /**
   * Đặt lại bộ lọc
   */
  resetFilter: function () {
    const searchInput = document.getElementById('brand-search-input');
    const statusSelect = document.getElementById('brand-filter-status');

    if (searchInput) searchInput.value = '';
    if (statusSelect) statusSelect.value = '';

    this.showToast('Đã đặt lại bộ lọc thương hiệu', 'info');
    this.loadBrands(1);
  },

  /**
   * Hiển thị thông báo Toast góc màn hình giống màn danh mục
   */
  showToast: function (message, type) {
    if (window.AdminApp && typeof window.AdminApp.showToast === 'function') {
      window.AdminApp.showToast(message, type || 'info');
    } else {
      alert(message);
    }
  }
};

// Đăng ký toàn cục để các hàm onclick inline trên HTML gọi được
window.ThuongHieuLogic = ThuongHieuLogic;
window.ThuongHieuComponent = ThuongHieuLogic;
