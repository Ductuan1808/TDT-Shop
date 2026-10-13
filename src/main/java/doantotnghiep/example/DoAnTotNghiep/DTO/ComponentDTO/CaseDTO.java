package doantotnghiep.example.DoAnTotNghiep.DTO.ComponentDTO;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class CaseDTO {
    private Long productId;

    @NotBlank(message = "Chuẩn Mainboard hỗ trợ không được để trống")
    @Size(max = 255, message = "Hỗ trợ kích thước mainboard không được vượt quá 255 ký tự")
    private String formFactorSupport;

    @NotNull(message = "Chiều dài GPU tối đa không được để trống")
    @Min(value = 1, message = "Chiều dài GPU tối đa phải lớn hơn 0 mm")
    private Integer maxGpuLengthMm;

    @Min(value = 1, message = "Chiều cao tản CPU tối đa phải lớn hơn 0 mm")
    private Integer maxCpuCoolerHeightMm;

    @Min(value = 0, message = "Kích thước tản nhiệt nước tối đa không được âm")
    private Integer maxRadiatorSizeMm;

    @NotNull(message = "Số khay ổ cứng không được để trống")
    @Min(value = 0, message = "Số khay ổ cứng không được âm")
    private Integer driveBays;

    public CaseDTO() {
    }

    public CaseDTO(Long productId, String formFactorSupport, Integer maxGpuLengthMm, Integer maxCpuCoolerHeightMm, Integer maxRadiatorSizeMm, Integer driveBays) {
        this.productId = productId;
        this.formFactorSupport = formFactorSupport;
        this.maxGpuLengthMm = maxGpuLengthMm;
        this.maxCpuCoolerHeightMm = maxCpuCoolerHeightMm;
        this.maxRadiatorSizeMm = maxRadiatorSizeMm;
        this.driveBays = driveBays;
    }

    public Long getId() {
        return productId;
    }

    public void setId(Long id) {
        this.productId = id;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getFormFactorSupport() {
        return formFactorSupport;
    }

    public void setFormFactorSupport(String formFactorSupport) {
        this.formFactorSupport = formFactorSupport;
    }

    public Integer getMaxGpuLengthMm() {
        return maxGpuLengthMm;
    }

    public void setMaxGpuLengthMm(Integer maxGpuLengthMm) {
        this.maxGpuLengthMm = maxGpuLengthMm;
    }

    public Integer getMaxCpuCoolerHeightMm() {
        return maxCpuCoolerHeightMm;
    }

    public void setMaxCpuCoolerHeightMm(Integer maxCpuCoolerHeightMm) {
        this.maxCpuCoolerHeightMm = maxCpuCoolerHeightMm;
    }

    public Integer getMaxRadiatorSizeMm() {
        return maxRadiatorSizeMm;
    }

    public void setMaxRadiatorSizeMm(Integer maxRadiatorSizeMm) {
        this.maxRadiatorSizeMm = maxRadiatorSizeMm;
    }

    public Integer getDriveBays() {
        return driveBays;
    }

    public void setDriveBays(Integer driveBays) {
        this.driveBays = driveBays;
    }
}
