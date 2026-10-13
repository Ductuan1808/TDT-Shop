package doantotnghiep.example.DoAnTotNghiep.Repository;

import doantotnghiep.example.DoAnTotNghiep.Entity.ProductCategoryId;
import doantotnghiep.example.DoAnTotNghiep.Entity.Product_categories;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface ProductCategoryRepository extends JpaRepository<Product_categories, ProductCategoryId> {


}
