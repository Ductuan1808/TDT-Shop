package doantotnghiep.example.DoAnTotNghiep.Controller.AdminController;

import doantotnghiep.example.DoAnTotNghiep.DTO.CustomerDTO;
import doantotnghiep.example.DoAnTotNghiep.MODEL.ApiResponse;
import doantotnghiep.example.DoAnTotNghiep.MODEL.PageResponse;
import doantotnghiep.example.DoAnTotNghiep.Service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/TDTapi/customers")
@CrossOrigin(origins = "*")
public class AdminCustomerController {

    @Autowired
    private CustomerService customerService;

    /**
     * 1. Lấy danh sách tài khoản khách hàng: Tìm kiếm (username, họ tên, email, sđt), lọc trạng thái và phân trang
     */
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<CustomerDTO>>> getCustomers(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Boolean enabled,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "15") int size
    ) {
        PageResponse<CustomerDTO> customers = customerService.getCustomers(keyword, enabled, page, size);
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy danh sách khách hàng thành công", customers));
    }

    /**
     * 2. Lấy thông tin chi tiết một tài khoản khách hàng theo ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CustomerDTO>> getCustomerById(@PathVariable Long id) {
        CustomerDTO customer = customerService.getCustomerById(id);
        if (customer == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, "Không tìm thấy khách hàng có ID: " + id, null));
        }
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy thông tin chi tiết khách hàng thành công", customer));
    }

    /**
     * 3. Khóa hoặc mở khóa tài khoản khách hàng
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<CustomerDTO>> updateCustomerStatus(
            @PathVariable Long id,
            @RequestParam boolean enabled
    ) {
        CustomerDTO updated = customerService.updateCustomerStatus(id, enabled);
        if (updated == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, "Không tìm thấy khách hàng có ID: " + id, null));
        }
        String msg = enabled ? "Mở khóa tài khoản khách hàng thành công" : "Khóa tài khoản khách hàng thành công";
        return ResponseEntity.ok(new ApiResponse<>(true, msg, updated));
    }
}
