package doantotnghiep.example.DoAnTotNghiep.DTO.ComponentDTO;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class PsuDTO {
    private Long id;

    @NotNull(message = "Công suất nguồn không được để trống")
    @Min(value = 1, message = "Công suất nguồn phải lớn hơn 0 W")
    private Integer wattage;

    @NotBlank(message = "Chứng nhận hiệu suất không được để trống")
    @Size(max = 30, message = "Chứng nhận hiệu suất không được vượt quá 30 ký tự")
    private String efficiencyRating;

    @NotBlank(message = "Loại dây nguồn không được để trống")
    @Size(max = 30, message = "Loại dây nguồn không được vượt quá 30 ký tự")
    @Pattern(regexp = "^[^0-9]*$", message = "Loại dây nguồn không được chứa chữ số")
    private String modularType;

    @NotBlank(message = "Chuẩn kích thước nguồn không được để trống")
    @Size(max = 30, message = "Chuẩn kích thước nguồn không được vượt quá 30 ký tự")
    private String formFactor;

    public PsuDTO() {
    }

    public PsuDTO(Long id, Integer wattage, String efficiencyRating, String modularType, String formFactor) {
        this.id = id;
        this.wattage = wattage;
        this.efficiencyRating = efficiencyRating;
        this.modularType = modularType;
        this.formFactor = formFactor;
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

    public Integer getWattage() {
        return wattage;
    }

    public void setWattage(Integer wattage) {
        this.wattage = wattage;
    }

    public String getEfficiencyRating() {
        return efficiencyRating;
    }

    public void setEfficiencyRating(String efficiencyRating) {
        this.efficiencyRating = efficiencyRating;
    }

    public String getModularType() {
        return modularType;
    }

    public void setModularType(String modularType) {
        this.modularType = modularType;
    }

    public String getFormFactor() {
        return formFactor;
    }

    public void setFormFactor(String formFactor) {
        this.formFactor = formFactor;
    }
}
