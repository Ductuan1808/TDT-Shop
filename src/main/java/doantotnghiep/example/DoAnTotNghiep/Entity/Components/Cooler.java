package doantotnghiep.example.DoAnTotNghiep.Entity.Components;


import doantotnghiep.example.DoAnTotNghiep.Entity.Products;
import jakarta.persistence.*;

@Entity
@Table(name = "cooler_specs")
public class Cooler {
    @Id
    @Column(name = "product_id")
    private Long productId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "product_id")
    private Products product;

    @Column(name = "cooler_type")
    private String coolerType;
    @Column(name = "supported_sockets")
    private String supportedSockets;
    @Column(name = "radiator_size_mm")
    private Integer radiatorSizeMm;
    @Column(name = "fan_size_mm")
    private Integer fanSizeMm;
    @Column(name = "height_mm")
    private Integer heightMm;
    @Column(name = "tdp_support")
    private Integer tdpSupport;


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

    public String getCoolerType() {
        return coolerType;
    }

    public void setCoolerType(String coolerType) {
        this.coolerType = coolerType;
    }

    public String getSupportedSockets() {
        return supportedSockets;
    }

    public void setSupportedSockets(String supportedSockets) {
        this.supportedSockets = supportedSockets;
    }

    public Integer getRadiatorSizeMm() {
        return radiatorSizeMm;
    }

    public void setRadiatorSizeMm(Integer radiatorSizeMm) {
        this.radiatorSizeMm = radiatorSizeMm;
    }

    public Integer getFanSizeMm() {
        return fanSizeMm;
    }

    public void setFanSizeMm(Integer fanSizeMm) {
        this.fanSizeMm = fanSizeMm;
    }

    public Integer getHeightMm() {
        return heightMm;
    }

    public void setHeightMm(Integer heightMm) {
        this.heightMm = heightMm;
    }

    public Integer getTdpSupport() {
        return tdpSupport;
    }

    public void setTdpSupport(Integer tdpSupport) {
        this.tdpSupport = tdpSupport;
    }
}


//product_id BIGINT PRIMARY KEY,
//cooler_type VARCHAR(30),
//supported_sockets VARCHAR(500),
//radiator_size_mm INT,
//fan_size_mm INT,
//height_mm INT,
//tdp_support INT,
//
//CONSTRAINT FK_cooler_specs_product
//FOREIGN KEY (product_id)
//REFERENCES products(id)
//ON DELETE CASCADE
