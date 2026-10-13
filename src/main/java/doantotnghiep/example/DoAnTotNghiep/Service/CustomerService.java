package doantotnghiep.example.DoAnTotNghiep.Service;

import doantotnghiep.example.DoAnTotNghiep.DTO.CustomerDTO;
import doantotnghiep.example.DoAnTotNghiep.MODEL.PageResponse;

import java.util.List;

public interface CustomerService {

    PageResponse<CustomerDTO> getCustomers(String keyword, Boolean enabled, int page, int size);

    CustomerDTO getCustomerById(Long id);

    CustomerDTO updateCustomerStatus(Long id, boolean enabled);
}
