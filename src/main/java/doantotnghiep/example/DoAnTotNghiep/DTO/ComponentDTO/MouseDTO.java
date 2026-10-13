package doantotnghiep.example.DoAnTotNghiep.DTO.ComponentDTO;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public class MouseDTO {
    private Long id;

    @NotBlank(message = "Cảm biến chuột không được để trống")
    @Size(max = 100, message = "Cảm biến chuột không được vượt quá 100 ký tự")
    private String sensor;

    @NotNull(message = "DPI tối đa không được để trống")
    @Min(value = 1, message = "DPI tối đa phải lớn hơn 0")
    private Integer dpiMax;

    @Min(value = 1, message = "Tần số phản hồi chuột phải lớn hơn 0 Hz")
    private Integer pollingRateHz;

    @NotNull(message = "Số lượng nút bấm không được để trống")
    @Min(value = 1, message = "Số lượng nút bấm phải lớn hơn 0")
    private Integer buttons;

    @NotBlank(message = "Kiểu kết nối không được để trống")
    @Size(max = 100, message = "Kiểu kết nối không được vượt quá 100 ký tự")
    private String connection;

    @DecimalMin(value = "0.1", message = "Trọng lượng chuột phải lớn hơn 0 g")
    private BigDecimal weightG;

    @Min(value = 1, message = "Dung lượng pin phải lớn hơn 0 mAh")
    private Integer batteryMah;

    @NotNull(message = "Đèn LED RGB không được để trống")
    private Boolean rgb;

    public MouseDTO() {
    }

    public MouseDTO(Long id, String sensor, Integer dpiMax, Integer pollingRateHz, Integer buttons, String connection, BigDecimal weightG, Integer batteryMah, Boolean rgb) {
        this.id = id;
        this.sensor = sensor;
        this.dpiMax = dpiMax;
        this.pollingRateHz = pollingRateHz;
        this.buttons = buttons;
        this.connection = connection;
        this.weightG = weightG;
        this.batteryMah = batteryMah;
        this.rgb = rgb;
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
