package doantotnghiep.example.DoAnTotNghiep.Service;

import doantotnghiep.example.DoAnTotNghiep.DTO.ComponentProductDTO;
import doantotnghiep.example.DoAnTotNghiep.DTO.PcBuildDTO;
import doantotnghiep.example.DoAnTotNghiep.MODEL.PageResponse;

import java.util.List;

/**
 * PcBuildService - Quản lý cấu hình Build PC và kiểm tra tương thích phần cứng
 */
public interface PcBuildService {

    /**
     * Module kiểm tra tính hợp lệ và độ tương thích phần cứng
     * @param buildDTO Chứa danh sách linh kiện pc_build_components
     * @return Danh sách lỗi chi tiết (rỗng nếu hoàn toàn tương thích)
     */
    List<String> checkCompatibility(PcBuildDTO buildDTO);

    /**
     * Lấy danh sách dàn PC cấu hình sẵn có tìm kiếm, lọc trạng thái và phân trang
     */
    PageResponse<PcBuildDTO> getPcBuilds(String keyword, String status, int page, int size);

    /**
     * Lấy chi tiết một cấu hình dàn PC bao gồm cả 8 linh kiện và màn hình
     */
    PcBuildDTO getPcBuildById(Long id);

    /**
     * Thêm mới hoặc cập nhật cấu hình PC (sử dụng PcBuildDTO và pc_build_components)
     */
    PcBuildDTO savePcBuild(PcBuildDTO buildDTO);

    /**
     * Bật/tắt trạng thái ACTIVE / INACTIVE của dàn PC
     */
    boolean toggleStatus(Long id);

    /**
     * Lấy danh sách linh kiện theo từng loại để nạp vào dropdown chọn linh kiện
     */
    List<ComponentProductDTO> getComponentsByType(String componentType);

    /**
     * Lấy danh sách sản phẩm PC đại diện (product_type = 'PC')
     */
    List<ComponentProductDTO> getPcProducts();
}
