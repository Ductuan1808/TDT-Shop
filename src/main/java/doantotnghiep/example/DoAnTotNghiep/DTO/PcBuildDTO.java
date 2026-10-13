package doantotnghiep.example.DoAnTotNghiep.DTO;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * PcBuildDTO - DTO truyền tải thông tin cấu hình dàn PC dựng sẵn phục vụ Admin Dashboard.
 * 
 * QUY TẮC THIẾT KẾ:
 * - Kết hợp dữ liệu từ bảng `pc_builds`, bảng `products` (sản phẩm đại diện) và `pc_build_components`.
 * - Không sử dụng Map/HashMap, chỉ dùng các kiểu dữ liệu cơ bản và List.
 */
public class PcBuildDTO {
    private Long id;
    private Long productId;
    private String name;
    private String sku;
    private Double price;
    private String status;
    private LocalDateTime createdAt;
    private Integer upgradeGroupCount;
    private List<PcBuildComponentDTO> components = new ArrayList<>();

    public PcBuildDTO() {
    }

    public PcBuildDTO(Long id, Long productId, String name, String sku, Double price, String status, LocalDateTime createdAt, Integer upgradeGroupCount, List<PcBuildComponentDTO> components) {
        this.id = id;
        this.productId = productId;
        this.name = name;
        this.sku = sku;
        this.price = price;
        this.status = status;
        this.createdAt = createdAt;
        this.upgradeGroupCount = upgradeGroupCount;
        this.components = components != null ? components : new ArrayList<>();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Integer getUpgradeGroupCount() {
        return upgradeGroupCount;
    }

    public void setUpgradeGroupCount(Integer upgradeGroupCount) {
        this.upgradeGroupCount = upgradeGroupCount;
    }

    public List<PcBuildComponentDTO> getComponents() {
        return components;
    }

    public void setComponents(List<PcBuildComponentDTO> components) {
        this.components = components;
    }
}
