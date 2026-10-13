/**
 * admin.js - Quản lý chuyển trang giữa 9 màn hình Admin TDT Shop
 * Mục đích duy nhất: Điều hướng và chuyển đổi qua lại giữa các màn hình quản trị.
 */

(function () {
  'use strict';

  // Danh mục các màn hình quản trị (kèm submenu Thêm sản phẩm)
  const ADMIN_PAGES = {
    'tong-quan': {
      title: 'Tổng quan',
      breadcrumb: 'Admin / Tổng quan Dashboard',
      file: 'tong-quan',
      componentName: 'TongQuanLogic'
    },
    'san-pham': {
      title: 'Quản lý sản phẩm',
      breadcrumb: 'Admin / Sản phẩm & Kho hàng',
      file: 'san-pham',
      componentName: 'SanPhamLogic'
    },
    'san-pham-them': {
      title: 'Thêm sản phẩm mới',
      breadcrumb: 'Admin / Sản phẩm / Thêm mới',
      file: 'san-pham',
      componentName: 'SanPhamLogic',
      autoOpenAddModal: true
    },
    'don-hang': {
      title: 'Quản lý đơn hàng',
      breadcrumb: 'Admin / Đơn đặt hàng',
      file: 'don-hang',
      componentName: 'DonHangLogic'
    },
    'danh-muc': {
      title: 'Quản lý danh mục',
      breadcrumb: 'Admin / Danh mục sản phẩm',
      file: 'danh-muc',
      componentName: 'DanhMucLogic'
    },
    'thuong-hieu': {
      title: 'Quản lý thương hiệu',
      breadcrumb: 'Admin / Thương hiệu đối tác',
      file: 'thuong-hieu',
      componentName: 'ThuongHieuLogic'
    },
    'khach-hang': {
      title: 'Quản lý khách hàng',
      breadcrumb: 'Admin / Khách hàng thành viên',
      file: 'khach-hang',
      componentName: 'KhachHangLogic'
    },
    'voucher': {
      title: 'Quản lý Voucher',
      breadcrumb: 'Admin / Khuyến mãi & Mã giảm giá',
      file: 'voucher',
      componentName: 'VoucherLogic'
    },
    'build-pc': {
      title: 'Quản lý cấu hình Build PC',
      breadcrumb: 'Admin / Chuyên biệt dàn PC',
      file: 'build-pc',
      componentName: 'BuildPcLogic'
    },
    'thong-ke': {
      title: 'Báo cáo & Thống kê',
      breadcrumb: 'Admin / Thống kê kinh doanh',
      file: 'thong-ke',
      componentName: 'ThongKeLogic'
    }
  };

  const DEFAULT_PAGE = 'tong-quan';

  const AdminApp = {
    currentPage: null,

    /**
     * Khởi tạo bộ chuyển trang Admin
     */
    init: function () {
      this.bindNavigation();
      this.handleRoute();
    },

    /**
     * Lắng nghe sự kiện hashchange và click trên menu sidebar
     */
    bindNavigation: function () {
      window.addEventListener('hashchange', () => this.handleRoute());

      // Lắng nghe click trực tiếp trên các mục sidebar (cả menu chính và submenu)
      document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href^="#"]');
        if (link && link.closest('.admin-sidebar')) {
          const page = link.getAttribute('href').replace('#', '').trim();
          if (ADMIN_PAGES[page]) {
            e.preventDefault();
            if (page === 'san-pham-them') {
              if (this.currentPage !== 'san-pham') {
                this.navigateTo('san-pham');
              }
              setTimeout(() => {
                if (window.SanPhamLogic && typeof window.SanPhamLogic.openAddModal === 'function') {
                  window.SanPhamLogic.openAddModal();
                }
              }, 120);
            } else {
              if (window.location.hash === '#' + page) {
                this.handleRoute();
              } else {
                this.navigateTo(page);
              }
            }
          }
        }
      });
    },

    /**
     * Chuyển đến màn hình được chỉ định
     * @param {string} page
     */
    navigateTo: function (page) {
      if (!ADMIN_PAGES[page]) {
        page = DEFAULT_PAGE;
      }
      window.location.hash = '#' + page;
    },

    /**
     * Xử lý nạp màn hình theo URL hash
     */
    handleRoute: function () {
      let page = window.location.hash.replace('#', '').trim();
      if (!page || !ADMIN_PAGES[page]) {
        page = DEFAULT_PAGE;
      }

      this.currentPage = page;
      this.renderPage(page);
      this.updateSidebarUI(page);
      this.updateTopbarUI(page);
    },

    /**
     * Render nội dung màn hình từ file HTML riêng lẻ vào container chính
     * @param {string} page
     */
    renderPage: function (page) {
      const config = ADMIN_PAGES[page];
      const container = document.getElementById('admin-content-container');
      if (!container || !config) return;

      const fetchFile = config.file || (page.startsWith('san-pham') ? 'san-pham' : page);

      fetch(`/pages/admin/${fetchFile}.html?_t=${Date.now()}`)
        .then((res) => {
          if (!res.ok) throw new Error('Không thể tải màn hình ' + page);
          return res.text();
        })
        .then((html) => {
          container.innerHTML = html;
          this.triggerPageLogic(config);
        })
        .catch((err) => {
          container.innerHTML = `
            <div class="admin-card" style="padding: 30px; text-align: center; color: #ef4444;">
              <i class="fa-solid fa-triangle-exclamation" style="font-size: 32px; margin-bottom: 10px;"></i>
              <p>Lỗi hiển thị: ${err.message}</p>
            </div>
          `;
        });
    },

    /**
     * Kích hoạt hàm khởi tạo giao diện của component logic tương ứng
     * @param {object} config
     */
    triggerPageLogic: function (config) {
      const componentName = config.componentName;
      if (componentName && window[componentName] && typeof window[componentName].init === 'function') {
        try {
          window[componentName].init();
        } catch (e) {
          console.warn(`[AdminApp] Lỗi kích hoạt ${componentName}.init():`, e);
        }
      }

      // Nếu là route "Thêm sản phẩm", tự động mở modal thêm
      if (config.autoOpenAddModal && window.SanPhamLogic && typeof window.SanPhamLogic.openAddModal === 'function') {
        setTimeout(() => {
          window.SanPhamLogic.openAddModal();
        }, 50);
      }
    },

    /**
     * Cập nhật trạng thái active trên thanh Sidebar và Submenu
     * @param {string} page
     */
    updateSidebarUI: function (page) {
      const menuItems = document.querySelectorAll('.admin-sidebar .menu-item');
      menuItems.forEach((item) => {
        const itemRoute = item.getAttribute('data-route');
        if (itemRoute === page) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });

      // Xử lý riêng cho Submenu Sản phẩm (menu-product-parent)
      const productParent = document.getElementById('menu-product-parent');
      const submenuItems = document.querySelectorAll('.submenu-item');

      if (page === 'san-pham' || page === 'san-pham-them') {
        if (productParent) {
          productParent.classList.add('open');
          productParent.classList.add('active');
        }
        submenuItems.forEach((sub) => {
          const subRoute = sub.getAttribute('data-route');
          if (subRoute === page) {
            sub.classList.add('active');
          } else {
            sub.classList.remove('active');
          }
        });
      } else {
        if (productParent) {
          productParent.classList.remove('active');
        }
        submenuItems.forEach((sub) => sub.classList.remove('active'));
      }
    },

    /**
     * Cập nhật tiêu đề trang và Breadcrumb trên Topbar
     * @param {string} page
     */
    updateTopbarUI: function (page) {
      const config = ADMIN_PAGES[page];
      if (!config) return;

      const titleEl = document.getElementById('topbar-title');
      const breadcrumbEl = document.getElementById('topbar-breadcrumb');

      if (titleEl) titleEl.textContent = config.title;
      if (breadcrumbEl) breadcrumbEl.textContent = config.breadcrumb;
    },

    /**
     * Bật/tắt Sidebar trên màn hình máy tính hoặc di động
     */
    toggleSidebar: function () {
      const app = document.querySelector('.admin-app') || document.body;
      const sidebar = document.querySelector('.admin-sidebar');
      if (!sidebar) return;

      if (window.innerWidth <= 1024) {
        sidebar.classList.toggle('open');
      } else {
        app.classList.toggle('sidebar-collapsed');
      }
    },

    /**
     * Bật/tắt menu con trên Sidebar (hỗ trợ cả tham số ID chuỗi lẫn Event)
     * @param {string|Event} target
     */
    toggleSubmenu: function (target) {
      let el = null;
      if (typeof target === 'string') {
        el = document.getElementById(target);
      } else if (target && target.currentTarget) {
        el = target.currentTarget.closest('.has-submenu') || target.currentTarget.closest('.menu-item');
      }
      if (!el) {
        el = document.getElementById('menu-product-parent') || document.querySelector('.has-submenu');
      }
      if (el) {
        el.classList.toggle('open');
      }
    },

    /**
     * Bật/tắt dropdown thông báo trên Topbar
     */
    toggleNotificationDropdown: function () {
      const dropdown = document.getElementById('notification-dropdown');
      if (dropdown) {
        dropdown.style.display = dropdown.style.display === 'none' || !dropdown.style.display ? 'block' : 'none';
      }
    },

    /**
     * Đóng modal xác nhận toàn cục
     */
    closeConfirmModal: function () {
      const modal = document.getElementById('global-confirm-modal');
      if (modal) modal.style.display = 'none';
    },

    /**
     * Khôi phục giao diện mẫu
     */
    confirmResetData: function () {
      if (confirm('Khôi phục giao diện về trạng thái ban đầu?')) {
        window.location.reload();
      }
    },

    /**
     * Hiển thị thông báo Toast cao cấp chuẩn chung cho toàn bộ Admin TDT Shop
     * Tự động sinh tiêu đề, biểu tượng và hỗ trợ z-index cao (nổi trên cả Modal)
     */
    showToast: function (message, type = 'info', title = null) {
      let container = document.getElementById('toast-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
      }

      const toast = document.createElement('div');
      const normalizedType = (type === 'danger') ? 'error' : type;
      toast.className = `toast ${normalizedType}`;

      let icon = 'fa-circle-info';
      let defTitle = 'Thông báo';
      if (normalizedType === 'success') {
        icon = 'fa-circle-check';
        defTitle = 'Thành công';
      } else if (normalizedType === 'error') {
        icon = 'fa-circle-exclamation';
        defTitle = 'Lỗi dữ liệu';
      } else if (normalizedType === 'warning') {
        icon = 'fa-triangle-exclamation';
        defTitle = 'Cảnh báo';
      }

      toast.innerHTML = `
        <div class="toast-icon-wrap">
          <i class="fa-solid ${icon}"></i>
        </div>
        <div class="toast-body">
          <div class="toast-title">${title || defTitle}</div>
          <div class="toast-message">${message}</div>
        </div>
        <button type="button" class="toast-close" title="Đóng">&times;</button>
      `;

      const closeBtn = toast.querySelector('.toast-close');
      const removeToast = () => {
        toast.classList.add('toast-hide');
        setTimeout(() => {
          if (toast.parentElement) toast.remove();
        }, 250);
      };
      if (closeBtn) closeBtn.onclick = removeToast;

      container.appendChild(toast);
      setTimeout(removeToast, 4500);
    }
  };

  // Đăng ký toàn cục để các sự kiện onclick trên HTML có thể gọi được
  window.AdminApp = AdminApp;

  // Tự động khởi chạy Router khi DOM đã sẵn sàng
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => AdminApp.init());
  } else {
    AdminApp.init();
  }
})();
