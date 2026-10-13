package doantotnghiep.example.DoAnTotNghiep.DTO;

/**
 * PcBuildComponentDTO - DTO truyền tải thông tin một linh kiện cốt lõi trong dàn PC dựng sẵn.
 * 
 * QUY TẮC THIẾT KẾ:
 * - Đại diện cho bản ghi trong bảng `pc_build_components`.
 * - Chứa thông tin linh kiện: loại linh kiện, ID sản phẩm, tên, giá và số lượng.
 */
public class PcBuildComponentDTO {
    private Long id;
    private String componentType;
    private Long componentProductId;
    private String componentProductName;
    private String componentSku;
    private Double componentPrice;
    private Integer quantity;

    public PcBuildComponentDTO() {
    }

    public PcBuildComponentDTO(Long id, String componentType, Long componentProductId, String componentProductName, String componentSku, Double componentPrice, Integer quantity) {
        this.id = id;
        this.componentType = componentType;
        this.componentProductId = componentProductId;
        this.componentProductName = componentProductName;
        this.componentSku = componentSku;
        this.componentPrice = componentPrice;
        this.quantity = quantity;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getComponentType() {
        return componentType;
    }

    public void setComponentType(String componentType) {
        this.componentType = componentType;
    }

    public Long getComponentProductId() {
        return componentProductId;
    }

    public void setComponentProductId(Long componentProductId) {
        this.componentProductId = componentProductId;
    }

    public String getComponentProductName() {
        return componentProductName;
    }

    public void setComponentProductName(String componentProductName) {
        this.componentProductName = componentProductName;
    }

    public String getComponentSku() {
        return componentSku;
    }

    public void setComponentSku(String componentSku) {
        this.componentSku = componentSku;
    }

    public Double getComponentPrice() {
        return componentPrice;
    }

    public void setComponentPrice(Double componentPrice) {
        this.componentPrice = componentPrice;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}
