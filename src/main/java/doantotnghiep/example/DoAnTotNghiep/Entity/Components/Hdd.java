package doantotnghiep.example.DoAnTotNghiep.Entity.Components;

import doantotnghiep.example.DoAnTotNghiep.Entity.Products;
import jakarta.persistence.*;

@Entity
@Table(name = "hdd_specs")
public class Hdd {
    @Id
    @Column(name = "product_id")
    private Long productId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "product_id")
    private Products product;

    @Column(name = "capacity_gb")
    private Integer capacityGb;
    @Column(name = "rpm")
    private Integer rpm;
    @Column(name = "cache_mb")
    private Integer cacheMb;
    @Column(name = "interface")
    private String interfaceType;

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public Products getProduct() {
        return product;
    }

    public void setProduct(Products product) {
        this.product = product;
    }

    public Integer getCapacityGb() {
        return capacityGb;
    }

    public void setCapacityGb(Integer capacityGb) {
        this.capacityGb = capacityGb;
    }

    public Integer getRpm() {
        return rpm;
    }

    public void setRpm(Integer rpm) {
        this.rpm = rpm;
    }

    public Integer getCacheMb() {
        return cacheMb;
    }

    public void setCacheMb(Integer cacheMb) {
        this.cacheMb = cacheMb;
    }

    public String getInterfaceType() {
        return interfaceType;
    }

    public void setInterfaceType(String interfaceType) {
        this.interfaceType = interfaceType;
    }
}

//
//product_id BIGINT PRIMARY KEY,
//capacity_gb INT NOT NULL,
//rpm INT NULL,
//cache_mb INT NULL,
//interface VARCHAR(50) NULL,