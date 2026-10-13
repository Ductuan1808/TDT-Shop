/**
 * =========================================================================
 * don-hang-logic.js - Xử lý hiển thị danh sách đơn hàng, modal chi tiết,
 * tìm kiếm, lọc và cập nhật trạng thái đơn hàng cho Admin TDT Shop.
 * Cú pháp Javascript đơn giản, dễ đọc và dễ bảo trì cho đồ án tốt nghiệp.
 * =========================================================================
 */

let currentOrderPage = 1;
let orderSearchTimer = null;

const DonHangLogic = {
  /**
   * Khởi tạo giao diện khi mở trang Đơn hàng
   */
  init: function () {
    currentOrderPage = 1;
    this.bindBackdropClose();
    this.loadStatuses();
    this.loadOrders(1);
  },

  /**
   * Đóng modal khi bấm ra ngoài backdrop hoặc bấm phím Escape
   */
  bindBackdropClose: function () {
    const modal = document.getElementById('order-detail-modal');
    if (modal) {
      modal.onclick = function (e) {
        if (e.target === modal) {
          DonHangLogic.closeDetailModal();
        }
      };
    }

    document.onkeydown = function (e) {
      if (e.key === 'Escape') {
        DonHangLogic.closeDetailModal();
      }
    };
  },

  /**
   * Tải danh sách các trạng thái đơn hàng để nạp vào dropdown lọc
   */
  loadStatuses: async function () {
    const statusSelect = document.getElementById('order-filter-status');
    if (!statusSelect) return;

    try {
      const statuses = await window.OrderApi.getOrderStatuses();
      let html = '<option value="">Tất cả trạng thái</option>';
      for (let i = 0; i < statuses.length; i++) {
        html += '<option value="' + statuses[i] + '">' + statuses[i] + '</option>';
      }
      statusSelect.innerHTML = html;
    } catch (e) {
      console.error('[DonHangLogic] Lỗi loadStatuses:', e);
    }
  },

  /**
   * Tải danh sách đơn hàng từ server và hiển thị lên bảng
   */
  loadOrders: async function (page) {
    if (!page || page < 1) page = 1;
    currentOrderPage = page;

    const tbody = document.getElementById('order-table-body');
    if (tbody) {
      tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 24px; color: #64748b;"><i class="fa-solid fa-spinner fa-spin"></i> Đang tải danh sách đơn hàng...</td></tr>';
    }

    const searchInput = document.getElementById('order-search-input');
    const statusSelect = document.getElementById('order-filter-status');

    const keyword = searchInput ? searchInput.value.trim() : '';
    const status = statusSelect ? statusSelect.value : '';

    try {
      const data = await window.OrderApi.getOrders({
        keyword: keyword,
        status: status,
        page: currentOrderPage,
        size: 10
      });

      const list = data.content || [];
      this.renderTable(list);
      this.renderPagination(data);
    } catch (err) {
      console.error('[DonHangLogic] Lỗi loadOrders:', err);
      if (tbody) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 24px; color: #dc2626;"><i class="fa-solid fa-triangle-exclamation"></i> Lỗi tải danh sách đơn hàng!</td></tr>';
      }
    }
  },

  /**
   * Render dữ liệu danh sách đơn hàng ra bảng
   */
  renderTable: function (list) {
    const tbody = document.getElementById('order-table-body');
    if (!tbody) return;

    if (!list || list.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 32px; color: #64748b;"><i class="fa-solid fa-receipt fa-2x" style="opacity: 0.3; margin-bottom: 8px; display: block;"></i> Không có đơn hàng nào phù hợp</td></tr>';
      return;
    }

    let html = '';
    for (let i = 0; i < list.length; i++) {
      const o = list[i];
      const statusBadge = this.renderStatusBadge(o.status);

      html += '<tr>' +
        '<td><span class="order-code-badge">' + (o.orderCode || '#' + o.id) + '</span></td>' +
        '<td><strong>' + (o.customerName || 'Khách vãng lai') + '</strong></td>' +
        '<td>' + (o.receiverName || '-') + '</td>' +
        '<td>' + (o.receiverPhone || '-') + '</td>' +
        '<td>' + this.formatDateTime(o.createdAt) + '</td>' +
        '<td><strong style="color: var(--primary); font-size: 14px;">' + this.formatCurrency(o.totalAmount) + '</strong></td>' +
        '<td>' + statusBadge + '</td>' +
        '<td style="text-align: right;">' +
          '<div class="action-btns-wrap">' +
            '<button type="button" class="btn-action edit" title="Chi tiết & Cập nhật đơn hàng" onclick="window.DonHangComponent.openDetailModal(' + o.id + ')">' +
              '<i class="fa-solid fa-pen-to-square"></i>' +
            '</button>' +
          '</div>' +
        '</td>' +
      '</tr>';
    }

    tbody.innerHTML = html;
  },

  /**
   * Render nhãn trạng thái theo chuẩn màu sắc
   */
  renderStatusBadge: function (status) {
    const st = status ? status.trim() : '';
    if (st === 'Chờ xác nhận') {
      return '<span class="badge badge-warning"><i class="fa-solid fa-clock"></i> Chờ xác nhận</span>';
    } else if (st === 'Đang chuẩn bị hàng') {
      return '<span class="badge badge-info"><i class="fa-solid fa-box-open"></i> Đang chuẩn bị hàng</span>';
    } else if (st === 'Đang giao hàng') {
      return '<span class="badge badge-purple"><i class="fa-solid fa-truck-fast"></i> Đang giao hàng</span>';
    } else if (st === 'Đã giao hàng') {
      return '<span class="badge badge-success"><i class="fa-solid fa-circle-check"></i> Đã giao hàng</span>';
    } else if (st === 'Đã hủy') {
      return '<span class="badge badge-danger"><i class="fa-solid fa-ban"></i> Đã hủy</span>';
    }
    return '<span class="badge badge-secondary">' + (st || 'Chưa rõ') + '</span>';
  },

  /**
   * Render thanh phân trang
   */
  renderPagination: function (pageData) {
    const info = document.getElementById('order-pagination-info');
    const controls = document.getElementById('order-pagination-controls');
    if (!info || !controls) return;

    const total = pageData.totalElements || 0;
    const page = pageData.page || 1;
    const size = pageData.size || 10;
    const totalPages = pageData.totalPages || Math.ceil(total / size) || 1;

    if (total === 0) {
      info.textContent = 'Hiển thị 0 - 0 trên 0 đơn hàng';
      controls.innerHTML = '';
      return;
    }

    const start = (page - 1) * size + 1;
    const end = Math.min(page * size, total);
    info.textContent = 'Trang ' + page + ' / ' + totalPages + ' (Tổng số ' + total + ' đơn hàng)';

    if (totalPages <= 1) {
      controls.innerHTML = '';
      return;
    }

    let controlsHtml = '';
    // Nút Trước
    controlsHtml += '<button class="pagination-btn' + (page <= 1 ? ' disabled' : '') + '" ' +
      (page > 1 ? 'onclick="window.DonHangComponent.loadOrders(' + (page - 1) + ')"' : '') + '>' +
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
        'onclick="window.DonHangComponent.loadOrders(' + p + ')">' + p + '</button>';
    }

    // Nút Sau
    controlsHtml += '<button class="pagination-btn' + (page >= totalPages ? ' disabled' : '') + '" ' +
      (page < totalPages ? 'onclick="window.DonHangComponent.loadOrders(' + (page + 1) + ')"' : '') + '>' +
      '<i class="fa-solid fa-chevron-right"></i></button>';

    controls.innerHTML = controlsHtml;
  },

  /**
   * Mở modal xem chi tiết đơn hàng
   * @param {number|string} id
   */
  openDetailModal: async function (id) {
    const modal = document.getElementById('order-detail-modal');
    const codeSpan = document.getElementById('modal-order-code');
    const content = document.getElementById('order-detail-content');
    const footer = document.getElementById('order-modal-footer');

    if (!modal) return;

    if (content) {
      content.innerHTML = '<div style="text-align: center; padding: 40px; color: #64748b;"><i class="fa-solid fa-spinner fa-spin fa-2x"></i><p style="margin-top: 10px;">Đang tải chi tiết đơn hàng...</p></div>';
    }
    if (footer) footer.innerHTML = '';

    modal.classList.add('show');
    modal.style.display = 'flex';

    try {
      const order = await window.OrderApi.getOrderById(id);
      if (!order) {
        this.showToast('Không tìm thấy thông tin đơn hàng!', 'error');
        this.closeDetailModal();
        return;
      }

      if (codeSpan) {
        codeSpan.textContent = '[' + (order.orderCode || '#' + order.id) + ']';
      }

      // 1. Tạo giao diện chi tiết người nhận và trạng thái
      let html = '<div class="order-detail-grid">';

      // Khối 1: Thông tin người nhận & giao hàng
      html += '<div class="order-info-card">' +
        '<div class="order-info-title"><i class="fa-solid fa-location-dot text-primary"></i> Thông tin giao hàng</div>' +
        '<div class="order-info-row"><span class="order-info-label">Người nhận:</span><span class="order-info-value">' + (order.receiverName || '-') + '</span></div>' +
        '<div class="order-info-row"><span class="order-info-label">Số điện thoại:</span><span class="order-info-value">' + (order.receiverPhone || '-') + '</span></div>' +
        '<div class="order-info-row"><span class="order-info-label">Địa chỉ nhận hàng:</span><span class="order-info-value" style="max-width: 60%;">' + (order.shippingAddress || '-') + '</span></div>' +
        '<div class="order-info-row"><span class="order-info-label">Khách hàng:</span><span class="order-info-value">' + (order.customerName || 'Khách vãng lai') + '</span></div>' +
        '<div class="order-info-row"><span class="order-info-label">Ngày đặt hàng:</span><span class="order-info-value">' + this.formatDateTime(order.createdAt) + '</span></div>' +
      '</div>';

      // Khối 2: Trạng thái & cập nhật trạng thái
      const statuses = ["Chờ xác nhận", "Đang chuẩn bị hàng", "Đang giao hàng", "Đã giao hàng", "Đã hủy"];
      let statusOptions = '';
      for (let s = 0; s < statuses.length; s++) {
        const selected = statuses[s] === order.status ? ' selected' : '';
        statusOptions += '<option value="' + statuses[s] + '"' + selected + '>' + statuses[s] + '</option>';
      }

      html += '<div class="order-info-card">' +
        '<div class="order-info-title"><i class="fa-solid fa-list-check text-primary"></i> Trạng thái đơn hàng</div>' +
        '<div class="order-info-row"><span class="order-info-label">Trạng thái hiện tại:</span><span>' + this.renderStatusBadge(order.status) + '</span></div>' +
        '<div style="margin-top: 14px;">' +
          '<label class="form-label" style="font-size: 12px; margin-bottom: 4px;">Chuyển sang trạng thái mới:</label>' +
          '<select id="modal-order-status-select" class="form-control" style="font-weight: 600;">' +
            statusOptions +
          '</select>' +
        '</div>' +
      '</div>';

      html += '</div>'; // Đóng .order-detail-grid

      // 2. Bảng danh sách sản phẩm trong đơn
      html += '<div style="margin-top: 10px;">' +
        '<div class="order-info-title" style="margin-bottom: 8px;"><i class="fa-solid fa-boxes-stacked text-primary"></i> Sản phẩm trong đơn (' + (order.items ? order.items.length : 0) + ')</div>' +
        '<table class="order-items-table">' +
          '<thead>' +
            '<tr>' +
              '<th>Sản phẩm</th>' +
              '<th style="width: 120px;">Mã SKU</th>' +
              '<th style="text-align: right; width: 120px;">Đơn giá</th>' +
              '<th style="text-align: center; width: 80px;">Số lượng</th>' +
              '<th style="text-align: right; width: 130px;">Thành tiền</th>' +
            '</tr>' +
          '</thead>' +
          '<tbody>';

      if (order.items && order.items.length > 0) {
        for (let j = 0; j < order.items.length; j++) {
          const it = order.items[j];
          const itemTotal = (it.unitPrice || 0) * (it.quantity || 0);
          html += '<tr>' +
            '<td><strong>' + (it.productName || 'Sản phẩm #' + it.productId) + '</strong></td>' +
            '<td><span style="color: #64748b; font-size: 12px;">' + (it.sku || '-') + '</span></td>' +
            '<td style="text-align: right;">' + this.formatCurrency(it.unitPrice) + '</td>' +
            '<td style="text-align: center;"><strong>' + it.quantity + '</strong></td>' +
            '<td style="text-align: right;"><strong style="color: var(--primary);">' + this.formatCurrency(itemTotal) + '</strong></td>' +
          '</tr>';
        }
      } else {
        html += '<tr><td colspan="5" style="text-align: center; color: #64748b; padding: 16px;">Không có chi tiết sản phẩm</td></tr>';
      }

      html += '</tbody></table></div>';

      // 3. Khối tổng thanh toán
      html += '<div class="order-summary-box">' +
        '<div class="summary-line"><span>Tạm tính tiền hàng:</span><span>' + this.formatCurrency(order.subtotal) + '</span></div>' +
        '<div class="summary-line"><span>Giảm giá voucher:</span><span style="color: #ef4444;">- ' + this.formatCurrency(order.discountAmount || 0) + '</span></div>' +
        '<div class="summary-line"><span>Phí vận chuyển:</span><span>' + this.formatCurrency(order.shippingFee || 0) + '</span></div>' +
        '<div class="summary-line total"><span>Tổng thanh toán:</span><span>' + this.formatCurrency(order.totalAmount) + '</span></div>' +
      '</div>';

      if (content) {
        content.innerHTML = html;
      }

      // 4. Footer modal: Nút Đóng và Nút Cập nhật trạng thái
      if (footer) {
        footer.innerHTML =
          '<button type="button" class="btn btn-outline" onclick="window.DonHangComponent.closeDetailModal()">Đóng</button>' +
          '<button type="button" class="btn btn-primary" onclick="window.DonHangComponent.handleSaveStatus(' + order.id + ', \'' + (order.orderCode || '') + '\')">' +
            '<i class="fa-solid fa-floppy-disk"></i> Lưu trạng thái' +
          '</button>';
      }
    } catch (err) {
      console.error('[DonHangLogic] Lỗi openDetailModal:', err);
      this.showToast('Lỗi khi tải chi tiết đơn hàng!', 'error');
      this.closeDetailModal();
    }
  },

  /**
   * Đóng modal chi tiết đơn hàng
   */
  closeDetailModal: function () {
    const modal = document.getElementById('order-detail-modal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  },

  /**
   * Lưu cập nhật trạng thái từ modal
   */
  handleSaveStatus: async function (orderId, orderCode) {
    const select = document.getElementById('modal-order-status-select');
    if (!select) return;

    const newStatus = select.value;
    try {
      await window.OrderApi.updateOrderStatus(orderId, newStatus);
      this.showToast('Cập nhật trạng thái đơn [' + orderCode + '] thành công!', 'success');
      this.closeDetailModal();
      this.loadOrders(currentOrderPage);
    } catch (err) {
      console.error('[DonHangLogic] Lỗi handleSaveStatus:', err);
      this.showToast(err.message || 'Lỗi khi cập nhật trạng thái đơn hàng!', 'error');
    }
  },

  /**
   * Tìm kiếm theo từ khóa (debounce 300ms)
   */
  onSearch: function (query) {
    if (orderSearchTimer) {
      clearTimeout(orderSearchTimer);
    }
    orderSearchTimer = setTimeout(function () {
      DonHangLogic.loadOrders(1);
    }, 300);
  },

  /**
   * Lọc theo trạng thái
   */
  onStatusFilterChange: function (val) {
    this.loadOrders(1);
  },

  /**
   * Đặt lại bộ lọc tìm kiếm và trạng thái
   */
  resetFilter: function () {
    const searchInput = document.getElementById('order-search-input');
    const statusSelect = document.getElementById('order-filter-status');

    if (searchInput) searchInput.value = '';
    if (statusSelect) statusSelect.value = '';

    this.showToast('Đã đặt lại bộ lọc đơn hàng', 'info');
    this.loadOrders(1);
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
   * Hiển thị popup Toast chuẩn thống nhất với toàn bộ hệ thống Admin
   */
  showToast: function (message, type) {
    if (window.AdminApp && typeof window.AdminApp.showToast === 'function') {
      window.AdminApp.showToast(message, type || 'info');
    }
  }
};

// Đồng bộ biến toàn cục cho cả Admin router và HTML inline onclick
window.DonHangLogic = DonHangLogic;
window.DonHangComponent = DonHangLogic;
