package doantotnghiep.example.DoAnTotNghiep.DTO.ComponentDTO;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public class HeadsetDTO {
    private Long id;

    @NotBlank(message = "Loại tai nghe không được để trống")
    @Size(max = 50, message = "Loại tai nghe không được vượt quá 50 ký tự")
    @Pattern(regexp = "^[^0-9]*$", message = "Loại tai nghe không được chứa chữ số")
    private String headsetType;

    @DecimalMin(value = "0.1", message = "Đường kính củ loa phải lớn hơn 0 mm")
    private BigDecimal driverSizeMm;

    @NotBlank(message = "Kiểu kết nối không được để trống")
    @Size(max = 100, message = "Kiểu kết nối không được vượt quá 100 ký tự")
    private String connection;

    @DecimalMin(value = "0.1", message = "Trở kháng tai nghe phải lớn hơn 0 Ohm")
    private BigDecimal impedanceOhm;

    @Size(max = 50, message = "Dải tần số không được vượt quá 50 ký tự")
    private String frequencyResponse;

    @NotNull(message = "Tích hợp Microphone không được để trống")
    private Boolean microphone;

    @Size(max = 50, message = "Chống ồn không được vượt quá 50 ký tự")
    private String noiseCancellation;

    @Size(max = 50, message = "Âm thanh vòm không được vượt quá 50 ký tự")
    private String surroundSound;

    @Min(value = 1, message = "Dung lượng pin phải lớn hơn 0 mAh")
    private Integer batteryMah;

    public HeadsetDTO() {
    }

    public HeadsetDTO(Long id, String headsetType, BigDecimal driverSizeMm, String connection, BigDecimal impedanceOhm, String frequencyResponse, Boolean microphone, String noiseCancellation, String surroundSound, Integer batteryMah) {
        this.id = id;
        this.headsetType = headsetType;
        this.driverSizeMm = driverSizeMm;
        this.connection = connection;
        this.impedanceOhm = impedanceOhm;
        this.frequencyResponse = frequencyResponse;
        this.microphone = microphone;
        this.noiseCancellation = noiseCancellation;
        this.surroundSound = surroundSound;
        this.batteryMah = batteryMah;
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

    public String getHeadsetType() {
        return headsetType;
    }

    public void setHeadsetType(String headsetType) {
        this.headsetType = headsetType;
    }

    public BigDecimal getDriverSizeMm() {
        return driverSizeMm;
    }

    public void setDriverSizeMm(BigDecimal driverSizeMm) {
        this.driverSizeMm = driverSizeMm;
    }

    public String getConnection() {
        return connection;
    }

    public void setConnection(String connection) {
        this.connection = connection;
    }

    public BigDecimal getImpedanceOhm() {
        return impedanceOhm;
    }

    public void setImpedanceOhm(BigDecimal impedanceOhm) {
        this.impedanceOhm = impedanceOhm;
    }

    public String getFrequencyResponse() {
        return frequencyResponse;
    }

    public void setFrequencyResponse(String frequencyResponse) {
        this.frequencyResponse = frequencyResponse;
    }

    public Boolean getMicrophone() {
        return microphone;
    }

    public void setMicrophone(Boolean microphone) {
        this.microphone = microphone;
    }

    public String getNoiseCancellation() {
        return noiseCancellation;
    }

    public void setNoiseCancellation(String noiseCancellation) {
        this.noiseCancellation = noiseCancellation;
    }

    public String getSurroundSound() {
        return surroundSound;
    }

    public void setSurroundSound(String surroundSound) {
        this.surroundSound = surroundSound;
    }

    public Integer getBatteryMah() {
        return batteryMah;
    }

    public void setBatteryMah(Integer batteryMah) {
        this.batteryMah = batteryMah;
    }
}
