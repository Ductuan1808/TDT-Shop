package doantotnghiep.example.DoAnTotNghiep.Repository;

import doantotnghiep.example.DoAnTotNghiep.Entity.Categories;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class CategoryRepositoryCustomImpl implements CategoryRepositoryCustom {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    @SuppressWarnings("unchecked")
    public List<Categories> findParentCategories() {
        String sql = "SELECT * FROM categories WHERE parent_id IS NULL ORDER BY id ASC";
        Query query = entityManager.createNativeQuery(sql, Categories.class);
        return (List<Categories>) query.getResultList();
    }
}
