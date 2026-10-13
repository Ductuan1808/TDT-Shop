package doantotnghiep.example.DoAnTotNghiep.Service;

import doantotnghiep.example.DoAnTotNghiep.DTO.ComponentProductDTO;
import doantotnghiep.example.DoAnTotNghiep.DTO.PcBuildComponentDTO;
import doantotnghiep.example.DoAnTotNghiep.DTO.PcBuildDTO;
import doantotnghiep.example.DoAnTotNghiep.Entity.Components.Monitor;
import doantotnghiep.example.DoAnTotNghiep.Entity.Pc_build_components;
import doantotnghiep.example.DoAnTotNghiep.Entity.Pc_builds;
import doantotnghiep.example.DoAnTotNghiep.Entity.Products;
import doantotnghiep.example.DoAnTotNghiep.MODEL.PageResponse;
import doantotnghiep.example.DoAnTotNghiep.Repository.PcBuildComponentRepository;
import doantotnghiep.example.DoAnTotNghiep.Repository.PcBuildRepository;
import doantotnghiep.example.DoAnTotNghiep.Repository.ProductRepository;
import doantotnghiep.example.DoAnTotNghiep.Repository.Specs.MonitorRepository;
import doantotnghiep.example.DoAnTotNghiep.Utill.PcCompatibilityValidator;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.Statement;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * PcBuildServiceImpl - Triển khai logic nghiệp vụ quản lý Build PC dựa trên pc_builds và pc_build_components.
 * Sử dụng thuần các phương thức có sẵn của JpaRepository (findAll, findById, save, delete),
 * không tạo repository/service rác hay thêm query phức tạp.
 */
@Service
public class PcBuildServiceImpl implements PcBuildService {

    @Autowired
    private PcBuildRepository pcBuildRepository;

    @Autowired
    private PcBuildComponentRepository pcBuildComponentRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private PcCompatibilityValidator pcCompatibilityValidator;

    @Autowired
    private MonitorRepository monitorRepository;

    @Autowired
    private DataSource dataSource;

    /**
     * Nới lỏng Check Constraint CK_pc_build_components_type trong CSDL (nếu có)
     * để cho phép lưu trữ bản ghi linh kiện loại 'MONITOR' vào bảng pc_build_components.
     */
    @PostConstruct
    public void initDatabaseConstraints() {
        try {
            Connection conn = dataSource.getConnection();
            try {
                Statement stmt = conn.createStatement();
                try {
                    stmt.execute("ALTER TABLE pc_build_components DROP CONSTRAINT CK_pc_build_components_type");
                } catch (Exception ex) {
                    // Constraint đã bị drop hoặc không tồn tại, bỏ qua an toàn
                } finally {
                    stmt.close();
                }
            } finally {
                conn.close();
            }
        } catch (Exception ex) {
            System.out.println("[PcBuildServiceImpl] Chú ý khởi tạo constraints: " + ex.getMessage());
        }
    }

    @Override
    public List<String> checkCompatibility(PcBuildDTO buildDTO) {
        if (buildDTO == null || buildDTO.getComponents() == null) {
            List<String> errs = new ArrayList<String>();
            errs.add("Không tìm thấy thông tin linh kiện cấu hình để kiểm tra.");
            return errs;
        }
        return pcCompatibilityValidator.validate(buildDTO.getComponents());
    }

    @Override
    public PageResponse<PcBuildDTO> getPcBuilds(String keyword, String status, int page, int size) {
        List<Pc_builds> allBuilds = pcBuildRepository.findAll();
        List<PcBuildDTO> filteredList = new ArrayList<PcBuildDTO>();

        String kw = keyword != null ? keyword.trim().toLowerCase() : "";
        String st = status != null ? status.trim().toUpperCase() : "";

        // Sắp xếp các bản ghi mới nhất lên đầu bằng vòng lặp truyền thống
        for (int i = allBuilds.size() - 1; i >= 0; i--) {
            Pc_builds build = allBuilds.get(i);
            Products prod = build.getProduct();

            // Lọc theo từ khóa
            if (!kw.isEmpty()) {
                boolean matchKeyword = false;
                if (prod != null) {
                    if (prod.getName() != null && prod.getName().toLowerCase().contains(kw)) {
                        matchKeyword = true;
                    }
                    if (prod.getSku() != null && prod.getSku().toLowerCase().contains(kw)) {
                        matchKeyword = true;
                    }
                }
                if (!matchKeyword) {
                    continue;
                }
            }

            // Lọc theo trạng thái
            if (!st.isEmpty()) {
                String prodStatus = (prod != null && prod.getStatus() != null) ? prod.getStatus().toUpperCase() : "INACTIVE";
                if (!prodStatus.equals(st)) {
                    continue;
                }
            }

            filteredList.add(convertToDTO(build));
        }

        int totalElements = filteredList.size();
        int totalPages = (totalElements + size - 1) / size;
        if (totalPages == 0) totalPages = 1;

        int fromIndex = (page - 1) * size;
        int toIndex = fromIndex + size;
        if (fromIndex > totalElements) fromIndex = totalElements;
        if (toIndex > totalElements) toIndex = totalElements;

        List<PcBuildDTO> pageContent = new ArrayList<PcBuildDTO>();
        for (int i = fromIndex; i < toIndex; i++) {
            pageContent.add(filteredList.get(i));
        }

        PageResponse<PcBuildDTO> response = new PageResponse<PcBuildDTO>();
        response.setContent(pageContent);
        response.setPage(page);
        response.setSize(size);
        response.setTotalElements((long) totalElements);
        response.setTotalPages(totalPages);
        response.setFirst(page <= 1);
        response.setLast(page >= totalPages);

        return response;
    }

    @Override
    public PcBuildDTO getPcBuildById(Long id) {
        Optional<Pc_builds> opt = pcBuildRepository.findById(id);
        if (!opt.isPresent()) {
            return null;
        }
        return convertToDTO(opt.get());
    }

    @Override
    @Transactional
    public PcBuildDTO savePcBuild(PcBuildDTO buildDTO) {
        if (buildDTO == null) {
            throw new IllegalArgumentException("Thông tin cấu hình PC không được để trống!");
        }
        if (buildDTO.getProductId() == null) {
            throw new IllegalArgumentException("Vui lòng chọn sản phẩm PC đại diện!");
        }

        // 1. Kiểm tra tính hợp lệ của linh kiện trước khi lưu
        List<String> errors = pcCompatibilityValidator.validate(buildDTO.getComponents());
        if (errors != null && !errors.isEmpty()) {
            throw new IllegalArgumentException(errors.get(0));
        }

        // 2. Tìm sản phẩm PC đại diện
        Optional<Products> optProd = productRepository.findById(buildDTO.getProductId());
        if (!optProd.isPresent()) {
            throw new IllegalArgumentException("Không tìm thấy sản phẩm PC với ID: " + buildDTO.getProductId());
        }
        Products pcProduct = optProd.get();

        // Cập nhật giá và trạng thái sản phẩm PC
        if (buildDTO.getPrice() != null && buildDTO.getPrice().doubleValue() >= 0) {
            pcProduct.setPrice(buildDTO.getPrice());
            pcProduct.setSalePrice(buildDTO.getPrice());
        }
        if (buildDTO.getStatus() != null && !buildDTO.getStatus().trim().isEmpty()) {
            pcProduct.setStatus(buildDTO.getStatus().trim().toUpperCase());
        }
        pcProduct.setUpdatedAt(LocalDateTime.now());
        productRepository.save(pcProduct);

        // 3. Tìm hoặc tạo bản ghi Pc_builds
        Pc_builds pcBuild = null;
        if (buildDTO.getId() != null) {
            Optional<Pc_builds> optBuild = pcBuildRepository.findById(buildDTO.getId());
            if (optBuild.isPresent()) {
                pcBuild = optBuild.get();
            }
        }
        if (pcBuild == null) {
            List<Pc_builds> all = pcBuildRepository.findAll();
            for (int i = 0; i < all.size(); i++) {
                Pc_builds b = all.get(i);
                if (b.getProduct() != null && b.getProduct().getId().equals(pcProduct.getId())) {
                    pcBuild = b;
                    break;
                }
            }
        }
        if (pcBuild == null) {
            pcBuild = new Pc_builds();
            pcBuild.setProduct(pcProduct);
            pcBuild.setCreatedAt(LocalDateTime.now());
        }

        pcBuild = pcBuildRepository.save(pcBuild);

        // 4. Xóa các linh kiện cũ thuộc dàn PC này
        List<Pc_build_components> allComps = pcBuildComponentRepository.findAll();
        for (int i = 0; i < allComps.size(); i++) {
            Pc_build_components c = allComps.get(i);
            if (c.getPc_builds() != null && c.getPc_builds().getId().equals(pcBuild.getId())) {
                pcBuildComponentRepository.delete(c);
            }
        }

        // 5. Thêm lại từng linh kiện từ buildDTO.getComponents() vào bảng pc_build_components
        List<PcBuildComponentDTO> newComps = buildDTO.getComponents();
        if (newComps != null) {
            for (int i = 0; i < newComps.size(); i++) {
                PcBuildComponentDTO cdto = newComps.get(i);
                if (cdto != null && cdto.getComponentProductId() != null) {
                    Optional<Products> optP = productRepository.findById(cdto.getComponentProductId());
                    if (optP.isPresent()) {
                        Pc_build_components comp = new Pc_build_components();
                        comp.setPc_builds(pcBuild);
                        comp.setComponent_product(optP.get());
                        comp.setComponentType(cdto.getComponentType());
                        int qty = (cdto.getQuantity() != null && cdto.getQuantity().intValue() > 0) ? cdto.getQuantity().intValue() : 1;
                        comp.setQuantity(qty);
                        pcBuildComponentRepository.save(comp);
                    }
                }
            }
        }

        return convertToDTO(pcBuild);
    }

    @Override
    @Transactional
    public boolean toggleStatus(Long id) {
        Optional<Pc_builds> opt = pcBuildRepository.findById(id);
        if (!opt.isPresent()) {
            return false;
        }
        Pc_builds build = opt.get();
        Products p = build.getProduct();
        if (p != null) {
            String current = p.getStatus();
            if ("ACTIVE".equalsIgnoreCase(current)) {
                p.setStatus("INACTIVE");
            } else {
                p.setStatus("ACTIVE");
            }
            p.setUpdatedAt(LocalDateTime.now());
            productRepository.save(p);
            return true;
        }
        return false;
    }

    @Override
    public List<ComponentProductDTO> getComponentsByType(String componentType) {
        List<ComponentProductDTO> result = new ArrayList<ComponentProductDTO>();
        String type = componentType != null ? componentType.trim().toUpperCase() : "";

        if ("MONITOR".equals(type)) {
            // Lấy các sản phẩm màn hình từ monitor_specs và category/accessories
            List<Products> list = new ArrayList<Products>();
            List<Monitor> monitors = monitorRepository.findAll();
            for (int i = 0; i < monitors.size(); i++) {
                Monitor m = monitors.get(i);
                Products p = m.getProduct();
                if (p != null) {
                    list.add(p);
                }
            }
            List<Products> allProducts = productRepository.findAll();
            for (int i = 0; i < allProducts.size(); i++) {
                Products acc = allProducts.get(i);
                if ("ACCESSORY".equalsIgnoreCase(acc.getProductType())) {
                    boolean exists = false;
                    for (int j = 0; j < list.size(); j++) {
                        if (list.get(j).getId().equals(acc.getId())) {
                            exists = true;
                            break;
                        }
                    }
                    if (!exists && acc.getName() != null && (acc.getName().toLowerCase().contains("màn hình") || acc.getName().toLowerCase().contains("monitor"))) {
                        list.add(acc);
                    }
                }
            }

            for (int i = 0; i < list.size(); i++) {
                result.add(convertProductToDTO(list.get(i)));
            }
            return result;
        }

        // Các loại linh kiện thông thường: CPU, MAINBOARD, RAM, GPU, SSD, PSU, CASE, COOLER
        List<Products> allProducts = productRepository.findAll();
        for (int i = 0; i < allProducts.size(); i++) {
            Products p = allProducts.get(i);
            if (p.getComponentType() != null && p.getComponentType().trim().equalsIgnoreCase(type)) {
                result.add(convertProductToDTO(p));
            }
        }
        return result;
    }

    @Override
    public List<ComponentProductDTO> getPcProducts() {
        List<Products> allProducts = productRepository.findAll();
        List<ComponentProductDTO> result = new ArrayList<ComponentProductDTO>();
        for (int i = 0; i < allProducts.size(); i++) {
            Products p = allProducts.get(i);
            if (p.getProductType() != null && "PC".equalsIgnoreCase(p.getProductType().trim())) {
                result.add(convertProductToDTO(p));
            }
        }
        return result;
    }

    private ComponentProductDTO convertProductToDTO(Products p) {
        ComponentProductDTO dto = new ComponentProductDTO();
        dto.setId(p.getId());
        dto.setName(p.getName());
        dto.setSku(p.getSku());
        dto.setProductType(p.getProductType());
        dto.setComponentType(p.getComponentType());
        dto.setPrice(p.getPrice());
        dto.setSalePrice(p.getSalePrice());
        dto.setStatus(p.getStatus());
        dto.setStock(p.getStock());
        return dto;
    }

    private PcBuildDTO convertToDTO(Pc_builds build) {
        PcBuildDTO dto = new PcBuildDTO();
        dto.setId(build.getId());
        dto.setCreatedAt(build.getCreatedAt());

        Products prod = build.getProduct();
        if (prod != null) {
            dto.setProductId(prod.getId());
            dto.setName(prod.getName());
            dto.setSku(prod.getSku());
            dto.setPrice(prod.getPrice());
            dto.setStatus(prod.getStatus());
        }

        // Lấy danh sách linh kiện từ bảng pc_build_components
        List<Pc_build_components> allComps = pcBuildComponentRepository.findAll();
        List<PcBuildComponentDTO> compDTOs = new ArrayList<PcBuildComponentDTO>();
        for (int i = 0; i < allComps.size(); i++) {
            Pc_build_components c = allComps.get(i);
            if (c.getPc_builds() != null && c.getPc_builds().getId().equals(build.getId())) {
                PcBuildComponentDTO cdto = new PcBuildComponentDTO();
                cdto.setId(c.getId());
                cdto.setComponentType(c.getComponentType());
                cdto.setQuantity(c.getQuantity());

                Products cp = c.getComponent_product();
                if (cp != null) {
                    cdto.setComponentProductId(cp.getId());
                    cdto.setComponentProductName(cp.getName());
                    cdto.setComponentSku(cp.getSku());
                    cdto.setComponentPrice(cp.getPrice());
                }
                compDTOs.add(cdto);
            }
        }
        dto.setComponents(compDTOs);
        return dto;
    }
}
