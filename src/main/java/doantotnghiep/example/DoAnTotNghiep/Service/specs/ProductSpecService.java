package doantotnghiep.example.DoAnTotNghiep.Service.specs;

import doantotnghiep.example.DoAnTotNghiep.DTO.ProductDTO;
import doantotnghiep.example.DoAnTotNghiep.Entity.Products;

public interface ProductSpecService {
    void saveOrUpdateSpecs(Products product, ProductDTO dto);
    void loadSpecsForProduct(Products product, ProductDTO dto);
    void deleteSpecsForProduct(Long productId);
}
