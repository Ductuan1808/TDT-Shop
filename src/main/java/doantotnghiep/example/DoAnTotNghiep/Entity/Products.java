package doantotnghiep.example.DoAnTotNghiep.Entity;

import doantotnghiep.example.DoAnTotNghiep.Entity.Components.Brands;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
public class Products {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "name")
    private String name;
    @Column(name = "sku")
    private String sku;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "brand_id")
    private Brands brand;


    @OneToMany(mappedBy = "product",fetch = FetchType.LAZY)
    private List<Product_categories> productCategories = new ArrayList<>();

    @OneToMany(mappedBy = "component_product",fetch = FetchType.LAZY)
    private List<Pc_build_components> listPc_buildComponent;


    @OneToOne(mappedBy = "product")
    private Pc_builds pcBuild;
    @OneToMany(mappedBy = "product", fetch = FetchType.LAZY)
    private List<Cart_Items> cartItems = new ArrayList<>();
    @OneToMany(mappedBy = "product", fetch = FetchType.LAZY)
    private List<Order_Items> orderItems = new ArrayList<>();
    @OneToMany(mappedBy = "product", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Product_images> productImages = new ArrayList<>();
    @OneToMany(mappedBy = "productId")
    private List<Configuration_options> listConfigurationOptions;

    @Column(name = "product_type")
    private String productType;
    @Column(name = "component_type")
    private String componentType;
    @Column(name = "price")
    private Double price;
    @Column(name = "discount_percent")
    private Double discountPercent;
    @Column(name = "sale_price")
    private Double salePrice;
    @Column(name = "stock")
    private Integer stock;
    @Column(name = "description")
    private String description;
    @Column(name = "status")
    private String status;
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public List<Configuration_options> getListConfigurationOptions() {
        return listConfigurationOptions;
    }

    public void setListConfigurationOptions(List<Configuration_options> listConfigurationOptions) {
        this.listConfigurationOptions = listConfigurationOptions;
    }

    public List<Pc_build_components> getListPc_buildComponent() {
        return listPc_buildComponent;
    }

    public void setListPc_buildComponent(List<Pc_build_components> listPc_buildComponent) {
        this.listPc_buildComponent = listPc_buildComponent;
    }

    public Pc_builds getPcBuild() {
        return pcBuild;
    }

    public void setPcBuild(Pc_builds pcBuild) {
        this.pcBuild = pcBuild;
    }

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

    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public Brands getBrand() {
        return brand;
    }

    public void setBrand(Brands brand) {
        this.brand = brand;
    }

    public List<Product_categories> getProductCategories() {
        return productCategories;
    }

    public void setProductCategories(List<Product_categories> productCategories) {
        this.productCategories = productCategories;
    }

    public String getProductType() {
        return productType;
    }

    public void setProductType(String productType) {
        this.productType = productType;
    }

    public String getComponentType() {
        return componentType;
    }

    public void setComponentType(String componentType) {
        this.componentType = componentType;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Double getDiscountPercent() {
        return discountPercent;
    }

    public void setDiscountPercent(Double discountPercent) {
        this.discountPercent = discountPercent;
    }

    public Double getSalePrice() {
        return salePrice;
    }

    public void setSalePrice(Double salePrice) {
        this.salePrice = salePrice;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
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

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public List<Cart_Items> getCartItems() {
        return cartItems;
    }

    public void setCartItems(List<Cart_Items> cartItems) {
        this.cartItems = cartItems;
    }

    public List<Order_Items> getOrderItems() {
        return orderItems;
    }

    public void setOrderItems(List<Order_Items> orderItems) {
        this.orderItems = orderItems;
    }

    public List<Product_images> getProductImages() {
        return productImages;
    }

    public void setProductImages(List<Product_images> productImages) {
        this.productImages = productImages;
    }
}


