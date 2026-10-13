package doantotnghiep.example.DoAnTotNghiep.Service;

import doantotnghiep.example.DoAnTotNghiep.DTO.CategoryDTO;
import doantotnghiep.example.DoAnTotNghiep.MODEL.PageResponse;

import java.util.List;

public interface CategoryService {
    PageResponse<CategoryDTO> getCategories(String keyword, String parentType, Long parentId, String status, int page, int size);
    List<CategoryDTO> getParentCategories();
    CategoryDTO getCategoryById(Long id);
    CategoryDTO createCategory(CategoryDTO dto);
    CategoryDTO updateCategory(Long id, CategoryDTO dto);
    CategoryDTO updateCategoryStatus(Long id, String status);
    CategoryDTO toggleShowOnHome(Long id);
    CategoryDTO toggleShowOnMenu(Long id);
}
