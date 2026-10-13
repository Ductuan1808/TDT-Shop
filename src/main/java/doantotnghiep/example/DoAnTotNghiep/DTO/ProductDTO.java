package doantotnghiep.example.DoAnTotNghiep.DTO;

import doantotnghiep.example.DoAnTotNghiep.DTO.ComponentDTO.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class ProductDTO {
    private Long id;

    @NotBlank(message = "Tên sản phẩm không được để trống")
    @Size(max = 255, message = "Tên sản phẩm không được vượt quá 255 ký tự")
    private String name;

    @NotBlank(message = "Mã SKU không được để trống")
    @Size(max = 100, message = "Mã SKU không được vượt quá 100 ký tự")
    private String sku;

    private String brandName;
    private Long brandId;

    @Size(max = 30, message = "Loại sản phẩm không được vượt quá 30 ký tự")
    private String productType;

    @NotNull(message = "Giá gốc không được để trống")
    @DecimalMin(value = "0.0", inclusive = true, message = "Giá gốc phải lớn hơn hoặc bằng 0 VNĐ")
    private BigDecimal price;

    @DecimalMin(value = "0.0", inclusive = true, message = "Phần trăm giảm giá không được âm")
    @DecimalMax(value = "100.0", inclusive = true, message = "Phần trăm giảm giá tối đa 100%")
    private BigDecimal discountPercent;

    private BigDecimal salePrice;

    @NotNull(message = "Số lượng tồn kho không được để trống")
    @Min(value = 1, message = "Số lượng tồn kho phải lớn hơn 0 (không được là 0 hoặc âm)")
    private Integer stock;

    private String description;

    @Size(max = 20, message = "Trạng thái không được vượt quá 20 ký tự")
    private String status;

    @Size(max = 30, message = "Loại linh kiện không được vượt quá 30 ký tự")
    private String componentType;

    @Size(max = 30, message = "Loại phụ kiện không được vượt quá 30 ký tự")
    private String accessoryType;

    private String image;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private List<String> images = new ArrayList<>();
    private List<Long> categoryIds = new ArrayList<>();

    // DTO thông số kỹ thuật chi tiết theo từng loại (Specs)
    @Valid
    private CpuDTO cpuSpecs;
    @Valid
    private GpuDTO gpuSpecs;
    @Valid
    private MotherBoardDTO motherboardSpecs;
    @Valid
    private RamDTO ramSpecs;
    @Valid
    private SsdDTO ssdSpecs;
    @Valid
    private HddDTO hddSpecs;
    @Valid
    private PsuDTO psuSpecs;
    @Valid
    private CaseDTO caseSpecs;
    @Valid
    private CoolerDTO coolerSpecs;
    @Valid
    private MonitorDTO monitorSpecs;
    @Valid
    private KeyBoardDTO keyboardSpecs;
    @Valid
    private MouseDTO mouseSpecs;
    @Valid
    private HeadsetDTO headsetSpecs;
    @Valid
    private SpeakerDTO speakerSpecs;

    // Đối tượng thông số kỹ thuật hoạt động để frontend dễ dàng đọc
    private Object specData;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public String getBrandName() {
        return brandName;
    }

    public void setBrandName(String brandName) {
        this.brandName = brandName;
    }

    public Long getBrandId() {
        return brandId;
    }

    public void setBrandId(Long brandId) {
        this.brandId = brandId;
    }

    public String getProductType() {
        return productType;
    }

    public void setProductType(String productType) {
        this.productType = productType;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public BigDecimal getDiscountPercent() {
        return discountPercent;
    }

    public void setDiscountPercent(BigDecimal discountPercent) {
        this.discountPercent = discountPercent;
    }

    public BigDecimal getSalePrice() {
        return salePrice;
    }

    public void setSalePrice(BigDecimal salePrice) {
        this.salePrice = salePrice;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getComponentType() {
        return componentType;
    }

    public void setComponentType(String componentType) {
        this.componentType = componentType;
    }

    public String getAccessoryType() {
        return accessoryType;
    }

    public void setAccessoryType(String accessoryType) {
        this.accessoryType = accessoryType;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public List<String> getImages() {
        return images;
    }

    public void setImages(List<String> images) {
        this.images = images;
    }

    public List<Long> getCategoryIds() {
        return categoryIds;
    }

    public void setCategoryIds(List<Long> categoryIds) {
        this.categoryIds = categoryIds;
    }

    public CpuDTO getCpuSpecs() {
        return cpuSpecs;
    }

    public void setCpuSpecs(CpuDTO cpuSpecs) {
        this.cpuSpecs = cpuSpecs;
    }

    public GpuDTO getGpuSpecs() {
        return gpuSpecs;
    }

    public void setGpuSpecs(GpuDTO gpuSpecs) {
        this.gpuSpecs = gpuSpecs;
    }

    public MotherBoardDTO getMotherboardSpecs() {
        return motherboardSpecs;
    }

    public void setMotherboardSpecs(MotherBoardDTO motherboardSpecs) {
        this.motherboardSpecs = motherboardSpecs;
    }

    public RamDTO getRamSpecs() {
        return ramSpecs;
    }

    public void setRamSpecs(RamDTO ramSpecs) {
        this.ramSpecs = ramSpecs;
    }

    public SsdDTO getSsdSpecs() {
        return ssdSpecs;
    }

    public void setSsdSpecs(SsdDTO ssdSpecs) {
        this.ssdSpecs = ssdSpecs;
    }

    public HddDTO getHddSpecs() {
        return hddSpecs;
    }

    public void setHddSpecs(HddDTO hddSpecs) {
        this.hddSpecs = hddSpecs;
    }

    public PsuDTO getPsuSpecs() {
        return psuSpecs;
    }

    public void setPsuSpecs(PsuDTO psuSpecs) {
        this.psuSpecs = psuSpecs;
    }

    public CaseDTO getCaseSpecs() {
        return caseSpecs;
    }

    public void setCaseSpecs(CaseDTO caseSpecs) {
        this.caseSpecs = caseSpecs;
    }

    public CoolerDTO getCoolerSpecs() {
        return coolerSpecs;
    }

    public void setCoolerSpecs(CoolerDTO coolerSpecs) {
        this.coolerSpecs = coolerSpecs;
    }

    public MonitorDTO getMonitorSpecs() {
        return monitorSpecs;
    }

    public void setMonitorSpecs(MonitorDTO monitorSpecs) {
        this.monitorSpecs = monitorSpecs;
    }

    public KeyBoardDTO getKeyboardSpecs() {
        return keyboardSpecs;
    }

    public void setKeyboardSpecs(KeyBoardDTO keyboardSpecs) {
        this.keyboardSpecs = keyboardSpecs;
    }

    public MouseDTO getMouseSpecs() {
        return mouseSpecs;
    }

    public void setMouseSpecs(MouseDTO mouseSpecs) {
        this.mouseSpecs = mouseSpecs;
    }

    public HeadsetDTO getHeadsetSpecs() {
        return headsetSpecs;
    }

    public void setHeadsetSpecs(HeadsetDTO headsetSpecs) {
        this.headsetSpecs = headsetSpecs;
    }

    public SpeakerDTO getSpeakerSpecs() {
        return speakerSpecs;
    }

    public void setSpeakerSpecs(SpeakerDTO speakerSpecs) {
        this.speakerSpecs = speakerSpecs;
    }

    public Object getSpecData() {
        return specData;
    }

    public void setSpecData(Object specData) {
        this.specData = specData;
    }
}
