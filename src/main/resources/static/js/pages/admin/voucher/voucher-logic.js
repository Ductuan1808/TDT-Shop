/**
 * =========================================================================
 * voucher-logic.js - Xử lý logic hiển thị danh sách voucher, thêm/sửa, 
 * ẩn/hiện voucher và phân trang cho Quản lý Voucher Admin TDT Shop.
 * Cú pháp Javascript đơn giản, dễ hiểu cho đồ án tốt nghiệp.
 * =========================================================================
 */

let currentVoucherPage = 1;
let voucherSearchTimer = null;

const VoucherLogic = {
  /**
   * Khởi tạo giao diện khi nạp màn hình Voucher
   */
  init: function () {
    currentVoucherPage = 1;
    this.bindBackdropClose();
    this.renderStatusFilterOptions();
    this.loadVouchers(1);
  },

  /**
   * Đảm bảo dropdown chọn trạng thái hiển thị đầy đủ các lựa chọn
   */
  renderStatusFilterOptions: function () {
    const statusSelect = document.getElementById('voucher-filter-status');
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
   * Bắt sự kiện đóng modal khi click ra ngoài backdrop hoặc ấn Esc
   */
  bindBackdropClose: function () {
    const modal = document.getElementById('voucher-modal');
    if (modal) {
      modal.onclick = function (e) {
        if (e.target === modal) {
          VoucherLogic.closeModal();
        }
      };
    }

    document.onkeydown = function (e) {
      if (e.key === 'Escape') {
        VoucherLogic.closeModal();
      }
    };
  },

  /**
   * Thiết lập thời gian mặc định khi mở modal thêm mới (từ hôm nay đến 30 ngày sau)
   */
  setDefaultDates: function () {
    const startInput = document.getElementById('voucher-start');
    const endInput = document.getElementById('voucher-end');
    const now = new Date();
    const nextMonth = new Date();
    nextMonth.setDate(nextMonth.getDate() + 30);

    if (startInput) {
      startInput.value = this.toDatetimeLocalString(now);
    }
    if (endInput) {
      endInput.value = this.toDatetimeLocalString(nextMonth);
    }
  },

  /**
   * Tải danh sách voucher từ server và render lên bảng
   */
  loadVouchers: async function (page) {
    if (!page || page < 1) page = 1;
    currentVoucherPage = page;

    this.renderStatusFilterOptions();

    const tbody = document.getElementById('voucher-table-body');
    if (tbody) {
      tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 24px; color: #64748b;"><i class="fa-solid fa-spinner fa-spin"></i> Đang tải danh sách voucher...</td></tr>';
    }

    const searchInput = document.getElementById('voucher-search-input');
    const statusSelect = document.getElementById('voucher-filter-status');

    const keyword = searchInput ? searchInput.value.trim() : '';
    const status = statusSelect ? statusSelect.value : '';

    try {
      const data = await window.VoucherApi.getVouchers({
        keyword: keyword,
        status: status,
        page: currentVoucherPage,
        size: 10
      });

      const list = data.content || [];
      this.renderTable(list);
      this.renderPagination(data);
    } catch (err) {
      console.error('[VoucherLogic] Lỗi loadVouchers:', err);
      if (tbody) {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 24px; color: #dc2626;"><i class="fa-solid fa-triangle-exclamation"></i> Lỗi tải danh sách voucher!</td></tr>';
      }
    }
  },

  /**
   * Render dữ liệu danh sách voucher ra bảng
   */
  renderTable: function (list) {
    const tbody = document.getElementById('voucher-table-body');
    if (!tbody) return;

    if (!list || list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 32px; color: #64748b;"><i class="fa-solid fa-ticket fa-2x" style="opacity: 0.3; margin-bottom: 8px; display: block;"></i> Không có voucher nào phù hợp</td></tr>';
      return;
    }

    let html = '';
    const now = new Date();

    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      const isExpired = item.endDate && new Date(item.endDate) < now;
      const isActive = item.status === true;

      // Trạng thái badge và nút ẩn / hiện
      let statusBadge = '';
      let lockBtn = '';

      if (isActive) {
        statusBadge = '<span class="badge badge-success"><i class="fa-solid fa-check-circle"></i> Đang hoạt động</span>';
        lockBtn = '<button type="button" class="btn-action lock" title="Ẩn voucher (Tạm ngưng)" onclick="window.VoucherComponent.toggleStatus(' + item.id + ', true)"><i class="fa-solid fa-eye-slash"></i></button>';
      } else {
        statusBadge = '<span class="badge badge-danger"><i class="fa-solid fa-ban"></i> Đã ẩn / Tạm ngưng</span>';
        lockBtn = '<button type="button" class="btn-action unlock" title="Hiện voucher (Kích hoạt)" onclick="window.VoucherComponent.toggleStatus(' + item.id + ', false)"><i class="fa-solid fa-eye"></i></button>';
      }

      // Thời gian hiệu lực
      let timeDisplay = this.formatDateTime(item.startDate) + '<br><span style="color: #64748b; font-size: 12px;">đến ' + this.formatDateTime(item.endDate) + '</span>';
      if (isExpired) {
        timeDisplay += ' <span class="badge badge-warning" style="font-size: 10px; padding: 1px 6px; margin-top: 2px;">Hết hạn</span>';
      }

      html += '<tr>' +
        '<td><strong>#' + item.id + '</strong></td>' +
        '<td><span class="voucher-code-badge">' + (item.code || '') + '</span></td>' +
        '<td><span style="font-weight: 600; color: var(--text-primary);">' + (item.name || '') + '</span></td>' +
        '<td><strong style="color: var(--primary); font-size: 14px;">' + this.formatCurrency(item.discountAmount) + '</strong></td>' +
        '<td><span>' + this.formatCurrency(item.minOrderAmount) + '</span></td>' +
        '<td>' + timeDisplay + '</td>' +
        '<td style="text-align: center;"><span style="font-weight: 700; background: #f1f5f9; padding: 3px 10px; border-radius: 4px;">' + (item.quantity != null ? item.quantity : 0) + '</span></td>' +
        '<td>' + statusBadge + '</td>' +
        '<td style="text-align: right;">' +
          '<div class="action-btns-wrap">' +
            '<button type="button" class="btn-action edit" title="Chỉnh sửa voucher" onclick="window.VoucherComponent.openEditModal(' + item.id + ')">' +
              '<i class="fa-solid fa-pen-to-square"></i>' +
            '</button>' +
            lockBtn +
          '</div>' +
        '</td>' +
      '</tr>';
    }

    tbody.innerHTML = html;
  },

  /**
   * Render thanh phân trang
   */
  renderPagination: function (pageData) {
    const info = document.getElementById('voucher-pagination-info');
    const controls = document.getElementById('voucher-pagination-controls');
    if (!info || !controls) return;

    const total = pageData.totalElements || 0;
    const page = pageData.page || 1;
    const size = pageData.size || 10;
    const totalPages = pageData.totalPages || Math.ceil(total / size) || 1;

    if (total === 0) {
      info.textContent = 'Không có bản ghi nào';
      controls.innerHTML = '';
      return;
    }

    const start = (page - 1) * size + 1;
    const end = Math.min(page * size, total);
    info.textContent = 'Trang ' + page + ' / ' + totalPages + ' (Tổng số ' + total + ' voucher)';

    if (totalPages <= 1) {
      controls.innerHTML = '';
      return;
    }

    let controlsHtml = '';
    // Nút Trước
    controlsHtml += '<button class="pagination-btn' + (page <= 1 ? ' disabled' : '') + '" ' +
      (page > 1 ? 'onclick="window.VoucherComponent.loadVouchers(' + (page - 1) + ')"' : '') + '>' +
      '<i class="fa-solid fa-chevron-left"></i></button>';

    // Các trang
    for (let p = 1; p <= totalPages; p++) {
      if (totalPages > 7) {
        if (p > 2 && p < totalPages - 1 && Math.abs(p - page) > 1) {
          if (p === 3 || p === totalPages - 2) {
            controlsHtml += '<span class="pagination-ellipsis">...</span>';
          }
          continue;
        }
      }

      controlsHtml += '<button class="pagination-btn' + (p === page ? ' active' : '') + '" ' +
        'onclick="window.VoucherComponent.loadVouchers(' + p + ')">' + p + '</button>';
    }

    // Nút Sau
    controlsHtml += '<button class="pagination-btn' + (page >= totalPages ? ' disabled' : '') + '" ' +
      (page < totalPages ? 'onclick="window.VoucherComponent.loadVouchers(' + (page + 1) + ')"' : '') + '>' +
      '<i class="fa-solid fa-chevron-right"></i></button>';

    controls.innerHTML = controlsHtml;
  },

  /**
   * Mở modal thêm voucher mới
   */
  openAddModal: function () {
    const modal = document.getElementById('voucher-modal');
    const title = document.getElementById('voucher-modal-title');
    const form = document.getElementById('voucher-form');

    if (!modal) return;
    if (title) title.innerHTML = '<i class="fa-solid fa-ticket-simple text-primary"></i> Tạo Voucher mới';
    if (form) form.reset();

    const idInput = document.getElementById('voucher-id');
    if (idInput) idInput.value = '';

    const qtyInput = document.getElementById('voucher-quantity');
    if (qtyInput) qtyInput.value = '50';

    const minOrderInput = document.getElementById('voucher-min-order');
    if (minOrderInput) minOrderInput.value = '0';

    const statusInput = document.getElementById('voucher-status');
    if (statusInput) statusInput.value = 'true';

    this.setDefaultDates();

    modal.classList.add('show');
    modal.style.display = 'flex';
  },

  /**
   * Mở modal chỉnh sửa voucher theo ID
   */
  openEditModal: async function (id) {
    const modal = document.getElementById('voucher-modal');
    const title = document.getElementById('voucher-modal-title');
    const form = document.getElementById('voucher-form');

    if (!modal) return;

    try {
      const voucher = await window.VoucherApi.getVoucherById(id);
      if (!voucher) {
        this.showToast('Không tìm thấy thông tin voucher!', 'error');
        return;
      }

      if (title) title.innerHTML = '<i class="fa-solid fa-pen-to-square text-primary"></i> Chỉnh sửa Voucher';
      if (form) form.reset();

      document.getElementById('voucher-id').value = voucher.id || '';
      document.getElementById('voucher-code').value = voucher.code || '';
      document.getElementById('voucher-name').value = voucher.name || '';
      document.getElementById('voucher-discount').value = voucher.discountAmount != null ? voucher.discountAmount : '';
      document.getElementById('voucher-min-order').value = voucher.minOrderAmount != null ? voucher.minOrderAmount : 0;
      document.getElementById('voucher-quantity').value = voucher.quantity != null ? voucher.quantity : 0;
      document.getElementById('voucher-status').value = String(voucher.status === true);

      if (voucher.startDate) {
        document.getElementById('voucher-start').value = this.toDatetimeLocalString(voucher.startDate);
      }
      if (voucher.endDate) {
        document.getElementById('voucher-end').value = this.toDatetimeLocalString(voucher.endDate);
      }

      modal.classList.add('show');
      modal.style.display = 'flex';
    } catch (err) {
      console.error('[VoucherLogic] Lỗi openEditModal:', err);
      this.showToast('Lỗi khi tải thông tin voucher!', 'error');
    }
  },

  /**
   * Đóng modal voucher
   */
  closeModal: function () {
    const modal = document.getElementById('voucher-modal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  },

  /**
   * Lưu voucher (thêm mới hoặc cập nhật)
   */
  handleSave: async function (event) {
    if (event) event.preventDefault();

    const idInput = document.getElementById('voucher-id');
    const codeInput = document.getElementById('voucher-code');
    const nameInput = document.getElementById('voucher-name');
    const discountInput = document.getElementById('voucher-discount');
    const minOrderInput = document.getElementById('voucher-min-order');
    const startInput = document.getElementById('voucher-start');
    const endInput = document.getElementById('voucher-end');
    const qtyInput = document.getElementById('voucher-quantity');
    const statusSelect = document.getElementById('voucher-status');

    const id = idInput ? idInput.value : '';
    const code = codeInput ? codeInput.value.trim().toUpperCase() : '';
    const name = nameInput ? nameInput.value.trim() : '';
    const discount = parseFloat(discountInput ? discountInput.value : 0);
    const minOrder = parseFloat(minOrderInput ? minOrderInput.value : 0);
    const startDate = startInput ? startInput.value : '';
    const endDate = endInput ? endInput.value : '';
    const qty = parseInt(qtyInput ? qtyInput.value : 0, 10);
    const status = statusSelect ? statusSelect.value === 'true' : true;

    // 1. Kiểm tra validation
    if (!code) {
      this.showToast('Vui lòng nhập Mã Voucher!', 'error');
      if (codeInput) codeInput.focus();
      return;
    }

    if (!name) {
      this.showToast('Vui lòng nhập Tên chương trình Voucher!', 'error');
      if (nameInput) nameInput.focus();
      return;
    }

    if (isNaN(discount) || discount <= 0) {
      this.showToast('Mức giảm giá phải lớn hơn 0!', 'error');
      if (discountInput) discountInput.focus();
      return;
    }

    if (isNaN(minOrder) || minOrder < 0) {
      this.showToast('Đơn tối thiểu không được âm!', 'error');
      if (minOrderInput) minOrderInput.focus();
      return;
    }

    if (!startDate || !endDate) {
      this.showToast('Vui lòng chọn cả Ngày bắt đầu và Ngày kết thúc!', 'error');
      return;
    }

    if (new Date(endDate) <= new Date(startDate)) {
      this.showToast('Ngày kết thúc phải lớn hơn ngày bắt đầu!', 'error');
      if (endInput) endInput.focus();
      return;
    }

    if (isNaN(qty) || qty < 0) {
      this.showToast('Số lượng phát hành không được là số âm!', 'error');
      if (qtyInput) qtyInput.focus();
      return;
    }

    // Chuẩn hóa định dạng ngày gửi lên Server (ISO 8601: YYYY-MM-DDTHH:mm:ss)
    const formattedStart = startDate.length === 16 ? startDate + ':00' : startDate;
    const formattedEnd = endDate.length === 16 ? endDate + ':00' : endDate;

    const payload = {
      code: code,
      name: name,
      discountAmount: discount,
      minOrderAmount: minOrder,
      startDate: formattedStart,
      endDate: formattedEnd,
      quantity: qty,
      status: status
    };

    try {
      if (id) {
        // Cập nhật
        await window.VoucherApi.updateVoucher(id, payload);
        this.showToast('Cập nhật Voucher [' + code + '] thành công!', 'success');
        this.closeModal();
        this.loadVouchers(currentVoucherPage);
      } else {
        // Thêm mới
        await window.VoucherApi.createVoucher(payload);
        this.showToast('Thêm mới Voucher [' + code + '] thành công!', 'success');
        this.closeModal();
        this.loadVouchers(1);
      }
    } catch (err) {
      console.error('[VoucherLogic] Lỗi handleSave:', err);
      let errorMsg = err.message || 'Lỗi khi lưu voucher!';
      if (errorMsg.indexOf('Duplicate') !== -1 || errorMsg.indexOf('UNIQUE') !== -1 || errorMsg.indexOf('tồn tại') !== -1) {
        errorMsg = 'Không thể tạo vì đã tồn tại voucher trên';
      }
      this.showToast(errorMsg, 'error');
    }
  },

  /**
   * Bật/tắt trạng thái ẩn/hiện voucher nhanh (không dùng confirm trình duyệt)
   */
  toggleStatus: async function (id, currentStatus) {
    try {
      await window.VoucherApi.toggleVoucherStatus(id);
      const actionText = currentStatus ? 'ẩn' : 'hiện';
      this.showToast('Đã ' + actionText + ' voucher thành công!', 'success');
      this.loadVouchers(currentVoucherPage);
    } catch (err) {
      console.error('[VoucherLogic] Lỗi toggleStatus:', err);
      this.showToast('Lỗi khi đổi trạng thái voucher: ' + (err.message || ''), 'error');
    }
  },

  /**
   * Tìm kiếm theo từ khóa (debounce 300ms)
   */
  onSearch: function (query) {
    if (voucherSearchTimer) {
      clearTimeout(voucherSearchTimer);
    }
    voucherSearchTimer = setTimeout(function () {
      VoucherLogic.loadVouchers(1);
    }, 300);
  },

  /**
   * Lọc theo trạng thái
   */
  onStatusFilterChange: function (val) {
    this.loadVouchers(1);
  },

  /**
   * Đặt lại bộ lọc tìm kiếm và trạng thái
   */
  resetFilter: function () {
    const searchInput = document.getElementById('voucher-search-input');
    const statusSelect = document.getElementById('voucher-filter-status');

    if (searchInput) searchInput.value = '';
    if (statusSelect) statusSelect.value = '';

    this.showToast('Đã đặt lại bộ lọc voucher', 'info');
    this.loadVouchers(1);
  },

  /**
   * Format tiền tệ (VD: 100.000₫)
   */
  formatCurrency: function (num) {
    if (num == null || isNaN(num)) return '0₫';
    return new Intl.NumberFormat('vi-VN').format(num) + '₫';
  },

  /**
   * Format ngày giờ hiển thị (VD: 12/10/2026 15:30)
   */
  formatDateTime: function (dateStr) {
    if (!dateStr) return '---';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      return day + '/' + month + '/' + year + ' ' + hours + ':' + minutes;
    } catch (e) {
      return dateStr;
    }
  },

  /**
   * Chuyển đổi Date sang định dạng input datetime-local (YYYY-MM-DDTHH:mm)
   */
  toDatetimeLocalString: function (dateInput) {
    if (!dateInput) return '';
    try {
      const d = new Date(dateInput);
      if (isNaN(d.getTime())) return '';
      const pad = function (n) { return String(n).padStart(2, '0'); };
      const year = d.getFullYear();
      const month = pad(d.getMonth() + 1);
      const day = pad(d.getDate());
      const hours = pad(d.getHours());
      const minutes = pad(d.getMinutes());
      return year + '-' + month + '-' + day + 'T' + hours + ':' + minutes;
    } catch (e) {
      return '';
    }
  },

  /**
   * Hiển thị popup Toast chuẩn thống nhất với toàn bộ hệ thống Admin
   */
  showToast: function (message, type) {
    if (window.AdminApp && typeof window.AdminApp.showToast === 'function') {
      window.AdminApp.showToast(message, type || 'info');
    }
  }
};

// Đồng bộ biến toàn cục cho cả Admin router và HTML inline onclick
window.VoucherLogic = VoucherLogic;
window.VoucherComponent = VoucherLogic;
