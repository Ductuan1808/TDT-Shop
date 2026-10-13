package doantotnghiep.example.DoAnTotNghiep.Repository;

import doantotnghiep.example.DoAnTotNghiep.Entity.Products;
import java.util.List;

public interface ProductRepositoryCustom {
    List<Products> searchAndFilter(String keyword, String productType, Long brandId, String status, int page, int size);
    long countSearchAndFilter(String keyword, String productType, Long brandId, String status);
}