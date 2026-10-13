package doantotnghiep.example.DoAnTotNghiep.Entity;

import doantotnghiep.example.DoAnTotNghiep.Entity.Address.User_Addresses;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity()
@Table(name = "users")
public class Users {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "username")
    private String username;
    @Column(name = "email")
    private String email;
    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<User_Role> userRoles = new ArrayList<>();
    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<User_Addresses> addresses = new ArrayList<>();
    @OneToOne(
            mappedBy = "user",
            fetch = FetchType.LAZY,
            cascade = CascadeType.ALL
    )
    private Carts cart;
    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<Orders> orders = new ArrayList<>();
    @Column(name = "password")
    private String password;
    @Column(name = "full_name")
    private String fullName;
    @Column(name = "phone")
    private String phone;
    @Column(name = "enabled")
    private boolean enabled;
    @Column(name = "created_at")
    private LocalDateTime created_at;
    @Column(name = "updated_at")
    private LocalDateTime updated_at;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public LocalDateTime getCreated_at() {
        return created_at;
    }

    public void setCreated_at(LocalDateTime created_at) {
        this.created_at = created_at;
    }

    public LocalDateTime getUpdated_at() {
        return updated_at;
    }

    public void setUpdated_at(LocalDateTime updated_at) {
        this.updated_at = updated_at;
    }

    public List<User_Addresses> getAddresses() {
        return addresses;
    }

    public void setAddresses(List<User_Addresses> addresses) {
        this.addresses = addresses;
    }

    public List<Orders> getOrders() {
        return orders;
    }

    public void setOrders(List<Orders> orders) {
        this.orders = orders;
    }

    public Carts getCart() {
        return cart;
    }

    public void setCart(Carts cart) {
        this.cart = cart;
    }

    public List<User_Role> getUserRoles() {
        return userRoles;
    }

    public void setUserRoles(List<User_Role> userRoles) {
        this.userRoles = userRoles;
    }
}

//
//id BIGINT IDENTITY(1,1) PRIMARY KEY,
//username VARCHAR(100) NOT NULL UNIQUE,
//email VARCHAR(150) NOT NULL UNIQUE,
//password VARCHAR(255) NOT NULL,
//full_name NVARCHAR(150),
//phone VARCHAR(20),
//enabled BIT NOT NULL DEFAULT 1,
//created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
//updated_at DATETIME2 NULL