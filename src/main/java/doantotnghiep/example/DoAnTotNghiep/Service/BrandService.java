package doantotnghiep.example.DoAnTotNghiep.Service;

import doantotnghiep.example.DoAnTotNghiep.DTO.BrandDTO;
import doantotnghiep.example.DoAnTotNghiep.MODEL.PageResponse;

import java.util.List;

public interface BrandService {

    List<BrandDTO> getAllBrands();

    PageResponse<BrandDTO> getBrands(String keyword, String status, int page, int size);

    BrandDTO getBrandById(Long id);

    BrandDTO createBrand(BrandDTO dto);

    BrandDTO updateBrand(Long id, BrandDTO dto);

    BrandDTO updateBrandStatus(Long id, String status);

    void deleteBrand(Long id);
}
