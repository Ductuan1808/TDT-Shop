package doantotnghiep.example.DoAnTotNghiep.Repository;

import doantotnghiep.example.DoAnTotNghiep.Entity.Products;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ProductRepositoryCustomImpl implements ProductRepositoryCustom {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    @SuppressWarnings("unchecked")
    public List<Products> searchAndFilter(String keyword, String productType, Long brandId, String status, int page, int size) {
        StringBuilder sql = new StringBuilder("SELECT DISTINCT p.* FROM products p WHERE 1=1 ");

        if (keyword != null && !keyword.trim().isEmpty()) {
            sql.append("AND (LOWER(p.name) LIKE LOWER(:keyword) OR LOWER(p.sku) LIKE LOWER(:keyword)) ");
        }

        if (productType != null && !productType.trim().isEmpty()) {
            sql.append("AND p.product_type = :productType ");
        }

        if (brandId != null && brandId > 0) {
            sql.append("AND p.brand_id = :brandId ");
        }

        if (status != null && !status.trim().isEmpty()) {
            sql.append("AND p.status = :status ");
        }

        sql.append("ORDER BY p.id DESC");

        Query query = entityManager.createNativeQuery(sql.toString(), Products.class);

        if (keyword != null && !keyword.trim().isEmpty()) {
            query.setParameter("keyword", "%" + keyword.trim() + "%");
        }

        if (productType != null && !productType.trim().isEmpty()) {
            query.setParameter("productType", productType.trim());
        }

        if (brandId != null && brandId > 0) {
            query.setParameter("brandId", brandId);
        }

        if (status != null && !status.trim().isEmpty()) {
            query.setParameter("status", status.trim());
        }

        int pageIndex = page > 0 ? page : 1;
        int pageSize = size > 0 ? size : 15;
        int offset = (pageIndex - 1) * pageSize;

        query.setFirstResult(offset);
        query.setMaxResults(pageSize);

        return (List<Products>) query.getResultList();
    }

    @Override
    public long countSearchAndFilter(String keyword, String productType, Long brandId, String status) {
        StringBuilder sql = new StringBuilder("SELECT COUNT(DISTINCT p.id) FROM products p WHERE 1=1 ");

        if (keyword != null && !keyword.trim().isEmpty()) {
            sql.append("AND (LOWER(p.name) LIKE LOWER(:keyword) OR LOWER(p.sku) LIKE LOWER(:keyword)) ");
        }

        if (productType != null && !productType.trim().isEmpty()) {
            sql.append("AND p.product_type = :productType ");
        }

        if (brandId != null && brandId > 0) {
            sql.append("AND p.brand_id = :brandId ");
        }

        if (status != null && !status.trim().isEmpty()) {
            sql.append("AND p.status = :status ");
        }

        Query query = entityManager.createNativeQuery(sql.toString());

        if (keyword != null && !keyword.trim().isEmpty()) {
            query.setParameter("keyword", "%" + keyword.trim() + "%");
        }

        if (productType != null && !productType.trim().isEmpty()) {
            query.setParameter("productType", productType.trim());
        }

        if (brandId != null && brandId > 0) {
            query.setParameter("brandId", brandId);
        }

        if (status != null && !status.trim().isEmpty()) {
            query.setParameter("status", status.trim());
        }

        Object result = query.getSingleResult();
        if (result instanceof Number) {
            return ((Number) result).longValue();
        }
        return 0L;
    }
}
