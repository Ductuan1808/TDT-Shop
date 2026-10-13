package doantotnghiep.example.DoAnTotNghiep.DTO.ComponentDTO;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public class MonitorDTO {
    private Long id;

    @NotNull(message = "Kích thước màn hình không được để trống")
    @DecimalMin(value = "1.0", message = "Kích thước màn hình phải lớn hơn 0 inch")
    private BigDecimal screenSizeInch;

    @NotBlank(message = "Độ phân giải màn hình không được để trống")
    @Size(max = 50, message = "Độ phân giải màn hình không được vượt quá 50 ký tự")
    private String resolution;

    @NotNull(message = "Tần số quét không được để trống")
    @Min(value = 1, message = "Tần số quét phải lớn hơn 0 Hz")
    private Integer refreshRateHz;

    @NotBlank(message = "Loại tấm nền không được để trống")
    @Size(max = 30, message = "Loại tấm nền không được vượt quá 30 ký tự")
    @Pattern(regexp = "^[^0-9]*$", message = "Loại tấm nền không được chứa chữ số")
    private String panelType;

    @DecimalMin(value = "0.01", message = "Thời gian phản hồi phải lớn hơn 0 ms")
    private BigDecimal responseTimeMs;

    @Min(value = 1, message = "Độ sáng màn hình phải lớn hơn 0 nits")
    private Integer brightnessNits;

    @NotBlank(message = "Tỉ lệ khung hình không được để trống")
    @Size(max = 20, message = "Tỉ lệ khung hình không được vượt quá 20 ký tự")
    private String aspectRatio;

    @Size(max = 50, message = "Công nghệ đồng bộ không được vượt quá 50 ký tự")
    private String adaptiveSync;

    @NotBlank(message = "Cổng kết nối không được để trống")
    @Size(max = 255, message = "Cổng kết nối không được vượt quá 255 ký tự")
    private String ports;

    public MonitorDTO() {
    }

    public MonitorDTO(Long id, BigDecimal screenSizeInch, String resolution, Integer refreshRateHz, String panelType, BigDecimal responseTimeMs, Integer brightnessNits, String aspectRatio, String adaptiveSync, String ports) {
        this.id = id;
        this.screenSizeInch = screenSizeInch;
        this.resolution = resolution;
        this.refreshRateHz = refreshRateHz;
        this.panelType = panelType;
        this.responseTimeMs = responseTimeMs;
        this.brightnessNits = brightnessNits;
        this.aspectRatio = aspectRatio;
        this.adaptiveSync = adaptiveSync;
        this.ports = ports;
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
