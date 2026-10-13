package doantotnghiep.example.DoAnTotNghiep.DTO.Address;

import java.util.ArrayList;
import java.util.List;

public class ProvinceDTO {
    private Long id;
    private String code;
    private String name;
    private String type;
    private List<DistrictDTO> districts = new ArrayList<>();

    public ProvinceDTO() {
    }

    public ProvinceDTO(Long id, String code, String name, String type) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.type = type;
    }

    public ProvinceDTO(Long id, String code, String name, String type, List<DistrictDTO> districts) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.type = type;
        this.districts = districts != null ? districts : new ArrayList<>();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public List<DistrictDTO> getDistricts() {
        return districts;
    }

    public void setDistricts(List<DistrictDTO> districts) {
        this.districts = districts;
    }
}
