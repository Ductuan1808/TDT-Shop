package doantotnghiep.example.DoAnTotNghiep.Repository;

import doantotnghiep.example.DoAnTotNghiep.Entity.Categories;
import java.util.List;

public interface CategoryRepositoryCustom {
    List<Categories> findParentCategories();
}
