package doantotnghiep.example.DoAnTotNghiep.Entity;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "configuration_options")
public class Configuration_options {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "configuration_group_id")
    private Configuration_groups configuration_group;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Products productId;
    @Column(name = "additional_price", precision = 18, scale = 2)
    private BigDecimal additionalPrice;
    @Column(name = "is_default")
    private Boolean isDefault;
    @Column(name = "sort_order")
    private Integer sortOrder;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Configuration_groups getConfiguration_group() {
        return configuration_group;
    }

    public void setConfiguration_group(Configuration_groups configuration_group) {
        this.configuration_group = configuration_group;
    }

    public Products getProductId() {
        return productId;
    }

    public void setProductId(Products productId) {
        this.productId = productId;
    }

    public BigDecimal getAdditionalPrice() {
        return additionalPrice;
    }

    public void setAdditionalPrice(BigDecimal additionalPrice) {
        this.additionalPrice = additionalPrice;
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


//id BIGINT PRIMARY KEY IDENTITY(1,1),
//configuration_group_id BIGINT NOT NULL,
//product_id BIGINT NOT NULL,
//additional_price DECIMAL(18,2) NOT NULL DEFAULT 0,
//is_default BIT NOT NULL DEFAULT 0,
//sort_order INT NOT NULL DEFAULT 0,
//
//CONSTRAINT FK_configuration_options_group
//FOREIGN KEY (configuration_group_id)
//REFERENCES configuration_groups(id)
//ON DELETE CASCADE,
//
//CONSTRAINT FK_configuration_options_product
//FOREIGN KEY (product_id)
//REFERENCES products(id),