/**
 * khach-hang-logic.js - Xử lý hiển thị danh sách khách hàng và khóa/mở khóa tài khoản
 * Viết theo cú pháp Javascript đơn giản, dễ hiểu cho đồ án tốt nghiệp
 */

// Biến lưu trang hiện tại
let currentCustomerPage = 1;

const KhachHangLogic = {
  /**
   * Khởi tạo giao diện khi mở trang Khách hàng
   */
  init: function () {
    currentCustomerPage = 1;
    this.bindBackdropClose();
    this.loadCustomers(1);
  },

  /**
   * Đóng modal khi bấm ra ngoài hoặc ấn nút Esc
   */
  bindBackdropClose: function () {
    const modal = document.getElementById('customer-detail-modal');
    if (modal) {
      modal.onclick = function (e) {
        if (e.target === modal) {
          KhachHangLogic.closeDetailModal();
        }
      };
    }

    document.onkeydown = function (e) {
      if (e.key === 'Escape') {
        KhachHangLogic.closeDetailModal();
      }
    };
  },

  /**
   * Tải danh sách khách hàng từ server và hiển thị lên bảng
   */
  loadCustomers: async function (page) {
    if (!page || page < 1) page = 1;
    currentCustomerPage = page;

    const tbody = document.getElementById('customer-table-body');
    if (tbody) {
      tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 24px; color: #64748b;"><i class="fa-solid fa-spinner fa-spin"></i> Đang tải danh sách tài khoản khách hàng...</td></tr>';
    }

    // Lấy từ khóa tìm kiếm và trạng thái lọc
    const searchInput = document.getElementById('cust-search-input');
    const statusSelect = document.getElementById('cust-filter-status');

    const keyword = searchInput ? searchInput.value.trim() : '';
    const enabled = statusSelect ? statusSelect.value : '';

    // Gọi API từ file khach-hang.js
    const data = await window.CustomerApi.getCustomers({
      keyword: keyword,
      enabled: enabled,
      page: currentCustomerPage,
      size: 10
    });

    const list = data.content || [];
    this.renderTable(list);
    this.renderPagination(data);
  },

  /**
   * Vẽ các dòng dữ liệu vào bảng
   */
  renderTable: function (list) {
    const tbody = document.getElementById('customer-table-body');
    if (!tbody) return;

    if (!list || list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 30px; color: #64748b;"><i class="fa-solid fa-folder-open" style="font-size: 20px; margin-bottom: 6px;"></i><div>Không tìm thấy khách hàng nào</div></td></tr>';
      return;
    }

    let html = '';
    for (let i = 0; i < list.length; i++) {
      const u = list[i];

      // Hiển thị nhãn trạng thái và nút hành động tương ứng
      let statusHtml = '';
      let actionBtn = '';

      if (u.enabled === true) {
        statusHtml = '<span class="badge badge-success"><i class="fa-solid fa-check-circle"></i> Đang hoạt động</span>';
        actionBtn = '<button type="button" class="btn-action lock" title="Khóa tài khoản" onclick="KhachHangLogic.toggleStatus(' + u.id + ', true)"><i class="fa-solid fa-lock"></i></button>';
      } else {
        statusHtml = '<span class="badge badge-danger"><i class="fa-solid fa-ban"></i> Đã khóa</span>';
        actionBtn = '<button type="button" class="btn-action unlock" title="Mở khóa tài khoản" onclick="KhachHangLogic.toggleStatus(' + u.id + ', false)"><i class="fa-solid fa-unlock"></i></button>';
      }

      // Định dạng ngày tạo đơn giản
      let dateText = '-';
      if (u.createdAt) {
        const d = new Date(u.createdAt);
        dateText = d.toLocaleDateString('vi-VN');
      }

      html += '<tr>';
      html += '<td><strong>#' + u.id + '</strong></td>';
      html += '<td><strong>' + (u.username || '-') + '</strong></td>';
      html += '<td>' + (u.fullName || '-') + '</td>';
      html += '<td>' + (u.email || '-') + '</td>';
      html += '<td>' + (u.phone || '-') + '</td>';
      html += '<td>' + dateText + '</td>';
      html += '<td>' + statusHtml + '</td>';
      html += '<td style="text-align: right;">';
      html += '<div class="action-btns-wrap">';
      html += '<button type="button" class="btn-action view" title="Xem chi tiết" onclick="KhachHangLogic.openDetailModal(' + u.id + ')"><i class="fa-solid fa-eye"></i></button>';
      html += actionBtn;
      html += '</div>';
      html += '</td>';
      html += '</tr>';
    }

    tbody.innerHTML = html;
  },

  /**
   * Hiển thị phân trang đơn giản
   */
  renderPagination: function (pageData) {
    const infoEl = document.getElementById('customer-pagination-info');
    const controlsEl = document.getElementById('customer-pagination-controls');

    if (!infoEl || !controlsEl) return;

    const totalElements = pageData.totalElements || 0;
    const totalPages = pageData.totalPages || 1;
    const page = pageData.page || 1;

    infoEl.innerText = 'Trang ' + page + ' / ' + totalPages + ' (Tổng số ' + totalElements + ' khách hàng)';

    if (totalPages <= 1) {
      controlsEl.innerHTML = '';
      return;
    }

    let html = '';

    // Nút trước (Previous)
    if (page > 1) {
      html += '<button class="page-btn" onclick="KhachHangLogic.loadCustomers(' + (page - 1) + ')" title="Trang trước"><i class="fa-solid fa-chevron-left"></i></button> ';
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
        html += '<button class="page-btn" onclick="KhachHangLogic.loadCustomers(' + p + ')">' + p + '</button> ';
      }
    }

    // Nút sau (Next)
    if (page < totalPages) {
      html += '<button class="page-btn" onclick="KhachHangLogic.loadCustomers(' + (page + 1) + ')" title="Trang sau"><i class="fa-solid fa-chevron-right"></i></button>';
    } else {
      html += '<button class="page-btn" disabled title="Trang sau"><i class="fa-solid fa-chevron-right"></i></button>';
    }

    controlsEl.innerHTML = html;
  },

  /**
   * Mở modal xem thông tin tài khoản khách hàng
   */
  openDetailModal: async function (id) {
    const modal = document.getElementById('customer-detail-modal');
    const content = document.getElementById('customer-detail-content');

    if (!modal) return;

    if (content) {
      content.innerHTML = '<div style="text-align: center; padding: 24px; color: #64748b;"><i class="fa-solid fa-spinner fa-spin"></i> Đang tải thông tin...</div>';
    }

    modal.classList.add('show');
    modal.style.display = 'flex';

    // Gọi API lấy chi tiết khách hàng
    const u = await window.CustomerApi.getCustomerById(id);
    if (!u) {
      if (content) content.innerHTML = '<div style="color: #ef4444; text-align: center; padding: 20px;">Không tìm thấy thông tin khách hàng!</div>';
      return;
    }

    let statusText = u.enabled
      ? '<span class="badge badge-success"><i class="fa-solid fa-check-circle"></i> Đang hoạt động (ACTIVE)</span>'
      : '<span class="badge badge-danger"><i class="fa-solid fa-ban"></i> Đã khóa (LOCKED)</span>';

    let createdDate = u.createdAt ? new Date(u.createdAt).toLocaleString('vi-VN') : '-';
    let updatedDate = u.updatedAt ? new Date(u.updatedAt).toLocaleString('vi-VN') : '-';

    let html = '';
    html += '<div class="customer-info-card">';
    html += '<div class="customer-info-grid">';
    html += '<div class="customer-info-item"><span class="customer-info-label">Mã khách hàng (ID)</span><span class="customer-info-value">#' + u.id + '</span></div>';
    html += '<div class="customer-info-item"><span class="customer-info-label">Tên đăng nhập</span><span class="customer-info-value">' + (u.username || '-') + '</span></div>';
    html += '<div class="customer-info-item"><span class="customer-info-label">Họ và tên</span><span class="customer-info-value">' + (u.fullName || '-') + '</span></div>';
    html += '<div class="customer-info-item"><span class="customer-info-label">Email</span><span class="customer-info-value">' + (u.email || '-') + '</span></div>';
    html += '<div class="customer-info-item"><span class="customer-info-label">Số điện thoại</span><span class="customer-info-value">' + (u.phone || '-') + '</span></div>';
    html += '<div class="customer-info-item"><span class="customer-info-label">Trạng thái</span><span class="customer-info-value">' + statusText + '</span></div>';
    html += '<div class="customer-info-item"><span class="customer-info-label">Ngày đăng ký</span><span class="customer-info-value">' + createdDate + '</span></div>';
    html += '<div class="customer-info-item"><span class="customer-info-label">Cập nhật gần nhất</span><span class="customer-info-value">' + updatedDate + '</span></div>';
    html += '</div>';
    html += '</div>';

    if (content) {
      content.innerHTML = html;
    }
  },

  /**
   * Đóng modal chi tiết
   */
  closeDetailModal: function () {
    const modal = document.getElementById('customer-detail-modal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  },

  /**
   * Khóa hoặc mở khóa tài khoản (không cần confirm)
   */
  toggleStatus: async function (id, currentStatus) {
    const actionText = currentStatus ? 'khóa' : 'mở khóa';

    try {
      const newStatus = !currentStatus;
      await window.CustomerApi.updateCustomerStatus(id, newStatus);
      this.showToast('Đã ' + actionText + ' tài khoản thành công!', newStatus ? 'success' : 'warning');
      // Tải lại bảng ở trang hiện tại
      this.loadCustomers(currentCustomerPage);
    } catch (e) {
      console.error('[KhachHangLogic] Lỗi toggleStatus:', e);
      this.showToast('Có lỗi xảy ra: ' + e.message, 'error');
    }
  },

  /**
   * Tìm kiếm khách hàng khi người dùng gõ
   */
  onSearch: function () {
    this.loadCustomers(1);
  },

  /**
   * Lọc khi thay đổi trạng thái
   */
  onStatusFilterChange: function () {
    this.loadCustomers(1);
  },

  /**
   * Đặt lại bộ lọc tìm kiếm
   */
  resetFilter: function () {
    const searchInput = document.getElementById('cust-search-input');
    const statusSelect = document.getElementById('cust-filter-status');

    if (searchInput) searchInput.value = '';
    if (statusSelect) statusSelect.value = '';

    this.showToast('Đã đặt lại bộ lọc khách hàng', 'info');
    this.loadCustomers(1);
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
window.KhachHangLogic = KhachHangLogic;
window.KhachHangComponent = KhachHangLogic;
