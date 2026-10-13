package doantotnghiep.example.DoAnTotNghiep.DTO.ComponentDTO;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public class SpeakerDTO {
    private Long id;

    @NotBlank(message = "Loại loa không được để trống")
    @Size(max = 50, message = "Loại loa không được vượt quá 50 ký tự")
    @Pattern(regexp = "^[^0-9]*$", message = "Loại loa không được chứa chữ số")
    private String speakerType;

    @NotBlank(message = "Kênh âm thanh không được để trống")
    @Size(max = 20, message = "Số kênh không được vượt quá 20 ký tự")
    private String channels;

    @NotNull(message = "Công suất loa không được để trống")
    @DecimalMin(value = "0.1", message = "Công suất loa phải lớn hơn 0 W")
    private BigDecimal powerWatt;

    @Size(max = 50, message = "Dải tần số không được vượt quá 50 ký tự")
    private String frequencyResponse;

    @DecimalMin(value = "0.1", message = "Trở kháng loa phải lớn hơn 0 Ohm")
    private BigDecimal impedanceOhm;

    @NotBlank(message = "Cổng kết nối không được để trống")
    @Size(max = 100, message = "Kiểu kết nối không được vượt quá 100 ký tự")
    private String connection;

    @Size(max = 20, message = "Phiên bản Bluetooth không được vượt quá 20 ký tự")
    private String bluetoothVersion;

    @NotNull(message = "Đèn LED RGB không được để trống")
    private Boolean rgb;

    public SpeakerDTO() {
    }

    public SpeakerDTO(Long id, String speakerType, String channels, BigDecimal powerWatt, String frequencyResponse, BigDecimal impedanceOhm, String connection, String bluetoothVersion, Boolean rgb) {
        this.id = id;
        this.speakerType = speakerType;
        this.channels = channels;
        this.powerWatt = powerWatt;
        this.frequencyResponse = frequencyResponse;
        this.impedanceOhm = impedanceOhm;
        this.connection = connection;
        this.bluetoothVersion = bluetoothVersion;
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

    public String getSpeakerType() {
        return speakerType;
    }

    public void setSpeakerType(String speakerType) {
        this.speakerType = speakerType;
    }

    public String getChannels() {
        return channels;
    }

    public void setChannels(String channels) {
        this.channels = channels;
    }

    public BigDecimal getPowerWatt() {
        return powerWatt;
    }

    public void setPowerWatt(BigDecimal powerWatt) {
        this.powerWatt = powerWatt;
    }

    public String getFrequencyResponse() {
        return frequencyResponse;
    }

    public void setFrequencyResponse(String frequencyResponse) {
        this.frequencyResponse = frequencyResponse;
    }

    public BigDecimal getImpedanceOhm() {
        return impedanceOhm;
    }

    public void setImpedanceOhm(BigDecimal impedanceOhm) {
        this.impedanceOhm = impedanceOhm;
    }

    public String getConnection() {
        return connection;
    }

    public void setConnection(String connection) {
        this.connection = connection;
    }

    public String getBluetoothVersion() {
        return bluetoothVersion;
    }

    public void setBluetoothVersion(String bluetoothVersion) {
        this.bluetoothVersion = bluetoothVersion;
    }

    public Boolean getRgb() {
        return rgb;
    }

    public void setRgb(Boolean rgb) {
        this.rgb = rgb;
    }
}
