package doantotnghiep.example.DoAnTotNghiep.DTO;

import java.math.BigDecimal;

/**
 * OrderSummaryDTO - Đối tượng vận chuyển dữ liệu Thống kê tổng quan đơn hàng.
 * Phục vụ cho API GET /api/admin/orders/summary trên Admin Dashboard.
 */
public class OrderSummaryDTO {
    private Long totalOrders;
    private Long pendingOrders;      // Chờ xác nhận
    private Long processingOrders;   // Đang chuẩn bị hàng
    private Long shippingOrders;     // Đang giao hàng
    private Long completedOrders;    // Đã giao hàng
    private Long cancelledOrders;    // Đã hủy
    private BigDecimal totalRevenue; // Tổng doanh thu các đơn Đã giao hàng

    public OrderSummaryDTO() {
        this.totalOrders = 0L;
        this.pendingOrders = 0L;
        this.processingOrders = 0L;
        this.shippingOrders = 0L;
        this.completedOrders = 0L;
        this.cancelledOrders = 0L;
        this.totalRevenue = BigDecimal.ZERO;
    }

    public OrderSummaryDTO(Long totalOrders, Long pendingOrders, Long processingOrders, Long shippingOrders, Long completedOrders, Long cancelledOrders, BigDecimal totalRevenue) {
        this.totalOrders = totalOrders;
        this.pendingOrders = pendingOrders;
        this.processingOrders = processingOrders;
        this.shippingOrders = shippingOrders;
        this.completedOrders = completedOrders;
        this.cancelledOrders = cancelledOrders;
        this.totalRevenue = totalRevenue != null ? totalRevenue : BigDecimal.ZERO;
    }

    public Long getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(Long totalOrders) {
        this.totalOrders = totalOrders;
    }

    public Long getPendingOrders() {
        return pendingOrders;
    }

    public void setPendingOrders(Long pendingOrders) {
        this.pendingOrders = pendingOrders;
    }

    public Long getProcessingOrders() {
        return processingOrders;
    }

    public void setProcessingOrders(Long processingOrders) {
        this.processingOrders = processingOrders;
    }

    public Long getShippingOrders() {
        return shippingOrders;
    }

    public void setShippingOrders(Long shippingOrders) {
        this.shippingOrders = shippingOrders;
    }

    public Long getCompletedOrders() {
        return completedOrders;
    }

    public void setCompletedOrders(Long completedOrders) {
        this.completedOrders = completedOrders;
    }

    public Long getCancelledOrders() {
        return cancelledOrders;
    }

    public void setCancelledOrders(Long cancelledOrders) {
        this.cancelledOrders = cancelledOrders;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }
}
