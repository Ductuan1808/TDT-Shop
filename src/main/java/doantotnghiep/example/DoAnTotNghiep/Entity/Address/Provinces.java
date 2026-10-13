package doantotnghiep.example.DoAnTotNghiep.Entity.Address;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "provinces")
public class Provinces {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "code")
    private String code;

    @Column(name = "name")
    private String name;

    @Column(name = "type")
    private String type;

    @OneToMany(mappedBy = "province", fetch = FetchType.LAZY)
    private List<Districts> districts = new ArrayList<>();
    @OneToMany(mappedBy = "province", fetch = FetchType.LAZY)
    private List<User_Addresses> userAddresses = new ArrayList<>();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public List<Districts> getDistricts() { return districts; }
    public void setDistricts(List<Districts> districts) { this.districts = districts; }
    public List<User_Addresses> getUserAddresses() { return userAddresses; }
    public void setUserAddresses(List<User_Addresses> userAddresses) { this.userAddresses = userAddresses; }
}
