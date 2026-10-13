package doantotnghiep.example.DoAnTotNghiep.DTO;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class CartItemDTO {
    private Long id;
    private Long cartId;
    private Long productId;
    private String productName;
    private String productSku;
    private BigDecimal productPrice;
    private String productImage;
    private Integer quantity;
    private LocalDateTime createdAt;
    private BigDecimal subtotal;

    public CartItemDTO() {
    }

    public CartItemDTO(Long id, Long cartId, Long productId, Integer quantity, LocalDateTime createdAt) {
        this.id = id;
        this.cartId = cartId;
        this.productId = productId;
        this.quantity = quantity;
        this.createdAt = createdAt;
    }

    public CartItemDTO(Long id, Long cartId, Long productId, String productName, String productSku,
                       BigDecimal productPrice, String productImage, Integer quantity, LocalDateTime createdAt) {
        this.id = id;
        this.cartId = cartId;
        this.productId = productId;
        this.productName = productName;
        this.productSku = productSku;
        this.productPrice = productPrice;
        this.productImage = productImage;
        this.quantity = quantity;
        this.createdAt = createdAt;
        if (productPrice != null && quantity != null) {
            this.subtotal = productPrice.multiply(BigDecimal.valueOf(quantity));
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCartId() {
        return cartId;
    }

    public void setCartId(Long cartId) {
        this.cartId = cartId;
    }

    public Long getCart_id() {
        return cartId;
    }

    public void setCart_id(Long cartId) {
        this.cartId = cartId;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public Long getProduct_id() {
        return productId;
    }

    public void setProduct_id(Long productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getProductSku() {
        return productSku;
    }

    public void setProductSku(String productSku) {
        this.productSku = productSku;
    }

    public BigDecimal getProductPrice() {
        return productPrice;
    }

    public void setProductPrice(BigDecimal productPrice) {
        this.productPrice = productPrice;
        if (this.productPrice != null && this.quantity != null) {
            this.subtotal = this.productPrice.multiply(BigDecimal.valueOf(this.quantity));
        }
    }

    public String getProductImage() {
        return productImage;
    }

    public void setProductImage(String productImage) {
        this.productImage = productImage;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
        if (this.productPrice != null && this.quantity != null) {
            this.subtotal = this.productPrice.multiply(BigDecimal.valueOf(this.quantity));
        }
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getCreated_at() {
        return createdAt;
    }

    public void setCreated_at(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }
}
