package doantotnghiep.example.DoAnTotNghiep.Entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "pc_builds")
public class Pc_builds {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Products product;

    @OneToMany(mappedBy = "pc_builds",fetch = FetchType.LAZY)
    List<Pc_build_components> listPc_buildComponent;

    @OneToMany(mappedBy = "pc_build",fetch = FetchType.LAZY)
    List<Configuration_groups> listConfiguration_groups;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public List<Configuration_groups> getListConfiguration_groups() {
        return listConfiguration_groups;
    }


    public void setListConfiguration_groups(List<Configuration_groups> listConfiguration_groups) {
        this.listConfiguration_groups = listConfiguration_groups;
    }

    public List<Pc_build_components> getListPc_buildComponent() {
        return listPc_buildComponent;
    }

    public void setListPc_buildComponent(List<Pc_build_components> listPc_buildComponent) {
        this.listPc_buildComponent = listPc_buildComponent;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Products getProduct() {
        return product;
    }

    public void setProduct(Products product) {
        this.product = product;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}


//id BIGINT PRIMARY KEY IDENTITY(1,1),
//product_id BIGINT NOT NULL,
//created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
//
//CONSTRAINT UQ_pc_builds_product
//UNIQUE (product_id),
//CONSTRAINT FK_pc_builds_product
//FOREIGN KEY (product_id)
//REFERENCES products(id)
//ON DELETE CASCADE