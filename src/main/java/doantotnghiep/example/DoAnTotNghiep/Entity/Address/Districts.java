package doantotnghiep.example.DoAnTotNghiep.Entity.Address;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "districts")
public class Districts {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "code")
    private String code;

    @Column(name = "name")
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "province_id")
    private Provinces province;

    @OneToMany(mappedBy = "district", fetch = FetchType.LAZY)
    private List<Wards> wards = new ArrayList<>();
    @OneToMany(mappedBy = "district", fetch = FetchType.LAZY)
    private List<User_Addresses> userAddresses = new ArrayList<>();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Provinces getProvince() { return province; }
    public void setProvince(Provinces province) { this.province = province; }
    public List<Wards> getWards() { return wards; }
    public void setWards(List<Wards> wards) { this.wards = wards; }
    public List<User_Addresses> getUserAddresses() { return userAddresses; }
    public void setUserAddresses(List<User_Addresses> userAddresses) { this.userAddresses = userAddresses; }
}
