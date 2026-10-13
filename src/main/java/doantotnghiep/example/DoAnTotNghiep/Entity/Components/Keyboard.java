package doantotnghiep.example.DoAnTotNghiep.Entity.Components;


import doantotnghiep.example.DoAnTotNghiep.Entity.Products;
import jakarta.persistence.*;

@Entity
@Table(name = "keyboard_specs")
public class Keyboard {
    @Id
    @Column(name = "product_id")
    private Long productId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "product_id")
    private Products product;

    @Column(name = "keyboard_type")
    private String keyboardType;
    @Column(name = "switch_type")
    private String switchType;
    @Column(name = "layout")
    private String layout;
    @Column(name = "connection")
    private String connection;
    @Column(name = "keycap_material")
    private String keycapMaterial;
    @Column(name = "backlight")
    private String backlight;
    @Column(name = "rgb")
    private Boolean rgb;
    @Column(name = "polling_rate_hz")
    private Integer pollingRateHz;
    @Column(name = "battery_mah")
    private Integer batteryMah;
    @Column(name = "dimensions")
    private String dimensions;

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

    public String getKeyboardType() {
        return keyboardType;
    }

    public void setKeyboardType(String keyboardType) {
        this.keyboardType = keyboardType;
    }

    public String getSwitchType() {
        return switchType;
    }

    public void setSwitchType(String switchType) {
        this.switchType = switchType;
    }

    public String getLayout() {
        return layout;
    }

    public void setLayout(String layout) {
        this.layout = layout;
    }

    public String getConnection() {
        return connection;
    }

    public void setConnection(String connection) {
        this.connection = connection;
    }

    public String getKeycapMaterial() {
        return keycapMaterial;
    }

    public void setKeycapMaterial(String keycapMaterial) {
        this.keycapMaterial = keycapMaterial;
    }

    public String getBacklight() {
        return backlight;
    }

    public void setBacklight(String backlight) {
        this.backlight = backlight;
    }

    public Boolean getRgb() {
        return rgb;
    }

    public void setRgb(Boolean rgb) {
        this.rgb = rgb;
    }

    public Integer getPollingRateHz() {
        return pollingRateHz;
    }

    public void setPollingRateHz(Integer pollingRateHz) {
        this.pollingRateHz = pollingRateHz;
    }

    public Integer getBatteryMah() {
        return batteryMah;
    }

    public void setBatteryMah(Integer batteryMah) {
        this.batteryMah = batteryMah;
    }

    public String getDimensions() {
        return dimensions;
    }

    public void setDimensions(String dimensions) {
        this.dimensions = dimensions;
    }
}



//product_id BIGINT PRIMARY KEY,
//keyboard_type VARCHAR(30),
//switch_type VARCHAR(50),
//layout VARCHAR(30),
//connection VARCHAR(100),
//keycap_material VARCHAR(50),
//backlight VARCHAR(50),
//rgb BIT,
//polling_rate_hz INT,
//battery_mah INT,
//dimensions VARCHAR(100),