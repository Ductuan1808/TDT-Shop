package doantotnghiep.example.DoAnTotNghiep.Repository;

import doantotnghiep.example.DoAnTotNghiep.Entity.Products;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Products, Long>, ProductRepositoryCustom {

}
