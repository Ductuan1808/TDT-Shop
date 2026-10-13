package doantotnghiep.example.DoAnTotNghiep.Entity.Components;

import doantotnghiep.example.DoAnTotNghiep.Entity.Products;
import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "monitor_specs")
public class Monitor {
    @Id
    @Column(name = "product_id")
    private Long productId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "product_id")
    private Products product;

    @Column(name = "screen_size_inch",precision =4, scale = 2)
    private BigDecimal screenSizeInch;
    @Column(name = "resolution")
    private String resolution;
    @Column(name = "refresh_rate_hz")
    private Integer refreshRateHz;
    @Column(name = "panel_type")
    private String panelType;
    @Column(name = "response_time_ms",precision =5, scale = 2)
    private BigDecimal responseTimeMs;
    @Column(name = "brightness_nits")
    private Integer brightnessNits;
    @Column(name = "aspect_ratio")
    private String aspectRatio;
    @Column(name = "adaptive_sync")
    private String adaptiveSync;
    @Column(name = "ports")
    private String ports;

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

    public BigDecimal getScreenSizeInch() {
        return screenSizeInch;
    }

    public void setScreenSizeInch(BigDecimal screenSizeInch) {
        this.screenSizeInch = screenSizeInch;
    }

    public String getResolution() {
        return resolution;
    }

    public void setResolution(String resolution) {
        this.resolution = resolution;
    }

    public Integer getRefreshRateHz() {
        return refreshRateHz;
    }

    public void setRefreshRateHz(Integer refreshRateHz) {
        this.refreshRateHz = refreshRateHz;
    }

    public String getPanelType() {
        return panelType;
    }

    public void setPanelType(String panelType) {
        this.panelType = panelType;
    }

    public BigDecimal getResponseTimeMs() {
        return responseTimeMs;
    }

    public void setResponseTimeMs(BigDecimal responseTimeMs) {
        this.responseTimeMs = responseTimeMs;
    }

    public Integer getBrightnessNits() {
        return brightnessNits;
    }

    public void setBrightnessNits(Integer brightnessNits) {
        this.brightnessNits = brightnessNits;
    }

    public String getAspectRatio() {
        return aspectRatio;
    }

    public void setAspectRatio(String aspectRatio) {
        this.aspectRatio = aspectRatio;
    }

    public String getAdaptiveSync() {
        return adaptiveSync;
    }

    public void setAdaptiveSync(String adaptiveSync) {
        this.adaptiveSync = adaptiveSync;
    }

    public String getPorts() {
        return ports;
    }

    public void setPorts(String ports) {
        this.ports = ports;
    }
}


//
//product_id BIGINT PRIMARY KEY,
//screen_size_inch DECIMAL(4,2) NOT NULL,
//resolution VARCHAR(50) NOT NULL,
//refresh_rate_hz INT NOT NULL,
//panel_type VARCHAR(30),
//response_time_ms DECIMAL(5,2),
//brightness_nits INT,
//aspect_ratio VARCHAR(20),
//adaptive_sync VARCHAR(50),
//ports VARCHAR(255),