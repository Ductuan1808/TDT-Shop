package doantotnghiep.example.DoAnTotNghiep.Entity.Components;


import doantotnghiep.example.DoAnTotNghiep.Entity.Products;
import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "mouse_specs")
public class Mouse {
    @Id
    @Column(name = "product_id")
    private Long productId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "product_id")
    private Products product;
    @Column(name = "sensor")
    private String sensor;
    @Column(name = "dpi_max")
    private Integer dpiMax;
    @Column(name = "polling_rate_hz")
    private Integer pollingRateHz;
    @Column(name = "buttons")
    private Integer buttons;
    @Column(name = "connection")
    private String connection;
    @Column(name = "weight_g")
    private BigDecimal weightG;
    @Column(name = "battery_mah")
    private Integer batteryMah;
    @Column(name = "rgb")
    private Boolean rgb;

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

    public String getSensor() {
        return sensor;
    }

    public void setSensor(String sensor) {
        this.sensor = sensor;
    }

    public Integer getDpiMax() {
        return dpiMax;
    }

    public void setDpiMax(Integer dpiMax) {
        this.dpiMax = dpiMax;
    }

    public Integer getPollingRateHz() {
        return pollingRateHz;
    }

    public void setPollingRateHz(Integer pollingRateHz) {
        this.pollingRateHz = pollingRateHz;
    }

    public Integer getButtons() {
        return buttons;
    }

    public void setButtons(Integer buttons) {
        this.buttons = buttons;
    }

    public String getConnection() {
        return connection;
    }

    public void setConnection(String connection) {
        this.connection = connection;
    }

    public BigDecimal getWeightG() {
        return weightG;
    }

    public void setWeightG(BigDecimal weightG) {
        this.weightG = weightG;
    }

    public Integer getBatteryMah() {
        return batteryMah;
    }

    public void setBatteryMah(Integer batteryMah) {
        this.batteryMah = batteryMah;
    }

    public Boolean getRgb() {
        return rgb;
    }

    public void setRgb(Boolean rgb) {
        this.rgb = rgb;
    }
}




//product_id BIGINT PRIMARY KEY,
//sensor VARCHAR(100),
//dpi_max INT,
//polling_rate_hz INT,
//buttons INT,
//connection VARCHAR(100),
//weight_g DECIMAL(6,2),
//battery_mah INT,
//rgb BIT,
