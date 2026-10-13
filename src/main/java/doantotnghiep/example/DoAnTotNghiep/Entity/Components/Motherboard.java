package doantotnghiep.example.DoAnTotNghiep.Entity.Components;

import doantotnghiep.example.DoAnTotNghiep.Entity.Products;
import jakarta.persistence.*;

@Entity
@Table(name = "motherboard_specs")
public class Motherboard {
    @Id
    @Column(name = "product_id")
    private Long productId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "product_id")
    private Products product;

    @Column(name = "socket")
    private String socket;
    @Column(name = "chipset")
    private String chipset;
    @Column(name = "memory_type")
    private String memoryType;
    @Column(name = "max_ram_gb")
    private Integer maxRamGb;
    @Column(name = "ram_slots")
    private Integer ramSlots;
    @Column(name = "form_factor")
    private String formFactor;
    @Column(name = "m2_slots")
    private Integer m2Slots;
    @Column(name = "sata_ports")
    private Integer sataPorts;
    @Column(name = "wifi")
    private Boolean wifi;
    @Column(name = "bluetooth")
    private Boolean bluetooth;


    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public Products getProduct() {
        return product;
    }

    public void setProduct(Products product) {
        this.product = product;
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

//product_id BIGINT PRIMARY KEY,
//socket VARCHAR(50) NOT NULL,
//chipset VARCHAR(100),
//memory_type VARCHAR(20),
//max_ram_gb INT,
//ram_slots INT,
//form_factor VARCHAR(30),
//m2_slots INT,
//sata_ports INT,
//wifi BIT DEFAULT 0,
//bluetooth BIT DEFAULT 0,
//
//CONSTRAINT FK_motherboard_specs_product
//FOREIGN KEY (product_id)
//REFERENCES products(id)
//ON DELETE CASCADE

