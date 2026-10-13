package doantotnghiep.example.DoAnTotNghiep.DTO;

import doantotnghiep.example.DoAnTotNghiep.Entity.Categories;
import doantotnghiep.example.DoAnTotNghiep.Entity.Product_categories;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class CategoryDTO {
    private Long id;
    private String name;
    private Long parentId;
    private String parentName;
    private String description;
    private String status;
    private Boolean showOnHome;
    private Boolean showOnMenu;
    private LocalDateTime createdAt;

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

    public Long getParentId() {
        return parentId;
    }

    public void setParentId(Long parentId) {
        this.parentId = parentId;
    }

    public String getParentName() {
        return parentName;
    }

    public void setParentName(String parentName) {
        this.parentName = parentName;
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

    public Boolean getShowOnHome() {
        return showOnHome;
    }

    public void setShowOnHome(Boolean showOnHome) {
        this.showOnHome = showOnHome;
    }

    public Boolean getShowOnMenu() {
        return showOnMenu;
    }

    public void setShowOnMenu(Boolean showOnMenu) {
        this.showOnMenu = showOnMenu;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
