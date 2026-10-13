package doantotnghiep.example.DoAnTotNghiep.DTO;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class CartDTO {
    private Long id;
    private Long userId;
    private String username;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<CartItemDTO> cartItems = new ArrayList<>();
    private Integer totalItems;
    private BigDecimal totalPrice;

    public CartDTO() {
    }

    public CartDTO(Long id, Long userId, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.userId = userId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public CartDTO(Long id, Long userId, String username, LocalDateTime createdAt, LocalDateTime updatedAt, List<CartItemDTO> cartItems) {
        this.id = id;
        this.userId = userId;
        this.username = username;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.cartItems = cartItems != null ? cartItems : new ArrayList<>();
        calculateTotals();
    }

    public void calculateTotals() {
        int count = 0;
        BigDecimal total = BigDecimal.ZERO;
        if (this.cartItems != null) {
            for (CartItemDTO item : this.cartItems) {
                if (item.getQuantity() != null) {
                    count += item.getQuantity();
                }
                if (item.getSubtotal() != null) {
                    total = total.add(item.getSubtotal());
                } else if (item.getProductPrice() != null && item.getQuantity() != null) {
                    total = total.add(item.getProductPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
                }
            }
        }
        this.totalItems = count;
        this.totalPrice = total;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getUser_id() {
        return userId;
    }

    public void setUser_id(Long userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
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

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public LocalDateTime getUpdated_at() {
        return updatedAt;
    }

    public void setUpdated_at(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public List<CartItemDTO> getCartItems() {
        return cartItems;
    }

    public void setCartItems(List<CartItemDTO> cartItems) {
        this.cartItems = cartItems;
        calculateTotals();
    }

    public Integer getTotalItems() {
        return totalItems;
    }

    public void setTotalItems(Integer totalItems) {
        this.totalItems = totalItems;
    }

    public BigDecimal getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(BigDecimal totalPrice) {
        this.totalPrice = totalPrice;
    }
}
