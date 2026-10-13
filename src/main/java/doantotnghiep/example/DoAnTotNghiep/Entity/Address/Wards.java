package doantotnghiep.example.DoAnTotNghiep.Entity.Address;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "wards")
public class Wards {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "code")
    private String code;

    @Column(name = "name")
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "district_id")
    private Districts district;

    @OneToMany(mappedBy = "ward", fetch = FetchType.LAZY)
    private List<User_Addresses> userAddresses = new ArrayList<>();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Districts getDistrict() { return district; }
    public void setDistrict(Districts district) { this.district = district; }
    public List<User_Addresses> getUserAddresses() { return userAddresses; }
    public void setUserAddresses(List<User_Addresses> userAddresses) { this.userAddresses = userAddresses; }
}