package doantotnghiep.example.DoAnTotNghiep.Entity.Components;

import doantotnghiep.example.DoAnTotNghiep.Entity.Products;
import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "cpu_specs")
public class Cpu {
    @Id
    @Column(name = "product_id")
    private Long productId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "product_id")
    private Products product;

    @Column(name = "socket")
    private String socket;

    @Column(name = "cores")
    private Integer cores;

    @Column(name = "threads")
    private Integer threads;

    @Column(name = "base_clock", precision = 6, scale = 2)
    private BigDecimal baseClock;

    @Column(name = "boost_clock", precision = 6, scale = 2)
    private BigDecimal boostClock;

    @Column(name = "cache_mb", precision = 6, scale = 2)
    private BigDecimal cacheMb;

    @Column(name = "integrated_graphics")//igpu
    private String integratedGraphics;

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