/**
 * tong-quan-logic.js - Xử lý logic giao diện, chuyển tab, kiểm tra khoảng ngày màn hình Tổng quan
 */

(function () {
  'use strict';

  const TongQuanLogic = {
    currentTab: '7days',

    /**
     * Khởi tạo giao diện khi màn Tổng quan được render
     */
    init: function () {
      this.bindTabDates();
    },

    bindTabDates: function () {
      const fromInput = document.getElementById('tq-date-from');
      const toInput = document.getElementById('tq-date-to');
      if (fromInput && !fromInput.value) {
        const d = new Date();
        d.setDate(d.getDate() - 30);
        fromInput.value = d.toISOString().split('T')[0];
      }
      if (toInput && !toInput.value) {
        toInput.value = new Date().toISOString().split('T')[0];
      }
    },

    /**
     * Chuyển tab biểu đồ: 7 ngày gần nhất / Tháng hiện tại / Tùy chọn ngày
     * @param {'7days' | 'month' | 'custom'} tab
     */
    switchRevenueChart: function (tab) {
      this.currentTab = tab;

      const tabButtons = {
        '7days': document.getElementById('btn-chart-7days'),
        'month': document.getElementById('btn-chart-month'),
        'custom': document.getElementById('btn-chart-custom')
      };

      Object.entries(tabButtons).forEach(([key, btn]) => {
        if (btn) {
          if (key === tab) {
            btn.classList.add('active');
          } else {
            btn.classList.remove('active');
          }
        }
      });

      // Hiện / ẩn khối chọn ngày tùy chỉnh
      const customBar = document.getElementById('tq-custom-date-bar');
      if (customBar) {
        customBar.style.display = tab === 'custom' ? 'flex' : 'none';
      }
    },

    /**
     * Kiểm tra hợp lệ dữ liệu và áp dụng khoảng ngày tùy chỉnh
     */
    applyCustomDateRange: function () {
      const fromInput = document.getElementById('tq-date-from');
      const toInput = document.getElementById('tq-date-to');
      const hint = document.getElementById('tq-custom-date-hint');

      if (!fromInput || !toInput) return;

      const fromVal = fromInput.value;
      const toVal = toInput.value;

      // Check dữ liệu: Không được để trống
      if (!fromVal || !toVal) {
        if (window.AdminApp?.showToast) {
          window.AdminApp.showToast('Vui lòng chọn cả ngày bắt đầu và ngày kết thúc!', 'warning');
        } else {
          alert('Vui lòng chọn cả ngày bắt đầu và ngày kết thúc!');
        }
        return;
      }

      // Check dữ liệu: Ngày bắt đầu không được lớn hơn ngày kết thúc
      const fromDate = new Date(fromVal);
      const toDate = new Date(toVal);
      if (fromDate > toDate) {
        if (window.AdminApp?.showToast) {
          window.AdminApp.showToast('Ngày bắt đầu không được lớn hơn ngày kết thúc!', 'error');
        } else {
          alert('Ngày bắt đầu không được lớn hơn ngày kết thúc!');
        }
        fromInput.focus();
        return;
      }

      if (hint) {
        hint.textContent = `Đang lọc từ ${fromVal} đến ${toVal}`;
      }

      if (window.AdminApp?.showToast) {
        window.AdminApp.showToast(`Đã áp dụng khoảng ngày: ${fromVal} đến ${toVal}`, 'success');
      }
    }
  };

  // Đồng bộ cho các nút gọi onclick inline trên HTML
  window.TongQuanLogic = TongQuanLogic;
  window.TongQuanComponent = TongQuanLogic;
})();
