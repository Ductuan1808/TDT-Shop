package doantotnghiep.example.DoAnTotNghiep.DTO.ComponentDTO;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class MotherBoardDTO {
    private Long id;

    @NotBlank(message = "Socket bo mạch chủ không được để trống")
    @Size(max = 50, message = "Socket bo mạch chủ không được vượt quá 50 ký tự")
    private String socket;

    @NotBlank(message = "Chipset bo mạch chủ không được để trống")
    @Size(max = 100, message = "Chipset bo mạch chủ không được vượt quá 100 ký tự")
    private String chipset;

    @NotBlank(message = "Chuẩn bộ nhớ RAM không được để trống")
    @Size(max = 20, message = "Chuẩn bộ nhớ RAM không được vượt quá 20 ký tự")
    private String memoryType;

    @NotNull(message = "Dung lượng RAM tối đa không được để trống")
    @Min(value = 1, message = "Dung lượng RAM tối đa phải lớn hơn 0 GB")
    private Integer maxRamGb;

    @NotNull(message = "Số khe cắm RAM không được để trống")
    @Min(value = 1, message = "Số khe cắm RAM phải lớn hơn 0")
    private Integer ramSlots;

    @NotBlank(message = "Kích thước chuẩn bo mạch không được để trống")
    @Size(max = 30, message = "Kích thước chuẩn bo mạch không được vượt quá 30 ký tự")
    @Pattern(regexp = "^[^0-9]*$", message = "Kích thước chuẩn bo mạch không được chứa chữ số")
    private String formFactor;

    @NotNull(message = "Số khe cắm M.2 không được để trống")
    @Min(value = 0, message = "Số khe cắm M.2 không được âm")
    private Integer m2Slots;

    @NotNull(message = "Số cổng SATA không được để trống")
    @Min(value = 0, message = "Số cổng SATA không được âm")
    private Integer sataPorts;

    @NotNull(message = "Tích hợp Wi-Fi không được để trống")
    private Boolean wifi;

    @NotNull(message = "Tích hợp Bluetooth không được để trống")
    private Boolean bluetooth;

    public MotherBoardDTO() {
    }

    public MotherBoardDTO(Long id, String socket, String chipset, String memoryType, Integer maxRamGb,
                          Integer ramSlots, String formFactor, Integer m2Slots, Integer sataPorts,
                          Boolean wifi, Boolean bluetooth) {
        this.id = id;
        this.socket = socket;
        this.chipset = chipset;
        this.memoryType = memoryType;
        this.maxRamGb = maxRamGb;
        this.ramSlots = ramSlots;
        this.formFactor = formFactor;
        this.m2Slots = m2Slots;
        this.sataPorts = sataPorts;
        this.wifi = wifi;
        this.bluetooth = bluetooth;
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

    public String getSocket() {
        return socket;
    }

    public void setSocket(String socket) {
        this.socket = socket;
    }

    public String getChipset() {
        return chipset;
    }

    public void setChipset(String chipset) {
        this.chipset = chipset;
    }

    public String getMemoryType() {
        return memoryType;
    }

    public void setMemoryType(String memoryType) {
        this.memoryType = memoryType;
    }

    public Integer getMaxRamGb() {
        return maxRamGb;
    }

    public void setMaxRamGb(Integer maxRamGb) {
        this.maxRamGb = maxRamGb;
    }

    public Integer getRamSlots() {
        return ramSlots;
    }

    public void setRamSlots(Integer ramSlots) {
        this.ramSlots = ramSlots;
    }

    public String getFormFactor() {
        return formFactor;
    }

    public void setFormFactor(String formFactor) {
        this.formFactor = formFactor;
    }

    public Integer getM2Slots() {
        return m2Slots;
    }

    public void setM2Slots(Integer m2Slots) {
        this.m2Slots = m2Slots;
    }

    public Integer getSataPorts() {
        return sataPorts;
    }

    public void setSataPorts(Integer sataPorts) {
        this.sataPorts = sataPorts;
    }

    public Boolean getWifi() {
        return wifi;
    }

    public void setWifi(Boolean wifi) {
        this.wifi = wifi;
    }

    public Boolean getBluetooth() {
        return bluetooth;
    }

    public void setBluetooth(Boolean bluetooth) {
        this.bluetooth = bluetooth;
    }
}
