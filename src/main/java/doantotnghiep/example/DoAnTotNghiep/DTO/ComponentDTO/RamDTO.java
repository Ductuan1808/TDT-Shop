package doantotnghiep.example.DoAnTotNghiep.DTO.ComponentDTO;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public class RamDTO {
    private Long id;

    @NotNull(message = "Dung lượng RAM không được để trống")
    @Min(value = 1, message = "Dung lượng RAM phải lớn hơn 0 GB")
    private Integer capacityGb;

    @NotBlank(message = "Chuẩn RAM không được để trống")
    @Size(max = 20, message = "Chuẩn RAM không được vượt quá 20 ký tự")
    private String memoryType;

    @NotNull(message = "Tốc độ bus RAM không được để trống")
    @Min(value = 1, message = "Bus RAM phải lớn hơn 0 MHz")
    private Integer speedMhz;

    @NotNull(message = "Số thanh RAM không được để trống")
    @Min(value = 1, message = "Số thanh RAM phải từ 1 trở lên")
    private Integer moduleCount;

    @DecimalMin(value = "0.1", message = "Điện áp RAM phải lớn hơn 0 V")
    private BigDecimal voltage;

    public RamDTO() {
    }

    public RamDTO(Long id, Integer capacityGb, String memoryType, Integer speedMhz, Integer moduleCount, BigDecimal voltage) {
        this.id = id;
        this.capacityGb = capacityGb;
        this.memoryType = memoryType;
        this.speedMhz = speedMhz;
        this.moduleCount = moduleCount;
        this.voltage = voltage;
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

    public Integer getCapacityGb() {
        return capacityGb;
    }

    public void setCapacityGb(Integer capacityGb) {
        this.capacityGb = capacityGb;
    }

    public String getMemoryType() {
        return memoryType;
    }

    public void setMemoryType(String memoryType) {
        this.memoryType = memoryType;
    }

    public Integer getSpeedMhz() {
        return speedMhz;
    }

    public void setSpeedMhz(Integer speedMhz) {
        this.speedMhz = speedMhz;
    }

    public Integer getModuleCount() {
        return moduleCount;
    }

    public void setModuleCount(Integer moduleCount) {
        this.moduleCount = moduleCount;
    }

    public BigDecimal getVoltage() {
        return voltage;
    }

    public void setVoltage(BigDecimal voltage) {
        this.voltage = voltage;
    }
}
