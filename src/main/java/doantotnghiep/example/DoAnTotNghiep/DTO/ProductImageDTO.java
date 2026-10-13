package doantotnghiep.example.DoAnTotNghiep.DTO;

public class ProductImageDTO {
    private Long id;
    private Long productId;
    private String imageUrl;
    private Boolean isThumbnail;
    private Integer sortOrder;

    public ProductImageDTO() {
    }

    public ProductImageDTO(Long id, Long productId, String imageUrl, Boolean isThumbnail, Integer sortOrder) {
        this.id = id;
        this.productId = productId;
        this.imageUrl = imageUrl;
        this.isThumbnail = isThumbnail;
        this.sortOrder = sortOrder;
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

    public Long getProduct_id() {
        return productId;
    }

    public void setProduct_id(Long productId) {
        this.productId = productId;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getImage_url() {
        return imageUrl;
    }

    public void setImage_url(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Boolean getIsThumbnail() {
        return isThumbnail;
    }

    public void setIsThumbnail(Boolean isThumbnail) {
        this.isThumbnail = isThumbnail;
    }

    public Boolean getThumbnail() {
        return isThumbnail;
    }

    public void setThumbnail(Boolean thumbnail) {
        this.isThumbnail = thumbnail;
    }

    public Integer getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(Integer sortOrder) {
        this.sortOrder = sortOrder;
    }

    public Integer getSort_order() {
        return sortOrder;
    }

    public void setSort_order(Integer sortOrder) {
        this.sortOrder = sortOrder;
    }
}
