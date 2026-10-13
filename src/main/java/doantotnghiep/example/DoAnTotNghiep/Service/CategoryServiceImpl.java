package doantotnghiep.example.DoAnTotNghiep.Service;

import doantotnghiep.example.DoAnTotNghiep.DTO.CategoryDTO;
import doantotnghiep.example.DoAnTotNghiep.Entity.Categories;
import doantotnghiep.example.DoAnTotNghiep.MODEL.PageResponse;
import doantotnghiep.example.DoAnTotNghiep.Repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;


    @Override
    @Transactional(readOnly = true)
    public List<CategoryDTO> getParentCategories() {
        List<Categories> list = categoryRepository.findAll();
        List<CategoryDTO> dtos = new ArrayList<>();
        for (int i = 0; i < list.size(); i++) {
            Categories c = list.get(i);
            if (c != null && c.getParent() == null) {
                dtos.add(convertToDTO(c));
            }
        }
        return dtos;
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<CategoryDTO> getCategories(String keyword, String parentType, Long parentId, String status, int page, int size) {
        List<Categories> allCategories = categoryRepository.findAll();
        List<Categories> filtered = new ArrayList<>();

        String kw = "";
        if (keyword != null) {
            kw = keyword.trim().toLowerCase();
        }

        String st = "";
        if (status != null) {
            st = status.trim().toUpperCase();
        }

        String pt = "";
        if (parentType != null) {
            pt = parentType.trim().toUpperCase();
        }

        for (int i = 0; i < allCategories.size(); i++) {
            Categories c = allCategories.get(i);
            if (c == null) {
                continue;
            }

            String catStatus = c.getStatus() != null ? c.getStatus().trim().toUpperCase() : "ACTIVE";

            // 1. Lọc theo trạng thái
            if (!st.isEmpty()) {
                boolean matchStatus = false;
                if (st.equals("ACTIVE") || st.equals("HOẠT ĐỘNG") || st.equals("HOAT DONG") || st.equals("HIỆN") || st.equals("HIEN") || st.equals("TRUE") || st.equals("1")) {
                    matchStatus = "ACTIVE".equalsIgnoreCase(catStatus);
                } else if (st.equals("INACTIVE") || st.equals("TẠM NGƯNG") || st.equals("TAM NGUNG") || st.equals("ẨN") || st.equals("AN") || st.equals("KHÓA") || st.equals("KHOA") || st.equals("FALSE") || st.equals("0")) {
                    matchStatus = "INACTIVE".equalsIgnoreCase(catStatus);
                } else {
                    matchStatus = catStatus.equalsIgnoreCase(st);
                }

                if (!matchStatus) {
                    continue;
                }
            }

            // 2. Lọc theo cấp danh mục hoặc danh mục cha cụ thể
            if (parentId != null) {
                if (c.getParent() == null || !c.getParent().getId().equals(parentId)) {
                    continue;
                }
            } else if (!pt.isEmpty()) {
                if (pt.equals("ROOT") && c.getParent() != null) {
                    continue; // Chỉ lấy danh mục gốc
                }
                if (pt.equals("SUB") && c.getParent() == null) {
                    continue; // Chỉ lấy danh mục con
                }
            }

            // 3. Lọc theo từ khóa tìm kiếm (chỉ tìm theo tên danh mục)
            if (!kw.isEmpty()) {
                if (c.getName() == null || !c.getName().toLowerCase().contains(kw)) {
                    continue;
                }
            }

            filtered.add(c);
        }

        // 4. Sắp xếp ưu tiên: từ khóa xuất hiện ở đầu tên danh mục trước (vị trí 0, 1, 2...)
        if (!kw.isEmpty() && filtered.size() > 1) {
            for (int i = 0; i < filtered.size() - 1; i++) {
                for (int j = i + 1; j < filtered.size(); j++) {
                    Categories c1 = filtered.get(i);
                    Categories c2 = filtered.get(j);

                    int pos1 = getKeywordPosition(c1, kw);
                    int pos2 = getKeywordPosition(c2, kw);

                    if (pos1 > pos2) {
                        filtered.set(i, c2);
                        filtered.set(j, c1);
                    } else if (pos1 == pos2) {
                        String name1 = c1.getName() != null ? c1.getName().toLowerCase() : "";
                        String name2 = c2.getName() != null ? c2.getName().toLowerCase() : "";
                        if (name1.compareTo(name2) > 0) {
                            filtered.set(i, c2);
                            filtered.set(j, c1);
                        }
                    }
                }
            }
        }

        // 5. Tính toán phân trang
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

        List<CategoryDTO> dtos = new ArrayList<>();
        if (startIndex < filtered.size()) {
            for (int i = startIndex; i < endIndex; i++) {
                dtos.add(convertToDTO(filtered.get(i)));
            }
        }

        return new PageResponse<>(dtos, currentPage, pageSize, totalElements);
    }

    @Override
    @Transactional(readOnly = true)
    public CategoryDTO getCategoryById(Long id) {
        if (id == null) {
            return null;
        }
        Optional<Categories> opt = categoryRepository.findById(id);
        if (!opt.isPresent()) {
            return null;
        }
        return convertToDTO(opt.get());
    }

    @Override
    @Transactional
    public CategoryDTO createCategory(CategoryDTO dto) {
        if (dto == null) {
            return null;
        }
        // Kiểm tra nếu tên danh mục đã tồn tại
        if (dto.getName() != null) {
            String newName = dto.getName().trim();
            List<Categories> allCats = categoryRepository.findAll();
            for (int i = 0; i < allCats.size(); i++) {
                Categories existing = allCats.get(i);
                if (existing != null && existing.getName() != null && existing.getName().trim().equalsIgnoreCase(newName)) {
                    throw new RuntimeException("Không thể tạo vì đã tồn tại danh mục trên");
                }
            }
        }

        Categories c = new Categories();
        c.setName(dto.getName());
        c.setDescription(dto.getDescription());
        c.setStatus(dto.getStatus() != null && !dto.getStatus().trim().isEmpty() ? dto.getStatus().trim().toUpperCase() : "ACTIVE");

        // Nếu danh mục tạo mới ở trạng thái ẩn thì tự động tắt hiển thị
        if ("INACTIVE".equalsIgnoreCase(c.getStatus())) {
            c.setShowOnHome(false);
            c.setShowOnMenu(false);
        } else {
            c.setShowOnHome(dto.getShowOnHome() != null ? dto.getShowOnHome() : false);
            c.setShowOnMenu(dto.getShowOnMenu() != null ? dto.getShowOnMenu() : false);
        }
        c.setCreatedAt(LocalDateTime.now());

        if (dto.getParentId() != null) {
            Optional<Categories> parentOpt = categoryRepository.findById(dto.getParentId());
            if (parentOpt.isPresent()) {
                Categories parentCat = parentOpt.get();
                // Chỉ nhận danh mục cha là danh mục gốc (parent == null), không nhận con làm cha
                if (parentCat.getParent() == null) {
                    c.setParent(parentCat);
                }
            }
        }

        Categories saved = categoryRepository.save(c);
        return convertToDTO(saved);
    }

    @Override
    @Transactional
    public CategoryDTO updateCategory(Long id, CategoryDTO dto) {
        if (id == null || dto == null) {
            return null;
        }
        Optional<Categories> opt = categoryRepository.findById(id);
        if (!opt.isPresent()) {
            return null;
        }
        Categories c = opt.get();

        // Kiểm tra nếu tên danh mục đã tồn tại ở bản ghi khác
        if (dto.getName() != null) {
            String newName = dto.getName().trim();
            List<Categories> allCats = categoryRepository.findAll();
            for (int i = 0; i < allCats.size(); i++) {
                Categories existing = allCats.get(i);
                if (existing != null && !existing.getId().equals(id) && existing.getName() != null && existing.getName().trim().equalsIgnoreCase(newName)) {
                    throw new RuntimeException("Không thể tạo vì đã tồn tại danh mục trên");
                }
            }
        }

        c.setName(dto.getName());
        c.setDescription(dto.getDescription());

        if (dto.getStatus() != null && !dto.getStatus().trim().isEmpty()) {
            c.setStatus(dto.getStatus().trim().toUpperCase());
        }

        // Nếu danh mục bị ẩn: tắt hiện trang chủ, menu; nếu là cha thì ẩn luôn các con
        if ("INACTIVE".equalsIgnoreCase(c.getStatus())) {
            c.setShowOnHome(false);
            c.setShowOnMenu(false);
            hideChildrenIfParent(id);
        } else {
            if (dto.getShowOnHome() != null) {
                c.setShowOnHome(dto.getShowOnHome());
            }
            if (dto.getShowOnMenu() != null) {
                c.setShowOnMenu(dto.getShowOnMenu());
            }
        }

        // Cập nhật danh mục cha (tránh trường hợp gán chính nó làm cha, và chỉ nhận danh mục gốc)
        if (dto.getParentId() != null) {
            if (!dto.getParentId().equals(id)) {
                Optional<Categories> parentOpt = categoryRepository.findById(dto.getParentId());
                if (parentOpt.isPresent()) {
                    Categories parentCat = parentOpt.get();
                    // Chỉ nhận danh mục cha là danh mục gốc (parent == null), không nhận con làm cha
                    if (parentCat.getParent() == null) {
                        c.setParent(parentCat);
                    }
                }
            }
        } else {
            c.setParent(null);
        }

        Categories saved = categoryRepository.save(c);
        return convertToDTO(saved);
    }

    @Override
    @Transactional
    public CategoryDTO updateCategoryStatus(Long id, String status) {
        if (id == null) {
            return null;
        }
        Optional<Categories> opt = categoryRepository.findById(id);
        if (!opt.isPresent()) {
            return null;
        }
        Categories c = opt.get();
        c.setStatus(status);

        // Nếu danh mục bị ẩn: tắt hiện trang chủ, menu; nếu là cha thì ẩn luôn các con
        if ("INACTIVE".equalsIgnoreCase(status)) {
            c.setShowOnHome(false);
            c.setShowOnMenu(false);
            hideChildrenIfParent(id);
        }

        Categories saved = categoryRepository.save(c);
        return convertToDTO(saved);
    }

    /**
     * Nếu ẩn danh mục cha thì tất cả danh mục con cũng bị ẩn luôn
     */
    private void hideChildrenIfParent(Long parentId) {
        if (parentId == null) {
            return;
        }
        List<Categories> allCats = categoryRepository.findAll();
        for (int i = 0; i < allCats.size(); i++) {
            Categories child = allCats.get(i);
            if (child != null && child.getParent() != null && parentId.equals(child.getParent().getId())) {
                child.setStatus("INACTIVE");
                child.setShowOnHome(false);
                child.setShowOnMenu(false);
                categoryRepository.save(child);
            }
        }
    }

    @Override
    @Transactional
    public CategoryDTO toggleShowOnHome(Long id) {
        if (id == null) {
            return null;
        }
        Optional<Categories> opt = categoryRepository.findById(id);
        if (!opt.isPresent()) {
            return null;
        }
        Categories c = opt.get();

        // Nếu danh mục bị ẩn thì không cho phép thao tác hiện trang chủ
        if (!"ACTIVE".equalsIgnoreCase(c.getStatus())) {
            throw new RuntimeException("Danh mục đang bị ẩn, không thể thao tác hiển thị trang chủ!");
        }

        boolean current = c.getShowOnHome() != null && c.getShowOnHome();
        c.setShowOnHome(!current);

        Categories saved = categoryRepository.save(c);
        return convertToDTO(saved);
    }

    @Override
    @Transactional
    public CategoryDTO toggleShowOnMenu(Long id) {
        if (id == null) {
            return null;
        }
        Optional<Categories> opt = categoryRepository.findById(id);
        if (!opt.isPresent()) {
            return null;
        }
        Categories c = opt.get();

        // Nếu danh mục bị ẩn thì không cho phép thao tác hiện menu
        if (!"ACTIVE".equalsIgnoreCase(c.getStatus())) {
            throw new RuntimeException("Danh mục đang bị ẩn, không thể thao tác hiển thị menu!");
        }

        boolean current = c.getShowOnMenu() != null && c.getShowOnMenu();
        c.setShowOnMenu(!current);

        Categories saved = categoryRepository.save(c);
        return convertToDTO(saved);
    }

    /**
     * Xác định vị trí xuất hiện của từ khóa trong tên danh mục
     * 0: Bắt đầu bằng từ khóa (Ưu tiên cao nhất)
     * 1: Ký tự thứ 2
     * ...
     * 9999: Không nằm trong tên
     */
    private int getKeywordPosition(Categories c, String kw) {
        if (c == null || c.getName() == null) {
            return 9999;
        }
        String name = c.getName().trim().toLowerCase();
        int idx = name.indexOf(kw);
        if (idx != -1) {
            return idx;
        }
        return 9999;
    }

    /**
     * Chuyển đổi entity Categories sang CategoryDTO
     */
    private CategoryDTO convertToDTO(Categories entity) {
        if (entity == null) {
            return null;
        }
        CategoryDTO dto = new CategoryDTO();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        if (entity.getParent() != null) {
            dto.setParentId(entity.getParent().getId());
            dto.setParentName(entity.getParent().getName());
        }
        dto.setDescription(entity.getDescription());
        dto.setStatus(entity.getStatus());

        dto.setShowOnHome(entity.getShowOnHome() != null ? entity.getShowOnHome() : false);
        dto.setShowOnMenu(entity.getShowOnMenu() != null ? entity.getShowOnMenu() : false);
        dto.setCreatedAt(entity.getCreatedAt());
        return dto;
    }
}
