package doantotnghiep.example.DoAnTotNghiep.DTO.ComponentDTO;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class SsdDTO {
    private Long id;

    @NotNull(message = "Dung lượng SSD không được để trống")
    @Min(value = 1, message = "Dung lượng SSD phải lớn hơn 0 GB")
    private Integer capacityGb;

    @NotBlank(message = "Chuẩn giao tiếp SSD không được để trống")
    @Size(max = 50, message = "Giao tiếp SSD không được vượt quá 50 ký tự")
    private String interfaceType;

    @NotBlank(message = "Kích thước SSD không được để trống")
    @Size(max = 50, message = "Kích thước SSD không được vượt quá 50 ký tự")
    private String formFactor;

    @NotNull(message = "Tốc độ đọc SSD không được để trống")
    @Min(value = 0, message = "Tốc độ đọc không được âm")
    private Integer readSpeedMb;

    @NotNull(message = "Tốc độ ghi SSD không được để trống")
    @Min(value = 0, message = "Tốc độ ghi không được âm")
    private Integer writeSpeedMb;

    @Size(max = 50, message = "Loại chip nhớ NAND không được vượt quá 50 ký tự")
    @Pattern(regexp = "^[^0-9]*$", message = "Loại chip nhớ NAND không được chứa chữ số")
    private String nandType;

    public SsdDTO() {
    }

    public SsdDTO(Long id, Integer capacityGb, String interfaceType, String formFactor, Integer readSpeedMb, Integer writeSpeedMb, String nandType) {
        this.id = id;
        this.capacityGb = capacityGb;
        this.interfaceType = interfaceType;
        this.formFactor = formFactor;
        this.readSpeedMb = readSpeedMb;
        this.writeSpeedMb = writeSpeedMb;
        this.nandType = nandType;
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

    public String getInterfaceType() {
        return interfaceType;
    }

    public void setInterfaceType(String interfaceType) {
        this.interfaceType = interfaceType;
    }

    public String getFormFactor() {
        return formFactor;
    }

    public void setFormFactor(String formFactor) {
        this.formFactor = formFactor;
    }

    public Integer getReadSpeedMb() {
        return readSpeedMb;
    }

    public void setReadSpeedMb(Integer readSpeedMb) {
        this.readSpeedMb = readSpeedMb;
    }

    public Integer getWriteSpeedMb() {
        return writeSpeedMb;
    }

    public void setWriteSpeedMb(Integer writeSpeedMb) {
        this.writeSpeedMb = writeSpeedMb;
    }

    public String getNandType() {
        return nandType;
    }

    public void setNandType(String nandType) {
        this.nandType = nandType;
    }
}
