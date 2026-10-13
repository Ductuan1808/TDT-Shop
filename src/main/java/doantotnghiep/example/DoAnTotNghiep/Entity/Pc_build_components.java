package doantotnghiep.example.DoAnTotNghiep.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "pc_build_components")
public class Pc_build_components {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pc_build_id")
    private Pc_builds  pc_builds;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "component_product_id")
    private Products component_product;

    @Column(name = "component_type")
    private String componentType;
    @Column(name = "quantity")
    private Integer quantity;



    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Pc_builds getPc_builds() {
        return pc_builds;
    }

    public void setPc_builds(Pc_builds pc_builds) {
        this.pc_builds = pc_builds;
    }

    public Products getComponent_product() {
        return component_product;
    }

    public void setComponent_product(Products component_product) {
        this.component_product = component_product;
    }

    public String getComponentType() {
        return componentType;
    }

    public void setComponentType(String componentType) {
        this.componentType = componentType;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}


//id BIGINT PRIMARY KEY IDENTITY(1,1),
//pc_build_id BIGINT NOT NULL,
//component_product_id BIGINT NOT NULL,
//component_type VARCHAR(30) NOT NULL,
//quantity INT NOT NULL DEFAULT 1,
