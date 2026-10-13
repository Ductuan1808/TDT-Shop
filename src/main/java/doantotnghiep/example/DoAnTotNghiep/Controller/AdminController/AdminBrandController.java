package doantotnghiep.example.DoAnTotNghiep.Controller.AdminController;

import doantotnghiep.example.DoAnTotNghiep.DTO.BrandDTO;
import doantotnghiep.example.DoAnTotNghiep.MODEL.ApiResponse;
import doantotnghiep.example.DoAnTotNghiep.MODEL.PageResponse;
import doantotnghiep.example.DoAnTotNghiep.Service.BrandService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/TDTapi/brands")
@CrossOrigin(origins = "*")
public class AdminBrandController {

    @Autowired
    private BrandService brandService;

    /**
     * 1. Lấy danh sách thương hiệu có phân trang, tìm kiếm theo tên và lọc theo trạng thái
     */
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<BrandDTO>>> getBrands(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PageResponse<BrandDTO> brands = brandService.getBrands(keyword, status, page, size);
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy danh sách thương hiệu thành công", brands));
    }

    /**
     * 2. Lấy toàn bộ thương hiệu (phục vụ các ô chọn dropdown)
     */
    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<BrandDTO>>> getAllBrands() {
        List<BrandDTO> list = brandService.getAllBrands();
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy tất cả thương hiệu thành công", list));
    }

    /**
     * 3. Lấy chi tiết thương hiệu theo ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BrandDTO>> getBrandById(@PathVariable Long id) {
        BrandDTO brand = brandService.getBrandById(id);
        if (brand == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, "Không tìm thấy thương hiệu ID: " + id, null));
        }
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy thông tin thương hiệu thành công", brand));
    }

    /**
     * 4. Thêm mới một thương hiệu
     */
    @PostMapping
    public ResponseEntity<ApiResponse<BrandDTO>> createBrand(@RequestBody BrandDTO dto) {
        if (dto == null || dto.getName() == null || dto.getName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Tên thương hiệu không được để trống", null));
        }

        try {
            BrandDTO created = brandService.createBrand(dto);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse<>(true, "Thêm mới thương hiệu thành công", created));
        } catch (Exception e) {
            String msg = e.getMessage() != null ? e.getMessage() : "";
            if (msg.contains("Duplicate") || msg.contains("duplicate") || msg.contains("UNIQUE") || msg.contains("unique") || msg.contains("đã tồn tại")) {
                msg = "Không thể tạo vì đã tồn tại thương hiệu trên";
            }
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, msg, null));
        }
    }

    /**
     * 5. Cập nhật thông tin thương hiệu
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<BrandDTO>> updateBrand(
            @PathVariable Long id,
            @RequestBody BrandDTO dto
    ) {
        if (dto == null || dto.getName() == null || dto.getName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Tên thương hiệu không được để trống", null));
        }

        try {
            BrandDTO updated = brandService.updateBrand(id, dto);
            if (updated == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse<>(false, "Không tìm thấy thương hiệu ID: " + id, null));
            }
            return ResponseEntity.ok(new ApiResponse<>(true, "Cập nhật thương hiệu thành công", updated));
        } catch (Exception e) {
            String msg = e.getMessage() != null ? e.getMessage() : "";
            if (msg.contains("Duplicate") || msg.contains("duplicate") || msg.contains("UNIQUE") || msg.contains("unique") || msg.contains("đã tồn tại")) {
                msg = "Không thể tạo vì đã tồn tại thương hiệu trên";
            }
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, msg, null));
        }
    }

    /**
     * 6. Cập nhật trạng thái thương hiệu (ACTIVE / INACTIVE)
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<BrandDTO>> updateBrandStatus(
            @PathVariable Long id,
            @RequestParam String status
    ) {
        BrandDTO updated = brandService.updateBrandStatus(id, status);
        if (updated == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, "Không tìm thấy thương hiệu ID: " + id, null));
        }
        return ResponseEntity.ok(new ApiResponse<>(true, "Cập nhật trạng thái thương hiệu thành công", updated));
    }

    /**
     * 7. Xóa thương hiệu
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBrand(@PathVariable Long id) {
        try {
            brandService.deleteBrand(id);
            return ResponseEntity.ok(new ApiResponse<>(true, "Xóa thương hiệu thành công", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Không thể xóa thương hiệu (có thể đang có sản phẩm liên kết): " + e.getMessage(), null));
        }
    }
}
