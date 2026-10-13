package doantotnghiep.example.DoAnTotNghiep.DTO.ComponentDTO;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class HddDTO {
    private Long id;

    @NotNull(message = "Dung lượng HDD không được để trống")
    @Min(value = 1, message = "Dung lượng HDD phải lớn hơn 0 GB")
    private Integer capacityGb;

    @NotNull(message = "Tốc độ vòng quay không được để trống")
    @Min(value = 1, message = "Tốc độ vòng quay phải lớn hơn 0 RPM")
    private Integer rpm;

    @Min(value = 0, message = "Bộ nhớ đệm không được âm")
    private Integer cacheMb;

    @NotBlank(message = "Chuẩn giao tiếp HDD không được để trống")
    @Size(max = 50, message = "Chuẩn giao tiếp HDD không được vượt quá 50 ký tự")
    private String interfaceType;

    public HddDTO() {
    }

    public HddDTO(Long id, Integer capacityGb, Integer rpm, Integer cacheMb, String interfaceType) {
        this.id = id;
        this.capacityGb = capacityGb;
        this.rpm = rpm;
        this.cacheMb = cacheMb;
        this.interfaceType = interfaceType;
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

    public Integer getRpm() {
        return rpm;
    }

    public void setRpm(Integer rpm) {
        this.rpm = rpm;
    }

    public Integer getCacheMb() {
        return cacheMb;
    }

    public void setCacheMb(Integer cacheMb) {
        this.cacheMb = cacheMb;
    }

    public String getInterfaceType() {
        return interfaceType;
    }

    public void setInterfaceType(String interfaceType) {
        this.interfaceType = interfaceType;
    }
}
