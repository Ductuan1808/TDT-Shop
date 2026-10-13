/**
 * thong-ke-logic.js - Xử lý logic giao diện, chuyển mốc thời gian, kiểm tra khoảng ngày Thống kê
 */

(function () {
  'use strict';

  const ThongKeLogic = {
    currentTimeFilter: 'month',

    /**
     * Khởi tạo giao diện khi màn Thống kê được nạp
     */
    init: function () {
      this.setDefaultDates();
    },

    setDefaultDates: function () {
      const fromInput = document.getElementById('stats-date-from');
      const toInput = document.getElementById('stats-date-to');
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
     * Chuyển đổi bộ lọc thời gian (Hôm nay / 7 ngày qua / Tháng này / Năm nay / Tùy chọn)
     * @param {'today' | 'week' | 'month' | 'year' | 'custom'} range
     */
    setTimeFilter: function (range) {
      this.currentTimeFilter = range;

      const buttons = {
        'today': document.getElementById('btn-stats-today'),
        'week': document.getElementById('btn-stats-week'),
        'month': document.getElementById('btn-stats-month'),
        'year': document.getElementById('btn-stats-year'),
        'custom': document.getElementById('btn-stats-custom')
      };

      Object.entries(buttons).forEach(([key, btn]) => {
        if (btn) {
          if (key === range) {
            btn.classList.add('active');
          } else {
            btn.classList.remove('active');
          }
        }
      });

      // Hiện / ẩn thanh chọn khoảng ngày tùy chỉnh
      const customBar = document.getElementById('stats-custom-date-bar');
      if (customBar) {
        customBar.style.display = range === 'custom' ? 'flex' : 'none';
      }

      if (range !== 'custom' && window.AdminApp?.showToast) {
        const labelMap = {
          'today': 'Hôm nay',
          'week': '7 ngày qua',
          'month': 'Tháng này',
          'year': 'Năm nay'
        };
        window.AdminApp.showToast(`Đã chuyển mốc thống kê: ${labelMap[range]}`, 'info');
      }
    },

    /**
     * Check dữ liệu nhập liệu & Áp dụng khoảng ngày tùy chỉnh
     */
    applyCustomDateRange: function () {
      const fromInput = document.getElementById('stats-date-from');
      const toInput = document.getElementById('stats-date-to');
      const hint = document.getElementById('stats-custom-date-hint');

      if (!fromInput || !toInput) return;

      const fromVal = fromInput.value;
      const toVal = toInput.value;

      // Check validation: Không được để trống
      if (!fromVal || !toVal) {
        if (window.AdminApp?.showToast) {
          window.AdminApp.showToast('Vui lòng chọn đầy đủ ngày bắt đầu và ngày kết thúc!', 'warning');
        } else {
          alert('Vui lòng chọn đầy đủ ngày bắt đầu và ngày kết thúc!');
        }
        return;
      }

      // Check validation: Ngày bắt đầu không được lớn hơn ngày kết thúc
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
        hint.textContent = `Đang thống kê từ ${fromVal} đến ${toVal}`;
      }

      if (window.AdminApp?.showToast) {
        window.AdminApp.showToast(`Đã áp dụng mốc ngày: ${fromVal} đến ${toVal}`, 'success');
      }
    }
  };

  // Đồng bộ cho các nút gọi onclick inline trên HTML
  window.ThongKeLogic = ThongKeLogic;
  window.ThongKeComponent = ThongKeLogic;
})();
