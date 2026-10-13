package doantotnghiep.example.DoAnTotNghiep.Service;

import doantotnghiep.example.DoAnTotNghiep.DTO.OrderDTO;
import doantotnghiep.example.DoAnTotNghiep.MODEL.PageResponse;

import java.util.List;

public interface OrderService {

    PageResponse<OrderDTO> getOrders(String keyword, String status, int page, int size);

    OrderDTO getOrderById(Long id);

    OrderDTO getOrderByCode(String orderCode);

    OrderDTO updateOrderStatus(Long id, String status);

    List<String> getOrderStatuses();
}
