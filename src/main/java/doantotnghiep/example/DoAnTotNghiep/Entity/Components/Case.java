package doantotnghiep.example.DoAnTotNghiep.Entity.Components;


import doantotnghiep.example.DoAnTotNghiep.Entity.Products;
import jakarta.persistence.*;

@Entity
@Table(name = "case_specs")
public class Case {
    @Id
    @Column(name = "product_id")
    private Long productId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "product_id")
    private Products product;

    @Column(name = "form_factor_support")
    private String formFactorSupport;
    @Column(name = "max_gpu_length_mm")
    private Integer maxGpuLengthMm;
    @Column(name = "max_cpu_cooler_height_mm")
    private Integer maxCpuCoolerHeightMm;
    @Column(name = "max_radiator_size_mm")
    private Integer maxRadiatorSizeMm;
    @Column(name = "drive_bays")
    private Integer driveBays;

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

    public String getFormFactorSupport() {
        return formFactorSupport;
    }

    public void setFormFactorSupport(String formFactorSupport) {
        this.formFactorSupport = formFactorSupport;
    }

    public Integer getMaxGpuLengthMm() {
        return maxGpuLengthMm;
    }

    public void setMaxGpuLengthMm(Integer maxGpuLengthMm) {
        this.maxGpuLengthMm = maxGpuLengthMm;
    }

    public Integer getMaxCpuCoolerHeightMm() {
        return maxCpuCoolerHeightMm;
    }

    public void setMaxCpuCoolerHeightMm(Integer maxCpuCoolerHeightMm) {
        this.maxCpuCoolerHeightMm = maxCpuCoolerHeightMm;
    }

    public Integer getMaxRadiatorSizeMm() {
        return maxRadiatorSizeMm;
    }

    public void setMaxRadiatorSizeMm(Integer maxRadiatorSizeMm) {
        this.maxRadiatorSizeMm = maxRadiatorSizeMm;
    }

    public Integer getDriveBays() {
        return driveBays;
    }

    public void setDriveBays(Integer driveBays) {
        this.driveBays = driveBays;
    }
}


//product_id BIGINT PRIMARY KEY,
//form_factor_support VARCHAR(255),
//max_gpu_length_mm INT,
//max_cpu_cooler_height_mm INT,
//max_radiator_size_mm INT,
//drive_bays INT,
//
//CONSTRAINT FK_case_specs_product
//FOREIGN KEY (product_id)
//REFERENCES products(id)
//ON DELETE CASCADE
