package doantotnghiep.example.DoAnTotNghiep.Entity.Components;


import doantotnghiep.example.DoAnTotNghiep.Entity.Products;
import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "headset_specs")
public class Headset {
    @Id
    @Column(name = "product_id")
    private Long productId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "product_id")
    private Products product;

    @Column(name = "headset_type")
    private String headsetType;
    @Column(name = "driver_size_mm",precision =5, scale = 2)
    private BigDecimal driverSizeMm;
    @Column(name = "connection")
    private String connection;
    @Column(name = "impedance_ohm", precision = 6, scale = 2)
    private BigDecimal impedanceOhm;
    @Column(name = "frequency_response")
    private String frequencyResponse;
    @Column(name = "microphone")
    private Boolean microphone;
    @Column(name = "noise_cancellation")
    private String noiseCancellation;
    @Column(name = "surround_sound")
    private String surroundSound;
    @Column(name = "battery_mah")
    private Integer batteryMah;

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

    public String getHeadsetType() {
        return headsetType;
    }

    public void setHeadsetType(String headsetType) {
        this.headsetType = headsetType;
    }

    public BigDecimal getDriverSizeMm() {
        return driverSizeMm;
    }

    public void setDriverSizeMm(BigDecimal driverSizeMm) {
        this.driverSizeMm = driverSizeMm;
    }

    public String getConnection() {
        return connection;
    }

    public void setConnection(String connection) {
        this.connection = connection;
    }

    public BigDecimal getImpedanceOhm() {
        return impedanceOhm;
    }

    public void setImpedanceOhm(BigDecimal impedanceOhm) {
        this.impedanceOhm = impedanceOhm;
    }

    public String getFrequencyResponse() {
        return frequencyResponse;
    }

    public void setFrequencyResponse(String frequencyResponse) {
        this.frequencyResponse = frequencyResponse;
    }

    public Boolean getMicrophone() {
        return microphone;
    }

    public void setMicrophone(Boolean microphone) {
        this.microphone = microphone;
    }

    public String getNoiseCancellation() {
        return noiseCancellation;
    }

    public void setNoiseCancellation(String noiseCancellation) {
        this.noiseCancellation = noiseCancellation;
    }

    public String getSurroundSound() {
        return surroundSound;
    }

    public void setSurroundSound(String surroundSound) {
        this.surroundSound = surroundSound;
    }

    public Integer getBatteryMah() {
        return batteryMah;
    }

    public void setBatteryMah(Integer batteryMah) {
        this.batteryMah = batteryMah;
    }
}



//product_id BIGINT PRIMARY KEY,
//headset_type VARCHAR(50),
//driver_size_mm DECIMAL(5,2),
//connection VARCHAR(100),
//impedance_ohm DECIMAL(6,2),
//frequency_response VARCHAR(50),
//microphone BIT,
//noise_cancellation VARCHAR(50),
//surround_sound VARCHAR(50),
//battery_mah INT,