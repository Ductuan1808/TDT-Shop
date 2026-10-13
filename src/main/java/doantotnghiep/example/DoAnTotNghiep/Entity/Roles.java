package doantotnghiep.example.DoAnTotNghiep.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "roles")
public class Roles {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, unique = true)
    private String name;
    @OneToMany(mappedBy = "role", fetch = FetchType.LAZY)
    private List<User_Role> userRoles = new ArrayList<>();
    public Roles() {
    }

    public Roles(Long id, String name) {
        this.id = id;
        this.name = name;
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

    public List<User_Role> getUserRoles() {
        return userRoles;
    }

    public void setUserRoles(List<User_Role> userRoles) {
        this.userRoles = userRoles;
    }
}