package doantotnghiep.example.DoAnTotNghiep.DTO.Address;

import java.util.ArrayList;
import java.util.List;

public class DistrictDTO {
    private Long id;
    private String code;
    private String name;
    private Long provinceId;
    private String provinceName;
    private List<WardDTO> wards = new ArrayList<>();

    public DistrictDTO() {
    }

    public DistrictDTO(Long id, String code, String name, Long provinceId, String provinceName) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.provinceId = provinceId;
        this.provinceName = provinceName;
    }

    public DistrictDTO(Long id, String code, String name, Long provinceId, String provinceName, List<WardDTO> wards) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.provinceId = provinceId;
        this.provinceName = provinceName;
        this.wards = wards != null ? wards : new ArrayList<>();
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

    public Long getProvinceId() {
        return provinceId;
    }

    public void setProvinceId(Long provinceId) {
        this.provinceId = provinceId;
    }

    public String getProvinceName() {
        return provinceName;
    }

    public void setProvinceName(String provinceName) {
        this.provinceName = provinceName;
    }

    public List<WardDTO> getWards() {
        return wards;
    }

    public void setWards(List<WardDTO> wards) {
        this.wards = wards;
    }
}
