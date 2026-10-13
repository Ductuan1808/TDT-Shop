package doantotnghiep.example.DoAnTotNghiep.Entity;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "configuration_groups")
public class Configuration_groups {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pc_build_id")
    private Pc_builds pc_build;
    @OneToMany(mappedBy = "configuration_group")
    private List<Configuration_options> configuration_options;
    @Column(name = "component_type")
    private String componentType;
    @Column(name = "required")
    private Boolean required;
    @Column(name = "sort_order")
    private Integer sortOrder;
    @Column(name = "name")
    private String name;

    public List<Configuration_options> getConfiguration_options() {
        return configuration_options;
    }

    public void setConfiguration_options(List<Configuration_options> configuration_options) {
        this.configuration_options = configuration_options;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Pc_builds getPc_build() {
        return pc_build;
    }

    public void setPc_build(Pc_builds pc_build) {
        this.pc_build = pc_build;
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
}




//id BIGINT PRIMARY KEY IDENTITY(1,1),
//pc_build_id BIGINT NOT NULL,
//name NVARCHAR(100) NOT NULL,
//component_type VARCHAR(30) NOT NULL,
//required BIT NOT NULL DEFAULT 1,
//sort_order INT NOT NULL DEFAULT 0,
//
//CONSTRAINT FK_configuration_groups_build
//FOREIGN KEY (pc_build_id)
//REFERENCES pc_builds(id)
//ON DELETE CASCADE,
