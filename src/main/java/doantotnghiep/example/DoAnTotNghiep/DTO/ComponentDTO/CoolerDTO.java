package doantotnghiep.example.DoAnTotNghiep.DTO.ComponentDTO;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class CoolerDTO {
    private Long id;

    @NotBlank(message = "Loại tản nhiệt không được để trống")
    @Size(max = 30, message = "Loại tản nhiệt không được vượt quá 30 ký tự")
    @Pattern(regexp = "^[^0-9]*$", message = "Loại tản nhiệt không được chứa chữ số")
    private String coolerType;

    @NotBlank(message = "Socket hỗ trợ không được để trống")
    @Size(max = 500, message = "Socket hỗ trợ không được vượt quá 500 ký tự")
    private String supportedSockets;

    @Min(value = 0, message = "Kích thước két tản nhiệt không được âm")
    private Integer radiatorSizeMm;

    @Min(value = 0, message = "Kích thước quạt tản không được âm")
    private Integer fanSizeMm;

    @Min(value = 0, message = "Chiều cao tản nhiệt không được âm")
    private Integer heightMm;

    @Min(value = 0, message = "TDP hỗ trợ không được âm")
    private Integer tdpSupport;

    public CoolerDTO() {
    }

    public CoolerDTO(Long id, String coolerType, String supportedSockets, Integer radiatorSizeMm, Integer fanSizeMm, Integer heightMm, Integer tdpSupport) {
        this.id = id;
        this.coolerType = coolerType;
        this.supportedSockets = supportedSockets;
        this.radiatorSizeMm = radiatorSizeMm;
        this.fanSizeMm = fanSizeMm;
        this.heightMm = heightMm;
        this.tdpSupport = tdpSupport;
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
