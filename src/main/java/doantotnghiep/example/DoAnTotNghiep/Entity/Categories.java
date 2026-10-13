package doantotnghiep.example.DoAnTotNghiep.Entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "categories")
public class Categories {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    // Category hiện tại thuộc về 1 Category cha
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Categories parent;

    // Category hiện tại có nhiều Category con
    @OneToMany(mappedBy = "parent")
    private List<Categories> children = new ArrayList<>();

    // Một Category có nhiều ProductCategory
    @OneToMany(mappedBy = "category")
    private List<Product_categories> productCategories = new ArrayList<>();
    @Column(name = "show_on_home", nullable = false)
    private Boolean showOnHome;
    @Column(name = "show_on_menu", nullable = false)
    private Boolean showOnMenu;
    @Column(name = "description")
    private String description;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getShowOnMenu() {
        return showOnMenu;
    }

    public void setShowOnMenu(Boolean showOnMenu) {
        this.showOnMenu = showOnMenu;
    }

    public Boolean getShowOnHome() {
        return showOnHome;
    }

    public void setShowOnHome(Boolean showOnHome) {
        this.showOnHome = showOnHome;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Categories getParent() {
        return parent;
    }

    public void setParent(Categories parent) {
        this.parent = parent;
    }

    public List<Categories> getChildren() {
        return children;
    }

    public void setChildren(List<Categories> children) {
        this.children = children;
    }

    public List<Product_categories> getProductCategories() {
        return productCategories;
    }

    public void setProductCategories(List<Product_categories> productCategories) {
        this.productCategories = productCategories;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}


//
//id BIGINT PRIMARY KEY IDENTITY(1,1),
//name NVARCHAR(100) NOT NULL,
//parent_id BIGINT NULL,
//description NVARCHAR(500),
//status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
//created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
//
//CONSTRAINT UQ_categories_name_parent
//UNIQUE (name, parent_id),
//
//CONSTRAINT FK_categories_parent
//FOREIGN KEY (parent_id)
//REFERENCES categories(id),
//
//CONSTRAINT CK_categories_status
//CHECK (status IN ('ACTIVE', 'INACTIVE'))