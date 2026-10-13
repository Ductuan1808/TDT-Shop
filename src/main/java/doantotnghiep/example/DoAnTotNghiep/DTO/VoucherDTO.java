package doantotnghiep.example.DoAnTotNghiep.DTO;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * VoucherDTO - DTO truyền tải thông tin mã giảm giá phục vụ Admin Dashboard.
 * 
 * QUY TẮC THIẾT KẾ:
 * - Chứa các trường dữ liệu tương ứng với bảng `vouchers` trong CSDL.
 * - Sử dụng các kiểu dữ liệu cơ bản (Long, String, BigDecimal, LocalDateTime, Integer, Boolean).
 */
public class VoucherDTO {
    private Long id;
    private String code;
    private String name;
    private BigDecimal discountAmount;
    private BigDecimal minOrderAmount;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Integer quantity;
    private Boolean status;
    private LocalDateTime createdAt;

    public VoucherDTO() {
    }

    public VoucherDTO(Long id, String code, String name, BigDecimal discountAmount, BigDecimal minOrderAmount, LocalDateTime startDate, LocalDateTime endDate, Integer quantity, Boolean status, LocalDateTime createdAt) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.discountAmount = discountAmount;
        this.minOrderAmount = minOrderAmount;
        this.startDate = startDate;
        this.endDate = endDate;
        this.quantity = quantity;
        this.status = status;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BigDecimal getDiscountAmount() {
        return discountAmount;
    }

    public void setDiscountAmount(BigDecimal discountAmount) {
        this.discountAmount = discountAmount;
    }

    public BigDecimal getMinOrderAmount() {
        return minOrderAmount;
    }

    public void setMinOrderAmount(BigDecimal minOrderAmount) {
        this.minOrderAmount = minOrderAmount;
    }

    public LocalDateTime getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDateTime startDate) {
        this.startDate = startDate;
    }

    public LocalDateTime getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDateTime endDate) {
        this.endDate = endDate;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Boolean getStatus() {
        return status;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
