package doantotnghiep.example.DoAnTotNghiep.Service;

import doantotnghiep.example.DoAnTotNghiep.DTO.BrandDTO;
import doantotnghiep.example.DoAnTotNghiep.Entity.Components.Brands;
import doantotnghiep.example.DoAnTotNghiep.MODEL.PageResponse;
import doantotnghiep.example.DoAnTotNghiep.Repository.BrandRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class BrandServiceImpl implements BrandService {

    @Autowired
    private BrandRepository brandRepository;

    @Override
    @Transactional(readOnly = true)
    public List<BrandDTO> getAllBrands() {
        List<Brands> list = brandRepository.findAll();
        List<BrandDTO> dtos = new ArrayList<>();
        for (int i = 0; i < list.size(); i++) {
            Brands b = list.get(i);
            dtos.add(convertToDTO(b));
        }
        return dtos;
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<BrandDTO> getBrands(String keyword, String status, int page, int size) {
        List<Brands> allBrands = brandRepository.findAll();
        List<Brands> filtered = new ArrayList<>();

        String kw = "";
        if (keyword != null) {
            kw = keyword.trim().toLowerCase();
        }

        String st = "";
        if (status != null) {
            st = status.trim().toUpperCase();
        }

        for (int i = 0; i < allBrands.size(); i++) {
            Brands b = allBrands.get(i);
            if (b == null) {
                continue;
            }

            String brandStatus = b.getStatus() != null ? b.getStatus().trim().toUpperCase() : "ACTIVE";

            // 1. Lọc theo trạng thái
            if (!st.isEmpty()) {
                boolean matchStatus = false;
                if (st.equals("ACTIVE") || st.equals("HOẠT ĐỘNG") || st.equals("HOAT DONG") || st.equals("HIỆN") || st.equals("HIEN") || st.equals("TRUE") || st.equals("1")) {
                    matchStatus = "ACTIVE".equalsIgnoreCase(brandStatus);
                } else if (st.equals("INACTIVE") || st.equals("TẠM NGƯNG") || st.equals("TAM NGUNG") || st.equals("ẨN") || st.equals("AN") || st.equals("KHÓA") || st.equals("KHOA") || st.equals("FALSE") || st.equals("0")) {
                    matchStatus = "INACTIVE".equalsIgnoreCase(brandStatus);
                } else {
                    matchStatus = brandStatus.equalsIgnoreCase(st);
                }

                if (!matchStatus) {
                    continue;
                }
            }

            // 2. Lọc theo từ khóa tìm kiếm (tên thương hiệu hoặc trạng thái)
            if (!kw.isEmpty()) {
                boolean matchKeyword = false;
                if (b.getName() != null && b.getName().toLowerCase().contains(kw)) {
                    matchKeyword = true;
                }
                if (b.getStatus() != null && b.getStatus().toLowerCase().contains(kw)) {
                    matchKeyword = true;
                }
                if ("ACTIVE".equalsIgnoreCase(brandStatus) && (kw.contains("hoạt động") || kw.contains("hoat dong") || kw.contains("hiện") || kw.contains("hien"))) {
                    matchKeyword = true;
                }
                if ("INACTIVE".equalsIgnoreCase(brandStatus) && (kw.contains("tạm ngưng") || kw.contains("tam ngung") || kw.contains("ẩn") || kw.contains("an") || kw.contains("khóa") || kw.contains("khoa"))) {
                    matchKeyword = true;
                }

                if (!matchKeyword) {
                    continue;
                }
            }

            filtered.add(b);
        }

        // 3. Sắp xếp ưu tiên: từ khóa xuất hiện ở đầu tên thương hiệu trước (vị trí 0, 1, 2...)
        if (!kw.isEmpty() && filtered.size() > 1) {
            for (int i = 0; i < filtered.size() - 1; i++) {
                for (int j = i + 1; j < filtered.size(); j++) {
                    Brands b1 = filtered.get(i);
                    Brands b2 = filtered.get(j);

                    int pos1 = getKeywordPosition(b1, kw);
                    int pos2 = getKeywordPosition(b2, kw);

                    if (pos1 > pos2) {
                        // Đổi chỗ để đưa thương hiệu có từ khóa gần đầu hơn lên trước
                        filtered.set(i, b2);
                        filtered.set(j, b1);
                    } else if (pos1 == pos2) {
                        // Nếu cùng vị trí, sắp xếp theo tên từ A-Z
                        String name1 = b1.getName() != null ? b1.getName().toLowerCase() : "";
                        String name2 = b2.getName() != null ? b2.getName().toLowerCase() : "";
                        if (name1.compareTo(name2) > 0) {
                            filtered.set(i, b2);
                            filtered.set(j, b1);
                        }
                    }
                }
            }
        }

        // Tính toán phân trang
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

        List<BrandDTO> dtos = new ArrayList<>();
        if (startIndex < filtered.size()) {
            for (int i = startIndex; i < endIndex; i++) {
                Brands b = filtered.get(i);
                dtos.add(convertToDTO(b));
            }
        }

        return new PageResponse<>(dtos, currentPage, pageSize, totalElements);
    }

    @Override
    @Transactional(readOnly = true)
    public BrandDTO getBrandById(Long id) {
        if (id == null) {
            return null;
        }
        Optional<Brands> opt = brandRepository.findById(id);
        if (!opt.isPresent()) {
            return null;
        }
        return convertToDTO(opt.get());
    }

    @Override
    @Transactional
    public BrandDTO createBrand(BrandDTO dto) {
        if (dto == null) {
            return null;
        }

        // Kiểm tra nếu tên thương hiệu đã tồn tại
        if (dto.getName() != null) {
            String newName = dto.getName().trim();
            List<Brands> allBrands = brandRepository.findAll();
            for (int i = 0; i < allBrands.size(); i++) {
                Brands existing = allBrands.get(i);
                if (existing != null && existing.getName() != null && existing.getName().trim().equalsIgnoreCase(newName)) {
                    throw new RuntimeException("Không thể tạo vì đã tồn tại thương hiệu trên");
                }
            }
        }

        Brands b = new Brands();
        b.setName(dto.getName());
        b.setStatus(dto.getStatus() != null && !dto.getStatus().trim().isEmpty() ? dto.getStatus() : "ACTIVE");
        b.setCreateAt(new Date());

        // Lưu trước để lấy ID
        Brands saved = brandRepository.save(b);

        String rawLogo = dto.getLogo();
        if (rawLogo != null && !rawLogo.trim().isEmpty()) {
            String logoUrl = rawLogo.trim();
            if (logoUrl.startsWith("data:image/")) {
                logoUrl = saveBase64Image(saved.getId(), logoUrl);
            }
            saved.setLogo(logoUrl);
            saved = brandRepository.save(saved);
        }

        return convertToDTO(saved);
    }

    @Override
    @Transactional
    public BrandDTO updateBrand(Long id, BrandDTO dto) {
        if (id == null || dto == null) {
            return null;
        }
        Optional<Brands> opt = brandRepository.findById(id);
        if (!opt.isPresent()) {
            return null;
        }
        Brands b = opt.get();

        // Kiểm tra nếu tên thương hiệu đã tồn tại ở bản ghi khác
        if (dto.getName() != null) {
            String newName = dto.getName().trim();
            List<Brands> allBrands = brandRepository.findAll();
            for (int i = 0; i < allBrands.size(); i++) {
                Brands existing = allBrands.get(i);
                if (existing != null && !existing.getId().equals(id) && existing.getName() != null && existing.getName().trim().equalsIgnoreCase(newName)) {
                    throw new RuntimeException("Không thể tạo vì đã tồn tại thương hiệu trên");
                }
            }
        }

        b.setName(dto.getName());
        if (dto.getStatus() != null && !dto.getStatus().trim().isEmpty()) {
            b.setStatus(dto.getStatus());
        }

        String rawLogo = dto.getLogo();
        if (rawLogo != null && !rawLogo.trim().isEmpty()) {
            String logoUrl = rawLogo.trim();
            if (logoUrl.startsWith("data:image/")) {
                logoUrl = saveBase64Image(b.getId(), logoUrl);
            }
            b.setLogo(logoUrl);
        } else {
            b.setLogo(null);
        }

        Brands saved = brandRepository.save(b);
        return convertToDTO(saved);
    }

    @Override
    @Transactional
    public BrandDTO updateBrandStatus(Long id, String status) {
        if (id == null) {
            return null;
        }
        Optional<Brands> opt = brandRepository.findById(id);
        if (!opt.isPresent()) {
            return null;
        }
        Brands b = opt.get();
        b.setStatus(status);

        Brands saved = brandRepository.save(b);
        return convertToDTO(saved);
    }

    @Override
    @Transactional
    public void deleteBrand(Long id) {
        if (id != null && brandRepository.existsById(id)) {
            brandRepository.deleteById(id);
        }
    }

    /**
     * Lưu ảnh Base64 vào thư mục uploads/brands/brd_{id} giống với sản phẩm
     */
    private String saveBase64Image(Long brandId, String base64DataUrl) {
        try {
            int commaIndex = base64DataUrl.indexOf(",");
            if (commaIndex == -1) {
                return null;
            }
            String header = base64DataUrl.substring(0, commaIndex);
            String base64Content = base64DataUrl.substring(commaIndex + 1);

            String extension = ".jpg";
            if (header.contains("image/png")) {
                extension = ".png";
            } else if (header.contains("image/webp")) {
                extension = ".webp";
            } else if (header.contains("image/gif")) {
                extension = ".gif";
            } else if (header.contains("image/jpeg") || header.contains("image/jpg")) {
                extension = ".jpg";
            }

            byte[] decodedBytes = Base64.getDecoder().decode(base64Content.trim());

            // Tên thư mục theo định dạng brd_01 hoặc brd_10
            String folderName = brandId < 10 ? "brd_0" + brandId : "brd_" + brandId;
            Path brandDir = Paths.get("uploads", "brands", folderName);
            if (!Files.exists(brandDir)) {
                Files.createDirectories(brandDir);
            }

            String fileName = "logo_" + System.currentTimeMillis() + extension;
            Path filePath = brandDir.resolve(fileName);
            Files.write(filePath, decodedBytes);

            return "/uploads/brands/" + folderName + "/" + fileName;
        } catch (Exception e) {
            throw new RuntimeException("Lỗi lưu ảnh thương hiệu vào thư mục: " + e.getMessage(), e);
        }
    }

    /**
     * Xác định vị trí xuất hiện của từ khóa trong tên thương hiệu
     * 0: Bắt đầu bằng từ khóa (Ưu tiên cao nhất)
     * 1: Ký tự thứ 2
     * ...
     * 9999: Không nằm trong tên
     */
    private int getKeywordPosition(Brands b, String kw) {
        if (b == null || b.getName() == null) {
            return 9999;
        }
        String name = b.getName().trim().toLowerCase();
        int idx = name.indexOf(kw);
        if (idx != -1) {
            return idx;
        }
        return 9999;
    }

    /**
     * Chuyển đổi từ entity Brands sang BrandDTO
     */
    private BrandDTO convertToDTO(Brands entity) {
        if (entity == null) {
            return null;
        }
        BrandDTO dto = new BrandDTO();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setLogo(entity.getLogo());
        dto.setStatus(entity.getStatus());
        dto.setCreatedAt(entity.getCreateAt());
        return dto;
    }
}
