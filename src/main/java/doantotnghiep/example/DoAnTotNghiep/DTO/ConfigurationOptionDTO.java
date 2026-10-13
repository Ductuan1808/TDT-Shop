package doantotnghiep.example.DoAnTotNghiep.DTO;

import java.math.BigDecimal;

public class ConfigurationOptionDTO {
    private Long id;
    private Long configurationGroupId;
    private String configurationGroupName;
    private Long productId;
    private String productName;
    private String productSku;
    private BigDecimal productPrice;
    private BigDecimal additionalPrice;
    private Boolean isDefault;
    private Integer sortOrder;

    public ConfigurationOptionDTO() {
    }

    public ConfigurationOptionDTO(Long id, Long configurationGroupId, Long productId,
                                  BigDecimal additionalPrice, Boolean isDefault, Integer sortOrder) {
        this.id = id;
        this.configurationGroupId = configurationGroupId;
        this.productId = productId;
        this.additionalPrice = additionalPrice;
        this.isDefault = isDefault;
        this.sortOrder = sortOrder;
    }

    public ConfigurationOptionDTO(Long id, Long configurationGroupId, String configurationGroupName,
                                  Long productId, String productName, String productSku,
                                  BigDecimal productPrice, BigDecimal additionalPrice,
                                  Boolean isDefault, Integer sortOrder) {
        this.id = id;
        this.configurationGroupId = configurationGroupId;
        this.configurationGroupName = configurationGroupName;
        this.productId = productId;
        this.productName = productName;
        this.productSku = productSku;
        this.productPrice = productPrice;
        this.additionalPrice = additionalPrice;
        this.isDefault = isDefault;
        this.sortOrder = sortOrder;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getConfigurationGroupId() {
        return configurationGroupId;
    }

    public void setConfigurationGroupId(Long configurationGroupId) {
        this.configurationGroupId = configurationGroupId;
    }

    public Long getConfiguration_group_id() {
        return configurationGroupId;
    }

    public void setConfiguration_group_id(Long configurationGroupId) {
        this.configurationGroupId = configurationGroupId;
    }

    public String getConfigurationGroupName() {
        return configurationGroupName;
    }

    public void setConfigurationGroupName(String configurationGroupName) {
        this.configurationGroupName = configurationGroupName;
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

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getProductSku() {
        return productSku;
    }

    public void setProductSku(String productSku) {
        this.productSku = productSku;
    }

    public BigDecimal getProductPrice() {
        return productPrice;
    }

    public void setProductPrice(BigDecimal productPrice) {
        this.productPrice = productPrice;
    }

    public BigDecimal getAdditionalPrice() {
        return additionalPrice;
    }

    public void setAdditionalPrice(BigDecimal additionalPrice) {
        this.additionalPrice = additionalPrice;
    }

    public Boolean getIsDefault() {
        return isDefault;
    }

    public void setIsDefault(Boolean isDefault) {
        this.isDefault = isDefault;
    }

    public Boolean getDefault() {
        return isDefault;
    }

    public void setDefault(Boolean aDefault) {
        isDefault = aDefault;
    }

    public Integer getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(Integer sortOrder) {
        this.sortOrder = sortOrder;
    }
}
