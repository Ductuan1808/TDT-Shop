package doantotnghiep.example.DoAnTotNghiep.DTO.Address;

public class WardDTO {
    private Long id;
    private String code;
    private String name;
    private Long districtId;
    private String districtName;

    public WardDTO() {
    }

    public WardDTO(Long id, String code, String name, Long districtId, String districtName) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.districtId = districtId;
        this.districtName = districtName;
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

    public Long getDistrictId() {
        return districtId;
    }

    public void setDistrictId(Long districtId) {
        this.districtId = districtId;
    }

    public String getDistrictName() {
        return districtName;
    }

    public void setDistrictName(String districtName) {
        this.districtName = districtName;
    }
}
