package doantotnghiep.example.DoAnTotNghiep.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "product_images")
public class Product_images {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Products product;
    @Column(name = "image_url", nullable = false, length = 1000)
    private String imageUrl;
    @Column(name = "is_thumbnail", nullable = false)
    private Boolean isThumbnail = false;
    @Column(name = "sort_order", nullable = false)
    private Integer sortOrder = 0;

    public Product_images() {
    }

    public Product_images(Products product, String imageUrl, Boolean isThumbnail, Integer sortOrder) {
        this.product = product;
        this.imageUrl = imageUrl;
        this.isThumbnail = isThumbnail;
        this.sortOrder = sortOrder;
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

    public Products getProducts() {
        return product;
    }

    public void setProducts(Products products) {
        this.product = products;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Boolean getThumbnail() {
        return isThumbnail;
    }

    public void setThumbnail(Boolean thumbnail) {
        isThumbnail = thumbnail;
    }

    public Boolean getIsThumbnail() {
        return isThumbnail;
    }

    public void setIsThumbnail(Boolean isThumbnail) {
        this.isThumbnail = isThumbnail;
    }

    public Integer getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(Integer sortOrder) {
        this.sortOrder = sortOrder;
    }
}



//
//id BIGINT PRIMARY KEY IDENTITY(1,1),
//product_id BIGINT NOT NULL,
//image_url VARCHAR(1000) NOT NULL,
//is_thumbnail BIT NOT NULL DEFAULT 0,
//sort_order INT NOT NULL DEFAULT 0,
//
//CONSTRAINT FK_product_images_product
//FOREIGN KEY (product_id)
//REFERENCES products(id)
//ON DELETE CASCADE