package doantotnghiep.example.DoAnTotNghiep.DTO.ComponentDTO;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public class CpuDTO {
    private Long id;

    @NotBlank(message = "Socket CPU không được để trống")
    @Size(max = 50, message = "Socket CPU không được vượt quá 50 ký tự")
    private String socket;

    @NotNull(message = "Số nhân CPU không được để trống")
    @Min(value = 1, message = "Số nhân CPU phải lớn hơn 0")
    private Integer cores;

    @NotNull(message = "Số luồng CPU không được để trống")
    @Min(value = 1, message = "Số luồng CPU phải lớn hơn 0")
    private Integer threads;

    @NotNull(message = "Xung nhịp cơ bản không được để trống")
    @DecimalMin(value = "0.1", message = "Xung nhịp cơ bản phải lớn hơn 0 GHz")
    private BigDecimal baseClock;

    @NotNull(message = "Xung nhịp tối đa không được để trống")
    @DecimalMin(value = "0.1", message = "Xung nhịp tối đa phải lớn hơn 0 GHz")
    private BigDecimal boostClock;

    @NotNull(message = "Bộ nhớ đệm (Cache) không được để trống")
    @DecimalMin(value = "0.0", message = "Bộ nhớ đệm (Cache) không được âm")
    private BigDecimal cacheMb;

    @Size(max = 100, message = "Đồ họa tích hợp không được vượt quá 100 ký tự")
    private String integratedGraphics;

    public CpuDTO() {
    }

    public CpuDTO(Long id, String socket, Integer cores, Integer threads, BigDecimal baseClock, BigDecimal boostClock, BigDecimal cacheMb, String integratedGraphics) {
        this.id = id;
        this.socket = socket;
        this.cores = cores;
        this.threads = threads;
        this.baseClock = baseClock;
        this.boostClock = boostClock;
        this.cacheMb = cacheMb;
        this.integratedGraphics = integratedGraphics;
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

    public Integer getCores() {
        return cores;
    }

    public void setCores(Integer cores) {
        this.cores = cores;
    }

    public Integer getThreads() {
        return threads;
    }

    public void setThreads(Integer threads) {
        this.threads = threads;
    }

    public BigDecimal getBaseClock() {
        return baseClock;
    }

    public void setBaseClock(BigDecimal baseClock) {
        this.baseClock = baseClock;
    }

    public BigDecimal getBoostClock() {
        return boostClock;
    }

    public void setBoostClock(BigDecimal boostClock) {
        this.boostClock = boostClock;
    }

    public BigDecimal getCacheMb() {
        return cacheMb;
    }

    public void setCacheMb(BigDecimal cacheMb) {
        this.cacheMb = cacheMb;
    }

    public String getIntegratedGraphics() {
        return integratedGraphics;
    }

    public void setIntegratedGraphics(String integratedGraphics) {
        this.integratedGraphics = integratedGraphics;
    }
}
