package doantotnghiep.example.DoAnTotNghiep.DTO;

public class ProductCategoryDTO {
    private Long productId;
    private Long categoryId;
    private String productName;
    private String categoryName;

    public ProductCategoryDTO() {
    }

    public ProductCategoryDTO(Long productId, Long categoryId) {
        this.productId = productId;
        this.categoryId = categoryId;
    }

    public ProductCategoryDTO(Long productId, Long categoryId, String productName, String categoryName) {
        this.productId = productId;
        this.categoryId = categoryId;
        this.productName = productName;
        this.categoryName = categoryName;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public Long getProduct_id() {
        return productId;
    }

    public void setProduct_id(Long productId) {
        this.productId = productId;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public Long getCategory_id() {
        return categoryId;
    }

    public void setCategory_id(Long categoryId) {
        this.categoryId = categoryId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }
}
