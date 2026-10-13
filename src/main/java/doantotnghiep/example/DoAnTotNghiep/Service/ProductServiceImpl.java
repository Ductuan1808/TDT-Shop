package doantotnghiep.example.DoAnTotNghiep.Service;

import doantotnghiep.example.DoAnTotNghiep.DTO.ProductDTO;
import doantotnghiep.example.DoAnTotNghiep.MODEL.PageResponse;
import doantotnghiep.example.DoAnTotNghiep.Entity.Categories;
import doantotnghiep.example.DoAnTotNghiep.Entity.Components.Brands;
import doantotnghiep.example.DoAnTotNghiep.Entity.Product_categories;
import doantotnghiep.example.DoAnTotNghiep.Entity.Product_images;
import doantotnghiep.example.DoAnTotNghiep.Entity.Products;
import doantotnghiep.example.DoAnTotNghiep.Repository.BrandRepository;
import doantotnghiep.example.DoAnTotNghiep.Repository.CategoryRepository;
import doantotnghiep.example.DoAnTotNghiep.Repository.ProductCategoryRepository;
import doantotnghiep.example.DoAnTotNghiep.Repository.ProductImageRepository;
import doantotnghiep.example.DoAnTotNghiep.Repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Collections;
import java.util.List;

@Service
@Transactional
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductCategoryRepository productCategoryRepository;

    @Autowired
    private ProductImageRepository productImageRepository;

    @Autowired
    private doantotnghiep.example.DoAnTotNghiep.Service.specs.ProductSpecService productSpecService;

    @Override
    @Transactional(readOnly = true)
    public List<ProductDTO> getAllProducts() {
        List<Products> list = productRepository.findAll();
        List<ProductDTO> dtos = new ArrayList<>();
        for (Products p : list) {
            ProductDTO dto = convertToDTO(p);
            productSpecService.loadSpecsForProduct(p, dto);
            dtos.add(dto);
        }
        return dtos;
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<ProductDTO> searchAndFilterProducts(String keyword, String productType, Long brandId, String status, int page, int size) {
        int pageIndex = page > 0 ? page : 1;
        int pageSize = size > 0 ? size : 15;

        List<Products> list = productRepository.searchAndFilter(keyword, productType, brandId, status, pageIndex, pageSize);
        long totalElements = productRepository.countSearchAndFilter(keyword, productType, brandId, status);

        List<ProductDTO> dtos = new ArrayList<>();
        for (Products p : list) {
            ProductDTO dto = convertToDTO(p);
            productSpecService.loadSpecsForProduct(p, dto);
            dtos.add(dto);
        }

        return new PageResponse<>(dtos, pageIndex, pageSize, totalElements);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductDTO getProductById(Long id) {
        if (id == null) return null;
        Products product = productRepository.findById(id).orElse(null);
        if (product == null) return null;
        ProductDTO dto = convertToDTO(product);
        productSpecService.loadSpecsForProduct(product, dto);
        return dto;
    }

    @Override
    public ProductDTO createProduct(ProductDTO dto) {
        Products product = new Products();
        populateEntityFromDTO(product, dto);
        product.setCreatedAt(LocalDateTime.now());
        product.setUpdatedAt(LocalDateTime.now());

        Products saved = productRepository.save(product);

        saveImagesAndCategories(saved, dto);
        productSpecService.saveOrUpdateSpecs(saved, dto);

        ProductDTO result = convertToDTO(saved);
        productSpecService.loadSpecsForProduct(saved, result);
        return result;
    }

    @Override
    public ProductDTO updateProduct(Long id, ProductDTO dto) {
        Products product = productRepository.findById(id).orElse(null);
        if (product == null) {
            throw new RuntimeException("Không tìm thấy sản phẩm có ID: " + id);
        }

        populateEntityFromDTO(product, dto);
        product.setUpdatedAt(LocalDateTime.now());

        Products saved = productRepository.save(product);

        saveImagesAndCategories(saved, dto);
        productSpecService.saveOrUpdateSpecs(saved, dto);

        ProductDTO result = convertToDTO(saved);
        productSpecService.loadSpecsForProduct(saved, result);
        return result;
    }

    @Override
    public void deleteProduct(Long id) {
        if (id != null && productRepository.existsById(id)) {
            productRepository.deleteById(id);
        }
    }

    private void populateEntityFromDTO(Products product, ProductDTO dto) {
        product.setName(dto.getName());
        product.setSku(dto.getSku());
        product.setProductType(dto.getProductType() != null ? dto.getProductType() : "COMPONENT");
        product.setComponentType(dto.getComponentType());

        double price = dto.getPrice() != null ? dto.getPrice().doubleValue() : 0.0;
        double discount = dto.getDiscountPercent() != null ? dto.getDiscountPercent().doubleValue() : 0.0;
        double salePrice = price * (100.0 - discount) / 100.0;

        product.setPrice(price);
        product.setDiscountPercent(discount);
        product.setSalePrice(salePrice);
        product.setStock(dto.getStock() != null ? dto.getStock() : 0);
        product.setDescription(dto.getDescription());
        product.setStatus(dto.getStatus() != null && !dto.getStatus().trim().isEmpty() ? dto.getStatus() : "ACTIVE");

        if (dto.getBrandId() != null) {
            Brands brand = brandRepository.findById(dto.getBrandId()).orElse(null);
            product.setBrand(brand);
        } else {
            product.setBrand(null);
        }
    }

    private void saveImagesAndCategories(Products product, ProductDTO dto) {
        // Lưu danh sách ảnh nếu có
        List<String> inputImages = dto.getImages();
        if ((inputImages == null || inputImages.isEmpty()) && dto.getImage() != null && !dto.getImage().trim().isEmpty()) {
            inputImages = Collections.singletonList(dto.getImage().trim());
        }

        if (inputImages != null && !inputImages.isEmpty()) {
            product.getProductImages().clear();
            for (int i = 0; i < inputImages.size(); i++) {
                String rawUrl = inputImages.get(i);
                if (rawUrl != null && !rawUrl.trim().isEmpty()) {
                    String finalUrl = rawUrl.trim();
                    if (finalUrl.startsWith("data:image/")) {
                        finalUrl = saveBase64Image(product.getId(), finalUrl, i);
                    }
                    if (finalUrl != null && !finalUrl.isEmpty()) {
                        Product_images img = new Product_images(product, finalUrl, i == 0, i);
                        product.getProductImages().add(img);
                    }
                }
            }
            productRepository.save(product);
        }

        // Lưu danh mục nếu có
        if (dto.getCategoryIds() != null && !dto.getCategoryIds().isEmpty()) {
            for (Long catId : dto.getCategoryIds()) {
                Categories cat = categoryRepository.findById(catId).orElse(null);
                if (cat != null) {
                    Product_categories pc = new Product_categories(product, cat);
                    productCategoryRepository.save(pc);
                }
            }
        }
    }

    private String saveBase64Image(Long productId, String base64DataUrl, int index) {
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

            // Tạo thư mục uploads/products/prd_{productId}
            Path productDir = Paths.get("uploads", "products", "prd_" + productId);
            if (!Files.exists(productDir)) {
                Files.createDirectories(productDir);
            }

            String fileName = "img_" + System.currentTimeMillis() + "_" + index + extension;
            Path filePath = productDir.resolve(fileName);
            Files.write(filePath, decodedBytes);

            return "/uploads/products/prd_" + productId + "/" + fileName;
        } catch (Exception e) {
            throw new RuntimeException("Lỗi lưu ảnh sản phẩm vào thư mục prd_" + productId + ": " + e.getMessage(), e);
        }
    }

    private ProductDTO convertToDTO(Products p) {
        if (p == null) return null;
        ProductDTO dto = new ProductDTO();
        dto.setId(p.getId());
        dto.setName(p.getName());
        dto.setSku(p.getSku());

        if (p.getBrand() != null) {
            dto.setBrandId(p.getBrand().getId());
            dto.setBrandName(p.getBrand().getName());
        }

        dto.setProductType(p.getProductType());
        dto.setComponentType(p.getComponentType());

        if (p.getPrice() != null) {
            dto.setPrice(BigDecimal.valueOf(p.getPrice()).setScale(2, RoundingMode.HALF_UP));
        } else {
            dto.setPrice(BigDecimal.ZERO);
        }

        if (p.getDiscountPercent() != null) {
            dto.setDiscountPercent(BigDecimal.valueOf(p.getDiscountPercent()).setScale(2, RoundingMode.HALF_UP));
        } else {
            dto.setDiscountPercent(BigDecimal.ZERO);
        }

        if (p.getSalePrice() != null) {
            dto.setSalePrice(BigDecimal.valueOf(p.getSalePrice()).setScale(2, RoundingMode.HALF_UP));
        } else {
            dto.setSalePrice(dto.getPrice());
        }

        dto.setStock(p.getStock() != null ? p.getStock() : 0);
        dto.setDescription(p.getDescription());
        dto.setStatus(p.getStatus());
        dto.setCreatedAt(p.getCreatedAt());
        dto.setUpdatedAt(p.getUpdatedAt());

        // Lấy danh sách ảnh
        List<String> imgUrls = new ArrayList<>();
        if (p.getProductImages() != null && !p.getProductImages().isEmpty()) {
            for (Product_images img : p.getProductImages()) {
                if (img.getImageUrl() != null) {
                    imgUrls.add(img.getImageUrl());
                }
            }
        }
        dto.setImages(imgUrls);
        if (!imgUrls.isEmpty()) {
            dto.setImage(imgUrls.get(0));
        }

        // Lấy danh sách categories
        List<Long> catIds = new ArrayList<>();
        if (p.getProductCategories() != null && !p.getProductCategories().isEmpty()) {
            for (Product_categories pc : p.getProductCategories()) {
                if (pc.getCategory() != null) {
                    catIds.add(pc.getCategory().getId());
                }
            }
        }
        dto.setCategoryIds(catIds);

        return dto;
    }
}
