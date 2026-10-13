package doantotnghiep.example.DoAnTotNghiep.Service;

import doantotnghiep.example.DoAnTotNghiep.DTO.ProductDTO;
import doantotnghiep.example.DoAnTotNghiep.MODEL.PageResponse;
import java.util.List;

public interface ProductService {
    List<ProductDTO> getAllProducts();
    PageResponse<ProductDTO> searchAndFilterProducts(String keyword, String productType, Long brandId, String status, int page, int size);
    ProductDTO getProductById(Long id);
    ProductDTO createProduct(ProductDTO dto);
    ProductDTO updateProduct(Long id, ProductDTO dto);
    void deleteProduct(Long id);
}
