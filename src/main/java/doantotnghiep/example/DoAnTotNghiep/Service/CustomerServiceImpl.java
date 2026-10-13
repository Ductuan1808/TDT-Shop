package doantotnghiep.example.DoAnTotNghiep.Service;

import doantotnghiep.example.DoAnTotNghiep.DTO.CustomerDTO;
import doantotnghiep.example.DoAnTotNghiep.Entity.Users;
import doantotnghiep.example.DoAnTotNghiep.MODEL.PageResponse;
import doantotnghiep.example.DoAnTotNghiep.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CustomerServiceImpl implements CustomerService {

    @Autowired
    private UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public PageResponse<CustomerDTO> getCustomers(String keyword, Boolean enabled, int page, int size) {
        List<Users> allUsers = userRepository.findAll();
        List<Users> filteredUsers = new ArrayList<>();

        String kw = "";
        if (keyword != null) {
            kw = keyword.trim().toLowerCase();
        }

        for (int i = 0; i < allUsers.size(); i++) {
            Users u = allUsers.get(i);
            if (u == null) {
                continue;
            }

            // Lọc theo trạng thái tài khoản (enabled: true = hoạt động, false = đã khóa)
            if (enabled != null) {
                if (u.isEnabled() != enabled.booleanValue()) {
                    continue;
                }
            }

            // Lọc theo từ khóa tìm kiếm (username, họ và tên, email, số điện thoại)
            if (!kw.isEmpty()) {
                boolean match = false;
                if (u.getUsername() != null && u.getUsername().toLowerCase().contains(kw)) {
                    match = true;
                } else if (u.getFullName() != null && u.getFullName().toLowerCase().contains(kw)) {
                    match = true;
                } else if (u.getEmail() != null && u.getEmail().toLowerCase().contains(kw)) {
                    match = true;
                } else if (u.getPhone() != null && u.getPhone().toLowerCase().contains(kw)) {
                    match = true;
                }

                if (!match) {
                    continue;
                }
            }

            filteredUsers.add(u);
        }

        // Tính toán phân trang đơn giản
        long totalElements = filteredUsers.size();
        int currentPage = page;
        if (currentPage < 1) {
            currentPage = 1;
        }

        int pageSize = size;
        if (pageSize < 1) {
            pageSize = 15;
        }

        int startIndex = (currentPage - 1) * pageSize;
        int endIndex = startIndex + pageSize;
        if (endIndex > filteredUsers.size()) {
            endIndex = filteredUsers.size();
        }

        List<CustomerDTO> dtoList = new ArrayList<>();
        if (startIndex < filteredUsers.size()) {
            for (int i = startIndex; i < endIndex; i++) {
                Users u = filteredUsers.get(i);
                CustomerDTO dto = convertToDTO(u);
                dtoList.add(dto);
            }
        }

        return new PageResponse<>(dtoList, currentPage, pageSize, totalElements);
    }

    @Override
    @Transactional(readOnly = true)
    public CustomerDTO getCustomerById(Long id) {
        if (id == null) {
            return null;
        }
        Optional<Users> optionalUser = userRepository.findById(id);
        if (!optionalUser.isPresent()) {
            return null;
        }
        Users u = optionalUser.get();
        return convertToDTO(u);
    }

    @Override
    @Transactional
    public CustomerDTO updateCustomerStatus(Long id, boolean enabled) {
        if (id == null) {
            return null;
        }
        Optional<Users> optionalUser = userRepository.findById(id);
        if (!optionalUser.isPresent()) {
            return null;
        }
        Users u = optionalUser.get();
        u.setEnabled(enabled);
        u.setUpdated_at(LocalDateTime.now());
        Users saved = userRepository.save(u);
        return convertToDTO(saved);
    }

    /**
     * Chuyển đổi từ Users sang CustomerDTO chỉ gồm thông tin tài khoản, không liên quan đến địa chỉ
     */
    private CustomerDTO convertToDTO(Users u) {
        if (u == null) {
            return null;
        }
        CustomerDTO dto = new CustomerDTO();
        dto.setId(u.getId());
        dto.setUsername(u.getUsername());
        dto.setEmail(u.getEmail());
        dto.setFullName(u.getFullName());
        dto.setPhone(u.getPhone());
        dto.setEnabled(u.isEnabled());
        dto.setCreatedAt(u.getCreated_at());
        dto.setUpdatedAt(u.getUpdated_at());
        return dto;
    }
}
