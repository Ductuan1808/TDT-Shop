package doantotnghiep.example.DoAnTotNghiep.DTO;

public class UserRoleDTO {
    private Long userId;
    private Long roleId;
    private String username;
    private String roleName;

    public UserRoleDTO() {
    }

    public UserRoleDTO(Long userId, Long roleId) {
        this.userId = userId;
        this.roleId = roleId;
    }

    public UserRoleDTO(Long userId, Long roleId, String username, String roleName) {
        this.userId = userId;
        this.roleId = roleId;
        this.username = username;
        this.roleName = roleName;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getUser_id() {
        return userId;
    }

    public void setUser_id(Long userId) {
        this.userId = userId;
    }

    public Long getRoleId() {
        return roleId;
    }

    public void setRoleId(Long roleId) {
        this.roleId = roleId;
    }

    public Long getRole_id() {
        return roleId;
    }

    public void setRole_id(Long roleId) {
        this.roleId = roleId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }
}
