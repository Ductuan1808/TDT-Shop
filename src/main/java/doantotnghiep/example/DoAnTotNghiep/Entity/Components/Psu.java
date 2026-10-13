package doantotnghiep.example.DoAnTotNghiep.Entity.Components;

import doantotnghiep.example.DoAnTotNghiep.Entity.Products;
import jakarta.persistence.*;

@Entity
@Table(name = "psu_specs")
public class Psu {
    @Id
    @Column(name = "product_id")
    private Long productId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "product_id")
    private Products product;

    @Column(name = "wattage")
    private Integer wattage;
    @Column(name = "efficiency_rating")
    private String efficiencyRating;
    @Column(name = "modular_type")
    private String modularType;
    @Column(name = "form_factor")
    private String formFactor;

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

    public Integer getWattage() {
        return wattage;
    }

    public void setWattage(Integer wattage) {
        this.wattage = wattage;
    }

    public String getEfficiencyRating() {
        return efficiencyRating;
    }

    public void setEfficiencyRating(String efficiencyRating) {
        this.efficiencyRating = efficiencyRating;
    }

    public String getModularType() {
        return modularType;
    }

    public void setModularType(String modularType) {
        this.modularType = modularType;
    }

    public String getFormFactor() {
        return formFactor;
    }

    public void setFormFactor(String formFactor) {
        this.formFactor = formFactor;
    }
}





//product_id BIGINT PRIMARY KEY,
//wattage INT NOT NULL,
//efficiency_rating VARCHAR(30),
//modular_type VARCHAR(30),
//form_factor VARCHAR(30),
//
//CONSTRAINT FK_psu_specs_product
//FOREIGN KEY (product_id)
//REFERENCES products(id)
//ON DELETE CASCADE