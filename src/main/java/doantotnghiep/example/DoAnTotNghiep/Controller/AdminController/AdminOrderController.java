package doantotnghiep.example.DoAnTotNghiep.Controller.AdminController;

import doantotnghiep.example.DoAnTotNghiep.DTO.OrderDTO;
import doantotnghiep.example.DoAnTotNghiep.MODEL.ApiResponse;
import doantotnghiep.example.DoAnTotNghiep.MODEL.PageResponse;
import doantotnghiep.example.DoAnTotNghiep.Service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/TDTapi/orders")
@CrossOrigin(origins = "*")
public class AdminOrderController {

    @Autowired
    private OrderService orderService;

    /**
     * 1. Lấy danh sách đơn hàng có phân trang, tìm kiếm và lọc trạng thái
     */
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<OrderDTO>>> getOrders(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PageResponse<OrderDTO> orders = orderService.getOrders(keyword, status, page, size);
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy danh sách đơn hàng thành công", orders));
    }

    /**
     * 2. Lấy danh sách toàn bộ các trạng thái đơn hàng hợp lệ
     */
    @GetMapping("/statuses")
    public ResponseEntity<ApiResponse<List<String>>> getOrderStatuses() {
        List<String> statuses = orderService.getOrderStatuses();
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy danh sách trạng thái thành công", statuses));
    }

    /**
     * 3. Lấy chi tiết đơn hàng theo ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderDTO>> getOrderById(@PathVariable Long id) {
        OrderDTO order = orderService.getOrderById(id);
        if (order == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, "Không tìm thấy đơn hàng ID: " + id, null));
        }
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy chi tiết đơn hàng thành công", order));
    }

    /**
     * 4. Lấy chi tiết đơn hàng theo mã đơn (orderCode)
     */
    @GetMapping("/code/{orderCode}")
    public ResponseEntity<ApiResponse<OrderDTO>> getOrderByCode(@PathVariable String orderCode) {
        OrderDTO order = orderService.getOrderByCode(orderCode);
        if (order == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, "Không tìm thấy đơn hàng mã: " + orderCode, null));
        }
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy chi tiết đơn hàng thành công", order));
    }

    /**
     * 5. Cập nhật trạng thái đơn hàng
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<OrderDTO>> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam(required = false) String status,
            @RequestBody(required = false) java.util.Map<String, String> body
    ) {
        String st = status;
        if ((st == null || st.trim().isEmpty()) && body != null) {
            st = body.get("status");
        }

        try {
            OrderDTO updated = orderService.updateOrderStatus(id, st);
            if (updated == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse<>(false, "Không tìm thấy đơn hàng ID: " + id, null));
            }
            return ResponseEntity.ok(new ApiResponse<>(true, "Cập nhật trạng thái đơn hàng thành công", updated));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Lỗi khi cập nhật trạng thái đơn hàng: " + e.getMessage(), null));
        }
    }
}
