package doantotnghiep.example.DoAnTotNghiep.DTO;

import java.util.ArrayList;
import java.util.List;

public class FilterGroupDTO {
    private Long id;
    private String productType;
    private String productCode;
    private String name;
    private String code;
    private String filterType;
    private Integer sortOrder;
    private Byte status;
    private List<FilterOptionDTO> options = new ArrayList<>();

    public FilterGroupDTO() {
    }

    public FilterGroupDTO(Long id, String productType, String productCode, String name,
                          String code, String filterType, Integer sortOrder, Byte status) {
        this.id = id;
        this.productType = productType;
        this.productCode = productCode;
        this.name = name;
        this.code = code;
        this.filterType = filterType;
        this.sortOrder = sortOrder;
        this.status = status;
    }

    public FilterGroupDTO(Long id, String productType, String productCode, String name,
                          String code, String filterType, Integer sortOrder, Byte status,
                          List<FilterOptionDTO> options) {
        this.id = id;
        this.productType = productType;
        this.productCode = productCode;
        this.name = name;
        this.code = code;
        this.filterType = filterType;
        this.sortOrder = sortOrder;
        this.status = status;
        this.options = options != null ? options : new ArrayList<>();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getProductType() {
        return productType;
    }

    public void setProductType(String productType) {
        this.productType = productType;
    }

    public String getProduct_type() {
        return productType;
    }

    public void setProduct_type(String productType) {
        this.productType = productType;
    }

    public String getProductCode() {
        return productCode;
    }

    public void setProductCode(String productCode) {
        this.productCode = productCode;
    }

    public String getProduct_code() {
        return productCode;
    }

    public void setProduct_code(String productCode) {
        this.productCode = productCode;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getFilterType() {
        return filterType;
    }

    public void setFilterType(String filterType) {
        this.filterType = filterType;
    }

    public String getFilter_type() {
        return filterType;
    }

    public void setFilter_type(String filterType) {
        this.filterType = filterType;
    }

    public Integer getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(Integer sortOrder) {
        this.sortOrder = sortOrder;
    }

    public Integer getSort_order() {
        return sortOrder;
    }

    public void setSort_order(Integer sortOrder) {
        this.sortOrder = sortOrder;
    }

    public Byte getStatus() {
        return status;
    }

    public void setStatus(Byte status) {
        this.status = status;
    }

    public List<FilterOptionDTO> getOptions() {
        return options;
    }

    public void setOptions(List<FilterOptionDTO> options) {
        this.options = options;
    }
}
