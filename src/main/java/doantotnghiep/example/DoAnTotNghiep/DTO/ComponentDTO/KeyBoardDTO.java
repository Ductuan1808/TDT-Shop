package doantotnghiep.example.DoAnTotNghiep.DTO.ComponentDTO;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class KeyBoardDTO {
    private Long id;

    @NotBlank(message = "Loại bàn phím không được để trống")
    @Size(max = 30, message = "Loại bàn phím không được vượt quá 30 ký tự")
    @Pattern(regexp = "^[^0-9]*$", message = "Loại bàn phím không được chứa chữ số")
    private String keyboardType;

    @Size(max = 50, message = "Loại switch không được vượt quá 50 ký tự")
    private String switchType;

    @NotBlank(message = "Layout bàn phím không được để trống")
    @Size(max = 30, message = "Layout bàn phím không được vượt quá 30 ký tự")
    private String layout;

    @NotBlank(message = "Kiểu kết nối không được để trống")
    @Size(max = 100, message = "Kiểu kết nối không được vượt quá 100 ký tự")
    private String connection;

    @Size(max = 50, message = "Chất liệu keycap không được vượt quá 50 ký tự")
    @Pattern(regexp = "^[^0-9]*$", message = "Chất liệu keycap không được chứa chữ số")
    private String keycapMaterial;

    @Size(max = 50, message = "Đèn nền không được vượt quá 50 ký tự")
    private String backlight;

    @NotNull(message = "Hỗ trợ LED RGB không được để trống")
    private Boolean rgb;

    @Min(value = 1, message = "Tần số gửi tín hiệu phải lớn hơn 0 Hz")
    private Integer pollingRateHz;

    @Min(value = 1, message = "Dung lượng pin phải lớn hơn 0 mAh")
    private Integer batteryMah;

    @Size(max = 100, message = "Kích thước bàn phím không được vượt quá 100 ký tự")
    private String dimensions;

    public KeyBoardDTO() {
    }

    public KeyBoardDTO(Long id, String keyboardType, String switchType, String layout, String connection, String keycapMaterial, String backlight, Boolean rgb, Integer pollingRateHz, Integer batteryMah, String dimensions) {
        this.id = id;
        this.keyboardType = keyboardType;
        this.switchType = switchType;
        this.layout = layout;
        this.connection = connection;
        this.keycapMaterial = keycapMaterial;
        this.backlight = backlight;
        this.rgb = rgb;
        this.pollingRateHz = pollingRateHz;
        this.batteryMah = batteryMah;
        this.dimensions = dimensions;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getProductId() {
        return id;
    }

    public void setProductId(Long productId) {
        this.id = productId;
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
