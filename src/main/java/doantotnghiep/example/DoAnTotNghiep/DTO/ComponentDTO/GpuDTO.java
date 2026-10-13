package doantotnghiep.example.DoAnTotNghiep.DTO.ComponentDTO;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public class GpuDTO {
    private Long id;

    @NotBlank(message = "Chipset GPU không được để trống")
    @Size(max = 100, message = "Chipset GPU không được vượt quá 100 ký tự")
    private String chipSet;

    @NotNull(message = "Dung lượng VRAM không được để trống")
    @Min(value = 1, message = "Dung lượng VRAM phải lớn hơn 0 GB")
    private Integer vramGb;

    @NotBlank(message = "Chuẩn bộ nhớ VRAM không được để trống")
    @Size(max = 20, message = "Chuẩn bộ nhớ không được vượt quá 20 ký tự")
    private String memoryType;

    @NotNull(message = "Chiều dài card không được để trống")
    @Min(value = 1, message = "Chiều dài card phải lớn hơn 0 mm")
    private Integer lengthMm;

    @DecimalMin(value = "0.1", message = "Số khe cắm chiếm dụng phải lớn hơn 0")
    private BigDecimal widthSlots;

    @Min(value = 1, message = "Công suất nguồn khuyến nghị phải lớn hơn 0 W")
    private Integer recommendedPsuWatt;

    @Size(max = 100, message = "Cổng nguồn phụ không được vượt quá 100 ký tự")
    private String powerConnector;

    public GpuDTO() {
    }

    public GpuDTO(Long id, String chipSet, Integer vramGb, String memoryType, Integer lengthMm, BigDecimal widthSlots, Integer recommendedPsuWatt, String powerConnector) {
        this.id = id;
        this.chipSet = chipSet;
        this.vramGb = vramGb;
        this.memoryType = memoryType;
        this.lengthMm = lengthMm;
        this.widthSlots = widthSlots;
        this.recommendedPsuWatt = recommendedPsuWatt;
        this.powerConnector = powerConnector;
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

    public String getChipSet() {
        return chipSet;
    }

    public void setChipSet(String chipSet) {
        this.chipSet = chipSet;
    }

    public Integer getVramGb() {
        return vramGb;
    }

    public void setVramGb(Integer vramGb) {
        this.vramGb = vramGb;
    }

    public String getMemoryType() {
        return memoryType;
    }

    public void setMemoryType(String memoryType) {
        this.memoryType = memoryType;
    }

    public Integer getLengthMm() {
        return lengthMm;
    }

    public void setLengthMm(Integer lengthMm) {
        this.lengthMm = lengthMm;
    }

    public BigDecimal getWidthSlots() {
        return widthSlots;
    }

    public void setWidthSlots(BigDecimal widthSlots) {
        this.widthSlots = widthSlots;
    }

    public Integer getRecommendedPsuWatt() {
        return recommendedPsuWatt;
    }

    public void setRecommendedPsuWatt(Integer recommendedPsuWatt) {
        this.recommendedPsuWatt = recommendedPsuWatt;
    }

    public String getPowerConnector() {
        return powerConnector;
    }

    public void setPowerConnector(String powerConnector) {
        this.powerConnector = powerConnector;
    }
}
