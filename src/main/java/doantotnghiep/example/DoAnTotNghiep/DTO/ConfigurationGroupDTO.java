package doantotnghiep.example.DoAnTotNghiep.DTO;

import java.util.ArrayList;
import java.util.List;

public class ConfigurationGroupDTO {
    private Long id;
    private Long pcBuildId;
    private String pcBuildName;
    private String componentType;
    private Boolean required;
    private Integer sortOrder;
    private String name;
    private List<ConfigurationOptionDTO> configurationOptions = new ArrayList<>();

    public ConfigurationGroupDTO() {
    }

    public ConfigurationGroupDTO(Long id, Long pcBuildId, String name, String componentType, Boolean required, Integer sortOrder) {
        this.id = id;
        this.pcBuildId = pcBuildId;
        this.name = name;
        this.componentType = componentType;
        this.required = required;
        this.sortOrder = sortOrder;
    }

    public ConfigurationGroupDTO(Long id, Long pcBuildId, String pcBuildName, String name,
                                 String componentType, Boolean required, Integer sortOrder,
                                 List<ConfigurationOptionDTO> configurationOptions) {
        this.id = id;
        this.pcBuildId = pcBuildId;
        this.pcBuildName = pcBuildName;
        this.name = name;
        this.componentType = componentType;
        this.required = required;
        this.sortOrder = sortOrder;
        this.configurationOptions = configurationOptions != null ? configurationOptions : new ArrayList<>();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getPcBuildId() {
        return pcBuildId;
    }

    public void setPcBuildId(Long pcBuildId) {
        this.pcBuildId = pcBuildId;
    }

    public Long getPc_build_id() {
        return pcBuildId;
    }

    public void setPc_build_id(Long pcBuildId) {
        this.pcBuildId = pcBuildId;
    }

    public String getPcBuildName() {
        return pcBuildName;
    }

    public void setPcBuildName(String pcBuildName) {
        this.pcBuildName = pcBuildName;
    }

    public String getComponentType() {
        return componentType;
    }

    public void setComponentType(String componentType) {
        this.componentType = componentType;
    }

    public Boolean getRequired() {
        return required;
    }

    public void setRequired(Boolean required) {
        this.required = required;
    }

    public Integer getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(Integer sortOrder) {
        this.sortOrder = sortOrder;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<ConfigurationOptionDTO> getConfigurationOptions() {
        return configurationOptions;
    }

    public void setConfigurationOptions(List<ConfigurationOptionDTO> configurationOptions) {
        this.configurationOptions = configurationOptions;
    }

    public List<ConfigurationOptionDTO> getConfiguration_options() {
        return configurationOptions;
    }

    public void setConfiguration_options(List<ConfigurationOptionDTO> configurationOptions) {
        this.configurationOptions = configurationOptions;
    }
}
