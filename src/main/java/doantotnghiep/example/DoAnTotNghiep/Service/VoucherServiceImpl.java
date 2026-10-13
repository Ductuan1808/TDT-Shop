package doantotnghiep.example.DoAnTotNghiep.Service;

import doantotnghiep.example.DoAnTotNghiep.DTO.VoucherDTO;
import doantotnghiep.example.DoAnTotNghiep.Entity.Vouchers;
import doantotnghiep.example.DoAnTotNghiep.MODEL.PageResponse;
import doantotnghiep.example.DoAnTotNghiep.Repository.VoucherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class VoucherServiceImpl implements VoucherService {

    @Autowired
    private VoucherRepository voucherRepository;

    /**
     * Chuyển đổi từ Entity Vouchers sang VoucherDTO bằng cú pháp cơ bản
     */
    private VoucherDTO convertToDTO(Vouchers v) {
        if (v == null) {
            return null;
        }
        VoucherDTO dto = new VoucherDTO();
        dto.setId(v.getId());
        dto.setCode(v.getCode());
        dto.setName(v.getName());
        dto.setDiscountAmount(v.getDiscountAmount());
        dto.setMinOrderAmount(v.getMinOrderAmount());
        dto.setStartDate(v.getStartDate());
        dto.setEndDate(v.getEndDate());
        dto.setQuantity(v.getQuantity());
        dto.setStatus(v.getStatus());
        dto.setCreatedAt(v.getCreatedAt());
        return dto;
    }

    /**
     * Tìm vị trí xuất hiện của từ khóa trong mã hoặc tên voucher
     */
    private int getKeywordPosition(Vouchers v, String kw) {
        if (v == null || kw == null || kw.isEmpty()) {
            return 999999;
        }
        int posCode = 999999;
        int posName = 999999;

        if (v.getCode() != null) {
            int idx = v.getCode().toLowerCase().indexOf(kw);
            if (idx >= 0) {
                posCode = idx;
            }
        }

        if (v.getName() != null) {
            int idx = v.getName().toLowerCase().indexOf(kw);
            if (idx >= 0) {
                posName = idx;
            }
        }

        if (posCode < posName) {
            return posCode;
        }
        return posName;
    }

    @Override
    @Transactional(readOnly = true)
    public List<VoucherDTO> getAllVouchers() {
        List<Vouchers> list = voucherRepository.findAll();
        List<VoucherDTO> dtos = new ArrayList<>();
        for (int i = 0; i < list.size(); i++) {
            Vouchers v = list.get(i);
            dtos.add(convertToDTO(v));
        }
        return dtos;
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<VoucherDTO> getVouchers(String keyword, String status, int page, int size) {
        List<Vouchers> allList = voucherRepository.findAll();
        List<Vouchers> filtered = new ArrayList<>();

        String kw = "";
        if (keyword != null) {
            kw = keyword.trim().toLowerCase();
        }

        String st = "";
        if (status != null) {
            st = status.trim().toUpperCase();
        }

        for (int i = 0; i < allList.size(); i++) {
            Vouchers v = allList.get(i);
            if (v == null) {
                continue;
            }

            Boolean vStatus = v.getStatus() != null ? v.getStatus() : Boolean.TRUE;

            // 1. Lọc theo trạng thái
            if (!st.isEmpty()) {
                boolean matchStatus = false;
                if (st.equals("ACTIVE") || st.equals("TRUE") || st.equals("1") || st.equals("HOẠT ĐỘNG") || st.equals("HOAT DONG") || st.equals("ĐANG KÍCH HOẠT") || st.equals("DANG KICH HOAT")) {
                    matchStatus = Boolean.TRUE.equals(vStatus);
                } else if (st.equals("INACTIVE") || st.equals("FALSE") || st.equals("0") || st.equals("TẠM TẮT") || st.equals("TAM TAT") || st.equals("TẠM NGƯNG") || st.equals("TAM NGUNG") || st.equals("KHÓA") || st.equals("KHOA")) {
                    matchStatus = Boolean.FALSE.equals(vStatus);
                }

                if (!matchStatus) {
                    continue;
                }
            }

            // 2. Lọc theo từ khóa tìm kiếm (Mã code hoặc Tên voucher)
            if (!kw.isEmpty()) {
                boolean matchKeyword = false;
                if (v.getCode() != null && v.getCode().toLowerCase().contains(kw)) {
                    matchKeyword = true;
                }
                if (v.getName() != null && v.getName().toLowerCase().contains(kw)) {
                    matchKeyword = true;
                }

                if (!matchKeyword) {
                    continue;
                }
            }

            filtered.add(v);
        }

        // 3. Sắp xếp: Nếu có từ khóa thì sắp xếp theo vị trí xuất hiện của từ khóa; nếu không thì xếp ID giảm dần
        if (!kw.isEmpty() && filtered.size() > 1) {
            for (int i = 0; i < filtered.size() - 1; i++) {
                for (int j = i + 1; j < filtered.size(); j++) {
                    Vouchers v1 = filtered.get(i);
                    Vouchers v2 = filtered.get(j);

                    int pos1 = getKeywordPosition(v1, kw);
                    int pos2 = getKeywordPosition(v2, kw);

                    if (pos1 > pos2) {
                        filtered.set(i, v2);
                        filtered.set(j, v1);
                    }
                }
            }
        } else if (filtered.size() > 1) {
            // Sắp xếp ID giảm dần (mới nhất lên đầu)
            for (int i = 0; i < filtered.size() - 1; i++) {
                for (int j = i + 1; j < filtered.size(); j++) {
                    Vouchers v1 = filtered.get(i);
                    Vouchers v2 = filtered.get(j);

                    long id1 = v1.getId() != null ? v1.getId() : 0L;
                    long id2 = v2.getId() != null ? v2.getId() : 0L;

                    if (id1 < id2) {
                        filtered.set(i, v2);
                        filtered.set(j, v1);
                    }
                }
            }
        }

        // 4. Tính toán phân trang
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

        List<VoucherDTO> dtos = new ArrayList<>();
        if (startIndex < filtered.size()) {
            for (int i = startIndex; i < endIndex; i++) {
                Vouchers v = filtered.get(i);
                dtos.add(convertToDTO(v));
            }
        }

        return new PageResponse<>(dtos, currentPage, pageSize, totalElements);
    }

    @Override
    @Transactional(readOnly = true)
    public VoucherDTO getVoucherById(Long id) {
        if (id == null) {
            return null;
        }
        Optional<Vouchers> opt = voucherRepository.findById(id);
        if (opt.isPresent()) {
            return convertToDTO(opt.get());
        }
        return null;
    }

    @Override
    @Transactional
    public VoucherDTO createVoucher(VoucherDTO dto) {
        if (dto == null) {
            throw new IllegalArgumentException("Dữ liệu voucher không hợp lệ");
        }

        // Kiểm tra mã voucher
        String code = dto.getCode();
        if (code == null || code.trim().isEmpty()) {
            throw new IllegalArgumentException("Mã voucher không được để trống");
        }
        code = code.trim().toUpperCase();

        // Kiểm tra tên voucher
        String name = dto.getName();
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Tên chương trình voucher không được để trống");
        }
        name = name.trim();

        // Kiểm tra mức giảm giá > 0
        BigDecimal discount = dto.getDiscountAmount();
        if (discount == null || discount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Mức giảm giá phải lớn hơn 0");
        }

        // Kiểm tra đơn tối thiểu >= 0
        BigDecimal minOrder = dto.getMinOrderAmount();
        if (minOrder == null || minOrder.compareTo(BigDecimal.ZERO) < 0) {
            minOrder = BigDecimal.ZERO;
        }

        // Kiểm tra ngày bắt đầu và kết thúc
        LocalDateTime startDate = dto.getStartDate();
        LocalDateTime endDate = dto.getEndDate();
        if (startDate == null || endDate == null) {
            throw new IllegalArgumentException("Vui lòng chọn ngày bắt đầu và ngày kết thúc");
        }
        if (!endDate.isAfter(startDate)) {
            throw new IllegalArgumentException("Ngày kết thúc phải lớn hơn ngày bắt đầu");
        }

        // Kiểm tra số lượng
        Integer qty = dto.getQuantity();
        if (qty == null || qty < 0) {
            qty = 0;
        }

        // Kiểm tra trùng mã voucher
        Optional<Vouchers> existing = voucherRepository.findByCode(code);
        if (existing.isPresent()) {
            throw new IllegalArgumentException("Không thể tạo vì đã tồn tại voucher trên");
        }

        Vouchers v = new Vouchers();
        v.setCode(code);
        v.setName(name);
        v.setDiscountAmount(discount);
        v.setMinOrderAmount(minOrder);
        v.setStartDate(startDate);
        v.setEndDate(endDate);
        v.setQuantity(qty);
        v.setStatus(dto.getStatus() != null ? dto.getStatus() : Boolean.TRUE);
        v.setCreatedAt(LocalDateTime.now());

        Vouchers saved = voucherRepository.save(v);
        return convertToDTO(saved);
    }

    @Override
    @Transactional
    public VoucherDTO updateVoucher(Long id, VoucherDTO dto) {
        if (id == null || dto == null) {
            throw new IllegalArgumentException("Dữ liệu voucher không hợp lệ");
        }

        Optional<Vouchers> opt = voucherRepository.findById(id);
        if (!opt.isPresent()) {
            return null;
        }
        Vouchers v = opt.get();

        // Kiểm tra mã voucher
        String code = dto.getCode();
        if (code == null || code.trim().isEmpty()) {
            throw new IllegalArgumentException("Mã voucher không được để trống");
        }
        code = code.trim().toUpperCase();

        // Kiểm tra tên voucher
        String name = dto.getName();
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Tên chương trình voucher không được để trống");
        }
        name = name.trim();

        // Kiểm tra mức giảm giá > 0
        BigDecimal discount = dto.getDiscountAmount();
        if (discount == null || discount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Mức giảm giá phải lớn hơn 0");
        }

        // Kiểm tra đơn tối thiểu >= 0
        BigDecimal minOrder = dto.getMinOrderAmount();
        if (minOrder == null || minOrder.compareTo(BigDecimal.ZERO) < 0) {
            minOrder = BigDecimal.ZERO;
        }

        // Kiểm tra ngày bắt đầu và kết thúc
        LocalDateTime startDate = dto.getStartDate();
        LocalDateTime endDate = dto.getEndDate();
        if (startDate == null || endDate == null) {
            throw new IllegalArgumentException("Vui lòng chọn ngày bắt đầu và ngày kết thúc");
        }
        if (!endDate.isAfter(startDate)) {
            throw new IllegalArgumentException("Ngày kết thúc phải lớn hơn ngày bắt đầu");
        }

        // Kiểm tra số lượng
        Integer qty = dto.getQuantity();
        if (qty == null || qty < 0) {
            qty = 0;
        }

        // Kiểm tra trùng mã với voucher khác
        Optional<Vouchers> existing = voucherRepository.findByCode(code);
        if (existing.isPresent() && !existing.get().getId().equals(id)) {
            throw new IllegalArgumentException("Không thể tạo vì đã tồn tại voucher trên");
        }

        v.setCode(code);
        v.setName(name);
        v.setDiscountAmount(discount);
        v.setMinOrderAmount(minOrder);
        v.setStartDate(startDate);
        v.setEndDate(endDate);
        v.setQuantity(qty);
        if (dto.getStatus() != null) {
            v.setStatus(dto.getStatus());
        }

        Vouchers saved = voucherRepository.save(v);
        return convertToDTO(saved);
    }

    @Override
    @Transactional
    public VoucherDTO toggleVoucherStatus(Long id) {
        if (id == null) {
            return null;
        }
        Optional<Vouchers> opt = voucherRepository.findById(id);
        if (!opt.isPresent()) {
            return null;
        }
        Vouchers v = opt.get();
        boolean currentStatus = v.getStatus() != null ? v.getStatus() : false;
        v.setStatus(!currentStatus);
        Vouchers saved = voucherRepository.save(v);
        return convertToDTO(saved);
    }
}
