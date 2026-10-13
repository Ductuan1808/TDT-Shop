package doantotnghiep.example.DoAnTotNghiep.Entity.Components;

import doantotnghiep.example.DoAnTotNghiep.Entity.Products;
import jakarta.persistence.*;

@Entity
@Table(name = "ssd_specs")
public class Ssd {
    @Id
    @Column(name = "product_id")
    private Long productId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "product_id")
    private Products product;

    @Column(name = "capacity_gb")
    private Integer capacityGb;
    @Column(name = "interface")
    private String interfaceType;
    @Column (name = "form_factor")
    private String formFactor;
    @Column(name = "read_speed_mb")
    private Integer readSpeedMb;
    @Column(name = "write_speed_mb")
    private Integer writeSpeedMb;
    @Column(name = "nand_type")
    private String nandType;



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

    public String getInterfaceType() {
        return interfaceType;
    }

    public void setInterfaceType(String interfaceType) {
        this.interfaceType = interfaceType;
    }

    public String getFormFactor() {
        return formFactor;
    }

    public void setFormFactor(String formFactor) {
        this.formFactor = formFactor;
    }

    public Integer getReadSpeedMb() {
        return readSpeedMb;
    }

    public void setReadSpeedMb(Integer readSpeedMb) {
        this.readSpeedMb = readSpeedMb;
    }

    public Integer getWriteSpeedMb() {
        return writeSpeedMb;
    }

    public void setWriteSpeedMb(Integer writeSpeedMb) {
        this.writeSpeedMb = writeSpeedMb;
    }

    public String getNandType() {
        return nandType;
    }

    public void setNandType(String nandType) {
        this.nandType = nandType;
    }
}



//
//product_id BIGINT PRIMARY KEY,
//capacity_gb INT NOT NULL,
//interface VARCHAR(50),
//        form_factor VARCHAR(50),
//read_speed_mb INT,
//write_speed_mb INT,
//nand_type VARCHAR(50),
//
//CONSTRAINT FK_ssd_specs_product
//FOREIGN KEY (product_id)
//REFERENCES products(id)
//ON DELETE CASCADE