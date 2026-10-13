package doantotnghiep.example.DoAnTotNghiep.Entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "filter_options")
public class Filter_options {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "filter_group_id", nullable = false)
    private Filter_groups filterGroup;

    @Column(name = "value", nullable = false, length = 100)
    private String value;

    @Column(name = "label", nullable = false, length = 100)
    private String label;

    @Column(name = "min_value", precision = 15, scale = 2)
    private BigDecimal minValue;

    @Column(name = "max_value", precision = 15, scale = 2)
    private BigDecimal maxValue;

    @Column(name = "sort_order")
    private Integer sortOrder;

    @Column(name = "status")
    private Byte status;

    public Filter_options() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Filter_groups getFilterGroup() {
        return filterGroup;
    }

    public void setFilterGroup(Filter_groups filterGroup) {
        this.filterGroup = filterGroup;
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

    public BigDecimal getMaxValue() {
        return maxValue;
    }

    public void setMaxValue(BigDecimal maxValue) {
        this.maxValue = maxValue;
    }

    public Integer getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(Integer sortOrder) {
        this.sortOrder = sortOrder;
    }

    public Byte getStatus() {
        return status;
    }

    public void setStatus(Byte status) {
        this.status = status;
    }
}
