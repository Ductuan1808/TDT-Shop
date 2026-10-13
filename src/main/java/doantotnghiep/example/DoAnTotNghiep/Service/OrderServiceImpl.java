package doantotnghiep.example.DoAnTotNghiep.Service;

import doantotnghiep.example.DoAnTotNghiep.DTO.OrderDTO;
import doantotnghiep.example.DoAnTotNghiep.DTO.OrderItemDTO;
import doantotnghiep.example.DoAnTotNghiep.Entity.Order_Items;
import doantotnghiep.example.DoAnTotNghiep.Entity.Orders;
import doantotnghiep.example.DoAnTotNghiep.MODEL.PageResponse;
import doantotnghiep.example.DoAnTotNghiep.Repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    /**
     * Chuyển đổi từ Entity Orders sang OrderDTO
     */
    private OrderDTO convertToDTO(Orders o) {
        if (o == null) {
            return null;
        }

        OrderDTO dto = new OrderDTO();
        dto.setId(o.getId());
        dto.setOrderCode(o.getOrderCode());

        if (o.getUser() != null) {
            dto.setUserId(o.getUser().getId());
            if (o.getUser().getFullName() != null && !o.getUser().getFullName().trim().isEmpty()) {
                dto.setCustomerName(o.getUser().getFullName());
            } else {
                dto.setCustomerName(o.getUser().getUsername());
            }
        }

        dto.setReceiverName(o.getReceiverName());
        dto.setReceiverPhone(o.getReceiverPhone());
        dto.setShippingAddress(o.getShippingAddress());
        dto.setSubtotal(o.getSubtotal());
        dto.setShippingFee(o.getShippingFee());
        dto.setTotalAmount(o.getTotalAmount());
        dto.setStatus(o.getStatus());
        dto.setCreatedAt(o.getCreatedAt());
        dto.setUpdatedAt(o.getUpdatedAt());

        if (o.getVoucher() != null) {
            dto.setVoucherId(o.getVoucher().getId());
        }
        dto.setDiscountAmount(o.getDiscountAmount());

        // Chuyển đổi danh sách món hàng trong đơn
        List<OrderItemDTO> itemDTOs = new ArrayList<>();
        List<Order_Items> items = o.getOrderItems();
        if (items != null) {
            for (int i = 0; i < items.size(); i++) {
                Order_Items item = items.get(i);
                if (item == null) {
                    continue;
                }
                OrderItemDTO itemDTO = new OrderItemDTO();
                itemDTO.setId(item.getId());
                itemDTO.setOrderId(o.getId());
                if (item.getProduct() != null) {
                    itemDTO.setProductId(item.getProduct().getId());
                    itemDTO.setProductName(item.getProduct().getName());
                    itemDTO.setSku(item.getProduct().getSku());
                }
                itemDTO.setQuantity(item.getQuantity());
                itemDTO.setUnitPrice(item.getUnitPrice());
                itemDTOs.add(itemDTO);
            }
        }
        dto.setItems(itemDTOs);

        return dto;
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<OrderDTO> getOrders(String keyword, String status, int page, int size) {
        List<Orders> allOrders = orderRepository.findAll();
        List<Orders> filtered = new ArrayList<>();

        String kw = "";
        if (keyword != null) {
            kw = keyword.trim().toLowerCase();
        }

        String st = "";
        if (status != null) {
            st = status.trim();
        }

        for (int i = 0; i < allOrders.size(); i++) {
            Orders o = allOrders.get(i);
            if (o == null) {
                continue;
            }

            // 1. Lọc theo trạng thái đơn hàng
            if (!st.isEmpty()) {
                String currentStatus = o.getStatus() != null ? o.getStatus().trim() : "";
                if (!currentStatus.equalsIgnoreCase(st)) {
                    continue;
                }
            }

            // 2. Lọc theo từ khóa tìm kiếm (Mã đơn, SĐT, Tên người nhận, Tên khách hàng)
            if (!kw.isEmpty()) {
                boolean match = false;
                if (o.getOrderCode() != null && o.getOrderCode().toLowerCase().contains(kw)) {
                    match = true;
                }
                if (o.getReceiverName() != null && o.getReceiverName().toLowerCase().contains(kw)) {
                    match = true;
                }
                if (o.getReceiverPhone() != null && o.getReceiverPhone().toLowerCase().contains(kw)) {
                    match = true;
                }
                if (o.getUser() != null) {
                    if (o.getUser().getFullName() != null && o.getUser().getFullName().toLowerCase().contains(kw)) {
                        match = true;
                    }
                    if (o.getUser().getUsername() != null && o.getUser().getUsername().toLowerCase().contains(kw)) {
                        match = true;
                    }
                }

                if (!match) {
                    continue;
                }
            }

            filtered.add(o);
        }

        // 3. Sắp xếp đơn hàng mới nhất lên đầu (ID giảm dần)
        if (filtered.size() > 1) {
            for (int i = 0; i < filtered.size() - 1; i++) {
                for (int j = i + 1; j < filtered.size(); j++) {
                    Orders o1 = filtered.get(i);
                    Orders o2 = filtered.get(j);

                    long id1 = o1.getId() != null ? o1.getId() : 0L;
                    long id2 = o2.getId() != null ? o2.getId() : 0L;

                    if (id1 < id2) {
                        filtered.set(i, o2);
                        filtered.set(j, o1);
                    }
                }
            }
        }

        // 4. Phân trang
        long totalElements = filtered.size();
        int currentPage = page;
        if (currentPage < 1) {
            currentPage = 1;
        }

        int pageSize = size;
        if (pageSize < 1) {
            pageSize = 10;
        }

        int startIndex = (currentPage - 1) * pageSize;
        int endIndex = startIndex + pageSize;
        if (endIndex > filtered.size()) {
            endIndex = filtered.size();
        }

        List<OrderDTO> dtos = new ArrayList<>();
        if (startIndex < filtered.size()) {
            for (int i = startIndex; i < endIndex; i++) {
                Orders o = filtered.get(i);
                dtos.add(convertToDTO(o));
            }
        }

        return new PageResponse<>(dtos, currentPage, pageSize, totalElements);
    }

    @Override
    @Transactional(readOnly = true)
    public OrderDTO getOrderById(Long id) {
        if (id == null) {
            return null;
        }
        Optional<Orders> opt = orderRepository.findById(id);
        if (opt.isPresent()) {
            return convertToDTO(opt.get());
        }
        return null;
    }

    @Override
    @Transactional(readOnly = true)
    public OrderDTO getOrderByCode(String orderCode) {
        if (orderCode == null || orderCode.trim().isEmpty()) {
            return null;
        }
        Optional<Orders> opt = orderRepository.findByOrderCode(orderCode.trim());
        if (opt.isPresent()) {
            return convertToDTO(opt.get());
        }
        return null;
    }

    @Override
    @Transactional
    public OrderDTO updateOrderStatus(Long id, String status) {
        if (id == null || status == null || status.trim().isEmpty()) {
            throw new IllegalArgumentException("Thông tin cập nhật trạng thái không hợp lệ");
        }

        String st = status.trim();
        List<String> validStatuses = getOrderStatuses();
        boolean isValid = false;
        for (int i = 0; i < validStatuses.size(); i++) {
            if (validStatuses.get(i).equalsIgnoreCase(st)) {
                st = validStatuses.get(i);
                isValid = true;
                break;
            }
        }

        if (!isValid) {
            throw new IllegalArgumentException("Trạng thái đơn hàng không hợp lệ: " + status);
        }

        Optional<Orders> opt = orderRepository.findById(id);
        if (!opt.isPresent()) {
            return null;
        }

        Orders o = opt.get();
        o.setStatus(st);
        o.setUpdatedAt(LocalDateTime.now());
        Orders saved = orderRepository.save(o);

        return convertToDTO(saved);
    }

    @Override
    public List<String> getOrderStatuses() {
        return Arrays.asList(
                "Chờ xác nhận",
                "Đang chuẩn bị hàng",
                "Đang giao hàng",
                "Đã giao hàng",
                "Đã hủy"
        );
    }
}
