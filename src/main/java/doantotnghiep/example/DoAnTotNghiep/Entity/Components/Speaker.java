package doantotnghiep.example.DoAnTotNghiep.Entity.Components;

import doantotnghiep.example.DoAnTotNghiep.Entity.Products;
import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "speaker_specs")
public class Speaker{
    @Id
    @Column(name = "product_id")
    private Long productId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "product_id")
    private Products product;

    @Column(name = "speaker_type")
    private String speakerType;
    @Column(name = "channels")
    private String channels;
    @Column(name = "power_watt",precision =6, scale = 2)
    private BigDecimal powerWatt;
    @Column(name = "frequency_response")
    private String frequencyResponse;
    @Column(name = "impedance_ohm",precision =6, scale = 2)
    private BigDecimal impedanceOhm;
    @Column(name = "connection")
    private String connection;
    @Column(name = "bluetooth_version")
    private String bluetoothVersion;
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

    public String getSpeakerType() {
        return speakerType;
    }

    public void setSpeakerType(String speakerType) {
        this.speakerType = speakerType;
    }

    public String getChannels() {
        return channels;
    }

    public void setChannels(String channels) {
        this.channels = channels;
    }

    public BigDecimal getPowerWatt() {
        return powerWatt;
    }

    public void setPowerWatt(BigDecimal powerWatt) {
        this.powerWatt = powerWatt;
    }

    public String getFrequencyResponse() {
        return frequencyResponse;
    }

    public void setFrequencyResponse(String frequencyResponse) {
        this.frequencyResponse = frequencyResponse;
    }

    public BigDecimal getImpedanceOhm() {
        return impedanceOhm;
    }

    public void setImpedanceOhm(BigDecimal impedanceOhm) {
        this.impedanceOhm = impedanceOhm;
    }

    public String getConnection() {
        return connection;
    }

    public void setConnection(String connection) {
        this.connection = connection;
    }

    public String getBluetoothVersion() {
        return bluetoothVersion;
    }

    public void setBluetoothVersion(String bluetoothVersion) {
        this.bluetoothVersion = bluetoothVersion;
    }

    public Boolean getRgb() {
        return rgb;
    }

    public void setRgb(Boolean rgb) {
        this.rgb = rgb;
    }
}





//product_id BIGINT PRIMARY KEY,
//speaker_type VARCHAR(50),
//channels VARCHAR(20),
//power_watt DECIMAL(6,2),
//frequency_response VARCHAR(50),
//impedance_ohm DECIMAL(6,2),
//connection VARCHAR(100),
//bluetooth_version VARCHAR(20),
//rgb BIT,