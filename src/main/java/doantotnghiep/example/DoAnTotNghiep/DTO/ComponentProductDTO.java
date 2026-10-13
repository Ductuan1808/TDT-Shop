package doantotnghiep.example.DoAnTotNghiep.DTO;

/**
 * ComponentProductDTO - DTO truyền tải thông tin sản phẩm linh kiện hoặc máy PC
 * để lựa chọn trong dropdown.
 * 
 * QUY TẮC THIẾT KẾ:
 * - Cung cấp thông tin rút gọn gồm ID, tên, SKU, loại linh kiện, giá bán và số
 * lượng tồn kho.
 * - Phục vụ các dropdown chọn linh kiện CPU, GPU, RAM, Mainboard... trên giao
 * diện Admin.
 */
public class ComponentProductDTO {
    private Long id;
    private String name;
    private String sku;
    private String productType;
    private String componentType;
    private Double price;
    private Double salePrice;
    private String status;
    private Integer stock;

    public ComponentProductDTO() {
    }

    public ComponentProductDTO(Long id, String name, String sku, String productType, String componentType, Double price,
            Double salePrice, String status, Integer stock) {
        this.id = id;
        this.name = name;
        this.sku = sku;
        this.productType = productType;
        this.componentType = componentType;
        this.price = price;
        this.salePrice = salePrice;
        this.status = status;
        this.stock = stock;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getProductType() {
        return productType;
    }

    public void setProductType(String productType) {
        this.productType = productType;
    }

    public String getComponentType() {
        return componentType;
    }

    public void setComponentType(String componentType) {
        this.componentType = componentType;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Double getSalePrice() {
        return salePrice;
    }

    public void setSalePrice(Double salePrice) {
        this.salePrice = salePrice;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }
}
