package doantotnghiep.example.DoAnTotNghiep.Controller.AdminController;

import doantotnghiep.example.DoAnTotNghiep.DTO.VoucherDTO;
import doantotnghiep.example.DoAnTotNghiep.MODEL.ApiResponse;
import doantotnghiep.example.DoAnTotNghiep.MODEL.PageResponse;
import doantotnghiep.example.DoAnTotNghiep.Service.VoucherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/TDTapi/vouchers")
@CrossOrigin(origins = "*")
public class AdminVoucherController {

    @Autowired
    private VoucherService voucherService;

    /**
     * 1. Lấy danh sách voucher có phân trang, tìm kiếm theo mã/tên và lọc trạng thái
     */
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<VoucherDTO>>> getVouchers(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PageResponse<VoucherDTO> pageData = voucherService.getVouchers(keyword, status, page, size);
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy danh sách voucher thành công", pageData));
    }

    /**
     * 2. Lấy toàn bộ voucher (phục vụ chọn dropdown nếu cần)
     */
    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<VoucherDTO>>> getAllVouchers() {
        List<VoucherDTO> list = voucherService.getAllVouchers();
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy tất cả voucher thành công", list));
    }

    /**
     * 3. Lấy chi tiết voucher theo ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<VoucherDTO>> getVoucherById(@PathVariable Long id) {
        VoucherDTO voucher = voucherService.getVoucherById(id);
        if (voucher == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, "Không tìm thấy voucher ID: " + id, null));
        }
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy thông tin voucher thành công", voucher));
    }

    /**
     * 4. Thêm mới một voucher
     */
    @PostMapping
    public ResponseEntity<ApiResponse<VoucherDTO>> createVoucher(@RequestBody VoucherDTO dto) {
        if (dto == null) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Dữ liệu voucher không hợp lệ", null));
        }

        try {
            VoucherDTO created = voucherService.createVoucher(dto);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse<>(true, "Tạo voucher mới thành công", created));
        } catch (Exception e) {
            String msg = e.getMessage() != null ? e.getMessage() : "";
            if (msg.contains("Duplicate") || msg.contains("duplicate") || msg.contains("UNIQUE") || msg.contains("unique") || msg.contains("UQ_vouchers_code") || msg.contains("đã tồn tại")) {
                msg = "Không thể tạo vì đã tồn tại voucher trên";
            }
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, msg, null));
        }
    }

    /**
     * 5. Cập nhật thông tin voucher
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<VoucherDTO>> updateVoucher(
            @PathVariable Long id,
            @RequestBody VoucherDTO dto
    ) {
        if (dto == null) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Dữ liệu voucher không hợp lệ", null));
        }

        try {
            VoucherDTO updated = voucherService.updateVoucher(id, dto);
            if (updated == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse<>(false, "Không tìm thấy voucher ID: " + id, null));
            }
            return ResponseEntity.ok(new ApiResponse<>(true, "Cập nhật voucher thành công", updated));
        } catch (Exception e) {
            String msg = e.getMessage() != null ? e.getMessage() : "";
            if (msg.contains("Duplicate") || msg.contains("duplicate") || msg.contains("UNIQUE") || msg.contains("unique") || msg.contains("UQ_vouchers_code") || msg.contains("đã tồn tại")) {
                msg = "Không thể tạo vì đã tồn tại voucher trên";
            }
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, msg, null));
        }
    }

    /**
     * 6. Chuyển đổi trạng thái voucher (Ẩn <-> Hiện)
     */
    @PutMapping("/{id}/toggle-status")
    public ResponseEntity<ApiResponse<VoucherDTO>> toggleStatus(@PathVariable Long id) {
        VoucherDTO updated = voucherService.toggleVoucherStatus(id);
        if (updated == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, "Không tìm thấy voucher ID: " + id, null));
        }
        return ResponseEntity.ok(new ApiResponse<>(true, "Đổi trạng thái voucher thành công", updated));
    }
}
