package doantotnghiep.example.DoAnTotNghiep.Entity;

import jakarta.persistence.*;

/**
 * ============================================================================
 * ENTITY: Product_categories
 * MỤC ĐÍCH:
 * - Ánh xạ bảng trung gian product_categories nối giữa products và categories.
 * - Khóa chính phức hợp (product_id, category_id) qua ProductCategoryId.
 * ============================================================================
 */
@Entity
@Table(name = "product_categories")
public class Product_categories {

    @EmbeddedId
    private ProductCategoryId id = new ProductCategoryId();

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("productId")
    @JoinColumn(name = "product_id", nullable = false)
    private Products product;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("categoryId")
    @JoinColumn(name = "category_id", nullable = false)
    private Categories category;

    public Product_categories() {
    }

    public Product_categories(Products product, Categories category) {
        this.product = product;
        this.category = category;
        this.id = new ProductCategoryId(
                product != null ? product.getId() : null,
                category != null ? category.getId() : null
        );
    }

    public ProductCategoryId getId() {
        return id;
    }

    public void setId(ProductCategoryId id) {
        this.id = id;
    }

    public Products getProduct() {
        return product;
    }

    public void setProduct(Products product) {
        this.product = product;
        if (this.id != null && product != null) {
            this.id.setProductId(product.getId());
        }
    }

    public Categories getCategory() {
        return category;
    }

    public void setCategory(Categories category) {
        this.category = category;
        if (this.id != null && category != null) {
            this.id.setCategoryId(category.getId());
        }
    }
}
