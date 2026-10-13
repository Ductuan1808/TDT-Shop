package doantotnghiep.example.DoAnTotNghiep.Entity.Components;

import doantotnghiep.example.DoAnTotNghiep.Entity.Products;
import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "gpu_specs")
public class Gpu {
    @Id
    @Column(name = "product_id")
    private Long productId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "product_id")
    private Products product;

    @Column(name = "chipset")
    private String chipSet;

    @Column(name = "vram_gb")
    private Integer vramGb;
    @Column(name = "memory_type")
    private String  memoryType;
    @Column(name = "length_mm")
    private Integer lengthMm;
    @Column(name = "width_slots",precision =4, scale = 2)
    private BigDecimal widthSlots;
    @Column(name = "recommended_psu_watt")
    private Integer recommendedPsuWatt;
    @Column(name = "power_connector")
    private String powerConnector;


    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getChipSet() {
        return chipSet;
    }

    public void setChipSet(String chipSet) {
        this.chipSet = chipSet;
    }

    public String getChipset() {
        return chipSet;
    }

    public void setChipset(String chipset) {
        this.chipSet = chipset;
    }

    public Integer getVramGb() {
        return vramGb;
    }

    public void setVramGb(Integer vramGb) {
        this.vramGb = vramGb;
    }

    public String getMemoryType() {
        return memoryType;
    }

    public void setMemoryType(String memoryType) {
        this.memoryType = memoryType;
    }

    public Integer getLengthMm() {
        return lengthMm;
    }

    public void setLengthMm(Integer lengthMm) {
        this.lengthMm = lengthMm;
    }

    public Products getProduct() {
        return product;
    }

    public void setProduct(Products product) {
        this.product = product;
    }

    public BigDecimal getWidthSlots() {
        return widthSlots;
    }

    public void setWidthSlots(BigDecimal widthSlots) {
        this.widthSlots = widthSlots;
    }

    public Integer getRecommendedPsuWatt() {
        return recommendedPsuWatt;
    }

    public void setRecommendedPsuWatt(Integer recommendedPsuWatt) {
        this.recommendedPsuWatt = recommendedPsuWatt;
    }

    public String getPowerConnector() {
        return powerConnector;
    }

    public void setPowerConnector(String powerConnector) {
        this.powerConnector = powerConnector;
    }
}
//
//product_id BIGINT PRIMARY KEY,
//chipset VARCHAR(100),
//vram_gb INT,
//memory_type VARCHAR(20),
//length_mm INT,
//width_slots DECIMAL(4,2),
//recommended_psu_watt INT,
//power_connector VARCHAR(100),
//
//CONSTRAINT FK_gpu_specs_product
//FOREIGN KEY (product_id)
//REFERENCES products(id)
//ON DELETE CASCADE
//);
