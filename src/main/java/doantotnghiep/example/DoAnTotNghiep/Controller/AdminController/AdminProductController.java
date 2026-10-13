package doantotnghiep.example.DoAnTotNghiep.Controller.AdminController;

import doantotnghiep.example.DoAnTotNghiep.DTO.BrandDTO;
import doantotnghiep.example.DoAnTotNghiep.DTO.CategoryDTO;
import doantotnghiep.example.DoAnTotNghiep.DTO.ProductDTO;
import doantotnghiep.example.DoAnTotNghiep.MODEL.ApiResponse;
import doantotnghiep.example.DoAnTotNghiep.MODEL.PageResponse;
import doantotnghiep.example.DoAnTotNghiep.Service.BrandService;
import doantotnghiep.example.DoAnTotNghiep.Service.CategoryService;
import doantotnghiep.example.DoAnTotNghiep.Service.ProductService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/TDTapi/products")
@CrossOrigin(origins = "*")
public class AdminProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private BrandService brandService;

    @Autowired
    private CategoryService categoryService;

    /**
     * Lấy danh sách sản phẩm: Tìm kiếm, 3 bộ lọc và phân trang (mỗi trang tối đa 15 sản phẩm)
     */
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<ProductDTO>>> getProducts(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String productType,
            @RequestParam(required = false) Long brandId,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "15") int size
    ) {
        PageResponse<ProductDTO> products = productService.searchAndFilterProducts(keyword, productType, brandId, status, page, size);
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy danh sách sản phẩm thành công", products));
    }

    /**
     * Lấy danh sách thương hiệu phục vụ cho màn sản phẩm
     */
    @GetMapping("/brands")
    public ResponseEntity<ApiResponse<List<BrandDTO>>> getBrandsForProduct() {
        List<BrandDTO> brands = brandService.getAllBrands();
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy danh sách thương hiệu thành công", brands));
    }

    /**
     * Lấy danh sách thể loại cha (PC, Linh kiện, Phụ kiện) từ DB - CHỈ gửi các category cha, không gửi con
     */
    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<CategoryDTO>>> getParentCategoriesForProduct() {
        List<CategoryDTO> parentCategories = categoryService.getParentCategories();
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy danh sách thể loại cha thành công", parentCategories));
    }

    /**
     * Lấy thông tin chi tiết một sản phẩm theo ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductDTO>> getProductById(@PathVariable Long id) {
        ProductDTO product = productService.getProductById(id);
        if (product == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, "Không tìm thấy sản phẩm có ID: " + id, null));
        }
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy thông tin sản phẩm thành công", product));
    }

    /**
     * Thêm mới một sản phẩm
     */
    @PostMapping
    public ResponseEntity<ApiResponse<ProductDTO>> createProduct(
            @Valid @RequestBody ProductDTO dto,
            BindingResult bindingResult
    ) {
        if (bindingResult.hasErrors()) {
            String errorMessage = bindingResult.getFieldErrors().stream()
                    .map(FieldError::getDefaultMessage)
                    .distinct()
                    .collect(Collectors.joining("; "));
            if (errorMessage == null || errorMessage.trim().isEmpty()) {
                errorMessage = bindingResult.getAllErrors().get(0).getDefaultMessage();
            }
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, errorMessage, null));
        }

        if (("COMPONENT".equalsIgnoreCase(dto.getProductType()) || "ACCESSORY".equalsIgnoreCase(dto.getProductType()))
                && dto.getBrandId() == null) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Vui lòng chọn Thương hiệu cho linh kiện hoặc phụ kiện", null));
        }

        try {
            ProductDTO created = productService.createProduct(dto);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse<>(true, "Thêm mới sản phẩm thành công", created));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Lỗi khi tạo sản phẩm: " + e.getMessage(), null));
        }
    }

    /**
     * Cập nhật thông tin sản phẩm
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductDTO>> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductDTO dto,
            BindingResult bindingResult
    ) {
        if (bindingResult.hasErrors()) {
            String errorMessage = bindingResult.getFieldErrors().stream()
                    .map(FieldError::getDefaultMessage)
                    .distinct()
                    .collect(Collectors.joining("; "));
            if (errorMessage == null || errorMessage.trim().isEmpty()) {
                errorMessage = bindingResult.getAllErrors().get(0).getDefaultMessage();
            }
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, errorMessage, null));
        }

        if (("COMPONENT".equalsIgnoreCase(dto.getProductType()) || "ACCESSORY".equalsIgnoreCase(dto.getProductType()))
                && dto.getBrandId() == null) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Vui lòng chọn Thương hiệu cho linh kiện hoặc phụ kiện", null));
        }

        try {
            ProductDTO updated = productService.updateProduct(id, dto);
            return ResponseEntity.ok(new ApiResponse<>(true, "Cập nhật sản phẩm thành công", updated));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Lỗi khi cập nhật sản phẩm: " + e.getMessage(), null));
        }
    }

    /**
     * Xóa sản phẩm theo ID
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Long id) {
        try {
            productService.deleteProduct(id);
            return ResponseEntity.ok(new ApiResponse<>(true, "Xóa sản phẩm thành công", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Lỗi khi xóa sản phẩm: " + e.getMessage(), null));
        }
    }
}
