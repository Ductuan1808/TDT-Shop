package doantotnghiep.example.DoAnTotNghiep.Controller.AdminController;

import doantotnghiep.example.DoAnTotNghiep.DTO.CategoryDTO;
import doantotnghiep.example.DoAnTotNghiep.MODEL.ApiResponse;
import doantotnghiep.example.DoAnTotNghiep.MODEL.PageResponse;
import doantotnghiep.example.DoAnTotNghiep.Service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/TDTapi/categories")
@CrossOrigin(origins = "*")
public class AdminCategoryController {

    @Autowired
    private CategoryService categoryService;

    /**
     * 1. Lấy danh sách danh mục có phân trang, tìm kiếm và lọc
     */
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<CategoryDTO>>> getCategories(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String parentType,
            @RequestParam(required = false) Long parentId,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PageResponse<CategoryDTO> data = categoryService.getCategories(keyword, parentType, parentId, status, page, size);
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy danh sách danh mục thành công", data));
    }

    /**
     * 2. Lấy danh sách danh mục cha (phục vụ dropdown chọn danh mục cha - CHỈ LẤY CHA, KHÔNG LẤY CON)
     */
    @GetMapping("/parents")
    public ResponseEntity<ApiResponse<List<CategoryDTO>>> getParentCategories() {
        List<CategoryDTO> list = categoryService.getParentCategories();
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy danh sách danh mục cha thành công", list));
    }


    /**
     * 4. Lấy chi tiết danh mục theo ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryDTO>> getCategoryById(@PathVariable Long id) {
        CategoryDTO cat = categoryService.getCategoryById(id);
        if (cat == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, "Không tìm thấy danh mục ID: " + id, null));
        }
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy thông tin danh mục thành công", cat));
    }

    /**
     * 5. Thêm mới danh mục
     */
    @PostMapping
    public ResponseEntity<ApiResponse<CategoryDTO>> createCategory(@RequestBody CategoryDTO dto) {
        if (dto == null || dto.getName() == null || dto.getName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Tên danh mục không được để trống", null));
        }

        try {
            CategoryDTO created = categoryService.createCategory(dto);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse<>(true, "Thêm mới danh mục thành công", created));
        } catch (Exception e) {
            String msg = e.getMessage() != null ? e.getMessage() : "";
            if (msg.contains("Duplicate") || msg.contains("duplicate") || msg.contains("UNIQUE") || msg.contains("unique") || msg.contains("đã tồn tại")) {
                msg = "Không thể tạo vì đã tồn tại danh mục trên";
            }
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, msg, null));
        }
    }

    /**
     * 6. Cập nhật danh mục
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryDTO>> updateCategory(
            @PathVariable Long id,
            @RequestBody CategoryDTO dto
    ) {
        if (dto == null || dto.getName() == null || dto.getName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Tên danh mục không được để trống", null));
        }

        try {
            CategoryDTO updated = categoryService.updateCategory(id, dto);
            if (updated == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse<>(false, "Không tìm thấy danh mục ID: " + id, null));
            }
            return ResponseEntity.ok(new ApiResponse<>(true, "Cập nhật danh mục thành công", updated));
        } catch (Exception e) {
            String msg = e.getMessage() != null ? e.getMessage() : "";
            if (msg.contains("Duplicate") || msg.contains("duplicate") || msg.contains("UNIQUE") || msg.contains("unique") || msg.contains("đã tồn tại")) {
                msg = "Không thể tạo vì đã tồn tại danh mục trên";
            }
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, msg, null));
        }
    }

    /**
     * 7. Cập nhật trạng thái ẩn/hiện danh mục (ACTIVE / INACTIVE)
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<CategoryDTO>> updateCategoryStatus(
            @PathVariable Long id,
            @RequestParam String status
    ) {
        CategoryDTO updated = categoryService.updateCategoryStatus(id, status);
        if (updated == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, "Không tìm thấy danh mục ID: " + id, null));
        }
        return ResponseEntity.ok(new ApiResponse<>(true, "Cập nhật trạng thái danh mục thành công", updated));
    }

    /**
     * 8. Bật/tắt hiển thị Trang chủ (show_on_home)
     */
    @PutMapping("/{id}/toggle-home")
    public ResponseEntity<ApiResponse<CategoryDTO>> toggleShowOnHome(@PathVariable Long id) {
        try {
            CategoryDTO updated = categoryService.toggleShowOnHome(id);
            if (updated == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse<>(false, "Không tìm thấy danh mục ID: " + id, null));
            }
            return ResponseEntity.ok(new ApiResponse<>(true, "Cập nhật hiển thị trang chủ thành công", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    /**
     * 9. Bật/tắt hiển thị Menu (show_on_menu)
     */
    @PutMapping("/{id}/toggle-menu")
    public ResponseEntity<ApiResponse<CategoryDTO>> toggleShowOnMenu(@PathVariable Long id) {
        try {
            CategoryDTO updated = categoryService.toggleShowOnMenu(id);
            if (updated == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse<>(false, "Không tìm thấy danh mục ID: " + id, null));
            }
            return ResponseEntity.ok(new ApiResponse<>(true, "Cập nhật hiển thị menu thành công", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
}
