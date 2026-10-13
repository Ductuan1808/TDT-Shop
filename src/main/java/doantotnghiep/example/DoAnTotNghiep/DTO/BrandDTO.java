package doantotnghiep.example.DoAnTotNghiep.DTO;

import java.util.Date;

public class BrandDTO {
    private Long id;
    private String name;
    private String logo;
    private String status;
    private Date createdAt;

    public BrandDTO() {
    }

    public BrandDTO(Long id, String name, String logo, String status, Date createdAt) {
        this.id = id;
        this.name = name;
        this.logo = logo;
        this.status = status;
        this.createdAt = createdAt;
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

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }
}
