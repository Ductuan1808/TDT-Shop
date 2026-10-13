package doantotnghiep.example.DoAnTotNghiep.DTO;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * CustomerDTO - DTO truyền tải thông tin khách hàng phục vụ Admin Dashboard.
 * 
 * QUY TẮC THIẾT KẾ:
 * - Tuyệt đối không chứa mật khẩu (password) để đảm bảo an toàn thông tin.
 * - Chỉ sử dụng các kiểu dữ liệu cơ bản (List, String, Long, Boolean, Double).
 */
public class CustomerDTO {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String phone;
    private Boolean enabled;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Thống kê lịch sử mua sắm
    private Integer orderCount;
    private Double totalSpent;

    // Sổ địa chỉ giao hàng
    private List<AddressDTO> addresses = new ArrayList<>();

    public CustomerDTO() {
    }

    public CustomerDTO(Long id, String username, String email, String fullName, String phone, Boolean enabled, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.fullName = fullName;
        this.phone = phone;
        this.enabled = enabled;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Boolean getEnabled() {
        return enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
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

    public Integer getOrderCount() {
        return orderCount;
    }

    public void setOrderCount(Integer orderCount) {
        this.orderCount = orderCount;
    }

    public Double getTotalSpent() {
        return totalSpent;
    }

    public void setTotalSpent(Double totalSpent) {
        this.totalSpent = totalSpent;
    }

    public List<AddressDTO> getAddresses() {
        return addresses;
    }

    public void setAddresses(List<AddressDTO> addresses) {
        this.addresses = addresses;
    }

    /**
     * AddressDTO - DTO phụ đại diện cho địa chỉ giao hàng trong sổ địa chỉ của khách hàng.
     */
    public static class AddressDTO {
        private Long id;
        private String receiverName;
        private String receiverPhone;
        private String addressDetail;
        private String wardName;
        private String districtName;
        private String provinceName;
        private Boolean isDefault;

        public AddressDTO() {
        }

        public AddressDTO(Long id, String receiverName, String receiverPhone, String addressDetail, String wardName, String districtName, String provinceName, Boolean isDefault) {
            this.id = id;
            this.receiverName = receiverName;
            this.receiverPhone = receiverPhone;
            this.addressDetail = addressDetail;
            this.wardName = wardName;
            this.districtName = districtName;
            this.provinceName = provinceName;
            this.isDefault = isDefault;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getReceiverName() {
            return receiverName;
        }

        public void setReceiverName(String receiverName) {
            this.receiverName = receiverName;
        }

        public String getReceiverPhone() {
            return receiverPhone;
        }

        public void setReceiverPhone(String receiverPhone) {
            this.receiverPhone = receiverPhone;
        }

        public String getAddressDetail() {
            return addressDetail;
        }

        public void setAddressDetail(String addressDetail) {
            this.addressDetail = addressDetail;
        }

        public String getWardName() {
            return wardName;
        }

        public void setWardName(String wardName) {
            this.wardName = wardName;
        }

        public String getDistrictName() {
            return districtName;
        }

        public void setDistrictName(String districtName) {
            this.districtName = districtName;
        }

        public String getProvinceName() {
            return provinceName;
        }

        public void setProvinceName(String provinceName) {
            this.provinceName = provinceName;
        }

        public Boolean getIsDefault() {
            return isDefault;
        }

        public void setIsDefault(Boolean isDefault) {
            this.isDefault = isDefault;
        }
    }
}
