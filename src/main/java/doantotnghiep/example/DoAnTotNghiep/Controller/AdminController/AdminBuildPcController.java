package doantotnghiep.example.DoAnTotNghiep.Controller.AdminController;

import doantotnghiep.example.DoAnTotNghiep.DTO.ComponentProductDTO;
import doantotnghiep.example.DoAnTotNghiep.DTO.PcBuildDTO;
import doantotnghiep.example.DoAnTotNghiep.MODEL.ApiResponse;
import doantotnghiep.example.DoAnTotNghiep.MODEL.PageResponse;
import doantotnghiep.example.DoAnTotNghiep.Service.PcBuildService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * AdminBuildPcController - REST Controller quản lý cấu hình PC Build và kiểm tra tính hợp lệ của linh kiện
 */
@RestController
@RequestMapping("/TDTapi/pc-builds")
@CrossOrigin(origins = "*")
public class AdminBuildPcController {

    @Autowired
    private PcBuildService pcBuildService;

    /**
     * Lấy danh sách dàn PC cấu hình sẵn có tìm kiếm, lọc trạng thái và phân trang
     */
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<PcBuildDTO>>> getPcBuilds(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PageResponse<PcBuildDTO> res = pcBuildService.getPcBuilds(keyword, status, page, size);
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy danh sách cấu hình PC thành công", res));
    }

    /**
     * Lấy thông tin chi tiết một dàn PC theo ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PcBuildDTO>> getPcBuildById(@PathVariable Long id) {
        PcBuildDTO dto = pcBuildService.getPcBuildById(id);
        if (dto == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, "Không tìm thấy cấu hình PC với ID: " + id, null));
        }
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy chi tiết cấu hình PC thành công", dto));
    }

    /**
     * Module kiểm tra tính hợp lệ và độ tương thích giữa 8 loại linh kiện và 1 phụ kiện màn hình
     * @param buildDTO chứa danh sách các linh kiện pc_build_components
     * @return ApiResponse trả về danh sách chi tiết các lỗi không tương thích
     */
    @PostMapping("/check-compatibility")
    public ResponseEntity<ApiResponse<List<String>>> checkCompatibility(
            @RequestBody PcBuildDTO buildDTO
    ) {
        List<String> errors = pcBuildService.checkCompatibility(buildDTO);
        boolean isCompatible = errors.isEmpty();
        String msg = isCompatible 
                ? "Tất cả linh kiện hoàn toàn tương thích để lắp ráp thành PC!" 
                : "Phát hiện sự không tương thích giữa các linh kiện đã chọn!";
        return ResponseEntity.ok(new ApiResponse<>(isCompatible, msg, errors));
    }

    /**
     * Thêm mới cấu hình PC (tự động kiểm tra tính tương thích trước khi lưu)
     */
    @PostMapping
    public ResponseEntity<ApiResponse<PcBuildDTO>> createPcBuild(@RequestBody PcBuildDTO buildDTO) {
        try {
            PcBuildDTO saved = pcBuildService.savePcBuild(buildDTO);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse<>(true, "Lưu cấu hình PC thành công!", saved));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, ex.getMessage(), null));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Lỗi hệ thống khi lưu cấu hình PC: " + ex.getMessage(), null));
        }
    }

    /**
     * Cập nhật cấu hình PC
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PcBuildDTO>> updatePcBuild(
            @PathVariable Long id,
            @RequestBody PcBuildDTO buildDTO
    ) {
        try {
            buildDTO.setId(id);
            PcBuildDTO saved = pcBuildService.savePcBuild(buildDTO);
            return ResponseEntity.ok(new ApiResponse<>(true, "Cập nhật cấu hình PC thành công!", saved));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, ex.getMessage(), null));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Lỗi khi cập nhật cấu hình PC: " + ex.getMessage(), null));
        }
    }

    /**
     * Chuyển đổi trạng thái hoạt động ACTIVE / INACTIVE của dàn PC
     */
    @PutMapping("/{id}/toggle-status")
    public ResponseEntity<ApiResponse<Boolean>> toggleStatus(@PathVariable Long id) {
        boolean success = pcBuildService.toggleStatus(id);
        if (success) {
            return ResponseEntity.ok(new ApiResponse<>(true, "Thay đổi trạng thái dàn PC thành công!", true));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse<>(false, "Không tìm thấy dàn PC để đổi trạng thái!", false));
    }

    /**
     * Lấy danh sách linh kiện theo loại: CPU, MAINBOARD, RAM, GPU, SSD, PSU, CASE, COOLER, MONITOR
     */
    @GetMapping("/components/{type}")
    public ResponseEntity<ApiResponse<List<ComponentProductDTO>>> getComponentsByType(@PathVariable String type) {
        List<ComponentProductDTO> list = pcBuildService.getComponentsByType(type);
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy danh sách linh kiện loại " + type + " thành công", list));
    }

    /**
     * Lấy danh sách sản phẩm PC đại diện (product_type = 'PC')
     */
    @GetMapping("/pc-products")
    public ResponseEntity<ApiResponse<List<ComponentProductDTO>>> getPcProducts() {
        List<ComponentProductDTO> list = pcBuildService.getPcProducts();
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy danh sách sản phẩm PC thành công", list));
    }
}
