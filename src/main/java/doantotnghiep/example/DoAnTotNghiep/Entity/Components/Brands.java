package doantotnghiep.example.DoAnTotNghiep.Entity.Components;

import doantotnghiep.example.DoAnTotNghiep.Entity.Products;
import jakarta.persistence.*;

import java.util.Date;
import java.util.List;

@Entity
@Table(name ="brands")
public class Brands {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "name")
    private String name;
    @Column(name = "logo")
    private String logo;

    @OneToMany(mappedBy = "brand")
    private List<Products> products;

    @Column(name = "status")
    private String status;
    @Column(name = "created_at")
    private Date createAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLogo() {
        return logo;
    }

    public void setLogo(String logo) {
        this.logo = logo;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Date getCreateAt() {
        return createAt;
    }

    public void setCreateAt(Date createAt) {
        this.createAt = createAt;
    }

    public java.time.LocalDateTime getCreated_at() {
        if (createAt == null) return null;
        return java.time.LocalDateTime.ofInstant(createAt.toInstant(), java.time.ZoneId.systemDefault());
    }

    public void setCreated_at(java.time.LocalDateTime dt) {
        if (dt == null) this.createAt = null;
        else this.createAt = java.util.Date.from(dt.atZone(java.time.ZoneId.systemDefault()).toInstant());
    }

    public List<Products> getProducts() {
        return products;
    }

    public void setProducts(List<Products> products) {
        this.products = products;
    }
}



//id BIGINT PRIMARY KEY IDENTITY(1,1),
//name NVARCHAR(100) NOT NULL,
//logo VARCHAR(500),
//status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
//created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
//
//CONSTRAINT UQ_brands_name UNIQUE (name),
//CONSTRAINT CK_brands_status
//CHECK (status IN ('ACTIVE', 'INACTIVE'))