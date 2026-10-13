package doantotnghiep.example.DoAnTotNghiep.Entity.Components;

import doantotnghiep.example.DoAnTotNghiep.Entity.Products;
import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "ram_specs")
public class Ram {
    @Id
    @Column(name = "product_id")
    private Long productId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "product_id")
    private Products product;

    @Column(name = "capacity_gb")
    private Integer capacityGb;
    @Column(name = "memory_type")
    private String memoryType;
    @Column(name = "speed_mhz")
    private Integer speedMhz;
    @Column(name = "module_count")
    private Integer moduleCount;
    @Column(name = "voltage",precision =5, scale = 2)
    private BigDecimal voltage;

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

    public String getMemoryType() {
        return memoryType;
    }

    public void setMemoryType(String memoryType) {
        this.memoryType = memoryType;
    }

    public Integer getSpeedMhz() {
        return speedMhz;
    }

    public void setSpeedMhz(Integer speedMhz) {
        this.speedMhz = speedMhz;
    }

    public Integer getModuleCount() {
        return moduleCount;
    }

    public void setModuleCount(Integer moduleCount) {
        this.moduleCount = moduleCount;
    }

    public BigDecimal getVoltage() {
        return voltage;
    }

    public void setVoltage(BigDecimal voltage) {
        this.voltage = voltage;
    }
}



//product_id BIGINT PRIMARY KEY,
//capacity_gb INT NOT NULL,
//memory_type VARCHAR(20) NOT NULL,
//speed_mhz INT,
//module_count INT DEFAULT 1,
//voltage DECIMAL(5,2),
//
//CONSTRAINT FK_ram_specs_product
//FOREIGN KEY (product_id)
//REFERENCES products(id)
//ON DELETE CASCADE
