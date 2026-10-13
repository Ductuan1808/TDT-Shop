package doantotnghiep.example.DoAnTotNghiep.DTO;

import java.math.BigDecimal;

public class FilterOptionDTO {
    private Long id;
    private Long filterGroupId;
    private String filterGroupName;
    private String value;
    private String label;
    private BigDecimal minValue;
    private BigDecimal maxValue;
    private Integer sortOrder;
    private Byte status;

    public FilterOptionDTO() {
    }

    public FilterOptionDTO(Long id, Long filterGroupId, String value, String label,
                           BigDecimal minValue, BigDecimal maxValue, Integer sortOrder, Byte status) {
        this.id = id;
        this.filterGroupId = filterGroupId;
        this.value = value;
        this.label = label;
        this.minValue = minValue;
        this.maxValue = maxValue;
        this.sortOrder = sortOrder;
        this.status = status;
    }

    public FilterOptionDTO(Long id, Long filterGroupId, String filterGroupName, String value, String label,
                           BigDecimal minValue, BigDecimal maxValue, Integer sortOrder, Byte status) {
        this.id = id;
        this.filterGroupId = filterGroupId;
        this.filterGroupName = filterGroupName;
        this.value = value;
        this.label = label;
        this.minValue = minValue;
        this.maxValue = maxValue;
        this.sortOrder = sortOrder;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getFilterGroupId() {
        return filterGroupId;
    }

    public void setFilterGroupId(Long filterGroupId) {
        this.filterGroupId = filterGroupId;
    }

    public Long getFilter_group_id() {
        return filterGroupId;
    }

    public void setFilter_group_id(Long filterGroupId) {
        this.filterGroupId = filterGroupId;
    }

    public String getFilterGroupName() {
        return filterGroupName;
    }

    public void setFilterGroupName(String filterGroupName) {
        this.filterGroupName = filterGroupName;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public BigDecimal getMinValue() {
        return minValue;
    }

    public void setMinValue(BigDecimal minValue) {
        this.minValue = minValue;
    }

    public BigDecimal getMin_value() {
        return minValue;
    }

    public void setMin_value(BigDecimal minValue) {
        this.minValue = minValue;
    }

    public BigDecimal getMaxValue() {
        return maxValue;
    }

    public void setMaxValue(BigDecimal maxValue) {
        this.maxValue = maxValue;
    }

    public BigDecimal getMax_value() {
        return maxValue;
    }

    public void setMax_value(BigDecimal maxValue) {
        this.maxValue = maxValue;
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
}
